基于NodeJs+MongoDB+jQuery搭建的豆瓣电影网站
========================================

使用jade作为动态模板，bootstrap样式，实现了：
-----------------
#### 1.后台电影录入。包括选择电影的分类、海报的本地上传，并使用了豆瓣API，可以通过输入豆瓣电影ID号快速录入电影。<br>
#### 2.后台电影分类录入。<br>
#### 3.后台电影、分类的增删改查。<br>
#### 4.电影评论。并且可以实现给一部电影下的某个用户评论，类似于叠楼。<br>
#### 5.分页与搜索。<br>
#### 6.最后用mocha这个js测试工具进行了user的单元测试。
-----------------
**1. 项目后端搭建:**
  * 使用`NodeJs的express`框架完成电影网站后端搭建;
  * 使用`mongodb`完成数据存储,通过`mongoose`模块完成对`mongodb`数据的构建;
  * 使用`jade`模板引擎完成页面创建渲染;
  * 使用`Moment.js`格式化电影存储时间;

**2. 项目前端搭建:**
  * 使用`jQuery`和`Bootsrap`完成网站前端JS脚本和样式处理;
  * 使用`bcryptjs`完成对密码的加密处理;
  * 前后端的数据请求交互通过`Ajax`完成;

**3. 本地开发环境搭建:**
  * 使用`grunt`集成`jshint`对JS语法检查，`Less`文件编译、压缩等功能，使用`mocha`完成用户注册存储等步骤的简单单元测试，以及服务器的自动重启等功能。

**4. 网站整体功能:**

  网站正常访问无需管理原权限，以下网站数据的添加及删除功能需要登录默认管理员账号(**账号:leo 密码:leo**)。

  * 具有用户注册登录及管理;
  * 电影详情页面添加及删除评论;
  * 电影院信息录入和搜索;
  * 电影分类添加及删除;
  * 电影图片海报自定义上传;
  * 列表分页处理;
  * 访客统计;

运行环境及Node版本:
-------
目前在Windows下的node 4.2.x版本运行正常

安装:
----
- 安装mongodb(https://www.mongodb.org/downloads#production)完成相关配置;
- 在当前项目目录中使用npm install命令安装相关模块(<a href="http://npm.taobao.org/" target="\_blank">如果模块下载速度慢可考虑使用淘宝cnpm镜像进行下载</a>);

运行与使用:
----
1. 启动数据库`mongod`,如果出现错误尝试输入`sudo mongod`来完成启动
2. 项目目录下的doubanDatabase是可供选择导入的数据库信息，可通过命令`mongorestore -h host -d dataName --dir=path` 来导入该文件夹信息到数据库中，其中-h是连接地址，如127.0.0.1 -d是将要创建数据库的名称，如douban(注意:项目中链接的数据库名称是douban,如果-d后创建的数据库名称叫douban2,则需要将app.js文件`dbUrl = 'mongodb://127.0.0.1/douban`中的douban改成douban2),--dir=后为该doubanDatabase所在路径，具体可通过`mongorestore --help`查看
3. 使用命令行工具在该项目目录下使用gulp运行程序,默认是使用3000端口，若端口已占用可在主目录app.js文件中将3000端口换成未占用的端口，当命令行工具看到：Movie started on； port:3000时在游览器中输入localhost:3000即可看到项目电影主页;
4. doubanDatabase中存储了默认的管理员账号:leo 密码:leo 权限为51，只有当权限大于10才可以访问后台控制页面，可通过修改数据库中users中role值完成用户权限控制。


项目页面:
-------
当使用管理员账号登录时(默认账号密码均是leo)可在顶部搜索栏下显示各后台控制页面的链接，方便页面切换。

**豆瓣电影首页:** localhost:3000/  

**用户后台页:**
- 用户注册页面: localhost:3000/signup
- 用户登陆页面: localhost:3000/signin
- 用户详情列表页: localhost:3000/admin/user/list

**电影后台页:**
- 详情页:localhost:3000/movie/:id
- 后台录入页:localhost:3000/admin/movie/new
- 列表页:localhost:3000/admin/movie/list
- 分类录入页:localhost:3000/admin/category/new
- 分类页:localhost:3000/admin/category/list

项目结构:
----
```
├── app.js            项目入口文件
├── app               Node后端MVC文件目录
│   ├── controllers   控制器目录
│   │   ├── movie     电影页面控制器目录
│   │   └── user      用户列表控制器目录
│   ├── models        模型目录
│   │   ├── movie
│   │   ├── music
│   │   └── user
│   ├── schemas       模式目录
│   │   ├── movie
│   │   ├── music
│   │   └── user
│   └── views         视图文件目录
│       ├── includes
│       └── pages
├── node_modules      node模块目录
├── public            静态文件目录
│   ├── build         压缩后文件
│   │   ├── admin.min.js
│   │   ├── detail.min.js
│   │   └── index.css
│   ├── js
│   │   ├── admin.js
│   │   └── detail.js
│   ├── Less
│   │   └── index.less
│   ├── libs
│   │   ├── bootstrap
│   │   └── jquery
│   └── upload        用户自定义上传图片存储目录
├── config             路由目录
│   └── router.js
├── test              测试文件目录
│   └── user
│       └── user.js
├── img
├── README.md
├── gruntfile.js       grunt配置文件
└── package.json
```
项目整体效果
-------
![](https://github.com/576837179/i_movie2/raw/master/img/index.jpg)
![](https://github.com/576837179/i_movie2/raw/master/img/detail.jpg)
![](https://github.com/576837179/i_movie2/raw/master/img/results.jpg)
![](https://github.com/576837179/i_movie2/raw/master/img/signup.jpg)
![](https://github.com/576837179/i_movie2/raw/master/img/signin.jpg)
![](https://github.com/576837179/i_movie2/raw/master/img/user_list.jpg)
![](https://github.com/576837179/i_movie2/raw/master/img/admin_movie_new.jpg)
![](https://github.com/576837179/i_movie2/raw/master/img/admin_movie_list.jpg)
![](https://github.com/576837179/i_movie2/raw/master/img/admin_category_new.jpg)
![](https://github.com/576837179/i_movie2/raw/master/img/admin_category_list.jpg)

MongoDB操作:
-------
mongo->use i_movie2->show tables-><br>
db.users.find().pretty()  找到数据<br>
db.movies.update({id}, {$set: {role: 51}}).pretty()  更新数据<br>
db.sessions.remove({})  删除单条数据<br>
db.categories.drop()  删除数据集<br>

后期完善:
-------
1. 完善网站功能;
2. 优化项目代码;
