var demo = function (option) {
    this.advanceConfig = {
        upper: this,
        layerContrl: null,
        control: null,
        width: 0,
        height: 0,
        //高级编辑入口
        create: function () {
            var self = this;
            self.width = $(window).width(), self.height = $(window).height();
            self.layerContrl = common.alert.create({
                width: self.width, height: self.height, control: "<div class='advanceConfig' id='advanceConfig'>" +
                    "<div class='boxs fieldConfig'><div class='dragWResize'></div><div class='dragSResize'></div><div class='dragSeResize' style='bottom:0;right:0;'><div class='moveIcon'></div></div><div class='line'><div class='fl'>配置窗口</div></div><div class='line'><div class='tabRect' config='basic'></div><div class='tabRect ml15' config='axisX'></div><div class='tabRect ml15' config='axisY'></div><div class='tabRect ml15' config='picType'></div></div></div>" +
                    "<div class='boxs preview'><div class='dragWResize'></div><div class='dragSResize'></div><div class='dragNeResize' style='bottom:0;left:0;'><div class='moveIcon'></div></div></div>" +
                    "<div class='boxs dataConfig'><div class='dragWResize'></div><div class='dragSResize'></div><div class='dragNeResize' style='top:0;right:0;'><div class='moveIcon'></div></div></div>" +
                    "<div class='boxs sqlConfig'><div class='dragWResize'></div><div class='dragSResize'></div><div class='dragSeResize' style='top:0;left:0;'><div class='moveIcon'></div></div></div>" +
                    "</div>",
                showClose: false, loaded: function () {
                    self.set();
                },
                onresize: function () {
                    /*
                    self.setPosition();*/
                    self.width = $(window).width(), self.height = $(window).height();
                    self.layerContrl.$content.width(self.width).height(self.height).css({ "top": "0px", "left": "0px" });
                    self.gird.onresize();
                },
                close: function () {
                    self.layerContrl = null;
                }
            });
        },

        set: function () {
            var advanceJson = {},
                upper = this.upper,
                dataConfig = upper.config || {},
                advance = dataConfig.AdvanceConfig || "",
                u = upper.control = {},
                $advanceConfig = u.$advanceConfig = $("#advanceConfig");

            u.$boxs = $advanceConfig.children(".boxs");
            var $fieldConfig = u.$fieldConfig = $advanceConfig.children(".fieldConfig"),
                $preview = u.$preview = $advanceConfig.children(".preview"),
                $dataConfig = u.$dataConfig = $advanceConfig.children(".dataConfig"),
                $sqlConfig = u.$sqlConfig = $advanceConfig.children(".sqlConfig");
            u.$basic = $fieldConfig.find("div[config='basic']"),
            u.$axisX = $fieldConfig.find("div[config='axisX']"),
            u.$axisY = $fieldConfig.find("div[config='axisY']"),
            u.$picType = $fieldConfig.find("div[config='picType']");

            try {
                advanceJson = JSON.parse(advance);
            } catch (e) {
            }

            this.initHtml();
            //this.setPosition();
            this.setData();

            //girdResize
            var g = this.gird = new girdResize([
                {
                    drag: [{ control: $fieldConfig.children(".dragSResize"), type: "s" }, { control: $fieldConfig.children(".dragWResize"), type: "w" }, { control: $fieldConfig.children(".dragSeResize"), type: "sw"}],
                    control: $fieldConfig,
                    location: "left_top"
                },

                {
                    drag: [{ control: $preview.children(".dragSResize"), type: "s" }, { control: $preview.children(".dragWResize"), type: "w" }, { control: $preview.children(".dragNeResize"), type: "sw"}],
                    control: $preview,
                    location: "right_top"
                },
                {
                    drag: [{ control: $dataConfig.children(".dragSResize"), type: "s" }, { control: $dataConfig.children(".dragWResize"), type: "w" }, { control: $dataConfig.children(".dragNeResize"), type: "sw"}],
                    control: $dataConfig,
                    location: "left_bottom"
                },

                {
                    drag: [{ control: $sqlConfig.children(".dragSResize"), type: "s" }, { control: $sqlConfig.children(".dragWResize"), type: "w" }, { control: $sqlConfig.children(".dragSeResize"), type: "sw"}],
                    control: $sqlConfig,
                    location: "right_bottom"
                },
                { event: {
                    mousedown: function () { },
                    mouseup: function (gridResize) {
                        var g = gridResize; //this.eachOptions
                        g.eachOptions(function (option) {
                            console.log(option)
                        });
                    }
                }
                }
            ]);
            
        },
        initHtml: function () {
            this.initFieldConfigHtml();
        },
        setPosition: function () {
            var u = this.upper.control;
            var $boxs = u.$advanceConfig.children(".boxs");
            var w = this.width,
                h = this.height,
                boxPadW = parseInt($boxs.css("padding-left").replace("px", "")) * 2,
                boxPadH = parseInt($boxs.css("padding-top").replace("px", "")) * 2,
                boxW = (w - 10) / 2 - 30 - boxPadW, //(w - 10 - 60 - boxPadW) / 2,
                boxH = (h - 10) / 2 - 30 - boxPadH;
            $boxs.width(boxW).height(boxH);

            this.setFieldConfigPosition(boxW, boxH, boxPadW, boxPadH);
            this.setPreviewPosition(boxW, boxH, boxPadW, boxPadH);
            this.setDataConfigPosition(boxW, boxH, boxPadW, boxPadH);
            this.setSqlConfigPosition(boxW, boxH, boxPadW, boxPadH);
        },
        setData: function () {
        },
        initFieldConfigHtml: function () {
            var u = this.upper.control;

            u.$basic.append("<div class='title'><span class='num'>1</span><span class='tit'>基本配置</span></div>");
            u.$axisX.append("<div>X轴配置</div>");
            u.$axisY.append("<div>Y轴配置</div>");
            u.$picType.append("<div>线型配置</div>");
        },
        setFieldConfigPosition: function (boxW, boxH, boxPadW, boxPadH) {
            var u = this.upper.control,
                $fieldConfig = u.$fieldConfig,
                $tabRect = $fieldConfig.find('.tabRect'),
                $dragWResize = $fieldConfig.find('.dragWResize'),
                $dragSResize = $fieldConfig.find('.dragSResize'),
                $dragSeResize = $fieldConfig.find('.dragSeResize'),
                sHeight = $dragSResize.height(),
                seWidth = $dragSeResize.width(),
                seHeight = $dragSeResize.height(),
                w = boxW + boxPadW,
                h = boxH + boxPadH,
                tabRectW = (boxW - 15 * 3 - 2 * 4 - 2) / 4,
                tabRectH = boxH - 30 - 10;

            $tabRect.width(tabRectW).height(tabRectH);
            $dragWResize.height(h - seHeight).css({ "top": "0", "right": "0" });
            $dragSResize.width(w - seWidth).css({ "bottom": "0", "left": "0" });
            $dragSeResize.css({ "bottom": "0", "right": "0" });
        },
        setPreviewPosition: function (boxW, boxH, boxPadW, boxPadH) {
            var u = this.upper.control,
                $preview = u.$preview,
                $tabRect = $preview.find('.tabRect'),
                $dragWResize = $preview.find('.dragWResize'),
                $dragSResize = $preview.find('.dragSResize'),
                $dragNeResize = $preview.find('.dragNeResize'),
                sHeight = $dragSResize.height(),
                seWidth = $dragNeResize.width(),
                seHeight = $dragNeResize.height(),
                w = boxW + boxPadW,
                h = boxH + boxPadH;
            $dragWResize.height(h - seHeight).css({ "top": "0", "left": "0" });
            $dragSResize.width(w - seWidth).css({ "bottom": "0", "right": "0" });
            $dragNeResize.css({ "bottom": "0", "left": "0" });
        },
        setDataConfigPosition: function (boxW, boxH, boxPadW, boxPadH) {
            var u = this.upper.control,
                $dataConfig = u.$dataConfig,
                $tabRect = $dataConfig.find('.tabRect'),
                $dragWResize = $dataConfig.find('.dragWResize'),
                $dragSResize = $dataConfig.find('.dragSResize'),
                $dragNeResize = $dataConfig.find('.dragNeResize'),
                sHeight = $dragSResize.height(),
                seWidth = $dragNeResize.width(),
                seHeight = $dragNeResize.height(),
                w = boxW + boxPadW,
                h = boxH + boxPadH;
            $dragWResize.height(h - seHeight).css({ "bottom": "0", "right": "0" });
            $dragSResize.width(w - seWidth).css({ "top": "0", "left": "0" });
            $dragNeResize.css({ "top": "0", "right": "0" });
        },
        setSqlConfigPosition: function (boxW, boxH, boxPadW, boxPadH) {
            var u = this.upper.control,
                $dataConfig = u.$sqlConfig,
                $tabRect = $dataConfig.find('.tabRect'),
                $dragWResize = $dataConfig.find('.dragWResize'),
                $dragSResize = $dataConfig.find('.dragSResize'),
                $dragSeResize = $dataConfig.find('.dragSeResize'),
                sHeight = $dragSResize.height(),
                seWidth = $dragSeResize.width(),
                seHeight = $dragSeResize.height(),
                w = boxW + boxPadW,
                h = boxH + boxPadH;
            $dragWResize.height(h - seHeight).css({ "bottom": "0", "left": "0" });
            $dragSResize.width(w - seWidth).css({ "top": "0", "right": "0" });
            $dragSeResize.css({ "top": "0", "left": "0" });
        },
        get: function () {
            var advanceJson = {}, upper = this.upper, dataConfig = upper.config;
        }
    }
}
