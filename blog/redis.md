---
outline: deep
---
# Redis 学习文档


[Redis](https://github.com/MicrosoftArchive/redis/releases) 支持数据持久化，可以将内存中的数据保存在磁盘中，重启的时候可以再次加载进行使用。
不仅仅支持简单的 key - value 类型的数据，同时还提供 list，set，zset，hash 等数据结构的存储，支持数据的备份，即 master - slave 模式的数据备份

性能极高：Redis 读的速度是 110000 次 /s, 写的速度是 81000 次 /s

数据类型：Redis 支持二进制案例的 Strings, Lists, Hashes, Sets 及 Ordered Sets 数据类型操作

原子性：Redis 的所有操作都是原子性的，意思就是要么成功执行要么失败完全不执行，单个操作是原子性的，多个操作也支持事务，即原子性，通过 MULTI 和 EXEC 指令包起来

其他特性：Redis 还支持 publish/subscribe 通知，key 过期等特性


## redis基本命令
```shell
set key value        # 存储key
get key              # 查询key
dbsize		         # 查看库的大小
select index         # 开打库
keys *		         # 查看库的所有key
flusdb		         # 清空库
flusall		         # 清空所有库
EXISTS key	         # 查看是否存在
move key 1	         # 移除当前数据库的key
expire key 10	     # 设置过期时间(秒)，到期自动清除
ttl	key			     # 查看剩余时间
type key		     # 查看数据类型
append key value     # 往这个key的value后面进行追加
strlen	key		     # 查看字符串的长度
incr key		     # 自增加一
decr key		     # 自动减一
incrby key 10	     # 设置步长，指定增量
decrby key 5         # 设置减量
getrange key 0 3     # 截取字符串，从0到3
getrange key 0 -1    # 截取所有的字符串
setrange key 1 "x"   # 从1开始替换
setex key 30 "hello" # 如果key不存在，创建，存在创建失败
mset k1 v1 k2 v2     # 批量添加
mget k1 k2		     # 批量获取
msetnx k1 v1 k2 v2   # 要么一起成功要么一起失败
mgetnx k1 k2         # 获得多个value
getset db redis      # 先get再set

```
## 数据类型
### String
string 是 redis 最基本的数据类型。一个 key 对应一个 value
string 是二进制安全的。也就是说 redis 的 string 可以包含任何数据。比如 jpg 图片或者序列化的对象
string 类型是 redis 最基本的数据类型，string 类型的值最大能存储 512 MB
**理解：**string 就像是 java 中的 map 一样，一个 key 对应一个 value
![](/doc/redis/img-7.png)

![](/doc/redis/img-8.png)

NX：当数据库中key不存在时，可以将key-value添加数据库（可用作锁）
XX：当数据库中key存在时，可以将key-value添加数据库，与NX参数互斥
EX：key的超时秒数
PX：key的超时毫秒数，与EX互斥
```shell
 # 添加键值对
set <key><value>

# 查询对应键值
get <key> 

# 将给定的<value> 追加到原值的末尾 
append <key><value>

# 获得值的长度 
strlen <key>

# 只有在 key 不存在时设置 key 的值，作为锁使用，后续会介绍
setnx <key><value> 

# 将 key 中储存的数字值增1
# 只能对数字值操作，如果为空，新增值为1
incr  <key>

# 将 key 中储存的数字值减1
# 只能对数字值操作，如果为空，新增值为-1
decr  <key>

# 将 key 中储存的数字值增减。自定义步长。
incrby / decrby  <key><步长>

# 同时设置一个或多个 key-value对  
mset  <key1><value1><key2><value2>  ..... 

# 同时获取一个或多个 value  
mget  <key1><key2><key3> .....

# 同时设置一个或多个 key-value 对，当且仅当所有给定 key 都不存在
msetnx <key1><value1><key2><value2>  ..... 
```
:::tip 数据结构
String的数据结构为简单动态字符串(Simple Dynamic String,缩写SDS)。是可以修改的字符串，内部结构实现上类似于Java的ArrayList，采用预分配冗余空间的方式来减少内存的频繁分配
:::
![](/doc/redis/img-9.png)

如图中所示，内部为当前字符串实际分配的空间capacity一般要高于实际字符串长度len。当字符串长度小于1M时，扩容都是加倍现有的空间，如果超过1M，扩容时一次只会多扩1M的空间。需要注意的是字符串最大长度为512M。

### Hash
hash 是一个键值对集合，是一个string类型的field和value的映射表，hash特别适合用于存储对象类似Java里面的 Map<String,Object>

![](/doc/redis/img-0.png)
![](/doc/redis/img-4.png)

```shell
# 给<key>集合中的 <field>键赋值<value>
hset <key><field><value>

# 从<key1>集合<field>取出 value 
hget <key1><field>

# 批量设置hash的值
hmset <key1><field1><value1><field2><value2>... 

# 查看哈希表 key 中，给定域 field 是否存在
hexists<key1><field>

# 列出该hash集合的所有field
hkeys <key>

# 列出该hash集合的所有value
hvals <key>

# 为哈希表 key 中的域 field 的值加上增量 1   -1
hincrby <key><field><increment>

# 将哈希表 key 中的域 field 的值设置为 value ，当且仅当域 field 不存在
hsetnx <key><field><value>
```
### List
单键多值

Redis 列表是简单的字符串列表，按照插入顺序排序。你可以添加一个元素到列表的头部（左边）或者尾部（右边）

它的底层实际是个双向链表，对两端的操作性能很高，通过索引下标的操作中间的节点性能会较差

```shell
# 从左边/右边插入一个或多个值
lpush/rpush  <key><value1><value2><value3> .... 

# 从左边/右边吐出一个值。值在键在，值光键亡
lpop/rpop  <key>

# 列表右边吐出一个值，插到<key2>列表左边
rpoplpush  <key1><key2>从<key1>

# 左边插入类似于头插法，右边插入类似于尾插法
lrange <key><start><stop>

# 按照索引下标获得元素(从左到右) 0 左边第一个，-1右边第一个，（0-1表示获取所有）
lrange mylist 0 -1 

# 按照索引下标获得元素(从左到右)  
lindex <key><index>

# 获得列表长度 
llen <key>

# 在<value>的后面插入<newvalue>插入值
linsert <key>  before <value><newvalue>

# 从左边删除n个value(从左到右)
lrem <key><n><value>

# 将列表key下标为index的值替换成value
lset<key><index><value>
```
我们可以看出 list 就是一个简单的字符串集合，和 Java 中的 list 相差不大，区别就是这里的 list 存放的是字符串。list 内的元素是可重复的。

:::tip 数据结构
List的数据结构为快速链表quickList。首先在列表元素较少的情况下会使用一块连续的内存存储，这个结构是ziplist，也即是压缩列表。
它将所有的元素紧挨着一起存储，分配的是一块连续的内存。当数据量比较多的时候才会改成quicklist
:::
![](/doc/redis/img-1.png)

### Set
redis 的 set 是字符串类型的无序集合。集合是通过哈希表实现的，因此添加、删除、查找的复杂度都是 0（1）

![](/doc/redis/img-2.png)

```shell
# 将一个或多个 member 元素加入到集合 key 中，已经存在的 member 元素将被忽略
sadd <key><value1><value2> ..... 

# 取出该集合的所有值
smembers <key>

# 判断集合<key>是否为含有该<value>值，有1，没有0
sismember <key><value>

# 返回该集合的元素个数
scard<key>

# 删除集合中的某个元素
srem <key><value1><value2> .... 

# 随机从该集合中吐出一个值
spop <key>

# 随机从该集合中取出n个值。不会从集合中删除
srandmember <key><n>

# 把集合中一个值从一个集合移动到另一个集合
smove <source><destination>value

# 返回两个集合的交集元素
sinter <key1><key2>

# 返回两个集合的并集元素
sunion <key1><key2>

# 返回两个集合的差集元素(key1中的，不包含key2中的)
sdiff <key1><key2>
```
:::tip 数据结构
数据结构是dict字典，字典是用哈希表实现的，Java中HashSet的内部实现使用的是HashMap，只不过所有的value都指向同一个对象。Redis的set结构也是一样，它的内部也使用hash结构，所有的value都指向同一个内部值

redis 的 set 与 java 中的 set 的区别在于 redis 的 set 是一个 key 对应着 多个字符串类型的 value，也是一个字符串类型的集合
但是和 redis 的 list 不同的是 set 中的字符串集合元素不能重复，但是 list 可以
:::

### ZSet
Redis有序集合zset与普通集合set非常相似，是一个没有重复元素的字符串集合

不同之处是有序集合的每个成员都关联了一个评分（score），这个评分（score）被用来按照从最低分到最高分的方式排序集合中的成员，集合的成员是唯一的，但是评分可以是重复了

因为元素是有序的, 所以你也可以很快的根据评分（score）或者次序（position）来获取一个范围的元素

访问有序集合的中间元素也是非常快的,因此你能够使用有序集合作为一个没有重复成员的智能列表

![](/doc/redis/img-2.png)
```shell
# 将一个或多个 member 元素及其 score 值加入到有序集 key 当中
zadd  <key><score1><value1><score2><value2>

# 返回有序集 key 中，下标在<start><stop>之间的元素
# 带WITHSCORES，可以让分数一起和值返回到结果集
zrange <key><start><stop>  [WITHSCORES]   

# 返回有序集 key 中，所有 score 值介于 min 和 max 之间(包括等于 min 或 max )的成员
# 有序集成员按 score 值递增(从小到大)次序排列 
zrangebyscore key minmax [withscores] [limit offset count]

# 同上，改为从大到小排列
zrevrangebyscore key maxmin [withscores] [limit offset count]               

# 为元素的score加上增量
zincrby <key><increment><value>

# 删除该集合下，指定值的元素 
zrem  <key><value>

# 统计该集合，分数区间内的元素个数
zcount <key><min><max>

 # 返回该值在集合中的排名，从0开始
zrank <key><value>
```

### Bitmaps
现代计算机用二进制（位） 作为信息的基础单位， 1个字节等于8位， 例如“abc”字符串是由3个字节组成，共24位存储空间。

Redis提供了Bitmaps这个“数据类型”可以实现对位的操作：
（1）Bitmaps本身不是一种数据类型， 实际上它就是字符串（key-value） ， 但是它可以对字符串的位进行操作。
（2）Bitmaps单独提供了一套命令， 所以在Redis中使用Bitmaps和使用字符串的方法不太相同。 可以把Bitmaps想象成一个以位为单位的数组， 数组的每个单元只能存储0和1， 数组的下标在Bitmaps中叫做偏移量。
![](/doc/redis/img-5.png)

```shell
# 设置Bitmaps中某个偏移量的值（0或1）
setbit <key> <offset> <value>
```

每个独立用户是否访问过网站存放在Bitmaps中， 将访问的用户记做1， 没有访问的用户记做0， 用偏移量作为用户的id。

设置键的第offset个位的值（从0算起），假设现在有20个用户，userid=1，6，11，15，19的用户对网站进行了访问，那么当前Bitmaps初始化结果如图

![](/doc/redis/img-6.png)

::: warning 注意
很多应用的用户id以一个指定数字（例如10000） 开头，直接将用户id和Bitmaps的偏移量对应势必会造成一定的浪费，通常的做法是每次做setbit操作时将用户id减去这个指定数字。
在第一次初始化Bitmaps时，假如偏移量非常大，那么整个初始化过程执行会比较慢，可能会造成Redis的阻塞
:::


```shell
# 获取Bitmaps中某个偏移量的值
getbit <key> <offset>
```
可以用来获取id=8的用户是否当天访问过

```shell
bitcount <key> [start end]
```

bitcount，统计字符串被设置为1的bit数。一般情况下，给定的整个字符串都会被进行计数，通过指定额外的 start 或 end 参数，可以让计数只在特定的位上进行。start 和 end 参数的设置，都可以使用负数值：比如 -1 表示最后一个位，而 -2 表示倒数第二个位，start、end 是指bit组的字节的下标数，二者皆包含

```shell
bitop  and(or/not/xor) <destkey> [key…]
```

bitop是一个复合操作， 它可以做多个Bitmaps的and（交集） 、 or（并集） 、 not（非） 、 xor（异或） 操作并将结果保存在destkey中。

### HyperLogLog

在工作当中，我们经常会遇到与统计相关的功能需求，比如统计网站PV（PageView页面访问量）,可以使用Redis的incr、incrby轻松实现。
但像UV（UniqueVisitor，独立访客）、独立IP数、搜索记录数等需要去重和计数的问题如何解决？这种求集合中不重复元素个数的问题称为基数问题。
解决基数问题有很多种方案：

1. 数据存储在MySQL表中，使用distinct count计算不重复个数
2. 使用Redis提供的hash、set、bitmaps等数据结构来处理

以上的方案结果精确，但随着数据不断增加，导致占用空间越来越大，对于非常大的数据集是不切实际的。
能否能够降低一定的精度来平衡存储空间？Redis推出了HyperLogLog

Redis HyperLogLog 是用来做基数统计的算法，HyperLogLog 的优点是，在输入元素的数量或者体积非常非常大时，计算基数所需的空间总是固定的、并且是很小的

在 Redis 里面，每个 HyperLogLog 键只需要花费 12 KB 内存，就可以计算接近 2^64 个不同元素的基数。这和计算基数时，元素越多耗费内存就越多的集合形成鲜明对比

但是，因为 HyperLogLog 只会根据输入元素来计算基数，而不会储存输入元素本身，所以 HyperLogLog 不能像集合那样，返回输入的各个元素

什么是基数?
比如数据集 {1, 3, 5, 7, 5, 7, 8}， 那么这个数据集的基数集为 {1, 3, 5 ,7, 8}, 基数(不重复元素)为5。 基数估计就是在误差可接受的范围内，快速计算基数

```shell
# 添加指定元素到 HyperLogLog 中
pfadd <key> <element> [element ...]   

# 将一个或多个HLL合并后的结果存储在另一个HLL中
pfmerge <destkey> <sourcekey> [sourcekey ...]  
```

### Geospatial
Redis 3.2 中增加了对GEO类型的支持。GEO，Geographic，地理信息的缩写。该类型，就是元素的2维坐标，在地图上就是经纬度。redis基于该类型，提供了经纬度设置，查询，范围查询，距离查询，经纬度Hash等常见操作。

```shell
# 添加地理位置（经度，纬度，名称）
geoadd <key> <longitude> <latitude> <member> [longitude latitude member...]   

```
![](/doc/redis/img-10.png)

```shell
# 获得指定地区的坐标值
geopos <key> <member> [member...]  
```
![](/doc/redis/img-11.png)
```shell
# 获取两个位置之间的直线距离
geodist<key><member1><member2>  [m|km|ft|mi ]  
```
![](/doc/redis/img-12.png)


## 配置文件
```shell
# Redis默认不是以守护进程的方式运行，可以通过该配置项修改，使用 yes 启用守护进程
daemonize yes

# 当Redis以守护进程方式运行时
# Redis默认会把pid写入/var/run/redis.pid文件，可以通过 pidfile 指定
pidfile /var/run/redis.pid

# 指定Redis监听端口，默认端口为6379
port 6379

# 绑定的主机地址
bind 127.0.0.1

# 当客户端闲置多长时间后关闭连接，如果指定为0，表示关闭该功能
timeout 300

# 指定日志记录级别，Redis总共支持四个级别：debug、verbose、notice、warning，默认为verbose
loglevel verbose

# 日志记录方式，默认为标准输出，如果配置Redis为守护进程方式运行，而这里又配置为日志记录方式为标准输出，则日志将会发送给/dev/null
logfile stdout

# 设置数据库的数量，默认数据库为0，可以使用SELECT 命令在连接上指定数据库id
databases 16

#指定在多长时间内，有多少次更新操作，就将数据同步到数据文件，可以多个条件配合
save seconds changes

# 默认配置文件中提供了三个条件：
Redis
save 900 1
save 300 10
save 60 10000
# 分别表示900秒（15分钟）内有1个更改，300秒（5分钟）内有10个更改以及60秒内有10000个更改

# 指定存储至本地数据库时是否压缩数据
# 默认为yes，Redis采用LZF压缩，如果为了节省CPU时间，可以关闭该选项，但会导致数据库文件变的巨大
rdbcompression yes

# 指定本地数据库文件名，默认值为dump.rdb
dbfilename dump.rdb

# 指定本地数据库存放目录
dir ./

# 设置当本机为slav服务时，设置master服务的IP地址及端口
# 在Redis启动时，它会自动从master进行数据同步
slaveof <masterip> <masterport>

# 当master服务设置了密码保护时，slav服务连接master的密码
masterauth <master-password>

# 设置Redis连接密码，如果配置了连接密码
# 客户端在连接Redis时需要通过AUTH <password>命令提供密码，默认关闭
requirepass foobared

# 设置同一时间最大客户端连接数，默认无限制
# Redis可以同时打开的客户端连接数为Redis进程可以打开的最大文件描述符数
# 如果设置 maxclients 0，表示不作限制
# 当客户端连接数到达限制时
# Redis会关闭新的连接并向客户端返回 max number of clients reached 错误信息
maxclients 128

# 指定Redis最大内存限制，Redis在启动时会把数据加载到内存中，达到最大内存后
# Redis会先尝试清除已到期或即将到期的Key，当此方法处理后，仍然到达最大内存设置
# 将无法再进行写入操作，但仍然可以进行读取操作
# Redis新的vm机制，会把Key存放内存，Value会存放在swap区
maxmemory <bytes>

# 指定是否在每次更新操作后进行日志记录，Redis在默认情况下是异步的把数据写入磁盘
# 如果不开启，可能会在断电时导致一段时间内的数据丢失
# 因为 redis本身同步数据文件是按上面save条件来同步的 
# 所以有的数据会在一段时间内只存在于内存中 默认为 no
appendonly no

# 指定更新日志文件名，默认为appendonly.aof
appendfilename appendonly.aof

# 指定更新日志条件，共有3个可选值：
# no：表示等操作系统进行数据缓存同步到磁盘（快）
# always：表示每次更新操作后手动调用fsync()将数据写到磁盘（慢，安全）
# everysec：表示每秒同步一次（折衷，默认值）
appendfsync everysec

# 指定是否启用虚拟内存机制，默认值为no
# 简单的介绍一下，VM机制将数据分页存放，由Redis将访问量较少的页即冷数据swap到磁盘上
# 访问多的页面由磁盘自动换出到内存中（在后面的文章我会仔细分析Redis的VM机制）
vm-enabled no

# 虚拟内存文件路径，默认值为/tmp/redis.swap，不可多个Redis实例共享
vm-swap-file /tmp/redis.swap

# 将所有大于vm-max-memory的数据存入虚拟内存,无论vm-max-memory设置多小
# 所有索引数据都是内存存储的(Redis的索引数据 就是keys)
# 也就是说,当vm-max-memory设置为0的时候,其实是所有value都存在于磁盘 默认值为 0
vm-max-memory 0

# Redis swap文件分成了很多的page，一个对象可以保存在多个page上面
# 但一个page上不能被多个对象共享，vm-page-size是要根据存储的 数据大小来设定的
# 作者建议如果存储很多小对象，page大小最好设置为32或者64bytes
# 如果存储很大大对象，则可以使用更大的page，如果不确定，就使用默认值
vm-page-size 32

# 设置swap文件中的page数量，由于页表（一种表示页面空闲或使用的bitmap）是在放在内存中的
# 在磁盘上每8个pages将消耗1byte的内存
vm-pages 134217728

# 设置访问swap文件的线程数，最好不要超过机器的核数
# 如果设置为 0，那么所有对swap文件的操作都是串行的，可能会造成比较长时间的延迟
vm-max-threads 4

# 设置在向客户端应答时，是否把较小的包合并为一个包发送，默认为开启
glueoutputbuf yes

# 指定在超过一定的数量或者最大的元素超过某一临界值时，采用一种特殊的哈希算法
hash-max-zipmap-entries 64
hash-max-zipmap-value 512

# 指定是否激活重置哈希，默认为开启（后面在介绍Redis的哈希算法时具体介绍）
activerehashing yes

# 指定包含其它的配置文件，可以在同一主机上多个Redis实例之间使用同一份配置文件
# 而同时各个实例又拥有自己的特定配置文件
include /path/to/local.conf
```

## 事务-锁机制实现
　redis 事务一次可以执行多条命令，服务器在执行命令期间，不会去执行其他客户端的命令请求。事务中的多条命令被一次性发送给服务器，而不是一条一条地发送，这种方式被称为流水线，它可以减少客户端与服务器之间的网络通信次数从而提升性能。

　　Redis 最简单的事务实现方式是使用 MULTI 和 EXEC 命令将事务操作包围起来。批量操作在发送 EXEC 命令前被放入队列缓存。收到 EXEC 命令后进入事务执行，事务中任意命令执行失败，其余命令依然被执行。也就是说 Redis 事务不保证原子性。在事务执行过程中，其他客户端提交的命令请求不会插入到事务执行命令序列中。

一个事务从开始到执行会经历以下三个阶段：

- 开始事务  
- 命令入队
- 执行事务
```shell
# 开启事务
127.0.0.1:6379>multi
OK
# 命令入队
127.0.0.1:6379>set k1 v1
# 执行事务
127.0.0.1:6379>exec
1) OK
# 放弃事务
127.0.0.1:6379>discard
```

### Multi、Exec、discard
从输入Multi命令开始，输入的命令都会依次进入命令队列中，但不会执行，直到输入Exec后，Redis会将之前的命令队列中的命令依次执行

组队的过程中可以通过discard来放弃组队

![](/doc/redis/img-13.png)

组队中某个命令出现了报告错误，执行时整个的所有队列都会被取消

![](/doc/redis/img-14.png)

如果执行阶段某个命令报出了错误，则只有报错的命令不会被执行，而其他的命令都会执行，不会回滚

![](/doc/redis/img-15.png)

### 并发引起的事务问题

事务保证了发送到 Redis 的指令原子执行，这在只有单个客户端连接的情况下不会有任何问题。但是，当多个客户端同时对同一个键进行这样的操作时，就会产生竞争条件。
如果客户端 A 和 B 都读取了键原来的值，比如 10 ，那么两个客户端都会将键的值设为 11 ，但正确的结果应该是 12 才对。
使用锁机制可以解决这样的问题，锁又包括悲观锁和乐观锁

#### 悲观锁
悲观锁(Pessimistic Lock), 顾名思义，就是很悲观，每次去拿数据的时候都认为别人会修改，所以每次在拿数据的时候都会上锁，这样别人想拿这个数据就会block直到它拿到锁。传统的关系型数据库里边就用到了很多这种锁机制，比如行锁，表锁等，读锁，写锁等，都是在做操作之前先上锁

#### 乐观锁
乐观锁(Optimistic Lock), 顾名思义，就是很乐观，每次去拿数据的时候都认为别人不会修改，所以不会上锁，但是在更新的时候会判断一下在此期间别人有没有去更新这个数据，可以使用版本号等机制。乐观锁适用于多读的应用类型，这样可以提高吞吐量。Redis就是利用这种check-and-set机制实现事务的

在执行multi之前，先执行watch key1 [key2],可以监视一个(或多个) key ，如果在事务执行之前这个(或这些) key 被其他命令所改动，那么事务将被打断
```shell
WATCH key [key ...]
```

### Redis事务三特性

- 单独的隔离操作：    事务中的所有命令都会序列化、按顺序地执行。事务在执行的过程中，不会被其他客户端发送来的命令请求所打断。
- 没有隔离级别的概念： 队列中的命令没有提交之前都不会实际被执行，因为事务提交前任何指令都不会被实际执行
- 不保证原子性：      事务中如果有一条命令执行失败，其后的命令仍然会被执行，没有回滚


## Redis持久化

### RDB Redis DataBase
在指定的时间间隔内将内存中的数据集快照写入磁盘，也就是行话讲的Snapshot快照，它恢复时是将快照文件直接读到内存里；

RDB保存的是dump.rdb文件

Redis会单独创建（fork）一个子进程来进行持久化，会先将数据写入到一个临时文件中，待持久化过程都结束了，再用这个临时文件替换上次持久化好的文件。整个过程中，主进程是不进行任何IO操作的，这就确保了极高的性能如果需要进行大规模数据的恢复，且对于数据恢复的完整性不是非常敏感，那RDB方式要比AOF方式更加的高效。RDB的缺点是最后一次持久化后的数据可能丢失；

fork：复制一个与当前进程一样的进程。新进程的所有数据（变量、环境变量、程序计数器等）数值都和原进程一致，但是是一个全新的进程，并作为原进程的子进程；

![](/doc/redis/img-16.png)

dump.rdb文件

```shell
save

# 指定在多长时间内，有多少次更新操作，就将数据同步到数据文件，可以多个条件配合；
save 900 1 # 900秒（15分钟）内有1个更改
save 300 10 # 300秒（5分钟）内有10个更改
save 60 10000 # 60秒（1分钟）内有10000个更改

# 后台存储错误停止写
stop-writes-on-bgsave-error yes

# 指定存储至本地数据库时是否压缩数据，默认为yes
# Redis采用LZF压缩，如果为了节省CPU时间，可以关闭该选项，但会导致数据库文件变的巨大
rdbcompression yes

# 在存储快照后，还可以让redis使用CRC64算法来进行数据校验
# 但是这样做会增加大约10%的性能消耗，如果希望获取到最大的性能提升，可以关闭此功能
rdbchecksum yes

# 指定本地数据库文件名，默认值为dump.rdb
dbfilename dump.rdb

# 指定本地数据库存放目录（rdb、aof文件也会写在这个目录）
dir ./
```

#### 如何触发RDB快照

- 配置文件中默认的快照配置（冷拷贝后重新使用：可以cp dump.rdb dump_new.rdb）
- 使用命令save或者bgsave

save：save 时只管保存，其它不管，全部阻塞
bgsave：Redis会在后台异步进行快照操作，快照同时还可以响应客户端请求。可以通过 lastsave 命令获取最后一次成功执行快照的时间

- 执行flushall命令，也会产生dump.rdb文件，但里面是空的，无意义

#### 如何恢复
将备份文件 (dump.rdb) 移动到 redis 安装目录并启动服务即可，通过config get dir可获取目录

#### 如何停止
动态所有停止RDB保存规则的方法：redis-cli config set save ""

#### 优点
1. 适合大规模的数据回复
2. 对数据的完整性不高
#### 缺点
1. 需要一定的时间间隔去操作，在一定间隔时间做一次备份，所以如果redis意外宕掉的话，就会丢失最后一次快照后的所有修改
2. fork的时候，内存中的数据被克隆了一份，大致2倍的膨胀性需要考虑

### AOF（Append Only File）

以日志的形式来记录每个写操作，将Redis执行过的所有写指令记录下来(读操作不记录)，只许追加文件但不可以改写文件，redis启动之初会读取该文件重新构建数据，换言之，redis重启的话就根据日志文件的内容将写指令从前到后执行一次以完成数据的恢复工作（AOF保存的是 appendonly.aof 文件）
```shell
# 指定是否在每次更新操作后进行日志记录，Redis在默认情况下是异步的把数据写入磁盘
# 如果不开启，可能会在断电时导致一段时间内的数据丢失
# 因为redis本身同步数据文件是按上面save条件来同步的
# 所以有的数据会在一段时间内只存在于内存中。默认为no
appendonly no

# 指定更新日志文件名，默认为 appendonly.aof
appendfilename "appendonly.aof"

# 指定更新日志条件，共有3个可选值：
# no：表示等操作系统进行数据缓存同步到磁盘（快）
# always：表示每次更新操作后手动调用fsync()将数据写到磁盘（慢，安全）
# everysec：表示每秒同步一次（折衷，默认值）
appendfsync everysec

# 重写时是否可以运用Appendfsync，用默认no即可，保证数据安全性
no-appendfsync-on-rewrite no

# 重写指定百分比，为0会禁用AOF自动重写特性
auto-aof-rewrite-percentage 100

# 设置重写的基准值
auto-aof-rewrite-min-size 64mb
```

#### AOF启动/修复/恢复

- 正常恢复

启动：修改默认的appendonly no，改为yes <br/>
将有数据的aof文件复制一份保存到对应目录(目录通过config get dir命令获取) <br/>
恢复：重启redis然后重新加载

-  异常恢复

启动：修改默认的appendonly no，改为yes <br/>
备份被破坏的aof文件 <br/>
修复：使用redis-check-aof --fix命令进行修复 <br/>
恢复：重启redis然后重新加载

#### rewrite

- rewrite介绍

AOF采用文件追加方式，文件会越来越大为避免出现此种情况，新增了重写机制，当AOF文件的大小超过所设定
的阈值时，Redis就会启动AOF文件的内容压缩，只保留可以恢复数据的最小指令集.可以使用命bgrewriteaof

- 重写原理

AOF文件持续增长而过大时，会fork出一条新进程来将文件重写(也是先写临时文件最后再rename)，遍历新进程
的内存中数据，每条记录有一条的Set语句。重写aof文件的操作，并没有读取旧的aof文件，而是将整个内存中
的数据库内容用命令的方式重写了一个新的aof文件，这点和快照有点类似

- 触发机制

Redis会记录上次重写时的AOF大小，默认配置是当AOF文件大小是上次rewrite后大小的一倍且文件大于64M时
触发；
#### 优点

- 每修改同步：appendfsync always 同步持久化，每次发生数据变更会被立即记录到磁盘 性能较差但数据完整性比较好
- 每秒同步：appendfsync everysec 异步操作，每秒记录，如果一秒内宕机，有数据丢失
- 不同步：appendfsync no 从不同步
#### 缺点

- 相同数据集的数据而言aof文件要远大于rdb文件，恢复速度慢于rdb
- aof运行效率要慢于rdb,每秒同步策略效率较好，不同步效率和rdb相同

## 发布和订阅
一般不用 Redis 做消息发布订阅

![](/doc/redis/img-17.png)

```shell
# 首先通过客户端1订阅频道1
127.0.0.1:6379> subscribe channel
Reading messages... (press Ctrl-C to quit)
1) "subscribe"
2) "channel"

# 向频道内发送信息hello
127.0.0.1:6379> publish channel "hello"
(integer) 1

# 订阅了频道1的客户端收到了hello信息
1) "subscribe"
2) "channel"
3) (integer) 1
4) "message"
5) "channel"
6) "hello"
```

## 主从复制
一台服务器的数据复制到其他服务器，前者为主节点后者为从节点，数据的复制是单项的，Master为写Slave为读

作用

- 数据冗余：主从复制实现了数据的热备份，是持久化的一种数据冗余方式
- 故障恢复：当主节点出现问题时，可以由从节点提供服务，实现快速的故障恢复，实际上是一种服务器的冗余 
- 负载均衡：在主从复制的基础上，配合读写分离，可以由主节点来写，从节点来读
- 高可用

 
环境：
只配置从库，不用配置主库
```shell
# 修改主节点日志跟rdb文件
logfile "6379.log"
dbfilename dump6379.rdb

# 修改从节点
port 6380
pidfile /var/run/reds_6380.pid
logfile "6380.log"
dbfilename dump6380.rdb

# 设置从节点所属的主节点
slaveof 127.0.0.1 6379

# 查看主节点信息
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:1 # 从节点数量为 1
master_repl_offset:0
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0 

# 除了命令还可以修改配置文件
# 设置当本机为slav服务时，设置master服务的IP地址及端口
# 在Redis启动时，它会自动从master进行数据同步
slaveof <masterip> <masterport>

# 当master服务设置了密码保护时，slav服务连接master的密码
masterauth <master-password>
```
从节点启动成功后会发送一个sync同步命令
主节点收到后，启动后台的存盘进程，收集所有数据将整个数据文件发送给从节点

全量复制：从节点接受的到数据文件后，将 其加载到内存
增量复制：master继续将新的数据传给从节点

宕机后手动配置主机
```shell
slaveof no one 使自己成为主节点
```

## 哨兵模式
![](/doc/redis/img-18.png)

```shell
# 哨兵默认端口 26379
prot 26379

# 哨兵工作目录
dir /tmp

# 配置哨兵  设置监控的主节点 配置多少个sentinel认为master主节点失联，那么进行选举
sentinel monitor myredis 127.0.0.1 6379 1

# 连接密码 requirepass foobared
sentinel auth-pass mymaster 123456

# 指定多少毫秒后 主节点没有响应，哨兵则认为节点下线，默认为30秒
sentinel down-after-milliseconds mymaster 30000

# 这个配置指定发生failover主备切换时最多可以有多少个从节点同时对新的主节点进行同步
这个数字越小，完成failover所需时间越长
但如果越大，就意味着越多的从节点因为reoliactioin而不可用
可以设置为1，保证每次只要一个从节点处于不能处理命令的状态
sentinel parallel-syncs mymaster 1

# 故障转移的超时时间 默认三分钟
sentinel failover-timeout mymaster 180000

# 通知脚本 sentinel有任何警告发生都会执行这个脚本
# 脚本执行后返回 1，那么该脚本将会再次被执行，重复次数默认为20
# 执行返回 2，获取比2高的值则不重复执行，如果执行过程中终止，则返回值为1时的行为相同
# 脚本最大执行时间60秒，超过则会被SIGKILL信号终止，之后重新执行
sentinel notification-script mymaster /var/redis/notify.sh

# 客户端重新配置主节点参数脚本
sentinel client-reconfig-script mymaster /var/redis/reconfig.sh

# 启动
redis-sentinel /mydata/redis/sentinel.conf
```

## 缓存生产问题概念
### 缓存穿透
指查询多个不存在的数据，由于缓存未命中，将查询数据库，但是数据库也无数据，将查询的null写入缓存，导致这个不存在的数据每次都要查询数据库，失去了缓存的意义，数据库压力过大，导致崩溃

解决：null结果缓存，加过期时间，布隆过滤器 

### 缓存雪崩
所有的key采用的相同的过期时间，导致缓存在某一时刻同时失效。请求全部去查询数据库，导致数据库瞬时压力过大最终崩溃

解决：加随机过期值

### 缓存击穿
对某一个设置了过期时间的key进行高并发访问，如果key在大量请求同时进来前正好失效那么都去查询数据库

解决：加锁 

### 分布式锁的基本原理
![](/doc/redis/img-19.png)
![](/doc/redis/img-20.png)
![](/doc/redis/img-21.png)

## Redisson
```xml
<!-- [https://mvnrepository.com/artifact/org.redisson/redisson](https://mvnrepository.com/artifact/org.redisson/redisson) -->
<dependency>
    <groupId>org.redisson</groupId>
    <artifactId>redisson</artifactId>
    <version>3.16.1</version>
</dependency>

```

```java
@Configuration
public class RedissonConfig {

    // 单节点模式
    @Bean(destroyMethod = "studown")
    public RedissonClient redisson() throws IOException{
        Config config = new Config();
        config.useSingleServer()
                .setAddress("42.193.102.182:6379");

        return Redisson.create(config);
    }
}
```
```java
@RestController
@Api(tags = "Redis测试")
@RequestMapping("redis/demo")
public class redisDemo {

    private final RedisUtils redisUtils;

    private final RedissonClient redisson;

    private final ResourcesCategoryService resourcesCategoryService;

    public redisDemo(RedisUtils redisUtils, RedissonClient redisson, ResourcesCategoryService resourcesCategoryService) {
        this.redisUtils = redisUtils;
        this.redisson = redisson;
        this.resourcesCategoryService = resourcesCategoryService;
    }

    /**
     * 查询
     */
    @PostMapping("{key}")
    @ApiOperation("查询")
    public ReturnPlus query(@PathVariable("key") String key){
        //先查缓存
        String value = (String) redisUtils.get(key);
        if (StringUtils.isEmpty(key)){
            // 缓存中没有去查数据库
            Map<String, Object> params = new HashMap<>();
            List<ResourcesCategoryDto> list = resourcesCategoryService.list(params);
            value = JSON.toJSONString(list);
            redisUtils.set(key,value);
            return ReturnPlus.ok(list);
        }
        List<ResourcesCategoryDto> list = JSON.parseObject(value,new TypeReference<List<ResourcesCategoryDto>>(){});
        return ReturnPlus.ok(list);
    }

    /**
     * 1 空结果返回
     * 2 设置过期时间
     * 3 加锁
     */
    @PostMapping("/test/{key}")
    @ApiOperation("查询")
    public ReturnPlus demo(@PathVariable("key")String key){
        // 先查缓存
        String value = (String) redisUtils.get(key);
        if (StringUtils.isEmpty(value)){
            List<ResourcesCategoryDto> list = list(key);
            return ReturnPlus.ok(list);
        }
        // 缓存中有
        List<ResourcesCategoryDto> list = JSON.parseObject(value,new TypeReference<List<ResourcesCategoryDto>>(){});
        return ReturnPlus.ok(list);
    }


    // service  本地锁
    public List<ResourcesCategoryDto> list(String key){

        // service层业务加锁
        synchronized (this){
            //先查缓存 双重检测
            String value = (String) redisUtils.get(key);
            if (!StringUtils.isEmpty(value)){
                // 缓存不为空直接返回
          return JSON.parseObject(value,new TypeReference<List<ResourcesCategoryDto>>(){});
            }
            System.out.println("========查询数据库=========");
            // 缓存没有查询数据库
            Map<String, Object> params = new HashMap<>();
            List<ResourcesCategoryDto> list = resourcesCategoryService.list(params);
            value = JSON.toJSONString(list);
            // 设置过期时间
            redisUtils.set(key,value,RedisUtils.HOUR_MSM_EXPIRE);
            return list;
        }
    }

    /**
     * service  分布式锁 模式一
     *  问题：
     *      如果代码出现异常或者页面过程宕机，没有执行删除锁逻辑，这就造成死锁现象
     *  解决：加锁的自动过期时间，即使没有删除也会自动删除
     */
    public List<ResourcesCategoryDto> listRedisNXTest1(String key){

        // service层业务加锁
        Boolean isLock = redisUtils.setIfAbsent("lock", "1");
        if (isLock){
            // 加锁成功
            //先查缓存 双重检测
            String value = (String) redisUtils.get(key);
            if (!StringUtils.isEmpty(key)){
                // 缓存不为空直接返回
          return JSON.parseObject(value,new TypeReference<List<ResourcesCategoryDto>>(){});
            }
            System.out.println("========查询数据库=========");
            // 缓存没有查询数据库
            Map<String, Object> params = new HashMap<>();
            List<ResourcesCategoryDto> list = resourcesCategoryService.list(params);
            value = JSON.toJSONString(list);
            // 设置过期时间
            redisUtils.set(key,value,RedisUtils.HOUR_MSM_EXPIRE);
            // 删除锁
            redisUtils.delete("lock");
            return list;
        }else {
            // 加锁失败 自旋锁 可休眠100ms
            listRedisNXTest1(key);
        }

        return null;
    }

    /**
     * 分布式锁 模式二
     * 问题：删锁直接删除嘛？
     *       如果由于业务时间很长，自己的锁自动过期了，再去执行删锁，那么就把别人的锁给删除了
     * 解决：添加随机值，每一个人只能删除自己的锁
     */
    public List<ResourcesCategoryDto> listRedisNXTest2(String key){

        // service层业务加锁
        // Boolean isLock = redisUtils.setIfAbsent("lock", "1");
        // 加锁和设置过期时间为原子操作
        Boolean isLock = redisUtils.setIfAbsent("lock", "1",RedisUtils.HOUR_MSM_EXPIRE);
        if (isLock){
            // 加锁成功 设置过期时间
            //redisUtils.expire("lock",RedisUtils.HOUR_MSM_EXPIRE);
            List<ResourcesCategoryDto> list = selectList(key);
            // 删除锁
            redisUtils.delete("lock");
            return list;
        }else {
            // 加锁失败 自旋锁 可休眠100ms
            listRedisNXTest2(key);
        }

        return null;
    }

    /**
     * 分布式锁 模式三
     */
    public List<ResourcesCategoryDto> listRedisNXTest3(String key){
        String uuid = UUID.randomUUID().toString();
        Boolean isLock = redisUtils.setIfAbsent("lock", uuid,RedisUtils.HOUR_MSM_EXPIRE);
        if (isLock){
            List<ResourcesCategoryDto> list = selectList(key);
            // 获取值对比
           /* String value = (String) redisUtils.get(key);
            if (uuid.equals(value)){
                // 删除自己的锁
                redisUtils.delete("lock");
            }*/
            // 使用 lua 脚本解锁
            String script = "if redis.call('get',KEYS[1] == ARGV[1] then return redis.call('del', KEYS[1] else return 0 end))";
            redisUtils.execute(new DefaultRedisScript<>(script,Integer.class), 
                               Arrays.asList("lock"),uuid);
            return list;
        }else {
            // 加锁失败 自旋锁 可休眠
            try {
                Thread.sleep(200);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            listRedisNXTest3(key);
        }

        return null;
    }

    /**
     * 分布式锁 Redisson
     */
    public void redissonTest(){
        RLock lock = redisson.getLock("my-lock");
        // 加锁
        lock.lock(); // 默认加的锁都是 30s 时间
        try {
            Thread.sleep(3000);
        }catch (Exception e){

        }finally {
            // 解锁
            lock.unlock();
        }

    }

    /**
     * 读写锁 Redisson
     */
    public void redissonWrite(){
        RReadWriteLock lock = redisson.getReadWriteLock("rw-lock");
        String s = "";
        RLock rLock = lock.writeLock();
        rLock.lock();
        try {
            s = UUID.randomUUID().toString();
            Thread.sleep(30000);
            redisUtils.set("writeValue",s);
        } catch (InterruptedException e){
            e.printStackTrace();
        }finally {
            rLock.unlock();
        }

    }

    /**
     * 读写锁 Redisson
     */
    public void redissonRead(){
        RReadWriteLock lock = redisson.getReadWriteLock("rw-lock");
        String s = "";
        RLock rLock = lock.readLock();
        rLock.lock();
        try {
            s = (String) redisUtils.get("readValue");
        } catch (Exception e){
            e.printStackTrace();
        }

    }

    // 信号量 限流
    public void park() throws InterruptedException {
        RSemaphore park = redisson.getSemaphore("park");
        park.acquire();
        // 获取一个信号量
        boolean b = park.tryAcquire();
        // 释放一个信号量
        park.release();
    }

    // 闭锁

    /**
     * 例如 秒杀 商品全部拍卖完毕，闭锁
     */
    public void lockDoor() throws InterruptedException {
        RCountDownLatch door = redisson.getCountDownLatch("door");
        door.trySetCount(5); // 等待5的商品拍卖完毕
        door.await(); // 等待闭锁完成
    }

    public void lockGoDoor() throws InterruptedException {
        RCountDownLatch door = redisson.getCountDownLatch("door");
        door.countDown(); // 计数减一
    }



    public List<ResourcesCategoryDto> selectList(String key){
        //先查缓存 双重检测
        String value = (String) redisUtils.get(key);
        if (!StringUtils.isEmpty(key)){
            // 缓存不为空直接返回
          return JSON.parseObject(value,new TypeReference<List<ResourcesCategoryDto>>(){});
        }
        System.out.println("========查询数据库=========");
        // 缓存没有查询数据库
        Map<String, Object> params = new HashMap<>();
        List<ResourcesCategoryDto> list = resourcesCategoryService.list(params);
        value = JSON.toJSONString(list);
        redisUtils.set(key,value,RedisUtils.HOUR_MSM_EXPIRE);
        return list;
    }

}

```
