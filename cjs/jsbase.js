
//---------------------------------------------------
// *** 基础函数2
//--------------------------------------------------- \

/*
String.prototype.replaceAll = function (findText, repText){
    var newRegExp = new RegExp(findText, 'gm');
    return this.replace(newRegExp, repText);
}*/

// 调试信息
function jsLog(msg,color){
	// ?? debug模式
	if(window.console){ 
		var cstr = '';
		if(color){
			var cstr = 'color:'+color;
			msg = '%c'+msg;
		}
		console.log(msg,cstr);
	}else{
		;//	
	}
}

function rndDate(min,max){
    
    if(',m,d,d1,d2,w,'.indexOf(max)>0){
        var D = new Date();
        var m = D.getMonth()+1;
        var d = D.getDate();
        //var h = D.getHours();
        //var m = D.getMinutes();
        //var s = D.getSeconds();
        var w = D.getDay(); //返回值是 0（周日） 到 6（周六）
        if(max=='d1'){ //取个位:0~9 或 1~10; 0为0或10
            var re = d % 10;
            if(min==1 && re ==0) re = 10;
            return re;
        }
		if(max=='d2'){ //取十位:0,1,2 或 1,2,3
            if(d>20){ re = 3; }
			else if(d>10) { re = 2; }
			else { re = 1; } 
			if(min==0) re--;
            return re;
        } 
		/*
        if(max=='d2'){ //0,1,2,3
            var re = Math.floor(d/10);
            //if(re==3) re = 2;
            return re + min;
        }*/
        if(max=='w'){ //0~6 或 1~7; 周一为开始日
            var re = w; 
            if(re==0) re = 7; //1~7
            if(min==0) re--; //0~6
            return re;
        }         
        eval("var re = "+max+";");   
        if(min==0) re--;
        return re;
    }else{
        return Math.floor(min+Math.random()*(max-min));
    }  
}

function jsGuid(){ 
	return (new Date).getTime() + Math.random().toString();
}
function urlRnd(url,fix){
	if(!fix) fix = '__rndUrl__';
	guid = jsGuid();
	url += (url.indexOf('?')>0 ? '&' : '?')+fix+'='+guid; 
	return url;
}

// Js动态获取js脚本
function jsImps(url,callback){     
	url = urlRnd(url);
	var head = document.getElementsByTagName("head")[0];
	var script = document.createElement('script');
	script.onload = script.onreadystatechange = script.onerror = function (){
		if (script && script.readyState && /^(?!(?:loaded|complete)$)/.test(script.readyState)) return;
		script.onload = script.onreadystatechange = script.onerror = null;
		script.src = '';
		script.parentNode.removeChild(script);
		script = null;
		if(callback){ 
			var func = callback + (callback.indexOf('()')<=0 ? '' : '()');
			eval(""+func+";");
		}
	}
	script.charset = "utf-8";
	script.src = url;
	try { head.appendChild(script); } 
	catch (exp) {}
}

// Js动态获取data内容
function jsHttp(url,callback){
    url = urlRnd(url);
	var http = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Msxml2.XMLHttp"); 
    http.open("get", url, true);  
    http.onreadystatechange = function(){
		if (http.readyState == 4) {  
			if (http.status == 200) {  
				__httpData__ = http.responseText; //(__httpData__)固定写法
				if(callback){ 
					var func = callback + (callback.indexOf(')')<=0 ? '()' : ''); 
					eval(""+func+";");
				}else{
					console.log(http.responseText);
				}
			}  
		}  
	} 
    http.send(null); 
}

// 窗口大小-winSize() --- quirksmode.org
function winSize(){
	var xScroll, yScroll;
	if (window.innerHeight && window.scrollMaxY) {	
		xScroll = document.body.scrollWidth;
		yScroll = window.innerHeight + window.scrollMaxY;
	} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
		xScroll = document.body.scrollWidth;
		yScroll = document.body.scrollHeight;
	} else { // Explorer Mac...would also work in IE6 Strict, Mozilla and Safari
		xScroll = document.body.offsetWidth;
		yScroll = document.body.offsetHeight;
	}
	var winWidth, winHeight;
	if (self.innerHeight) {	// all except Explorer
		winWidth = self.innerWidth;
		winHeight = self.innerHeight;
	} else if (document.documentElement && document.documentEl
