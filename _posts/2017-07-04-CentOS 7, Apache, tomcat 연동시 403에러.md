# CentOS 7, Apache, tomcat 연동시 403에러



우선 제일 큰 문제는 설정파일 잘못이다.
천천히 다시 훑어보도록 한다.

정상적으로 잘 되어 있다면 아래 몇가지를 확인해본다.

1. 웹서버의 디렉토리 권한.
   디렉토리 모두(하위디렉토리까지) 권한을 755로 해주자.

2. httpd.conf 설정파일문제(Allow from all)

```shell
 <Directory "/home/apache/htdocs">
     Options FollowSymLinks
     AllowOverride None
     Order deny, allow
     Allow from all
 </Directory>
```



  

3. SELinux 가 동작하는경우

다른블로그에서는 이거를 끄라는데.. 이거 끄면 안된다..아래 4번을 하자.

4. SELinux동작시 아래의 명령으로 웹파일 디렉토리 보안셋팅을 해준다.
   `chcon -R -h -t httpd_sys_content_t /home/hosting/aaa`