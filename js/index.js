$(function(){

	//页面渲染
	function downlist(key){
		var _html = `<div class="voice wauto">
						<p class="voicecon fr glyphicon glyphicon-play"><span class="fz12 statue">免费</span>
							<audio src="http://livehemujia.aigenwoxue.org/`+key+`" class="player"></audio>
							<span class="fr fz12 duration"></span>
							<progress value="0" max="100"></progress>
						</p>
					</div>`;
		$(".li_list").append(_html);
		//音乐详情渲染
		timeauto();
		//操作声音
		muice('.voicecon');
	}
	
	// 按住录音
	$(".J_speak").on({  
        touchstart: function(e) {
        	myDate1 = (new Date()).getTime()/1000;//获取系统当前时间秒数
            // 长按事件触发  
            timeOutEvent = setTimeout(function() {  
                timeOutEvent = 0;
                $('.rprogress').show();
                //开始录音
                HZRecorder.get(function (rec) {
					recorder = rec;
					recorder.start();
				});
            }, 400);
            //长按400毫秒
            e.preventDefault();
        },  
        touchmove: function() {
            clearTimeout(timeOutEvent);           
            timeOutEvent = 0;
        },  
        touchend: function() {  
            clearTimeout(timeOutEvent);
            if (timeOutEvent == 0) {
            	$('.rprogress').hide();
            	//获取录音
	            var record = recorder.getBlob();
	            //停止录音
        		recorder.stop();
	            blobToDataURL(record,function(entry){//Blob转为base64
					var name = dataURLtoFile(entry,"1.wav").size;
					var fileDom = dataURLtoFile(entry, name+'.wav');//base64转为file
					
					let myDate2 = (new Date()).getTime()/1000;//获取系统当前时间秒数
        			let second = Math.ceil(myDate2-myDate1);//计算时长一秒计量
        			console.log(myDate2-myDate1)
        			console.log(second)
					var imageData = new FormData();
					$.get('http://fmdfc.aigenwoxue.org/index.php/V3/Qiniu/getToken.html',function(data){
						var qiniutoken = data.data;
						imageData.append('file',fileDom);
						imageData.append('token',qiniutoken);
				        
				        $.ajax({
				            url: 'http://upload.qiniu.com',
				            type: 'POST',
				            data: imageData,
				            cache: false,
				            contentType: false,
				            processData: false,
				            success: function (result){
				            	console.log(result)
				            	downlist(result['key']);				            	
				            },
				            error: function (result) {
				               alert('error');
				            }
				        });
					});
				});
            	
            }
            return false;  
        }  
    });
    //Blob转为base64
    function blobToDataURL(blob, callback) {
	    let a = new FileReader();
	    a.onload = function (e) { 
	    	callback(e.target.result); 
	    }
	    a.readAsDataURL(blob);
	};
	//将base64转换为文件
	function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
   	};
   	
})