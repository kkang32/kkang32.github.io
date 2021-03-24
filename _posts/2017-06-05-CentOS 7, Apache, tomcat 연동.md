# CentOS 7, Apache, tomcat 연동

```shell
wget http://mirror.apache-kr.org/tomcat/tomcat-connectors/jk/tomcat-connectors-1.2.42-src.tar.gz
tar xvf tomcat-connectors-1.2.42-src.tar.gz
cd tomcat-connectors-1.2.42-src
cd native/
chmod +x buildconf.sh
./configure --with-apxs=/usr/local/apache/bin/apxs && make && make install
```



여기서 발생할 수 있는 오류
**checking for perl… /usr/bin/perl**
**configure: error: Invalid location for apxs: ‘/usr/local/apache/bin/apxs’**

-> 소스 컴파일을 위해 아래 설치

```shell
yum install httpd-devel
```



이후 apxs의 경로를 확인하여 다시 설치 해 준다.

```shell
whereis apxs
```

**configure: error: C compiler cannot create executables**

c컴파일러가 없으므로 설치해준다.

```shell
yum install gcc
```

 

`/etc/httpd/conf` 내 설정파일들을 수정 해준다.
**httpd.conf**

```xml
[추가]
LoadModule jk_module modules/mod_jk.so
<IfModule jk_module>
JkWorkersFile conf/workers.properties
JkShmFile run/mod_jk.shm
JkLogFile logs/mod_jk.log
JkLogLevel info
JkLogStampFormat "[%a %b %d %H:%M:%S %Y] "
</IfModule>
Include conf/httpd-vhosts.conf
....
[수정]
<Directory "/home/apache/htdocs">
 AllowOverride none
# Require all denied
 Allow from all
</Directory>
```



**httpd-vhosts.conf**(새로 생성, 다중 호스트 구현)

```xml
<VirtualHost *:80>
    DocumentRoot "/home/apache/htdocs/정적파일경로1/"
     ServerName 서버명1
     ServerAlias 서비스할도메인(ex:www.test1.com)
     JkMountFile "/etc/httpd/conf/uriworkermap1.properties"
     RewriteCond %{REQUEST_FILENAME} \.(htm|html|xhtml|js|css|jpg|gif|png|swf)$
     RewriteEngine On
     RewriteRule (.*) - [L]
     RewriteRule (.*) ajp://localhost:8009$1 [P]
</VirtualHost>
<VirtualHost *:80>
     
     DocumentRoot "/home/apache/htdocs/정적파일경로2/"
     ServerName 서버명2
     ServerAlias 서비스할도메인(ex:www.test2.com)
     JkMountFile "/etc/httpd/conf/uriworkermap2.properties"
     RewriteCond %{REQUEST_FILENAME} \.(htm|html|xhtml|js|css|jpg|gif|png|swf)$
     RewriteEngine On
     RewriteRule (.*) - [L]
     RewriteRule (.*) ajp://localhost:8008$1 [P]
</VirtualHost>
```



**workers.properties**(새로 생성한다.)

```properties
worker.list=tomcat1,tomcat2
worker.tomcat1.port=8009
worker.tomcat1.host=localhost
worker.tomcat1.type=ajp13
worker.tomcat1.connection_pool_timeout=600
worker.tomcat1.socket_keepalive=1
worker.tomcat1.lbfactor=1
worker.tomcat2.port=8008
worker.tomcat2.host=localhost
worker.tomcat2.type=ajp13
worker.tomcat2.connection_pool_timeout=600
worker.tomcat2.socket_keepalive=1
worker.tomcat2.lbfactor=1
```



 **uriworkermap1.properties, uriworkermap2.properties**(새로 생성한다)

```properties
1번파일
/*=tomcat1
!/*.js=tomcat1
!/*.css=tomcat1
!/*.png=tomcat1
!/*.html=tomcat1
!/*.otf=tomcat1
!/*.eot=tomcat1
!/*.svg=tomcat1
!/*.ttf=tomcat1
!/*.woff=tomcat1
!/*.woff2=tomcat1
2번 파일
/*=tomcat2
!/*.js=tomcat2
!/*.css=tomcat2
!/*.png=tomcat2
!/*.html=tomcat2
!/*.otf=tomcat2
!/*.eot=tomcat2
!/*.svg=tomcat2
!/*.ttf=tomcat2
!/*.woff=tomcat2
!/*.woff2=tomcat2
```



여기까지 웹서버 설정 완료이고 다음은 톰캣쪽 수정사항이다.

server.xml에서 ajp포트 수정 및 기존 8080(80) 포트 제거
이곳에 있는 8009포트가 workers.properties에 있는 포트와 일치해야 한다.

```xml
<Connector port="8009" protocol="AJP/1.3" redirectPort="8443" />
```

아래 부분은 주석처리

```xml
<Connector port="8080" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" />
```



그리고 tomcat 재시작(**shutdown.sh, startup.sh**)
이후 **netstat -nlp**로 기존에 톰캣에서 사용중이던 8080포트가 없어졌는지 확인.

apache시작(**apachectl start**) – 중지 : **stop**, 재시작 : **restart**

apache시작시 설정파일 구문 오류 등으로 재시작을 못하는 경우가 종종 발생하므로 설정파일 수정후에
**apachectl configtest**로 점검해준다.

참고로 웹파일들은 아래 경로에 넣어준다. (httpd-vhosts.conf 파일에 명시되어있다.)
**DocumentRoot "/home/apache/htdocs/지정된디렉토리"**

 