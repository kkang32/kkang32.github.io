# [django tutorial-05] 작성했던글 화면에 출력하기 02



blog/views.py 에서 데이터를 템플릿 파일에 전달하기

```python
from django.shortcuts import render
from django.utils import timezone
from .models import Post

def post_list(request):
   posts = Post.objects.filter(published_date__lte=timezone.now()).order_by('published_date')
   return render(request, 'post/post_list.html', {'posts': posts})
```



템플릿 파일에서 목록 출력해주기
blog/templates/blog/post_list.html

```html
{% for post in posts %}
   <div>
       <p>published: {{ post.published_date }}</p>
       <h1><a href="">{{ post.title }}</a></h1>
       <p>{{ post.text|linebreaksbr }}</p>
   </div>
{% endfor %}
```

