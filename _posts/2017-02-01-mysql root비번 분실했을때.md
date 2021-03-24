---
layout: post
title: mysql root비번 분실했을때
categories: mysql
tags: mysql
--

# mysql root비번 분실했을때



mysql 서비스 중단후 아래 파일 편집
```shell
vi /etc/my.cnf
```

에 아래 내용추가

```shell
skip-external-locking
skip-grant-tables
```

그리고 다시 mysql 구동

```shell
mysql -uroot mysql

mysql>UPDATE user SET authentication_string=PASSWORD('변경할비밀번호') WHERE user='root';
```
(참고로 mysql 5.7부터 패스워드 컬럼이 authentication_string 으로 변경됨. 한참 찾았다..)

 

아래처럼 해도 된다.(ex 하위버전)
```shell
mysqld_safe --skip-grant &
update user set password=password('비번') where user='root'
flush privileges;
```

 