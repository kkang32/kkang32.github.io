---
layout: post
title: [django tutorial-01] centos7에 python설치하기, Django설치
categories: python django
tags: python django
--

# [django tutorial-01] centos7에 python설치하기, Django설치



[https://tutorial.djangogirls.org/ko/django/
](https://tutorial.djangogirls.org/ko/django/)튜토리얼사이트를 기준으로 작성되었음. 튜토리얼그대로 하다가 안되는 것들이 꽤있기에 나름대로 정리함.

 

적당한 위치에서 아래를 순서대로 실행해준다.

```shell
mkdir python
cd python
wget https://www.python.org/ftp/python/3.6.1/Python-3.6.1.tgz
tar xzf Python-3.6.1.tgz
cd Python-3.6.1
./configure
make altinstall
```



이 과정에서 마지막에 zlib없다는 오류 메시지가 출력된다면 설치해준다.
zipimport.ZipImportError: can’t decompress data; zlib not available

```shell
yum install zlib-devel
```

나중에 쓰이니 openssl도 설치해준다

```shell
yum install openssl
yum install mod_ssl
```



sqlite devel도 설치해준다

```shell
yum install sqlite-devel
```

그리고 다시 make…

오류가 발생하여 이것저것해봤는데 아래 사항도 참고하면 좋겠다

```shell
yum install python-virtualenv
virtualenv --python=python3.6
```

 

확인

```shell
python3.6 -V
```

 

Django설치

```shell
python3.6 -m venv myvenv
cd myvenv/bin
./pip install --upgrade pip
./pip install django~=1.10.0
```



pip사용중에 아래 오류가 발생할 경우
pip is configured with locations that require TLS/SSL
….There was a problem confirming the ssl certificate: Can’t connect to HTTPS URL because the SSL module is not available.

위에서 기술한 openssl미설치로인해 발생하는 문제다. 설치하고 python부터 다시 빌딩한다.

 

django구동

```shell
source activate
```

콘솔 프롬프트앞에 괄호가 붙을것임.

 

> https://tecadmin.net/install-python-3-6-on-centos/#
> https://tutorial.djangogirls.org/ko/django_installation/