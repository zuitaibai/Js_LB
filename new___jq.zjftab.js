//<div data-zjftab="#ul1>li,#div>p,cur,toggleDisplay,0" data-zjfon="click"></div>
//<div data-zjftab="#ul1>li,#div>p,cur></div>

/*var zjftab={
    _propty:{defs:'toggleDisplay',defEvent:'mouseover'},
    attributes:{tabs:'data-zjftab',etype:'data-zjfon'},
    bindOne:function(_o){
        var $o=_o instanceof jQuery?_o:$(_o);
        var sArr=$o.attr(zjftab.attributes.tabs).split(',');
        for(var s=sArr.length-1;s>-1;s--){sArr[s]=$.trim(sArr[s]);}
        var conToggleOrChangeClass=sArr[3]||zjftab._propty.defs,
            initEq=sArr[4]?sArr[4]*1:0,
            eventType=$o.attr(zjftab.attributes.etype)||zjftab._propty.defEvent,
            tabLists=sArr[0]=='this'?$o.children():$(sArr[0]),
            conLists=$(sArr[1]),
            tabClass=sArr[2];
        tabLists.bind(eventType,function(){
            var i=tabLists.index(this);
            tabLists.removeClass(tabClass).eq(i).addClass(tabClass);
            conToggleOrChangeClass==
                zjftab._propty.defs ?
                conLists.hide().eq(i).show() :
                conLists.removeClass(conToggleOrChangeClass).eq(i).addClass(conToggleOrChangeClass);
            return false;
        }).eq(initEq).trigger(eventType);
    },
    bindDom:function(){
        $('['+zjftab.attributes.tabs+']').each(function(){
            zjftab.bindOne(this);
        });
    }
};*/

;(function(window,$,withoutDomReadyBind,attrName1,attrName2){
    var
    _propty={defs:'toggleDisplay',defEvent:'mouseover'},
    attributes={tabs:attrName1||'data-zjftab',etype:attrName2||'data-zjfon'},
    bindOne=function(_o){
        var $o=_o instanceof jQuery?_o:$(_o);
        var sArr=$o.attr(attributes.tabs).split(',');
        for(var s=sArr.length-1;s>-1;s--){sArr[s]=$.trim(sArr[s]);}
        var conToggleOrChangeClass=sArr[3]||_propty.defs,
            initEq=sArr[4]?sArr[4]*1:0,
            eventType=$o.attr(attributes.etype)||_propty.defEvent,
            tabLists=sArr[0]=='this'?$o.children():$(sArr[0]),
            conLists=$(sArr[1]),
            tabClass=sArr[2];
        tabLists.bind(eventType,function(){
            var i=tabLists.index(this);
            tabLists.removeClass(tabClass).eq(i).addClass(tabClass);
            conToggleOrChangeClass==
            _propty.defs ?
                conLists.hide().eq(i).show() :
                conLists.removeClass(conToggleOrChangeClass).eq(i).addClass(conToggleOrChangeClass);
            return false;
        }).eq(initEq).trigger(eventType);
    },
    bindDom=function(withoutDomReady){
        if(withoutDomReady){
            $(function(){ $('['+attributes.tabs+']').each(function(){ bindOne(this); }); });
        }else { $('['+attributes.tabs+']').each(function(){ bindOne(this); }); }
    },
    outO={bindOne:bindOne,bindDom:bindDom};
    withoutDomReadyBind && (bindDom(true));
    window.zjftab=window.zjftab||outO;
})(window,jQuery,true);