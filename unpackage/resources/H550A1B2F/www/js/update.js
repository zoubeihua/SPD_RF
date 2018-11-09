
var wgtVer=null;
function plusReady(){
    // ......
	var wgtWaiting = null; //存储提示框
    //获取当前应用的版本号
    plus.runtime.getProperty(plus.runtime.appid,function(inf){
        wgtVer=inf.version;
        console.log("当前应用版本："+wgtVer);
    });
	//IP配置好才可以执行检测更新
	if(IP != "127.0.0.1"){
		checkUpdate();
	};
}
if(window.plus){
    plusReady();
	
}else{
    document.addEventListener('plusready',plusReady,false);
}
/* 发起ajax请求检测是否有新版本
 * 检测更新 
*/
	
var checkUrl= "http://" + IP;
function checkUpdate(){
    wgtWaiting = plus.nativeUI.showWaiting("检测更新...");	
    var xhr= new plus.net.XMLHttpRequest();
    xhr.onreadystatechange=function(){
        switch(xhr.readyState){
            case 4:
            wgtWaiting.close();
            if(xhr.status==200){
				var data = JSON.parse(xhr.responseText)
                console.log("检测更新成功："+xhr.responseText);
                var newVer = data.version;
                if(wgtVer&&newVer&&(wgtVer!=newVer)){
					var upres;
					plus.nativeUI.confirm("有新版是否更新？", function(e) {
						upres = (e.index == 0) ? "Y" : "N";
						if(upres == "Y") {
							downWgt();  // 下载升级包
						}
					}, '提示', ["确认", "取消"])
                }else{
                    wgtWaiting.close();
					console.log("已经是最新版本不需要更新");
                }
            }else{
			  console.log("检测更新失败！");
              wgtWaiting.alert("检测更新失败！");
            }
            break;
            default:
            break;
        }
    }
    xhr.open('GET',checkUrl + "/update/update.json");
    xhr.send();
}
/* 更新应用资源
 * 从服务器下载应用资源包（apk文件） 
*/
// 下载apk文件
var apkUrl= checkUrl + "/update/SPD_RF.apk";
function downWgt(){
    wgtWaiting = plus.nativeUI.showWaiting("下载更新文件...");
    var creadownload = plus.downloader.createDownload( apkUrl, {filename:"_doc/update/"}, function(d,status){
        if ( status == 200 ) { 
            console.log("下载成功："+d.filename);
            installApk(d.filename); // 安装apk包
        } else {
            console.log("下载apk失败！");
            plus.nativeUI.alert("下载apk失败！");
        }
        wgtWaiting.closeWaiting();
    });
	creadownload.addEventListener("statechanged", function(download, status) {
		console.log(JSON.stringify(download))
		switch(download.state) {
			case 2:
				wgtWaiting.setTitle("已连接到服务器");
				break;
			case 3:
				var percent = download.downloadedSize / download.totalSize * 100;
				wgtWaiting.setTitle("已下载 " + parseInt(percent) + "%");
				break;
			case 4:
				wgtWaiting.setTitle("下载完成");
				break;
		}
	});
	creadownload.start();
};
// 更新应用资源
function installApk(path){
    wgtWaiting = plus.nativeUI.showWaiting("安装文件...");
    plus.runtime.install(path,{},function(){
       wgtWaiting.closeWaiting();
        console.log("安装apk文件成功！");
        plus.nativeUI.alert("应用资源更新完成！",function(){
            plus.runtime.restart();
        });
    },function(e){
       wgtWaiting.closeWaiting();
        console.log("安装apk文件失败["+e.code+"]："+e.message);
        plus.nativeUI.alert("安装apk文件失败["+e.code+"]："+e.message);
    });
}