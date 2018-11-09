var ys = new Vue({
	el:"#main",
	data:{
		state:true,// true默认扫箱码，false发票查询
		reqData:{
			purchno: "",//采购单号
			invoiceno: ""//发票号
		},
		Tips:'扫描箱码',
		barcode:null,
		barCodeVal:null,
		storageData:[],//储存请求返回的数据
		ElmData:[
			{
				delday: 365,//近期有效天数
				delprice: 7.38,//进价差
				expiredate: "2019-10-31",//有效期
				invoiceno: "00793484",//发票号
				invoiceprice: 52.78,//发票价
				itemadmin: "ITEMADMIN",//商品代理站
				itemcd: "Y00000000642",//药品编码
				itemname: "伏格列波糖片(倍欣)",//药品名称
				itemplace: "天津武田药品有限公司",//产地
				itemspec: "0.2mg*30片",//规格
				jjje: 2111.2,//进价金额
				lot: "401A",//批号
				packqty: 30,//包装数量
				placename: null,//草药库产地
				preqty: 40,//预定数量
				pricebuy: 45.4,//进价
				pricewholesale: 52.78,//批发价
				productdate: "2014-11-21",//生产日期
				rcvkey: 8005,//主键值
				supplyname: null,//供应商名称
				unit: "盒",//单位
				zxs: 0.2//总箱数
			}
		],
		reasonList:[
			{
				reason:'无采购计划'
			},
			{
				reason:'没盖章'
			},
			{
				reason:'不符合采购'
			},
			{
				reason:'货票不符'
			},
			{
				reason:'近效期半年内'
			},
			{
				reason:'其他'
			}
		],
		reason:'验收合格'
	},
	mounted: function () {
		var _this = this;
		mui(".mui-input-clear")[0].addEventListener('focus', function(e){
			mui(".mui-icon-clear")[0].addEventListener('tap',function(e){
				_this.barCodeVal = "";
			});
		})
	},
	methods:{
		swich:function(){
			this.state = !this.state;
		},
		startSeach:function(){
			var _this = this;
			if(_this.state){
				// 创建Barcode扫码控件
					if(!_this.barcode){
						var filters = [plus.barcode.QR, plus.barcode.CODE128, plus.barcode.EAN13, plus.barcode.EAN8];
						_this.barcode = plus.barcode.create('barcode', filters, {
							top:'0',
							left:'1px',
							background:'#000000',
							width: '100%',
							height: '100%',
							position: 'static'
						});
						_this.barcode.onmarked = function(type, result){
// 							var text = '未知: ';
// 							switch(type){
// 								case plus.barcode.QR:
// 								text = 'QR: ';
// 								break;
// 								case plus.barcode.EAN13:
// 								text = 'EAN13: ';
// 								break;
// 								case plus.barcode.EAN8:
// 								text = 'EAN8: ';
// 								break;
// 							};
							_this.barcode.close()
							_this.barCodeVal = result;
							_this.select();
							_this.barcode = null;
						};
						plus.webview.currentWebview().append(_this.barcode);
					}
					_this.barcode.start();
			}else{
				
			}
		},
		//查询数据
		select:function(){
			var _this = this;
			var requestData = {};
			if(_this.state){
				requestData = {
					purchno:_this.barCodeVal
				};
			}else{
				requestData = {
					invoiceno:_this.barCodeVal
				};
			};
			AjaxMui({
				toJson:serializeTran('Dynamic.Hos.Receive.Query',requestData),
				type:"post",
				success:function(datastring){
					var jsonDate = datastring.recvdata;
					var mainData = jsonDate.recvmain;
					var detailData = jsonDate.recvdetails;
					console.log(datastring)
					if(mainData.totalhandlestate == "1"){
						if(mainData.recordcount > 0){
							_this.storageData = detailData.detailline;
							_this.ElmData = _this.storageData[0];
						}else{
							mui.toast("暂无数据", {
								duration: 'short'
							});
							_this.storageData = [];
							_this.ElmData = [];
						}
						
					}else{
						mui.toast(mainData.totalhandlemessage, {
							duration: 'short'
						});
					}
				}
			});
		},
		Receive:function(reason){
			var _this = this;
			var requestData = {
				usercd: LocalData.get("UserName"),
				invoiceno: _this.ElmData.invoiceno,
				reason: reason,
				rcvkey: _this.ElmData.rcvkey
			};
			AjaxMui({
				toJson:serializeTran('Dynamic.Hos.Receive',requestData),
				type:"post",
				success:function(datastring){
					var jsonDate = datastring.recvdata;
					var mainData = jsonDate.recvmain;
					var detailData = jsonDate.recvdetails;
					console.log(datastring)
					if(mainData.totalhandlestate == "1"){
						_this.storageData.splice(0,1);
						if(_this.storageData.length != 0){
							_this.ElmData = _this.storageData[0];
							
						}else{
							_this.ElmData = {};
						}
					}else{
						mui.toast(mainData.totalhandlemessage, {
							duration: 'short'
						});
					}
				}
			});
		},
		//通过
		ok:function(){
			var _this = this;
			if(_this.ElmData.delday <= 240){
				mui.alert("效期在240天以内");
			};
			if(_this.ElmData.pricebuy != _this.ElmData.invoiceprice){
				mui.alert("购入价与发票价不一致");
			};
			this.Receive('验收合格');
		},
		//不通过
		no:function(){
			// mui('.bottomPopover').popover('toggle');
		},
		choiceReason:function(item){
			var _this = this;
			_this.reason = item.reason;
			this.Receive(_this.reason);
			mui('#popover').popover('hide');
		}
	}
})