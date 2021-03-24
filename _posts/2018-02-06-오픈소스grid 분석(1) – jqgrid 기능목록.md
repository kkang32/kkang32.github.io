# 오픈소스grid 분석(1) – jqgrid 기능목록

2018년 2월 6일 [kkang32](http://www.thevruk.com/?author=1) [의견 작성하기](http://www.thevruk.com/?p=294#respond)

property 기준으로 기능정리를 해본다.
아래 내용은 http://www.trirand.com/jqgridwiki/doku.php?id=wiki:options내용을 번역하고 나름 이해한 내용으로 정리하였다.

**ajaxGridOptions** : jqgrid에서 ajax통신에 사용되는 옵션을 지정한다.
**ajaxSelectOptions** : editoptions, serarchoptions 에서 dataUrloption을 통해 데이터를 얻어오는 경우 해당 ajax통신 옵션을 지정한다.
**altclass** : altRows옵션이 true일경우 2,4,6,8등의 행에 자신이 만든 클래스를 지정한다.
**altRows** : 2,4,6,8행을 다른색으로 표현해준다.
**autoencode** : true일경우 서버에서 받은 html태그를 인코딩해준다. &lt; &gt; 등으로..
**autowidth** : true일경우 너비가 부모요소의 너비에 맞게 자동계산된다. *부모의 너비가 변경될때 크기를 조정하려면 사용자정의 코드를 적용하고 setGridWidth메서드를 사용해야 한다.(자세한 내용 파악 필요)*
**caption** : 캡션을 지정한다. 문자열이 비었으면 나타나지 않는다.
**cellLayout** :셀의 padding + border를 설정한다. 일반적으로 변경해서는 안되지만 td 에 대해 css가 적용된경우 변경해준다. 초기 값 5는 paddingLef (2) + paddingRight (2) + borderLeft (1) = 5를 의미함.
**cellEdit** : 셀편집을 활성/비활성화한다.
**cellsubmit** : 셀의 내용이 저장되는 위치 지정*(자세한 내용 파악 필요)*
**cellurl** : 수정된 셀 내용이 저장될 URL을 지정한다.*(자세한 내용 파악 필요)*
**cmTemplate** : 컬럼에대한 속성을 정의 한다. 정렬등.sortable: true 같이 한방에 지정한다.
**colModel** : 열의 매개변수를 설명하는 배열(배열 형식으로 이름, 너비, align등을 지정)
**colNames** :열이름을 배치한다.(배열형식)
**data** : 그리드의 데이터를 담고 있는 배열
**datastr** : 데이터 문자열 xml또는 json string
datatype : 그리드에 적용할 데이터 형식 지정(xmlstring, json, jsonstring, local, function…)
deepempty : 이벤트나 플러그인이 cell에 연결되어있으면 true로 설정한다.
deselectAfterSort : datatype : local 인 상황에서 정렬이 적용되었을때 현재 선택된 행의 선택을 해제
direction : 텍스트 방향 설정(ltr, rtl, firefox3.x, IE6이상에서만 작동)
editurl : 인라인 편집을 위한 URL을 지정함.
emptyrecords : 레코드수가 0일때 표시할 문자열(viewrecords:true 일때)
ExpandColClick : true일경우 트리그리드에서 확장된 열의 텍스트를 클릭하면 축소/확대된다.(정확하게 아이콘을 클릭하지 않아도됨)
ExpandColumn :
footerrow :
forceFit :
gridstate :
gridview :
grouping :
headertitles :
height :
hiddengrid :
hidegrid :
hoverrows :
idPrefix :
ignoreCase :
inlineData :
jsonReader :
lastpage :
lastsort :
loadonce :
loadtext :
loadui :
mtype :
multikey :
multiboxonly :
multiselect :
multiselectWidth :
multiSort :
page :
pager :
pagerpos :
pgbuttons :
pginput :
pgtext :
prmNames :
postData :
reccount :
recordpos :
records :
recordtext :
resizeclass :
rowList :
rownumbers :
rowNum :
rowTotal :
rownumWidth :
savedRow :
searchdata :
**scroll** : 동적 스크롤 그리드를 생성. 스크롤값을 1로 하면 가상스크롤링(virtual scroll)을 사용하게된다.
scrollOffset :
scrollTimeout :
scrollrows :
selarrrow :
selrow :
shrinkToFit :
sortable :
sortname :
sortorder :
subGrid :
subGridOptions :
subGridModel :
subGridType :
subGridUrl :
subGridWidth :
toolbar :
toppager :
totaltime :
treedatatype :
treeGrid :
treeGridModel :
treeIcons :
treeReader :
tree_root_level :
url :
userData :
userDataOnFooter :
viewrecords :
viewsortcols :
width :
xmlReader :

method정리

http://www.trirand.com/jqgridwiki/doku.php?id=wiki:jquery_ui_methods

http://www.trirand.com/jqgridwiki/doku.php?id=wiki:methods