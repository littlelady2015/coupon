//推荐位模块

var Rachel =
    {
        data: {
            restype: 2001,
            moduleKeys: 'yzg_event_28xxsp,yzg_event_ddnp,yzg_event_jjqj,yzg_event_mzxh,yzg_event_3csm'
        },
        init: function () {
            this.getItemList();
            this.toggle();
            this.getCoupons();
            this.feedback();
            this.slider();
        },
        apis: {
            recommendApi: "//search.ule.com/api/recommend?jsoncallback=?",
            // 领券
            list: "//prize.beta.ule.com/mc/m/api/v2/base/coupon/couponListBySearch?callback=?",
            //返回字段
            receive: "//prize.beta.ule.com/mc/m/api/v2/base/coupon/receiveCoupon?callback=?"
        },
        //tips
        getTips: function () {

        },
        getItemList: function () {
            var self = this;
            var html = $('#itemTpl').html();
            //拿到各模块推荐位码
            var rcmdCode = [];
            rcmdCode = self.data.moduleKeys.split(",");
            $.getJSON(self.apis.recommendApi, self.data, function (O) {
                for (var i = 0, rlen = rcmdCode.length; i < rlen; i++) {
                    //获取模板 初始化
                    var itemHtml = '';
                    console.log(O[rcmdCode[i]])
                    if (!O[rcmdCode[i]]) continue;
                    for (var m = 0, mlen = O[rcmdCode[i]].length; m < mlen; m++) {
                        if (!O[rcmdCode[i]][m].customAttribute) continue;
                        O[rcmdCode[i]][m].customAttribute = JSON.parse(O[rcmdCode[i]][m].customAttribute);
                        var a = O[rcmdCode[i]][m].customAttribute;
                        if (a.tag) {
                            O[rcmdCode[i]][m].tagClass = "hasClass";
                            O[rcmdCode[i]][m].tag = a.tag;
                        }
                        itemHtml += html.substitute(O[rcmdCode[i]][m]);
                    }
                    $('.item-wrapper-' + (i + 1)).append(itemHtml);
                }
            });
        },
        getCoupons: function () {
            //拿到优惠券字段
            var self = this;
            var couHtml = $("#couTpl").html();
            var par = {
                //必传参数
                channel: "100000",
                types: "1,2,3,4,5",
                detailId: "",
                useScene: "4000",
                activityNo: 'MA_U_150771417435162',
                sortBy: '8000'
            };
            var couTpl = $('#couTpl').html();
            $.getJSON(self.apis.list, par, function (O) {
                var coulen = O.result.confList.prizeCouponList.length;
                var couHtml = '';
                for (var j = 0; j < coulen; j++) {
                    // console.log(O.result.confList.prizeCouponList[j]);
                    couHtml += couTpl.substitute(O.result.confList.prizeCouponList[j]);
                    couHtml += couTpl.substitute(O.result.confList.prizeCouponList[j]);
                }
                $('.coupons').append(couHtml);
            });
            //定义点击事件
            $(".coupon").live('click', function () {
                $('.couDialog').attr("data-click", 'true');
                $('.popbox').show();
                self.closeDialog();
            });
        },
        //关闭对话框
        closeDialog: function () {
            $('.couDialog').find(".couClose,.confirm").click(function () {
                $('.popbox').hide();
            })
        },
        //返回信息判断
        feedback: function () {
            var self = this;
            //必要参数
            var par = {
                'activityCode': 'MA_U_150771417435162',
                'couponDetailId': '1546',
                'channel': '100000'
            };
            $.getJSON(self.apis.receive, par, function (O) {
                    //初始化定义

                    var couCss = 'error';
                    var tip = '<p>蓝瘦，香菇，</p><p>此券已从你的全世界路过。</p>';
                    var prompt = '<p>更多优惠等你来抢，快试试其他优惠券吧！</p>';
                    var code = '';
                    var btn = '';
                    switch (O.code) {
                        case '0000':
                            couCss = 'success';
                            tip = '<p>恭喜你，</p><p>成功领取' + O.amount + '元优惠券一张！</p>';
                            prompt = '<p>优惠券使用条件：</p><p>1、仅限购买活动页商品使用；</p><p>2、使用时间' + O.startDate + "~" + O.expireDate + '</p>';
                            btn = '<a href="//my.ule.com/mywallet/coupon/queryCouponDetail.do" target="_blank" class="myCoupons">查看我的优惠券</a>';
                            break;
                        case '3003':
                            couCss = 'other';
                            tip = '<p>哎哟喂，还是慢了一拍，</p><p>该优惠券今日已领完！</p>';
                            break;
                        case '3004':
                            couCss = 'other';
                            tip = '<p>哎哟喂，还是慢了一拍，</p><p>该优惠券已领完！</p>';
                            break;
                        case '3005':
                        case '3006':
                        case  '3009':
                            couCss = 'other';
                            tip = '<p>亲，该优惠券领取有限制。</p><p>具体查看活动规则。</p>';
                            break;
                        case '9002':
                            couCss = 'other';
                            tip = '<p>活动优惠券领取实在太火爆，您没有抢到哦！ </p>';
                            break;
                        case '9003':
                            couCss = 'other';
                            tip = '<p>hi亲，</p><p>您今天领的券实在太多了！</p>';
                            break;
                        case  '3007':
                            couCss = 'other';
                            tip = '<p>亲，该优惠券不在领取时间内哦，不能领取！</p>';
                            break;
                        case '9999':
                            couCss = 'other';
                            tip = '<p>亲，你还没有登录哦~快到页面顶部点击登录吧！</p>'
                        default :
                            couCss = 'other';
                            tip = '<p>啊哦，您的浏览器出错了</p>'
                    }
                    var feHtml = $("#popbox").html();
                    feedHtml = feHtml.substitute({
                            'code': code,
                            'couCss': couCss,
                            'tip': tip,
                            'prompt': prompt,
                            'btn': btn
                        }
                    );
                    $('.popbox').append(feedHtml);
                    // console.log(O.code);
                }
            )
        },
        toggle: function () {
            var flag = true;
            $(".ckmore").bind("click", function () {
                var c = $(".coupons").eq(0);
                if (flag) {
                    c.removeClass('h100').addClass('hauto');
                    $('.ckmore')[0].innerHTML = '收起';
                    $('.box_top').show();
                    $('.box_bottom').hide();
                    flag = !flag;
                }
                else {
                    c.removeClass('hauto').addClass('h100');
                    $('.ckmore')[0].innerHTML = '点击查看更多';
                    $('.box_bottom').show();
                    $('.box_top').hide();
                    flag = !flag;
                }
            });

            //侧边栏
            function reiszeFn() {
                var h1 = $(window).scrollTop();
                if (h1 > 450) {
                    $(".slider-wrapper").show();
                }
                else {
                    $(".slider-wrapper").hide();
                }
            }

            $(window).scroll(function () {
                reiszeFn();
            })
        },
        //滚动条
        slider: function () {
            for (var i = 0, len = $(".slider li").length; i < len; i++) {
                //获取索引值
                $(".slider li").eq(i).attr("index", i+1);
            }
            $(".slider li").click(function () {
                var s = $(this).attr("index");
                h = 0;
                for (var j = 1; j < s+1; j++) {
                   h+=$(".item-wrapper-"+j).height();
                }
                $("html,body").animate({scrollTop: h}, 500);
            })
        }

    }
$(function () {
    Rachel.init();
});