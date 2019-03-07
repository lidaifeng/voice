
//音乐详情渲染
function timeauto(){
	var playerlist = $('.player');
	playerlist.each((index,item)=>{
		item.addEventListener("canplay", function(){
			let duration=Math.ceil(item.duration);
			document.getElementsByClassName('duration')[index].innerText = formatTime(duration);
		});
	})
};

//声音操作
function muice(el){
	$(el).on("click",function(){
		//当下点击播放
		questions_id = $(this).attr('index');
		var player = $(this).find('.player')[0];//jquery对象转换成js对象
		if (player.paused) {
			//全部初始化
			$(el).removeClass("glyphicon-pause");
			$(el).addClass("glyphicon-play");
			var players = document.getElementsByClassName('player');
			for (var item of players) {
				var index = item.getAttribute('index');
				//console.log(index!= questions_id)
				if (index != questions_id) {
					if (!item.paused) {
						item.pause();
					}
				}
			};
			//当下播放
			player.play();
			player.addEventListener("timeupdate", function(){
				let durationCur=formatTime(parseInt(player.duration-player.currentTime));
				let percent=Math.round(parseInt(player.currentTime) / parseInt(player.duration) * 100);					
				$(this).parent().find('progress').val(percent);
				player.nextElementSibling.innerText = durationCur;
				
				//播放完毕初始化
				let duration = formatTime(parseInt(player.duration));
				let currentTime = formatTime(parseInt(player.currentTime));					
				if (duration==currentTime) {
					player.pause();
					$(el).removeClass("glyphicon-pause");
					$(el).addClass("glyphicon-play");
					$(this).parent().find('progress').val(0);
					player.nextElementSibling.innerText = currentTime;
				}
			});
			
			
		}else{
			//console.log("播放")
			player.pause();
		};
		$(this).toggleClass("glyphicon-pause");
		$(this).toggleClass("glyphicon-play");

	});
}

//时间转换
function formatTime(s) {
	var t;
	if(s > -1) {
		var hour = Math.floor(s / 3600);
		var min = Math.floor(s / 60) % 60;
		var sec = s % 60;
		if(hour < 0 || hour == 0) {
			t = '';
		} else if(0 < hour < 10) {
			t = '0' + hour + ":";
		} else {
			t = hour + ":";
					}
 
					if(min < 10) {
						t += "0";
		}
		t += min + ":";
		if(sec < 10) {
			t += "0";
		}
		t += sec;
	}
	return t;
};
