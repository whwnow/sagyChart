/// <reference path="jquery-1.7.2.min.js" />
/// <reference path="knockout-2.2.1.debug.js" />

//#region ComboBox

; (function ($) {

    $.fn.ComboBox = function (opt) {
        $.ComboBox(this, opt);
        return this;
    };

    $.ComboBox = function (target, opt) {
        opt = $.extend(true, {
            list: [],
            speed: 200, //动画速度            
            comboBox: {
                width: "auto",  //定义ComboBox边框宽度
                height: 52,
                borderRadio: 3,
                border: "1px solid #b3b3b3",
                font: {
                    fontSize: 26,
                    lineHeight: 52,
                    color: "#4f4f4f"
                },
            },
            comboBoxItem: {
                height: 60,
                font: {
                    fontSize: 26,
                    lineHeight: 60,
                    color: "#4f4f4f"
                },
            },
            sType: 1,
            alone: true,
            defaultOption: 1, //默认显示项
            enableMobile: false, //true为启用  默认false
            dataBind: {
                itemsSource: "",
                displayNamePath: "",
                selectedValuePath: "",
                selectedChanged: ""
            },
            callback: function (itemID, itemName) { return true; },
            complete: function () { return true },
            _target: target
        }, opt);

        var KEY = {
            UP: 38,      //向上
            DOWN: 40,    //向下
            DEL: 46,
            TAB: 9,
            RETURN: 13,  //确定
            ESC: 27,
            COMMA: 188,   //逗号
            PAGEUP: 33,    //最前
            PAGEDOWN: 34,  //最后
            BACKSPACE: 8  //退格
        };

        switch (opt.sType) {
            case 1:
                drawComboBoxStyle1(opt._target, opt);
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            default: break;
        }
    }



    //第一种
    function drawComboBoxStyle1(target, opt) {
        var taget = target;
        var registerEvent = opt.enableMobile ? "tap" : "click";
        $(target).addClass('ui_cb').height(opt.comboBox.height);
        var itemList = "";
        if (!isKo) {
            for (var i = 0; i < opt.list.length; i++) {
                itemList += '<li style="line-height:' + opt.comboBoxItem.font.lineHeight + 'px; height:' + opt.comboBoxItem.height + 'px; font-size:'
                    + opt.comboBoxItem.font.fontSize + 'px; color:' + opt.comboBoxItem.font.color + ';" '
                    + ' itemid= ' + (opt.list[i][0] + "") + '><span>' + (opt.list[i][1] + "") + '</span></li>';
            }
        }
        var isKo = opt.dataBind.itemsSource.length && opt.dataBind.displayNamePath.length && opt.dataBind.selectedValuePath.length;
        var defOp = opt.defaultOption > opt.list.length ? 1 : (opt.defaultOption < 1 ? 1 : opt.defaultOption);
        $(target).append('<div class="bt" style="border:' + opt.comboBox.border + '; border-radius:' + opt.comboBox.borderRadio + 'px ; color:' + opt.comboBox.font.color + '; font-size:' + opt.comboBox.font.fontSize + 'px">' +
                '<span class="cb_title" style="line-height:' + opt.comboBox.font.lineHeight + 'px; "' + (isKo ? 'data-bind="text:' + opt.dataBind.itemsSource + '()[0].name"' : "") + '>' + (isKo ? '' : (typeof (opt.defaultOption) == "string" && opt.defaultOption.length > 2 ? opt.defaultOption : opt.list[defOp - 1][1])) + '</span>' +
                '<div class="cb_caret"><div class="drop_icon"></div></div>' +
                '<div class="sz"></div>' +
            '</div>' +
            //列表部分
            '<div class="combo_list" speed="' + opt.speed + '">' +
                '<ul ' + (isKo ? 'data-bind="foreach:' + opt.dataBind.itemsSource + '"' : '') + '>' +
                   (isKo ? '<li style="line-height:' + opt.comboBoxItem.font.lineHeight + 'px; height:' + opt.comboBoxItem.height + 'px; font-size:'
                    + opt.comboBoxItem.font.fontSize + 'px; color:' + opt.comboBoxItem.font.color + ';" data-bind="click:function(item){$parent.' + opt.dataBind.selectedChanged + '($parent.' + opt.dataBind.itemsSource + '()[$index()])}"><span data-bind="attr:{itemid:' + opt.dataBind.selectedValuePath + '},text:' + opt.dataBind.displayNamePath + '">' + '</span></li>' : itemList) +
                '</ul>' +
                '<div class="sawtooths"><div></div></div>' +
            '</div>' +
            '' +
            '' +

            '');



        //调整宽度
        if (!isKo) {
            var clw = $(target).find('.combo_list');
            if (opt.comboBox.width !== "auto") {
                $(target).width(opt.comboBox.width);
                $(target).find('li span').width($(target).width() - 20);
                $(target).find('.cb_title').width($(target).width() - 40);
            } else {
               
                    function serachWidth(){
                        if (clw.width()) {
                            $(taget).width(clw.width() + 10).find('.cb_title').width(clw.width() - 70);
                        } else {
                            setTimeout(serachWidth, 100);
                        }
                    }
                    setTimeout(serachWidth, 100);
            }
        } else {
            if (opt.comboBox.width !== "auto") {
                $(target).width(opt.comboBox.width);
                $(target).find('li span').width($(target).width() - 20);
                $(target).find('.cb_title').width($(target).width() - 40);
            }
            opt.complete();
        }

        //注册ComboBox动作
        registerSilder(target, opt, isKo);
    }
    //第二种
    function drawComboBoxStyle2(target, opt) {

    }
    //第三种
    function drawComboBoxStyle3(target, opt) {

    }
    //第四种
    function drawComboBoxStyle4(target, opt) {

    }

    //注册展开事件
    function registerSilder(target, opt, isKo) {
        var registerEvent = opt.enableMobile ? 'tap' : 'click';
        $(target).live(registerEvent, $.extend({}, opt), function (e) {
            e.stopPropagation();

            //验证ComboBox中是否有Item
            if (!$(target).find('li').length) { return; }

            //验证是否影响其它
            if (opt.alone) {
                $('.combo_list').not(target.find('.combo_list')).slideUp(opt.speed);
                $('.ui_cb').not(target).find('.drop_icon').removeClass('drop_rotate');
            }

            var cl = $(this).find('.combo_list');
            var di = $(this).find('.drop_icon');
            var isShow = cl.is(':visible');
            var isSpeed = cl.is(':animated');
            if (isShow && !isSpeed) {
                cl.slideUp(opt.speed);
                di.removeClass('drop_rotate');
            } else {
                cl.slideDown(opt.speed);
                di.addClass('drop_rotate');
                if (isKo) {
                    var clw = $(target).find('.combo_list');
                    if (opt.comboBox.width === "auto") {
                        $(target).width(clw.width()).find('.cb_title').width(clw.width() - 70);
                    }
                }
            }
        });

        $(target).find('li').live(registerEvent, $.extend({}, opt), function (e) {
            var itemID = $(this).attr('itemid'), itemName = $(this).text();
            opt.callback(itemID, itemName);
            $(target).find('.cb_title').text(itemName);
            $(this).parents('.ui_cb').find('.drop_icon').removeClass('drop_rotate').end().find('.combo_list').slideUp(opt.speed);
        });

        $(target).find('.combo_list').live(registerEvent, $.extend({}, opt), function (e) {
            e.stopPropagation();
        });
    };

    var lenReg = function (str) {
        return str.replace(/[^x00-xFF]/g, '**').length;
    };

})(jQuery);

//#endregion 

//#region Button

; (function ($) {

    $.fn.Button = function (opt) {
        $.Button(this, opt);
        return this;
    };
    $.Button = function (target, opt) {
        opt = $.extend(true, {
            btnType: 1,
            content: "按钮名称",
            eventName: "click",
            style: {
                height: 52,
                width: "auto",
                lineHeight: 52
            },
            callback: function (a) { return true; },
            _target: target
        }, opt);

        //生成按钮样式
        $(target).addClass('ui_btn ui_btn_style' + opt.btnType).attr('data-role','none').append(opt.content);
        drawBtnStyle(opt._target, opt);
    };

    function drawBtnStyle(target, opt) {
        //验证宽度
        opt.style.width !== "auto" && opt.style.width > $(target).width() && $(target).width(opt.style.width);
        $(target).live(opt.eventName, $.extend({}, opt), function (e) {
            e.stopPropagation();
            if ($(this).attr('disabled') == undefined) {
                opt.callback();
            }
        });
    }

})(jQuery);

//#endregion

//#region ToggleButton

; (function ($) {

    $.fn.ToggleButton = function (a, b, opt) {
        $.ToggleButton(this, a, b, opt);
        return this;
    };
    $.ToggleButton = function (target, a, b, opt) {
        opt = $.extend(true, {
            btnType: 1,
            isRever: false,
            eventName: "click",
            callback: function () { return true; },
            _target: target
        }, opt);

        $(opt._target).addClass('ui_tgb ui_tgb_style' + opt.btnType + (opt.isRever ? ' ui_tgb_style' + opt.btnType + '_rever' : '')).attr('data-role', 'none');
        typeof (a) === "function" && typeof (b) === "function" && setEvent(opt._target, a, b, opt);
    };

    function setEvent(target, a, b, opt) {
        var arg = [].slice.call(arguments, 1), backup = arg.concat();
        $(target).live(opt.eventName, $.extend({}, opt), function (e) {
            if ($(target).attr('disabled') == "disabled") { return; }
            if (arg.length <= 1) { arg = backup.concat(); }
            arg[0].call(this, e);
            arg.shift() && opt.callback();
            $(target).hasClass('ui_tgb_style' + opt.btnType + '_rever') ? $(target).removeClass('ui_tgb_style' + opt.btnType + '_rever') : $(target).addClass('ui_tgb_style' + opt.btnType + '_rever');
        });
    }

})(jQuery);

//#endregion

//下拉列表弹回
$(document).live("click", function (e) {
    var cl = $('.combo_list'), di = $('.drop_icon'), speed = parseInt(cl.attr('speed'));

    cl.not(':animated').slideUp(speed);
    di.removeClass('drop_rotate');
});

$("rect,g,svg,canvas").live("mousedown", function (e) {
    var cl = $('.combo_list'), di = $('.drop_icon'), speed = parseInt(cl.attr('speed'));

    cl.not(':animated').slideUp(speed);
    di.removeClass('drop_rotate');
});

;(function ($) {
    jQuery.fn.extend({
        "disable": function () {
            $(this).attr('disabled', 'disabled');
        },
        "removeDisable": function () {
            $(this).removeAttr('disabled');
        },
        "comboBoxContent": function (value) {
            $(this).find('.cb_title').text(value);
        }
    });
})(jQuery);

//(function ($) {
//    $.fn.getStyleObject = function () {
//        var dom = this.get(0);
//        var style;
//        var returns = {};
//        if (window.getComputedStyle) {
//            var camelize = function (a, b) {
//                return b.toUpperCase();
//            };
//            style = window.getComputedStyle(dom, null);
//            for (var i = 0, l = style.length; i < l; i++) {
//                var prop = style[i];
//                var camel = prop.replace(/\-([a-z])/g, camelize);
//                var val = style.getPropertyValue(prop);
//                returns[camel] = val;
//            };
//            return returns;
//        };
//        if (style = dom.currentStyle) {
//            for (var prop in style) {
//                returns[prop] = style[prop];
//            };
//            return returns;
//        };
//        return this.css();
//    }
//})(jQuery);

//$(document).ready(function (e) {
//    var styles = $('#button1').getStyleObject();
//    $('#button').css(styles);
//});
//$.fn.copyCSS = function (source) {
//    var styles = $(source).getStyleObject();
//    this.css(styles);
//}

