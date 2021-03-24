---
layout: post
title: centos 에 apache + tomcat 연동시 connection 오류
categories: CentOS apache tomcat
tags: CentOS apache tomcat
--

# centos 에 apache + tomcat 연동시 connection 오류



> 참고 : https://www.lesstif.com/pages/viewpage.action?pageId=12943803

**모든 설정을 완료 했음에도 아래 오류가 발생한 경우는 포트를 기본 포트인 8009로 변경하자.(로그는 /etc/httpd/logs/mod_jk.log 에서 확인)**
*[Mon Jun 05 16:50:40 2017] [18172:140077314644032] [info] jk_open_socket::jk_connect.c (817): connect to xxx.xxx.xx.xx:8019 fail**ed (errno=13)*
*[Mon Jun 05 16:50:40 2017] [18172:140077314644032] [info] ajp_connect_to_endpoint::jk_ajp_common.c (1068): (tomcat1) Failed ope**ning socket to (xxx.xxx.xx.xx:8019) (errno=13)*
*[Mon Jun 05 16:50:40 2017] [18172:140077314644032] [error] ajp_send_request::jk_ajp_common.c*

tomcat에 설정된 ajp포트를 별도로 설정했었는데 별짓을 해도 연결이 안되었다. 이유는 아래와같다.

SELinux 에서는 보안을 위해 httpd에대해 제어를 하고 있으며 이는 몇개의 포트만 사용할 수 있도록 제한 하고 있다.
기본적으로 80, 443, 488, 8008, 8009, 8443 등이다.

나의 경우는 ajp포트를 8019로 설정해 두고 있어서 연결이 안되었고 8009로 변경하니 잘 되었다..

그럼에도 여러개 tomcat을 띄워야 하는경우 기본적으로 제공이 되는 포트로는 부족 할 수 있다.
아래와 같이 해보자.

```shell
 - semanage설치
yum install -y policycoreutils-python
 - 현재 설정된 포트보기
semanage port -l|grep http_port_t
 - 포트추가
semanage port -a -p tcp -t http_port_t 8888
```



 