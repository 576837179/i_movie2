var Comment = require('../models/comment'); // 载入mongoose编译后的模型comment

// comment
//拿到从后台录入页post过来的数据
exports.save = function(req, res){
	var _comment = req.body.comment;
	var movieId = _comment.movie;
	
	//判断评论还回复
	if(_comment.cid){
		Comment.findById(_comment.cid, function(err, comment){ //找到主评论内容
			var reply = {
				from: _comment.from,
				to: _comment.tid,
				content: _comment.content
			};
			
			comment.reply.push(reply);			
			comment.save(function(err, comment){
				if(err){
					console.log(err);
				}			
				res.redirect('/movie/' + movieId);
			});
		}); 
	}
	else{ //否则为简单评论
		var comment = new Comment(_comment);
	
		comment.save(function(err, comment){
			if(err){
				console.log(err);
			}			
			res.redirect('/movie/' + movieId);
		});
	}
};
