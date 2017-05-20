//动态添加回复区
$(function(){
	$('.comment').click(function(e){
		var target = $(this); //先拿到自身节点
		var toId = target.data('tid'); //拿到拿到自身tid
		var commentId = target.data('cid');
		
		if($('#toId').length > 0){
			$('#toId').val(toId);
		}
		else{
			$('<input>').attr({ //动态创建隐藏表单域
				type: 'hidden',
				id: 'toId',
				name: 'comment[tid]',
				value: toId
			}).appendTo('#commentForm');
		}
		
		if($('#commentId').length > 0){
			$('#commentId').val(commentId);
		}
		else{
			$('<input>').attr({ //动态创建隐藏表单域
				type: 'hidden',
				id: 'commentId',
				name: 'comment[cid]',
				value: commentId
			}).appendTo('#commentForm');
		}
	});
});