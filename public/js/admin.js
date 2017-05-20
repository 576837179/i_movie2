// 处理删除电影数据的逻辑
$(function(){
	$('.del').click(function(e){
		var target = $(e.target); //先拿到当前按钮
		var id = target.data('id'); //拿到当前按钮赋值id
		var tr = $('.item-id-' + id); //拿到表格中的这一行，因为删除数据后希望一整行也删除，这样从展现看数据是没了
		
		$.ajax({
			type: 'DELETE',
			url: '/admin/movie/list?id=' + id
		})
		.done(function(results){ //删除后希望服务器返回状态
			if(results.success === 1){ //为1说明删除成功
				if(tr.length > 0){ //如果当前这行确实有
					tr.remove();
				}
			}
		});
	});
});
	
$('#douban').blur(function(){
	var douban = $(this);
	var id = douban.val();
	if(id){
		$.ajax({
			url: 'https://api.douban.com/v2/movie/subject/' + id,
			cache: true,
			type: 'get',
			dataType: 'jsonp',
			crossDomain: true,
			jsonp: 'callback',
			success: function(data){
				$('#inputTitle').val(data.title)
				$('#inputDoctor').val(data.directors[0].name)
				$('#inputCountry').val(data.countries[0])
				$('#inputPoster').val(data.images.large)
				$('#inputYear').val(data.year)
				$('#inputSummary').val(data.summary)
					
			}
		});
	}
});
