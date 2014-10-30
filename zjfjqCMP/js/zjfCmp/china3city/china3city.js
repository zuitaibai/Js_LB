zjf.define(function(){
    var Z=window.zjf;
    var Ooo=function(opt){this.opt=Z.$.extend({},Z.config.china3city.defaultOpt,opt||{}); this.init(); };
    Ooo.prototype={
        constructor:Ooo,
        init:function(){
            this.c1=this.opt.provinceSelectStr?Z.$(this.opt.provinceSelectStr):null;
            this.c2=this.opt.citySelectStr?Z.$(this.opt.citySelectStr):null;
            this.c3=this.opt.countrySelectStr?Z.$(this.opt.countrySelectStr):null;
            this.fill();
        },
        fill:function(){
            var _this=this;
            this.getall(function(all){
                if(_this.c1&&_this.c1.length===1){
                    _this.c1.html(all[0]);
                }
                if(_this.c2&&_this.c2.length===1){
                    _this.c2.html(all[1]);
                }
                if(_this.c3&&_this.c3.length===1){
                    _this.c3.html(all[2]);
                }

            });
        },
        getall:function(fn){
            var data=[];
            if(this.opt.ajax==='true'){
                Z.$.ajax({
                    url:''
                });
            }
            fn(data);
            this.binds();
        },
        binds:function(){}
    };
    var china3city=function(opt){
        new Ooo(opt);
    };
    return china3city;
});