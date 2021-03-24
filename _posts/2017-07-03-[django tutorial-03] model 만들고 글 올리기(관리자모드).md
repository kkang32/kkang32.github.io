# [django tutorial-03] model 만들고 글 올리기(관리자모드)



##### 어플리케이션 만들기

(myvenv) .....$ python manage.py startapp blog

mysite/settings.py 에 app추가

```python
INSTALLED_APPS = [
 'django.contrib.admin',
 'django.contrib.auth',
 'django.contrib.contenttypes',
 'django.contrib.sessions',
 'django.contrib.messages',
 'django.contrib.staticfiles',
 'blog',
]
```



##### 글작성 모델 만들기
blog/models.py

```python
from django.db import models

from django.utils import timezone


class Post(models.Model):
   author = models.ForeignKey('auth.User')
   title = models.CharField(max_length=200)
   text = models.TextField()
   created_date = models.DateTimeField(
           default=timezone.now)
   published_date = models.DateTimeField(
           blank=True, null=True)

   def publish(self):
       self.published_date = timezone.now()
       self.save()

   def __str__(self):
       return self.title
```





필드타입 참고 페이지 https://docs.djangoproject.com/en/1.10/ref/models/fields/#field-types

##### DB에 위에서 만든 모델을을 위한 테이블을 생성

```shell
(myvenv) ...$ python manage.py makemigrations blog
Migrations for 'blog':
blog/migrations/0001_initial.py:
\- Create model Post
(myvenv) ...$ python manage.py migrate blog
Operations to perform:
Apply all migrations: blog
Running migrations:
Rendering model states... DONE
Applying blog.0001_initial... OK
```

 

##### 글 작성/확인을 위한 admin설정

blog/admin.py

```python
from django.contrib import admin
from .models import Post
admin.site.register(Post)
```



유저 생성

```shell
(myvenv) ...$ python manage.py createsuperuser
Username: admin
Email address: admin@admin.com
Password:
Password (again):
Superuser created successfully.
```



http://접속IP(또는 도메인):8000/admin으로 접속 후 위에서 생성한 아이디 입력하면 아래와같은 화면이 나옴
![img](/assets/images/2017-07-03-[django tutorial-03] model 만들고 글 올리기(관리자모드).assets/admin.png)

 

##### Posts를 클릭해서 글을 써보고 지우고 할 수 있음