var mongoose = require('mongoose');
var MovieSchema = require('../schemas/movie');

//编译生成movie模型
var Movie = mongoose.model('Movie', MovieSchema);

//将模型(构造函数)导出
module.exports = Movie;
