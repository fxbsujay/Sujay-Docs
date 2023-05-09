# 使用 Hexo 搭建一个博客

## 安装Node.js
[下载地址](http://nodejs.cn/download/)


```shell
#  解压
tar -xvf   node-v6.10.0-linux-x64.tar.xz   
mv node-v6.10.0-linux-x64  nodejs 

#  软连接
ln -s /mydata/nodejs/bin/npm /usr/local/bin/ 
ln -s /mydata/nodejs/bin/node /usr/local/bin/
```

## 安装Hexo
> [Hexo](https://hexo.io/zh-cn/)

```sh
#  安装客户端
npm install hexo-cli -g
#  软连接
ln -s /mydata/nodejs/bin/hexo /usr/local/bin/hexo
#  检查安装
hexo
#  创建你的博客目录
mkdir blog
cd blog
#  初始化博客
hexo init
npm install
#  启动
hexo s

# 修改启动端口
node_modules \ hexo-server\ index.js
```
## 后台运行


```sh
npm install -g pm2
ln -s /mydata/nodejs/bin/pm2 /usr/bin/pm2
```
新建 `hexo_run.js` 运行脚本
```javascript
const { exec } = require('child_process')
exec('hexo server',(error, stdout, stderr) => {
        if(error){
                console.log('exec error: ${error}')
                return
        }
        console.log('stdout: ${stdout}');
        console.log('stderr: ${stderr}');
})

```
启动
```sh

pm2 start hexo_run.js

```
## PM2命令
```sh
pm2 start server.js # 启动server.js进程
pm2 start server.js -i 4 # 启动4个server.js进程
pm2 restart server.js # 重启server.js进程
pm2 stop all #  停止所有进程
pm2 stop server.js # 停止server.js进程
pm2 stop 0 # 停止编号为0的进程


# 创建app.json，内容如下
{
  "apps" : [{
    "script"    : "server.js",  # 进程名
    "instances" : "max",   # 开启进程数，可为数值，也可为max。与服务器cpu核数相关
    "exec_mode" : "cluster" #  可选：fork(服务器单核推荐) cluster(多核推荐)
  }]
}
pm2 start app.json

pm2 list # 查看当前正在运行的进程
pm2 show 0 # 查看执行编号为0的进程

pm2 monit # 监控当前所有的进程
pm2 monit 0 # 监控批评行编号为0的进程
pm2 monit server.js # 监控名称为server.js的进程

pm2 logs # 显示所有日志
pm2 logs 0 # 显示执行编号为0的日志
pm2 logs server.js # 显示名称为server.js的进程
pm2 flush  # 清洗所有的数据[注：我没有试出来效果]
```