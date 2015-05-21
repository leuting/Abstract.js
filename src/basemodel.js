;(function(){

    /**
     * 如果父类有使用父类的属性 即是继承属性
     * 
     */
    var acceptOpt = ['tmpl', 'el', 'data', 'fuse', 'myData', 'onreset'];
    var BaseModel = Model.Class({
        type: "BaseModel",

        get acceptOpt(){
            return acceptOpt;
        },

        addAcceptOpt: function(arr){
            acceptOpt = acceptOpt.concat(arr);
        },

        set fuse(value){
            Model.addFuse(value, this);

            this._fuse = value;
        },

        get fuse(){
            return this._fuse;
        },
        constructor: function(opt){
            // private method
            // 这些都会被子类重新初始化一遍
            this._fuse = "";

            if(opt){
                for(var i = 0; i < this.acceptOpt.length; i ++){
                    var item = this.acceptOpt[i];
                    if(opt[item]){
                        this[item] = opt[item];
                    }
                }
            }


            // 设置初始化参数 private method
            this.eventHandler = {
            };

            this.children = [];
            this.parent = null;

            var _this = this;
            this.addEventListener("reset", function(e){
                _this.onreset && _this.onreset();
            });
        },

        // 增加model上去
        add: function(model){
            // add parent
            model.parent = this;

            this.children.push(model);
        },

        del: function(model){
            for(var i = 0; i < this.children.length; i ++){
                if(this.children[i] === model){
                    break;
                }
            }

            this.children.splice(i, 1);
        },

        remove: function(){
            if(this.parent){
                this.parent.del(this);
            }
        },

        // 这里写处于激活态的时候动作
        // 用户可自定义 
        // 事件传播不在这里处理保证不受用户处理事件传播
        // 监听用户激活的事件
        active: function(event){
        },

        // onunactive时的动作
        unactive: function(event){
        },

        // rock就是主动使其处于激活态
        // 这里的src始终是自己
        // 并抛出激活事件
        // 这里triggerName
        rock: function(eventName){
            console.log(this.el, "rocked");
            this.status = "active";

 
            var event = Model.createEvent({
                type: "actived",
                target: this,
                name: eventName || 'anonymouse'
            });

            // active时的动作
            this.active(event);

            this.dispatchEvent(event);
        },

        stop: function(eventName){
            console.log(this.el, "unrocked");
            this.status = "unactive";

            var event = Model.createEvent({
                type: "unactived",
                target: this,
                name: eventName || 'anonymouse'
            });

            this.unactive(event);

            this.dispatchEvent(event);

        },

        // 事件传播
        // 事件由这里开始传播
        // 这里先只处理向上冒泡的情形
        dispatchEvent: function(event){
            var type = event.type;

            var _this = this;
            this.eventHandler[type] && this.eventHandler[type].map(function(item){
                item.call(_this, event);
            });

            // 如果可以穿播 继续传播
            if(event.bubble){
                this.parent && this.parent.dispatchEvent(event);
            }
        },

        addEventListener: function(type, handler, isCapture){
            if(! this.eventHandler[type]){
                this.eventHandler[type] = [];
            }

            this.eventHandler[type].push(handler);
        },

        info: function(msg){
            var args = [];
            var args = ["Model:", (this.comment || (typeof this.el === "string" ? this.el : this.el && this.el.selector)) + ":"];

            for(var i = 0; i < arguments.length; i ++){
                args.push(arguments[i]);
            }

            console.info.apply(console, args);
        },

        reset: function(){
            var event = Model.createEvent({
                type: "reset",
                target: this,
                name: 'anonymouse'
            });

            this.dispatchEvent(event);
        },
        refresh: function(){
            var event = Model.createEvent({
                type: "refresh",
                target: this,
                name: 'anonymouse'
            });

            this.dispatchEvent(event);
        },

        freeze: function() {
            this.freezed = 1;
        },

        melt: function() {
            this.freezed = 0;
        },


        extend: function(opt){
        /*
            if (!opt) {
                opt = {};
            }

            var func = function() {};

            var events = opt.events;

            func.prototype = this; //object;

            var clone = new func();

            clone.feedPool = [];
            clone.cgiCount = 0;
            clone.dataCache = [];
            clone.isFirstDataRequestRender = 0;
            clone.isFirstRender = 1;
            clone._addedToModel = 0;
            clone.canScrollInMTB = 1;
            clone.dead = 0;

            //如果重新定义了param 不使用缓存
            if (opt.param) {
                clone.paramCache = [];
            }

            for (var i in opt) {
                clone[i] = opt[i];
            }

            //如果定义了事件 就不使用原来的事件
            if (events) {
                clone.events = function() {
                    events && events.call(this);
                };

                clone.eventsBinded = 0;
            }

            if (clone.renderContainer) {

                if (_containerCountInfo[clone.renderContainer]) {
                    _containerCountInfo[clone.renderContainer]++;
                } else {
                    _containerCountInfo[clone.renderContainer] = 1;
                }
            }


            return clone;
            */
        }

    });

    Model.external("BaseModel", BaseModel);
})();
