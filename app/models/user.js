var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');

//编译生成movie模型
var User = mongoose.model('User', UserSchema);

//将模型(构造函数)导出
module.exports = User;
