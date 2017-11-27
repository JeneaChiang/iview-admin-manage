var SiteUrl = "";
String.prototype.temp = function(obj) {
    return this.replace(/\$\w+\$/gi, function(matchs) {
        var returns = obj[matchs.replace(/\$/g, "")];		
        return (returns + "") == "undefined"? "": returns;
    });
};
function setTime(time){
    var time=new Date(time);
    var hour = time.getHours()<10?'0'+time.getHours():time.getHours();  
    var minute = time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes();
    return hour+':'+minute;
};
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
window.onload=function(){
    $('#loading').remove();
}