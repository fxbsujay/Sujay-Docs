# MySql 索引

索引的基本使用和索引的失效情况分析
:::tip 什么是索引
索引一般以文件形式存在磁盘中（也可以存于内存中），存储的索引的原理大致概括为以空间换时间，数据库在未添加索引的时候进行查询默认的是进行全量搜索，也就是进行全局扫描，有多少条数据就要进行多少次查询，然后找到相匹配的数据就把他放到结果集中，直到全表扫描完。而建立索引之后，会将建立索引的KEY值放在一个n叉树上（BTree）。因为B树的特点就是适合在磁盘等直接存储设备上组织动态查找表，每次以索引进行条件查询时，会去树上根据key值直接进行搜索
:::

## 优点
建立索引的目的是加快对表中记录的查找或排序！

- 建立索引的列可以保证行的唯一性，生成唯一的rowId
- 建立索引可以有效缩短数据的检索时间
- 建立索引可以加快表与表之间的连接
- 为用来排序或者是分组的字段添加索引可以加快分组和排序顺序



## 缺点
数据库中表的数据量较大的情况下，对于查询响应时间不能满足业务需求，可以合理的使用索引提升查询效率

- 创建索引和维护索引需要时间成本，这个成本随着数据量的增加而加大
- 创建索引和维护索引需要空间成本，每一条索引都要占据数据库的物理存储空间，数据量越大，占用空间也越大（数据表占据的是数据库的数据空间）
- 会降低表的增删改的效率，因为每次增删改索引需要进行动态维护，导致时间变长


## 索引结构

| 索引结构  | 描述  |
| :----------: | :----------: |
| B+Tree  | 最常见的索引类型，大部分引擎都支持B+树索引  |
| Hash  | 底层数据结构是用哈希表实现，只有精确匹配索引列的查询才有效，不支持范围查询  |
| R-Tree(空间索引)  | 空间索引是 MyISAM 引擎的一个特殊索引类型，主要用于地理空间数据类型，通常使用较少  |
| Full-Text(全文索引)  | 是一种通过建立倒排索引，快速匹配文档的方式，类似于 Lucene, Solr, ES  |

| 索引  | InnoDB  | MyISAM  | Memory  |
| :----------: | :----------: | :----------: | :----------: |
| B+Tree索引  | 支持  | 支持  | 支持  |
| Hash索引  | 不支持  | 不支持  | 支持  |
| R-Tree索引  | 不支持  | 支持  | 不支持  |
| Full-text  | 5.6版本后支持  | 支持  | 不支持  |

### B-Tree

![二叉树](/doc/mysql/img-2.png)

二叉树的缺点可以用红黑树来解决：
![红黑树](/doc/mysql/img-3.png)
红黑树也存在大数据量情况下，层级较深，检索速度慢的问题。

为了解决上述问题，可以使用 B-Tree 结构。
B-Tree (多路平衡查找树) 以一棵最大度数（max-degree，指一个节点的子节点个数）为5（5阶）的 b-tree 为例（每个节点最多存储4个key，5个指针）

![B-Tree结构](/doc/mysql/img-4.png)



> 演示地址：https://www.cs.usfca.edu/~galles/visualization/BTree.html

### B+Tree

结构图：

![B+Tree结构图](/doc/mysql/img-5.png)

> 演示地址：https://www.cs.usfca.edu/~galles/visualization/BPlusTree.html

与 B-Tree 的区别：

- 所有的数据都会出现在叶子节点
- 叶子节点形成一个单向链表

MySQL 索引数据结构对经典的 B+Tree 进行了优化。在原 B+Tree 的基础上，增加一个指向相邻叶子节点的链表指针，就形成了带有顺序指针的 B+Tree，提高区间访问的性能。

![MySQL B+Tree 结构图](/doc/mysql/img-6.png)

### Hash

哈希索引就是采用一定的hash算法，将键值换算成新的hash值，映射到对应的槽位上，然后存储在hash表中。
如果两个（或多个）键值，映射到一个相同的槽位上，他们就产生了hash冲突（也称为hash碰撞），可以通过链表来解决。

![Hash索引原理图](/doc/mysql/img-7.png)

特点：

- Hash索引只能用于对等比较（=、in），不支持范围查询（betwwn、>、<、...）
- 无法利用索引完成排序操作
- 查询效率高，通常只需要一次检索就可以了，效率通常要高于 B+Tree 索引

存储引擎支持：

- Memory
- InnoDB: 具有自适应hash功能，hash索引是存储引擎根据 B+Tree 索引在指定条件下自动构建的



:::tip  为什么 InnoDB 存储引擎选择使用 B+Tree 索引结构？

- 相对于二叉树，层级更少，搜索效率高
- 对于 B-Tree，无论是叶子节点还是非叶子节点，都会保存数据，这样导致一页中存储的键值减少，指针也跟着减少，要同样保存大量数据，只能增加树的高度，导致性能降低
- 相对于 Hash 索引，B+Tree 支持范围匹配及排序操作

:::


## 索引分类

| 分类  | 含义  | 特点  | 关键字  |
| ------------ | ------------ | ------------ | ------------ |
| 主键索引  | 针对于表中主键创建的索引  | 默认自动创建，只能有一个  | PRIMARY  |
| 唯一索引  | 避免同一个表中某数据列中的值重复  | 可以有多个  | UNIQUE  |
| 常规索引  | 快速定位特定数据  | 可以有多个  |   |
| 全文索引  | 全文索引查找的是文本中的关键词，而不是比较索引中的值  | 可以有多个  | FULLTEXT  |

在 InnoDB 存储引擎中，根据索引的存储形式，又可以分为以下两种：

| 分类  | 含义  | 特点  |
| ------------ | ------------ | ------------ |
| 聚集索引(Clustered Index)  | 将数据存储与索引放一块，索引结构的叶子节点保存了行数据  | 必须有，而且只有一个  |
| 二级索引(Secondary Index)  | 将数据与索引分开存储，索引结构的叶子节点关联的是对应的主键  | 可以存在多个  |

演示图：

![大致原理](/doc/mysql/img-8.png)

![大致原理](/doc/mysql/img-9.png)

聚集索引选取规则：

- 如果存在主键，主键索引就是聚集索引
- 如果不存在主键，将使用第一个唯一(UNIQUE)索引作为聚集索引
- 如果表没有主键或没有合适的唯一索引，则 InnoDB 会自动生成一个 rowid 作为隐藏的聚集索引

#### 

:::tip  以下 SQL 语句，哪个执行效率高？为什么？

```sql
-- id为主键，name字段创建的有索引

select * from user where id = 10;
select * from user where name = 'Arm';

```
答：第一条语句，因为第二条需要回表查询，相当于两个步骤

:::



2\. InnoDB 主键索引的 B+Tree 高度为多少？

答：假设一行数据大小为1k，一页中可以存储16行这样的数据。InnoDB 的指针占用6个字节的空间，主键假设为bigint，占用字节数为8.
可得公式：`n * 8 + (n + 1) * 6 = 16 * 1024`，其中 8 表示 bigint 占用的字节数，n 表示当前节点存储的key的数量，(n + 1) 表示指针数量（比key多一个）。算出n约为1170。

如果树的高度为2，那么他能存储的数据量大概为：`1171 * 16 = 18736`；
如果树的高度为3，那么他能存储的数据量大概为：`1171 * 1171 * 16 = 21939856`。

另外，如果有成千上万的数据，那么就要考虑分表，涉及运维篇知识



## 基本语句
```sql
CREATE TABLE table_name[col_name data type]
[unique|fulltext][index|key][index_name](col_name[length])[asc|desc]
```

- unique|fulltext为可选参数，分别表示唯一索引、全文索引
- index和key为同义词，两者作用相同，用来指定创建索引
- col_name为需要创建索引的字段列，该列必须从数据表中该定义的多个列中选择
- index_name指定索引的名称，为可选参数，如果不指定，默认col_name为索引值
- ength为可选参数，表示索引的长度，只有字符串类型的字段才能指定索引长度
- asc或desc指定升序或降序的索引值存储



### 普通索引（单列索引）
```sql
-- 直接创建索引
CREATE INDEX index_name ON table_name(col_name)

-- 修改表结构的方式添加索引
ALTER TABLE table_name ADD INDEX index_name(col_name)

-- 创建表的时候同时创建索引
CREATE TABLE `news` (
    `id` int(11) NOT NULL AUTO_INCREMENT ,
    `title` varchar(255)  NOT NULL ,
    `content` varchar(255)  NULL ,
    `time` varchar(20) NULL DEFAULT NULL ,
    PRIMARY KEY (`id`),
    INDEX index_name (title(255))
)

-- 删除索引
DROP INDEX index_name ON table_name;
-- 或者
alter table `表名` drop index 索引名;
```
### 复合索引（组合索引）
```sql
-- 直接创建索引
create index index_name on table_name(col_name1,col_name2,...)

-- 修改表结构的方式添加索引
alter table table_name add index index_name(col_name,col_name2,...)
```
### 唯一索引
唯一索引和普通索引类似，主要的区别在于，唯一索引限制列的值必须唯一，但允许存在空值（只允许存在一条空值）


<div class="tip custom-block line">
"空值" 和 "NULL" 的是不一样的，空值是不占用空间的，MySQL中的NULL其实是占用空间的
</div>

- 如果添加索引的列的值存在两个或者两个以上的空值，则不能创建唯一性索引会失败。（一般在创建表的时候，要对自动设置唯一性索引，需要在字段上加上 not null）
- 如果添加索引的列的值存在两个或者两个以上的null值，还是可以创建唯一性索引，只是后面创建的数据不能再插入null值 ，并且严格意义上此列并不是唯一的，因为存在多个null值

对于多个字段创建唯一索引规定列值的组合必须唯一
比如：在order表创建orderId字段和 productId字段 的唯一性索引，那么这两列的组合值必须唯一！
```sql
--长度验证：注意空值的之间是没有空格的。
 
> select length(''),length(null),length(' ');
+------------+--------------+-------------+
| length('') | length(null) | length(' ') |
+------------+--------------+-------------+
|          0 |         NULL |           1 |
+------------+--------------+-------------+

-- 创建单个索引
CREATE UNIQUE INDEX index_name ON table_name(col_name)
 
-- 创建多个索引
CREATE UNIQUE INDEX index_name on table_name(col_name,...)

-- 修改表结构的方式 单个
ALTER TABLE table_name ADD UNIQUE index index_name(col_name)
-- 修改表结构的方式 多个
ALTER TABLE table_name ADD UNIQUE index index_name(col_name,...)

-- 创建表的时候同时创建索引
CREATE TABLE `news` (
    `id` int(11) NOT NULL AUTO_INCREMENT ,
    `title` varchar(255)  NOT NULL ,
    `content` varchar(255)  NULL ,
    `time` varchar(20) NULL DEFAULT NULL ,
    PRIMARY KEY (`id`),
    UNIQUE index_name_unique(title)
)
```
### 主键索引
```sql
-- 主键索引(创建表时添加)
CREATE TABLE `news` (
    `id` int(11) NOT NULL AUTO_INCREMENT ,
    `title` varchar(255)  NOT NULL ,
    `content` varchar(255)  NULL ,
    `time` varchar(20) NULL DEFAULT NULL ,
    PRIMARY KEY (`id`)
)
-- 创建表后添加
alter table tbl_name add primary key(col_name)


CREATE TABLE `order` (
    `orderId` varchar(36) NOT NULL,
    `productId` varchar(36)  NOT NULL ,
    `time` varchar(20) NULL DEFAULT NULL
)
 
alter table `order` add primary key(`orderId`)
```
### 全文索引
在一般情况下，模糊查询都是通过 like 的方式进行查询。但是，对于海量数据，这并不是一个好办法，在 like `value%` 可以使用索引，但是对于 like `%value%` 这样的方式，执行全表查询，这在数据量小的表，不存在性能问题，但是对于海量数据，全表扫描是非常可怕的事情，所以 like 进行模糊匹配性能很差

这种情况下，需要考虑使用全文搜索的方式进行优化。全文搜索在 MySQL 中是一个 FULLTEXT 类型索引。**FULLTEXT 索引在 MySQL 5.6 版本之后支持 InnoDB，而之前的版本只支持 MyISAM 表**。
全文索引主要用来查找文本中的关键字，而不是直接与索引中的值相比较。fulltext索引跟其它索引大不相同，它更像是一个搜索引擎，而不是简单的where语句的参数匹配。fulltext索引配合match against操作使用，而不是一般的where语句加like。目前只有char、varchar，text 列上可以创建全文索引。

:::tip 小技巧
在数据量较大时候，先将数据放入一个没有全局索引的表中，然后再用CREATE index创建fulltext索引，要比先为一张表建立fulltext然后再将数据写入的速度快很多
:::
```sql
-- 创建表的适合添加全文索引
CREATE TABLE `news` (
    `id` int(11) NOT NULL AUTO_INCREMENT ,
    `title` varchar(255)  NOT NULL ,
    `content` text  NOT NULL ,
    `time` varchar(20) NULL DEFAULT NULL ,
     PRIMARY KEY (`id`),
    FULLTEXT (content)
)

-- 修改表结构的时候创建索引
ALTER TABLE table_name ADD FULLTEXT index_fulltext_content(col_name)

-- 直接创建索引
CREATE FULLTEXT INDEX index_fulltext_content ON table_name(col_name)
```

:::warning 默认 MySQL 不支持中文全文检索
MySQL 全文搜索只是一个临时方案，对于全文搜索场景，更专业的做法是使用全文搜索引擎，例如 ElasticSearch 或 Solr
索引的查询和删除
:::


```sql
-- 查看:
show indexes from `表名`;
-- 或
show keys from `表名`;
-- 删除
alter table `表名` drop index 索引名;
```



### 覆盖索引

查询使用了索引，并且需要返回的列，在该索引中已经全部能找到，减少 SELECT *，避免回表查询

explain 中 extra 字段含义：

`using index condition`：查找使用了索引，但是需要回表查询数据

`using WHERE; using index`：查找使用了索引，但是需要的数据都在索引列中能找到，所以不需要回表查询


如果在聚集索引中直接能找到对应的行，则直接返回行数据，只需一次查询，哪怕是SELECT *

如果在辅助索引中找聚集索引，如`SELECT id, name FROM xxx WHERE name='xxx';`，也只需要通过辅助索引(name)查找到对应的id，返回name和name索引对应的id即可，只需要一次查询；

如果是通过辅助索引查找其他字段，则需要回表查询，如 `SELECT id, name, gender FROM xxx WHERE name='xxx';`

所以尽量不要用`SELECT *`，容易出现回表查询，降低效率，除非有联合索引包含了所有字段

:::tip 面试题
一张表，有四个字段（id, username, password, status），由于数据量大，需要对以下SQL语句进行优化，该如何进行才是最优方案：
```sql
SELECT id, username, password FROM tb_user WHERE username='itcast'
```
解：给username和password字段建立联合索引，则不需要回表查询，直接覆盖索引
:::


### 前缀索引

当字段类型为字符串（varchar, text等）时，有时候需要索引很长的字符串，这会让索引变得很大，查询时，浪费大量的磁盘IO，影响查询效率，此时可以只降字符串的一部分前缀，建立索引，这样可以大大节约索引空间，从而提高索引效率。

```sql
create index idx_xxxx on table_name(columnn(n))
```
前缀长度：可以根据索引的选择性来决定，而选择性是指不重复的索引值（基数）和数据表的记录总数的比值，索引选择性越高则查询效率越高，唯一索引的选择性是1，这是最好的索引选择性，性能也是最好的。

求选择性公式：

```sql
SELECT count(distinct email) / count(*) FROM tb_user

SELECT count(distinct substring(email, 1, 5)) / count(*) FROM tb_user
```

show index 里面的sub_part可以看到接取的长度


## 索引失效

索引优化工具
EXPLAIN 或者 DESC 命令获取 MySQL 如何执行 SELECT 语句的信息，包括在 SELECT 语句执行过程中表如何连接和连接的顺序

```sql
-- 查看索引使用效果
show status like ‘Handler_read%’

handler_read_key:				这个值越高越好，越高表示使用索引查询到的次数
handler_read_rnd_next:	这个值越高，说明查询低效

-- 查询索引使用情况
EXPLAIN SELECT 字段列表 FROM 表名 HWERE 条件
DESC SELECT 字段列表 FROM 表名 HWERE 条件

-- 建议使用索引
explain SELECT * FROM tb_user use index(idx_user_pro) WHERE profession="软工"
-- 不使用哪个索引：
explain SELECT * FROM tb_user ignore index(idx_user_pro) WHERE profession="软工"
-- 必须使用哪个索引
explain SELECT * FROM tb_user force index(idx_user_pro) WHERE profession="软工"
```

EXPLAIN 各字段含义：

- id：SELECT 查询的序列号，表示查询中执行 SELECT 子句或者操作表的顺序（id相同，执行顺序从上到下；id不同，值越大越先执行）
- SELECT_type：表示 SELECT 的类型，常见取值有 SIMPLE（简单表，即不适用表连接或者子查询）、PRIMARY（主查询，即外层的查询）、UNION（UNION中的第二个或者后面的查询语句）、SUBQUERY（SELECT/WHERE之后包含了子查询）等
- type：表示连接类型，性能由好到差的连接类型为 NULL、system、const、eq_ref、ref、range、index、all
- possible_key：可能应用在这张表上的索引，一个或多个
- Key：实际使用的索引，如果为 NULL，则没有使用索引
- Key_len：表示索引中使用的字节数，该值为索引字段最大可能长度，并非实际使用长度，在不损失精确性的前提下，长度越短越好
- rows：MySQL认为必须要执行的行数，在InnoDB引擎的表中，是一个估计值，可能并不总是准确的
- filtered：表示返回结果的行数占需读取行数的百分比，filtered的值越大越好



------





> 测试数据

```sql
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `stud_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(1) NOT NULL,
  `create_date` date DEFAULT NULL,
  PRIMARY KEY (`stud_id`)
 
)
 
INSERT INTO `learn_mybatis`.`students` (`stud_id`, `name`, `email`, `phone`, `create_date`) VALUES ('1', 'admin', 'student1@gmail.com', '18729902095', '1983-06-25');
INSERT INTO `learn_mybatis`.`students` (`stud_id`, `name`, `email`, `phone`, `create_date`) VALUES ('2', 'root', '74298110186@qq.com', '2', '1983-12-25');
INSERT INTO `learn_mybatis`.`students` (`stud_id`, `name`, `email`, `phone`, `create_date`) VALUES ('3', '110', '7429811086@qq.com', '3dsad', '2017-04-28');
```

### 1. 在where后使用or，导致索引失效（尽量少用or）
```sql
CREATE INDEX index_name_email ON students(email)

CREATE INDEX index_name_phone ON students(phone)

-- 使用了索引
EXPLAIN select * from students where stud_id='1'  or phone='18729902095'

-- 使用了索引
EXPLAIN select * from students where stud_id='1'  or email='742981086@qq.com'

---------------------------

-- 没有使用索引
EXPLAIN select * from students where phone='18729902095' or email='742981086@qq.com'
 
-- 没有使用索引
EXPLAIN select * from students where stud_id='1'  or phone='222' or email='742981086@qq.com'

```
### 2. 使用 like，like 查询是以 `%` 开头
```sql
-- 使用了index_name_email索引
EXPLAIN select * from students where email like '742981086@qq.com%'
 
-- 没有使用index_name_email索引，索引失效
EXPLAIN select * from students where email like '%742981086@qq.com'
 
-- 没有使用index_name_email索引，索引失效
EXPLAIN select * from students where email like '%742981086@qq.com%'
```
### 3. 复合索引遵守“最左前缀”原则
在查询条件中使用了复合索引的第一个字段，索引才会被使用

```sql
create index index_email_phone on students(email,phone)

-- 使用了 index_email_phone 索引
EXPLAIN select * from students where email='742981086@qq.com' and  phone='18729902095'
 
-- 使用了 index_email_phone 索引
EXPLAIN select * from students where phone='18729902095' and  email='742981086@qq.com'
 
-- 使用了 index_email_phone 索引
EXPLAIN select * from students where email='742981086@qq.com' and name='admin'
 
-- 没有使用index_email_phone索引，复合索引失效
EXPLAIN select * from students where phone='18729902095' and name='admin'
```

### 4. 字符串类型字段未使用引号
```sql
CREATE INDEX index_name ON students(name)

-- 使用索引
EXPLAIN select * from students where name='110'
 
-- 没有使用索引
EXPLAIN select * from students where name=110
```
### 5. 使用 in 导致索引失效
```sql
-- 使用索引
EXPLAIN select * from students where name='admin'
 
-- 没有使用索引
EXPLAIN SELECT * from students where name in ('admin')
```
### 6. DATE_FORMAT()格式化时间
```sql
CREATE INDEX index_create_date ON students(create_date)

-- 使用索引
EXPLAIN SELECT * from students where create_date >= '2010-05-05'
 
-- 没有使用索引
EXPLAIN SELECT * from students where DATE_FORMAT(create_date,'%Y-%m-%d') >= '2010-05-05'
```

### 7. order by、group by 、 union、 distinc 中的字段出现在where条件中时，才会利用索引

### 8. 对索引列进行运算导致索引失效,我所指的对索引列进行运算包括(+，-，*，/，! 等) 
```sql
# 使用索引
select * from students where id=10 

# 没有使用索引
select * from students where id-1=9
```
### 9. 使用mysql内部函数导致索引失效.对于这样情况应当创建基于函数的索引
```sql
# 使用索引
create index test_id_fbi_idx on students(round(id))
select * from test where round(id)=10

# 没有使用索引
select * from students where round(id)=10;
```
### 10. 在JOIN操作中（需要从多个数据表提取数据时），MYSQL只有在主键和外键的数据类型相同时才能使用索引，否则即使建立了 索引也不会使用

### 11. 重复数据太多，例如“性别”
### 12. 索引不会包含有NULL值的列

### 13. NOT IN和<>操作都不会使用索引将进行全表扫描。NOT IN可以NOT EXISTS代替，id<>3则可使用id>3 or id<3来代替

### 14. 查询的数量是大表的大部分，应该是30％以上


### 设计原则

多条件联合查询时，MySQL优化器会评估哪个字段的索引效率更高，会选择该索引完成本次查询

1. 针对于数据量较大，且查询比较频繁的表建立索引
2. 针对于常作为查询条件（WHERE）、排序（order by）、分组（group by）操作的字段建立索引
3. 尽量选择区分度高的列作为索引，尽量建立唯一索引，区分度越高，使用索引的效率越高
4. 如果是字符串类型的字段，字段长度较长，可以针对于字段的特点，建立前缀索引
5. 尽量使用联合索引，减少单列索引，查询时，联合索引很多时候可以覆盖索引，节省存储空间，避免回表，提高查询效率
6. 要控制索引的数量，索引并不是多多益善，索引越多，维护索引结构的代价就越大，会影响增删改的效率
7. 如果索引列不能存储NULL值，请在创建表时使用NOT NULL约束它。当优化器知道每列是否包含NULL值时，它可以更好地确定哪个索引最有效地用于查询



