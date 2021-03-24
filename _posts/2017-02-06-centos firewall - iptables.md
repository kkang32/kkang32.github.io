---
layout: post
title: centos firewall -> iptables
categories: centos
tags: centos
--

# centos firewall -> iptables



centos 를 깔면 firewall 데몬이 방화벽역할을 해주는데 이것을 iptables로 바꿔보고자 함.

firewall서비스 등록 해제
```shell
systemctl stop firewalld
systemctl mask firewalld
```

iptables 설치
```shell
yum install iptables
yum install iptables-services
```

부팅시 실행되도록 설정
```shell
systemctl enable iptables
```

그리고 방화벽 설정(mysql 을 외부에서 붙고자 할경우, 웹접속도 아래와 같이 허용할것)
```shell
iptables -I INPUT 1 -p tcp --dport 3306 -j ACCEPT 
service iptables save
service iptables restart
```

 