$(function (){
    $(window).on("resize",function(){
		$("html").css("fontSize",$(window).width()/6.4);
    }).resize();
    
    //微信分享
    weixinFenxiang()
    function weixinFenxiang(){
        $.get('http://www.hw.mangofun.cn/' + 'api/wx?url='+encodeURIComponent(window.location.href)+'&callback=?',function (data){
            data = $.extend({}, data ,{"debug" : false});
            console.log(1)
            wx.config(data);
            wx.ready(function () {
                wx.checkJsApi({
                    jsApiList: [
                        'getNetworkType',
                        'previewImage',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'onMenuShareQZone'
                    ]// 需要检测的JS接口列表，所有JS接口列表见附录2,
                });

                // 朋友圈
                var wxData1 = {
                    "title": "《火王：破晓之战》正版手游 预约火热开启", // 分享标题
                    "link": location.href.split('#')[0], // 分享链接
                    "imgUrl": 'http://www.hw.mangofun.cn/images/ad_1_logo.png' // 分享图标,
                };
                // 好友
                var wxData2 = {
                    "title": "《火王：破晓之战》正版手游 预约火热开启", // 分享标题
                    "desc": "《火王：破晓之战》邀你共赏全新幻想国风世界",
                    "link": location.href.split('#')[0], // 分享链接
                    "imgUrl": 'http://www.hw.mangofun.cn/images/ad_1_logo.png' // 分享图标,
                };

                var weixin = function (){
                    wx.onMenuShareTimeline({ //分享到朋友圈
                        title: wxData1.title,
                        link: wxData1.link,
                        imgUrl: wxData1.imgUrl,
                        success: function () { 
                            // 用户确认分享后执行的回调函数
                            console.log(2)
                        }
                    });
                    wx.onMenuShareAppMessage({ //分享到朋友
                        title: wxData2.title,
                        desc: wxData2.desc,
                        link: wxData2.link,
                        imgUrl: wxData2.imgUrl,
                        success: function () { 
                            // 用户确认分享后执行的回调函数
                            console.log(1)
                        }
                    });
                    wx.onMenuShareQQ({
                        title: wxData2.title,
                        desc: wxData2.desc,
                        link: wxData2.link,
                        imgUrl: wxData2.imgUrl,
                        success: function () { 
                            // 用户确认分享后执行的回调函数
                            
                        }
                    });
                    wx.onMenuShareWeibo({
                        title: wxData2.title,
                        desc: wxData2.desc,
                        link: wxData2.link,
                        imgUrl: wxData2.imgUrl,
                        success: function () { 
                            // 用户确认分享后执行的回调函数
                            $.getJSON(dxlHttp.www + "GongJu/statistic/wxSharingNum?type=201710zhengshi2&callback=?" , function (){
                            })
                        }
                    });
                    wx.onMenuShareQZone({
                        title: wxData2.title, // 分享标题
                        desc: wxData2.desc, // 分享描述
                        link: wxData2.link, // 分享链接
                        imgUrl: wxData2.imgUrl, // 分享图标
                        success: function () { 
                            // 用户确认分享后执行的回调函数
                            
                        }
                    });
                };
                weixin();
            });
        });
    }
    
    $.touchSlider({
        slideCell: "#slideshow1_2",
        titCell: "#slideshow1_2 .hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
        mainCell: "#slideshow1_2 .bd ul",
        effect: "left",
        autoPlay: true, //自动播放
        autoPage: true //自动分页
    });

    $.touchSlider({
        slideCell: "#slideshow1",
        titCell: "#slideshow1 .hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
        mainCell: "#slideshow1 .bd ul",
        effect: "left",
        autoPlay: true, //自动播放
        autoPage: true //自动分页
    });

    $.get("/api/subscribe/count?callback=?" ,function (data){
        if(data.code == 1) {
            $(".ad1YuyueNumColor2").text(data.data.count)
        }
    })

    $(".ad3Yaoqing ,.ad1Yaqing").touchClick(function (){
        $.backgroundShow();
        setTimeout(function (){
            $(".sharePengyou").show();
        },200)
        
    })

    $(".yuyue").touchClick(function (){
        $.backgroundShow();
        setTimeout(function (){
            $(".moduleTan").addClass("active").show();
        },200)
    })

    $("body").touchClick("#backgroundDiv" ,function (){
        setTimeout(function (){
            $.backgroundHide();
            $(".phone").val("");
            $(".code").val("");
            $(".verificationCode").text("获取验证码");
        } , 200)
        $(".moduleTan").hide();
        $(".moduleTanSecc").hide();

        $(".sharePengyou").hide();
    })

    // 手机ios 和安卓 选择
    $(".selePhone li").touchClick(function (){
        $(this).addClass("active").siblings().removeClass("active");
    })

    // 视频弹层 交互
    var html = '<div>' +
                    '<video controls="controls" src="https://crazynote.v.netease.com/2017/1218/e5634fa4ed5f4f396e0e151fba098c55qt.mp4"autoplay="autoplay" style="background-color: black;">' +
                        '<source src="https://crazynote.v.netease.com/2017/1218/e5634fa4ed5f4f396e0e151fba098c55qt.mp4" type="video/mp4">'
                        '</video>'+
                '</div>';

    $(".ad1Video").touchClick(function() {
        $.mAlert("视频制作中，敬请期待");
        // $.backgroundShow();
        // $("#videoBox").html(html);
        // $("#videoContainer").show();
    });
     $("#videoCloseBtn").touchClick(function() {
        $("#videoBox").html("");
        $("#videoContainer").hide();
        $.backgroundHide();
    })

    $.dingshiqi({
        target : ".verificationCode",
        clickFun: function (timerTask){
            var _phone = $(".phone").val();
            if (!_phone || !$(".phone").val().isPhone()){
                timerTask.init();
                return $.alert("请输入正确的手机号");
            }

            $.get("/api/sendSms?mobile=" + _phone + "&callback=?", function (data){
                console.log(data);
                //倒计时开始
                if( data.code != 1){
                    timerTask.init();
                    $.alert(data.msg);
                }	
                if( data.code == 1){
                    $('.verificationCode').addClass("prohibited");
                    timerTask.timerStart();
                }
            })
        },
        afterFun: function (){
            $('.verificationCode').removeClass("prohibited");
        }
    });

    var falg = false; 
    $(".sumbitBtn").on("click" , function (){
        if (falg){
            return;
        }

        var _phone = $(".phone").val();
        var _code = $(".code").val();
        var _type = $(".selePhone").find(".active").data("phonetype");
        if (!_phone || !$(".phone").val().isPhone()){
            return $.alert("请输入正确的手机号");
        }
        falg = true;
        $(this).addClass("active");

        $.get("/api/subscribe?mobile="+ _phone + "&code=" + _code + "&type="+ _type, function (data){
            if(data.code == 1){
                $('.moduleTan').hide();
                
                $(".phone").val("");
                $(".code").val("");
                $(".verificationCode").text("获取验证码");


                $(".jihuomaInfo").text(data.data.num);
                $(".moduleTanSecc").show();
                // $.backgroundHide();
            }else {
                $.alert(data.msg);
            }
            $(".sumbitBtn").removeClass("active");
            falg = false;
        })
    })


    var _ulList = $(".add_ad1_2 .list");
	var _html = "";
	var _type = ['【新闻】','【公告】','【活动】']
	$.getJSON("/api/news", function(d) {
		var _rows = d.data.news.rows
		for(var i = 0 ; i < _rows.length; i++) {
			_html += '<li><a href= "/news/'+ _rows[i]["id"] + '"><span class="fl itemTitle">'+ _type[_rows[i]["type"]] + _rows[i]["title"]+'</span><span class="fr riqi">'+ timestampToTime(_rows[i]["createTime"]) +'</span></a></li>'
		}
		
		_ulList.append(_html);
	});


	function timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        // Y = date.getFullYear() + '/';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
        D = date.getDate() + ' ';
        return M+D;
    }


})