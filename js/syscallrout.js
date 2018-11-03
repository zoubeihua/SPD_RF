var IP = '127.0.0.1'
/**
 * 本地存储 
 */
LocalData = {
	isLocalStorage: window.localStorage ? true : false,
	set: function(key, val) {
		if (this.isLocalStorage) {
			window.localStorage.setItem(key, val);
		} else {
			alert('您的设备不支持本地存储')
		}
	},
	get: function(key) {
		if (this.isLocalStorage) {
			return window.localStorage.getItem(key);
		} else {
			alert('您的设备不支持本地存储')
		}
	},
	remove: function(key) {
		if (this.isLocalStorage) {
			localStorage.removeItem(key);
		}
	}
};
/*
 * 发送请求调用公共方法
 */
function AjaxMui(options) {
	try {
		plus.nativeUI.showWaiting( "等待中..." );
	} catch (e) {
		console.log("异常：" + e);
	}
	if(LocalData.get("ip")){
		IP = LocalData.get("ip");
	}
	var TP = "http://" + IP
	var defaults = {
		url: "/WxSoftBaseService.asmx/SendReceive",
		param: [],
		success: null,
		close: true,
		showPageLoading: true,
	};
	var options = mui.extend(defaults, options);
	// if (options.type == "post") {
// 		options.param = { "": options.toJson };
// 	} else {
		options.param = { data:JSON.stringify({data: options.toJson}) };
	// }
	window.setTimeout(function() {
		console.log("入参数：" + JSON.stringify(options.param))
		mui.ajax({
			url:TP + options.url,
			data: options.param,
			type: options.type || "get",
			dataType: "json",
			timeout: 60000, //超时时间设置为10秒
			success: function(data) {
				
				try {
					plus.nativeUI.closeWaiting();
				} catch (e) {
					console.log("异常：" + e);
				}
				options.success(data);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				//异常处理；
				
				try {
					plus.nativeUI.closeWaiting();
				} catch (e) {
					console.log("loding加载异常：" + e);
				}

				mui.toast('网络不好请重新试一次', {
					duration: 'short'
				})
				console.log("异常处理：" + textStatus);
			}
		});
	}, 500);
};
/**
 * 封装的数据DEC/DecData 表头赋值方法
 * @String {*类型} operCode  调用接口
 * @String {*类型} transType  调用接口类型 JSON/Xml
 * @param {*内容} content  发送后台参数
 * @String {*内容} sign  使用md5对pArgs加密过后的信息
 */
function serializeTran(docType, transdata) {
    var tojson = { appId:'1001',operCode:docType,transType:'JSON',content:{senddata:{senddetails:{detailline:[]}}},sign:''};
    var Headerdata = {}; //返回结果的json数组   
    var Transdata = transdata;
    if (Transdata.constructor === Array) {
		tojson.content.senddata.senddetails.detailline = Transdata;
    } else {
		tojson.content.senddata.senddetails.detailline.push(Transdata);
    }
    return tojson;
}
