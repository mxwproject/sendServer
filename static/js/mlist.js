$(function() {
  $(window)
    .on("resize", function() {
      $("html").css("fontSize", $(window).width() / 6.4);
    })
    .resize();
    var nowNum =1;
	var _ulList = $(".listBox .ulList");
	var _type = ['【新闻】','【公告】','【活动】']
	$.getJSON("/api/news?pageSize=10", function(d) {
    var _html = "";
		var _rows = d.data.news.rows
		for(var i = 0 ; i < _rows.length; i++) {
			_html += '<li><a href= "/news/'+ _rows[i]["id"] + '"><span class="fl itemTitle">'+ _type[_rows[i]["type"] - 1 ] + _rows[i]["title"]+'</span><span class="fr riqi">'+ timestampToTime(_rows[i]["createTime"]) +'</span></a></li>'
		}
		
    _ulList.html(_html);
    templatePage(d)
	});

  //分页 
  // page 分页点击
	$("#pages").on("click","a",function(event){
		event.preventDefault();
		
        var _thatHref = $(this).attr("href");
        getListAjax( _thatHref);
        //交互填充 拼接参数 请求数据 
        console.log(_thatHref);
	});

  function getListAjax(num){
    num = num -1 || 0;
    nowNum = num + 1;
    if(!num) {
        $.getJSON("/api/news?pageSize=10", function(d) {
            ajaxFun(d);
        });
    }else{
        $.getJSON("/api/news?pageSize=10&pageNo="+ num, function(d) {
            ajaxFun(d);
        });
    }
    
  }
  function ajaxFun(d){
      var _html = "";
      var _rows = d.data.news.rows
      for(var i = 0 ; i < _rows.length; i++) {
        _html += '<li><a href= "/news/'+ _rows[i]["id"] + '"><span class="fl itemTitle">'+ _type[_rows[i]["type"]-1] + _rows[i]["title"]+'</span><span class="fr riqi">'+ timestampToTime(_rows[i]["createTime"]) +'</span></a></li>'
      }
      
      _ulList.html(_html);
      templatePage(d)
  }

	function timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        Y = date.getFullYear() + '/';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
        D = date.getDate() + ' ';
        return Y+M+D;
  }
  function templatePage(data) {
      $("#pages").html("");		
    //   var page_raw = '';  // 分页按钮  属性前缀
      var page = nowNum;   // 当前页

      var pageSum = Math.ceil(data.data.news.count /10) ;   // 总页码
      var html = "";

      $("#PagesBar").show();
      // previous
      if(page==1){
          html+= '<span id="pagePrev" class="des">上一页</span>';
      } else {
          html += '<span id="pagePrev" ><a target="_self" href="' +(page-1) +'">上一页</a></span>';
      }

      // <!-- 下一页 -->
      if( page == pageSum){
          html += '<span id="pageNext" class="des">下一页</span>';
      }else{
          html += '<span id="pageNext"><a target="_self" href="' + (page+1)+'">下一页</a></span>';
      }

      
      $("#pages").html(html);
  }
});
