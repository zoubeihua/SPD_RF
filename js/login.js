var Login = new Vue({
	el:'#login',
	data:{
		UserName:'',
		PassWord:'',
		authcdName:'',
		authcd:'',
		TP:'http://',
		ip:"",
		qxList:[{
			name:'管理员',
			value:'YK'
		},{
			name:'直送员',
			value:'YKGLCGY'
		},{
			name:'A区库管员',
			value:'YKKNAGLY'
		},{
			name:'B区库管员',
			value:'YKKNAGLYS'
		},{
			name:'C区库管员',
			value:'YKKNCGLY'
		},{
			name:'T区库管员',
			value:'YKKNTSGLY'
		},{
			name:'验收员',
			value:'YKYSY'
		}],
		pswflag:false,//记住密码标识符
	},
	mounted: function () {
		var pswflag = LocalData.get("pswflag") || false;
		var ip =  LocalData.get("ip") || false;
		var authcd = LocalData.get("authcd") || false;
// 		var authcd = authcd === "false" ? false : true;
// 		var pswflag = pswflag === "false" ? false : true;
// 		var ip = ip === "false" ? false : true;
		if(pswflag){
			this.UserName = LocalData.get("UserName");
			this.PassWord = LocalData.get("Password");
			this.pswflag = true;
		};
		if(ip){
			this.ip = LocalData.get("ip");
		};
		if(authcd){
			this.authcdName = LocalData.get("authcdName");
			this.authcd = LocalData.get("authcd");
		};
    },
	methods:{
		select:function(item){
			this.authcd = item.value;
			this.authcdName = item.name;
			mui('#popover').popover('hide');
		},
		longin:function(){
			var _this = this;
			if(_this.UserName == ""){
				mui.toast('请输入用户名', {
					duration: 'short'
				});
				return;
			}else if(_this.PassWord == ""){
				mui.toast('请输入密码', {
					duration: 'short'
				});
				return;
			}else if(_this.authcdName == ""){
				mui.toast('请选择库区', {
					duration: 'short'
				});
				return;
			}else if(_this.ip == ""){
				mui.toast('配置服务器地址', {
					duration: 'short'
				});
				return;
			};
			
			var requestData = {
				usercd: _this.UserName,
				pass:_this.PassWord
			}
			AjaxMui({
				toJson:serializeTran('Dynamic.Hos.Login',requestData),
				type:"post",
				success:function(datastring){
					var jsonDate = datastring.recvdata;
					var mainData = jsonDate.recvmain;
					var detailData = jsonDate.recvdetails.detailline[0];
					console.log(datastring)
					if(mainData.totalhandlestate == "1"){
						var qxList = [];

						/* 
							YK--主任权限（管理员）
							YKGLCGY--直送，库存，流向查询
							YKKNAGLY--代表A区，上架，库存，流向查询，无验收
							YKKNAGLYS--代表B区，上架，库存，流向查询，无验收
							YKKNCGLY--代表C区，上架，库存，流向查询，无验收
							YKKNTSGLY--代表T区，上架，库存，流向查询，无验收
							YKYSY--代表ABCT区，只有验收权限 
						*/
						LocalData.set("UserName",_this.UserName);
						if(_this.pswflag){
							LocalData.set("Password",_this.PassWord);
						};
						if(detailData.authcd == _this.authcd){
							if(detailData.authcd == 'YK'){
								qxList = [{value:'YK'}]
							}else if(detailData.authcd == 'YKGLCGY'){
								qxList = [{value:'kc'},{value:'lx'}]
							}else if(detailData.authcd == 'YKKNAGLY'){
								qxList = [{value:'sj'},{value:'kc'},{value:'lx'}]
							}else if(detailData.authcd == 'YKKNAGLYS'){
								qxList = [{value:'sj'},{value:'kc'},{value:'lx'}]
							}else if(detailData.authcd == 'YKKNCGLY'){
								qxList = [{value:'sj'},{value:'kc'},{value:'lx'}]
							}else if(detailData.authcd == 'YKKNTSGLY'){
								qxList = [{value:'sj'},{value:'kc'},{value:'lx'}]
							}else if(detailData.authcd == 'YKYSY'){
								qxList = [{value:'ys'}]
							}
							LocalData.set("qxList",JSON.stringify(qxList));
							LocalData.set("authcd",_this.authcd);
							LocalData.set("authcdName",_this.authcdName);
							mui.openWindow({
								url: '../index.html',
								id: 'index.html',
								show: {  
									autoShow: true, //页面loaded事件发生后自动显示，默认为true  
									aniShow: "zoom-fade-out", //页面显示动画，默认为”slide-in-right“；  
									duration: "350" //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；  
								},  
								waiting: {  
									autoShow: true, //自动显示等待框，默认为true  
									title: '正在加载...'//等待对话框上显示的提示内容   
								}  
							});
						}else{
							mui.toast("您没有权限登录此库区", {
								duration: 'short'
							});
						};

					}else{
						mui.toast(mainData.totalhandlemessage, {
							duration: 'short'
						});
					}
				}
			});
		},
		rememberPsw:function(){
			var _this = this;
			_this.pswflag = !_this.pswflag;
			if(_this.pswflag){
				LocalData.set("pswflag",true);
			}else{
				LocalData.set("pswflag",false);
				LocalData.remove("UserName");
				LocalData.remove("Password");
			}
		},
		setting:function(){
			mui('#actionsheet').popover('toggle');
		},
		save:function(){
			var _this = this;
			if(_this.ip == ""){
				mui.toast('配置服务器地址', {
					duration: 'short'
				});
			}else{
				LocalData.set("ip",_this.ip);
				mui('#actionsheet').popover('hide');
				mui.toast('保存成功', {
					duration: 'short'
				});
			};
			
		}
	}
})