//推荐位模块

var Rachel =
    {
        data: {restype: 2001, moduleKeys: 'ulenp_20180328_bfch,event_apr_20180320_traval,event_apr_20180320_care'},
        init: function () {
            this.getItemList();
            this.toggle();
            this.getCoupons();
            this.feedback();
        },
        apis: {
            recommendApi: "//search.ule.com/api/recommend?jsoncallback=?",
            // 领券
            list: "//prize.beta.ule.com/mc/m/api/v2/base/coupon/couponListBySearch?callback=?",
            //返回字段
            receive: "//prize.beta.ule.com/mc/m/api/v2/base/coupon/receiveCoupon?callback=?"
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
                    for (var m = 0, mlen = O[rcmdCode[i]].length; m < mlen; m++) {
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
                sortBy:'8000'
            };
            var couTpl = $('#couTpl').html();
            $.getJSON(self.apis.list, par, function (O) {
                var coulen = O.result.confList.prizeCouponList.length;
                for (var j = 0; j < coulen; j++) {
                    var couHtml = '';
                    console.log(O.result.confList.prizeCouponList[j]);
                    couHtml = couTpl.substitute(O.result.confList.prizeCouponList[j]);
                    $('.coupon-' + (j+1)).append(couHtml);
                }
            });
            //定义点击事件
            $(".coupon").live('click',function () {
                 $('.couDialog').show();
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
                var receiveMsg={
                    couCss : 'error',
                    tip : '<p>蓝瘦，香菇，</p><p>此券已从你的全世界路过。</p>',
                    prompt :'<p>更多优惠等你来抢，快试试其他优惠券吧！</p>',
                    code : '',
                    btn : ''
                }

                    switch (O.code) {
                        case '0000':
                            couCss = 'success';
                            tip = '<p>恭喜你，</p><p>成功领取' + O.amount + '元优惠券一张！</p>';
                            prompt = '<p>优惠券使用条件：</p><p>1、仅限购买活动页商品使用；</p><p>2、使用时间' + O.startDate + "~" + O.expireDate + '</p>';
                            btn = '<a href="//my.ule.com/mywallet/coupon/queryCouponDetail.do" target="_blank" class="myCoupons">查看我的优惠券</a>';
                            break;
                        case '3003':
                            tip = '<p>哎哟喂，还是慢了一拍，</p><p>该' + __txt + '今日已领完！</p>';
                            break;
                        case '3004':
                            tip = '<p>哎哟喂，还是慢了一拍，</p><p>该' + __txt + '已领完！</p>';
                            break;
                        case '9002':
                            tip = '<p>活动优惠券领取实在太火爆，您没有抢到哦！ </p>';
                            break;
                        case '9003':
                            tip = '<p>hi亲，</p><p>您今天领的券实在太多了！</p>';
                            break;
                        case  '3007':
                            tip = '<p>亲，该优惠券不在领取时间内哦，不能领取！</p>';
                            break;
                        case '9999':
                            tip = '<p>亲，你还没有登录哦~快到页面顶部点击登录吧！</p>'
                        default :
                            couCss = 'disabled';
                            tip = '<p>啊哦，您的浏览器出错了</p>'
                    }
                    var feHtml =$("#popbox").html();
                    feedHtml =feHtml.substitute(receiveMsg);
                    $('.popbox').append(feedHtml);
                    $('.couDialog').css("display","none");
                }
            )
        },
        toggle: function () {
            $(".ckmore").bind("click", function () {
                var c = $(".coupons").eq(0);
                var h = $(".coupons").eq(0).height();
                if (h < 150) {
                    c.height(300);
                    $('.ckmore')[0].innerHTML = '收起';
                    $('.box_bottom').css("display", "none");
                    $('.box_top').css("display", "block");
                }
                else {
                    c.height(100);
                    $('.ckmore')[0].innerHTML = '点击查看更多';
                    $('.box_top').css("display", "none");
                    $('.box_bottom').css("display", "block");
                }
            });
        }
    }
$(function () {
    Rachel.init();
});