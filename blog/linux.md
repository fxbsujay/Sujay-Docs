# Linux

## 常用命令

### [ping](https://www.ibm.com/docs/zh/aix/7.3?topic=p-ping-command)
- 语法：ping [-c 数量] [-i 间隔时间] 目标主机
- 说明：发送一个回送信号请求给网络主机

| 符号 |                  说明                   |
|:--:|:-------------------------------------:|
| c  |              发送指定次数的请求包               |
| w  | 此选项仅适用于 -c 选项，它使 ping 命令以最长的超时时间去等待应答 |
| i  |              设置发送请求包的间隔时间               |


### [ps](https://www.ibm.com/docs/zh/aix/7.3?topic=p-ps-command)
- 语法：ps [选项]
- 说明：查看所有启动中的程序

| 符号 |                  说明                   |
|:--:|:-------------------------------------:|
| a  |              将关于所有进程的信息标准输出               |
| x  | 显示没有终端的进程除了有一个控制终端的进程 |
| w  |              显示加宽可以显示较多的资讯               |
| u  |              显示面向用户的输出。 这包括 USER、PID、%CPU、%MEM、SZ、RSS、TTY、STAT、STIME、TIME 和 COMMAND 字段。               |
| e  |               命令之后显示环境               |
| f  |               全部列出               |

```shell
# 查看所有启动中的程序
ps -x

# 根据进程名查询
ps -ef | grep <进程名>
```

### [netstat](https://www.ibm.com/docs/zh/aix/7.3?topic=n-netstat-command)
- 语法：netstat [选项]
- 说明：以符号方式显示活动连接的各个与网络相关的数据结构的内容


| 符号 |                  说明                   |
|:--:|:-------------------------------------:|
| a  |              显示所有套接字状态               |
| n  | 直接使用IP地址，不通过域名服务器 |
| o  | 详细数据 |
| p  |              显示正在使用Socket的程序识别码和程序名称              |
| r  | 显示路由表 |
| l  | 表示仅显示监听状态的端口 |
| t  | 显示TCP传输协议的连线状况 |
| u  | 显示UDP传输协议的连线状况 |

```shell
# 查看所以进程
netstat -anp

# 查看1110001进程
netstat -anop | grep 1110001

# 查看所有8769端口使用情况
netstat -ntulp | grep :8769
```

### [kill](https://www.ibm.com/docs/zh/aix/7.3?topic=k-kill-command)
- 语法：kill [-l 信息编号] [信号编号] PID
- 说明：停止进程


|  信息标识   | 信息编号 |  描述  |
|:-------:|:----:|:----:|
| SIGKILL |  9   | 强制终止 |
| SIGTERM |  15  | 在停掉进程之前调用提前写好的回调函数，或者等待进程处理完正在处理的任务之后，再停掉进程 |



## 目录操作命令

### [ls](https://www.ibm.com/docs/zh/aix/7.3?topic=l-ls-command)

列出目录内容，选项如下

| 选项 |  说明  |
|:--:|:----:|
| l  |  列出的文件以长格式输出，一个文件显示一行（可简写为ll） |
| a  |   显示以 “.”开头的文件，“.”开头的为隐藏文件，默认不显示  |
| d  |  显示目录本身而不显示目录下的文件  |
| lh |  长格式输出的文件字节数转换为K,M,G的形式方便人来阅读  |
| t  |  列出的文件按照修改时间的晚和早排序（最近修改的先显示）  |
| tr |  列出的文件按照修改时间的早和晚排序（最近修改的后显示）  |
| r  |  列出当前目录下的所有文件，如果有目录遍历所有目录及其子目录下的文件  |

ls -l 长格式输出字段说明，以 `-rw-r--r--. 1 root root 46478 8月13 2018 install.log` 为例

开头第一位表示文件类型，`-rw-r--r--` 代表相关用户、组、其他用户的权限，后面的 `1`，如果文件是普通文件表示硬链接的个数（访问该文件的路径数），如果文件是目录则表示目录下的一级子目录的个数，后面的 `root` 表示文件的属主（文件所属的用户名）以及文件的属组（文件所属的用户组名），`46478` 为文件的字节数，其次是文件最近一次的修改日期以及文件名


| 符号 |  说明  |
|:--:|:----:|
| -  | 普通文件 |
| d  |  目录  |
| l  |  链接文件  |
| c  |  字符设备文件  |
| b  |  块设备文件  |
| s  |  套接字文件  |
| p  |  命名管道文件  |


### [mkdir](https://www.ibm.com/docs/zh/aix/7.3?topic=m-mkdir-command)

- 语法：mkdir [-选项] [ -m 权限 ] ｛目录｝
- 说明：创建目录

| 选项 |             说明             |
|:--:|:--------------------------:|
| e  |          以加密继承创建目录         |
| m  | 指定文件权限 mkdir -m 777 test.md |
| p  |        创建丢失中间路径名称目录      |


### [du](https://www.ibm.com/docs/zh/aix/7.3?topic=d-du-command)
- 语法：du [-选项] ｛文件｝
- 说明：统计目录下每个文件字节数

| 选项 |             说明             |
|:--:|:--------------------------:|
| s  |          只显示所有文件字节数总数         |
| h  |        转换字节数为K、M、G的形式，便于阅读      |


## 文件操作命令

### [touch](https://www.ibm.com/docs/zh/aix/7.3?topic=t-touch-command)
- 语法：touch ｛文件或目录｝
- 说明：创建一个空文件，如果文件已经存在修改文件的修改日期

### [cp](https://www.ibm.com/docs/zh/aix/7.3?topic=c-cp-command)
- 语法：cp [-选项] ｛源文件｝ ｛目标文件｝
- 说明：复制文件


| 选项 |             说明             |
|:--:|:--------------------------:|
| r  |      复制整个文件，包含子目录和文件       |
| v  |            详细输出            |
| p  |        保留文件属性        |


### [mv](https://www.ibm.com/docs/zh/aix/7.3?topic=m-mv-command)
- 语法：mv [-选项] ｛源文件｝ ｛目标文件｝
- 说明：移动文件


| 选项 |                           说明                            |
|:--:|:-------------------------------------------------------:|
| f  |                      在覆盖现有文件之前不提示                       |
| i  |           移动文件或目录到现有的路径名称之前，将显示后跟问号的文件名来进行提示            |


### [rm](https://www.ibm.com/docs/zh/aix/7.3?topic=r-rm-command)
- 语法：mv [-选项] ｛文件或目录｝
- 说明：删除文件

| 选项 |                           说明                            |
|:--:|:-------------------------------------------------------:|
| e  |                      删除后显示消息                       |
| f  |           在除去有写保护的文件前不提示           |
| r  |           当 File 参数为目录时允许循环的删除目录及其内容           |

### [file](https://www.ibm.com/docs/zh/aix/7.3?topic=f-file-command)
- 语法：file ｛文件｝
- 说明：查看文件的类型

| 选项 |                           说明                           |
|:--:|:------------------------------------------------------:|
| R  |     递归修改目录及其子目录下的所有文件和目录权限  |
| v  |   显示命令执行过程中修改的文件或目录的权限信息     |
| r  |  当 File 参数为目录时允许循环的删除目录及其内容     |


### [tar](https://www.ibm.com/docs/zh/aix/7.3?topic=t-tar-command)
- 语法：tar [-选项] ｛文件｝  [-C 目录]
- 说明：处理归档

| 选项 |        说明        |
|:--:|:----------------:|
| x  |        解压        |
| v  | 在处理每个文件时，列出它们的名称 |
| f  |    指定归档文件的名称     |
| C  |    指定解压到哪个目录     |


### [chmod](https://www.ibm.com/docs/zh/aix/7.3?topic=c-chmod-command)
- 语法：chmod [-选项] {文件}
- 说明：修改文件权限

权限说明

| 权限 |  说明  |
|:--:|:----:|
| r  |  读   |
| w  |  写   |
| x  |  执行  |
| 0  | 没有权限 |
| 1  |  执行  |
| 2  |  写   |
| 3  |  写和执行  |
| 4  |  读  |
| 5  |  读和执行  |
| 6  |  读和写  |
| 7  |  读、写和执行  |

```shell
# 将文件的所有者的执行权限取消
chmod u-x file.txt

# 将文件的用户组的读写权限设置为只读
chmod g-w file.txt

# 将文件的其他用户的执行权限设置为可执行
chmod o+x file.txt

# 将文件的所有用户的读写权限设置为只读
chmod a-w file.txt

# 将文件的所有者的权限设置为读写
chmod u=rw file.txt

# 将文件 file.txt 的权限设置为 -rw-r--r--，即所有者有读写权限，其他用户只有读权限
chmod 644 file.txt
```




## 文件内容查看

### [cat](https://www.ibm.com/docs/zh/aix/7.3?topic=c-cat-command)
- 语法：cat [-选项] ｛文件｝
- 说明：显示文件内容

| 选项 |                           说明                           |
|:--:|:------------------------------------------------------:|
| n  |                       显示行号                   |
| r  |                     以一个空行来替代多个连续的空行                     |
| r  |               当 File 参数为目录时允许循环的删除目录及其内容               |


### [tail](https://www.ibm.com/docs/zh/aix/7.3?topic=t-tail-command)
- 语法：tail [-选项] [数字] ｛文件｝
- 说明：显示文件的最后几行

| 选项 |                                  说明                                  |
|:--:|:--------------------------------------------------------------------:|
| n  |                            指定显示末尾N行内容                             |



## 用户

### [useradd](https://www.ibm.com/docs/zh/aix/7.3?topic=u-useradd-command)
- 语法：useradd [-u UID] [-g GID] [-d HOME] [-s] [-c 注释] 用户名
- 说明：添加用户

| 选项 |                                  说明                                  |
|:--:|:--------------------------------------------------------------------:|
| u  |   自定义UID用户编号，不指定系统自动编号 |
| g  |   自定义主组GID组编号或组名，前提是这个组已经存在，若不指定主组系统会创建一个和用户名一样的组作为用户主组 |
| d  |  指定家目录，若不指定默认为/home/用户名 |
| c  |  用户备注信息，若不指定默认为空 |

### [usermod](https://www.ibm.com/docs/zh/aix/7.3?topic=u-usermod-command)
- 语法：usermod [-u UID] [-g GID] [-d HOME] [-s] [-l 新用户名] 用户名
- 说明：修改用户


| 选项 |          说明          |
|:--:|:--------------------:|
| l  |         用户名          |
| u  |        指定用户标识        |
| g  |         标识主组         |
| d  | 将主目录更改为 dir 参数中指定的目录 |
| c  |        用户备注信息        |

### [userdel](https://www.ibm.com/docs/zh/aix/7.3?topic=u-userdel-command)
- 语法：userdel -r 用户名
- 说明：删除用户， -r选项，在删除用户的同时删除其家目录和相关系统邮件

### [su](https://www.ibm.com/docs/zh/aix/7.3?topic=s-su-command)
- 语法：su -用户名
- 说明：切换用户

### [passwd](https://www.ibm.com/docs/zh/aix/7.3?topic=p-passwd-command)
- 语法：passwd
- 说明：修改密码


## Centos 防火墙

```shell
# 启动防火墙
systemctl start firewalld

# 重启防火墙
systemctl restart firewalld

# 关闭防火墙
systemctl stop firewalld

# 查看防火墙状态
systemctl status firewalld
firewall-cmd --state

# 开机启用防火墙
systemctl enable firewalld

# 开机禁用防火墙
systemctl disable firewalld

# 查看规则
firewall-cmd --list-all

# 查看打开的端口
firewall-cmd --zone=public --list-ports

# 更新规则
firewall-cmd --reload
```

