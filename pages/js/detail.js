$(function(){
    var key=getUrlParam('id');
    getDetail(key);
});
function getDetail(id){
    var htmlList="", htmlTemp = document.getElementById('detailArea').value,data;;
    $.ajax({
        url : SiteUrl + "/data/getCourseDetail?id="+id,
        type : "get",
        dataType:'json',
        success : function(result) {   
            data=result.result;
            data.nowDate= new Date(data.startTime).getFullYear()+'.'+(new Date(data.startTime).getMonth()+1)+'.'+new Date(data.startTime).getDate();
            data.startTime=setTime(data.startTime);
            data.endTime=setTime(data.endTime);
            data.effShow="hidden";
            data.faqShow="hidden";
            if(data.imgs){
                var imgs = data.imgs.split(",");
                data.swiperImg="";
                for(var i=0;i<imgs.length;i++){
                    data.swiperImg+="<img src='http://www.5wwl.cn/"+imgs[i]+"'/>";
                }
            }
            else{
                data.imgShow="hidden";
            }
            if(data.isPrivate){
                data.detailPrice="￥"+data.price+"/"+data.count+"课时";
                data.detailTime="与教练预约授课时间";
            }
            else{
                data.detailPrice="￥"+data.price+"(开通VIP卡，享折扣优惠<a href='../vip/recharge.html' class='normal-color ml5 font14'>详情</a>)";
                data.detailTime=data.nowDate+' '+data.startTime+'-'+data.endTime;
            }
            if(data.tags){
                var tags = data.tags.split(",");
                data.tagList="";
                for(var m=0;m<tags.length;m++){
                    data.tagList+="<i class='flag'>"+tags[m]+"</i>";
                }
            }
            else{
                data.tagList="";
            }
            if(data.eff){
                data.effShow="";
            }
            if(data.faq){
                data.faqShow="";
            }
            htmlList = htmlTemp.temp(data);
            $(".detail-container").append(htmlList);
        },
    })
}
