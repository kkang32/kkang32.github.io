---
layout: post
title: [django tutorial-05] 작성했던글 화면에 출력하기 01
categories: python django
tags: python django
---

# [django tutorial-05] 작성했던글 화면에 출력하기 01



화면에 출력하기에 앞서 Querysets 에 대해 기록한다.

장고 쉘을 실행시켜 테스트해본다.

```shell
(myvenv) ...$ python manage.py shell

(InteractiveConsole)
>>>
```



##### 모든객체 조회하기

```python
>>> from blog.models import Post
>>> Post.objects.all()
```



##### 객체 생성하기

1. User모델 call

```python
>>>from django.contrib.auth.models import User
>>>User.objects.all()
```



2. admin인스턴스를 me에 저장

```python
>>>me = User.objects get(username='admin')
```



3. 게시물 작성

```python
>>>Post.objects.create(author=me, title='Sample title', text='Test')
>>>Post.objects.all()
```



4. 필터링 – 내가 작성한 글만보기

```python
>>> Post.objects.filter(author=me)
```



5. 필터링 – ‘title’이라는 문구가 있는 게시글 조회
   (title과 contains사이에 underscore가 두줄인데, 필드명과 연산자를 underscore 두줄로 구분해준다.)

```python
>>> Post.objects.**filter**(title__contains='title')
```



6. 현재 날짜를 기준으로 과거 날짜 게시물조회

위에서 테스트로 생성했던 게시글을 models.py에 있는 `publish()`메서드를 이용해서 저장한다.

```python
>>> post = Post.objects.get(title="Sample title")
>>> post.publish()
```



7. 시간옵션을 적용하여 조회한다.

```python
>>> from django.utils import timezone
>>> Post.objects.filter(published_date__lte=timezone.**now**())
```





##### 정렬하기

1. asc정렬

```python
>>> Post.objects.**order_by**('created_date')
```



2. desc정렬

```python
>>> Post.objects.order_by('-created_date')
```



##### 여러 조건을 중첩해서 적용하기

```python
>>> Post.objects.filter(published_date__lte=timezone.now()).order_by('published_date')
```



 