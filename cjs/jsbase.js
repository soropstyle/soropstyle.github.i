
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
	} else if (document.documentElement && document.documentElement.clientHeight) { // IE6 Strict Mode
		winWidth = document.documentElement.clientWidth;
		winHeight = document.documentElement.clientHeight;
	} else if (document.body) { // other Explorers
		winWidth = document.body.clientWidth;
		winHeight = document.body.clientHeight;
	}	
	if(yScroll < winHeight){ 
		pageHeight = winHeight;
	} else { 
		pageHeight = yScroll;
	}
	if(xScroll < winWidth){ 
		pageWidth = winWidth;
	} else {
		pageWidth = xScroll;
	}
	var obj = {}; 
	obj.pageWidth = pageWidth;
	obj.pageHeight = pageHeight;
	obj.winWidth = winWidth;
	obj.winHeight = winHeight;
	return obj;
}

//---------------------------------------------------
// *** 基础函数
//--------------------------------------------------- \

var jsElm = {}; //通过id得到web相关元素
jsElm.pdID = function(id){ // 获取iframe父窗口id对应的web元素
	return typeof id == 'string' ? parent.document.getElementById(id) : id; 
}
jsElm.ifID = function(id){ // 获取iframe，id为iframe的对应ID
	return document.getElementById(id).contentWindow;
	//return window.frames[id]; //id为name值
}
jsElm.jeID = function(id){ // 通过id得到web元素
	return typeof id == 'string' ? document.getElementById(id) : id;
}

// 查找e元素的前一个/下一个/父元素,且元素名称为tag
function jeFind(e,tag,type) {
	e = jsElm.jeID(e); var f;
	if(type=='prev') f = e.previousSibling;
	else if(type=='next') f = e.nextSibling;
	else f = e.parentNode; 
	try{
		while(f.nodeType==3){
			if(type=='prev') f = f.previousSibling;
			if(type=='next') f = f.nextSibling;
		}
	}catch(ex){ return null; }
	if(f.tagName.toLowerCase()==tag) return f;
	else return jeFind(f,tag,type);
}
// 显示/隐藏e元素
function jeShow(xID){
  var elm = jsElm.jeID(xID); 
  if(!elm) return;
  if(elm.style.display=='none') { elm.style.display = ''; }
  else { elm.style.display = 'none'; } 
} 
// 居中显示div，xOffset:百分比
function jeCenter(xID,xOffset){
	var elm = jsElm.jeID(xID); 
	var oSize = jeSize(xID);
	var wSize = winSize();
	var top=0,left=0;
	top = (wSize.winHeight-oSize.height)/2;
	left = (wSize.winWidth-oSize.width)/2;
	if(xOffset) top = top - parseInt(top*xOffset/100);
    elm.style.top = top + "px";
    elm.style.left = left + "px";
}
// 元素大小
function jeSize(xID){
	var elm = jsElm.jeID(xID); 
	var obj = {};
	obj.width = elm.offsetWidth;
	obj.height = elm.offsetHeight;
	return obj;
} 
//获取元素的位置 
function jePos(obj) { 
	var pos = $('#'+obj).offset();
	return [pos.left,pos.top];
	var obj = jsElm.jeID(obj); 
	if (obj == null) return null; 
	var posLeft = obj.offsetLeft; 
	var posTop = obj.offsetTop; 
	//while (obj != null && obj.offsetParent != null && obj.offsetParent.tagName != "BODY") { 
		//posLeft = posLeft + obj.offsetParent.offsetLeft; 
		//posTop = posTop + obj.offsetParent.offsetTop; 
	//} 
	return [posLeft,posTop]; 
}; 

function isObj(obj,type){ 
    var cons = obj.constructor.toString();
	if(type=='a') type='Array';
	if(type=='b') type='Boolean';
	if(type=='f') type='Function';
	if(type=='n') type='Number';
	if(type=='s') type='String';
	if(!type) type = 'Object';
	return (cons.indexOf(type)!= -1);
}
// 正则测试str,如判断ie6浏览器
function jsTest(c,str) {  
	if(!str) str = navigator.userAgent; 
	if(!c) c = 'MSIE 6';
	else if(!isNaN(c)) c = 'MSIE '+c; 
	var pos = str.indexOf(c);
	return pos<0 ? false : true; //reg.test(str);
}
// jsKeys
function jsKey(fid){
	var a = new Array("[",']',' ','/','-','.','&','=','#','?');
	var b = new Array("_",'_','_','_','_','_','_','_','_','_');
	for(var i=0;i<a.length;i++){
		fid = fid.replace(a[i],b[i]).replace(a[i],b[i]).replace(a[i],b[i]); 
	}
	return fid;
}
// jsReplace
function jsRep(str){
	var a = new Array("'",'"','\n','\r');
	var b = new Array("\\'",'\\"','\\n','\\r');
	for(var i=0;i<a.length;i++){
		str = str.replace(new RegExp(a[i],'g'),b[i]);
	}
	return str;
}
// removeHTMLTag
function jsText(str){ 
	str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
	str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
	//str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
	str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
	return str;
}
// 获取文件名
function fileName(){
	var url = this.location.href
	var pos = url.lastIndexOf("/");
	if(pos == -1){
	   pos = url.lastIndexOf("\\")
	}
	var filename = url.substr(pos +1)
	return filename;
}
// 获取HTML页面参数 flag 为1 获取详细参数
function urlPara(key){
	return (new RegExp("([^(&|\?)]*)" + key + "=([^(&|#)]*)").test(location.href+"#")) ? RegExp.$2 : null;
}

function mgetStore(key,fmt){
	var locStore = new multiStore('local');
	var k = _cbase.ck.ckpre+key;
	var v = locStore.get(k);
	v = v ? v : '';	 
	if(!fmt){ 
		v = parseInt(v); 
		v = isNaN(v) ? 0 : v;
	}
	return v;
}

// sobj,skey,ckey,clife(天),cdata
function mlifeStore(sobj,skey,ckey,clife,cdata){
	var s_data = sobj.get(skey); if(!s_data || s_data.length<24) s_data = '_split_';
	var stamp = Date.parse(new Date())/1000; 
	if(cdata){ s_data = "/_split_start_("+ckey+")_flag-rems/("+cdata+")/_split_end_("+stamp+")_flag-stamp/"+s_data; }                                     
	var s1='', p1, p2, a = s_data.split('/_split_start_('); 
	s_tmp = ''; var text,tarr,stime=0,stnow=0; 
	for(var i=0;i<a.length;i++){ 
		text = '/_split_start_('+a[i]; 
		if(text.length<24) continue;
		if(s1.length>0 && text.indexOf(""+ckey+")_flag-rems/(")>0){ continue; }
		tarr = text.match(/\_split\_end\_\((\d+)\)/); 
		stime = tarr ? parseInt(tarr[1]) : 0; 
		if(stamp-stime<clife*86400){ s_tmp += text; }
		if(text.indexOf(""+ckey+")_flag-rems/(")>0){
			p1 = text.indexOf('_flag-rems/(');
			p2 = text.indexOf(')/_split_end_(');
			s1 = text.substring(p1+12,p2); 
			stnow = stime;
		}
	} 
	if(s_tmp.length<24) s_tmp = '_split_';
	sobj.set(skey,s_tmp);
	return new Array(s1,stnow);
}

/**
 * @class multiStore
 * @author Peace@08cms.com
 * @参考: http://www.cnblogs.com/zjcn/archive/2012/07/03/2575026.html#comboWrap
 * Demo: 
	var locStore = new multiStore('local');
	var sesStore = new multiStore('session');
	locStore.set('aa1','bb1');
	var tt1 = locStore.get('aa1');
	console.log(tt1);
	sesStore.set('aa2','bb2');
	var tt2 = sesStore.get('aa2');
	console.log(tt2);
 */
function multiStore(flag){ // local,session
	this.parFlag = flag=='session' ? 'sessionStorage' : 'localStorage';
	this.parStore = flag=='session' ? window.sessionStorage : window.localStorage;
	// 是否支持localStorage/sessionStorage
	this.ready = function(){ 
		return (this.parFlag in window) && (window[this.parFlag] !== null); 
	};
	// 扩展 : 最多设置保存mnum个key(如最近浏览历史记录)
	// demo: locStore|sesStore.setGroup('{$ckpre}chid{$chid}','{aid}',10); // ('_auto_dev52_chid2','542350',10); 
	// ??? 一条记录存储更多信息? 这里没有处理, 统一规范? 目前要扩展, 如类似信息【id|529026;time|14-07-2110:50】
	this.setGroup = function(keyid,nowkey,mnum){
		if(nowkey.length==0) return;
		if(!mnum) mnum = 10;
		var oldkeys = this.get(keyid); 
		if(!oldkeys){ 
			var keystr = nowkey;
		}else{ 
			var oldarr = oldkeys.split(','); 
			var keystr = nowkey; unum = 1;
			for(var i=0;i<oldarr.length;i++){ 
				if(oldarr[i]==nowkey || oldarr[i].length==0) continue;
				if(unum<mnum){
					keystr += ','+oldarr[i];	
					unum++;
				}else{
					break;	
				}
			}
		}
		keystr = keystr.replace(/[^0-9A-Za-z_\.\-\:\,\|\;]/g,''); // setGroup内容字符限制 \=\)\(\]\[  善用ascii码
		this.set(keyid,keystr);
	};
	// 扩展 : 初始化信息(不支持localStorage/sessionStorage)
	// demo: locStore|sesStore.initMessage('itemList','<li class="none">不支持localStorage/sessionStorage(本地存储)</li>')
	this.initMessage = function(id,msg){
		var canFlag = this.ready();
		if(!canFlag) document.getElementById(id).innerHTML = msg;
	};
	// 设置值
	this.set = function(key, value){
		//在iPhone/iPad上有时设置setItem()时会出现诡异的QUOTA_EXCEEDED_ERR错误；这时一般在setItem之前，先removeItem()就ok了
		if( this.get(key) !== null )
			this.remove(key);
		this.parStore.setItem(key, value);
	};
	// 获取值 查询不存在的key时，有的浏览器返回undefined，这里统一返回null
	this.get = function(key){
		if(!this.parStore) return null;
		var v = this.parStore.getItem(key);
		return v === undefined ? null : v;
	};
	this.each = function(fn){
		var n = this.parStore.length, i = 0, fn = fn || function(){}, key;
		for(; i<n; i++){
			key = this.parStore.key(i);
			if( fn.call(this, key, this.get(key)) === false )
				break;
			//如果内容被删除，则总长度和索引都同步减少
			if( this.parStore.length < n ){
				n --;
				i --;
			}
		}
	};
	this.remove = function(key){
		this.parStore.removeItem(key);
	}
	this.clear = function(){
		this.parStore.clear();
	};
	
}

//---------------------------------------------------
// *** // js Config
//--------------------------------------------------- \

// 动态导入Js/CSS文件 使用 命名空间方式 
function jsHImp(file,type){     
	var code,ext = file.substr(file.length-4); 
	if(ext=='.css' && !type){
	   code = "<link rel='stylesheet' type='text/css' href='{file}'>";
	}else{ 
	   code = "<script type='text/javascript' src='{file}'></script>"; 
	}
	code = code.replace('{file}',file);
	document.write(code);
}

var _cbase={}; _cbase.run={}; _cbase.ck={}; _cbase.mod={};

_cbase.ck.ckpre = '00app12_';
_cbase.ck.ckdomain = '';
_cbase.ck.ckpath = '/';

_cbase.run.userag = navigator.userAgent;
_cbase.run.ie678 = !-[1,]; //console.log(_cbase.run.ie678);

_cbase.mod.modids = 'learn,mlabs,about,health';
_cbase.mod.names = '健康第一,学无止境,努力工作,积极生活';

_cbase.run.scripts = document.getElementsByTagName("script");
_cbase.run.snow = _cbase.run.scripts[_cbase.run.scripts.length-1];  //因为当前dom加载时后面的script标签还未加载，所以最后一个就是当前的script
_cbase.run.surl = _cbase.run.snow.src.toString().split('?'); 
_cbase.run.sbase = _cbase.run.surl[0].replace('/cjs/jsbase.js','/'); //console.log(_cbase.run.sbase);
_cbase.run.urlpub    = 'http://yscode.duapp.com/'; // http://yscode.duapp.com/,http://yscode.txjia.com/
_cbase.run.urlserver = 'http://txmao.txjia.com/root/plus/yscode/';
_cbase.run.urldown   = 'http://pan.baidu.com/share/home?uk=3191979020#';
_cbase.run.urlweb    = 'http://yscode.txjia.com/';
_cbase.run.jqver = _cbase.run.ie678 ? 'jquery-1.x.js' : 'jquery-2.x.js'

if(_cbase.run.snow.src.toString().indexOf('noimp')<=0){
	jsHImp(_cbase.run.sbase + 'cjs/'+_cbase.run.jqver);
	jsHImp(_cbase.run.sbase + 'cjs/stpub.css');
	jsHImp(_cbase.run.sbase + 'cjs/stmob.css');
}
if(_cbase.run.snow.src.toString().indexOf('jqimp')>0){
	jsHImp(_cbase.run.sbase + 'cjs/'+_cbase.run.jqver);
}
if(_cbase.run.snow.src.toString().indexOf('jqicon')>0){
	jsHImp(_cbase.run.sbase + 'cjs/stpub.css');
}

function fixUrls(ids){  
	if(ids){
		var a = ids.split(',');	
	}else{
		var a = document.getElementsByTagName('a');
	}
	for(var i=0;i<a.length;i++){
		var e = jsElm.jeID(a[i]); 
		e.href = fixUrlk(e.href,'urlpub');
		e.href = fixUrlk(e.href,'urlserver');
		e.href = fixUrlk(e.href,'urldown');
		e.href = fixUrlk(e.href,'urlweb');
		e.href = e.href.replace('.com//','.com/');
	}
}
function fixUrlk(s,k){
	var fk = '_'+k+'_';
	s = s.replace('http://'+fk,eval('_cbase.run.'+k));
	s = s.replace(fk,eval('_cbase.run.'+k));
	return s; 
}