---
layout: post
title: [django tutorial-04] view 단 작업하기
categories: python django
tags: python django
---

# [django tutorial-04] view 단 작업하기

2017년 7월 3일 [kkang32](http://www.thevruk.com/?author=1) [의견 작성하기](http://www.thevruk.com/?p=260#respond)

앞서는 관리자페이지에서 글을 보고 작성했는데 이제는 별도의 view파일을 만들어 그곳에서 작업하고자 한다. 그에 따라서 url 지정도 함께 해준다.

화면에서 볼 html파일을 만들어둔다

blog/templates/post/post_list.html

```html
<html>
    <head>
        <title>블로그</title>
    </head>
    <body>
        <p>글쓰기</p>
		<p>글보기</p>
    </body>
</html>

```



##### 위에서 만든 html파일을 view로 연결해주는 함수 작성

blog/views.py

```python
from django.shortcuts import render

def post_list(request):
return render(request, 'post/post_list.html', {})
```





##### 위 함수를 호출해주는 url패턴 지정

mysite/urls.py
(http://xxx.xxx.xxx.xxx:8000/ 으로 들어오는 모든 접속요청을 blog.urls로 전송해서 추가 명령을 찾음)

```python
from django.conf.urls import include,url
urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'', **include**('blog.urls')),
]
```



blog/urls.py
(http://xxx.xxx.xxx.xxx:8000/ 으로 접속했을때 views.post_list (=>위에서 정의한 메서드)를 보여주게 함.)
*(마지막 부분인 `name='post_list'`는 URL에 이름을 붙인 것으로 뷰를 식별합니다. 뷰의 이름과 같을 수도 완전히 다를 수도 있습니다. 이름을 붙인 URL은 프로젝트의 후반에 사용할 거예요. 그러니 앱의 각 URL마다 이름 짓는 것은 중요합니다. URL에 고유한 이름을 붙여, 외우고 부르기 쉽게 만들어야 해요.)*

```python
from django.conf.urls import url
from . import views
urlpatterns = [
  url(r'^$', views.post_list, name='post_list'),
]
```





##### 정규식의미

r : 정규식을 시작함
^ : 문자열이 시작됨
$ : 문자열이 끝남
\d : 숫자

*cf. https://tutorial.djangogirls.org/ko/django_urls/*

```
http://www.mysite.com/post/12345/라는 사이트가 있다고 합시다. 여기에서 12345는 글 번호를 의미합니다.

뷰마다 모든 글 번호을 일일이 매기는 것은 정말 힘들죠. 정규표현식으로 url패턴을 만들어 숫자값과 매칭되게 할 수 있어요. 이렇게 말이죠. ^post/(\d+)/$. 어떤 뜻인지 하나씩 살펴봅시다.

^post/ : url이(오른쪽부터) post/로 시작합니다.
(\d+) : 숫자(한 개 이상)가 있습니다. 이 숫자로 조회하고 싶은 게시글을 찾을 수 있어요.
/ : /뒤에 문자가 있습니다.
$ : url 마지막이 /로 끝납니다.
```

