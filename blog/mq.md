# 消息队列

## 协议概括
### 应用场景

1. 跨系统数据传递
2. 高并发的流量削峰
3. 数据的分发和异步处理
4. 大数据的分析与传递
5. 分布式事务
### 网络协议

1. 语法 语法是用户数据与控制信息的结构与格式，以及数据出现的顺序
2. 语义 解释控制信息每个部分的意义，它规定了需要发出何种控制信息以及完成的动作与做出什么样的响应
3. 时序 时序是对事件发生顺序的详细说明

<div class="tip custom-block line">
 消息中间件不采用http协议，而常见的消息中间件协议有：OpenWire、AWQP、MQTT、Kafka、OpenMessage
</div>

::: details 为什么不使用http协议？（面试题）

1. 因为http请求报文头和响应报文头是比较复杂，包含了cookie，数据的加密解密，状态码，响应码等附加的功能但是对于一个消息而言，并不需要这么复杂，也没必要，它其实就是负责数据传递，存储分发就行，保证高性能
2. 大部分情况下http大部分都是短连接，在实际的交互过程中，一个请求到响应很有可能会中断，中断以后就不会持久化，就会造成请求的丢失，这样就不利于消息中间件的业务场景，因为消息中间件可能是一个长期的
   获取消息的过程，出现问题和故障要对数据或消息就行持久化等，目的就是为了保证消息和数据的高可靠和稳建的运行
:::

### AMQP
 Advanced Message Queueing Protocol  高级消息队列协议，由摩根大通集团联合设计，Erlang语言开发

1. 分布式事务支持
2. 消息的持久化支持
3. 高性能和高可靠的消息出来优势
4. 支持者：RabbitMQ、ActiveMQ
### MQTT
Message Queueing Telemetry Transport IBM开发的即时通讯协议，物联网系统架构的组成部分

1. 轻量
2. 结构简单
3. 传输快，不支持事务
4. 没有持久化
5. 适用于计算能力有限，地带宽，网络不稳定的场景
6. 支持者：RabbitMQ、ActiveMQ
### OpenMessage
由阿里、雅虎、滴滴、Stremalio等公司共同参与创建的分布式消息中间件、流处理等领域的应用开发标准

1. 结构简单
2. 解析速度快
3. 支持事务和持久化设计
### Kafka
 基于TCP/IP的二进制协议，消息内部是通过长度来分割，由一些基本数据类型加成

1. 结构简单
2. 解析速度快
3. 无事务支持
4. 有持久化设计

## 消息持久化
简单来说就是将数据存入磁盘，而不是存在内存中随服务器重启断开而消失，使数据能够永久保存

|  | **ActiveMQ** | **RabbitMQ** | **Kafka** | **RocketMQ** |
| --- | --- | --- | --- | --- |
| 文件存储 | 支持 | 支持 | 支持 | 支持 |
| 数据库 | 支持 | / | / | / |

## 消息分发
### 分发策略
MQ消息队列有如下几种角色

1. 生产者
2. 消费者
3. 存储消息

那么生产者生产消息后，MQ进行存储，消费者如何获取消息的呢？一般获取数据的方式无外乎推（push）或者拉取（pull）两种方式，典型的git就有推拉机制

我们发送的http请求就是一种典型的拉取数据库数据返回的过程，而消息队列MQ是一种推送的过程，而这些机制会适用到很多的业务场景也有很多对应推机制策略
### 场景分析 一
![image.png](/doc/mq/img-0.png)
### 场景分析 二
![image.png](/doc/mq/img-1.png)

### 消息分发策略的机制与对比
|  | **AvtiveMQ** | **RabbitMQ** | **Kafka** | **RocketMQ** |
| --- | --- | --- | --- | --- |
| 发布订阅 | 支持 | 支持 | 支持 | 支持 |
| 轮询分发 | 支持 | 支持 | 支持 | / |
| 公平分发 | / | 支持 | 支持 | / |
| 重发 | 支持 | 支持 | / | 支持 |
| 消息拉取 | / | 支持 | 支持 | 支持 |


## 高可用、高可靠
### 集群模式 1 - Master-slave主从共享数据的部署方式

![image.png](/doc/mq/img-2.png)

生产者将消费者发送到Master节点，所有的都连接这个消息队列共享这块数据区域，Master节点负债写入，一旦
Master挂掉，slave节点继续服务，从而形成高可用

### 集群模式 2 - Master-slave主从同步的部署方式

![image.png](/doc/mq/img-3.png)

这种模式写入消息同样在Master主节点上，但是主节点会同步数据到slave节点形成副本，和zookeeper或者redis主从机制很类同，这样可以达到负载均衡的效果，如果消费者有多个这样就可以去不同的节点就行消费，以为消息的拷贝和同步会暂用很大的带宽和网络资源，在后续的rabbtmq中会有使用
### 集群模式 3 - 多主集群同步部署方式

![image.png](/doc/mq/img-4.png)

和上面的区别不是很大，但是它的写入可以往任意节点写入
### 集群模式 4 - 多主集群转发部署方式

![image.png](/doc/mq/img-5.png)

如果你插入的数据是broker-1中，元数据信息会存储数据的相关描述和记录存放的位置（队列）
它会对描述信息也就是元数据信息就行同步，如果消费者在broker-2中进行消费，发现自己几点没有对应的消息，可以从对应的元数据信息中查询，然后返回对应的消息信息，场景：比如买火车票或者黄牛买演唱会门票，比如一个黄牛有顾客说要买的演唱会门票，但是没有但是他会去联系其他的黄牛询问，如果有则返回
### 集群模式 5 - Master-slave与Breoker-cluster组合

![image.png](/doc/mq/img-6.png)

实现多主多从的热备机制来完成消息的高可用以及数据的热备机制，在生产规模达到一定阶段的时候，这种使用的频率比较高

1. 要么消息共享
2. 要么消息同步
3. 要么元数据共享
### 什么是高可靠？
所谓高可用是指系统可以无障碍低持续运行，比如一个系统突然崩溃，报错，异常等等并不影响线上业务的正常运行，出错的几率极低，就称为高可靠
在高并发的场景下，如果不能保证系统的高可靠，那造车的隐患和损失是非常严重的
如何保证中间值消息的可靠性？可以从两方面考虑：

1. 消息的传输：通过协议来保证系统间数据解析的正确性
2. 消息的存储可靠：通过持久化来保证消息的可靠性


## RabbitMQ
[官网](https://www.rabbitmq.com/)  [下载地址](https://www.rabbitmq.com/download.html)

### 安装
环境：CentOS7.x + Erlang

#### [Erlang安装 ](https://www.erlang.-solutions.com/downloads)
查看系统版本号

![image.png](/doc/mq/img-11.png)

```java
// 下载解压
wget https://packages.erlang-solutions.com/erlang-solutions-2.0-1.noarch.rpm
rpm -Uvh erlang-solutions-2.0-1.noarch.rpm

// 安装成功
yum install -y erlang

erl -v
```
版本对照

![image.png](/doc/mq/img-7.png)

#### socat安装
```shell
yum install -y socat
```
#### 解压mq
```shell
rpm -Uvh rabbitmq-server-3.8.13-1.el8.noarch.rpm
yum install rabbitmq -y

// 启动
systemctl start rabbitmq-server
// 查询状态
systemctl status rabbitmq-server
// 设置开机自启动
systemctl enable rabbitmq-server
// 停止服务
systemctl stop rabbitmq-server

// windows 插件
rabbitmq-plugins enable rabbitmq_management
http://localhost:15672/
// 账号密码 
guest
```
# ![image.png](/doc/mq/img-8.png)


#### docker安装
```shell
docker pull rabbitmq:management
# 简单创建 -hostname 容器主机名称 -name 容器名称 -p 映射本地
docker run -di --name=myrabbit -p 15672:15672 rabbitmq:management
# 创建并设置用户
docker run -di --name myrabbit -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=admin -p 15672:15672 -p 5672:5672 -p 25672:25672 -p 61613:61613 -p 1883:1883 rabbitmq:management
# 启动 
docker start id
# 地址 http://42.193.102.182:15672
# 开机自启动
docker update myrabbit --restart=always
```
### 管理界面以及授权
#### 安装
默认情况下，rabbitMQ是没有安装web前端插件，需要安装才能生效 

访问地址：http://localhost:15672/

```shell
rabbitmq-plugins enable rabbitmq_management
# 重启服务
systemctl restart rabbitmq-server
# 默认账号密码
guest 只限本机访问
```
![image.png](/doc/mq/img-9.png)

#### 授权
```shell
# 新增用户
rabbitmqctl add_user admin admin
# 设置权限 超级管理员
rabbitmqctl set_user_tags admin administrator
# 授权资源权限
rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
```
用户级别：

1. administrator 可以登录，查看所有信息，对rabbitmq进行管理
2. monitoring 监控者 登录，查看所有信息
3. pollicymaker 策略制定者 登录控制台，指定策略
4. managment 普通管理员 登录控制台

![image.png](/doc/mq/img-10.png)

#### 其他命令
```shell
rabbitmqctl add_user 账号 密码
rabbitmqctl set_user_tags 账号 administrator
rabbitmqctl change_password username Newpassword  # 修改密码
rabbitmqctl delete_user Username # 删除用户
rabbitmqctl list_users # 用户清单
rabbitmqctl set_permissions -p / 用户名 ".*" ".*" ".*"  # 授权
```

### RabbitMQ的角色分类

1. <span style="color: rgb(83, 29, 171)">None </span> 不能访问management plugin
2. <span style="color: rgb(83, 29, 171)">Management </span>查看自己相关节点信息
   1. 列出自己可以通过AMQP登录的虚拟机
   2. 查看自己的虚拟机节点 virtual hosts的queues，exchanges和bindings信息
   3. 查看和关闭自己的channels和connections
   4. 查看有关自己的虚拟机节点virtual hosts的统计信息 包括其他用户在这个节点virtual hosts中的活动信息
3. <span style="color: rgb(83, 29, 171)">Policymaker </span>
   1. 包含management所以权限
   2. 查看和创建和删除自己的virtual hosts所属的policies和parameters信息
4. <span style="color: rgb(83, 29, 171)">Monitoring </span>
   1. 包含management所以权限
   2. 罗列出所有的virtual hosts 包括不能登录的virtual hosts
   3. 查看其他用户的connection和channels信息
   4. 查看节点级别的数据如clustering和memory使用情况
   5. 查看所有的virtual hosts的全局统计信息
5. <span style="color: rgb(83, 29, 171)">Administrator </span>
   1. 最高权限
   2. 可以创建和删除virtual hosts
   3. 可以查看和删除users
   4. 查看和创建permissions

![image.png](/doc/mq/img-12.png)

### 简单Demo示例
```xml
<!--  java原生依赖   -->
 <dependency>
   <groupId>com.rabbitmq</groupId>
   <artifactId>amqp-client</artifactId>
   <version>5.10.0</version>
</dependency>
<!--  spring依赖   -->
<dependency>
   <groupId>org.springframework.amqp</groupId>
   <artifactId>spring-amqp</artifactId>
   <version>2.2.5.RELEASE</version>
</dependency>
<dependency>
   <groupId>org.springframework.amqp</groupId>
   <artifactId>spring-rabbit</artifactId>
   <version>2.2.5.RELEASE</version>
</dependency>
<!--  springboot依赖   -->
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```
```java
/**
 * 生产者
 */
public class Producer {

    public static void main(String[] args) {

        // 所有的中间件都是基于TCP/IP协议基础上构建，只不过rabbitmq遵循amqp

        // 1 创建连接
        ConnectionFactory connectionFactory =  new ConnectionFactory();
        connectionFactory.setHost("42.193.102.182");
        connectionFactory.setPort(5672);
        connectionFactory.setUsername("admin");
        connectionFactory.setPassword("admin");
        connectionFactory.setVirtualHost("/");
        Connection connection = null;
        Channel channel = null;
        try {
            // 2 创建Connection
            connection = connectionFactory.newConnection("生成者");
            // 3 获取通道Channel
            channel = connection.createChannel();
            // 4 通过通道创建交换机、队列、绑定关系、路由key、发送消息和接收消息
            String queueName = "queue1";

            /**
             * @params1 队列的名字
             * @params2 是否要持久化 消息是否存盘
             * @params3 排他性 是否独占独立
             * @params4 是否自动删除，随着最后一个消费者消息完毕以后是否队列删除
             * @params5 附加参数
             */
            channel.queueDeclare(queueName,false,false,false,null);
            // 5 准备消息
            String message = "Hello world";
            // 6 发送消息给队列
            channel.basicPublish("",queueName,null,message.getBytes());

        } catch (IOException | TimeoutException e) {
            e.printStackTrace();
        } finally {
            // 7 关闭连接
            if (channel != null && channel.isOpen()){
                try {
                    channel.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            // 8 关闭通道
            if (connection != null && connection.isOpen()){
                try {
                    connection.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }


    }
}

/**
 * 消费者
 */
public class Consumer {

    public static void main(String[] args) {

        // 所有的中间件都是基于TCP/IP协议基础上构建，只不过rabbitmq遵循amqp

        // 1 创建连接
        ConnectionFactory connectionFactory =  new ConnectionFactory();
        connectionFactory.setHost("42.193.102.182");
        connectionFactory.setPort(5672);
        connectionFactory.setUsername("admin");
        connectionFactory.setPassword("admin");
        connectionFactory.setVirtualHost("/");
        Connection connection = null;
        Channel channel = null;
        try {
            // 2 创建Connection
            connection = connectionFactory.newConnection("生成者");
            // 3 获取通道Channel
            channel = connection.createChannel();
            // 4 通过通道创建交换机、队列、绑定关系、路由key、发送消息和接收消息
            channel.basicConsume("queue1", true, new DeliverCallback() {
                @Override
                public void handle(String consumerTag, Delivery message) throws IOException {
                    System.out.println("收到的消息是" + new String(message.getBody(), StandardCharsets.UTF_8));
                }
            }, new CancelCallback() {
                @Override
                public void handle(String s) throws IOException {
                    System.out.println("接收失败......");
                }
            });
            System.out.println("开始接收消息");
            System.in.read();
        } catch (IOException | TimeoutException e) {
            e.printStackTrace();
        } finally {
            // 7 关闭连接
            if (channel != null && channel.isOpen()){
                try {
                    channel.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            // 8 关闭通道
            if (connection != null && connection.isOpen()){
                try {
                    connection.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}

```
### AMQP
AMQP生产者流转过程

![image.png](/doc/mq/img-13.png)

消费者流转过程

![image.png](/doc/mq/img-14.png)

### RabbitMQ的核心组成部分
![image.png](/doc/mq/img-15.png)
![image.png](/doc/mq/img-16.png)

- <span style="color: rgb(83, 29, 171)">Server </span>又称Broker，接收客户端的连接，实现AMQP实体服务，按照rabbitmq-server
- <span style="color: rgb(83, 29, 171)">Connection </span>  连接，应用程序与Broker的网络连接 TCP/IP 三次握手和四次握手
- <span style="color: rgb(83, 29, 171)">Channl </span> 网络通道，几乎所有的操作都在Channel中进行，Channel是进行消息读写的通道，客户端可以建立对

各Channel，每个Channel代表一个会话任务

- Message 消息，服务与应用程序之间传递的数据，由Properties和body组成，Properties可是对消息进行修饰

  比较消息的优先级，延迟等高特性，Body则就是消息实体的内容

- Virtual Host 虚拟地址，用户进行逻辑隔离，最上层的消息路由，一个虚拟主机理由可以有若干个 Exchange和

Queueu，同一个虚拟主机里面不能有相同名字的 Exchange

- <span style="color: rgb(83, 29, 171)">Exchange </span> 交换机，接收消息，根据路由键发送消息到绑定的队列（不具备消息存储的功能）
- <span style="color: rgb(83, 29, 171)">Bindings </span> Exchange和Queue之间的虚拟连接，bingding中可以保护多个routing key
- <span style="color: rgb(83, 29, 171)">Routing key </span> 是一个路由规则，虚拟机可以用它来确定如何路由一个特定消息
- <span style="color: rgb(83, 29, 171)">Queue </span> 队列，也成为Messgae Queue消息队列，保存消息并将它们转发给消费者

### 消息模式
[官方文档](https://rabbitmq.com/getstarted.html)

简单模式 Simple，参考上述的demo示例



工作模式 Work

![image.png](/doc/mq/img-17.png)

发布订阅模式 Fanout

![image.png](/doc/mq/img-18.png)

路由模式 direct

![image.png](/doc/mq/img-19.png)

主题模式 Topic

![image.png](/doc/mq/img-20.png)

参数模式 Headers

RPC模式  

### 应用场景

#### 解耦、削峰、异步

1- 同步异步的问题（串行）

:::tip 串行方式
将订单信息写入数据库成功后，发送注册邮件，再发送注册短信，以上三个任务全部完成后返回客户端
:::
![image.png](/doc/mq/img-21.png)

```java
public void makerOrder() {
	// 1 保存订单
  orderService.saveOrder();
  // 2 发送短信服务
  messageService.sendSMS("oreder");
  // 3 发送邮件
  emailService.sendEmail("oreder");
  // 4 发送APP服务
  appService.sendApp("order");
}
```
2- 并行方式 异步线程池

![image.png](/doc/mq/img-22.png)
```java
public void makeOrder(){

	// 保存订单
  orderService.saveOrder();
  // 相关发送
  ralationMessage();
}

public void relationMessage(){
	// 异步
  theadpool.submit(new Callable<Object>{
  		public Object call(){
      	// 发送短信
        messageService.sendSMS("oreder");
      }
  })
  // 异步
  theadpool.submit(new Callable<Object>{
  		public Object call(){
      	// 发送邮件
        emailService.sendEmail("oreder");
      }
  })
  // 异步
  theadpool.submit(new Callable<Object>{
  		public Object call(){
      	// 发送短信
        messageService.sendSMS("oreder");
      }
  })
  // 异步
  theadpool.submit(new Callable<Object>{
  		public Object call(){
      	// 发送APP服务
  			appService.sendApp("order");
      }
  })
}
```
存在问题 ：

- 耦合度高
- 需要自己写线程自己维护成本高
- 出现了消息可能会丢失，需要你自己做消息补偿
- 如何保证消息的可靠性自己写
- 如果服务器承载不了，需要自己去写高可用

3- 异步消息队列

![image.png](/doc/mq/img-23.png)

好处

- 完全解耦，用MQ建立桥接
- 有独立的线程池和运行模型
- 出现了消息可能丢失，MQ有持久化
- 如何保证消息的可靠性，死信队列和消息转移等
- 如果服务器承载不了，你需要自己去写高可用，HA镜像模型高可用

#### 高内聚、低耦合
![image.png](/doc/mq/img-24.png)

#### 其他应用

- 流量削峰
- 分布式事务的可靠消费和可靠生成
- 索引、缓存、静态化处理的数据同步
- 流量监控
- 日志监控 ELK
- 下单、订单分发、抢票

### SpringBoot 案例

#### fanout模式
```java
@Configuration
public class RabbitMqConfig {

    // 声明注册fanout模式交换机
    @Bean
    public FanoutExchange fanoutExchange(){
        return new FanoutExchange("fanout_order_exchange",true,false);
    }

    // 声明队列 sms
    @Bean
    public Queue smsQueue(){
        return new Queue("sms.fanout.queue",true);
    }

    // 绑定关系
    @Bean
    public Binding smsBinding(){
        return  BindingBuilder.bind(smsQueue()).to(fanoutExchange());
    }
}
```
```java
@Autowired
private RabbitTemplate rabbitTemplate;

// 参数1 交换机 参数2 路由key、queue名称 参数3 消息内容
String exchangeName = "fanout_order_exchange";
String routeKey = "";
rabbitTemplate.convertAndSend(exchangeName,routeKey,orderId);

@Component
@RabbitListener(queues = {"sms.fanout.queue"})
public class ConsumerService {

    @RabbitHandler
    public void receiveMessage(String message){
        System.out.println("短信接收 ---->" + message );
    }
}
```
#### direct模式
```java
// 声明注册fanout模式交换机
@Bean
public DirectExchange directExchange(){
    return new DirectExchange("direct_order_exchange",true,false);
}

// 声明队列 sms
@Bean
public Queue smsQueue(){
    return new Queue("sms.direct.queue",true);
}

// 绑定关系
@Bean
public Binding smsBinding(){
    return  BindingBuilder.bind(smsQueue()).to(directExchange()).with("sms");
}
```
```java
// 参数1 交换机 参数2 路由key、queue名称 参数3 消息内容
String exchangeName = "direct_order_exchange";
String routeKey = "sms";
rabbitTemplate.convertAndSend(exchangeName,routeKey,orderId);

@Component
@RabbitListener(queues = {"sms.direct.queue"})
public class ConsumerService {

    @RabbitHandler
    public void receiveMessage(String message){
        System.out.println("短信接收 ---->" + message );
    }
}
```
#### topic模式
```java
@Component
@RabbitListener(bindings = @QueueBinding(
        value = @Queue(value = "sms.topic.queue",durable = "true",autoDelete = "false"),
        exchange = @Exchange(value = "topic_order_exchange" , type = ExchangeTypes.TOPIC),
        key = "#.sms.#"
))
public class ConsumerService {

    @RabbitHandler
    public void receiveMessage(String message){
        System.out.println("短信接收 ---->" + message );
    }

}
```

```java
// 参数1 交换机 参数2 路由key、queue名称 参数3 消息内容
String exchangeName = "topic_order_exchange";
// #.sms.#
String routeKey = "com.sms";
rabbitTemplate.convertAndSend(exchangeName,routeKey,orderId);
```

### 高级应用

#### 过期时间 TTL

过期时间TTL表示可以对消息设置预期时间，在这个时间内都可以被消费者接收获取，过了之后消息将自动删除，
RabbitMQ可以对 消息队列 设置TTL，目前有两种方法可以设置


- 通过队列属性设置，队列中所以消息都有相同的过期时间
- 对消息进行单独设置，每条消息TTL可不同

如果上述两种方式同时使用，则消息的过期时间以两者之间TTL较小的数值为准，消息在队列的生成时间一旦超过设置的TTL值，就称为dead message被投递到死信队列，消费者将吴凡再收到消息

设置队列TTL

```java
// 对队列设置过期时间
// 设置过期时间 5秒
Map<String,Object> args = new HashMap<>();
args.put("x-message-ttl",5000);
return new Queue("ttl.direct.queue",true,false,false,args);
```
```java
// 给单独一条消息设置过期时间
String exchangeName = "ttl_direct_order_exchange";
String routeKey = "ttl";
// 设置过期时间
MessagePostProcessor processor = new MessagePostProcessor() {
    @Override
    public Message postProcessMessage(Message message) throws AmqpException {
        message.getMessageProperties().setExpiration("5000");
        message.getMessageProperties().setContentEncoding("UTF-8");
        return message;
    }
};
rabbitTemplate.convertAndSend(exchangeName,routeKey,"",processor);
```

#### 死信队列

DLX，全称 Dead-Letter-Exchange ，可以称为死信交换机，当消息在一个队列中变成死信之后，它能被重新发送到另一个交换机中，这个交换机接收DLX，绑定DLX的队列就称为死信队列

- 消息被拒绝
- 消息过期
- 队列达到最大长度

DLX也是一个正常的交换机，它能在任何的队列上被指定，实际上就是设置某一个队列的属性，当这个队列存在死信的时候，RabbitMQ就会自己讲这个消息重新发布到设置的DLX上，进而被路由到另一个队列，即死信队列
要想使用死信队列，只需要在定义队列的时候设置队列参数， x-dead-letter-exchange 指定交换机即可

```java 
// 声明注册死信交换机
@Bean
public DirectExchange DLXExchange(){
    return new DirectExchange("dead_direct_order_exchange",true,false);
}

// 声明死信队列 sms
@Bean
public Queue smsQueue(){
    return new Queue("dead.direct.queue",true);
}

// 绑定关系
@Bean
public Binding dxlBinding(){
    return  BindingBuilder.bind(smsQueue()).to(DLXExchange()).with("dxl");
}
```
```java
// 设置过期时间 5秒
Map<String,Object> args = new HashMap<>();
args.put("x-message-ttl",5000);
args.put("x-mxa-length",1);
// 指定死信队列
args.put("x-dead-letter-exchange","dead_direct_order_exchange");
// fanout 模式是没有的
args.put("x-dead-letter-routing-key","dxl");
return new Queue("ttl.direct.queue",true,false,false,args);
```

#### 磁盘监控

内存警告

当内存使用超过配置的阀值或者磁盘空间剩余空间对于配置的阀值时，会暂时堵塞客户端的连接，并且停止接收从客户端发来的消息，以此避免服务器的崩溃，客户端与服务端的心态检测机制也会失效

![image.png](/doc/mq/img-25.png)
![image.png](/doc/mq/img-26.png)

内存的控制
 [参考文档](https://rabbitmq.com/config.html)

```shell
# 命令 两种方式
rabbitmqctl set_vm_memory_high_watermark <fraction>
rabbitmqctl set_vm_memory_high_watermark absolute 50MB
```
fraction/value 为内存阀值，默认情况是：0.4/2GB，代表当内存超过40%的时候，就会产生警告并且堵塞所以生产者的连接，通过命令修改阀值在Broker重启以后将会失效，通过修改配置文件方式设置的阀值则不会随着重启而消失，但修改了配置文件一样要重启broker才会生效

使用配置文件进行控制
> /etc/rabbitmq/rabbitmq.conf

```shell
# 默认
# vm_memory_high_watermark.relative = 0.4
# 使用relative相对值进行设置fraction，建议取值在0.4~0.7之间，不建议超过0.7
vm_memory_high_watermark.relative = 0.6
# 使用absolute的绝对值的方式，但是是KB、MB、GB对应的命令如下
vm_memory_high_watermark.absolute = 2GB
```
内存换页
磁盘预警

当磁盘的剩余空间低于确定的阀值时，RabbitMQ同样会堵塞生产者，这样可以避免因非持久化的消息持续换页而耗尽磁盘空间导致服务器崩溃

:::tip  提示
默认情况下，磁盘预警为50MB的时候会进行预警，堵塞生产者，这个阀值可以减小，但是不能完全的消除因磁盘耗尽而导致崩溃的可能性，比如在两次磁盘空间的检查空隙内，第一次检查是 60MB，第二次检查可能就是1MB，就会出现警告
:::

```shell
rabbitmqctl set_disk_free_limit <disk_limit>
rabbitmqctl set_disk_free_limit_memory_limit <fraction>

disk_limit： 固定单位 KM MB GB
fraction: 是相对阀值，建议范围在: 1.0~2.0之间 （相对于内存）
```
通过配置文件配置如下:
```shell
disk_free_limit.relative = 3.0
disk_free_limit.absolute = 50mb
```

### 集群搭建

配置前提是你的rabbitmq可以运行起来，比如"ps aux|grep rabbitmq" 你能看到相关过程，又比如运行"rabbitmqctl status" 你可以看到类似如下信息，而不报错

```shell
ps aux|grep rabbitmq
# 或者使用
systemctl status rabbitmq-server
```
![image.png](/doc/mq/img-27.png)

:::warning 注意
确保RabbitMQ可以运行，把单机版MQ服务停止
:::

#### 单机多实例搭建

- 场景：假如有两个mq节点，分别为rabit-1、rabbit-2，rabbit-1为主节点，rabbit-2为从节点
- 启动命令： RABBITMQ_NODE_PORT=5672 RABBIYMQ_NODENAME=rabbit-1 rabbitmq-server -detached
- 结束命令： rabbitmqctl -n rabbit-1 stop

第一步 启动第一个节点
```shell
	>sudo RABBITMQ_NODE_PORT=5672 RABBIYMQ_NODENAME=rabbit-1 rabbitmq-server start &
  
  ----------省略---------
  ######## Logs: /var/log/rabbitmq/rabbit-1.log
  #####  #       /var/log/rabbitmq/rabbit-1-sasl.log
  ########
  				 Starting broker...
  completed with 7 plugins.
```
第二步 启动第二个节点
```shell
>sudo RABBITMQ_NODE_PORT=5672 RABBIYMQ_SERVER_ARGS="-rabbitmq_management listener[{port,15673}]" RABBITMQ_NODENAME=rabbit-2 rabbitmq-server start &
  
  ----------省略---------
  ######## Logs: /var/log/rabbitmq/rabbit-2.log
  #####  #       /var/log/rabbitmq/rabbit-2-sasl.log
  ########
  				 Starting broker...
  completed with 7 plugins.
```
第三步 验证启动
```shell
ps aux|grep rabbitmq
```
第四步 rabbit-1作为主节点
```shell
# 停止服务
> sudo rabbitmqctl -n rabbit-1 stop_app
# 目的是清除节点上的历史数据(如果不清楚，无法将节点加入到集群)
> sudo rabbitmqctl -n rabbit-1 reset
# 启动应用
> sudo rabbitmqctl -n rabbit-1 start_app
```
第五步 rabbit-2作为从节点
```shell
# 停止服务
> sudo rabbitmqctl -n rabbit-2 stop_app
# 目的是清除节点上的历史数据(如果不清楚，无法将节点加入到集群)
> sudo rabbitmqctl -n rabbit-2 reset
# 将rabbit-2节点加入到主节点集群当中(Server-node 为主机名称)
> sudo rabbitmqctl -n rabbit-2 join_cluster rabbit-1@'Server-node'
# 启动应用
> sudo rabbitmqctl -n rabbit-2 start_app
```
![image.png](/doc/mq/img-28.png)

第六步 验证
```shell
sudo rabbitmqctl cluster_status -n rabbit-1
```
![image.png](/doc/mq/img-29.png)

![image.png](/doc/mq/img-30.png)

第七步 WEB监控
```shell
rabbitmq-plugins enable rabbitmq_management
```
![image.png](/doc/mq/img-31.png)

#### 小结
如果采用多级部署方式，需读取其他一个节点的cookie，并负责到其他节点（节点之间通过cookie确定相互是否可通信）cookie存放在/var/lib/rabbitmq/.erlang.cookie
例如: 主机名为rabbit-1、rabbit-2

- 逐个启动各节点
- 配置各节点的hosts文件(vim/etc/hosts)
   - ip1：rabbit-1
   - ip2：rabbit-2
- 其他步骤相同
### 分布式事务

![image.png](/doc/mq/img-32.png)

![image.png](/doc/mq/img-33.png)

![image.png](/doc/mq/img-34.png)

![image.png](/doc/mq/img-35.png)

![image.png](/doc/mq/img-36.png)

![image.png](/doc/mq/img-37.png)

![image.png](/doc/mq/img-38.png)