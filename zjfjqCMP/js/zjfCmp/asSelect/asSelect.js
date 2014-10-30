zjf.define(['domReady'],function(){
    var Z=window.zjf;
    var asSelect=function(_this,opt){
        var disable=!!_this.attr('disabled'), oo=Z.$.extend({},Z.config.asSelect.defaultOpt,opt||{}), list=[], funs=null;
        if(typeof oo.onChange==='string'){ try{oo.onChange&&(eval('funs='+oo.onChange+';'));}catch(e){} }
        else{ funs=oo.onChange; }
        _this.find('option').each(function(eq){
            list.push({ val:Z.$(this).val(), text:Z.$(this).text() });
            if(Z.$(this).attr('selected')){ list.selected=eq; }
        });
        list.selected=list.selected||0;
        str='<p><em></em><span>'+list[list.selected]['text']+'</span></p><div><ul>';
        Z.$.each(list,function(i,v){ str+='<li'+(list.selected==i?' class="cur"':'')+' val="'+v.val+'" eq="'+i+'">'+v.text+'</li>'; });
        str+='</ul></div>';
        var eqq=++Z.global.asSelect.staticNumber;
        var warp=Z.$('<div/>',{class:'zjf-asSelect',html:str,id:oo.forId||'zjf-asSelect_'+eqq}).css('width',oo.width+'px').insertAfter(_this.hide());
        (disable||oo.disabled==='true')&&warp.addClass(oo.disabledClass);
        if(oo.zIndex!=='00'){warp.css('z-index',Number(oo.zIndex));}
        oo.newClass&&(warp.addClass(oo.newClass));
        oo.isReplacedefClass==='true'&&(warp.removeClass('zjf-asSelect'));
        if(oo.zIndex!=='00'){warp.find('div').css('z-index',Number(oo.zIndex)+1);}
        function lihover($li){$li.addClass('cur').siblings().removeClass('cur');}
        var speed=oo.speed==='0'?0:Number(oo.speed);
        function liclick($li){
            var v=$li.attr('val'), t=$li.text(), i=$li.attr('eq')*1,
                ii=list.selected, liold=warp.find('li').eq(ii), vv=liold.attr('val'), tt=liold.text();
            _this.val(v); warp.find('p>span').text(t);
            list.selected=i;
            warp.find('div').slideUp(speed,callend);
            ii!=i&&funs&&(funs.call(null,v,t,i,vv,tt,ii));
        }
        warp.find('li').mouseover(function(){ lihover(Z.$(this)); }).click(function(){ liclick(Z.$(this)); });
        warp.find('p').hover(function(){Z.$(this).addClass('hover')},function(){Z.$(this).removeClass('hover')});
        var fun=function(){warp.find('div').is(':visible')?(close()):(open());};
        if(!disable&&oo.disabled==='false'){
            if(oo.eventType==='click'){ warp.find('p').click(fun); }
            else if(oo.eventType==='hover'){ warp.hover(open,close);}
        }
        Z.$(document).click(function(e){ if(Z.$(e.target).closest('div.zjf-asSelect').length<=0){close();} });
        var globalAsSelectThis=Z.global.asSelect[warp[0].id]={};
        globalAsSelectThis.disabled=function(blooen){//禁用、启用
            if(blooen){ warp.addClass(oo.disabledClass).unbind('mouseenter mouseleave').find('p').unbind('click',fun); }
            else{
                warp.removeClass(oo.disabledClass);
                if(oo.eventType==='click'){ warp.find('p').click(fun); }
                else if(oo.eventType==='hover'){ warp.hover(open,close);}
            }
            return globalAsSelectThis;
        };
        globalAsSelectThis.val=function(ifval,ifCallOnChange){//赋值、取值
            if(typeof ifval!=='undefined'){//set
                var li=warp.find('li[val='+ifval+']');
                if(li.length<=0){ alert('asSelect的val方法错误：列表中找不到等于参数的值'); return globalAsSelectThis; }
                var t=li.text(), i=li.attr('eq')*1,
                    ii=list.selected, liold=warp.find('li').eq(ii), vv=liold.attr('val'), tt=liold.text();
                _this.val(ifval); warp.find('p>span').text(t);
                list.selected=i;
                if(ifCallOnChange){ ii!=i&&funs&&(funs.call(null,i,ifval,t,ii,vv,tt)); }
            }
            else{//get
                return warp.find('li:eq('+list.selected+')').attr('val');
            }
            return globalAsSelectThis;
        };
        globalAsSelectThis.addItem=function(v,t){//追加
            if(warp.find('li[val='+v+']').length>0){ console.log('不能添加列表中已有的项：value='+v); return globalAsSelectThis; }
            var nnbb=Z.$('<li val="'+v+'" eq="'+warp.find('li').length+'">'+t+'</li>').appendTo(warp.find('ul'));
            _this.append('<option value="'+v+'">'+t+'</option>').find('option:eq('+list.selected+')').attr('selected',true);
            nnbb.mouseover(function(){ lihover(nnbb); }).click(function(){ liclick(nnbb); });
            return globalAsSelectThis;
        };
        globalAsSelectThis.removeItem=function(v){
            _this.find('option[value='+v+']').remove();
            var del=warp.find('li[val='+v+']').remove();
            warp.find('li').each(function(eq){ Z.$(this).attr('eq',eq); });
            if(list.selected==del.attr('eq')*1){ list.selected=0; var vals=warp.find('li:eq(0)').attr('val'); globalAsSelectThis.val(vals);}
            return globalAsSelectThis;
        };
        function open(){ warp.find('div').slideDown(speed,callend); }
        function close(){ warp.find('div').slideUp(speed,callend); }
        function callend(){
            if(warp.find('div').is(':visible')){ warp.find('p>em').addClass('open'); }
            else{ warp.find('p>em').removeClass('open'); warp.find('li').removeClass('cur').eq(list.selected).addClass('cur'); }
        }
    };

    if(Z.config.globalAttr==='on'){
        Z.$('['+Z.config.asSelect.attrName+']').each(function(){
            var o=Z.tools.attrToOptsObject(Z.$(this),Z.config.asSelect.attrName);
            if(o===-1){return true;}
            asSelect(Z.$(this),o);
        });
    }
    return asSelect;
});
