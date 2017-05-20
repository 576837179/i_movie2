var mongoose = require('mongoose');
var CommentSchema = require('../schemas/comment');
//编译生成movie模型
var Comment = mongoose.model('Comment', CommentSchema);

//将模型(构造函数)导出
module.exports = Comment;