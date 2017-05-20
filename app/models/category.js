var mongoose = require('mongoose');
var CategorySchema = require('../schemas/category');

//编译生成movie模型
var Category = mongoose.model('Category', CategorySchema);

//将模型(构造函数)导出
module.exports = Category;