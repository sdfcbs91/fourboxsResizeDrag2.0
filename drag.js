/**
**参数:[{drag:{control:"",type:"s"},control:"",location:"left_top"}]
**/
var girdResize = function (o) {
    this.configs = o;
    this.options = { position: { left: 0.5, top: 0.5} };
    this.getWidth = function () { this.width = parseInt($(window).width() + $(window.document).scrollLeft()), this.paddingW = parseInt(this.width / 100); };
    this.getHeight = function () { this.height = parseInt($(window).height() + $(window.document).scrollTop()), this.paddingH = parseInt(this.height / 50); };
    this.setDefault = function () { this.blag = { drag: { width: true, height: true}} };
    this.save = function () {
        var position = this.getCenterPosition();
        //if (position.left) {
        this.options.position.left = position.left / this.width;
        //}
        //if (position.top) {
        this.options.position.top = position.top / this.height;
        // }
    }
    this.onresize = function () {
        this.getWidth();
        this.getHeight();
        var p = this.options.position;
        var position = { left: parseInt(this.width * p.left), top: parseInt(this.height * p.top) };
        this.position(position);
    }
    this.start = function () {
        this.getWidth();
        this.getHeight();
        this.setDefault();
        var position = { left: parseInt(this.width * 0.5), top: parseInt(this.height * 0.5) };
        this.position(position);
        this.event();
    }
    this.event = function () {
        var self = this;
        this.each(function (config) {
            //具备元素和类型,才有意义定义其拖拽方式
            if (config.drag) {
                var d = config.drag;
                for (var i = 0; i < d.length; i++) {
                    if (d[i].control && d[i].type) {
                        if (d[i].type in self.move) {
                            d[i].control = $(d[i].control);
                            self.move[d[i].type](d[i].control);
                        }
                    }
                }
            }
        });
    }
    this.position = function (position) {
        var self = this;
        this.each(function (config) {
            //具备元素和定位,才有意义帮助其定位
            if (config.control && config.location) {
                if (config.location in self) {
                    if (typeof config.control !== "object") config.control = $(config.control);

                    var size = self[config.location](position), control = config.control, blag = self.blag.drag;
                    if (blag.width) {
                        control.width(size.width)[0].style.left = size.left;
                    }
                    if (blag.height) {
                        control.height(size.height)[0].style.top = size.top;
                    }

                }
            }
        });
    }
    //验证元素是否继续按照鼠标点移动定位和改变大小
    this.matchPosition = function (position) {
        var self = this, re = true;
        this.each(function (config) {
            //具备元素和定位,才有意义帮助其定位
            if (config.control && config.location) {
                if (config.location in self) {
                    var size = self[config.location](position), blag = self.blag.drag;
                    if (size.width < 300) {
                        blag.width = false;
                    }
                    if (size.height < 100) {
                        blag.height = false;
                    }
                    if (!blag.width && !blag.height) {
                        re = false;
                        return false;
                    }
                }
            }
        });
        return re;
    }
    this.each = function (callback) {
        var arr = this.configs;
        for (var i = 0; i < arr.length; i++) {
            var c = callback(arr[i]);
            if (typeof c === "boolean") {
                if (c === false) break;
            }
        }
    }
    this.left_top = function (position) {
        return { top: this.paddingH + "px", left: this.paddingW + "px", width: position.left - parseInt(1.5 * this.paddingW), height: position.top - parseInt(1.5 * this.paddingH) };
    }
    this.right_top = function (position) {
        return { top: this.paddingH + "px", left: position.left + parseInt(0.5 * this.paddingW) + "px", width: this.width - position.left - parseInt(1.5 * this.paddingW), height: position.top - parseInt(1.5 * this.paddingH) };
    }
    this.left_bottom = function (position) {
        return { top: position.top + parseInt(0.5 * this.paddingH) + "px", left: this.paddingW + "px", width: position.left - parseInt(1.5 * this.paddingW), height: this.height - position.top - parseInt(1.5 * this.paddingH) };
    }
    this.right_bottom = function (position) {
        return { top: position.top + parseInt(0.5 * this.paddingH) + "px", left: position.left + parseInt(0.5 * this.paddingW) + "px", width: this.width - position.left - parseInt(1.5 * this.paddingW), height: this.height - position.top - parseInt(1.5 * this.paddingH) };
    }
    this.getCenterPosition = function () {
        var re = { top: 0, left: 0 };
        this.each(function (config) {
            if (config.location === "left_top") {
                var control = config.control;
                re.top = control.height() + parseInt(control[0].style.top.replace("px", "")) * 1.5;
                re.left = control.width() + parseInt(control[0].style.left.replace("px", "")) * 1.5;
                return false;
            }
        });
        return re;
    }
    this.move = {
        upper: this,
        sw: function (control) {
            var self = this, upper = this.upper, blag = upper.blag.drag;

            control.unbind("mousedown").mousedown(function () {
                var cPosition = upper.getCenterPosition();
                var dif = { left: NowMousePosition[0] - cPosition.left, top: NowMousePosition[1] - cPosition.top }
                AddMouseMoveFunc("mouseMove_gridResize", function () {
                    var position = { left: NowMousePosition[0] - dif.left, top: NowMousePosition[1] - dif.top };
                    //是否符合变化元素大小条件
                    if (upper.matchPosition(position)) {
                        upper.position(position);
                        upper.save();
                    }
                    blag.width = true, blag.height = true;
                });
                AddMouseUpFunc("mouseUp_gridResize", function () {

                    removeMMRFunc("mouseMove_gridResize");
                    removeMURFunc("mouseUp_gridResize");
                });
            });
        }
    }

    this.start();
}