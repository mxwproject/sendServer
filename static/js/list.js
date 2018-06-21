$(function (){
    var nowNum = 1 ;
    // QQ微博 小图标切换
    var _qq =  $(".attention2 .QQ");
    var _weibo =  $(".attention2 .weibo");
    var _ErweimaQQ =  $(".attention2 .attention2ErweimaQQ");
    var _ErweimaWeibo =  $(".attention2 .attention2ErweimaWeibo");
    _qq.on("click" ,function (){
        $(this).addClass("on")
        _weibo.removeClass("on");
        _ErweimaQQ.addClass("on");
        _ErweimaWeibo.removeClass("on");
    })
    _weibo.on("click" ,function (){
        $(this).addClass("on")
        _qq.removeClass("on");
        _ErweimaWeibo.addClass("on");
        _ErweimaQQ.removeClass("on");
    })

    // 立即预约弹层 交互
    $(".ad1YuyueBtn").on("click" ,function (){
        $.backgroundShow();
        setTimeout(function (){
            $(".moduleTan").addClass("active").show();
        },200)
    });

    $(".ad1YaoqingBtn").on("click" ,function (){
        $.backgroundShow();
        $(".yanqingTan").show();
    });

    $(".yanqingTanClose").on("click",function (){
        $(this).parent().hide();
        setTimeout(function (){
            $.backgroundHide();
        },200);
    })
    

    // 立即预约弹层 交互
    $(".moduleTan  .closeBtn").on("click" ,function (){
        $(".moduleTan").hide();
        setTimeout(function (){
            $.backgroundHide();
            $(".phone").val("");
            $(".code").val("");
            $(".verificationCode").text("获取验证码");
        } , 200)
    })

    $(".closeBtn2").on("click" ,function (){
        $(".moduleTanSecc").hide();
        setTimeout(function (){
            $.backgroundHide();
        } , 200)
    })

    // 手机ios 和安卓 选择
    $(".selePhone li").on("click" ,function (){
        $(this).addClass("active").siblings().removeClass("active");
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
    // 预约 提交
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

                

                $(".jihuoma").text(data.data.num);
                $(".moduleTanSecc").show();
                // $.backgroundHide();
            }else {
                $.alert(data.msg);
            }
            
            $(".sumbitBtn").removeClass("active");
            falg = false;
        })
    });
    
    var _ulList = $(".rightBox .itemList");
	var _type = ['【新闻】','【公告】','【活动】']
	$.getJSON("/api/news", function(d) {
        var _html = "";
		var _rows = d.data.news.rows
		for(var i = 0 ; i < _rows.length; i++) {
			_html += '<li><a href= "/news/'+ _rows[i]["id"] + '"><span class="fl leftTip">'+ _type[_rows[i]["type"] -1 ] + _rows[i]["title"]+'</span><span class="fr dataTime">'+ timestampToTime(_rows[i]["createTime"]) +'</span></a></li>'
		}
        _ulList.append(_html);
        templatePage(d);
    });
    

    function timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        Y = date.getFullYear() + '/';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
        D = date.getDate() + ' ';
        return Y+M+D;
    }

    var _typeAttr  = "all"; 
    $(".titleList li").on("click" ,function (){
        $(this).addClass('on').siblings().removeClass("on");
        _typeAttr =  $(this).attr("typeAttr");
        console.log(_typeAttr);
        if(_typeAttr == "all") {
            getListAjax(0);
        }else if (_typeAttr == "1"){
            getListAjax(1);
        }else if (_typeAttr == "2"){
            getListAjax(2);
        }else if (_typeAttr == "3"){
            getListAjax(3);
        }
    });

    //分页 
    // page 分页点击
	$("#pages").on("click","a",function(event){
		event.preventDefault();
		
        var _thatHref = $(this).attr("href");

        if(_typeAttr == "all") {
            getListAjax(0 , _thatHref);
        }else if (_typeAttr == "1"){
            getListAjax(1 , _thatHref);
        }else if (_typeAttr == "2"){
            getListAjax(2 , _thatHref);
        }else if (_typeAttr == "3"){
            getListAjax(3 , _thatHref);
        }
        //交互填充 拼接参数 请求数据 
        console.log(_thatHref);
	});


    function getListAjax(type , num){
        num = num - 1 || 0;
        nowNum = num + 1 ;
        if(type && !num) {
            $.getJSON("/api/news?pageSize=10&type=" + type, function(d) {
                ajaxFun(d);
            });
        }else if (!type && !num) {
            $.getJSON("/api/news?pageSize=10", function(d) {
                ajaxFun(d);
            });
        }else if (type && num){
            $.getJSON("/api/news?pageSize=10&type=" + type  +"&pageNo="+ num, function(d) {
                ajaxFun(d);
            });
        }else if (!type && num){
            $.getJSON("/api/news?pageSize=10&pageNo="+ num, function(d) {
                ajaxFun(d);
            });
        }
        
    }
    function ajaxFun(data){
        var _html = "";
        var _rows = data.data.news.rows
        for(var i = 0 ; i < _rows.length; i++) {
            _html += '<li><a href= "/news/'+ _rows[i]["id"] + '"><span class="fl leftTip">'+ _type[_rows[i]["type"] -1 ] + _rows[i]["title"]+'</span><span class="fr dataTime">'+ timestampToTime(_rows[i]["createTime"]) +'</span></a></li>'
        }
        _ulList.html(_html);
        templatePage(data);
    }

    function templatePage(data) {
        $("#pages").html("");		
        var page = nowNum;   // 当前页
    
        var pageSum = Math.ceil(data.data.news.count /10) ;   // 总页码
        var html = "";
    
        if(pageSum >= 0){
            $("#PagesBar").show();
            // previous
            if(page == 1){
                html+= '<span id="pagePrev" class="des">上一页</span>';
            } else {
                html += '<span id="pagePrev" ><a target="_self" href="'+(page-1) +'">上一页</a></span>';
            }
    
    
            //中间页
            html += '<span id="pageNum" >';
            if(pageSum <= 7){
                for(var i=1;i <= pageSum ;i++){
                    if( i== page){
                        html += '<a class="cur" href="' + page + '" target="_self"> '+ i +'</a>';
                    }else{
                        html +='<a href="'+ i + '" target="_self">'+ i +'</a>';
                    }
                }
            }else if(pageSum > 7){
                if(page <=5){
                    for(var i=1;i <= 5;i++){
                        if( i== page){
                            html += '<a class="cur" href="' + i + '" target="_self">'+ i +'</a>';
                        }else{                      
                            if( i == 1){ 
                                html += '<a href="' + i + '" target="_self">'+ i +'</a>';
                            }else{
                                html += '<a href="' + i + '" target="_self">'+ i +'</a>';
                            }
                        }
                    }
                    html += "...";
                    html += '<a href="' + pageSum +'" target="_self"> '+ pageSum +' </a>';
                }else{
                    html += '<a href="' + 1 +'" target="_self">1</a>';
                    html += "...";
                    for(var i=(page-2);i < page;i++){
                        html += '<a href="' + i + '" target="_self">'+ i +'</a>' 
                    }
                    html += '<a  class="cur" href="' +page + '" target="_self">'+ page +'</a>'
    
                    if(pageSum - page >1){
                        html += "...";
                        html += '<a href="' + pageSum + '" target="_self">'+ pageSum +'</a>'
                    }else if(pageSum - page ==1){
                        html += '<a href="' + pageSum + '" target="_self">'+ pageSum +'</a>'
                    }
                }
            }
    
            html += '</span>';
            // <!-- 下一页 -->
            if( page == pageSum){
                html += '<span id="pageNext" class="des">下一页</span>';
            }else{
                html += '<span id="pageNext"><a target="_self" href="' + (page+1)+'">下一页</a></span>';
            }
            html += '<span class="totalPage ">共找到'+ data.data.news.count +'条</span>';
        }else{
            $("#PagesBar").hide();
        }
    
        
        $("#pages").html(html);
    }
})