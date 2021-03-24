(function($) {
	
	/**
	 * 
	 * 틀고정기능(상단/좌측)
	 *
	 */
	
	
	/**
	 * json format
	 * 
	 * {
	 * 	"total":18,
	 * 	"page":0,
	 * 	"records":5,
	 * 	"cols":[
	 * 			{"colDBNm":"title","colViewNm":"제목","colWidth":100},
	 * 			{"colDBNm":"data1","colViewNm":"내용","colWidth":100},
	 * 			{"colDBNm":"value","colViewNm":"값","colWidth":100}
	 * 			],
	 * 	"rows":[
	 * 			{"title":"test","data1":"asdfasdf","value":1},
	 * 			{"title":"test21","data1":"aaaa","value":2},
	 * 			{"title":"test22","data1":"bbbb","value":3},
	 * 			{"title":"test23","data1":"cccc","value":4},
	 * 			{"title":"test24","data1":"ddd","value":5}
	 * 			]
	 *}

	 * 
	 * 
	 */
	
	
	
	
	
	var bodyUrl;
	var listCount;
	var search;
	var pid;
	var $container;
	var pageCount = 10;
	var _header;
	var fixColnum;
	var selectRow;
	var key;
	var hidekey;
	var _data;
	var deleteRow;
	var createRow;
	var orders = [];
	var searchColArry = [];
    
    $.fn.hbgrid = function(opts) {
    
    	bodyUrl = opts.url;
    	listCount = opts.listCount;
    	searchCol = opts.searchCol;
    	searchKeyword = opts.searchKeyword;
    	pid = opts.pid;
    	fixColnum = opts.fixcolnum;
    	selectRow = opts.selectRow;
    	key = opts.key;
    	hidekey = opts.hidekey;
    	deleteRow = opts.deleteRow;
    	createRow = opts.createRow;
    	orders = opts.orders;
    	
    	
    	$container = $(this);
    	getData(0);
    	
    	
    	$container.on( "click", ".hbgrid-num", function(e) {
    		var page = $(this).attr("num");
    		getData(page);
    	});
    	
    	$container.on( "click", ".hbgrid-table tbody tr", function(e) {
    		
    		var tr = $(this);
    		var idx = tr.index();
    		var data = {};
    		var len = key.length;
    		
    		
    		for (var i = 0 ; i < len ; i++){
    			data[_header[key[i]]["colDBNm"]] = _data.rows[idx][_header[key[i]]["colDBNm"]];
    		}
    		
    		selectRow(data, this);
    		
    	});
    	
    	$container.on( "click", ".chkall", function(e) {
    		if($(this).is(":checked")){
    			$(".chk").prop("checked",true);
    		}else{
    			$(".chk").prop("checked",false);
    		}
    		
    	});
    	
    	$container.on( "click", ".chk", function(e) {
    		e.stopPropagation();
    		
    	});
    	
    	$container.on( "click", "#delRow", function(e) {
    		deleteRow();    		
    	});
    	
    	$container.on( "click", "#create", function(e) {
    		createRow();    		
    	});
    	
    	$container.on("click", "#search", function(e){
    		
    		var obj = $(".searchCol");
    		var len = obj.length;
    		var searchArr = [];
    		
    		for (var i = 0 ; i < len ; i ++){
    			
    			
    			if ($(".searchKeyword:eq(" + i + ")").val() == ""){
    				continue;
    			}
    			var searchObj = {};
    			searchObj.col = $(".searchCol:eq(" + i + ")").val();
    			searchObj.keyword = $(".searchKeyword:eq(" + i + ")").val();
    			searchArr.push(searchObj);
    			
    		}
    		
    		
    		search = searchArr;
    		getData(0);
    	});
    	
    	$container.on("focus", ".searchKeyword", function(e){
    		$(this).select();
    	});
    	
    	$container.on("mouseover", "tbody tr td", function(e){
    		var idx = $(this).index();
    		if (idx == 0){
    			$(this).css("background","#1E84C9");        		
    		}else{
    			$(this).css("background","#333333");
        		$(this).css("color","#ffffff");
    		}
    		
    		
    		
    		$(this).siblings().css("background","#D5D5D5");
    		$(this).closest("tr").children(":eq(0)").css("background","#1E84C9");
    		
    		
    		
    		
    		
    		$(this).closest("tr").siblings().each(function(index){
    			if (idx == 0){
    				$(this).children("td:eq(" + idx + ")").css("background","#1E84C9");    
    			}else{
    				$(this).children("td:eq(" + idx + ")").css("background","#EAF2F9");
    			}
    			
    			
    		});
    		
    		$container.find("thead tr th:eq(" + idx + ")").css("background","#C0D0E0");
    			
    		
    	});
    	
    	$container.on("mouseout", "tbody tr td", function(e){
    		var idx = $(this).index();
    		
    		if (idx == 0){
    			$(this).css("background","#52B0EB");   
    		}else{
    			$(this).css("background","#ffffff");
        		$(this).css("color","#000000");
    		}
    		
    		
    		
    		$(this).siblings().css("background","#ffffff");
    		$(this).closest("tr").children(":eq(0)").css("background","#52B0EB");
    		
    		
    		
    		$(this).closest("tr").siblings().each(function(index){
    			if (idx == 0){
    				$(this).children("td:eq(" + idx + ")").css("background","#52B0EB");
    			}else{
    				$(this).children("td:eq(" + idx + ")").css("background","#ffffff");
    			}
    			
    			
    		});
    		
    		$container.find("thead tr th:eq(" + idx + ")").css("background","#D1E4F0");
    		
    	});
    	
    	$container.on("click",".hbgrid-order", function(e){
    		var col = $(this).attr("col");
    		var ordertype = $(this).attr("ordertype");
    		
    		
    		
    		var newOrder = [
    			{orderCol : col
    			, orderType : ordertype}
    				
    			];
    		
    		orders = newOrder;
    		getData(0);
    		
    		
    		
    		
    	});
    	
    	
    	$container.on("click","#addSearch", function(e){
    		
    		$(".hbgrid-keyword-layer").toggle();  
    		
    		if ($(".hbgrid-controll div ul").children().length == 0){
    			addSearchCondition();
    		}
    		
    	});
    	
    	$container.on("click",".addCondition", function(e){
    		
    		addSearchCondition();
    		
    		
    	});
    	
    	
    	
    	
    	$(window).resize(function() {
    		
    		var widthsum = 0;
        	for (var i = 0 ; i < _header.length ; i ++){
        		var isk = isKey(i);
        		if (hidekey && isk){
        			continue;
        		}
        		widthsum += _header[i]["colWidth"]*1;
        	}
        	
        	var tableleft = ($container.width() / 2) - (widthsum/2);
    		
    		$(".hbgrid-controll").css("left", tableleft);
    		$(".hbgrid-table").css("left", tableleft);
    		$(".hbgrid-colsizer-container").css("left", tableleft);
    	});

    	
    	//return this;
    	
    	
    }
    
    $.fn.getCheckedRows = function(){
    	
    	var tr = $(this);
		var retval = [];
		
		var len = key.length;
		
		var $obj = $(".chk:checked");
		var lenrows = $obj.length;
		
		for (var i = 0 ; i < lenrows;i++){
			var data = {};
			var idx = $($obj[i]).closest("tr").index();
			for (var z = 0 ; z < len ; z++){
				data[_header[key[z]]["colDBNm"]] = _data.rows[idx][_header[key[z]]["colDBNm"]];
				
				
			}
			retval.push(data);
		}
		
		return retval;
		
		
    }
    
    $.fn.refreshList = function(){
    	
    	getData(0);
		
		
    }
    
    function addSearchCondition(){
    	var option = "";
    	
    	for (var z=0;z<searchColArry.length;z++){
    		
    		option += "<option value='" + searchColArry[z].val + "'>" + searchColArry[z].name + "</option>";
    	}
		
		
		
		
		var html = "<li><a href='javascript:void(0)' class='addCondition' style='padding:5px'>+</a>" +
				"<select class='searchCol'>" + option + "</select><input type='text' class='searchKeyword'></li>";
		
		$(".hbgrid-controll div ul").append(html);	
    }
    
    function makeTable(data){
    	_data = data;
    	_header = data.cols;
    	
    	
    	
    	var widthsum = 0;
    	for (var i = 0 ; i < _header.length ; i ++){
    		var isk = isKey(i);
    		if (hidekey && isk){
    			continue;
    		}
    		widthsum += _header[i]["colWidth"]*1;
    	}
    	
    	var tableleft = ($container.width() / 2) - (widthsum/2);
    	
    	var html = "";
    	
    	html = "<div class='hbgrid-table-container'>";
    	
    	
    	//var lefthtml = "<table border='1' class='hbgrid-table-clone-left' style='position:absolute;left:" + tableleft + "px'>";
    	
    	/*****************************************/
    	/*html += "<div id='cloneheader'>";
    	html += "<table border='1' class='hbgrid-table-clone-header' style='position:absolute;left:" + tableleft + "px'>";
    	html += "<thead>";
    	html += "<tr>";
    	lefthtml += "<thead>";
    	lefthtml += "<tr>";
    	for (var i = 0 ; i < _header.length ; i++){
    		var width = _header[i]["colWidth"];
    		html += "<th style='width:" + width + "px'>"; 
    		html += _header[i]["colViewNm"];
    		html += "</th>";
    		
    		if (i < fixColnum){
    			lefthtml += "<th style='width:" + width + "px'>"; 
    			lefthtml += _header[i]["colViewNm"];
    			lefthtml += "</th>";
    		}
    		
    	}
    	html += "</tr></thead></table>";
    	lefthtml += "</tr>";
    	lefthtml += "</thead>";
    	
    	html += "</div><div id='cloneleft'></div>";*/
    	/*****************************************/
    	
    	
    	
    	
    	html += "<div class='hbgrid-controll' style='position:absolute;left:" + tableleft + "px'>" +
    			"<div><a href='javascript:void(0);' id='addSearch'>검색조건</a>" +
    			"<div class='hbgrid-keyword-layer' style='display:none'><ul></ul></div>" +
    			"</div>" +
    			"<div><button id='search'>검색</button><button id='delRow'>삭제</button><button id='create'>추가</button></div></div>";
    	html += "<table class='hbgrid-table' style='position:absolute;left:" + tableleft + "px;margin-top:50px'>";
    	html += "<thead>";
    	html += "<tr>";
    	
    	
		html += "<th style='width:30px;text-align:center'>"; 
		html += "<input type='checkbox' class='chkall checkbox-style'>";
		html += "</th>";
    	
		searchColArry = [];
    	for (var i = 0 ; i < _header.length ; i++){
    		var isk = isKey(i);
    		if (hidekey && isk){
    			continue;
    		}
    		
    		var sc = {};
    		sc.val = _header[i]["colDBNm"];
    		sc.name = _header[i]["colViewNm"];
    		searchColArry.push(sc);
    		
    		
    		var width = _header[i]["colWidth"];
    		
    		var orderType = "desc";
    		var orderText = "";
    		var isordercol = isOrderCol(_header[i]["colDBNm"]);
    		if (isordercol != ""){
    			orderType = isordercol == "desc" ? "asc" : "desc";
    			orderText = isordercol == "desc" ? "▼" : "▲";
    		}
    		
    		html += "<th style='width:" + width + "px' col='" + _header[i]["colDBNm"] + "' ordertype='" + orderType + "' class='hbgrid-order'>"; 
    		html += _header[i]["colViewNm"];
    		html += orderText;
    		html += "</th>";
    	}
    	html += "</tr></thead>";
    	
    	
    	html += "<tbody>";
    	//lefthtml += "<tbody>";
    	for (var i = 0 ; i < data.rows.length ; i++){
	    	html += "<tr>";
	    	//lefthtml += "<tr>";
	    	html += "<td style='width:30px;text-align:center'>"; 
			html += "<input type='checkbox' class='chk  checkbox-style'>";
			html += "</td>";
	    	for (var z = 0 ; z < _header.length ; z++){
	    		
	    		var isk = isKey(z);
	    		
	    		if (hidekey && isk){
	    			continue;
	    		}
	    		var keyclass='';
	    		if (isk){
	    			keyclass = 'hbgrid-key'
	    		}
	    		
	    		
	    		
	    		html += "<td class='" + keyclass + "'>"; 
	    		html += data.rows[i][_header[z]["colDBNm"]];
	    		html += "</td>";
	    		
	    		/*
	    		if (z < fixColnum){
	    			lefthtml += "<td>"; 
	    			lefthtml += data.rows[i][_header[z]["colDBNm"]];
	    			lefthtml += "</td>";
	    		}
	    		*/
	    	}
	    	html += "</tr>";
	    	//lefthtml += "</tr>";
    	}
	    
    	html += "</tbody>";
    	//lefthtml += "</tbody></table>";
    	
    	
    	html += "</table></div>";
    	
    	
    	$container.html(html);
    	setSearchCol(searchColArry);
    	
    	//$("#cloneleft").html(lefthtml);
    	html = makePageNav(data);
    	$container.append(html);
    	
    	
    	
    	html = makeResizeCol(_header);
    	$container.append(html);
    	setDraggable();
    	
    } 
    
    function isOrderCol(colname){
    	for (var i = 0 ; i < orders.length;i++){
    		if(orders[i].orderCol == colname){
    			return orders[i].orderType;
    		}
    	}
    	
    	return "";
    }
    
    function setSearchCol(arr){
    	
    	if (search != null){
    		var html = "";
    		for (var i = 0 ; i < search.length ; i++){

    			var option = "";
    			for (var z=0;z<arr.length;z++){
            		var selected = "";
            		
            		if (arr[z].val == search[i].col){
            			selected = " selected ";
            		}
            		
            		option += "<option value='" + arr[z].val + "' " + selected + ">" + arr[z].name + "</option>";
            	}
    			
    			
        		html += "<li><a href='javascript:void(0)' class='addCondition' style='padding:5px'>+</a>" +
        				"<select class='searchCol'>" + option + "</select><input type='text' class='searchKeyword' value='" + search[i].keyword + "'></li>";
        	}
    		$(".hbgrid-controll div ul").html(html);
    		
    		
    	}
    	
    	
    }
    
    function isKey(idx){
    	for (var i = 0 ; i < key.length ; i++){
    		if (key[i] == idx){
    			return true;
    		}
    	}
    	return false;
    }
    
    function setDraggable(){
    	$(".hbgrid-colsizer").draggable({
    		axis:"x",
    		start: function() {
    			
    		},
    		drag: function() {
    			var start = $(this).attr("strtpos")*1;
    			var curpos = $(this)[0].offsetLeft;
    			var twidth = $(this).attr("twidth")*1;
    			
    			
    			var idx = $(this).attr("idx");
    				
				$(".hbgrid-table tr").each(function(index){
					$(this).children(":eq(" + idx +")").css("width",twidth - (start - curpos));
					
				});
				
				/*$(".hbgrid-table-clone-header tr").each(function(index){
					$(this).children(":eq(" + idx +")").css("width",twidth - (start - curpos));
					
				});
				
				$(".hbgrid-table-clone-left tr").each(function(index){
					$(this).children(":eq(" + idx +")").css("width",twidth - (start - curpos));
					
				});*/
    			
    			
    			
    		},
    		stop: function() {
    			
    			$(".hbgrid-colsizer-container").remove();
    			var html = makeResizeCol(_header);
    			$container.append(html);
    	    	setDraggable();
    		}
    		});
    }
    
    function makeResizeCol(header){
    	var html = "";
    	var height = $(".hbgrid-table").height();
    	var divTop = $(".hbgrid-table")[0].offsetTop;
    	var divLeft = $(".hbgrid-table")[0].offsetLeft;
    	html += "<div class='hbgrid-colsizer-container' style='top:" + divTop + "px;left:" + divLeft + "px;'>";
    	var left = 0;
    	
    	var len = $(".hbgrid-table tr th").length;
    	for (var i = 0 ; i < len ; i++){
    		
    		var cellw = $(".hbgrid-table tr:eq(0)").children(":eq(" + i + ")").width();
    		
    		left += cellw*1;
    		
    		
    		
    		//html += "<div class='hbgrid-colsizer' idx='" + i + "' strtpos='" + left + "' twidth='" + cellw + "'  style='left:" + left + "px;height:" + height + "px;background:blue'></div>";  
    		html += "<div class='hbgrid-colsizer' idx='" + i + "' strtpos='" + left + "' twidth='" + cellw + "'  style='left:" + left + "px;height:" + height + "px;'></div>";  
    	}
    	
    	html += "</div>";
    	
    	return html;
    	
    }
    
    function makePageNav(data){
    	var divTop = $(".hbgrid-table")[0].offsetTop;
    	var height = $(".hbgrid-table").height();

    	
    	var totalCnt = data.total;
    	var curPage = data.page;
    	var records = data.listCount;
    	
    	var maxPage = Math.floor((totalCnt / records)) + 1;
    	
    	
    	var html = "";
    	
    	html += "<div class='hbgrid-pager-container' style='top:" + (divTop + height) + "px'><ul class='hbgrid-pagecont'>";
    	
    	
    	
    	html += "<li class='hbgrid-pageNum'>";    	
    	
    	
    	
    	var prevPageNum0 = curPage - (curPage % pageCount)-pageCount;
    	if (prevPageNum0 >= 0){
    		html += "<a href='javascript:void(0);' num='" + prevPageNum0 + "' class='hbgrid-num'>";
    	}else{
    		html += "<a>";
    	}
    	html += "≪";
		html += "</a>";
		html += "</li>";
		
		
		
		html += "<li class='hbgrid-pageNum'>";
    	var prevPageNum1 = curPage-1;
    	
    	if (prevPageNum1 >= 0){
    		html += "<a href='javascript:void(0);' num='" + prevPageNum1 + "' class='hbgrid-num'>";
    	}else{
    		html += "<a>";
    	}
		
    	
		html += "＜";
		html += "</a>";
		html += "</li>";
    	
		
		
		
		
		var start = curPage - (curPage % pageCount); 
		
		
		for (var i = start ; i < start + pageCount && i < maxPage; i++){
    		
			
			
    		var activeClass="";
    		if (i == curPage){
    			 activeClass="hbgrid-active";
    		}
    		
    		html += "<li class='hbgrid-pageNum'>";
    		html += "<a href='javascript:void(0);' num='" + i + "' class='hbgrid-num " + activeClass + "'>";
    		html += (i+1);
    		html += "</a>";
    		html += "</li>";
    		
    		
    	}
		
		html += "<li class='hbgrid-pageNum'>";		
		var nextPageNum1 = curPage+1;    	
    	if (nextPageNum1 < maxPage){
    		html += "<a href='javascript:void(0);' num='" + nextPageNum1 + "' class='hbgrid-num'>";
    	}else{
    		html += "<a>";
    	}
    	html += "＞";
		html += "</a>";
		html += "</li>";
		html += "<li class='hbgrid-pageNum'>";
		var nextPageNum0 = (curPage - (curPage % pageCount)) + pageCount;
		
		
    	if (nextPageNum0 < maxPage){
    		html += "<a href='javascript:void(0);' num='" + nextPageNum0 + "' class='hbgrid-num'>";
    	}else{
    		html += "<a>";
    	}
		html += "≫";
		html += "</a>";
		html += "</li>";
		
		
		
		
		
		
		
    	html += "</ul>";
    	html += "</div>";
   	 
    	return html;
   	 
    }
    
    function fail(data){
    	console.log("hbgrid getData fail...");
    }
    
    function getData(pageNum){
    	
    	
    	
    	var obj = {};
    	obj.page = pageNum;
    	obj.listCount = listCount;
    	obj.pid = pid;
    	obj.search = search; 
		obj.orders = orders;
	
    	
    	$.ajax({
    		type: "post",
    		url: bodyUrl,
    		data: JSON.stringify(obj),
    		dataType: "json",
    		contentType: "application/json",
    		accept:"application/json",
    		async : true,
    		success:makeTable,
    		error:fail
    	});
    	
    	
    	
    }
    
    
    
})(jQuery);