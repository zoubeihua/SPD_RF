var sj = new Vue({
	el: '#main',
	data: {
		showRightMenu:false,//右边菜单显示/隐藏
		allCheck:false,//全选状态
		sjztChecked: false,
		sjztShow: false,
		ysztShow: false,
		ysztChecked: false,
		reqData: {
			sjflag: "0",//上架标志
			syflag: "0",//验收标志
			startdate: StartDate(new Date(),1),//开始日期
			enddate: StartDate(new Date()),//结束日期
			invoiceno: "",//发票号
			supplyname: "",//供应商名称
			retrievalcode: ""//药品检索
		},
		sjztText: '上架状态',
		ysztText: '验收状态',
		sjList: [{
				text: '未上架',
				val: '0',
				checked: false
			},
			{
				text: '已上架',
				val: '1',
				checked: false
			},
			{
				text: '上架未通过',
				val: '2',
				checked: false
			}
		],
		ysList: [{
				text: '未验收',
				val: '0',
				checked: false
			},
			{
				text: '已验收',
				val: '1',
				checked: false
			},
			{
				text: '验收未通过',
				val: '2',
				checked: false
			}
		],
		cardList:[{
			invoiceno:'xxxx',//发票号
			itemname:'xxxx',//药品名称
			itemspec:'xxxx',//规格
			expiredate:'xxxx',//效期
			lot:'xxxx',//批号
			pricebuy:'xxxx',//进价
			jjje:'xxxx',//进价金额
			supplyname:'xxxx',//供应商
			sjflag:0,//
			rcvkey:384461,
			loccode:'xxxx',//货位码
			sjr:'xxxx',
			checked:false
		},
		{
			invoiceno:'xxxx',//发票号
			itemname:'xxxx',//药品名称
			itemspec:'xxxx',//规格
			expiredate:'xxxx',//效期
			lot:'xxxx',//批号
			pricebuy:'xxxx',//进价
			jjje:'xxxx',//进价金额
			supplyname:'xxxx',//供应商
			sjflag:1,//
			rcvkey:961233,
			loccode:'xxxx',//货位码
			sjr:'xxxx',
			checked:false
		},
		{
			invoiceno:'xxxx',//发票号
			itemname:'xxxx',//药品名称
			itemspec:'xxxx',//规格
			expiredate:'xxxx',//效期
			lot:'xxxx',//批号
			pricebuy:'xxxx',//进价
			jjje:'xxxx',//进价金额
			supplyname:'xxxx',//供应商
			sjflag:0,//
			rcvkey:52214,
			loccode:'xxxx',//货位码
			sjr:'xxxx',
			checked:false
		}],
		checkedList:[]//储存勾选数据
	},
	mounted: function() {
		mui.init()
	},
	methods: {
		//查询
		select:function(){
			var _this = this;
			_this.showRightMenu = false;
			var requestData = _this.reqData;
			AjaxMui({
				toJson:serializeTran('Dynamic.Hos.Putaway.Query',requestData),
				type:"post",
				success:function(datastring){
					var jsonDate = datastring.recvdata;
					var mainData = jsonDate.recvmain;
					var detailData = jsonDate.recvdetails;
					console.log(datastring)
					if(mainData.totalhandlestate == "1"){
						for(var i = 0; i < detailData.detailline.length; i++) {
							_this.$set(detailData.detailline[i], 'checked', false);
						};
						_this.cardList = detailData.detailline;
					}else{
						mui.toast(mainData.totalhandlemessage, {
							duration: 'short'
						});
					}
				}
			});
		},
		sjBtn: function() {
			this.sjztShow = !this.sjztShow;
			this.ysztShow = false;
		},
		ysBtn: function() {

			this.ysztShow = !this.ysztShow;
			this.sjztShow = false;
		},
		selectedSj: function(item) {
			this.sjList.forEach(function(key, index, arr) {
				key.checked = false;
			});
			item.checked = true;
			this.sjztText = item.text;
			this.reqData.sjflag = item.val;
			this.sjztChecked = true;
			this.show = false;
			this.sjztShow = false;
			this.select();
		},
		selectedYs: function(item) {
			this.ysList.forEach(function(key, index, arr) {
				key.checked = false;
			});
			item.checked = true;
			this.ysztText = item.text;
			this.reqData.syflag = item.val;
			this.ysztChecked = true;
			this.show = false;
			this.ysztShow = false;
			this.select();
		},
		sxBtn: function() {
			this.showRightMenu = true;
			console.log(this.showRightMenu)
		},
		radioClick:function(item,index){
			if(item.sjflag == 0){}
			item.checked = !item.checked;
			if(this.cardList.length == 1){
				if(item.checked){
					this.allCheck = true;
				}else{
					this.allCheck = false;
				}
				
			}
		},
		allBox:function(){
			this.allCheck = !this.allCheck;
			if(this.allCheck){
				this.cardList.forEach(function(key,index,arr){
					key.checked = true;
				});
			}else{
				this.cardList.forEach(function(key,index,arr){
					key.checked = false;
				});
			}
		},
		ok:function(){
			var _this = this;
			var requestData = [];
			for(var i = 0; i < _this.cardList.length; i++){
				if(_this.cardList[i].checked){
					if(_this.cardList[i].sjflag == 0){
						requestData.push({
							rcvkey:this.cardList[i].rcvkey
						});
					};
				};
			};
			if(requestData.length == 0){
				mui.toast("请选择上架的药品", {
					duration: 'short'
				});
				return;
			};
			console.log(requestData);
			return;
			AjaxMui({
				toJson:serializeTran('Dynamic.Hos.Putaway.Pass',requestData),
				type:"post",
				success:function(datastring){
					var jsonDate = datastring.recvdata;
					var mainData = jsonDate.recvmain;
					var detailData = jsonDate.recvdetails;
					console.log(datastring)
					if(mainData.totalhandlestate == "1"){
						_this.select();
						mui.toast("执行成功", {
							duration: 'short'
						});
					}else{
						mui.toast(mainData.totalhandlemessage, {
							duration: 'short'
						});
					}
				}
			});
		},
		no:function(){
			var _this = this;
			var requestData = [];
			for(var i = 0; i < this.cardList.length; i++){
				if(this.cardList[i].checked){
					requestData.push({
						rcvkey:this.cardList[i].rcvkey
					});
				};
			};
			if(requestData.length == 0){
				mui.toast("请选择不通过的药品", {
					duration: 'short'
				});
				return;
			};
			console.log(requestData);
			AjaxMui({
				toJson:serializeTran('Dynamic.Hos.Putaway.NoPass',requestData),
				type:"post",
				success:function(datastring){
					var jsonDate = datastring.recvdata;
					var mainData = jsonDate.recvmain;
					var detailData = jsonDate.recvdetails;
					console.log(datastring)
					if(mainData.totalhandlestate == "1"){
						_this.select();
						mui.toast("执行成功", {
							duration: 'short'
						});
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
		sj.reqData.startdate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
		Hidekeyboard()
		// document.getElementById("pickDateBtn").value = +d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
	}, function(e) {
		// document.getElementById("pickDateBtn").value = "您没有选择日期";
		sj.reqData.startdate = "您没有选择日期";
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
		sj.reqData.enddate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
		Hidekeyboard()
		// document.getElementById("pickDateBtn").value = +d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
	}, function(e) {
		// document.getElementById("pickDateBtn").value = "您没有选择日期";
		sj.reqData.enddate = "您没有选择日期";
	}, {
		title: "请选择日期",
		date: dDate,
		minDate: minDate,
		maxDate: maxDate
	});
})