# centos7 에 tomcat8설치



```shell
wget http://apache.tt.co.kr/tomcat/tomcat-8/v8.0.41/bin/apache-tomcat-8.0.41.tar.gz
```
(http://tomcat.apache.org/index.html 여기에서 확인후에 받기)

압축풀기
```shell
tar -zxf /usr/local/apache-tomcat-8.0.41.tar.gz
```

별도의 tomcat디렉토리를 생성후 그쪽으로 파일을 전부 복사(안해도됨.)
```shell
mkdir /tomcat8
cp -rf . /tomcat8
```

tomcat전용 계정을 생성
```shell
useradd tomcat
```

톰캣 소유권자 변경
```shell
chown -R tomcat:tomcat /tomcat8
```

포트를 80으로 변경해줌(나의 환경에서는 포트포워딩이 80으로 되어있는상태여서 어쩔수 없음)
```shell
vi /tomcat8/conf/server.xml에서 8080검색후 변경해줌

su tomcat 후에 /tomcat8/bin/startup.sh
```

하면 에러남.ㅎㅎ(에러확인은 홈페이지 접속 불가 현상 확인 및 `tomcat8/logs/catalina.out`에서 확인)

**검색결과 root외에 1024 이하의 포트는 실행할 수 없음.**

결국엔 8080포트를 포트포워딩으로 설정하고서 해야 한다는 얘긴데.. 여력이 없으므로 다시 소유권자를 root로 변경한 후에 root로 tomcat을 실행하기로함…

```shell
chown -R root:root /tomcat8
/tomcat8/bin/startup.sh
```

끝…