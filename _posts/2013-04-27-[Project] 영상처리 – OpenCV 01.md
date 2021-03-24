# [Project] 영상처리 – OpenCV 01

핸드폰을 자동차에 얹을 예정입니다. 핸드폰은 바닥에 있는 표식을 읽어서 방향을 틀거나 전진하거나 후진할 것입니다.

 

그러기위해서는 표식 영상을 처리해줄 라이브러리가 필요한데 저는 OpenCV를 활용하겠습니다.

 

이번에는 OpenCV를 다운받고 핸드폰에 넣어 구동하는것 까지 해보려 합니다.

 

OpenCV공식 홈은

**http://opencv.org/**

여기 입니다.  이곳에서 윈도우용, 리눅스용, Mac용, Android, iOS용 전부다 다운받을 수 있습니다. 예전에는 일일이 cygwin을 사용해서 컴파일 하고 포팅을 해서 사용했었는데 지금은 한방에 다됩니다.

 

먼저 **http://opencv.org/downloads.html** 에서 **OpenCV for Android**를 받습니다.

 

다운받은 파일의 압축을 해제한 후 **OpenCV-2.4.5-android-sdk\sdk** 의 프로젝트를 이클립스에 Import시킵니다.

당연히 되어있겠지만 프로젝트의 Properties에서 is library 체크를 확인 합니다.

 

프로젝트가 오류가 난다고 표시가 되면 메뉴상의 **Project – Clean** 을 수행하거나 해당프로젝트에서 마우스 오른쪽 버튼을 눌러 **Android Tools – Fix Project Properties** 를 선택해줍니다.

 

라이브러리 Import는 완료 되었고 샘플 프로젝트를 돌려보도록 하겠습니다.

**OpenCV-2.4.5-android-sdk\samples** 에 샘플들이 있습니다. 

전부다 Import 시킨후에 프로젝트 상태를 보면 전부다 오류가 날것입니다.

라이브러리를 지정해 주지 않아서 인데

**OpenCV Tutorial 1 – Camera Preview** 프로젝트를 예로 들겠습니다.

 

대부분 라이브러리 경로가 올바르게 잡혀있지 않아서인데, 아래 과정을 거쳐 오류를 해결할 수 있습니다.

 

마우스 오른쪽 버튼 – Properties – Android – 하단의 Library그룹 – Add 버튼 – 아까 추가한 OpenCV라이브러리 프로젝트 선택 – 기존에 있던 X표시된 라이브러리는 Remove – OK

 

이제 핸드폰에 돌려보겠습니다.

바로 돌아가는 분도 있겠지만 대부분은 구동이 안될것입니다. OpenCV매니저 apk를 설치하라면서 마켓으로 이동하게 되는데 해당 apk를 다운로드 하시던지 **OpenCV-2.4.5-android-sdk\apk**안에 있는 apk를 설치하시면 되겠습니다.

매니저를 설치하라니….;;

매니저 apk를 설치하고나서 정상적으로 카메라가 구동됐다면 성공입니다.

 

이제 다른 프로젝트를 해보겠습니다.

프로젝트 이름을 보니 **OpenCV Sample – face-detection** 프로젝트가 재미있어보입니다.

위와같이 라이브러리 경로를 다시 올바르게 잡아줍니다.

하지만 여전히 오류입니다.

 

이 프로젝트는 ndk를 필요로 합니다.

ndk를 설치 하고 구동하는 방법은

**[http://myembedded.tistory.com/entry/Android-OpenCV-243-%EC%9D%B4%ED%81%B4%EB%A6%BD%EC%8A%A4%EC%97%90%EC%84%9C-OpenCV-%EB%B9%8C%EB%93%9C%ED%95%98%EA%B8%B0](http://myembedded.tistory.com/entry/Android-OpenCV-243-이클립스에서-OpenCV-빌드하기)** 에 잘나와있습니다.

이곳에 있는내용을 정리해서 올리겠습니다.

 

1. **http://developer.android.com/tools/sdk/ndk/index.html** 에서 ndk를 받아 적당한곳에 압축을 풉니다.

 

2. 저는 이부분은 그냥 넘어갔는데, 해당 작업을 하기위해서는 CDT Plugin이 필요합니다. 해당 플러그인을 설치하시거나 최신의 ADT를 설치합니다.

 

3. **face-detection**프로젝트 에서 마우스 우클릭 – Properties – C/C++ Build 에서 Build command에 아까 다운받은 ndk의 전체 경로를 적어줍니다.

Build command : C:\android-ndk\android-ndk-r8e-windows-x86_64\android-ndk-r8e\ndk-build.cmd

 

4. C/C++ General -> Paths and Symbols

GNU C++의 Include directories에서 NDKROOT부분의 경로를 다시 설정해줍니다. 기본경로로 설정되어있는데 다운받은 ndk의 버전이라던지.. 그런부분들이 안맞을 수 도 있습니다. 정확히 맞춰줍니다.

 

5. 해당프로젝트의 jni/Android.mk 상에 OpenCV.mk 파일 경로를 다시 적어줍니다.

**include E:\kkang\OpenCV-2.4.5-android-sdk\OpenCV-2.4.5-android-sdk\sdk\native\jni\OpenCV.mk**

 

끝입니다.

오류는 사라지고 이제 핸드폰으로 얼굴을 찾아보시면 됩니다.

제 얼굴은 인식을 잘못했던것 같습니다.. 사람같이 안생겨서 그런가..

 

다음에는 전진, 후진, 방향전환을 할 수 있도록 실제 이미지를 인식해보는 작업을 하겠습니다. 여러가지 기법이 있겠지만서도..

가장 간단한 템플릿 매칭을 통해 구현하겠습니다.

 

아무도 안보는 글을 이렇게 쓰는 이유를 모르겠습니다.

 

도움이 되셨길 바랍니다.