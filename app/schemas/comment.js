var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

//ObjectId为mongoose引用类型，这里用Object组件的Id作为字段类型是为了实现关联文档的查询
var CommentSchema = new Schema({
	movie: {type: ObjectId, ref: 'Movie'}, //当前要存哪部电影;指向Movie
	from: {type: ObjectId, ref: 'User'}, //评论来自于谁
	reply: [{ //该数组可放很多针对当前主评论下与其相关的小评论
		from: {type: ObjectId, ref: 'User'}, 
		to: {type: ObjectId, ref: 'User'}, //评论给谁，被回复的人]
		content: String
	}],
	
	content: String, //评论具体内容
	
	meta: { //里面放的是更新时间的记录
		createAt:{
			type: Date,
			default: Date.now()
		},
		updateAt:{
			type: Date,
			default: Date.now()
		}
	}
});

//每次在存储一个数据之前都会调用此方法
CommentSchema.pre('save', function(next){
	//判断数据是否是新加的,如果是就把它创建的时间以及更新时间设置为当前时间
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else{
		this.meta.updateAt = Date.now(); //若数据已经有了，再更新再保存的话只更新update
	}
	
	next();
});

//增加一个静态方法，该静态方法不会与数据库直接交互，只有经过model(模型)编译并实例化后才会具有这个方法
CommentSchema.statics = {
	//取出目前数据库里所有的数据
	fetch: function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb) //执行回调方法
	},
	//用来查询单条数据
	findById: function(id, cb){
		return this
			.findOne({_id: id})
			.exec(cb)
	},
};

//将此模式导出
module.exports = CommentSchema;