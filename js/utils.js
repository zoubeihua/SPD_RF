
//隐藏键盘
function Hidekeyboard(){
	try{
		var nativeWebview, imm, InputMethodManager;
		nativeWebview = plus.webview.currentWebview().nativeInstanceObject();
		var main = plus.android.runtimeMainActivity();
		var Context = plus.android.importClass("android.content.Context");
		InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
		imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
		plus.android.importClass(nativeWebview);
	 	imm.hideSoftInputFromWindow(nativeWebview.getWindowToken(), 0);
	}catch(e){
		console.log("erro:"+ e);
	}

};

//获取原始窗口的高度
// var originalHeight=document.documentElement.clientHeight || document.body.clientHeight;
// 
// window.onresize=function(){
// 
//     //软键盘弹起与隐藏  都会引起窗口的高度发生变化
//     var  resizeHeight=document.documentElement.clientHeight || document.body.clientHeight;
// 
//     if(resizeHeight*1<originalHeight*1){ //resizeHeight<originalHeight证明窗口被挤压了
// 
//             plus.webview.currentWebview().setStyle({
//                 height:originalHeight + 44
//             });
// 
//       }
// }
//保留两位小数
Vue.filter('formatMoney', function (value) {
	value=value==null?0:value;
	return Number(Math.abs(value)).toFixed(2);
})
/**
 * 格式化时间
 * @param {*时间} time 
 * @param {*格式化语句} format 
 */
var format = function (time, format) {
    var t = new Date(time);
    var tf = function (i) {
        return (i < 10 ? '0' : '') + i
    };
    return format.replace(/YYYY|MM|DD|hh|mm|ss/g, function (a) {
        switch (a) {
            case 'YYYY':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'DD':
                return tf(t.getDate());
                break;
            case 'hh':
                return tf(t.getHours());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    })
}
/**
 * 开始时间是当前时间的前一个天
 * @flag 1表示前一天
 */
function StartDate(date, flag) {
    var NewDate;
    if (flag == 1) {
		NewDate = new Date(date.getTime() - 24*60*60*1000);
        // NewDate = new Date(new Date().setMonth((date.getMonth() - 1)));
    } else {
        NewDate = date;
    }
    return format(NewDate, 'YYYY-MM-DD');
}