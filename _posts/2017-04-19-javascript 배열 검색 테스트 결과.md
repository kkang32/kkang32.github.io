# javascript 배열 검색 테스트 결과



for문으로 loop돌리는거랑 filter쓰는 방법 테스트함. 테스트 브라우저는 크롬이다.

500만개의 오브젝트를 array에 push해놓은 상태에서 제일끝에 있을것으로 예상 되는 데이터를 검색했는데
결과는 for문이 빨랐다.

**데이터 입력시간 : 3.8초**
**for loop 평균 검색시간 : 418m**
**filter 평균 검색 시간 : 552m**

아래는 테스트 코드(검색시 “test_4999999” 으로 검색했다.)

```html
<html lang='ko'>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<script type='text/javascript'>
function _debug_start_time(){
  var date = new Date();  
  _debug_timer = date.getTime();
  console.log("::::START DEBUGGING_ELAPSED TIME::::[" + _debug_timer + "]");
}
 
function _debug_cur_time(str){
  var date = new Date();  
  var curtime = date.getTime();
  console.log("::::NOW DEBUGGING_ELAPSED TIME::::[" + (curtime - _debug_timer) + "] - " + str);
  _debug_timer = curtime;
}
var arr = [];
function start(){
  _debug_start_time()
  for (var i=0 ; i< 5000000;i++){
    var obj = {};
    obj.test1 = "test_" + i;
    obj.test2 = "test0001_" + i;
    obj.test3 = "test1010_" + i;
    obj.test4 = "test9999_" + i;
    
    arr.push(obj);
  }
  //console.log(arr);
  _debug_cur_time("complete set array");
}
function search(){
  var n = document.getElementById("n").value;
  console.log("탐색할 문자열 : " + n);
  _debug_start_time()
  
  for (var i = 0 ;i<arr.length;i++){
    if (arr[i].test1 == n){
      console.log("발견");
      break;
    }
  }
  _debug_cur_time("done");
  
}
function search2(){
  var n = document.getElementById("n").value;
  console.log("탐색할 문자열 : " + n);
  _debug_start_time()
  
  var result = arr.filter(function(item){
    return item.test1 == n;
  });
  _debug_cur_time("done");
  
}
</script>
</head>
<body>
<button onclick='start()'>시작</button>
<input type='text' id='n'><button onclick='search()'>탐색</button>
<button onclick='search2()'>탐색2</button>
</body>

```

