---
layout: post
title: JMeter BackendListener
categories: java jmeter
tags: java jmeter
---

# JMeter BackendListenerClient

- JMeter에서 실행할 수있는 BackendListener와 외부 Java 프로그램 간의 상호 작용을 정의합니다.
- BackendListener 테스트 요소를 사용하여 실행하려는 Java 클래스는이 인터페이스를 구현해야합니다 (가급적이면 AbstractBackendListenerClient를 통해 구현)
- JMeter는 테스트의 각 사용자 / 스레드에 대해 BackendListenerClient 구현의 하나의 인스턴스를 생성합니다. 
- 테스트가 시작되면 각 스레드의 BackendListenerClient 인스턴스에서 setupTest ()가 호출되어 클라이언트를 초기화합니다. 그런 다음 각 SampleResult 알림에 대해 handleSampleResult ()가 호출됩니다. 마지막으로 클라이언트가 필요한 정리를 수행 할 수 있도록 teardownTest ()가 호출됩니다.
- JMeter BackendListener GUI를 사용하면 테스트를 위해 매개 변수 목록을 정의 할 수 있습니다. 이들은 BackendListenerContext를 통해 다양한 테스트 메소드로 전달됩니다. 기본 매개 변수 목록은 getDefaultParameters () 메소드를 통해 정의 할 수 있습니다. 이러한 매개 변수 및 이와 연관된 모든 기본값은 GUI에 표시됩니다. 사용자는 다른 매개 변수도 추가 할 수 있습니다.
- 가능하면 리스너는 BackendListenerClient를 직접 구현하는 대신 AbstractBackendListenerClient를 확장해야합니다. 이렇게하면 향후 인터페이스 변경으로부터 테스트를 보호 할 수 있습니다.

## dependencies

```xml
<dependency>
    <groupId>org.apache.jmeter</groupId>
	<artifactId>ApacheJMeter_core</artifactId>
	<version>5.1.1</version>
</dependency>

<dependency>
	<groupId>org.apache.jmeter</groupId>
	<artifactId>ApacheJMeter_components</artifactId>
	<version>5.1.1</version>
</dependency>
```

## methods

- **`public Arguments getDefaultParameters()`**

  - 이 테스트가 지원하는 매개 변수 목록을 제공하십시오. 이 메서드에서 반환 된 모든 매개 변수 이름과 관련 값은 기본적으로 GUI에 표시되므로 사용자는 정확한 이름을 기억할 필요가 없습니다. 사용자는 여기에 나열되지 않은 다른 매개 변수를 추가 할 수 있습니다. 이 메서드가 null을 반환하면 매개 변수가 나열되지 않습니다. 일부 매개 변수의 값이 널이면 해당 매개 변수는 빈 값으로 GUI에 나열됩니다.

  - return : GUI에 나열되어야하는 이 테스트에서 사용되는 매개 변수의 사양. 매개 변수가 나열되지 않으면 null입니다.

  - e.g.

    ```java
    @Override
        public Arguments getDefaultParameters() {
    		
    		Arguments args = new Arguments();
    		args.addArgument(ARG_TEST1, ARG_TEST1 + "_sample", ARG_TEST1 + "_meta", ARG_TEST1 + "_desc");
    		args.addArgument(ARG_TEST2, ARG_TEST1 + "_sample", ARG_TEST2 + "_meta", ARG_TEST2 + "_desc");
    		args.addArgument(ARG_TEST3, ARG_TEST1 + "_sample", ARG_TEST3 + "_meta", ARG_TEST3 + "_desc");
    		
            return args;
        }
    ```

    ![image-20201130140935726](2021-04-19-Jmeter BackendListener.assets/image-20201130140935726.png)

- **`public void setupTest(BackendListenerContext context)`**

  - 이 클라이언트에 필요한 초기화를 수행하십시오. 일반적으로 테스트에 가능한 한 적은 오버 헤드를 추가하기 위해 runTest 메서드보다 setupTest 메서드에서 매개 변수 값을 가져 오는 등의 초기화를 수행하는 것이 좋습니다.

  - parameters : 

    - `context` : 이것은 초기화 매개 변수에 대한 액세스를 제공합니다. 컨텍스트는 읽기 전용입니다.

  - e.g.

    ```java
    @Override
        public void setupTest(BackendListenerContext context) throws Exception {
            super.setupTest(context);
            System.out.println("###setupTest start###");
            String param1 = context.getParameter(ARG_TEST1, "");
            String param2 = context.getParameter(ARG_TEST2, "");
            String param3 = context.getParameter(ARG_TEST3, "");
            
            
            System.out.println(param1);
            System.out.println(param2);
            System.out.println(param3);
            System.out.println("###setupTest end###");
            
        }
    ```

    ![image-20201130141516090](2021-04-19-Jmeter BackendListener.assets/image-20201130141516090.png)

    ![image-20201130141532750](2021-04-19-Jmeter BackendListener.assets/image-20201130141532750.png)

- **`public void handleSampleResults(List<SampleResult> listResult, BackendListenerContext context)`**

  - sampleResults를 처리합니다.이 작업은 여러 방법으로 수행 할 수 있습니다.

    - 파일에 쓰기
    - 원거리 서버에 쓰기
    - ...

  - `createSampleResult` 에서 IO작업이 일어나면 테스트 자체도 그 시간동안 멈추기 때문에 이 메서드에서 file IO나 networking작업을 해야 한다.(async queue size 만큼 견뎌 줌)

  - parameters

    - `sampleResults` -[`SampleResult`](https://jmeter.apache.org/api/org/apache/jmeter/samplers/SampleResult.html) 리스트
      - `SampleResult` : 전송량, header정보등 요청/응답의 모든 정보를 확인할 수 있고 시간 정보를 확인할 수 있다.
    - `context`-실행할 컨텍스트. 이것은 초기화 매개 변수에 대한 액세스를 제공합니다.

  - e.g.

    ```java
    public void handleSampleResults(List<SampleResult> listResult, BackendListenerContext context) {
    		System.out.println(">>>>>>>>>>>>>>>>>>>>start handleSampleResults");
    		for (SampleResult result : listResult) {
    			System.out.println(result.toString());
    		}
    		System.out.println(">>>>>>>>>>>>>>>>>>>>end handleSampleResults");
    
    	}
    ```

    ![image-20201130141830403](2021-04-19-Jmeter BackendListener.assets/image-20201130141830403.png)

    ![image-20201130141737239](2021-04-19-Jmeter BackendListener.assets/image-20201130141737239.png)

- **`public void teardownTest(BackendListenerContext context)`**

  - 테스트 실행이 끝날 때 필요한 정리를 수행합니다.

  - parameters

    - `context` : 실행할 컨텍스트. 이것은 초기화 매개 변수에 대한 액세스를 제공합니다.

  - e.g.

    ```java
    @Override
        public void teardownTest(BackendListenerContext context) throws Exception {
            super.teardownTest(context);
            
            System.out.println("###this is tearDownTest. disconnect to @@@@@@ ###");
        }
    ```

    ![image-20201130143642978](2021-04-19-Jmeter BackendListener.assets/image-20201130143642978.png)

- **`public SampleResult createSampleResult(BackendListenerContext context, SampleResult result)`**

  - SampleResult의 복사본을 만듭니다.이 메서드는 복사본에 보관 된 내용을 사용자 정의 할 수 있도록 여기에 있습니다. 예를 들어 copy는 쓸모없는 필드를 제거 할 수 있습니다. null을 반환하면 샘플 결과가 대기열에 포함되지 않습니다. 기본값은 결과 반환입니다.

  - 테스트 결과 이 메서드에서 IO작업이나 DB연결등 시간이 오래걸리는 작업이 발생하면 테스트 자체도 느려진다. 여기에서 뭔가 작업이 이뤄지면 안된다.

  - paramters

    - `context` - [`BackendListenerContext`](https://jmeter.apache.org/api/org/apache/jmeter/visualizers/backend/BackendListenerContext.html)

      `result` - [`SampleResult`](https://jmeter.apache.org/api/org/apache/jmeter/samplers/SampleResult.html)

  - return : [`SampleResult`](https://jmeter.apache.org/api/org/apache/jmeter/samplers/SampleResult.html)

  - e.g.
  
    ```java
    @Override
        public SampleResult createSampleResult(BackendListenerContext context, SampleResult result) {
    		
    		System.out.println("### createSampleResult " + result.toString() + "/" + result.getEndTime());
    		
            return result;
      }
    ```

    
  
    ![image-20201130143709594](2021-04-19-Jmeter BackendListener.assets/image-20201130143709594.png)

### 실행순서

- getDefaultParamter(UI)
- setupTest(1번) -> createSampleResult  -> handleSampleResults -> teardownTest(1번)
  - createSampleResult  의 경우 handleSampleResults 의 listResult 의 개수 만큼 실행된다.





## JMeter에 적용하기

apache-jmeter-5.1.1\lib\ext 폴더에 빌드된 jar파일을 복사하면 자동으로 인식한다.

## JMX

설정한 argument 등은 jmx파일 내 BackendListener 태그에 만들어 진다. 

- 활용 범위 : 웹소켓 주소, redis 주소, DB주소 등..

```xml
<BackendListener guiclass="BackendListenerGui" testclass="BackendListener" testname="Backend Listener" enabled="true">
    <elementProp name="arguments" elementType="Arguments" guiclass="ArgumentsPanel" testclass="Arguments" enabled="true">
        <collectionProp name="Arguments.arguments">
            <elementProp name="test1" elementType="Argument">
                <stringProp name="Argument.name">test1</stringProp>
                <stringProp name="Argument.value">1</stringProp>
                <stringProp name="Argument.metadata">=</stringProp>
            </elementProp>
            <elementProp name="test2" elementType="Argument">
                <stringProp name="Argument.name">test2</stringProp>
                <stringProp name="Argument.value">2</stringProp>
                <stringProp name="Argument.metadata">=</stringProp>
            </elementProp>
            <elementProp name="test3" elementType="Argument">
                <stringProp name="Argument.name">test3</stringProp>
                <stringProp name="Argument.value">3</stringProp>
                <stringProp name="Argument.metadata">=</stringProp>
            </elementProp>
        </collectionProp>
    </elementProp>
    <stringProp name="classname">com.test.CustomBackendListenerClient</stringProp>
</BackendListener>
```

