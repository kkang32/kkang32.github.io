# git + maven + cargo 를 이용한 빌드 및 배포(1) – centos 에 maven 설치



아래의 프로세스대로 개발을 하려고 한다.
*클라이언트 -> git -> 중앙에서 maven으로 통합빌드 -> 서버로 배포*

jenkins를 설치하려고 하였으나 우선 maven을 통한 deploy를 수행하고자 한다. 젠킨스에서 제공하는 별도의 리포팅이나 모니터링은 자체적으로 잘 알아서 하기로 한다.

환경은 git repository와 maven이 같은 서버에 있고 적용될 서버는 원격지에 있다.
배포될 원격지서버는 tomcat 8.x 버전이다. java버전은 1.7로 맞춰서 작업한다. 특히 빌드 서버와 서비스될 서버의 java버전은 동일하게 맞추어야 한다.

아래 사이트에서 최신 버전을 확인하여 주소를 복사한다.
**http://maven.apache.org/download.cgi**

내려 받는다.
**wget http://apache.tt.co.kr/maven/maven-3/3.3.9/binaries/apache-maven-3.3.9-bin.tar.gz**

압축을 푼다.
**tar xvf apache-maven-3.3.9-bin.tar.gz**

이후 그냥 두던지 아니면 적절한 경로로 해당 파일들을 이동해준다.
**mkdir /maven**
**cp -r [압축푼 경로]  /maven**

메이븐 경로를 잡아준다.
**vi /etc/profile** 
**export M2_HOME=/maven**
**export PATH=$PATH:$M2_HOME/bin**
**-> 저장**
**source /etc/profile**

라이브러리들을 받아놓을 경로를 지정해준다.
**vi /maven/conf/settings.xml**
**<localRepository>적절한 경로</localRepository>**