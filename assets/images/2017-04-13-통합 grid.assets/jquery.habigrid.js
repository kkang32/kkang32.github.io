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
	var searchCol;
	var searchKeyword;
	var pid;
	var $container;
	var pageCount = 10;
	var _header;
	var fixColnum;
	var selectRow;
	var key;
	var hidekey;
	var _data;
    
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
    		
    		selectRow(data);
    		
    	});
    	
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
    	
    	
    	
    	
    	
    	html += "<table border='1' class='hbgrid-table' style='position:absolute;left:" + tableleft + "px'>";
    	html += "<thead>";
    	html += "<tr>";
    	for (var i = 0 ; i < _header.length ; i++){
    		var isk = isKey(i);
    		if (hidekey && isk){
    			continue;
    		}
    		
    		var width = _header[i]["colWidth"];
    		html += "<th style='width:" + width + "px'>"; 
    		html += _header[i]["colViewNm"];
    		html += "</th>";
    	}
    	html += "</tr></thead>";
    	
    	
    	html += "<tbody>";
    	//lefthtml += "<tbody>";
    	for (var i = 0 ; i < data.rows.length ; i++){
	    	html += "<tr>";
	    	//lefthtml += "<tr>";
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
    	//$("#cloneleft").html(lefthtml);
    	html = makePageNav(data);
    	$container.append(html);
    	
    	
    	
    	html = makeResizeCol(_header);
    	$container.append(html);
    	setDraggable();
    	
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
    	for (var i = 0 ; i < header.length ; i++){
    		
    		var cellw = $(".hbgrid-table tr:eq(0)").children(":eq(" + i + ")").width();
    		
    		left += cellw*1;
    		
    		
    		
    		html += "<div class='hbgrid-colsizer' idx='" + i + "' strtpos='" + left + "' twidth='" + cellw + "'  style='left:" + left + "px;height:" + height + "px;background:#0100FF'></div>";   
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
    	obj.searchCol = searchCol;
    	obj.searchKeyword = searchKeyword; 
    	
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