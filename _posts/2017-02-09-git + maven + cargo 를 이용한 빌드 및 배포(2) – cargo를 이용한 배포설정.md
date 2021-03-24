---
layout: post
title: git + maven + cargo 를 이용한 빌드 및 배포(2) – cargo를 이용한 배포설정
categories: git maven
tags: git maven
--

# git + maven + cargo 를 이용한 빌드 및 배포(2) – cargo를 이용한 배포설정



우선 java버전을 맞춰준다.
pom.xml

```xml
.........
<properties>
 <java-version>1.7</java-version>
............

<plugin>
 <groupId>org.apache.maven.plugins</groupId>
 <artifactId>maven-compiler-plugin</artifactId>
 <version>2.5.1</version>
 <configuration>
 <source>1.7</source>
 <target>1.7</target>
```

 

배포 설정

pom.xml

```xml
<build>
<plugins>
............
<plugin>
 <groupId>org.codehaus.cargo</groupId>
 <artifactId>cargo-maven2-plugin</artifactId>
 <version>1.6.2</version>
 <configuration>
 <container>
 <containerId>tomcat8x</containerId>
 <type>remote</type>
 </container>
 <configuration>
 <type>runtime</type>
 <properties>
 
 
 <cargo.tomcat.manager.url>http://사이트주소/manager/html</cargo.tomcat.manager.url>
 <cargo.remote.username>아이디</cargo.remote.username>
 <cargo.remote.password>비밀번호</cargo.remote.password>
 <cargo.servlet.port>톰캣포트</cargo.servlet.port>
 <cargo.hostname>호스트명</cargo.hostname>
 
 </properties>
 </configuration>

 <deployer> 
 <type>remote</type> 
 </deployer> 
 <deployables>
 <deployable>
 <groupId>배포될 groupid</groupId>
 <artifactId>배포될 artifactId</artifactId>
 <type>war</type>
 <properties>
 <context>/</context>
 </properties>
 </deployable>
 </deployables>

 </configuration>
 </plugin>
..............
```

 

tomcat측에서 아래와 같이 설정해준다. 그리고 재시작

/톰캣설치경로/conf/tomcat_users.xml

```xml
<role rolename="manager"/>
 <role rolename="manager-gui"/>
 <role rolename="manager-script"/>
 <user username="아이디" password="비밀번호" roles="manager,manager-gui,manager-script"/>
```

 