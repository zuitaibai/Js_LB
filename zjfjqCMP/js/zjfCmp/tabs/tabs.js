zjf.define(['domReady'],function(){
    var Z=window.zjf;
    var tabs=function(opt){
        var v=Z.$.extend({},Z.config.tabs.defaultOpt,opt||{}),
            $tabs=typeof v.tabsSelectStr==='string'?Z.$(v.tabsSelectStr):v.tabsSelectStr,
            $cons=Z.$(v.contentSelectStr),
            funs=null;
        if(typeof v.callback==='string'){ try{v.callback&&(eval('funs='+v.callback+';'));}catch(e){} }
        else{ funs=v.callback; }
        $tabs.on(v.eventType,function(){
            var eq=$tabs.index(this);
            $tabs.removeClass(v.activeClass).eq(eq).addClass(v.activeClass);
            v.toggleStr==='toggle'?
                $cons.hide().eq(eq).show():
                $cons.removeClass(v.toggleStr).eq(eq).addClass(v.toggleStr);
            funs&&(funs($tabs.eq(eq),Z.$(v.contentSelectStr).eq(eq),eq));
        });
        if(typeof v.initIndex!=='undefined'){
            var eq=parseInt(v.initIndex,10);
            $tabs.removeClass(v.activeClass).eq(eq).addClass(v.activeClass);
            v.toggleStr==='toggle'?
                $cons.hide().eq(eq).show():
                $cons.removeClass(v.toggleStr).eq(eq).addClass(v.toggleStr);
        }
    };
    if(Z.config.globalAttr==='on'){
        Z.$('['+Z.config.tabs.attrName+']').each(function(){
            var o=Z.tools.attrToOptsObject(Z.$(this),Z.config.tabs.attrName);
            if(o===1||o===-1){return true;}
            if(o.tabsSelectStr==='this>li'){ o.tabsSelectStr=Z.$(this).children('li'); }
            tabs(o);
        });
    }
    return tabs;
});
