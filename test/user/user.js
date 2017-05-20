// user测试用例
var crypto = require('crypto');
var bcrypt = require('bcryptjs');

//生成一个随机用户名,获取随机字符串,该字符串用来测试user时有个名字
function getRandomString(len){
	if(!len){
		len = 16
	}
	
	return crypto.randomBytes(Math.ceil(len / 2)).toString('hex');
}

var should = require('should');
var app = require('../../app');
var mongoose = require('mongoose');
var User = require('../../app/models/user');

var user;
//编写测试用例
//describe:测试套件，describe('测试套件名称',function(){})
describe('<Unit Test>', function(){
	describe('Model User:', function(){
		//测试前定义user
		before(function(done){
			user = {
				name: getRandomString(),
				password: 'password'
			};
			done();
		});
		
		describe('Before Method save', function(){
			//it是测试用例，只可调用一次done
			//保存前测试是否已存在同name的用户
			it('should begin without test user', function(done){//一个it代表一个测试用例,只要跑通it则里面定义好的的比对等任务跑完了
				User.find({name: user.name}, function(err, users){
					users.should.have.length(0); //查不到用户
					done(); //只有用户不存在才能进行接下来的测试
				});
			}); 
		});
		
		describe('User save', function(){//一个it代表一个测试用例,只要跑通it则里面定义好的的比对等任务跑完了
			it('should save without problems', function(done){//第一个it确定保存没问题
				var _user = new User(user);
				
				_user.save(function(err){
					should.not.exist(err); //判断err是否为真，若为真则有问题
					_user.remove(function(err){
						should.not.exist(err);
						done();
					});
				});
			});
			
			it('should password be hashed correctly', function(done){//第二个it
				var password = user.password;
				var _user = new User(user);
				
				_user.save(function(err){
					should.not.exist(err);
					_user.password.should.not.have.length(0);
					
					bcrypt.compare(password, _user.password, function(err, isMatch){
						should.not.exist(err);
						isMatch.should.equal(true);
						
						_user.remove(function(err){
							should.not.exist(err);
							done();
						});
					});
				});
			});
			
			//希望权限为0
			it('should have default role 0', function(done){//第二个it
				var _user = new User(user);
				
				_user.save(function(err){
					_user.role.should.equal(0);	
					
					_user.remove(function(err){
						done();
					});
				});
			});
			
			//希望不要重名
			it('should fail to save an existing user', function(done){//第二个it
				var _user1 = new User(user);
				
				_user1.save(function(err){
					should.not.exist(err); //不存在
					
					var _user2 = new User(user);
					
					_user2.save(function(err){
						should.exist(err); //存在
						
						_user1.remove(function(err){
							if(!err){ //表示null
								_user2.remove(function(err){
									done();
								});
							}
						});
					});
				});
			});
		});
		
		after(function(done){
			//clear user info
			done();
		});
	});
});
