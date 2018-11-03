var Index = new Vue({
	el:"#main",
	data:{
		iconList:[
			{
				img:'img/ys.png',
				text:'入库验收',
				classt:'org',
				url:'page/ys.html'
			},
			{
				img:'img/sj.png',
				text:'入库上架',
				classt:'green',
				url:'page/sj.html'
			},
			{
				img:'img/cq.png',
				text:'库存查询',
				classt:'blue',
				url:'page/cq.html'
			},
			{
				img:'img/lx.png',
				text:'流向查询',
				classt:'pur',
				url:'page/lx.html'
			}
		]
	},
	mounted: function () {
		
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