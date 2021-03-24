---
layout: post
title: spring security로 saml인증 하기(개요)
categories: java spring springsecurity saml
tags: java spring springsecurity saml
---

# spring security로 saml인증 하기(개요)

2019년 10월 10일 [kkang32](http://www.thevruk.com/?author=1) [의견 작성하기](http://www.thevruk.com/?p=317#respond)

## 정의

**SAML (Security Assertion Markup Language)**

인증정보제공자(identity provider)와 서비스제공자(service provider 간의 인증 및 인가 데이터를 교환하기 위한 XML 기반의 개방형 표준 데이터 포맷이다. (OASIS의 보안서비스기술 위원회의 산물이다.)

SAML 2.0은 2005년에 표준으로 지정 되었으며, SSO(Single Sign-On)을 구현하는 방법이며, SSO는 SAML 의 가장 일반적인 사용사례이다.

- SAML 1.0은 2002년 11월 OASIS 표준으로 채택되었다
- SAML 1.1은 2003년 9월 OASIS 표준으로 승인되었다
- SAML 2.0은 2005년 3월 OASIS 표준으로 되었다
- [https://www.oasis-open.org/committees/download.php/20645/sstc-saml-tech-overview-2%200-draft-10.pdf](https://www.oasis-open.org/committees/download.php/20645/sstc-saml-tech-overview-2 0-draft-10.pdf)

 

**SAML의 이점**

- 암호 피로(Password fatigue) 감소
  - 다양한 사이트의 암호를 외워야 하는 정신적 피로도 감소
- 인증 위임
  - 다수의 Service Provider와 단 하나의 IdP 간의 CoT를 생성하여 IdP로 인증 위임되므로 사용자는 단 한번의 로그인으로 다수의 Service Provider를 사용할 수 있음
- 안전한 인증정보의 보호
  - IdP, SP, 사용자 사이에서 교환되는 인증정보를 암호화
- 개인 생산성 향상
  - 지속적으로 패스워드를 입력하는 과정이 생략되고, 패스워드 재설정 및 복구과정이 필요치 않음

 

**SAML** **주요용어**

- Client (User)

  - 사용자이며, 웹브라우저 혹은 단말이 대상이 된다.

- Service Provider

  - 서비스 제공자이며, 일반적으로 클라이언트가 접근하려는 애플리케이션 또는 서비스이다.

- Identity Provider(IdP)

  - 인증정보제공자이며, 사용자 크리덴셜 (사용자명과 패스워드)을 인증하고 SAML Assertion을 발행한다.

- SAML Assertion

  - 사용자 인증을 위해 IdP로 부터 SP로 전달되는 보안 정보
    사용자명, 권한 등의 내용을 적은 XML 문서로 변조를 막기위해 전자서명됨

- SAML Request (

  인증 요청)

  - Service Provider 가 생성하는 인증 요청으로 IdP로 인증 위임

- Circle of Trust (CoT)

  - 하나의 IdP를 공유하는 Service Provider 들로 구성

- Metadata

  - SSO를 활성화하는 Service Provider 및 IdP 가 생성하는 XML 파일
    웹 application의 경우 프로비저닝(서비스 구동시)시에 SP와 IdP간 메타데이타의 교환으로 신뢰 관계 설립
  - 기본적으로 아래와 같은 정보를 교환한다.
    - Entity ID
    - 암호화 키
    - 프로토콜 Endpoint (실제 주소)
  - **Assertion Consumer Service (ACS) URL**
    ACS URL은 IdP가 특정 URL로 최종 SAML 응답을 포스트하도록 요구한다.

참고 : https://www.nexpert.net/606 , https://docs.spring.io/autorepo/docs/spring-security-saml/1.0.x-SNAPSHOT/reference/htmlsingle/#glossary

**SAML 기반 인증과정**

1. 브라우저에서 SP에 접속을 한다.
2. SP에서는 사용자 인증여부를 검토하고(세션/쿠키) 인증되어있지 않을경우 인증요청(SAML request)을 생성하여 사용자에게 전송한다.
3. 전송된 정보를 바탕으로 브라우저에서 IdP로 redirection시킨다.
4. 사용자는 IdP사이트에서 로그인을 시도한다.
5. 로그인이 성공한경우 IdP에서 세션을 생성하고 SAML response를 브라우저에 보낸다.
6. response된 SAML assertion데이터를 SP에 보낸 후 SP에서도 세션을 복제하여 생성한다.
   SAML assertion에는 아래의 내용이 포함된다.(http://saml.xml.org/assertions 또는, [https://www.oasis-open.org/committees/download.php/20645/sstc-saml-tech-overview-2%200-draft-10.pdf](https://www.oasis-open.org/committees/download.php/20645/sstc-saml-tech-overview-2 0-draft-10.pdf) (17page쯤))
   – 인증 : 인증된 시간 및 인증 수단 정의
   – 속성 : 인증된 사용자의 정보(이름, 이메일정보)
   – 승인 결정 : 승인 여부에 대한 정보

## Spring security 에 SAML인증

아래 사이트에 있는 sample을 기반으로 saml 인증의 흐름도를 나타내었다.([https://www.draw.io](https://www.draw.io/))

https://github.com/spring-projects/spring-security-saml (1.0.8 기준임(https://github.com/spring-projects/spring-security-saml/tree/1.0.8.RELEASE))

 

![img](/assets/images/2019-10-10-pring security로 saml인증 하기(개요).assets/saml.png)

Spring security의 FIRST필터에서 MetadataGenerator가 실행이 된다. 이 부분이 위 설명에서 언급한 프로비저닝 단계이다. SP 와 IdP간의 신뢰관계를 만드는 부분이다.

SAML에서 메타데이터는 신뢰관계를 증명하는 시스템 파일이다. ID 제공자와 서비스제공자는 메타데이터를 사전에 교환해야 서로 통신이 가능하다. 아래 표는 서비스제공자에서 메타데이터를 생성하는 방법을 보여준다. 생성된 메타데이터는 수동/자동으로 상대 ID 제공자에 게 전달되어야 한다.

– SP 메타데이터를 설정하기 위해서 WEB-INF 폴더의 context-security.xml 파일을 수정한다.

```xml
<bean id="metadataGeneratorFilter" class="org.springframework.security.saml.metadata.MetadataGeneratorFilter" >
    <constructor-arg>
        <bean class="org.springframework.security.saml.metadata.MetadataGenerator" >
            <property name="entityId" value="http://localhost:8080/saml/sp" />
            <property name="extendedMetadata" >
                <bean class="org.springframework.security.saml.metadata.ExtendedMetadata" >
                    <property name="signMetadata" value="false" />
                    <property name="idpDiscoveryEnabled" value="true" />
                </bean>
            </property>
        </bean>
    </constructor-arg>
</bean>
```



SP Entity ID 설정

– entityId: 서비스제공자 또는 ID 제공자의 고유식별자로써 중복될 수 없으며 임의의 문자열로 설정이 가능하다. Spring 기반의 서비스제공자인 경우, 다음과 같은 표기 규정을 권고함
http://DOMAIN_NAME:PORT_NUM/sp/spring-security-saml2
– 최종적으로 구현될 서비스제공자는 반드시 HTTPS를 지원해야 한다. entityId도 https를 반영해야 한다.(검토필요 -> 반드시 해야 하는것은 아니지만 saml 메시지를 주고받는 행위에 있어서 암호화가 필요하다)
– signMetadata 값은 메타데이터의 서명 여부를 나타낸다. 기본은 false이다.
– idpDiscoveryEnabled 값은 탐색서비스(Discovery service)의 이용 여부를 나타낸다. 구현하는 서비스제공자에게 다수의 ID 제공자가 연동될 때에는 탐색서비스를 이용해야한다.

samlEntryPoint에서는 사용자의 인증정보를 확인해서 sso로그인 사이트로 이동할지, 아니면 정상적으로 서비스가 이용이 가능한지 판단을 한다. 세션정보는 브라우저에 캐시된 정보를 가지고 확인을 하며 인증정보가 없다면 sso 로그인 페이지로이동을 시킨다.
IdP에서 로그인 후 SP로 돌아왔을때에는 authentication-manager에서 Response데이터를 처리하게 된다.

BASIC_AUTH_FILTER에서는 아래와 같이 처리된다.
– samlEntryPoint : 로그인 상태를 체크하며 로그인 폼화면으로 이동시켜주는 역할
– samlLogoutfilter : LogoutRequest를 IDP로 보내기 전에 호출
– metadataDisplayFilter : SP와 IdP에 대한 메타 정보를 출력
– samlWebSSOProcessingFilter : WebSSOProfile에 위임하여 도착하는 SAML 메시지를 처리. SAMLAuthenticationToken을 얻은 후 인증 공급자에게 이를 인증하도록 요청
– samlWebSSOHoKProcessingFilter : WebSSO 소유자 키 프로파일의 일부로 IDP에서 보낸 메시지를 처리
– samlLogoutProcessingFilter : 싱글 로그 아웃 프로세스가 완료된 후 (IDP에서 LogoutResponse를 수신 한 후) 호출, LogoutProfile에 위임하여 도착한 SAML 싱글 로그 아웃 메시지를 처리
– samlIDPDiscovery : 사용자에게 IDP 선택 페이지를 제공한다. metadata에서 idpdiscovery옵션이 false로 되어있을경우 기본적으로 설정된 idp로 채택이 되지만 idp가 여러개 존재할경우 true로 설정해야 한다.(https://medium.com/@sagarag/reloading-saml-idp-discovery-693b6bff45f0) (https://docs.spring.io/spring-security-saml/docs/current/reference/html/configuration-sso.html)

## Spring security filter chain

saml인증을 적용하기전에 spring security의 filter chain에 대해 이해 해야 한다.

Spring security는 사용자의 요청을 DelegatingFilterProxy에서 가로채어 처리한다.(web.xml에 설정된다.)

```xml
<filter>
  <filter-name>springSecurityFilterChain</filter-name>
  <filter-class>org.springframework.web.filter.DelegatingFilterProxy</filter-class>
</filter>
<filter-mapping>
  <filter-name>springSecurityFilterChain</filter-name>
  <url-pattern>/</url-pattern>
</filter-mapping>
```



처리는 Spring security bean들이 처리하게되는데 이때 처리되는 각 단계별로 필터가 적용되어있다.
여기에 설정된 필터들이 여러 필터들로 구성되어있어 filter chain으로 표현이 된다.
아래는 filter chain에 대한 예시를 나타낸 그림이다.(https://atin.tistory.com/590)

![img](/assets/images/2019-10-10-pring security로 saml인증 하기(개요).assets/filterchain.png)

- 필터와 순서는 아래와 같다.(https://docs.spring.io/spring-security/site/docs/3.1.x/reference/ns-config.html)

| Alias                        | Filter Class                                         | Namespace Element or Attribute           |
| :--------------------------- | :--------------------------------------------------- | :--------------------------------------- |
| CHANNEL_FILTER               | `ChannelProcessingFilter`                            | `http/intercept-url@requires-channel`    |
| SECURITY_CONTEXT_FILTER      | `SecurityContextPersistenceFilter`                   | `http`                                   |
| CONCURRENT_SESSION_FILTER    | `ConcurrentSessionFilter`                            | `session-management/concurrency-control` |
| LOGOUT_FILTER                | `LogoutFilter`                                       | `http/logout`                            |
| X509_FILTER                  | `X509AuthenticationFilter`                           | `http/x509`                              |
| PRE_AUTH_FILTER              | `AstractPreAuthenticatedProcessingFilter` Subclasses | N/A                                      |
| CAS_FILTER                   | `CasAuthenticationFilter`                            | N/A                                      |
| FORM_LOGIN_FILTER            | `UsernamePasswordAuthenticationFilter`               | `http/form-login`                        |
| BASIC_AUTH_FILTER            | `BasicAuthenticationFilter`                          | `http/http-basic`                        |
| SERVLET_API_SUPPORT_FILTER   | `SecurityContextHolderAwareRequestFilter`            | `http/@servlet-api-provision`            |
| JAAS_API_SUPPORT_FILTER      | `JaasApiIntegrationFilter`                           | `http/@jaas-api-provision`               |
| REMEMBER_ME_FILTER           | `RememberMeAuthenticationFilter`                     | `http/remember-me`                       |
| ANONYMOUS_FILTER             | `AnonymousAuthenticationFilter`                      | `http/anonymous`                         |
| SESSION_MANAGEMENT_FILTER    | `SessionManagementFilter`                            | `session-management`                     |
| EXCEPTION_TRANSLATION_FILTER | `ExceptionTranslationFilter`                         | `http`                                   |
| FILTER_SECURITY_INTERCEPTOR  | `FilterSecurityInterceptor`                          | `http`                                   |
| SWITCH_USER_FILTER           | `SwitchUserFilter`                                   | N/A                                      |

- 재정의 방법

```xml
<http ...>
 <custom-filter ref="생성한필터Bean" 위치지시자="위치Alias" />
</http>
```


- 위치 지시자

before : 위치 Alias보다 앞에
after : 위치 Alias보다 뒤에
position : 해당 위치에 있는 필터 대체(auto-config=”false” 옵션을 주어 모든것을 개발자가 직접 설정해 주어야 함)

- 추가 위치 alias

FIRST : 맨 앞
LAST : 맨뒤

참고 : https://sjh836.tistory.com/165, https://kwonnam.pe.kr/wiki/springframework/security/customfilter