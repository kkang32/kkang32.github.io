# jquery select 박스제어



> http://egloos.zum.com/tiger5net/v/5667935

**1. jQuery로 선택된 값 읽기**

 ```javascript
$("#selectBox option:selected").val();
$("select[name=name]").val();
 ```

 

**2. jQuery로 선택된 내용 읽기**

 ```javascript
$("#selectBox option:selected").text();
 ```

 

**3. 선택된 위치**

 ```javascript
var index = $("#test option").index($("#test option:selected"));
 ```



**4. Add options to the end of a select**

```javascript
$("#selectBox").append("<option value='1'>Apples</option>");
$("#selectBox").append("<option value='2'>After Apples</option>");
```

  

**5. Add options to the start of a select**

 ```javascript
$("#selectBox").prepend("<option value='0'>Before Apples</option>");
 ```

 

**6. Replace all the options with new options** 

```javascript
$("#selectBox").html("<option value='1'>Some oranges</option><option value='2'>MoreOranges</option>");
```

 

**7. Replace items at a certain index**

 ```javascript
$("#selectBox option:eq(1)").replaceWith("<option value='2'>Someapples</option>");
$("#selectBox option:eq(2)").replaceWith("<option value='3'>Somebananas</option>");
 ```

 

**8. 지정된 index값으로 select 하기**

```javascript
$("#selectBox option:eq(2)").attr("selected", "selected");
```

 

**9. text 값으로 select 하기**

```javascript
$("#selectBox").val("Someoranges").attr("selected", "selected");
```

 

**10. value값으로 select 하기**

```javascript
$("#selectBox").val("2");
```

  

**11. 지정된 인덱스값의 item 삭제**

 ```javascript
$("#selectBox option:eq(0)").remove();
 ```

 

**12. 첫번째 item 삭제**

 ```javascript
$("#selectBox option:first").remove();
 ```

 

**13. 마지막 item 삭제**

 ```javascript
$("#selectBox option:last").remove();
 ```

 

**14. 선택된 옵션의 text 구하기**

 ```javascript
alert(!$("#selectBox option:selected").text());
 ```

 

**15. 선택된 옵션의 value 구하기**

 ```javascript
alert(!$("#selectBox option:selected").val());
 ```

 

**16. 선택된 옵션 index 구하기**

 ```javascript
alert(!$("#selectBox option").index($("#selectBox option:selected")));
 ```

 

**17. SelecBox 아이템 갯수 구하기**

 ```javascript
alert(!$("#selectBox option").size());
 ```

 

**18. 선택된 옵션 앞의 아이템 갯수**

 ```javascript
alert(!$("#selectBox option:selected").prevAl!l().size());
 ```

 

**19. 선택된 옵션 후의 아이템 갯수**

 ```javascript
alert(!$("#selectBox option:selected").nextAll().size());
 ```



**20. Insert an item in after a particular position**

```javascript
$("#selectBox option:eq(0)").after("<option value='4'>Somepears</option>");
```



**21. Insert an item in before a particular position**

```javascript
$("#selectBox option:eq(3)").before("<option value='5'>Someapricots</option>");
```

 

**22. Getting values when item is selected**

 ```javascript
$("#selectBox").change(function(){
	alert(!$(this).val());
	alert(!$(this).children("option:selected").text());
});
 ```

