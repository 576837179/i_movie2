var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var categorySchema = new Schema({
	name: String,
	movies: [{type: ObjectId, ref: 'Movie'}], //里面是具体的分类下电影的ObjectId
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
})

//每次在存储一个数据之前都会调用此方法
categorySchema.pre('save', function(next){
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
categorySchema.statics = {
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
module.exports = categorySchema;