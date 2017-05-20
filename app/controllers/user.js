var User = require('../models/user');   // 载入mongoose编译后的模型user

// 路由器解析注册页面signup page
exports.showSignup = function(req, res){		
	res.render('signup', {
		title: '注册页面'
	});		
};

// 路由器解析登录页面signin page
exports.showSignin = function(req, res){		
	res.render('signin', {
		title: '登录页面'
	});		
};

//路由器解析注册signup
//req.param('id')，按顺序获取;req.params，从路由中获取参数;req.body，拿到表单中的数据;req.query，获取url中？后的数据
exports.signup = function(req, res){
	var _user = req.body.user; //拿到表单提交的user数据
	User.findOne({name: _user.name}, function(err, user){//判断用户名是否被占用
		if(err){
			console.log(err);
		}
		
		if(user){
			return res.redirect('/signin');
		}
		else{
			user = new User(_user); //直接生成用户数据
			
			user.save(function(err, user){
				if(err){
					console.log(err);
				}
				
				res.redirect('/');
			});
		}
	});
};

//路由器解析登录signin
exports.signin = function(req, res){
	var _user = req.body.user; //拿到表单提交的user
	var name = _user.name;
	var password = _user.password;
	
	//拿到数据库里来查询
	User.findOne({name: name}, function(err, user){ //匹配：判断用户名是否存在
		if(err){
			console.log(err);
		}
		
		if(!user){
			return res.redirect('/signup');
		}
		
		user.comparePassword(password, function(err, isMatch){ //调用user实例的方法并传入当前明文密码
			if(err){
				console.log(err);
			}
			
			if(isMatch){ //若匹配 则登录成功并返回首页
				//通过req.session把user设置成当前user,判断session里面是不是user(服务器与客户端会话状态)
				req.session.user = user; 
				return res.redirect('/');
			}
			else{
				return res.redirect('/signin');
				//console.log('password is not matched');
			}
		}); 
	});
};

// 路由器解析登出logout
exports.logout = function(req, res){
	delete req.session.user;
	//delete app.locals.user;
	res.redirect('/');
};

// 路由器解析userlist page
exports.list = function(req, res){

	//同样要查询一下和首页查询一样
	User.fetch(function(err, users){
		if(err){
			console.log(err);
		}
		
		res.render('userlist', {
			title: 'i_movie2 用户列表页',
			users: users
		});		
	});
};

// 登录中间件midware for user
exports.signinRequired = function(req, res, next){
	var user = req.session.user;
	
	if(!user){
		return res.redirect('/signin');
	}
	
	next(); //若登录成功则往下一个next走
};

// 管理权限中间件midware for user
exports.adminRequired = function(req, res, next){
	var user = req.session.user;
	
	if(user.role <= 10){
		return res.redirect('/signin');
	}
	
	next();
};