var mongoose = require('mongoose')
var Category = require('../models/category');
var Movie = require('../models/movie');

//admin new page
exports.new = function(req,res){
	res.render('category_admin',{
		title:'后台电影分类录入页面',
		category:{}
	})
};

//admin post movie
exports.save = function(req,res){
	var _category = req.body.category;
	var category = new Category(_category);

	category.save(function(err, category){
		if(err){
			console.log(err);
		}

		res.redirect('/admin/category/list');
	})
};

// 路由器解析catelist page
exports.list = function(req, res){

	//同样要查询一下和首页查询一样
	Category.fetch(function(err, categories){
		if(err){
			console.log(err);
		}
		
		res.render('categorylist', {
			title: 'i_movie2 分类列表页',
			categories: categories
		});		
	});
};

//list delete movie
exports.del = function(req,res){
	var id=req.query.id

	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err)
			}else{
				res.json({success:1})
			}
		})
	}
}