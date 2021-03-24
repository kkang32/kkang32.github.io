---
layout: post
title: IE에서 jquery select() 가 안먹을때
categories: jquery
tags: jquery
--

# IE에서 jquery select() 가 안먹을때



IE에서 포커싱 됐을때 select()를 하면 전체 블럭이 싸여졌다가 다시 풀린다.

아래처럼 약간의 딜레이 후에 select()해주면 싸인다.

해당 입력칸에 다른이벤트가 잡혀 있다면 이벤트가 쌓이는 부작용이 있다.

 ```javascript
$(document).on("focus",".form", function(e){
    var obj = this;
    setTimeout(function(){
        $(obj).select();
    },1);
}); 
 ```