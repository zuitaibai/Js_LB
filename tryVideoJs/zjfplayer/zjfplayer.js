/**
 * Zjfplayer html5视频、音频播放
 *
 * @author zjf [qq:383975892 - email:383975892@qq.com ]
 * @notice //暂时先放弃全屏、还原精细控制 //媒体列表没有做 //连带快进、快退、上一首、下一首、随机、循环都没有做 
		   //（或亦考虑视频格式影响）浏览器兼容没做 //好多周边功能没做 //loading功能
		   //单曲时为快进快退，列表时为逐条上下切换 //未删除(优化)js中不必要兼容性代码
 * @version 0.1
 * @date 2014-10-15
 *
 * @howToUse
 * @bugAtPresent //偶加载不能完全运行 如其一视频的声音条没有渲染
 *
 **/


/*默认cssClass接口
 css_poster:                   'zMedia-poster'
 css_overlay:                  'zMedia-overlay'
 css_labelTimeCurrent:         'zMedia-curtime'
 css_labelTitle:               'zMedia-title'
 css_labelTimeWhole:           'zMedia-duration'
 css_labelInfo:                'zMedia-info'
 css_btnPre:                   'zMedia-prev'
 css_btnNext:                  'zMedia-next'
 css_btnPlay2:                 'zMedia-play2'
 css_btnPlay:                  'zMedia-play'
 css_btnPause:                 'zMedia-pause'
 css_btnStop:                  'zMedia-stop'
 css_btnVoiceOpen:             'zMedia-unmute'
 css_btnVoiceClose:            'zMedia-mute'
 css_btnVoiceFull:             'zMedia-vmax'
 css_btnModeRandom:            'zMedia-shuffle'
 css_btnModeRandomClose:       'zMedia-shuffleoff'
 css_btnModeRepeat:            'zMedia-repeat'
 css_btnModeRepeatClose:       'zMedia-repeatoff'
 css_btnScreenFull:            'zMedia-fullscreen'
 css_btnScreenBack:            'zMedia-restorescreen'
 css_seekbar:                  'zMedia-seekbar'
 css_seekbarValue:             'zMedia-seekbarValue'
 css_seekbarValueTxt:          'zMedia-seekbarValue-txt'
 css_vbar:                     'zMedia-vbar'
 css_vbarValue:                'zMedia-vbarValue'
 css_contolWarp:               'zMedia-contolWarp'
 */

/*元素id接口  //id接口与cssClass同时时，id所取元素会覆盖默认cssClass所取
 warp                //总容器
 poster              //媒体封面图片
 overlay             //视频遮罩层（可用于实现点击toggle播放暂停状态，及其它用户放置内容）
 labelTimeCurrent    //当前时间容器
 labelTitle          //媒体标题容器
 labelTimeWhole      //媒体总时间容器
 labelInfo           //媒体文字信息容器
 btnPre              //上一首按钮
 btnNext             //下一首按钮
 btnPlay2            //播放器正中大播放按钮
 btnPlay             //播放按钮
 btnPause            //暂停按钮
 btnStop             //停止按钮
 btnVoiceOpen        //声音开按钮
 btnVoiceClose       //静音按钮
 btnVoiceFull        //100%声音按钮
 btnModeRandom       //随机播放开按钮
 btnModeRandomClose  //随机播放关按钮
 btnModeRepeat       //循环开按钮
 btnModeRepeatClose  //循环关按钮
 btnScreenFull       //全屏按钮
 btnScreenBack       //退出全屏按钮
 seekbar             //进度条容器
 seekbarValue        //进度条内变长控件
 seekbarValueTxt     //进度条内当前播放时间小tip
 vbar                //音量条容器
 vbarValue           //音量条内变长控件
 contolWarp          //（用于显隐时）控件容器
*/

/*基本属性设置接口
 autoPlay:false
 controls:false
 loop:false
 preload:'auto'          //auto:指示一旦页面加载，则开始加载音频/视频。 metadata:指示当页面加载后仅加载音频/视频的元数据。 none:指示页面加载后不应加载音频/视频。
 posterShowing:false     //视频播放过程中暂停/停止后，封面图片显不显示
 overlayRestores:false   //视频播放过程中暂停/停止后，遮罩层是否还原为当初
 togglePlay:true
 defaultMuted:false      //[！非当前静音属性] 默认静音
 defaultPlaybackRate:1.0 //[！非当前播放速度属性] 默认播放速度
 controlAutoHide:false   //控件是否自动隐藏（等鼠标移入视频时，控件显示）
 vbarIsVertical:false    //声音进度条是否竖直方位
 initVoice:0.85          //初始声音大小(0.0~1.0)
*/

/*new Zjfplayer(mediaIdOrElement,{warp:warpIdOrElement,css_poster:cssClassString,autoPlay:true});
* $('#my-v2').Zjfplayer({warp:'my-warp-2',controlAutoHide:true,autoPlay:true,loop:true,seekbar:'zMedia-seekbar2'});
* */
;(function(window,document,$){
    var T={
        E:function(id){
            var s=typeof id==='string'?document.getElementById(id):id;
            if(s){
                s.bind=function(event,fn){
                    var eArr=event.split(',');
                    for(var i=eArr.length-1;i>=0;i--){//可以同时绑定以,号分隔的不同事件eventType
                        s.addEventListener(eArr[i],fn,false);
                        /*if(s.addEventListener){s.addEventListener(eArr[i],fn,false);}
                        else if(s.attachEvent){s.attachEvent('on'+eArr[i],fn);}
                        else{s['on'+eArr[i]]=fn;}*/
                    }
                    return s;
                };
                s.unbind=function(event,fn){s.removeEventListener(event,fn,false);};
                s.display=function(b){
                    if(!s.display.oldDisplayWhenVisble){ //如果没有存过原始可见时display值
                        var i=s.doStyle('display');
                        if(i==='none'){
                            if(s.style&&s.style.display==='none'){ //当页面中有设置display:none时或被当前活动设置为none，则取消之 （否则为css文件中设置，进入下一个if处理）
                                s.style.display='';
                                i=s.doStyle('display'); //此时如果还是none，则为css文件中设置，亦进入下一个if处理
                                s.style.display='none';
                            }
                            if(i==='none'){
                                var body=document.body, o=T.E(document.createElement(s.tagName.toLocaleLowerCase()));
                                body.appendChild(o);
                                i=o.doStyle('display'); //如果比如设置body tagName{display:none;}时，则进入下一步强型处理
                                body.removeChild(o);
                            }
                            i=i==='none'?'block':i; //其它情况时
                        }
                        s.display.oldDisplayWhenVisble=i;
                    }
                    if(typeof b==='boolean'){
                        if(b){ //传入true时，显示
                            (s.style&&s.style.display==='none')&&(s.style.display='');
                            s.doStyle('display')==='none'&&(s.style.display=s.display.oldDisplayWhenVisble);
                        }
                        else{ s.style.display='none'; } //传入false时，隐藏
                    }
                    else if(typeof b==='string'){ s.style.display=b; } //传入字符串时
                    else if(typeof b==='undefined'){ s.display(!s.isVisible()); } //不传入参数时：toggle
                };
                s.isVisible=function(){
                    return !((s.offsetWidth===0&&s.offsetHeight===0) || ((s.style&&s.style.display)==='none')|| (s.doStyle('display')==='none') );
                };
                s.doStyle=function(p,v){
                    var f=document.defaultView;
                    p.indexOf('-')>-1 && (p=p.replace(/-(\\w)/g,function(m,a){return a.toUpperCase()}));
                    p=='float' && (p=f ? 'cssFloat' : 'styleFloat');
                    if(v){ s.style[p]=v; }
                    else{ return f ? window.getComputedStyle(s,null)[p] : s.currentStyle[p] || s.style[p] || null; }
                };
                s.doClass=function(t1,t2){
                    if(t1=='+'){ if(!s.doClass(t2)){ s.className=s.className+=' '+t2; } }
                    else if(t1=='-'){ s.className=s.className.replace(t2,''); }
                    else{ if(!s.className){return false;} var cls= ' '+s.className+' '; return cls.indexOf(' '+t1+' ')>=0; }
                };
            }
            return s||null;
        },
        extend:function(o1,o2,o3,f){ //可以传入o1,o2或o1,o2,false或o1,o2,o3或o1,o2,o3,false。默认扩展o1，当传入false时，不扩展o1
            if(typeof o3=='object'){ f=typeof f=='undefined'?true:f; }
            else if(typeof o3=='undefined'){ f=true; o3={}; }
            else if(typeof o3=='boolean'){ f=o3; o3={}; }
            var oo={};
            for(var p in o1){oo[p]=o1[p];}
            for(var p in o2){f&&(o1[p]=o2[p]);oo[p]=o2[p];}
            for(var p in o3){f&&(o1[p]=o3[p]);oo[p]=o3[p];}
            return oo;
        },
        second2min:function(s){
            var m=Math.floor(s/60), n=Math.floor(s%60); m=m<10?'0'+m:m; n=n<10?'0'+n:n;
            return m+':'+n;
        },
        getMousePoint:function(ev){
            /*属性                        描述                                            兼容性(+表示支持，-表示暂不支持)
            pageX/pageY          文档绝对坐标                                            W3C- IE- Firefox+ Opera+ Safari+ Chrome+ (IE9+)
            offsetX/offsetY      相对于“触发事件的元素”的位置                              W3C- IE+ Firefox- Opera+ Safari+ Chrome+
            layerX/layerY        相对于触发事件的元素所在的具有position定位的父级容器坐标     W3C- IE- Firefox+ Opera- Safari+ Chrome+
            x/y                  同上                                                    W3C- IE+ Firefox- Opera+ Safari+ Chrome+
            clientX/clientY      客户区坐标                                               W3C+ IE+ Firefox+ Opera+ Safari+ Chrome+
            screenX/screenY      屏幕坐标                                                 W3C+ IE+ Firefox+ Opera+ Safari+ Chrome+
            //返回：相对于文档(document)上、左的距离
            //top=滚动（“卷”起来的）高度 - body边距 + 客户区高度
            var x=y=0, doc=document.documentElement, body=document.body;
            if(!ev) ev=window.event;
            if(window.pageYoffset){ x=window.pageXOffset; y=window.pageYOffset;} //Netscape
            else{ //doc.*:标准模式   body.*:怪癖模式      检测标准模式：typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat'
                x=(doc&&doc.scrollLeft||body&&body.scrollLeft||0)-(doc&&doc.clientLeft||body&&body.clientLeft||0);
                y=(doc&&doc.scrollTop||body&&body.scrollTop||0)-(doc&&doc.clientTop||body&&body.clientTop||0);
                //scrollTop 滚动（“卷”起来的）高度
                //clientTop body边距
                //clientY   客户区高度
            }
            x+=ev.clientX;
            y+=ev.clientY;
            return {'x':x,'y':y};*/
            var x=y=0, doc=document.documentElement, body=document.body;
            x=(doc&&doc.scrollLeft||body&&body.scrollLeft||0)-(doc&&doc.clientLeft||body&&body.clientLeft||0);
            y=(doc&&doc.scrollTop||body&&body.scrollTop||0)-(doc&&doc.clientTop||body&&body.clientTop||0);
            x+=ev.clientX;
            y+=ev.clientY;
            return {'x':x,'y':y};
        },
        offset:function(elem){
            function getWindow(elem){ return isWindow(elem)? elem: elem.nodeType===9? elem.defaultView||elem.parentWindow: false;}
            function isWindow(obj){ return obj!=null&&obj==obj.window; }
            var docElem,body,win,clientTop,clientLeft,scrollTop,scrollLeft,box={ top:0,left:0 },doc=elem&&elem.ownerDocument;
            docElem=doc.documentElement; body=doc.body;
            if(typeof elem.getBoundingClientRect!=="undefined"){ box=elem.getBoundingClientRect(); }
            win=getWindow(doc);
            clientTop=docElem.clientTop||body.clientTop||0;
            clientLeft=docElem.clientLeft||body.clientLeft||0;
            scrollTop=win.pageYOffset||docElem.scrollTop;
            scrollLeft=win.pageXOffset||docElem.scrollLeft;
            return {
                top:box.top+scrollTop-clientTop,
                left:box.left+scrollLeft-clientLeft
            };
        },
        drag:function(o,f1,f2,f3){
            var timeDrag = false;
            var oo=T.E(o);
            function end(e){
                if(timeDrag) {
                    timeDrag = false;
                    bindmove(false);
                    bindend(false);
                    //var xy=T.getMousePoint(e);
                    //f3.call(oo,xy.x,xy.y);
                }
            }
            function move(e){
                if(timeDrag) {
                    var xy=T.getMousePoint(e);
                    f2.call(oo,xy.x,xy.y);
                }
            }
            function start(e){
                timeDrag = true;
                bindmove(true);
                bindend(true);
                var xy=T.getMousePoint(e);
                f1.call(oo,xy.x,xy.y);
            }
            function bindmove(flag){ flag?document.addEventListener('mousemove',move,false):document.removeEventListener('mousemove',move,false);}
            function bindend(flag){ flag?document.addEventListener('mouseup',end,false):document.removeEventListener('mouseup',end,false); }
            oo.bind('mousedown',start);
        }
    };

    function Zjfplayer(v,o){
        this.v=T.E(v);
        this.opts=T.extend(Zjfplayer.def,Zjfplayer.defcss,o,false);
        this.init();
    }
    Zjfplayer.def={autoPlay:false,controls:false,loop:false,preload:'auto',posterShowing:false,overlayRestores:false,togglePlay:true,defaultMuted:false,defaultPlaybackRate:1.0,controlAutoHide:false,vbarIsVertical:false,initVoice:0.85};
    Zjfplayer.defcss={
        css_poster:'zMedia-poster',css_overlay:'zMedia-overlay',css_labelTimeCurrent:'zMedia-curtime',css_labelTitle:'zMedia-title',css_labelTimeWhole:'zMedia-duration',css_labelInfo:'zMedia-info',
        css_btnPre:'zMedia-prev',css_btnNext:'zMedia-next',css_btnPlay2:'zMedia-play2',css_btnPlay:'zMedia-play',css_btnPause:'zMedia-pause',css_btnStop:'zMedia-stop',
        css_btnVoiceOpen:'zMedia-unmute',css_btnVoiceClose:'zMedia-mute',css_btnVoiceFull:'zMedia-vmax',css_btnModeRandom:'zMedia-shuffle',css_btnModeRandomClose:'zMedia-shuffleoff',
        css_btnModeRepeat:'zMedia-repeat',css_btnModeRepeatClose:'zMedia-repeatoff',css_btnScreenFull:'zMedia-fullscreen',css_btnScreenBack:'zMedia-restorescreen',
        css_seekbar:'zMedia-seekbar',css_seekbarValue:'zMedia-seekbarValue',css_seekbarValueTxt:'zMedia-seekbarValue-txt',css_vbar:'zMedia-vbar',css_vbarValue:'zMedia-vbarValue',css_contolWarp:'zMedia-contolWarp'
    };
    Zjfplayer.others={
        staticCss:{'overlay-apha':'zMedia-overlayapha','vbar-v':'zMedia-vbar-vertical'},
        mediaType:{'v-ogg':'video/ogg','v-mp4':'video/mp4','v-webm':'video/webm','a-mpeg':'audio/mpeg','a-ogg':'audio/ogg','a-mp4':'audio/mp4'}
    };
    Zjfplayer.prototype={
        constructor:Zjfplayer,
        init:function(){
            if(this.v.canPlayType){
                var src=this.v.currentSrc;
                src=src.substring(src.lastIndexOf('.')+1);
                var result=this.v.canPlayType(this.v.tagName.toLocaleLowerCase()+'/'+src);
                if(!result){
                    console.log('浏览器不支持此种媒体格式'+this.v.tagName.toLocaleLowerCase()+'/'+src);
                    return;
                }
            }
            this.getEle();
            this.v.controls=this.opts.controls;
            this.v.loop=this.opts.loop;
            this.v.defaultMuted=this.opts.defaultMuted;
            this.v.defaultPlaybackRate=this.opts.defaultPlaybackRate;
            this.v.preload=this.opts.preload;
            this.binds();
        },
        getEle:function(){
            var os=this.opts;
            if(os.warp){
                this.warp=T.E(os.warp);
                /* var lists=this.warp.getElementsByTagName('*');
                for(var i=0,len=lists.length;i<len;i++){
                    for(var s in Zjfplayer.defcss){
                        var e=T.E(lists[i]);
                        if(e.doClass(Zjfplayer.defcss[s])){ this[s.replace('css_','')]=e; break; }
                    }
                }*/
               for(var i in Zjfplayer.defcss){
                    var su=this.warp.querySelector('.'+Zjfplayer.defcss[i]);
                    su&&(this[i.replace('css_','')]=T.E(su));
                }
            }
            os.poster&&(this.poster=T.E(os.poster));
            os.overlay&&(this.overlay=T.E(os.overlay));
            os.labelTimeCurrent&&(this.labelTimeCurrent=T.E(os.labelTimeCurrent));
            os.labelTitle&&(this.labelTitle=T.E(os.labelTitle));
            os.labelTimeWhole&&(this.labelTimeWhole=T.E(os.labelTimeWhole));
            os.labelInfo&&(this.labelInfo=T.E(os.labelInfo));
            os.btnPre&&(this.btnPre=T.E(os.btnPre));
            os.btnNext&&(this.btnNext=T.E(os.btnNext));
            os.btnPlay2&&(this.btnPlay2=T.E(os.btnPlay2));
            os.btnPlay&&(this.btnPlay=T.E(os.btnPlay));
            os.btnPause&&(this.btnPause=T.E(os.btnPause));
            os.btnStop&&(this.btnStop=T.E(os.btnStop));
            os.btnVoiceOpen&&(this.btnVoiceOpen=T.E(os.btnVoiceOpen));
            os.btnVoiceClose&&(this.btnVoiceClose=T.E(os.btnVoiceClose));
            os.btnVoiceFull&&(this.btnVoiceFull=T.E(os.btnVoiceFull));
            os.btnModeRandom&&(this.btnModeRandom=T.E(os.btnModeRandom));
            os.btnModeRandomClose&&(this.btnModeRandomClose=T.E(os.btnModeRandomClose));
            os.btnModeRepeat&&(this.btnModeRepeat=T.E(os.btnModeRepeat));
            os.btnModeRepeatClose&&(this.btnModeRepeatClose=T.E(os.btnModeRepeatClose));
            os.btnScreenFull&&(this.btnScreenFull=T.E(os.btnScreenFull));
            os.btnScreenBack&&(this.btnScreenBack=T.E(os.btnScreenBack));
            os.seekbar&&(this.seekbar=T.E(os.seekbar));
            os.seekbarValue&&(this.seekbarValue=T.E(os.seekbarValue));
            os.seekbarValueTxt&&(this.seekbarValueTxt=T.E(os.seekbarValueTxt));
            os.vbar&&(this.vbar=T.E(os.vbar));
            os.vbarValue&&(this.vbarValue=T.E(os.vbarValue));
            os.contolWarp&&(this.contolWarp=T.E(os.contolWarp));
            if(this.vbar){
                this.vbar.doClass(Zjfplayer.others.staticCss['vbar-v'])&&(this.opts.vbarIsVertical=true);
            }
        },
        play:function(){
            this.v.play();
            this.play_sync();
        },
        play_sync:function(){
            this.poster&&this.poster.display(false);
            this.overlay&&this.overlay.doClass('+',Zjfplayer.others.staticCss['overlay-apha']);
            this.btnPlay2&&this.btnPlay2.display(false);
            this.btnPlay&&this.btnPlay.display(false);
            this.btnPause&&this.btnPause.display(true);
        },
        pause:function(){
            this.v.pause();
            this.pause_sync();
        },
        _discontinue:function(){
            this.poster&&this.poster.display(this.opts.posterShowing);
            this.overlay&&this.opts.overlayRestores&&this.overlay.doClass('-',Zjfplayer.others.staticCss['overlay-apha']);
            this.btnPlay2&&this.btnPlay2.display(true);
            this.btnPlay&&this.btnPlay.display(true);
            this.btnPause&&this.btnPause.display(false);
        },
        pause_sync:function(){
            this._discontinue();
        },
        stop:function(){
            this.v.pause();
            this.v.currentTime=0;
            this.stop_sync();
        },
        stop_sync:function(){
            var s=this;
            this._discontinue();
            if(s.seekbarValueTxt){
                setTimeout(function(){s.seekbarValueTxt.display(false);},20)
            }
        },
        screenf:function(){
            ( this.v.requestFullscreen&&this.v.requestFullscreen() )
            ||( this.v.webkitRequestFullScreen&&this.v.webkitRequestFullScreen() )
            ||( this.v.mozRequestFullScreen&&this.v.mozRequestFullScreen() );
        },
        screenf_sync:function(){},
        screenb:function(){/*document.exitFullscreen(); document.webkitCancelFullScreen(); document.mozCancelFullScreen();*/},
        screenb_sync:function(){},
        prev:function(){},
        next:function(){},
        vopen:function(){},
        vopen_sync:function(){},
        vclose:function(){},
        vclose_sync:function(){},
        vfull:function(){},
        vfull_sync:function(){},
        moderdm:function(){},
        moderdm_sync:function(){},
        modere:function(){},
        modere_sync:function(){},
        playSpeed:function(speedStr){
            this.v.playbackRate={'fast':2.0,'normal':1.0,'slow':0.5}[speedStr];
        },
        timeChange_sync:function(t){
            this.labelTimeCurrent&&(this.labelTimeCurrent.innerHTML=T.second2min(t));
            this.seekbarValue&&(this.seekbarValue.style.width=t*100/this.duration.second+'%');
            if(this.seekbarValueTxt){
                this.seekbarValueTxt.display(true);
                this.seekbarValueTxt.innerHTML=T.second2min(t);
            }
        },
        vChange:function(n){
            this.v.volume=n;
            n&&(this.defVolume=n);
            this.vChange_sync(n);
        },
        vChange_sync:function(n){
            if(n==0||this.v.muted){
                this.btnVoiceClose&&this.btnVoiceClose.display(false);
                this.btnVoiceOpen&&this.btnVoiceOpen.display(true);
                this.vbarValue&&(this.vbarValue.style[this.opts.vbarIsVertical?'height':'width']='0');
            }else{
                this.btnVoiceClose&&this.btnVoiceClose.display(true);
                this.btnVoiceOpen&&this.btnVoiceOpen.display(false);
                this.vbarValue&&(this.vbarValue.style[this.opts.vbarIsVertical?'height':'width']=n*100+'%');
            }
        },
        unmute:function(){ this.vChange(this.defVolume); },
        binds:function(){
            var s=this;
            this.defVolume=this.opts.initVoice;
            if(this.btnPlay){this.btnPlay.bind('click',function(){s.play();});}
            if(this.btnPlay2){this.btnPlay2.bind('click',function(){s.play();});}
            if(this.btnPause){this.btnPause.bind('click',function(){s.pause();});}
            if(this.opts.togglePlay&&this.overlay){this.overlay.bind('click',function(){ s.v.paused?(s.play()):(s.pause()); });}
            if(this.btnStop){this.btnStop.bind('click',function(){s.stop();});}
            if(this.btnScreenFull){this.btnScreenFull.bind('click',function(){s.screenf();});}
            if(this.btnVoiceClose){this.btnVoiceClose.bind('click',function(){s.vChange(0.0);});}
            if(this.btnVoiceOpen){this.btnVoiceOpen.bind('click',function(){s.unmute();});}
            if(this.btnVoiceFull){this.btnVoiceFull.bind('click',function(){s.vChange(1.0);});}
            if(this.opts.controlAutoHide&&this.contolWarp){
                var _f=function(){s.contolWarp.display(false);};
                this.contolWarp.timer=setTimeout(_f,1500);
                var o=this.warp||this.overlay||this.v;
                o.bind('mouseenter',function(){ clearTimeout(s.contolWarp.timer); s.contolWarp.display(true);})
                .bind('mouseleave',function(){ s.contolWarp.timer=setTimeout(_f,1000); });
            }

            // this.v.bind('fullscreenchange,webkitfullscreenchange,mozfullscreenchange',function(e){ if(document.fullScreen){}else{} });//对于火狐，是否采用监听ESC键暴力方法
            this.v.bind('pause',function(){s.pause_sync();}).bind('play',function(){s.play_sync();});

            this.v.bind('loadedmetadata',function(){
                s.duration={second:s.v.duration,hs:T.second2min(s.v.duration)};
                s.labelTimeWhole&&(s.labelTimeWhole.innerHTML=s.duration.hs);
                s.v.bind('timeupdate',function(){ s.timeChange_sync(s.v.currentTime); });
                if(s.seekbar){
                    function dragSeekbar(x,y){ //忽略进度条竖直方位时的情况
                        var l1=x-T.offset(s.seekbar).left, l2=s.seekbar.offsetWidth;
                        if(l1<0){l1=0;}
                        if(l1>l2){l1=l2;}
                        var tt=l1*s.duration.second/l2.toFixed(2);
                        s.timeChange_sync(tt);
                        s.v.currentTime=tt;
                    }
                    /*由于T.drag中的mousedown已作用，故取消click
                    s.seekbar.bind('click',function(event){ //此处不用考虑下行的：因为不可见计算offset及offsetWidth的问题。因为当click时，一定是显示的。
                        dragSeekbar(T.getMousePoint(event).x);
                    });*/
                    T.drag(s.seekbar,dragSeekbar,dragSeekbar,dragSeekbar);
                }
                s.v.bind('volumechange',function(){s.vChange(s.v.volume);});
                if(s.vbar){
                    function dragVbar(x,y){
                        var l1=l2=tt=0;
                        if(s.opts.vbarIsVertical){ l1=y-T.offset(s.vbar).top;  l2=s.vbar.offsetHeight; }
                        else { l1=x-T.offset(s.vbar).left; l2=s.vbar.offsetWidth; }
                        if(l1<0){l1=0;}
                        if(l1>l2){l1=l2;}
                        tt=(s.opts.vbarIsVertical?(1-l1/l2):(l1/l2)).toFixed(2);
                        s.vChange(tt);
                    }
                    /*由于T.drag中的mousedown已作用，故取消click
                    s.vbar.bind('click',function(event){
                        var eventXY=T.getMousePoint(event);
                        dragVbar(eventXY.x,eventXY.y);
                    });*/
                    T.drag(s.vbar,dragVbar,dragVbar,dragVbar);
                }
                s.seekbarValueTxt&&(s.seekbarValueTxt.display(false));
                s.vChange(s.defVolume);
                s.opts.autoPlay&&s.v.play();
            });
        }

    };

    window.Zjfplayer=Zjfplayer;
    if($){
        $.Zjfplayers=$.Zjfplayers||{};
        $.Zjfplayers.nums=$.Zjfplayers.nums||0;
        $.fn.Zjfplayer=function(opt){
            return this.each(function() {
                var s=new Zjfplayer(this,opt);
                $(this).data('Zjfplayer_x',++$.Zjfplayers.nums);
                $.Zjfplayers['Zjfplayer_'+$.Zjfplayers.nums]=s;
            });
        };
    }
})(window,document,typeof jQuery==='undefined'?false:jQuery);