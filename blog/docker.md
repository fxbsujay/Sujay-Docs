# Docker

## 使用说明

> [安装文档](https://docs.docker.com/engine/install/centos/) [镜像网站](https://hub.docker.com/) [阿里云镜像加速](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)

```sh
# 下载yum
tar -xvf xxx.tar.gz
./yummain.py install yum

# 安装存储库
yum install -y yum-utils

# 设置镜像源
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
    
# 安装引擎
yum install docker-ce docker-ce-cli containerd.io

# 启动
systemctl start docker

# 开机自启动
systemctl enable docker

# 停止
systemctl stop docker

# 重启
systemctl restart docker

# 查看docker版本
docker version

# 查询Docker主体信息
docker info

# 查询帮助文档
docker --help
docker <具体命令> --help

# 卸载
yum remove dokcer-ce docker-ce-cli containerd.io
rm -rf /var/lib/docker
rm -rf /var/lib/contained

```



### 镜像加速

```sh
# 创建文件
mkdir -p /etc/docker

# 修改配置, 设置镜像
tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://vw9qapdy.mirror.aliyuncs.com"]
}
EOF

# 重启后台线程
systemctl daemon-reload

# 重启docker
systemctl restart docker
```





### 常用命令

```sh
## 查看当前下载的所有镜像
docker images

# 搜索 镜像，列出25个
docker search --limit 25 <镜像>

# 下载镜像，可以不指定版本，默认下载最新
docker pull <镜像>:<版本>

# 删除镜像
docker rmi  -f <镜像>

# 删除全部镜像
docker rmi -f $(docker images -qa)

# 创建并启动镜像容器
docker run [参数数组] <镜像> [附加命令数组] [附加启动参数数组]  

# 列出当前启动中的容器
docker ps

# 列出当前所有容器
docker ps -a

# 进入容器内部
docker exec -it <容器名 / ID> /bin/bash

# 退出容器，容器停止
exit

# 推出以容器，容器不停止
ctrl + p + q

# 启动容器
docker start <容器名 / ID>

# 重启容器
docker restart <容器名 / ID>

# 停止容器
docker stop <容器名 / ID>

# 强制杀死容器
docker kill <容器名 / ID>

# 删除容器, 要先停止容器再删除
docker rm <容器名 / ID>

# 随docker启动则自动启动容器，不设置重启docker不会启动容器
docker update <容器名 / ID> --restart=always

# 复制容器文件
docker cp <容器>:<容器目录文件> <本机目录文件>

# 构建镜像
docker build -t <名称>:<标签> <DockerFile相对路径>

# 查看映射端口对应的容器内部源端口
docker port <容器名 / ID>

# 查看容器详情
docker inspect <容器名 / ID>

# 查看日志
docker inspect --format '{{.LogPath}}' <容器名 / ID>
cat /var/lib/docker/xxxxx.log

# -f 跟踪日志，-t 显示时间
docker -f -t logs <容器名 / ID>

# 查看历史版本信息
docker history <容器名 / ID>

# 查看容器ip
docker inspect --format='{{.NetworkSettings.IPAddress}}' <容器名 / ID>

# 查看容器进程信息
docker top <容器名 / ID>
```



### DockerFile

> [参考文档](https://docs.docker.com/engine/reference/builder/) [Tomcat案例](https://github.com/docker-library/tomcat/blob/master/8.5/jdk8/temurin-jammy/Dockerfile)



FROM

指定基础镜像，当前镜像依赖于哪个镜像，DockerFile的第一条语句必须是FROM

```sh
FROM centos

FROM java:8

FROM openjdk:8-jdk-alpine
```



MAINTAINER

指定镜像作者

```sh
MAINTAINER fxbsujat@gmail.com
```



RUN

此命令是在 docker build 时进行

```sh
RUN echo 'Hello, Docker!' 

RUN ["/bin/bash", "-c", "echo hello"]
```



EXPOSE 

仅仅只是声明端口

作用：

- 帮助镜像使用者理解这个镜像服务的守护端口，以方便配置映射
- 在运行时使用随机端口映射时，也就是 docker run -P 时，会自动随机映射 EXPOSE 的端口

```sh
EXPOSE 3306
EXPOSE 8080/tcp 9000/udp
```



WORKDIR

指定工作目录，如该目录不存在，则建立目录，终端登录的默认目录

```
WORKDIR /usr/local/tomcat
```



USER

指定该镜像以什么用户去执行，默认为root

```sh
USER <用户名>[:<用户组>]
```



ENV

设置环境变量，定义了环境变量，那么在后续的指令中，就可以使用这个环境变量

```sh
ENV JAVA_PATH /usr/java1.8

RUN $JAVA_PATH -jar app.jar
```



ADD

将宿主机下的文件/目录复制到镜像内且自动处理URL和解压tar压缩包,路径为相对路径

如果是URL 将自动创建路径目录，并将文件放在路径目录下

```sh
ADD demo-0.0.1-SNAPSHOT.jar app.jar
ADD http://xxx.com/demo/demo-0.0.1-SNAPSHOT.jar
```



COPY

类似于ADD，拷贝文件和目录到镜像中

```sh
COPY overview.md.txt /mydir/
```



VOLUME

定义匿名数据卷。在启动容器时忘记挂载数据卷，会自动挂载到匿名卷，在启动容器 docker run 的时候，我们可以通过 -v 参数修改挂载点

作用：

- 避免重要的数据，因容器重启而丢失，这是非常致命的
- 避免容器不断变大

```sh
VOLUME /tmp
```



CMD

类似于 RUN 指令，在 docker run 时运行，如果出现多个CMD，只有最后一个CMD会生效，使用括号时，第一行的参数如果在指定位置或系统的环境变量找不到就会被当作ENTRYPOINT的参数来使用

```sh
CMD echo 'Hello, Docker!'
CMD ["<可执行文件或命令>", "<参数>", "<参数>", ...] 
CMD ["<参数>", "<参数>", ...]
```



ENTRYPOINT

类似于 CMD 指令，但其不会被 docker run 的命令行参数指定的指令所覆盖，而且这些命令行参数会被当作参数送给 ENTRYPOINT 指令指定的程序

```sh
# nginx -c /etc/nginx/nginx.conf
CMD ["/etc/nginx/nginx.conf"]
ENTRYPOINT ["nginx", "-c"]

ENTRYPOINT ["java", "-jar", "/app.jar"]
```



### 阿里云镜像仓库

```sh
# 登录到自己的阿里云镜像仓库
docker login --username=*** registry.cn-hangzhou.aliyuncs.com

# 添加镜像
docker tag [本地镜像名或ID] registry.cn-hangzhou.aliyuncs.com/命名空间/镜像仓库:[镜像版本号]

# 上传镜像
docker push registry.cn-hangzhou.aliyuncs.com/命名空间/镜像仓库:[镜像版本号]

# 拉取镜像
docker pull registry.cn-hangzhou.aliyuncs.com/命名空间/镜像仓库:[镜像版本号]
```

