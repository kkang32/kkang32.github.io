# 테이블에 있는 input text박스를 커서로 이동하기


엑셀처럼 입력칸을 커서로 이동하는 라이브러리 입니다.

아래에서 다운받으세요.
[cellmover](2016-12-22-테이블에 있는 input text박스를 커서로 이동하기.assets/jquery.caret_.js)

#### example)

```javascript
$(_table).cellmover({
	applyclass : ".cell-element"
});
```

….
```html
<table id=’tableId’>
    <tr>
        <td>
            <input type=’text’ class=’cell-element’>
        </td>
        <td>
            <input type=’text’ class=’cell-element’>
        </td>
    </tr>
    <tr>
        <td>
            <input type=’text’ class=’cell-element’>
        </td>
        <td>
            <input type=’text’ class=’cell-element’>
        </td>
    </tr>
    <tr>
        <td>
            <input type=’text’ class=’cell-element’>
        </td>
        <td>
            <input type=’text’ class=’cell-element’>
        </td>
    </tr>
</table>
```
….. 