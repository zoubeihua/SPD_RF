var Login = new Vue({
	el:'#login',
	data:{
		UserName:'',
		PassWord:'',
		TP:'http://',
		ip:"",
		pswflag:false,//记住密码标识符
	},
	mounted: function () {
		var pswflag = LocalData.get("pswflag") || false;
		var ip =  LocalData.get("ip") || false;
		var pswflag = pswflag === "false" ? false : true;
		var ip = ip === "false" ? false : true;
		if(pswflag){
			this.UserName = LocalData.get("UserName");
			this.PassWord = LocalData.get("Password");
			this.pswflag = true;
		};
		if(ip){
			this.ip = LocalData.get("ip");
		}
    },
	methods:{
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
					var detailData = jsonDate.recvdetails;
					console.log(datastring)
					if(mainData.totalhandlestate == "1"){
						LocalData.set("UserName",_this.UserName);
						if(_this.pswflag){
							LocalData.set("Password",_this.PassWord);
						}
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