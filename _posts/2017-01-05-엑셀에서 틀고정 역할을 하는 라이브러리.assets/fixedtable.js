(function($) {
	
	
	var delimstr;
	var addString;
	var clickmethod;
	var cols;
	var str;
	var usetable;
	var deco;
	
	
	
    
    $.fn.delimiter = function(opts) {    	
    	delimstr = opts.delimstr;
    	addString = opts.addString;
    	clickmethod = opts.clickmethod;
    	cols = parseInt(opts.cols);
    	usetable = opts.usetable;
    	deco = opts.deco;
    	str = $(this).text();    	
    	var arrStr = str.split(delimstr);
    	$(this).html(makeHtml(arrStr));
    }
    
    function makeHtml(arrStr){
    	
    	var tableOpen = "<table border=0>";    
    	var trOpen = "<tr>";
    	var tdOpen = "<td>";    	
    	var trClose = "</tr>";
    	var tdClose = "</td>";
    	var tableClose = "</table>"
    	
    	if (!usetable){
    		var tableOpen = "";    
        	var trOpen = "";
        	var tdOpen = "";    	
        	var trClose = "";
        	var tdClose = "";
        	var tableClose = ""
    	}
    	
    	var html = tableOpen;    	
    	var len = arrStr.length;
    	for (var a = 0 ; a < len ; a+=cols){
    		//console.log(a);
    		html += trOpen;
    		for (var i=a;i<a+cols;i++){
        		html += tdOpen;    	
        		if (i < len){
        			html += deco + "<a href='javascript:void(0)' onclick=\"" + clickmethod + "('" + arrStr[i] + "','" + addString + "')\">" + arrStr[i] + "</a>";
        		}        		
        		html += tdClose;        		
        	}
    		html += trClose;
    	}
    	html += tableClose;
    	
    	
    	
    	return html.substr(deco.length);
    }
    
    
    
    
})(jQuery);