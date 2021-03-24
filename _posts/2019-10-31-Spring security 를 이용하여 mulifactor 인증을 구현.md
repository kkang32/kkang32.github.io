---
layout: post
title: Spring security 를 이용하여 mulifactor 인증을 구현
categories: java spring springsecurity
tags: java spring springsecurity
---

## Spring security 를 이용하여 mulifactor 인증을 구현

### Multi factor Authentication(MFA)

> 사용자의 신원을 확인하는 방법에 따라 지식기반 인증, 소유기반 인증, 속성기반 인증의 3가지의 카테고리로 나누어 지는데 이를 ‘인증 팩터(Authentication Factor)라고 합니다.
>
> | **Factor****의 구분** | **설명**                                 | **적용 예**                                                  |
> | --------------------- | ---------------------------------------- | ------------------------------------------------------------ |
> | 지식기반(Knowledge)   | 사용자만 알고 있는 것“What you know”     | – 패스워드, PIN코드, 미리 설정해놓은 질문답변 등             |
> | 소유기반(Possession)  | 사용자만 소유하고 있는 것“What you have” | – 휴대폰 SMS인증, 보안카드, OTP 등– 공인인증서, 스마트폰, 스마트카드, USB토큰, 기타 하드웨어키 등 |
> | 속성기반(Inherence)   | 사용자만의 고유한 속성“What you are”     | – 지문인식, 홍채인식, 정맥인식, 얼굴인식 등                  |
>
> 가장 많이 사용하는 ID/PW 인증은 ‘알고 있는 정보’이므로 지식기반 팩터에 해당합니다. 휴대폰 잠금을 해제할 때 입력하는 PIN코드나 사전에 설정해놓은 질문답변 등도 이에 해당하며, 가장 손쉽고 편리하게 사용 가능하지만 유출되기도 가장 쉽다는 단점이 있습니다.
>
> 소유기반의 팩터는 사용자가 ‘가지고 있는 것’을 통해 인증하는 있는 방법으로, 휴대폰 SMS인증, OTP, 스마트카드, USB토큰 등이 있습니다. 소유기반 인증을 적용할 경우 물리적으로 도난을 당할 수 있으며, 본인일지라도 인증 시 소유하고 있지 않으면 인증할 수 없는 것이 단점입니다.
>
> 사람의 고유한 속성을 기반으로 하는 인증은 생체인증(Biometrics) 방식에 해당하며, 대표적인 지문인식 외에도, 홍채인식, 얼굴인식 등 새로운 기술이 계속 발전하고 있습니다. 편리하지만 인식에 오류가 발생할 수 있으며 추가적인 장치가 필요합니다. 또한 생체인증 정보는 변경이 불가능하므로 정보가 탈취될 경우 가장 큰 피해를 입을 수 있습니다.
>
> 네이버 개인정보보호 블로그 https://m.blog.naver.com/n_privacy/221131898198

 

### Spring security 에서의 MFA

##### 요건

- MFA를 구현하되 사용자가 원하는 형태로 제공되어야 한다.
- 단일페이지 또는 페이지를 이동해가며 인증을 수행하는 형태 모두를 제공해야 한다.

##### 흐름도

1. 로그인 페이지 -> 2. ID/PW 입력후 로그인 시도 -> 3. authentication-manager 에서 첫번째 인증 처리 -> 4. 첫번째 인증 성공 flag저장 -> 5. loginSuccessHandler -> 6. 두번째 인증 페이지로 redirect -> 7. 인증 수행 -> 8. authentication-manager 에서 두번째 인증 처리 -> 9. 두번째 인증 성공 flag저장 -> 10. loginSuccessHandler -> 11. 목적 페이지로 이동

성공 flag저장은 사용자 인증정보와 함께 보관될 수 있는 userDetails나 session등에 저장한다. 3과 4 사이에서 내부적인 인증은 완료가 되어 SecurityContextHolder는 생성되어진다.

##### 고려사항

- 1번째 인증만 하고 그다음 인증을 진행하지 않고 페이지에 접근하고자 할 때
  - 이미 SecurityContextHolder가 만들어진 상태이므로 Spring security상에서는 인증이 된 사용자이다. 다만 2번째 인증이 되지 않았으므로 해당 로직을 처리해줄 부분이 필요하다
  - access decision manager를 커스터마이징 하여 모든 인증을 완료하였는지 체크하는 로직이 추가되어야 한다. 인증이 모두 마무리 되지 않은 사용자는 access denied handler에서 적절한 인증페이지로 redirect시켜준다.
- spring security 가 적용된 페이지에 접근시 어떤 단계의 인증으로 redirect시켜줄지 판단해야 한다.
  - entry-point 를 커스터마이징 하여 각 인증단계별로 redirect시켜주는 로직을 추가한다.
  - 2번째 이후의 인증을 처리하지 않고 별도 페이지에 접근 하고자 할 때 어느 로그인 단계로 이동 시켜 줄 지는 커스텀된 entry-point에서 처리해준다.
- 2FA뿐 아니라 3FA등 확장 가능 한 형태로 만들어 져야 한다. 그리고 각 단계는 프로젝트 특성에 맞게 customizing할 수 있어야 한다.
  - authenticationProvider를 재정의하여 각 단계를 list형태로 입력 받을 수 있도록 한다.
- 단일 페이지에서 작업되는 app의 경우에 대한 처리
  - 페이지 이동이 불가 하므로 응답데이터를 화면단에 내려줄 수 있는 형태도 지원해야 한다.
  - loginSuccessHandler에서 전송 되도록 한다.
- 사용자의 ID, PW외에 추가인증을 수행할 수 있도록 parameter를 받아야 한다.
  - 한 페이지에서 MFA를 수행 하거나 여러 페이지에서 인증을 수행하는경우 모두 authenticationProvider 에서 인증을 수행하게 된다.
  - 이경우 detailsSource의 정보를 얻어야 하는데 기본적으로 제공되는 형태는 ID/PW밖에 받지 못하게 되어있다. 그러므로 모든 데이터를 처리할 수 있도록 하기위해서 request를 제공해주어야 한다.
- 구간 암호화
  - https로 처리 되도록 한다.

**단일 페이지 MFA**

- Authentication Provider를 상속 받아 재구현한다.
- authentication manager에 등록하기만 하면 된다.
- 이 방법은 인터넷 검색시 많이 나오는 방법이다.

**여러페이지 MFA**

- 별도로 소스는 올리지 않고 구현한 내용은 말로 설명하도록 한다.
- spring security filter chain을 이해하고 있다면 아래 설명이 대략적인 힌트가 될 것 같다.

- 인증받아야 하는 Authentication token들을 정의한 인증 목록 bean을 생성한다.
- Custom filter에서 생성 된 bean과 현재 인증된 authentication token상의 내용을 비교하여 인증이 완료 되었는지 체크한다.
- 인증이 모두 완료 되지 않았는데도 페이지에 접근하려고 할경우 Access decision manager에서 voter를 최상단에 추가하여 현재 authentication token과 인증 목록 bean을 비교하여 Exception 을 발생시켜준다.
- 추가 요소는 인증 목록bean 하나 이며, AuthenticationProvider, AccessDecisionVoter<FilterInvocation> 를 상속/구현하면 된다.
- Authentication provider에서 추가 입력 정보를 얻어올경우 request에서 꺼내야 하는데 ((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest(); 에서 request를 사용한다.
- 추가 Voter구현시 Exception처리를 해서 최종적으로 Entry-point로 이동시키는 과정에서 Exception Translate filter에서는 Exception 발생시 authentication을 null처리 하게 되어있다. 그렇기 때문에 인증 토큰 비교시 null이발생하므로 첫단계부터 다시 로그인을 수행해야 하는 상황이 발생할 수 있으니 이점을 유의해야 한다.
- 각 단계 로그인 성공시 success handler를 통하게 되는데 이곳에서 다음에 인증할 페이지를 결정하는것은 인증목록bean에서 정의하여 인증 토큰과 비교한 후 사용하도록 한다.