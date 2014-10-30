;(function(namespace,getEmarkORblooean){
if(window[namespace]) return;
var zjf={
    $$:function(oOrId){var el=oOrId; if(typeof oOrId=='string') el=document.getElementById(oOrId)||null; return el; },
    $tag:function(tagname,oOrId){var o=oOrId?zjf.$$(oOrId):document; return o.getElementsByTagName(tagname); },
    $son:function(oOrId,subsTag_or_SubsCss_or_BothTagCss){//arguments[1]:'div' or '.class' or 'div.class'
        var arr=[] , o=zjf.$$(oOrId); if(!o.hasChildNodes()) return arr; var sons_0= o.childNodes , sons=[] ;
        for(var i=0,len=sons_0.length;i<len;i++){ if(sons_0[i].nodeType==1) sons.push(sons_0[i]); }
        if(subsTag_or_SubsCss_or_BothTagCss){
            if(subsTag_or_SubsCss_or_BothTagCss.indexOf('.')<0){//subsTag
                for(var i= 0,len=sons.length;i<len;i++){ if(sons[i].tagName.toLowerCase()==subsTag_or_SubsCss_or_BothTagCss) arr.push(sons[i]); }
            }
            else if(subsTag_or_SubsCss_or_BothTagCss.indexOf('.')==0){//SubsCss
                var css=subsTag_or_SubsCss_or_BothTagCss.substring(1);
                for(var i= 0,len=sons.length;i<len;i++){ if(zjf.hasClass(sons[i],css)) arr.push(sons[i]); }
            }
            else{//BothTagCss
                var at=subsTag_or_SubsCss_or_BothTagCss.indexOf('.') , left=subsTag_or_SubsCss_or_BothTagCss.substring(0,at) , right=subsTag_or_SubsCss_or_BothTagCss.substring(at+1) ;
                for(var i= 0,len=sons.length;i<len;i++) { if(sons[i].tagName.toLowerCase()==left && zjf.hasClass(sons[i],right)) arr.push(sons[i]); }
            }
            return arr;
        }
        return sons;
    },
    $class:function(byCss,oOrId,byTag){//back elements array
        var tag=byTag?byTag:'*' , list=zjf.$tag(tag,oOrId) , arr=[];
        for(var i= 0,len=list.length;i<len;i++){ if(zjf.hasClass(list[i],byCss)) arr.push(list[i]); }
        return arr;
    },
    hasClass:function(o,str){ if(!o.className) return false; var clss= ' '+o.className+' '; return clss.indexOf(' '+str+' ')>=0; },
    addClass:function(str,o){ var oldcss= o.className; if(!oldcss) o.className=str; else{ oldcss=' '+oldcss+' '; if(oldcss.indexOf(' '+str+' ')< 0 ){ oldcss+=str; } oldcss=zjf.trim(oldcss); o.className=oldcss; } },
    removeClass:function(str,o){ var oldcss= o.className; if(oldcss){ oldcss=' '+oldcss+' '; if(oldcss.indexOf(' '+str+' ')>= 0 ){ oldcss=oldcss.replace(' '+str+' ',' '); } oldcss=zjf.trim(oldcss); o.className=oldcss; } },
    bind:function(obj,eType,fn){ if(obj.addEventListener) obj.addEventListener(eType, fn, false); else if (obj.attachEvent)  obj.attachEvent('on' + eType, fn); else  obj['on' + eType] = fn; },
    unbind:function(obj,eType,fn){ if(obj.removeEventListener) obj.removeEventListener(eType, fn, false); else if (obj.detachEvent)  obj.detachEvent('on' + eType, fn); else  obj['on' + eType] = fn; },
    bindLoad:function(fn){ if(window.attachEvent) window.attachEvent("onload",fn); else window.addEventListener("load", fn, false); },
    bindList:function(list,fn){ for(var i=0,l=list.length;i<l;i++){ fn.call(list[i],i); } },
    trim:function(str,num){ //-num：left '' +num:right '' 0 or no :both
        if(!str) return '';
        if(!num) return str.replace(/(^\s*)|(\s*$)/g, "");
        return num<0?str.replace(/(^\s*)/g,""):str.replace(/(\s*$)/g,"");
    },
    ie:function(){
        var v=3, div=document.createElement('div'), i=div.getElementsByTagName('i');
        do{ div.innerHTML='<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->'; } while(i[0]);
        return v>4?v:0;
    }(),
    ie_:function(){/*@cc_on return (document.documentMode||( document.compatMode == "CSS1Compat" ? "XMLHttpRequest" in window ? @_jscript_version*10-50 : 6 : 5)) @*/}(),
    ready:(function(){
        var doc=document, branch=document.addEventListener?'w3c':'ie678'; //( old : ) branch = '\v' == 'v' ? 'ie' : 'w3c';
        var _domReady={
            done: false,// When _domReady.done is true，all 'fn' will be invoked immediately.
            fn: [],// The stack which all functions will be pushed into
            push: function(fn){// push callback functions
                if (!_domReady.done){// only bind once
                    if(_domReady.fn.length===0) _domReady.bind();
                    _domReady.fn.push(fn);
                }
                else fn();
            },
            ready: function () {// The Real DOMContentLoaded Callback Function
                _domReady.done = true;// Flag DOMContentLoaded Event was Done over
                var fn = _domReady.fn;
                for (var i = 0, l = fn.length; i < l; i++) fn[i]();
                _domReady.unbind();
                _domReady.fn = null;
            },
            bind:{
                w3c:function(){ doc.addEventListener('DOMContentLoaded', _domReady.ready, false); },
                ie678: function () {//IE的监听方法参考了这篇文章：http://javascript.nwbox.com/IEContentLoaded/
                    var done = false,
                        init=function(){// only fire once
                            if(!done){ done=true; _domReady.ready(); }
                        };
                    (function(){// polling for no errors
                        try{doc.documentElement.doScroll('left');} catch(e){ setTimeout(arguments.callee, 20); return; }
                        init();// no errors, fire
                    })();
                    doc.onreadystatechange=function(){// trying to always fire before onload
                        if (doc.readyState=='complete'){ doc.onreadystatechange = null; init(); }
                    };
                }
            }[branch],
            unbind: {
                w3c: function(){ doc.removeEventListener('DOMContentLoaded', _domReady.ready, false); },
                ie678: function(){ /* Nothing to do */ }
            }[branch]
        };
        return _domReady.push;
    })(),
    extend:function(o1,o2){o2=o2?o2:{}; for(var p in o2) o1[p]=o2[p]; return o1;},
    deepCopy:function(p,c){
		var c=c||{};
		for(var i in p){
			if(typeof p[i]==='object'){
				c[i]=(p[i].constructor===Array)?[]:{};
				zjf.deepCopy(p[i], c[i]);
			}else{c[i] = p[i];}
		}
		return c;
	},
	deepCopy_:function(item){
		if(!item){return item;}
		var types=[Number,String,Boolean],result;
		types.forEach(function(type){if(item instanceof type){result=type(item);}});
		if(typeof result=="undefined"){
			if(Object.prototype.toString.call(item)==="[object Array]"){
				result=[];
				item.forEach(function(child,index,array){result[index]=zjf.deepCopy_(child);});
			}
			else if(typeof item=="object"){
				if(item.nodeType&&typeof item.cloneNode=="function"){var result=item.cloneNode(true);}
				else if(!item.prototype){
					result={};
					for(var i in item){result[i]=zjf.deepCopy_(item[i]);}
				}
				else{
					if(false&&item.constructor){result=new item.constructor();}
					else{result=item;}
				}
			}
			else{result=item;}
		}
		return result;
	},
    computedStyle:function(o,styleName){
        var newname=styleName;
        if(styleName=='float'||styleName=='cssFloat'||styleName=='styleFloat'){ if('cssFloat' in o.style) newname='cssFloat'; else if('styleFloat' in o.style) newname='styleFloat';}
        if(o.currentStyle) return o.currentStyle[newname];
        else return document.defaultView.getComputedStyle(o,null)[newname];
    }
};
zjf.ui={
    alpha:function(){
        return{ //value：0~1
            set:function(elm,value){if(!elm) return; if(zjf.ie>0&&zjf.ie<=8) elm.style.filter='alpha(opacity='+value*100+')'; else elm.style.opacity=value;},
            get:function(elm){}
        }
    },
    show:function(o){o.style.display=''},
    hide:function(o){o.style.display='none'},
    slide:{},
    fade:function(){},
    overlay:function(){},
    toggleDisplay:function(o,callback){ if(!o) return; o.style.display=='none'?o.style.display='': o.style.display='none';if(callback)callback();},
    isVisible:function(o){ //do by as property: Dispaly and Visibility
        var dis=zjf.computedStyle(o,'display') , vis=zjf.computedStyle(o,'visibility') , dis2=vis2=true;
        //  dis：block  none inline inline-block list-item table-header-group table-footer-group
        //  vis：visible collapse hidden
        if(dis=='none') dis2=false ; else dis2=true;
        if(vis=='visible') vis2=true;  else if(vis=='hidden'||vis=='collapse') vis2=false;
        return dis2&&vis2;
    },
    tabs:function(list1,list2,curTabClass,eventype,isInit){
        eventype=eventype?eventype:'mouseover'; isInit=isInit===undefined?true:isInit;
        zjf.bindList(list1,function(i){
            zjf.bind(this,eventype,function(){
                zjf.bindList(list2,function(){this.style.display='none'}); list2[i].style.display='';
                if(curTabClass){ zjf.bindList(list1,function(){zjf.removeClass(curTabClass,this)}); zjf.addClass(curTabClass,this); }
            });
        });
        if(isInit){
            zjf.bindList(list2,function(){this.style.display='none'}); list2[0].style.display='';
            if(curTabClass){ zjf.bindList(list1,function(){zjf.removeClass(curTabClass,this)}); zjf.addClass(curTabClass,list1[0]); }
        }
    },
    tabs2:function(o1str,o2str,curTabClass,eventype,isInit){
        // o1str: 'id1'   or    obj    or    'id1>p'    or    'id1>.cur'    or    'id1>span.cur'
        // o2str: 'id2'   or    obj    or    'id2>p'    or    'id2>.cur'    or    'id2>span.cur'
        var getlist=function(sss){
            var list=[],s1=sss.split('>');
            if(s1.length<=1) list=zjf.$son(s1[0]);
            else{
                var s2=s1[1].split('.');
                if(s2[1]) list=zjf.$class(s2[1],s1[0],s2[0]);
                else list=zjf.$tag(s2[0],s1[0]);
            }
            return list;
        };
        zjf.ui.tabs(getlist(o1str),getlist(o2str),curTabClass,eventype,isInit);
    },
    triggerMouseEvent:function(type,o){
        if(o.fireEvent) o.fireEvent("on"+type);
        else if(o.dispatchEvent){ var e=document.createEvent('MouseEvent');  e.initEvent(type,false,false);  o.dispatchEvent(e); }
    },
    hover:function(){},
    menuStep:function(){},
    doScroll:function(){},
    picFocus:function(){},
    offsets:function(ele){
        var visble=zjf.computedStyle(ele,'display'); if(visble=='none') ele.style.display='';
        //------------offset和client都不包括外边距，都包括内边距和内容区。。。元素可见时有效。-------------------
        var result= {
            //offset包含边框宽及滚动条（可见的）
            offsetL:ele.offsetLeft,//相对offsetParent左偏移,例如td的offsetParent=table
            offsetT:ele.offsetTop,//相对offsetParent上偏移
            offsetW:ele.offsetWidth,
            offsetH:ele.offsetHeight,
            //client不包含边框，滚动条（如果有）占用空间不计算在内
            clientW:ele.clientWidth,
            clientH:ele.clientHeight,
            //滚动内容的总宽高度
            scrollW:ele.scrollWidth,
            scrollH:ele.scrollHeight,
            //滚动位差
            scrollT:ele.scrollTop,//可写
            scrollL:ele.scrollLeft//可写
        };
        if(visble=='none') ele.style.display='none';
        return result;
    },
    offsetOfPage:function(ele){
        var scrollTop=document.documentElement.scrollTop , scrollLeft=document.documentElement.scrollLeft;
        if(ele.getBoundingClientRect){
            if(typeof arguments.callee.offset!='number'){
                var temp=document.createElement('div');
                temp.style.cssText='position:absolute;left:0;top:0;';
                document.body.appendChild(temp);
                arguments.callee.offset=-temp.getBoundingClientRect().top-scrollTop;
                document.body.removeChild(temp);
                temp=null;
            }
            var rect=ele.getBoundingClientRect() , offset=arguments.callee.offset;
            return {
                left:rect.left+offset,
                right:rect.right+offset,
                top:rect.top+offset,
                bottom:rect.bottom+offset
            };
        }
        else{
            var actualLeft=ele.offsetLeft , current=ele.offsetParent , actualTop=ele.offsetTop;
            while (current!=null){ actualLeft+=current.offsetLeft; current=current.offsetParent; }
            current=ele.offsetParent;
            while(current!=null){ actualTop+=current.offsetTop; current=current.offsetParent; }
            return {
                left:actualLeft-scrollLeft,
                right:actualLeft+ele.offsetWidth-scrollLeft,
                top:actualTop-scrollTop,
                bottom:actualTop+ele.offsetHeight-scrollTop
            };
        }
    },
    pageSize:function(){
        var w=window.innerWidth,h=window.innerHeight,docm=document.compatMode=='CSS1Compat'?document.documentElement:document.body;
        if(typeof w!='number'){ w=docm.clientWidth; h=docm.clientHeight;}
        return {
            win:{width:w ,height:h},
            doc:{height:Math.max(docm.scrollHeight,docm.clientHeight),width:Math.max(docm.scrollWidth,docm.clientWidth)}
        }
    },
    flash:function(Path,Width,Height,Transparent){
        var Temp,T="";Width=Width?Width:'100%';Height=Height?Height:'100%';
        Temp='<object classid="clsid:D27CDB6E-AE6D-11CF-96B8-444553540000" id="FlashH" codebase="" border="0" width="'+Width+'" height="'+Height+'">';
        Temp+='<param name="movie" value="'+Path+'"/>';
        Temp+='<param name="quality" value="High"/>';
        Temp+='<param name="scale" value="ExactFit"/>';
        if (Transparent) {Temp+=' <param name="wmode" value="transparent"/>';T='wmode="transparent"';}
        Temp+='<embed src="'+Path+'" pluginspage="" type="application/x-shockwave-flash" name="FlashH" width="'+Width+'" height="'+Height+'" quality="High"'+T+' scale="ExactFit"/>';
        Temp+='</object>';
        return Temp;
    }
};
zjf.tool={
    addToFavor:function(sURLs, sTitles){
        var sURL=sURLs?sURLs:window.location , sTitle=sTitles?sTitles:document.title ;
        try { window.external.addFavorite(sURL, sTitle);  }
        catch (e) {
            try { window.sidebar.addPanel(sTitle, sURL, ""); }
            catch (e){ alert("加入收藏失败，请使用Ctrl+D进行添加"); }
        }
    },
    setHomePage:function(obj,url){
        var vrl=url?url:window.location;
        try{
            if(obj){ obj.style.behavior='url(#default#homepage)';obj.setHomePage(vrl);  }
            else{ BASEBody.style.behavior='url(#default#homepage)' ; if(!(BASEBody.isHomePage(vrl))) BASEBody.setHomePage(vrl); }
        }
        catch(e){
            if(window.netscape) {
                try { netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect"); }
                catch (e) { alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。");  }
                var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
                prefs.setCharPref('browser.startup.homepage',vrl);
            }
        }
    },
    randoms:function(min,max){ return Math.floor(Math.random() * (max - min + 1) + min); },
    mouseWheel:(function() {
        /*如何使用：
         var myWheel = function(e){ console.log(e.wheelDir);  }//定义滚轮事件
         zjf.tool.mouseWheel.on(element, myWheel);//添加滚轮事件
         zjf.tool.mouseWheel.un(element, myWheel);//删除滚轮事件 */
        var doc = document, types = ['DOMMouseScroll', 'mousewheel'],
            fixedEvent = function(e) {
                e.wheel = (e.wheelDelta ? e.wheelDelta: -e.detail) > 0 ? 1 : -1;
                e.wheelDir = e.wheel > 0 ? 'up': 'down';
                return e;
            };
        return {//return the api method
            on: function(el, fn, preventDefault) {
                if (typeof preventDefault !== 'boolean') preventDefault = true;
                var fixedFn = function(e) {
                        e = fixedEvent(e || window.event);
                        if (preventDefault) { if (e.preventDefault) e.preventDefault(); else e.returnValue = false; }
                        fn.call(el, e);
                    },
                    wheelHash = el.wheelHash;
                if (!wheelHash) { wheelHash = {};wheelHash[fn] = fixedFn;el.wheelHash = wheelHash;}
                else { if (wheelHash[fn]) return;wheelHash[fn] = fixedFn; }//ignore the repeat event
                if (doc.addEventListener) { var i = types.length;  while (i--)  el.addEventListener(types[i], fixedFn, false); }
                else el.attachEvent('onmousewheel', fixedFn);
            },
            un: function(el, fn) {
                if (!el.wheelHash) return;
                var wheelHash = el.wheelHash;
                if (doc.removeEventListener) { var i = types.length; while (i--) el.removeEventListener(types[i], wheelHash[fn], false);  }
                else el.detachEvent('onmousewheel', wheelHash[fn]);
                delete wheelHash[fn];
            }
        };
    })(),
    codeLength:function(txt){
        var len=0; if(!txt||txt.length==0) return 0;
        var str=txt.replace(/(^\s*)|(\s*$)/g,"");//去空格
        for(var i=0;i<str.length;i++){ if(str.charCodeAt(i)>0&&str.charCodeAt(i)<128) len++; else len+=2; }
        return len;
    },
    cutString: function(str,len){
        var l = 0, s = '';
        for (var i = 0; i < str.length; i++) { (str.charCodeAt(i) > 128) ? l += 2 : l++; s += str.charAt(i); if (l >= len) { return s;} }
        return s;
    },
    isElement:function (object) { return object && object.nodeType == 1; },
    isArray:function (object) { //判断是否为数组，考虑到多种情况
        return Object.prototype.toString.call(object) === '[object Array]';
        //return object != null && typeof object == "object" && 'splice' in object && 'join' in object;
    },
    url:{
        request:function(name){
            var GetUrl = this.GetUrl(),Plist = new Array();
            if(GetUrl.indexOf('?')>0)  Plist = GetUrl.split('?')[1].split('&');
            else if(GetUrl.indexOf('#')>0) Plist = GetUrl.split('#')[1].split('&');
            if (GetUrl.length>0){
                for(var i=0; i<Plist.length; i++){
                    var GetValue = Plist[i].split('=');
                    if (GetValue[0].toUpperCase() == name.toUpperCase()) { return GetValue[1]; break; }
                }
                return;
           }
        }
    },
    cookie:{}
};
zjf.event=function(event){
    var event=event?event:window.event;
    return{
        event:event,
        target:event.target||event.srcElement,
        relatedTarget:function(){ if(event.relatedTarget) return event.relatedTarget; else if(event.toElement) return event.toElement; else if(event.fromElement) return event.fromElement; else return null; },
        preventDefault:function(){ if(event.preventDefault) event.preventDefault();  else event.returnValue=false; },
        stopPropagation:function(){ if(event.stopPropagation) event.stopPropagation(); else event.cancelBubble=true; }
    }
};
zjf.dom={
    create:function(tagname,attrHash){ //attrHash：不能有形如style="**"、onclick="***"等的attr
        var ele=null;
        if((tagname=='iframe'||tagname=='input'||tagname=='button')&&(zjf.ie>0&&zjf.ie<8)){
            var attrs='';
            if(attrHash){ for(var i in attrHash) attrs+=' '+i+'="'+attrHash[i]+'"'; }
            if(tagname=='iframe') ele=document.createElement('<iframe '+attrs+'></iframe>');
            else if(tagname=='input') ele=document.createElement('<input '+attrs+' />');
            else ele=document.createElement('<button '+attrs+'></button>');
        }
        else{ ele=document.createElement(tagname); for(var i in attrHash) ele.setAttribute(i,attrHash[i]); }
        return ele;
    }
};
zjf.form={
    //input:text、textarea 得失焦
    reg:{
        mobile: /^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
        phone: /^((\+?[0-9]{2,4}\-[0-9]{3,4}\-)|([0-9]{3,4}\-))?([0-9]{7,8})(\-[0-9]+)?$/
    }
};
/*ajax start*/
function _ajax(opts){ this.opts=zjf.extend(_ajax.defaultOpts,opts); this.xhr=null; }
_ajax.prototype={
    constructor:_ajax,
    createXHR:function(){
        if(window.XMLHttpRequest) return new XMLHttpRequest();
        else if(window.ActiveXObject){
            var xmlHttp=null;
            try{ xmlHttp = new ActiveXObject("Msxml2.XMLHTTP"); }
            catch(e1){ try{ xmlHttp = new ActiveXObject("Microsoft.XMLHttp"); } catch(e2){ } }
            return xmlHttp;
        }
        return null;
    },
    addURLParam:function(url,name,value){
        url+=(url.indexOf('?')==-1?'?':'&');
        url+=encodeURIComponent(name)+'='+encodeURIComponent(value);
        return url;
    },
    serialize:function(form){
        var parts = new Array(), field = null;
        for (var i=0, len=form.elements.length; i < len; i++){
            field = form.elements[i];
            switch(field.type){
                case "select-one":
                case "select-multiple":
                    for (var j=0, optLen = field.options.length; j < optLen; j++){
                        var option = field.options[j];
                        if (option.selected){
                            var optValue = "";
                            if(option.hasAttribute) optValue=(option.hasAttribute("value")?option.value:option.text);
                            else optValue=(option.attributes["value"].specified?option.value:option.text);
                            parts.push(encodeURIComponent(field.name)+"="+encodeURIComponent(optValue));
                        }
                    }
                    break;
                case undefined:     //fieldset
                case "file":        //file input
                case "submit":      //submit button
                case "reset":       //reset button
                case "button":      //custom button
                    break;
                case "radio":       //radio button
                case "checkbox":    //checkbox
                    if (!field.checked) break;
                default:
                    parts.push(encodeURIComponent(field.name)+"="+encodeURIComponent(field.value));
            }
        }
        return parts.join("&");
    },
    sender:function(){
        var sender=null;
        if(this.opts.type=='post'){
            sender='';
            if(this.opts.theform) sender=this.serialize(this.opts.theform);
            if(this.opts.data){ for(var i in this.opts.data){ sender+='&'+encodeURIComponent(i)+'='+encodeURIComponent(this.opts.data[i]); } }
        }
        return sender;
    },
    setUrl:function(){
        if(this.opts.type=='get'){
            if(this.opts.data){ for(var i in this.opts.data) this.opts.url=this.addURLParam(this.opts.url,i,this.opts.data[i]); }
        }
        this.opts.url=this.addURLParam(this.opts.url,'rdm',Math.random());
    },
    setSendHeader:function(){ if(this.opts.theform) this.xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); },
    start:function(){
        try{
            var xhr=this.xhr=this.createXHR(),_this=this; if(!this.opts.url||this.xhr==null) return;
            this.setUrl();
            xhr.onreadystatechange=function(event){
                if(xhr.readyState==1&&_this.opts.beforeSend) _this.opts.beforeSend();
                if(xhr.readyState==4){
                    if(_this.opts.complete) _this.opts.complete(xhr.status,xhr.readyState,xhr);
                    if(xhr.status==200||xhr.status==304){
                        var data= xhr.responseText;
                        if(_this.opts.dataType=='xml') data= xhr.responseXML;
                        _this.opts.success(data,xhr.status,xhr.readyState,xhr);
                    }
                }
            };
            xhr.open(this.opts.type,this.opts.url,this.opts.async);
            this.setSendHeader();
            xhr.send(this.sender());
            if(this.opts.timeout>0) setTimeout(function(){ xhr.abort(); xhr=null; },this.opts.timeout);
        }
        catch(err){ if(this.opts.error) this.opts.error(err.name,err.message); }
    }
};
_ajax.defaultOpts={
    url:'',
    type:'get',
    data:null,
    dataType:'text', //text xml html script json
    async:true,
    theform:null, //htmlObject
    beforeSend:null,
    error:null,
    success:function(){},
    complete:null,
    timeout:0
};
zjf.ajax=function(opts,mydefaultopts){
    if(mydefaultopts) _ajax.defaultOpts=mydefaultopts;
    var ajaxO=new _ajax(opts);
    ajaxO.start();
    return ajaxO;
};
zjf.ajax.post=function(url,data,callback){
    var inArgs={type:'post',url:url};
    if(arguments.length==2){
        if(typeof arguments[1]=='object') inArgs=zjf.extend(inArgs,{data:data});
        else if(typeof arguments[1]=='function') inArgs=zjf.extend(inArgs,{success:data});
    }
    else if(arguments.length>2) inArgs=zjf.extend(inArgs,{data:data,success:callback});
    var ajaxO=new _ajax(inArgs);
    ajaxO.start();
};
zjf.ajax.get=function(url,data,callback){
    var inArgs={type:'get',url:url};
    if(arguments.length==2){
        if(typeof arguments[1]=='object') inArgs=zjf.extend(inArgs,{data:data});
        else if(typeof arguments[1]=='function') inArgs=zjf.extend(inArgs,{success:data});
    }
    else if(arguments.length>2) inArgs=zjf.extend(inArgs,{data:data,success:callback});
    var ajaxO=new _ajax(inArgs);
    ajaxO.start();
};
/*ajax end*/
zjf.data={
    xml:{},
    hash:{},
    json:{
        parseJSON:function(data){
            var rvalidchars = /^[\],:{}\s]*$/, rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g, rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g;
            if(!data||typeof data!=="string") return null;
            data=zjf.trim(data);
            if(window.JSON&&window.JSON.parse) return window.JSON.parse(data);
            if(rvalidchars.test(data.replace(rvalidescape,"@").replace(rvalidtokens,"]").replace(rvalidbraces,""))) return (new Function("return "+data))();
        }
    }
};
zjf.dates={
    format:function(type,otherDate){ //otherDate: 日期字符串或日期对象
        type=type?type:'YYYY-M-D h:m:s'; if(otherDate&&typeof otherDate=='string') otherDate=new Date(otherDate);
        var theday=otherDate?otherDate:new Date(),backstr=type,
            YYYY=theday.getFullYear(), YY=theday.getYear(), M=theday.getMonth()+1, MM=M>9?M:'0'+M, D=theday.getDate(), DD=D>9?D:'0'+D,
            h=theday.getHours(),hh=h>9?h:'0'+h,m=theday.getMinutes(),mm=m>9?m:'0'+m,s=theday.getSeconds(),ss=s>9?s:'0'+s;
        backstr=backstr.replace('YYYY',YYYY); backstr=backstr.replace('YY',YY);
        backstr=backstr.replace('MM',MM); backstr=backstr.replace('M',M);
        backstr=backstr.replace('DD',DD); backstr=backstr.replace('D',D);
        backstr=backstr.replace('W',['日','一','二','三','四','五','六'][theday.getDay()]);
        backstr=backstr.replace('hh',hh); backstr=backstr.replace('h',h);
        backstr=backstr.replace('mm',mm); backstr=backstr.replace('m',m);
        backstr=backstr.replace('ss',ss); backstr=backstr.replace('s',s);
        return backstr;
    },
    isLeapYear:function(dateOorNum){ var y=typeof dateOorNum=='object'?dateOorNum.getFullYear():dateOorNum; return (0==y%4&&((y%100!=0)||(y%400==0))); }
};
window[namespace]=zjf;
if(getEmarkORblooean!==false){
    if(getEmarkORblooean===undefined) getEmarkORblooean='$$'; window[getEmarkORblooean]=zjf.$$;
}
})('zjf','$$');