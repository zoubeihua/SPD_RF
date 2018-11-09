var Index = new Vue({
	el:"#main",
	data:{
		iconList:[
			{
				img:'img/ys.png',
				text:'入库验收',
				value:'ys',
				classt:'org',
				url:'page/ys.html'
			},
			{
				img:'img/sj.png',
				text:'入库上架',
				value:'sj',
				classt:'green',
				url:'page/sj.html'
			},
			{
				img:'img/cq.png',
				text:'库存查询',
				value:'kc',
				classt:'blue',
				url:'page/kc.html'
			},
			{
				img:'img/lx.png',
				text:'流向查询',
				value:'lx',
				classt:'pur',
				url:'page/lx.html'
			}
		],
		qxList:[],//权限列表
		elemList:[]//首页渲染功能菜单
	},
	mounted: function () {
		/* 
			YK--主任权限（管理员）
			YKGLCGY--直送，库存，流向查询
			YKKNAGLY--代表A区，上架，库存，流向查询，无验收
			YKKNAGLYS--代表B区，上架，库存，流向查询，无验收
			YKKNCGLY--代表C区，上架，库存，流向查询，无验收
			YKKNTSGLY--代表T区，上架，库存，流向查询，无验收
			YKYSY--代表ABCT区，只有验收权限 
			*/
		var _this = this;
		_this.qxList = JSON.parse(LocalData.get('qxList'));
		if(_this.qxList[0].value == 'YK'){
			_this.elemList = _this.iconList;
		}else{
			for(var i = 0; i < _this.iconList.length;i++){
				for(var j = 0; j < _this.qxList.length;j++){
					if(_this.qxList[j].value == _this.iconList[i].value){
						_this.elemList.push(_this.iconList[i])
					}
				}
			}
		}
	},
	methods:{
		jump:function(item){
			mui.openWindow({
			  url: item.url,
			  id: item.url,
			  styles: {                             // 窗口参数 参考5+规范中的WebviewStyle,也就是说WebviewStyle下的参数都可以在此设置
				titleNView: {                       // 窗口的标题栏控件
				  titleText:item.text,                // 标题栏文字,当不设置此属性时，默认加载当前页面的标题，并自动更新页面的标题
				  titleColor:"#666666",             // 字体颜色,颜色值格式为"#RRGGBB",默认值为"#666666"
				  titleSize:"17px",                 // 字体大小,默认17px
				  backgroundColor:"#F7F7F7",        // 控件背景颜色,颜色值格式为"#RRGGBB",默认值为"#F7F7F7"
				  progress:{                        // 标题栏控件的进度条样式
					color:"#007aff",                // 进度条颜色,默认值为"#007aff"  
					height:"2px"                    // 进度条高度,默认值为"2px"         
				  },
				  splitLine:{                       // 标题栏控件的底部分割线，类似borderBottom
					color:"#CCCCCC",                // 分割线颜色,默认值为"#CCCCCC"  
					height:"1px"                    // 分割线高度,默认值为"2px"
				  }
				}
			  }
			});
		}
	}
})