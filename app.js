/**
 * Created by Li hui on 17/04/19.跑通前后端
 */
var express = require('express');  // 加载express模块
var port = process.env.PORT || 3000; //// 设置端口号：3000。环境变量要是设置了PORT，那么就用环境变量的PORT
var app = express();  //启动Web服务器,将实例赋给变量app
var mongoose = require('mongoose');
var session = require('express-session'); //注意：要把session定义在mongoose前面
var cookieParser = require('cookie-parser'); //从cookie中获取sessionid
var mongoStore = require('connect-mongo')(session); //session持久化，将session存在mongo中

//model loading
var fs = require('fs');
var models_path = __dirname + '/app/models'; //取得所有models
var walk = function(path){ //遍历目录
	fs
		.readdirSync(path)
		.forEach(function(file){
			var newPath = path + '/' + file;
			var stat = fs.statSync(newPath);
			
			if(stat.isFile()){ //如果是一个文件
				if(/(.*)\.(js|coffee)/.test(file)){ //也是一个JS文件
					require(newPath);
				}
			}
			else if(stat.isDirectory()){ //否则继续遍历
				walk(newPath);
			}
		})
};
walk(models_path);

mongoose.Promise = global.Promise;
var dbUrl = 'mongodb://127.0.0.1:27017/i_movie2';
mongoose.connect(dbUrl); // 连接mongodb本地数据库i_movie2
/*  mongoose 简要知识点补充
* mongoose模块构建在mongodb之上，提供了Schema[模式]、Model[模型]和Document[文档]对象，用起来更为方便。
* Schema对象定义文档的结构（类似表结构），可以定义字段和类型、唯一性、索引和验证。
* Model对象表示集合中的所有文档。
* Document对象作为集合中的单个文档的表示。
* mongoose还有Query和Aggregate对象，Query实现查询，Aggregate实现聚合。
* */

app.use(cookieParser()); //session依赖于cookieParser
app.use(session({ //会话配置项
	secret: 'i_movie2', //防篡改
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions' //存到mongoDB数据库里面的名字
	})
}));

var logger = require('morgan');
if('development' === app.get('env')){ //通过ENV拿到开发环境变量
	app.set('showStackError', true);  //设为true在屏幕上能打印错误信息
	app.use(logger(':method :url :status')); //对它传入配置参数值
	app.locals.pretty = true;         //因为压缩过，希望为格式化过好看些
	mongoose.set('debug', true);
}


app.set('views', './app/views/pages'); // 设置默认的视图文件路径
app.set('view engine', 'jade'); // 设置视图引擎：jade
var bodyParser = require('body-parser')//不再与express捆绑需单独安装
app.use(bodyParser.json()); //for parseing application json
app.use(bodyParser.urlencoded({extended: true})); // 因为后台录入页有提交表单的步骤，故加载此模块方法（bodyParser模块来做文件解析），将表单里的数据进行格式化
var multipart = require('connect-multiparty');
app.use(multipart());
var path = require('path'); // app.use是用来给path注册中间函数的。引入path模块的作用：因为页面样式的路径放在了bower_components，告诉express，请求页面里所过来的请求中，如果有请求样式或脚本，都让他们去bower_components中去查找
app.use(express.static(path.join(__dirname, 'public'))); //多个路径拼接起来，__dirname为当前目录,express.static是中间函数，为指定静态文件查找目录
app.locals.moment = require('moment'); // 载入moment模块，格式化日期
app.listen(port);

require('./config/routes')(app); //引用并传给app

console.log('i_movie2 started on port: ' + port);
