var LX = new Vue({
	el: '#main',
	data: {
		reqData: {
			retrievalcode: "",//检索码
			itemname: "",//药品名称
			startdate: StartDate(new Date(),1),//开始日期
			enddate: StartDate(new Date())//结束日期
		},
		state: {
			ypbmDropDown: false,
			ypmcDropDown: false,
			dateDropDown:false,
		},
		cardList: [{
			invoiceno: 'xxxx', //发票号
			itemcd: 'xxxx',
			rkfs:'xxxx',
			itemname: 'xxxx', //药品名称
			itemspec: 'xxxx', //规格
			expiredate: 'xxxx', //效期
			operatetime: 'xxxx',//生产日期
			lot: 'xxxx', //批号
			pricebuy: 'xxxx', //进价
			gjje: 'xxxx', //购进金额
			lx: 'xxxx', //流向
			yksl: 'xxxx', //数量
			hw: 'xxxx', //货位码 
			unit: 'xxxx', //单位
			itemplace: 'xxxx', //产地
			checked: false
		}]
	},
	mounted: function() {

	},
	methods: {
		ypbmBtn: function() {
			var _this = this;
			_this.state.ypbmDropDown = !_this.state.ypbmDropDown;
			_this.state.ypmcDropDown = false;
			_this.state.dateDropDown = false;
		},
		ypmcBtn: function() {
			var _this = this;
			_this.state.ypmcDropDown = !_this.state.ypmcDropDown;
			_this.state.ypbmDropDown = false;
			_this.state.dateDropDown =false;
		},
		dateBtn:function(){
			var _this = this;
			_this.state.dateDropDown = !_this.state.dateDropDown;
			_this.state.ypbmDropDown = false;
			_this.state.ypmcDropDown = false;
		},
		select: function() {
			var _this = this;
			_this.state.ypmcDropDown = false;
			_this.state.ypbmDropDown = false;
			_this.state.dateDropDown = false;
			AjaxMui({
				toJson:serializeTran('Dynamic.Hos.Flow.Query',_this.reqData),
				type:"post",
				success:function(datastring){
					var jsonDate = datastring.recvdata;
					var mainData = jsonDate.recvmain;
					var detailData = jsonDate.recvdetails;
					console.log(datastring)
					if(mainData.totalhandlestate == "1"){
// 						for(var i = 0; i < detailData.detailline.length; i++) {
// 							_this.$set(detailData.detailline[i], 'checked', false);
// 						};
						_this.cardList = detailData.detailline;
					}else{
						mui.toast(mainData.totalhandlemessage, {
							duration: 'short'
						});
					}
				}
			});
		}
	}
});
document.getElementById("startTime").addEventListener('tap', function() {
	var dDate = new Date();
	dDate.setFullYear(dDate.getFullYear(), dDate.getMonth(), dDate.getDate());
	var minDate = new Date();
	minDate.setFullYear(2010, 0, 1);
	var maxDate = new Date();
	maxDate.setFullYear(2050, 11, 31);
	plus.nativeUI.pickDate(function(e) {
		var d = e.date;
		LX.reqData.startDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
		Hidekeyboard()
		// document.getElementById("pickDateBtn").value = +d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
	}, function(e) {
		// document.getElementById("pickDateBtn").value = "您没有选择日期";
		LX.reqData.startDate = "您没有选择日期";
	}, {
		title: "请选择日期",
		date: dDate,
		minDate: minDate,
		maxDate: maxDate
	});
});
document.getElementById("endTime").addEventListener('tap', function() {
	var dDate = new Date();
	dDate.setFullYear(dDate.getFullYear(), dDate.getMonth(), dDate.getDate());
	var minDate = new Date();
	minDate.setFullYear(2010, 0, 1);
	var maxDate = new Date();
	maxDate.setFullYear(2050, 11, 31);
	plus.nativeUI.pickDate(function(e) {
		var d = e.date;
		LX.reqData.endDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
		Hidekeyboard()
		// document.getElementById("pickDateBtn").value = +d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
	}, function(e) {
		// document.getElementById("pickDateBtn").value = "您没有选择日期";
		LX.reqData.endDate = "您没有选择日期";
	}, {
		title: "请选择日期",
		date: dDate,
		minDate: minDate,
		maxDate: maxDate
	});
})
