var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

//通过mongoose.Schema接口传入对象，该对象描述用户 模型文档结构和数据类型，然后将其通过接口生成的模式赋值给UserSchema
var UserSchema = new mongoose.Schema({ 
	name: {
		unique: true, //唯一，用户名不可重复
		type: String
	},
	password: String,
	//0: nomal user
	//1: verified user
	//2: professonal user
	//10: admin
	//50: super admin
	role: {
		type: Number,
		default: 0,		
	},
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

///每次存储数据之前都调用这个方法 pre save
UserSchema.pre('save', function(next){
	var user = this;//将user 指向了最外层的this
	
	//判断数据是否是新加的,如果是就把它创建的时间以及更新时间设置为当前时间
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else{
		this.meta.updateAt = Date.now(); //若数据已经有了，再更新再保存的话只更新update
	}
	
	//先生成随机盐，再将密码和盐混合加密，最终拿到存储密码。第一个参数为计算强度，即计算密码所需的资源和时间，回调方法拿到生成后的盐
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){ 
		if(err){
			return next(err);
		}
		bcrypt.hash(user.password, salt, function(err, hash){
			if(err){
				return next(err);
			}
			
			user.password = hash;
			next();
		});
	});
});

//通过实例可调用的方法，若为静态方法则用模型便可(对应app.js的signin)
UserSchema.methods = {
	comparePassword: function(_password, cb){ //该方法接收提交过来的参数和回调
		bcrypt.compare(_password, this.password, function(err, isMatch){ //bcrypt密码校对方法,与当前数据库密码比对
			if(err){
				return cb(err); //若有错则包装到回调
			}
			cb(null, isMatch); //若没错err为null，并把密码是否是匹配的值返回
		}); 
	} 
};

//增加一个静态方法，该静态方法不会与数据库直接交互，只有经过model(模型)编译并实例化后才会具有这个方法
UserSchema.statics = {
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
module.exports = UserSchema;