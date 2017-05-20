var _ = require('underscore'); // _.extend用新对象里的字段替换老的字段(line.88)
var Movie = require('../models/movie');
var Category = require('../models/category');
var Comment = require('../models/comment');
var fs = require('fs');
var path = require('path');


// 路由器解析detail page
exports.detail = function(req, res){
	//参数在url中时,通过req.parmas可以拿到id参数值
	var id = req.params.id;
	//修改器$inc可以对文档的某个值为数字型（只能为满足要求的数字）的键进行增减的操作。
	Movie.update({_id: id},{$inc: {pv: 1}}, function(err){ //访客统计
		if(err){
			console.log(err);
		}
	});
	//在模式定义好的方法,传入id在回调方法拿到查询到的单条电影数据
	//Movie下从Comment查询哪些movie的ID跟当前的详情页movie是同一个，然后拿到当前movie对应的comments
	Movie.findById(id, function(err, movie){
		Comment
			.find({movie: id})             //找到当前电影评论过的数据逐个进行populate
			.populate('from', 'name') //对from的ObjectId让它到User表里去查,查完后把name反馈后再填充进去;第二参数为生成的字段
			.populate('reply.from reply.to', 'name')
			.exec(function(err, comments){
				console.log(comments);
				res.render('detail', {
					title: 'i_movie2 ' + movie.title,
					movie: movie,
					comments: comments
				});
			});
	});
};

// 路由器解析admin new page
exports.new = function(req, res){
	Category.find({}, function(err, categories){
		if(err){
			console.log(err)
		}
		res.render('admin', {
			title: 'i_movie2 后台录入页',
			categories: categories,
			movie: {}
		});
	});
};
 
// 路由器解析admin update movie(倒数第二步)
// 这个URL地址过来后就是要更新电影
exports.update = function(req, res){
	//同样是先拿到，判断如果存在
	var id = req.params.id;
	
	if(id){
		//通过模型拿到此方法
		Movie.findById(id, function(err, movie){
			Category.find({}, function(err, categories){
				res.render('admin', {
					title: 'i_movie2 后台更新页',
					movie: movie,
					categories: categories
				});
			});
		});
	}
};

//admin poster page
exports.savePoster = function(req, res, next){
	var posterData = req.files.uploadPoster;
	var filePath = posterData.path; //拿到文件路径
	var originalFilename = posterData.originalFilename; //判断名字是否存在
	
	//有原始文件名就认为是有文件上传的
	if(originalFilename){
		fs.readFile(filePath, function(err, data){ //读取图片二进制数据,拿到具体数据
			var timestamp = Date.now(); //将当前时间作为时间戳来为上传文件命名
			var type = posterData.type.split('/')[1]; //以/分隔，取后半部分作为类型
			var poster = timestamp + '.' + type;
			var newPath = path.join(__dirname, '../../', 'public/upload/' + poster); //存到新的服务器path.join():将多个参数组合成一个 path:'_dirname/../../public/upload/poster'
			
			fs.writeFile(newPath, data, function(err){
				req.poster = poster;
				next();
			});
		}); 
	}
	else{
		next();
	}
};

// admin post movie 后台更新页
//拿到从后台录入页post过来的数据
exports.save = function(req, res){
	//从表单post过来的数据可能是新加的也可能是再次更新过的然后再post,所以要做个判断是否有id的定义
	//(来自admin.jade的input)提交表单后，服务端会接收到表单信息（包括隐藏域的值）。服务端通过 bodyParser 解析表单信息，将结果放在 req.body 中。
	//于是，我们可以通过 req.body.movie 取到该表单中的信息。那么 req.body.movie._id 就是隐藏表单项的值了（_id）。
	//这个 _id 用来区分“已存在的”和 “新添加”的内容。结合视频，理清 list.jade 中关于“修改”部分的逻辑，就知道为什么会这样写了 :)
	var id = req.body.movie._id;
	//拿到movie对象，再声明一个movie的变量
	var movieObj = req.body.movie;
	var _movie;
	
	//如果有上传的海报则放入movie中
	if(req.poster){ 
		movieObj.poster = req.poster;
	}
	
	//先判断是否上传文件，若上传则存起来，若没上传按原有逻辑去更新
	
	//若id不等于undefined说明电影已存储到数据库过的，则进行更新
	if(id){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err);
			}
			
			//用post过来的电影数据里面的更新过的字段来替换掉老的数据,先将要查询的movie放第一个参数，在post过来的movie放第二个参数
			_movie = _.extend(movie, movieObj);
			//在save的时候,回调方法里一样能拿到是否有异常和save后的movie
			_movie.save(function(err, movie){
				if(err){
					console.log(err);
				}
				
				//若电影更新了也存入成功了,应把页面重定向到这部电影对应的详情页
				res.redirect('/movie/' + movie._id);
			});
		});
	}
	else{ //若这部电影是没定义过的(post表单没movie._id这个值)，所以电影为新加的，就可直接调用模型的构造函数
		_movie = new Movie(movieObj);
		
		var categoryId = movieObj.category; 
		var categoryName = movieObj.categoryName;
		
		_movie.save(function(err, movie){
			if(err){
					console.log(err);
			}
			
			if(categoryId){ //提交电影到movie后台但没同步到分类所以如下
				Category.findById(categoryId, function(err, category){
					category.movies.push(movie._id);
					
					category.save(function(err, category){
						//若电影更新了也存入成功了,应把页面重定向到这部电影对应的详情页
						res.redirect('/movie/' + movie._id);
					});
				});
			}
			//此只有categoryName没有categoryId所以前面new的就没有category所以在此new一个并把ID给倒进_movie,所以保存两次
			else if(categoryName){ //若按钮分类没被选则打字新建一个
				var category = new Category({
					name: categoryName,
					movies: [movie._id]
				});
				
				category.save(function(err, category){
					movie.category = category._id;
					
					movie.save(function(err, movie){
						res.redirect('/movie/' + movie._id);
					});
				});
			}
		});
	}
};

// 路由器解析list page
exports.list = function(req, res){
	//同样要查询一下和首页查询一样
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err);
		}
		
		res.render('list', {
			title: 'i_movie2 列表页',
			movies: movies
		});		
	});
};
//在列表页点更新后会重新回到后台录入页，这时候需要将电影数据给初始化到表单中所以还需要加一个路由admin update movie

// 路由器解析list delete movie(一期最后一步)
exports.del = function(req, res){
	var id = req.query.id;
	
	if(id){
		Movie.remove({_id: id}, function(err, movie){
			if(err){
				console.log(err);
			}
			else{
				res.json({success: 1});
			}
		});
	}
};
