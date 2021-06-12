---
layout: post
title: Spring webflux security 적용기
categories: java spring springsecurity
tags: java spring springsecurity springwebflux
---

# spring webflux 에 spring security 적용기

- `@EnableWebMvc` and `@EnableWebFlux`
   - 같은 application에서 동시에 사용 할 수 없다.

- 설정파일의 condition을 적용하는 과정에서 @ConditionalOnWebApplication을 사용할 수 있다.
  Type.Servlet, Type.Reactive 로 구분지을 수 있는데 기본은 ANY 이다.
  둘의 구분은
  Servlet : org.springframework.web.context.support.GenericWebApplicationContext
  Reactive : org.springframework.web.reactive.HandlerResult
  클래스의 존재 유무이다.

- webflux의 경우 context-path설정을 할 수 없다. filter에서 한다거나 requestmapping마다 적어주던가 해야 한다.
  - user details server는 ReactiveuserDetailsService 를 구현해서 bean으로 등록하면 된다.
    ReactiveuserDetailsService 의 구현체는 기본적으로 MapReactiveuserDetailsService 밖에 없으므로 database에서 읽어오는 방식으로 재구현한다.
    - 패스워드 인코더를 bean으로 만들어 주지 않으면 unmapping....어쩌구 패스워드 인코드가 설정 된다.
      - 그러므로 패스워드 PasswordEncoder인터페이스를 구현체를 하나 bean으로 등록해주어야 한다.
- entry point는 ServerAuthenticationEntryPoint 인터페이스 구현체에서 담당한다.
  - 기본적으로 RedirectServerAuthenticationEntryPoint 가 설정된다.
  - 설정시 http.formLogin() 을 설정하면 FormLoginSpec이 설정되고 별다른 추가설정이 없을 경우 configure에서 로그인 페이지를 셋팅해준다.(/login) 

- FormLoginSpec(formLogin())에서 login success handelr, failure handler, entry point등을 설정한다 authenticationmanager도 여기서 설정한다.

- 로그인페이지를 생성해주는 loginPagespec은 기본으로 설정 된다.(로그아웃 페이지도 자동으로 생성한다.)
  - entry point가 정의되어있다면 웹페이지를 생성하지 않고 종료한다.
  - loginPage() 로 사용자가 명시적으로 페이지를 지정하면 default entry point로 redirectAuthenticationEntryPoint가 설정되며 이때에는 로그인 페이지를 자동으로 생성하지 않는다.(사용자가 직접 생성해 주어야 한다. 마찬가지로 로그아웃 페이지도 사용자가 직접 만들어 주어야 한다.)
    	


## Authorization

### as-is

 - filter security interceptor에서 처리한다.
	- ReloadableFilterInvocationSecurityMetadataSource에 정의된 SecuredUrlResourceService 으로부터 url과 method, role정보를 모두 얻어온다. 
	url과 httpmethod정보가 담긴 RequestMatcher가 key이다(SerializableAntPathRequestMatcher 에서 만들어줌)
		- 나중에 비교는 role 만 비교한다.

	- 이후에 ReloadableFilterInvocationSecurityMetadataSource에서 getAttributes 를 반환해 줄 때 현재 request와 매칭되는 attribute만 반환한다.(url과 method비교)
		- 그렇기 때문에 현재 request된 url과 매칭되는 url이 없을 경우 null이 반환된다.
		- beforeInvocation 에서 getAttributes가 null 일경우 아래와 같은 로직이 수행된다.
			rejectPublicInvocations 값에의해 무조건 url을 설정하게 되어있으면 exception이 발생한다.
	흐름도 : 
	ReloadableFilterInvocationSecurityMetadataSource 
		->SecuredUrlResourceService 
			-> DB조회 
			-> URL, method, 권한 가져옴. 
				-> SerializableAntPathRequestMatcher를 통해 RequestMatcher를 만들고 map에 저장. 
			-> Attribute반환
		-> getAttributes 에서 현재 request 와 비교하여 매칭되는 attribute만 반환(nullable)
- 버튼 권한 목록을 반환하는 SecurityService의 경우 내부에서 servlet과 ReloadableFilterInvocationSecurityMetadataSource 을 사용하고 있다. 
	
### to be

- ReloadableFilterInvocationSecurityMetadataSource를 재사용하지못한다.(이하 파생 class들 모두 servlet을 사용하고 있음.)
  - 같은 역할을 하는 클래스를 새로 만든다.
  -  tagLib는 webflux에서 사용되지 않는다(jsp에서 동작하므로 서블릿 기반 기능임)
  


- SecurityService : interface로 변경하고 기존 클래스는 구현체로 변경하고 이름을 바꾼다. (servlet과 webflux용으로 구분짓기 위함임.)

- ReloadableFilterInvocationSecurityMetadataSource : 새로 만든다.

- SecuredUrlResourceService : 이름을 바꿔 abstract화 하고 SerializableAntPathRequestMatcher를 가져오는 부분을 별도로 구현하도록 하고 SecuredUrlResourceService 이름으로 재작성해서 기존 캐모마일에서 쓸 수 있도록 한다.
	- RequestMatcher를 사용하지 못한다. -> ServerWebExchangeMatcher으로 대체
		- PathPatternParser 사용 : AntPathMatcher의 대안
		- 자세한 설명은 https://www.baeldung.com/spring-5-mvc-url-matching
	
- 예제 코드

   ```java
   private final PathPattern pathPattern;

   		public AuthenticationFilter() {
			pathPattern = new PathPatternParser().parse("/api/product");
   		}
   	
   		@Override
   		public Mono<Void> filter(ServerWebExchange serverWebExchange,
   							 WebFilterChain webFilterChain) {
   		final ServerHttpRequest request = serverWebExchange.getRequest();
   	
   			if (pathPattern.matches(request.getPath().pathWithinApplication())) {
   			   // logic to allow or reject the processing of the request
   			}
   		}
   	- 기존 패턴중 ** 는 /**으로 변경해야 한다.
   ```



인증시 세션 고정공격 방어의 목적으로 세션값을 강제로 바꾼다.
이전에는 옵션이었으나 무조건 변경하는것으로 바뀌었다.(WebSessionServerSecurityContextRepository)
만약에 aop로 각 단계에 대해 계층정보를 기록하는 기능을 구현 했다면 아래의 내용을 고려해야 한다.

각 담당별  aop시 아래와 같이 동작 했었다.

------

controller pre AOP : 계층 정보 기록 ()
	controller 
		service pre AOP : 계층 정보기록(1-)
		-> Service
			dao pre AOP : 계층 정보기록(1-1-)
			-> DAO
			dao post AOP : 계층정보기록 (1-1-1) - DB입력
		service post AOP : 계층정보기록(1-1) - DB입력
controller post AOP : 계층 정보 기록(1) - DB입력

------

하지만 reactive에 와서는 위와같이 계층적으로 동작하지 않는다.
아래와 같이 R2DBC환경하에서 별도 스레드로 DAO가 동작하기 때문에 Controller와 Service로직은 이미 수행이 다되고 MDC계층도 controller의 post AOP에 의해 이미 초기화 된 후에 DAO가 실행이 된다.
그렇기 때문에 DAO의 경우 처음 시작하는것으로 인식이 되고 계층 정보는 (2)로 입력이 된다.

-----
Controller 
	-> Service
종료
DAO 실행
종료

------
