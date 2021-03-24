---
layout: post
title: [django tutorial-02] it worked! 띄우기
categories: python django
tags: python django
---

# [django tutorial-02] it worked! 띄우기



##### 장고 설치

1. 가상환경 활성화
2. source djangogirls/myvenv/bin
3. 
4. cd djangogirls
5. 장고 설치
6. django-admin startproject mysite .

 

##### 환경설정파일 수정
mysite/settings.py

```python
TIME_ZONE = 'Asia/Seoul' ==> 이부분은 웬만하면 수정하지 말자.
STATIC_URL = '/static/' ==> 아래에 아래부분추가
STATIC_ROOT = os.path.**join**(BASE_DIR, 'static')
ALLOWED_HOSTS = ['127.0.0.1', '.thevruk.com']
```

##### sqlite사용을 위한 설정(이미 되어있음)

```properties
DATABASES = {
'default': {
    'ENGINE': 'django.db.backends.sqlite3',
     'NAME': os.path.**join**(BASE_DIR, 'db.sqlite3'),
 }
}
```



sqlite는 python설치과정에서 같이 컴파일되어서 딸려(?) 올라가야 한다. 바로 이전단계에서 sqlite설치하는 부분을 기록해두었다(sqlite가 아닌 sqlite-devel을 설치해야함)

아래 명령으로 db를 구성해준다. 이과정에서 sqlite가 없으면 에러난다.

`cd djangogirls`

`python manage.py migrate`

##### 성공시 메시지

```shell
Operations to perform:
  Apply all migrations: auth, admin, contenttypes, sessions
  Running migrations:
  Rendering model states... DONE
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  Applying admin.0001_initial... OK
  Applying admin.0002_logentry_remove_auto_add... OK
  Applying contenttypes.0002_remove_content_type_name... OK
  Applying auth.0002_alter_permission_name_max_length... OK
  Applying auth.0003_alter_user_email_max_length... OK
  Applying auth.0004_alter_user_username_opts... OK
  Applying auth.0005_alter_user_last_login_null... OK
  Applying auth.0006_require_contenttypes_0002... OK
  Applying auth.0007_alter_validators_add_error_messages... OK
  Applying sessions.0001_initial... OK
```



##### 서버 구동하기

`python manage.py runserver`

콘솔창을 새로 하나 열어 서버가 띄워졌는지 확인한다. 포트는 8000 이다.

`netstat -nlp`

##### 방화벽을 열어준다.

```shell
iptables -I INPUT 1 -p tcp --dport 8000 -j ACCEPT 
service iptables save
service iptables restart
```

 

~~하.. wget 으로 로컬 접속은 되는데 브라우저에서 접속이 안된다. 다시해봐야겠다~~

`python manage.py runserver 0.0.0.0:8000`

 