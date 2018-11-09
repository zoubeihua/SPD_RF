var KC = new Vue({
	el: '#main',
	data: {
		reqData: {
			itemcd: '',
			itemname: ''
		},
		state: {
			ypbmDropDown: false,
			ypmcDropDown: false
		},
		countPricebuy:0,//汇总进价
		countPricesale:0,//汇总零售价
		cardList: [{
			invoiceno: 'xxxx', //发票号
			itemcd: 'xxxx',
			itemname: 'xxxx', //药品名称
			itemspec: 'xxxx', //规格
			expiredate: 'xxxx', //效期
			productdate: 'xxxx',//生产日期
			lot: 'xxxx', //批号
			itempricebuy: "xxxx", //进价
			itempricesale: "xxxx", //零售价
			supply: 'xxxx', //供应商
			yksl: 'xxxx', //数量
			hw: 'xxxx', //货位码
			unit: 'xxxx', //单位
			itemplace: 'xxxx', //产地
			checked: false
		}],
		recvdetails:[]//明细储存
	},
	mounted: function() {
		var _this = this;
		mui(".mui-input-clear").each(function(index,elm){
			elm.addEventListener('focus', function(e){
				var key = this.getAttribute("data-input-clear");
				mui(".mui-icon-clear")[index].addEventListener('tap',function(e){
					if(key == 1){
						_this.reqData.itemcd = "";
					}else if(key == 2){
						_this.reqData.itemname = "";
					}
				});
			})
		})
	},
	methods: {
		ypbmBtn: function() {
			var _this = this;
			_this.state.ypbmDropDown = !_this.state.ypbmDropDown;
			_this.state.ypmcDropDown = false;
		},
		ypmcBtn: function() {
			var _this = this;
			_this.state.ypmcDropDown = !_this.state.ypmcDropDown;
			_this.state.ypbmDropDown = false;
		},
		select: function() {
			var _this = this;
			var requestData = _this.reqData;
			_this.state.ypmcDropDown = false;
			_this.state.ypbmDropDown = false;
			AjaxMui({
				toJson:serializeTran('Dynamic.Hos.Stock.Query',requestData),
				type:"post",
				success:function(datastring){
					var countPricebuy = 0;
					var countPricesale = 0;
					var jsonDate = datastring.recvdata;
					var mainData = jsonDate.recvmain;
					var detailData = jsonDate.recvdetails;
					console.log(datastring)
					_this.cardList = mainData.mainlLine;
					_this.recvdetails = detailData.detailline;
					for(var i = 0; i < _this.cardList.length; i++){
						if(_this.cardList[i].itempircebuy == '' ){
							continue;
						}
// // 						if(_this.cardList[i].itempricesale == '' ){
// // 							continue;
// // 						}
						countPricebuy += _this.cardList[i].itempricebuy * _this.cardList[i].yksl;
						countPricesale += _this.cardList[i].itempricesale * _this.cardList[i].yksl;
					}
				   _this.countPricebuy = countPricebuy;
				   _this.countPricesale = countPricesale;
				}
			});
		},
		jump: function(item) {
			var _this = this;
			var recvdetails = [];
			for(var i = 0; i < _this.recvdetails.length; i++){
				if(item.itemcd == _this.recvdetails[i].itemcd){
					recvdetails.push(_this.recvdetails[i]);
				}
			};
			mui.openWindow({
				url: "details.html",
				id: "details.html",
				styles: { // 窗口参数 参考5+规范中的WebviewStyle,也就是说WebviewStyle下的参数都可以在此设置
					titleNView: { // 窗口的标题栏控件
						titleText: "库存查询明细", // 标题栏文字,当不设置此属性时，默认加载当前页面的标题，并自动更新页面的标题
						titleColor: "#666666", // 字体颜色,颜色值格式为"#RRGGBB",默认值为"#666666"
						titleSize: "17px", // 字体大小,默认17px
						backgroundColor: "#F7F7F7", // 控件背景颜色,颜色值格式为"#RRGGBB",默认值为"#F7F7F7"
						progress: { // 标题栏控件的进度条样式
							color: "#007aff", // 进度条颜色,默认值为"#007aff"  
							height: "2px" // 进度条高度,默认值为"2px"         
						},
						splitLine: { // 标题栏控件的底部分割线，类似borderBottom
							color: "#CCCCCC", // 分割线颜色,默认值为"#CCCCCC"  
							height: "1px" // 分割线高度,默认值为"2px"
						}
					}
				},
				extras:{
					cardList:recvdetails
				}
			});
		}
	}
})
