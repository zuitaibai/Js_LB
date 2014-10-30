/*======================================================================================================================*/
function extend(des, src) {//对象属性复制方法,很多库都有实现,如PrototypeJS里面的extend和Ext里面的Ext.apply
    if (!des) des = {};
    if (src) { for (var i in src) des[i] = src[i]; }
    return des;
}
var CC = {}; //全局变量 
//create 用于创建类
CC.create = function(superclass, constructor){
    var clazz = (function() { this.initialize.apply(this, arguments);  });
    if(arguments.length == 0) return clazz;//如果无参数,直接返回类.
    if(!superclass){//如果无父类,此时constructor应该为一个纯对象,直接复制属性返回.
        extend(clazz.prototype, constructor);
        return clazz;
    }
    var absObj = clazz.prototype, sprPropty = superclass.prototype;
    if(sprPropty){
        //用于访问父类方法
        clazz.superclass = sprPropty;
        extend(absObj, sprPropty);
        //调用属性构造函数创建属性,这个是实现关键.
        extend(absObj, constructor(sprPropty));
        // 子类实例直接通过obj.superclass访问父类属性,
        // 如果不想造成过多引用,也可把这句注释掉,因为多数时候是没必要的.
        absObj.superclass = sprPropty;
        //
        clazz.constructor = constructor;
    }
    return clazz;
};
//创建一个动物类
var Animal = CC.create(null, {
    //属性
    footprint : '- - - - - - =',
    //类初始化方法,必须的,当用 new 生成一个类时该方法自动被调用,参见上定义.
    initialize : function(options){
        extend(this, options);
        alert('Animal initialize method is called.');
    },
    eat : function(){ alert('Animal eat method is called.'); },
    move : function(){ alert('I am moving like this '+ this.footprint +' .'); }
});
//创建一个Duke类
var Duke = CC.create(Animal, function(superclass){
    //在这可以定义一些类全局静态数据,该类每个实例都共享这些数据.
    //计算实例个类,包括派生类实例.
    var static_instance_counter = 0;
    function classUtilityFuncHere(){ }
    //返回类具体属性.
    return {
        //重写初始化方法
        //@override
        initialize : function(options) {
            alert('Initializing Duke class..');
            //调用父类初始化,这种方法比一般其它库的要简洁点吧,可以不管父类是什么.
            superclass.initialize.call(this, options);
            //做一些子类喜欢做的事.
            alert('Duke initialize method is called.');
            //读取或修改类静态属性
            static_instance_counter++;
        },
        //重写move方法,增加Duke自己的移动方式.
        move : function(){
            this.footprint = this.footprint + 'zzzzzzzz';
            superclass.move.call(this);
        },
        //重写eat方法,注意,里面不调用父类方法,即父类eat被覆盖了.
        eat : function(){ alert('Duke is eating..'); },
        //新增一个say方法,显示当前已经初始化的Duke类实例数量.
        say : function(){ alert('the number of Duke instances is '+static_instance_counter); }
    };
});
var DukeChild = CC.create(Duke, function(superclass){
    return {
        move : function(){
            this.footprint = this.footprint + '++++++++++++=';
            superclass.move.call(this);
        },
        say : function(){ alert(this.msg || ''); }
    };
});
(function test() {
    var animal = new Animal();
    animal.eat();
    animal.move();
    var dukeA = new Duke();
    dukeA.eat();
    dukeA.move();
    dukeA.say();
    var dukeB = new Duke();
    dukeB.eat();
    dukeB.move();
    dukeB.say();
    var dukeC = new DukeChild({msg : 'I am a child of duke.'});
    dukeC.move();
    dukeC.say();
})();
/*======================================================================================================================*/
function Class() {}
Class.extend = function extend(props) {
    var prototype = new this();
    var _super = this.prototype;
    for (var name in props) {
        if (typeof props[name] == "function" && typeof _super[name] == "function") {
            prototype[name] = (function (super_fn, fn) {
                return function () {
                    var tmp = this.callSuper;
                    this.callSuper = super_fn;
                    var ret = fn.apply(this, arguments);
                    this.callSuper = tmp;
                    if (!this.callSuper) { delete this.callSuper; }
                    return ret;
                };
            })(_super[name], props[name]);
        }
        else { prototype[name] = props[name]; }
    }
    function Class() {}
    Class.prototype = prototype;
    Class.prototype.constructor = Class;
    Class.extend =  extend;
    Class.create = Class.prototype.create = function () {
        var instance = new this();
        if (instance.init) { instance.init.apply(instance, arguments); }
        return instance;
    };
    return Class;
};
var Human = Class.extend({
    init: function () {
        this.nature = "Human";
    },
    say: function () {
        console.log("I am a human");
    }
});
var human = Human.create();
console.log(human);
human.say();
var Man = Human.extend({
    init: function () {
        this.callSuper();
        this.sex = "man";
    },
    say: function () {
        this.callSuper();
        console.log("I am a man");
    }
});
var man = Man.create();
console.log(man);
man.say();
var Person = Man.extend({
    init: function () {
        this.callSuper();
        this.name = "lee";
    },
    say: function () {
        this.callSuper();
        console.log("I am Lee");
    }
});
var person = Person.create();
console.log(person);
person.say();
var Rectangle = {
    area: function () {
        console.log(this.width * this.height);
    }
};
var rect = Object.create(Rectangle);
rect.width = 5;
rect.height = 9;
rect.area();
/*======================================================================================================================*/
Function.prototype.extends=function(superClass){//http://www.douban.com/note/200765710/
    if(typeof superClass==='function'){
        var F=function(){};
        F.prototype=superClass.prototype;
        this.prototype=new F();
        this.prototype.constructor=this;
        this.superClass=superClass;
    }
    else if(typeof superClass==='object'){
        var pro=this.prototype;
        for(var k in superClass){
            if(!pro[k]){
                pro[k]=superClass[k];
            }
        }
    }
    else{ throw new Error('fatal error:"Function.prototype.extend" expects a function or object'); }
    return this;
};