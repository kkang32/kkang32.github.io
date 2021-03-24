# spring security로 saml인증 하기(샘플프로젝트 테스트)

2019년 10월 10일 [kkang32](http://www.thevruk.com/?author=1) [의견 작성하기](http://www.thevruk.com/?p=331#respond)

### 사전 작업

##### IdP서비스 가입

IdP서버로 테스트할 ssocircle사이트에 가입한다.
https://idp.ssocircle.com/sso/UI/Login 에 접속하여 new user로 사용자 등록을 한뒤 이메일로 인증을 수행한다.

##### 소스는 아래 주소에 있는 소스를 기준으로한다. https://github.com/spring-projects/spring-security-saml/tree/1.0.8.RELEASE

### SP <-> IdP간 인증작업

##### 1. securityContext.xml수정

```xml
<bean id="metadataGeneratorFilter" class="org.springframework.security.saml.metadata.MetadataGeneratorFilter" >
    <constructor-arg>
        <bean class="org.springframework.security.saml.metadata.MetadataGenerator" >
            <property name="entityId" value="[유니크한값으로설정]" />
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



##### 2. 인증서 생성

sampleKeystore.jks파일이 있는곳으로 이동한다.(spring-security-saml-master\spring-security-saml-master\sample\src\main\resources\security)

아래의 명령어로 인증서를 생성한다.

1. keytool -genkey –alias [인증서명] -validity 3650 -keyalg RSA -sigalg SHA256withRSA -keysize 2048 -keystore samlKeystore.jks –keypass [인증서 암호] -storepass [keystore 암호] -dname "CN=[도메인명 or IP 주소],OU=[부서명],O=[조직명],L=[위치],S=[도시],C=[국가명]"

e.g.

1. keytool.exe -genkey -alias samlkey -validity 3650 -keyalg RSA -sigalg SHA256withRSA -keysize 2048 -keystore samlKeystore.jks -keypass samlpass -storepass nalle123 –dname "CN=ldcc.co.kr,OU=rnd,O=rnd,L=gasan,S=seoul,C=KR"

잘 만들어 졌는지는 아래 명령어로 확인

1. keytool.exe -list -keystore samlKeystore.jks -v -alias samlkey

##### 3. IdP 의 인증서를 SP key store에 등록한다.

인증을 시도할 사이트인 ssocircle사이트에서 아래와 같이 서명 부분을 복사해서 인증서 파일로 만든다.(https://www.ssocircle.com/en/idp-tips-tricks/public-idp-configuration/)

![img](/assets/images/2019-10-10-spring security로 saml인증 하기(샘플프로젝트 테스트).assets/cert.png)

이후 samlKeystore.jks파일이 있는 곳으로 가서 인증서를 import시킨다.

1. keytool -importcert -keystore samlKeystore.jks -storepass [비밀번호] -alias [alias명] -file [인증서파일명]

3. keytool -importcert -keystore samlKeystore.jks -storepass nalle123 -alias ssocircle -file ssocircle.crt

##### 4. SP 메타데이터생성

sample프로젝트를 구동시켜 SP메타데이터를 얻는다. 구동시 SSL관련 문제로 xsd파일을 못읽어오는 현상이 발생하게되면 해당 파일의 주소를 https에서 http로 변경해보면 된다.
ssocircle주소도 https에서 http로 변경하면 정상적으로 구동이 된다.
구동된 app의 context-path이후 주소를(/saml/metadata) 입력하면 SP의 메타데이터가 다운로드 된다.
e.g. http://localhost:8080/spring-security-saml2-sample/saml/metadata
다운받아진 메타 데이터에서 AttributeConsumingService, RequestedAttribute 등으로 IdP로 부터 추가 요청사항을 추가할 수 도 있다.(IdP에서 제공해 줄 경우)

##### 5. 만들어진 메타데이터를 IdP에 등록한다.

ssocircle사이트의 Manage Metadata나 https://idp.ssocircle.com/sso/hos/ManageSPMetadata.jsp 에 접속하여 Add new Service Provider 항목을 클릭하여 SP를 등록한다.
입력시 FQDN과 entityID 를 정확히 확인한다.
FQDN의 경우 도메인의 full 경로를 나타낸다. 가령 www.google.com, google.com등으로 사이트에 접속할 수 있다면 www.google.com으로 등록해야 한다.
entityID의 경우 유니크 해야 한다. 구분자로서 사용되기 때문에 예제로 생성된 localhost:8080등은 에러가 발생하며 등록되지 않으니 다른구분자로 등록한다.(도메인 주소가 아니여도 좋다)
entityID는 메타데이터 생성 후 수정하게되면 정상적으로 동작하지 않고 설정파일에서 수정 후 구동시킨다음 생성해야 한다.

##### 6. 확인

http://localhost:8080으로 접속하면(context-path가 / 로 설정되어있다는 가정하에) 바로 ssocircle화면으로 redirect되는것을 확인할 수 있다.여기서 로그인을 하게 되면 아래와 같이 인증이 성공했음을 알리고 최초 요청한 페이지로 이동 한다.

![img](/assets/images/2019-10-10-spring security로 saml인증 하기(샘플프로젝트 테스트).assets/auth.png)

http://localhost:8080 으로 넘어가게 되고 아래와 같이 인증 정보가 표시되는 메인페이지가 나타나면 성공이다.

![img](2019-10-10-spring security로 saml인증 하기(샘플프로젝트 테스트).assets/success.png)

### 인증 값 얻어오기

index.jsp를 열어보면 각종 정보들을 어떻게 얻어오는지 알 수 있다.

인증정보는 아래와 같이 SecurityContextHolder를 통해 얻어 온다.

```java
Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
SAMLCredential credential = (SAMLCredential) authentication.getCredentials();
```



authentication 에서는 name, principal등의 정보를 얻을 수 있다
credential은 인증 중에 SAML2 응답에서 구문 분석 된 엔티티들이 저장된다. 인증 성공후에 response된 값들이 저장된다. 특히 authenticationAssertion 에서는 IdP에서 발행한 각종 정보들이 담겨있다.



### 참고

샘플프로젝트의 스프링버전은 3.1버전으로 오래된 버전이다.
5.x로 넘어가기 전인 4.3.x버전으로 사용하기위해서는 아래와 같은 설정이 필요하다.
5.x로 넘어가는 경우 혹은, java기반으로 셋팅하고자 할경우 2.x버전의 sample을 참고한다.

MetadataForm 클래스 직렬화

```java
public class MetadataForm implements Serializable {

private static final long serialVersionUID = 1L;
```





의존성 추가 및 버전 변경

```xml
<properties>     
    <spring.framework.version>4.3.18.RELEASE</spring.framework.version>
    <spring.security.version>4.2.7.RELEASE</spring.security.version>
</properties>
```



groupid가 org.springframework인 것들은 버전을spring.framework.version으로 적용하고 org.springframework.security 로 되어있는 dependency는 spring.security.version으로 버전을 적용한다.
또한 spring security 관련 dependency를 몇가지 더 추가해 준다.

```xml
<dependency>
      <groupId>org.springframework.security</groupId>
      <artifactId>spring-security-core</artifactId>
      <version>${spring.security.version}</version>
</dependency>
<dependency>
      <groupId>org.springframework.security</groupId>
      <artifactId>spring-security-web</artifactId>
      <version>${spring.security.version}</version>
 </dependency>
```



securityContext.xml, saml-servlet.xml파일에 있는 namespace정의 경로도 최신 버전(혹은 버전 제거)으로 변경한다.

------

참고사이트 :
https://docs.spring.io/spring-security-saml/docs/current/reference/html/chapter-quick-start.html
https://www.kafe.or.kr/attach/filedownloads/do_down/no/470