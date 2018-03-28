//推荐位模块
var Rachel =
    {
        data: {restype: 2001, moduleKeys: 'ulenp_20180328_bfch', },
        init: function () {
            this.getItemList();
            this.toggle();
            this.getCoupons();
        },
        apis: {
            recommendApi: "//search.ule.com/api/recommend?jsoncallback=?",
            // 领券
            list: "//prize.beta.ule.com/mc/m/api/v2/base/coupon/couponListBySearch?callback=?",
            //返回字段
            receive: "//prize.ule.com/mc/m/api/v2/base/coupon/receiveCoupon?callback=?"
        },
        getItemList: function () {
            var self = this;
            //获取模板 初始化
            var itemHtml = '';
            var html = $('#itemTpl').html();
            $.getJSON(self.apis.recommendApi, self.data, function (O) {

                    var itemData = O[self.data.moduleKeys];
                    for (var i = 0; i < 5; i++) {
                        itemHtml += html.substitute(itemData[i]);
                    }
                    $('.item-wrapper').append(itemHtml);
                }
            )
        },
        getCoupons:function () {
            //拿到优惠券字段
            var self = this;
            var par = {
                channel : "100000",
                types : "1,2,3,4,5",
                useScene : "4000"
            };
            var code=$('#codeTpl').html();
          $.getJSON(self.apis.list,par,function (O) {
          console.log(O['MA_U_152142467926053']);
              // for(var i=0;i<5;i++){
              //     codeHtml=0;
              // }
              }
        )
        },
        toggle: function () {
            $(".ckmore").bind("click", function () {
                var h = $(".coupons").eq(0).height();
                if (h < 150) {
                    $('.coupons')[0].style.height = "300px";
                    $('.ckmore')[0].innerHTML = '收起';
                    $('.box_bottom').css("display", "none");
                    $('.box_top').css("display", "block");
                }
                else {
                    $('.coupons')[0].style.height = "100px";
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