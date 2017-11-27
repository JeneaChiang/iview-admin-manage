$(function(){
    courseInit();
});
function courseInit(){
    var swiper = new Swiper('.swiper-container', {
        autoplay : 3000,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        loop : true
    });
    var _tabHtml="";
    for(var i=0;i<6;i++){
        var newDate,month,day,circleWeek;
        var week = ['日','一','二','三','四','五','六'];
        newDate= new Date(new Date().getTime() + i*24*60*60*1000);
        month<10?month='0'+(newDate.getMonth()+1):month=(newDate.getMonth()+1);
        day<10?day='0'+newDate.getDate():day=newDate.getDate();
        week=week[newDate.getDay()];
        switch (i){
            case 0: 
                circleWeek="今天"; 
                break;
            case 1: 
                circleWeek="明天"; 
                break;
            case 2: 
                circleWeek="后天"; 
                break;
            default: circleWeek='周'+week;
        }
        _tabHtml+='<li class="">'+week
                +'<p class="circle-p flex-box">'
                +'<span class="date">'+month+'.'+day+'</span>'
                +'<span class="week">'+circleWeek+'</span>'
                +'</p>'
                +'</li>';
    }
    _tabHtml+='<li class="">私教'
            +'<p class="circle-p flex-box">'
            +'<span class="date"></span>'
            +'<span class="week">私教</span>'
            + '</p>'
            +'</li>';
    $('.week-tab-ul').append(_tabHtml);
    $('.week-tab-ul li').eq(0).addClass('active');
    $('.week-content').eq(0).addClass('active');
    getCourse(0);
}
function getCourse(index){
    $(".week-content ul").html('');
    var htmlList="", htmlTemp = document.getElementById('courseArea').value,data;
    $.ajax({
        url : SiteUrl + "/data/getCourseList",
        type : "get",
		dataType:'json',
        success : function(result) {   
            data=result.datas[index];
            if(data){
                for(var i=0;i<data.length;i++){
                    if(data[i].isPrivate){
                        data[i].courseTime=data[i].count+"课时";
                        data[i].coursePrice="￥"+data[i].price;
                        data[i].btnWord="详情";
                    }
                    else{
                        data[i].startTime=setTime(data[i].startTime);
                        data[i].endTime=setTime(data[i].endTime);
                        data[i].courseTime=data[i].startTime+"-"+data[i].endTime;
                        data[i].coursePrice="￥"+data[i].price+"（VIP￥"+data[i].vipPrice+"）";
                        data[i].btnWord="预约";
                    }
                    htmlList += htmlTemp.temp(data[i]);
                }
            }
            else{
                htmlList="<p class='align-center'>暂无数据</p>";
            }
            $(".week-content ul").append(htmlList);
        },
    })
}
$(window).scroll(function(){
    var scrollTop=$(window).scrollTop();
    var topHeight=$('.swiper-container').height();
    if (scrollTop>topHeight) {
        $(".week-tab").addClass('fixed');		
    }else{
        $(".week-tab").removeClass('fixed');
    }
});
$('.week-tab-ul').delegate('li','click',function(){
    $(this).addClass('active').siblings().removeClass('active');
    var index=$(this).index();
    getCourse(index);
})
