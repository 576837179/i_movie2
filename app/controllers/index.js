var Movie = require('../models/movie'); // 载入mongoose编译后的模型movie
var Category = require('../models/category');

// 编写主要页面路由
// 路由器解析index page
exports.index = function(req, res){
	Category
		.find({})
		.populate({
			path: 'movies',
			select: 'title poster',
			options: {limit: 6}
		})
		.exec(function(err, categories){
			if(err){
				console.log(err);
			}
			
			res.render('index', {
				title: 'i_movie2 首页',
				categories: categories
			});
		})
};

// 路由器解析 search page
exports.search = function(req, res){
	var catId = req.query.cat;
	var q = req.query.q;
	var page = parseInt(req.query.p, 10) || 0;
	var count = 2;
	var index = page * count;
	
	if(catId){ //如果是catId说明搜的是分类
		Category
			.find({_id: catId}) //先拿到catId分类对所有电影populate,取得所以电影
			.populate({
				path: 'movies',
				select: 'title poster'
			})
			.exec(function(err, categories){ //只返回一条数据，就是当前分类
				if(err){
					console.log(err);
				}
				var category = categories[0] || {};
				var movies = category.movies || [];
				var results = movies.slice(index, index + count);
				
				res.render('results', {
					title: 'i_movie2 结果列表页面',
					keyword: category.name,
					currentPage: (page + 1), //当前page
					query: 'cat=' + catId,
					totalPage: Math.ceil(movies.length / count),  //拿到所有page
					movies: results
				});
			})
	}
	else{ //若不是catId则认为来自搜索框提交的请求
		//这里查电影相关不能用Category
		Movie
			.find({title: new RegExp(q + '.*', 'i')}) //正则模糊匹配
			.exec(function(err, movies){
				if(err){
						console.log(err);
				}
				
				var results = movies.slice(index, index + count);
				
				res.render('results', {
					title: 'i_movie2 结果列表页面',
					keyword: q,
					currentPage: (page + 1), //当前page
					query: 'q=' + q,
					totalPage: Math.ceil(movies.length / count),  //拿到所有page
					movies: results
				});
			})
	}
};
