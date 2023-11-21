# MYSQL

## 数据类型

| 类型名称      | 取值范围                                  	 | 大小    | 说明         |
| :-----------: |:-------------------------------------:| :-----: |:----------:|
| TINYINT       | -128〜127                              | 1字节 | 最小整数值      |
| SMALLINT      | -32768〜32767                          | 2字节 | 小整数值       |
| MEDIUMINT     | -8388608〜8388607                      | 3个字节 | 中等整数值      |
| INT (INTEGHR) | -2147483648〜2147483647                | 4字节 | 整形         |
| BIGINT        | -9223372036854775808〜9223372036854775807 | 8字节 | 极大整数值      |
| FLOAT              | -3.4E38~3.4E38（7位）                 | 4字节   | 单精度浮点数     |
| DOUBLE             | -1.7E308~1.7E308（15位）              | 8字节   | 双精度浮点数     |
| DECIMAL(M, D) |                                       | M+2字节 | 定点数 |



| 类型名称  | 日期格式            |                     日期范围                      | 存储需求 |
| :-------: | ------------------- | :-----------------------------------------------: | -------- |
|   YEAR    | YYYY                |                    1901 ~ 2155                    | 1 个字节 |
|   TIME    | HH:MM:SS            |              -838:59:59 ~ 838:59:59               | 3 个字节 |
|   DATE    | YYYY-MM-DD          |              1000-01-01 ~ 9999-12-3               | 3 个字节 |
| DATETIME  | YYYY-MM-DD HH:MM:SS |     1000-01-01 00:00:00 ~ 9999-12-31 23:59:59     | 8 个字节 |
| TIMESTAMP | YYYY-MM-DD HH:MM:SS | 1980-01-01 00:00:01 UTC ~ 2040-01-19 03:14:07 UTC | 4 个字节 |



|  类型名称  |                     说明                     |                          存储需求                          |
| :--------: | :------------------------------------------: | :--------------------------------------------------------: |
|  CHAR(M)   |            固定长度非二进制字符串            |                     M 字节，1<=M<=255                      |
| VARCHAR(M) |              变长非二进制字符串              |             L+1字节，在此，L< = M和 1<=M<=255              |
|  TINYTEXT  |            非常小的非二进制字符串            |                    L+1字节，在此，L<2^8                    |
|    TEXT    |              小的非二进制字符串              |                   L+2字节，在此，L<2^16                    |
| MEDIUMTEXT |           中等大小的非二进制字符串           |                   L+3字节，在此，L<2^24                    |
|  LONGTEXT  |              大的非二进制字符串              |                   L+4字节，在此，L<2^32                    |
|    ENUM    |       枚举类型，只能有一个枚举字符串值       |       1或2个字节，取决于枚举值的数目 (最大值为65535)       |
|    SET     | 一个设置，字符串对象可以有零个或 多个SET成员 | 1、2、3、4或8个字节，取决于集合 成员的数量（最多64个成员） |



| 类型名称       | 说明                 | 存储需求               |
| -------------- | -------------------- | ---------------------- |
| BIT(M)         | 位字段类型           | 大约 (M+7)/8 字节      |
| BINARY(M)      | 固定长度二进制字符串 | M 字节                 |
| VARBINARY (M)  | 可变长度二进制字符串 | M+1 字节               |
| TINYBLOB (M)   | 非常小的BLOB         | L+1 字节，在此，L<2^8  |
| BLOB (M)       | 小 BLOB              | L+2 字节，在此，L<2^16 |
| MEDIUMBLOB (M) | 中等大小的BLOB       | L+3 字节，在此，L<2^24 |
| LONGBLOB (M)   | 非常大的BLOB         | L+4 字节，在此，L<2^32 |

## 基础语法

- DDL 定义数据库对象（数据库、表、字段）
- DML 对数据库表中的数据进行增删改
- DQL 查询数据库中表的记录
- DCL 创建数据库用户、控制数据库的控制权限



<div class="tip custom-block line">
 <a href="https://dev.mysql.com/doc/refman/5.7/en/create-table.html">MYSQL5.7 文档</a>  以下示例  `[xxx]` 表示可选参数，非必填
</div>



### DDL



`utf8` 字符集长度为3字节，有些符号占4字节，所以推荐用 `utf8mb4` 字符集

#### 操作数据库

```sql
-- 查询所有数据库
SHOW DATABASES

-- 查询当前数据库：
SELECT DATABASE()

-- 查询数据库编码
SHOW VARIABLES LIKE 'character%'

-- 创建数据库
CREATE DATABASE [ IF NOT EXISTS ] 数据库名 [ DEFAULT CHARSET 字符集 ] [ COLLATE 排序规则 ]
CREATE DATABASE test_db
CREATE DATABASE IF NOT EXISTS test_db DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci

-- 删除数据库
DROP DATABASE [ IF EXISTS ] 数据库名

-- 使用数据库
USE 数据库名
```

#### 操作数据库表

```sql
-- 查询当前数据库所有表
SHOW TABLES

-- 查询表结构
DESC 表名

-- 查询指定表的建表语句
SHOW CREATE TABLE 表名

-- 创建表
CREATE TABLE 表名 (
	字段名 字段类型 [ NOT NULL ] [ DEFAULT 默认值 ] [ COMMENT 字段注释 ],
	...,
    PRIMARY KEY (`指定主键字段名`) USING BTREE
) [ COMMENT = 表注释 ]

-- 示例
CREATE IF EXISTS TABLE student (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '学生姓名',
  `age` int(3) DEFAULT NULL COMMENT '年龄',
  `UPDATEd_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录修改时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 COMMENT = '学生表'

-- 修改表名
ALTER TABLE 表名 RENAME TO 新表名

-- 删除表
DROP TABLE [IF EXISTS] 表名

-- 重新创建表
TRUNCATE TABLE 表名

-- 添加字段
ALTER TABLE 表名 ADD 字段名 字段类型 [ NOT NULL ] [ DEFAULT NULL ] [ COMMENT 注释 ]

-- 修改字段
ALTER TABLE 表名 MODIFY 字段名 新数据类型
ALTER TABLE 表名 CHANGE 旧字段名 新字段名 数据类型 [ COMMENT 注释 ]

-- 删除字段
ALTER TABLE 表名 DROP 字段名

```

### DML

#### 新增



- 字符串和日期类型数据应该包含在引号中
- 插入的数据大小应该在字段的规定范围内
- 不指定字段默认为全部字段

```sql
INSERT INTO 表名 VALUES (值1, 值2, ...)
INSERT INTO 表名 VALUES (值1, 值2, ...), (值1, 值2, ...) ...

INSERT INTO 表名 (字段名1, 字段名2, ...) VALUES (值1, 值2, ...)
INSERT INTO 表名 (字段名1, 字段名2, ...) VALUES (值1, 值2, ...), (值1, 值2, ...) ...
```

#### 修改和删除

```sql
UPDATE 表名 SET 字段名1 = 值1, 字段名2 = 值2, ... [ WHERE 条件 ]

DELETE FROM 表名 [ WHERE 条件 ]
```

### DQL



```sql
-- DISTINCT = 去除重复记录
-- ORDER BY 默认升序 ASC, 降序使用 DESC
-- 页码可省略，默认为0
SELECT [ DISTINCT ] 字段列表 FROM 表名字段
[ WHERE 条件列表 ]
[ GROUP BY 分组字段列表 ]
[ HAVING 分组后的条件列表 ]
[ ORDER BY 排序字段列表 ASC]
[ LIMIT 起始索引，条数]
```

语句执行顺序

1. FROM 识别表
2. WHERE 筛选
3. GROUP BY 对数据进行分组
4. 聚合查询 有聚合函数时，要使用聚集函数进行数据计算
5. HAVING 筛选满足第二条件的数据
6. SELECT 字段筛选
7. DISTINCT 如果有去重则筛选重复数据
8. ORDER BY 排序
9. LIMIT 限定



#### 运算符

| 运算符                 | 功能                     |
|---------------------|------------------------|
| +                   | 加                      |
| -                   | 减                      |
| *                   | 乘                      |
| / 或 DIV             | 除                      |
| % 或 MOD             | 求余                     |
| >=                  | 大于等于                   |
| <                   | 小于                     |
| <=                  | 小于等于                   |
| =                   | 等于                     |
| <> 或 !=             | 不等于                    |
| BETWEEN ... AND ... | 在某个范围内（含最小、最大值）        |
| IN(...)             | 在in之后的列表中的值，多选一        |
| LIKE 占位符            | 模糊匹配（\_匹配单个字符，%匹配任意个字符） |
| IS NULL             | 是NULL                  |
| AND 或 &&            | 与                      |
| OR 或 &#124;&#124;   | 或                      |
| NOT 或 !             | 非                      |
| REGEXP 或 RLIKE      | 正则匹配                   |
| &                   | 按位与                    |
| \|                        |按位或|
| ^     | 按位异或                   |
| <<    | 左移                     |
|>>| 右移                     |





例子：

```sql
-- 年龄大于20小于30
SELECT * FROM student WHERE age BETWEEN 20 AND 30
SELECT * FROM student WHERE age >= 20 AND age <= 30

-- 姓名为两个字
SELECT * FROM student WHERE name LIKE '__'

-- 身份证最后为X
SELECT * FROM student WHERE idcard LIKE '%X'

```


### DCL



#### 用户管理

```sql
-- 查询用户
USE mysql;
SELECT * FROM user

-- 创建用户
CREATE USER '用户名'@'主机名' IDENTIFIED BY '密码'

-- 修改用户密码
ALTER USER '用户名'@'主机名' IDENTIFIED WITH mysql_native_password BY '新密码'

-- 删除用户
DROP USER '用户名'@'主机名
```

```sql
-- 创建用户test，只能在当前主机localhost访问
create user 'test'@'localhost' identified by '123456'

-- 创建用户test，能在任意主机访问
create user 'test'@'%' identified by '123456'
create user 'test' identified by '123456'
```

#### 权限控制

更多权限请看 [权限一览表](#权限一览表 "权限一览表")

| 权限                | 说明               |
| ------------------- | ------------------ |
| ALL, ALL PRIVILEGES | 所有权限           |
| SELECT              | 查询数据           |
| INSERT              | 插入数据           |
| UPDATE              | 修改数据           |
| DELETE              | 删除数据           |
| ALTER               | 修改表             |
| DROP                | 删除数据库/表/视图 |
| CREATE              | 创建数据库/表      |

```sql
-- 查询权限：
SHOW GRANTS FOR '用户名'@'主机名'

-- 授予权限
GRANT 权限列表 ON 数据库名.表名 TO '用户名'@'主机名'

-- 撤销权限
REVOKE 权限列表 ON 数据库名.表名 FROM '用户名'@'主机名'
```

## 函数

#### 聚合函数

| 函数  |   功能   |
| :---: | :------: |
| COUNT | 统计数量 |
|  MAX  |  最大值  |
|  MIN  |  最小值  |
|  AVG  |  平均值  |
|  SUM  |   求和   |

```sql
SELECT COUNT(id) FROM student WHERE age >= 20 AND age <= 30
```


#### 字符串函数

| 函数  | 功能  |
| :----------: | :----------: |
| CONCAT(s1, s2, ..., sn)  | 字符串拼接，将s1, s2, ..., sn拼接成一个字符串  |
| LOWER(str)  | 将字符串全部转为小写  |
| UPPER(str)  | 将字符串全部转为大写  |
| LPAD(str, n, pad)  | 左填充，用字符串pad对str的左边进行填充，达到n个字符串长度  |
| RPAD(str, n, pad)  | 右填充，用字符串pad对str的右边进行填充，达到n个字符串长度  |
| TRIM(str)  | 去掉字符串头部和尾部的空格  |
| SUBSTRING(str, start, len)  | 返回从字符串str从start位置起的len个长度的字符串  |
| REPLACE(column, source, replace)  | 替换字符串  |

#### 数学函数

| 函数  | 功能  |
| ------------ | ------------ |
| CEIL(x)  | 向上取整  |
| FLOOR(x)  | 向下取整  |
| MOD(x, y)  | 返回x/y的模  |
| RAND() | 返回0~1内的随机数 |
| ROUND(x, y) | 求参数x的四舍五入值，保留y位小数 |

### 日期函数

| 函数  | 功能  |
| :----------: | :----------: |
| CURDATE()  | 返回当前日期  |
| CURTIME()  | 返回当前时间  |
| NOW()  | 返回当前日期和时间  |
| YEAR(date)  | 获取指定date的年份  |
| MONTH(date)  | 获取指定date的月份  |
| DAY(date)  | 获取指定date的日期  |
| DATE_ADD(date, INTERVAL expr type)  | 返回一个日期/时间值加上一个时间间隔expr后的时间值  |
| DATEDIFF(date1, date2)  | 返回起始时间date1和结束时间date2之间的天数  |

```sql
-- DATE_ADD
SELECT DATE_ADD(NOW(), INTERVAL 70 YEAR);
```

### 流程函数

| 函数  | 功能  |
| :----------: | :----------: |
| IF(value, t, f)  | 如果value为true，则返回t，否则返回f  |
| IFNULL(value1, value2)  | 如果value1不为空，返回value1，否则返回value2  |
| CASE WHEN [ val1 ] THEN [ res1 ] ... ELSE [ default ] END  | 如果val1为true，返回res1，... 否则返回default默认值  |
| CASE [ expr ] WHEN [ val1 ] THEN [ res1 ] ... ELSE [ default ] END  | 如果expr的值等于val1，返回res1，... 否则返回default默认值  |

```sql
SELECT
	name,
	(CASE WHEN age > 30 THEN '中年' ELSE '青年' END)
FROM student

SELECT
	name,
	(CASE workaddress WHEN '北京市' THEN '一线城市' WHEN '上海市' THEN '一线城市' ELSE '二线城市' END) AS '工作地址'
FROM student
```

## 约束



约束是作用于表中字段上的，可以再创建表/修改表的时候添加约束

| 约束  | 描述  | 关键字  |
| ------------ | ------------ | ------------ |
| 非空约束  | 限制该字段的数据不能为null  | NOT NULL  |
| 唯一约束  | 保证该字段的所有数据都是唯一、不重复的  | UNIQUE  |
| 主键约束  | 主键是一行数据的唯一标识，要求非空且唯一  | PRIMARY KEY  |
| 默认约束  | 保存数据时，如果未指定该字段的值，则采用默认值  | DEFAULT  |
| 检查约束（8.0.1版本后）  | 保证字段值满足某一个条件  | CHECK  |
| 外键约束  | 用来让两张图的数据之间建立连接，保证数据的一致性和完整性  | FOREIGN KEY  |

### 常用约束

| 约束条件  | 关键字  |
| ------------ | ------------ |
| 主键  | PRIMARY KEY  |
| 自动增长  | AUTO_INCREMENT |
| 不为空  | NOT NULL  |
| 唯一  | UNIQUE  |
| 逻辑条件  | CHECK  |
| 默认值  | DEFAULT  |

```sql
CREATE TABLE student (
	id int primary key AUTO_INCREMENT,
	name varchar(10) NOT NULL UNIQUE,
	age int CHECK(age > 0 AND age < 120),
	status char(1) DEFAULT '1',
	gender char(1)
)
```

### 外键约束

```sql
CREATE TABLE 表名 (
	字段名 字段类型,
	...
	[CONSTRAINT] [外键名称] FOREIGN KEY(外键字段名) REFERENCES 主表(主表列名)
)

ALTER TABLE 表名 ADD CONSTRAINT 外键名称 FOREIGN KEY (外键字段名) REFERENCES 主表(主表列名)

ALTER TABLE student add constraint student_class_id FOREIGN KEY(class_id) REFERENCES class(id)

-- 删除外键
ALTER TABLE 表名 DROP FOREIGN KEY 外键名

-- 更改删除/更新行为
ALTER TABLE 表名 ADD CONSTRAINT 外键名称 FOREIGN KEY (外键字段) REFERENCES 主表名(主表字段名) ON UPDATE 行为 ON DELETE 行为
```



删除/更新行为

| 行为  | 说明  |
| ------------ | ------------ |
| NO ACTION  | 当在父表中删除/更新对应记录时，首先检查该记录是否有对应外键，如果有则不允许删除/更新（与RESTRICT一致）  |
| RESTRICT  | 当在父表中删除/更新对应记录时，首先检查该记录是否有对应外键，如果有则不允许删除/更新（与NO ACTION一致）  |
| CASCADE  | 当在父表中删除/更新对应记录时，首先检查该记录是否有对应外键，如果有则也删除/更新外键在子表中的记录  |
| SET NULL  | 当在父表中删除/更新对应记录时，首先检查该记录是否有对应外键，如果有则设置子表中该外键值为null（要求该外键允许为null）  |
| SET DEFAULT  | 父表有变更时，子表将外键设为一个默认值（Innodb不支持）  |



## 多表查询

### 查询

```sql
-- 合并查询（笛卡尔积，会展示所有组合结果
SELECT * FROM student, class

-- 消除无效笛卡尔积
SELECT * FROM student, class WHERE student.class_id = class.id
```



### 内连接查询

内连接查询的是两张表交集的部分

```sql
-- 隐式内连接
SELECT 字段列表 FROM 表1, 表2 WHERE 条件 ...

-- 显式内连接
SELECT 字段列表 FROM 表1 [ INNER ] JOIN 表2 ON 连接条件 ...
```

显式性能比隐式高

```sql
-- 隐式
SELECT s.name, d.name FROM student AS s, class AS c WHERE s.class_id = c.id

-- 显式
SELECT s.name, c.name FROM student AS s INNER JOIN class AS c ON s.class_id = c.id
```

### 外连接查询



```sql
-- 查询左表所有数据，以及两张表交集部分数据
SELECT 字段列表 FROM 表1 LEFT [ OUTER ] JOIN 表2 ON 条件 ...

-- 查询右表所有数据，以及两张表交集部分数据
SELECT 字段列表 FROM 表1 RIGHT [ OUTER ] JOIN 表2 ON 条件 ...
```

左连接可以查询到没有class的student，右连接可以查询到没有student的class

```sql
-- 左
SELECT s.*, c.name FROM student AS s LEFT JOIN class as c ON s.class_id = c.id

-- 这条语句与下面的语句效果一样
SELECT c.name, s.* FROM class c LEFT JOIN student s on s.class_id = c.id

-- 右
SELECT c.name, s.* FROM student AS s RIGHT OUTER JOIN class as c on s.class_id = c.id
```



### 自连接查询

```sql
-- 查询学生及其所属班级领导的名字
SELECT a.name, b.name FROM student a, student b WHERE a.leader = b.id

-- 没有领导的也查询出来
SELECT a.name, b.name FROM student a LEFT JOIN student b ON a.leader = b.id
```

### 联合查询

 union, union all 把多次查询的结果合并，形成一个新的查询集

#### 注意事项

- UNION ALL 会有重复结果，UNION 不会
- 联合查询比使用or效率高，不会使索引失效

```sql
SELECT 字段列表 FROM 表A ...
UNION [ALL]
SELECT 字段列表 FROM 表B ...
```



### 子查询

| 操作符  | 描述  |
| ------------ | ------------ |
| IN  | 在指定的集合范围内，多选一  |
| NOT IN  | 不在指定的集合范围内  |
| ANY  | 子查询返回列表中，有任意一个满足即可  |
| SOME  | 与ANY等同，使用SOME的地方都可以使用ANY  |
| ALL  | 子查询返回列表的所有值都必须满足  |



```sql
-- 查询比一班所有人年龄都高的学生信息
SELECT * FROM student WHERE age > ALL(
    SELECT age FROM student
    WHERE class_id = (SELECT id FROM class WHERE name = '一班')
)

-- 查询比一班任意一学生年龄高的学生信息
SELECT * FROM student WHERE age > ANY (
    SELECT age FROM student
    WHERE class_id = (SELECT id FROM class WHERE name = '一班')
)
```



#### 行子查询

返回的结果是一行（可以是多列）常用操作符：=, <, >, IN, NOT IN

```sql
-- 查询与xxx的年龄班级相同的学生信息
SELECT * FROM student WHERE (age, class_id) = (20, 1)

SELECT * FROM student 
WHERE (age, class_id) = (SELECT age, class_id FROM student WHERE name = 'xxx');
```

#### 表子查询

```sql
-- 查询与xxx1，xxx2的班级和年龄相同的学生
SELECT * FROM student WHERE (class_id, age) IN (
    SELECT class_id, age FROM student WHERE name = 'xxx1' or name = 'xxx2'
)

-- 查询年龄大于20的学生，及其班级信息
SELECT s.*, c.* FROM (SELECT * FROM student WHERE age > 20) AS s
LEFT JOIN class AS c ON s.class_id = c.id
```

## 事务

事务是一组操作的集合，事务会把所有操作作为一个整体一起向系统提交或撤销操作请求，即这些操作要么同时成功，要么同时失败

```sql
-- 1. 查询张三账户余额
SELECT * FROM account WHERE name = '张三';

-- 2. 将张三账户余额-1000
UPDATE account set money = money - 1000 WHERE name = '张三'

-- 此语句出错后张三钱减少但是李四钱没有增加
-- 模拟sql语句错误
-- 3. 将李四账户余额+1000
UPDATE account set money = money + 1000 WHERE name = '李四'

-- 查看事务提交方式
SELECT @@AUTOCOMMIT

-- 设置事务提交方式，1为自动提交，0为手动提交，该设置只对当前会话有效
SET @@AUTOCOMMIT = 0

-- 提交事务
COMMIT

-- 回滚事务
ROLLBACK

-- 设置手动提交后上面代码改为：
SELECT * FROM account WHERE name = '张三'
UPDATE account set money = money - 1000 WHERE name = '张三'
UPDATE account set money = money + 1000 WHERE name = '李四'

commit
```



操作方式二：

```sql
-- 开启事务 也可以使用 BEGIN TRANSACTION;
START TRANSACTION

SELECT * FROM account WHERE name = '张三'
UPDATE account set money = money - 1000 WHERE name = '张三'
UPDATE account set money = money + 1000 WHERE name = '李四'

-- 提交事务
commit

-- 或者回滚
ROLLBACK
```

### 并发事务

| 问题  | 描述  |
| :----------: | :----------: |
| 脏读  | 一个事务读到另一个事务还没提交的数据  |
| 不可重复读  | 一个事务先后读取同一条记录，但两次读取的数据不同  |
| 幻读  | 一个事务按照条件查询数据时，没有对应的数据行，但是再插入数据时，又发现这行数据已经存在  |

并发事务隔离级别：

> Serializable 性能最低；Read uncommitted 性能最高，数据安全性最差



| 隔离级别  | 脏读  | 不可重复读  | 幻读  |
| :----------: | :----------: | :----------: | :----------: |
| Read uncommitted  | √  | √  | √  |
| Read committed  | ×  | √  | √  |
| Repeatable Read(默认)  | ×  | ×  | √  |
| Serializable  | ×  | ×  | ×  |

```sql
-- 查看事务隔离级别
SELECT @@TRANSACTION_ISOLATION

-- 设置事务隔离级别 SESSION 是会话级别，表示只针对当前会话有效，GLOBAL 表示对所有会话有效
SET [ SESSION | GLOBAL ] TRANSACTION ISOLATION LEVEL { READ UNCOMMITTED | READ COMMITTED | REPEATABLE READ | SERIALIZABLE }

```





## 存储引擎

```sql
-- 建表时指定存储引擎
CREATE TABLE 表名 (
	...
) ENGINE =INNODB

-- 查看当前数据库支持的存储引擎
SHOW ENGINES
```

### InnoDB

InnoDB 是一种兼顾高可靠性和高性能的通用存储引擎，在 MySQL 5.5 之后，InnoDB 是默认的 MySQL 引擎。

特点：

- DML 操作遵循 ACID 模型，支持**事务**
- **行级锁**，提高并发访问性能
- 支持**外键**约束，保证数据的完整性和正确性

文件：

- xxx.ibd: xxx代表表名，InnoDB 引擎的每张表都会对应这样一个表空间文件，存储该表的表结构（frm、sdi）、数据和索引。

参数：innodb_file_per_table，决定多张表共享一个表空间还是每张表对应一个表空间

知识点：

查看 Mysql 变量：
`show variables like 'innodb_file_per_table';`

从idb文件提取表结构数据：
（在cmd运行）
`ibd2sdi xxx.ibd`

InnoDB 逻辑存储结构：
![InnoDB逻辑存储结构](https://dhc.pythonanyWHERE.com/media/editor/逻辑存储结构_20220316030616590001.png "InnoDB逻辑存储结构")

### MyISAM

MyISAM 是 MySQL 早期的默认存储引擎。

特点：

- 不支持事务，不支持外键
- 支持表锁，不支持行锁
- 访问速度快

文件：

- xxx.sdi: 存储表结构信息
- xxx.MYD: 存储数据
- xxx.MYI: 存储索引

### Memory

Memory 引擎的表数据是存储在内存中的，受硬件问题、断电问题的影响，只能将这些表作为临时表或缓存使用。

特点：

- 存放在内存中，速度快
- hash索引（默认）

文件：

- xxx.sdi: 存储表结构信息

### 存储引擎特点

| 特点  | InnoDB  | MyISAM  | Memory  |
| ------------ | ------------ | ------------ | ------------ |
| 存储限制  | 64TB  | 有  | 有  |
| 事务安全  | 支持  | -  | -  |
| 锁机制  | 行锁  | 表锁  | 表锁  |
| B+tree索引  | 支持  | 支持  | 支持  |
| Hash索引  | -  | -  | 支持  |
| 全文索引  | 支持（5.6版本之后）  | 支持  | -  |
| 空间使用  | 高  | 低  | N/A  |
| 内存使用  | 高  | 低  | 中等  |
| 批量插入速度  | 低  | 高  | 高  |
| 支持外键  | 支持  | -  | -  |

### 存储引擎的选择

在选择存储引擎时，应该根据应用系统的特点选择合适的存储引擎。对于复杂的应用系统，还可以根据实际情况选择多种存储引擎进行组合。

- InnoDB: 如果应用对事物的完整性有比较高的要求，在并发条件下要求数据的一致性，数据操作除了插入和查询之外，还包含很多的更新、删除操作，则 InnoDB 是比较合适的选择
- MyISAM: 如果应用是以读操作和插入操作为主，只有很少的更新和删除操作，并且对事务的完整性、并发性要求不高，那这个存储引擎是非常合适的。
- Memory: 将所有数据保存在内存中，访问速度快，通常用于临时表及缓存。Memory 的缺陷是对表的大小有限制，太大的表无法缓存在内存中，而且无法保障数据的安全性

电商中的足迹和评论适合使用 MyISAM 引擎，缓存适合使用 Memory 引擎。

## 锁

MySql中的锁，按照锁的颗粒度分为以下三类：
- 全局锁：锁定数据库中的所有表
- 表级锁：每次操作都锁整表
  - 表独占写锁：只能写不行读，为互斥锁，排他锁
  - 表独占读锁：只能读不能写，为共享锁，可重入锁
  - 元数据锁：当该表还有未提交的事务时，不能去更改这个表的结构
  - 意向锁：
    - 意向共享锁： 由语句selec ... lock in share mode 添加，与表读锁兼容，与表写锁互斥
    - 意向排他锁： 由insert、update、delete、select ... for update 添加，与表锁都互斥，意向锁之间不互斥
- 行级锁：InnoDB是通过锁索引来实现的，索引先锁非聚组索引，再锁聚组索引
  - 行锁：锁定单行，防止其他事务对此行进行update或者delete，RC、RR隔离级别
    - 共享锁：允许一个事务去读一行，阻止其他事务获得相同数据集的排他锁
    - 排他锁：允许获取锁的事务更新数据，阻止其他事务获取相同数据集的共享锁和排他锁
  - 间隙锁：锁定索引记录，确保索引记录间隙不变，防止其他事务进行insert，产生幻读， RR隔离级别
  - 临键锁：行锁和间隙锁的组合，锁定记录也锁住索引间隙

默认情况下，InnoDB在 RR事务隔离级别中，使用 next-key 锁进行搜索和索引扫描，以防止幻读，
- 索引上的等值查询时（唯一索引），给不存在的记录加锁时会优化为间隙锁
- 索引上的等值查询（普通索引），向右遍历时最后一个值不满足查询需求时，next-key lock 退化为间隙锁
- 索引上的范围查询（唯一索引），会访问到不满足条件的第一个值为止

在MySql5.5中加入了MDL，当对一张表进行增删改的时候，加MDL读锁（共享）；当对表结构发生变更的时候，加MDL写锁

![](/doc/mysql/img-10.png)


执行语句与行锁
![](/doc/mysql/img-11.png)
```sql
# 加全局锁 可读不可写
flush tables with read locak;

# 释放全局锁
unlock tables;

# 加表锁 
lock tables <表名>... read/write;

# 释放表锁 客户端断开也会释放锁
unlock tables; 

# 查看元数据锁
select * from performance_schema.metadata_locks;

# 查看意向锁
select * from performance_schema.data_locks;

```

## 性能分析

### 查看执行频次

查看当前数据库的 INSERT, UPDATE, DELETE, SELECT 访问频次：

```sql
-- 查看当前数据库的 INSERT, UPDATE, DELETE, SELECT 访问频次
SHOW GLOBAL STATUS LIKE 'Com_______'

SHOW SESSION STATUS LIKE 'Com_______'

SHOW GLOBAL STATUS LIKE'Com_______'

```

### 慢查询日志

慢查询日志记录了所有执行时间超过指定参数（long_query_time，单位：秒，默认10秒）的所有SQL语句的日志。
MySQL的慢查询日志默认没有开启，配置my.conf，更改后记得重启MySQL服务，日志文件位置：`/var/lib/mysql/localhost-slow.log`



```text
[client]
...
[mysql]
...
[mysqld]
...
# 开启慢查询日志开关, 0为关闭
slow_query_log=1 
# 设置慢查询日志的时间为2秒，SQL语句执行时间超过2秒，就会视为慢查询，记录慢查询日志 long_query_time=2
long_query_time=2
```

查看慢查询日志开关状态

```sql
SHOW VARIABLES LIKE 'slow_query_log'
```

### profile

帮我们了解时间都耗费在哪里，通过 have_profiling 参数，能看到当前 MySQL 是否支持 profile 操作

```sql
-- 查询是否支持 profile 操作
SELECT @@have_profiling

-- 查询 profiling 是否开启
SELECT @@profiling;

-- 开启
SET profiling = 1

-- 关闭
SET profiling = 0

-- 查看SQL执行情况，默认情况下，最多保存最近15次的运行结果
SHOW PROFILES

# 查看最近一条数据的执行情况
SHOW PROFILE

# 查看指定query id的执行情况
SHOW PROFILE FOR QUERY n

# 查看指定query id的执行所占用的CPU情况
SHOW PROFILE CPU FOR QUERY n
```

![](/doc/mysql/img-1.jpg)


## SQL 优化

### 插入数据

普通插入：

1. 采用批量插入（一次插入的数据不建议超过1000条）
2. 手动提交事务
3. 主键顺序插入

大批量插入：
如果一次性需要插入大批量数据，使用insert语句插入性能较低，此时可以使用MySQL数据库提供的load指令插入。

```mysql
# 客户端连接服务端时，加上参数 --local-infile（这一行在bash/cmd界面输入）
mysql --local-infile -u root -p
# 设置全局参数local_infile为1，开启从本地加载文件导入数据的开关
set global local_infile = 1;
SELECT @@local_infile;
# 执行load指令将准备好的数据，加载到表结构中
load data local infile '/root/sql1.log' into table 'tb_user' fields terminated by ',' lines terminated by '\n';
```

### 主键优化

数据组织方式：在InnoDB存储引擎中，表数据都是根据主键顺序组织存放的，这种存储方式的表称为索引组织表（Index organized table, IOT）

页分裂：页可以为空，也可以填充一般，也可以填充100%，每个页包含了2-N行数据（如果一行数据过大，会行溢出），根据主键排列。
页合并：当删除一行记录时，实际上记录并没有被物理删除，只是记录被标记（flaged）为删除并且它的空间变得允许被其他记录声明使用。当页中删除的记录到达 MERGE_THRESHOLD（默认为页的50%），InnoDB会开始寻找最靠近的页（前后）看看是否可以将这两个页合并以优化空间使用。

MERGE_THRESHOLD：合并页的阈值，可以自己设置，在创建表或创建索引时指定

> 文字说明不够清晰明了，具体可以看视频里的PPT演示过程：https://www.bilibili.com/video/BV1Kr4y1i7ru?p=90

主键设计原则：

- 满足业务需求的情况下，尽量降低主键的长度
- 插入数据时，尽量选择顺序插入，选择使用 AUTO_INCREMENT 自增主键
- 尽量不要使用 UUID 做主键或者是其他的自然主键，如身份证号
- 业务操作时，避免对主键的修改

### order by优化

1. Using filesort：通过表的索引或全表扫描，读取满足条件的数据行，然后在排序缓冲区 sort buffer 中完成排序操作，所有不是通过索引直接返回排序结果的排序都叫 FileSort 排序
2. Using index：通过有序索引顺序扫描直接返回有序数据，这种情况即为 using index，不需要额外排序，操作效率高

如果order by字段全部使用升序排序或者降序排序，则都会走索引，但是如果一个字段升序排序，另一个字段降序排序，则不会走索引，explain的extra信息显示的是`Using index, Using filesort`，如果要优化掉Using filesort，则需要另外再创建一个索引，如：`create index idx_user_age_phone_ad on tb_user(age asc, phone desc);`，此时使用`SELECT id, age, phone FROM tb_user order by age asc, phone desc;`会全部走索引

总结：

- 根据排序字段建立合适的索引，多字段排序时，也遵循最左前缀法则
- 尽量使用覆盖索引
- 多字段排序，一个升序一个降序，此时需要注意联合索引在创建时的规则（ASC/DESC）
- 如果不可避免出现filesort，大数据量排序时，可以适当增大排序缓冲区大小 sort_buffer_size（默认256k）

### group by优化

- 在分组操作时，可以通过索引来提高效率
- 分组操作时，索引的使用也是满足最左前缀法则的

如索引为`idx_user_pro_age_stat`，则句式可以是`SELECT ... WHERE profession order by age`，这样也符合最左前缀法则

### limit优化

常见的问题如`limit 2000000, 10`，此时需要 MySQL 排序前2000000条记录，但仅仅返回2000000 - 2000010的记录，其他记录丢弃，查询排序的代价非常大。
优化方案：一般分页查询时，通过创建覆盖索引能够比较好地提高性能，可以通过覆盖索引加子查询形式进行优化

例如：

```mysql
-- 此语句耗时很长
SELECT * FROM tb_sku limit 9000000, 10;
-- 通过覆盖索引加快速度，直接通过主键索引进行排序及查询
SELECT id FROM tb_sku order by id limit 9000000, 10;
-- 下面的语句是错误的，因为 MySQL 不支持 in 里面使用 limit
-- SELECT * FROM tb_sku WHERE id in (SELECT id FROM tb_sku order by id limit 9000000, 10);
-- 通过连表查询即可实现第一句的效果，并且能达到第二句的速度
SELECT * FROM tb_sku as s, (SELECT id FROM tb_sku order by id limit 9000000, 10) as a WHERE s.id = a.id;
```

### count优化

MyISAM 引擎把一个表的总行数存在了磁盘上，因此执行 count(\*) 的时候会直接返回这个数，效率很高（前提是不适用WHERE）；
InnoDB 在执行 count(\*) 时，需要把数据一行一行地从引擎里面读出来，然后累计计数。
优化方案：自己计数，如创建key-value表存储在内存或硬盘，或者是用redis

count的几种用法：

- 如果count函数的参数（count里面写的那个字段）不是NULL（字段值不为NULL），累计值就加一，最后返回累计值
- 用法：count(\*)、count(主键)、count(字段)、count(1)
- count(主键)跟count(\*)一样，因为主键不能为空；count(字段)只计算字段值不为NULL的行；count(1)引擎会为每行添加一个1，然后就count这个1，返回结果也跟count(\*)一样；count(null)返回0

各种用法的性能：

- count(主键)：InnoDB引擎会遍历整张表，把每行的主键id值都取出来，返回给服务层，服务层拿到主键后，直接按行进行累加（主键不可能为空）
- count(字段)：没有not null约束的话，InnoDB引擎会遍历整张表把每一行的字段值都取出来，返回给服务层，服务层判断是否为null，不为null，计数累加；有not null约束的话，InnoDB引擎会遍历整张表把每一行的字段值都取出来，返回给服务层，直接按行进行累加
- count(1)：InnoDB 引擎遍历整张表，但不取值。服务层对于返回的每一层，放一个数字 1 进去，直接按行进行累加
- count(\*)：InnoDB 引擎并不会把全部字段取出来，而是专门做了优化，不取值，服务层直接按行进行累加

按效率排序：count(字段) < count(主键) < count(1) < count(\*)，所以尽量使用 count(\*)

### UPDATE优化（避免行锁升级为表锁）

InnoDB 的行锁是针对索引加的锁，不是针对记录加的锁，并且该索引不能失效，否则会从行锁升级为表锁。

如以下两条语句：
`UPDATE student set no = '123' WHERE id = 1;`，这句由于id有主键索引，所以只会锁这一行；
`UPDATE student set no = '123' WHERE name = 'test';`，这句由于name没有索引，所以会把整张表都锁住进行数据更新，解决方法是给name字段添加索引


# 权限一览表

> 具体权限的作用详见[官方文档](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html "官方文档")

GRANT 和 REVOKE 允许的静态权限

| Privilege                                                    | Grant Table Column           | Context                               |
| :----------------------------------------------------------- | :--------------------------- | :------------------------------------ |
| [`ALL [PRIVILEGES]`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_all) | Synonym for “all privileges” | Server administration                 |
| [`ALTER`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_alter) | `Alter_priv`                 | Tables                                |
| [`ALTER ROUTINE`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_alter-routine) | `Alter_routine_priv`         | Stored routines                       |
| [`CREATE`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_create) | `Create_priv`                | Databases, tables, or indexes         |
| [`CREATE ROLE`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_create-role) | `Create_role_priv`           | Server administration                 |
| [`CREATE ROUTINE`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_create-routine) | `Create_routine_priv`        | Stored routines                       |
| [`CREATE TABLESPACE`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_create-tablespace) | `Create_tablespace_priv`     | Server administration                 |
| [`CREATE TEMPORARY TABLES`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_create-temporary-tables) | `Create_tmp_table_priv`      | Tables                                |
| [`CREATE USER`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_create-user) | `Create_user_priv`           | Server administration                 |
| [`CREATE VIEW`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_create-view) | `Create_view_priv`           | Views                                 |
| [`DELETE`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_delete) | `Delete_priv`                | Tables                                |
| [`DROP`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_drop) | `Drop_priv`                  | Databases, tables, or views           |
| [`DROP ROLE`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_drop-role) | `Drop_role_priv`             | Server administration                 |
| [`EVENT`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_event) | `Event_priv`                 | Databases                             |
| [`EXECUTE`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_execute) | `Execute_priv`               | Stored routines                       |
| [`FILE`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_file) | `File_priv`                  | File access on server host            |
| [`GRANT OPTION`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_grant-option) | `Grant_priv`                 | Databases, tables, or stored routines |
| [`INDEX`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_index) | `Index_priv`                 | Tables                                |
| [`INSERT`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_insert) | `Insert_priv`                | Tables or columns                     |
| [`LOCK TABLES`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_lock-tables) | `Lock_tables_priv`           | Databases                             |
| [`PROCESS`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_process) | `Process_priv`               | Server administration                 |
| [`PROXY`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_proxy) | See `proxies_priv` table     | Server administration                 |
| [`REFERENCES`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_references) | `References_priv`            | Databases or tables                   |
| [`RELOAD`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_reload) | `Reload_priv`                | Server administration                 |
| [`REPLICATION CLIENT`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_replication-client) | `Repl_client_priv`           | Server administration                 |
| [`REPLICATION SLAVE`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_replication-slave) | `Repl_slave_priv`            | Server administration                 |
| [`SELECT`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_SELECT) | `SELECT_priv`                | Tables or columns                     |
| [`SHOW DATABASES`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_show-databases) | `Show_db_priv`               | Server administration                 |
| [`SHOW VIEW`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_show-view) | `Show_view_priv`             | Views                                 |
| [`SHUTDOWN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_shutdown) | `Shutdown_priv`              | Server administration                 |
| [`SUPER`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_super) | `Super_priv`                 | Server administration                 |
| [`TRIGGER`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_trigger) | `Trigger_priv`               | Tables                                |
| [`UPDATE`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_UPDATE) | `UPDATE_priv`                | Tables or columns                     |
| [`USAGE`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_usage) | Synonym for “no privileges”  | Server administration                 |

GRANT 和 REVOKE 允许的动态权限

| Privilege                                                    | Context                                           |
| :----------------------------------------------------------- | :------------------------------------------------ |
| [`APPLICATION_PASSWORD_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_application-password-admin) | Dual password administration                      |
| [`AUDIT_ABORT_EXEMPT`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_audit-abort-exempt) | Allow queries blocked by audit log filter         |
| [`AUDIT_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_audit-admin) | Audit log administration                          |
| [`AUTHENTICATION_POLICY_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_authentication-policy-admin) | Authentication administration                     |
| [`BACKUP_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_backup-admin) | Backup administration                             |
| [`BINLOG_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_binlog-admin) | Backup and Replication administration             |
| [`BINLOG_ENCRYPTION_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_binlog-encryption-admin) | Backup and Replication administration             |
| [`CLONE_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_clone-admin) | Clone administration                              |
| [`CONNECTION_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_connection-admin) | Server administration                             |
| [`ENCRYPTION_KEY_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_encryption-key-admin) | Server administration                             |
| [`FIREWALL_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_firewall-admin) | Firewall administration                           |
| [`FIREWALL_EXEMPT`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_firewall-exempt) | Firewall administration                           |
| [`FIREWALL_USER`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_firewall-user) | Firewall administration                           |
| [`FLUSH_OPTIMIZER_COSTS`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_flush-optimizer-costs) | Server administration                             |
| [`FLUSH_STATUS`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_flush-status) | Server administration                             |
| [`FLUSH_TABLES`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_flush-tables) | Server administration                             |
| [`FLUSH_USER_RESOURCES`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_flush-user-resources) | Server administration                             |
| [`GROUP_REPLICATION_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_group-replication-admin) | Replication administration                        |
| [`GROUP_REPLICATION_STREAM`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_group-replication-stream) | Replication administration                        |
| [`INNODB_REDO_LOG_ARCHIVE`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_innodb-redo-log-archive) | Redo log archiving administration                 |
| [`NDB_STORED_USER`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_ndb-stored-user) | NDB Cluster                                       |
| [`PASSWORDLESS_USER_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_passwordless-user-admin) | Authentication administration                     |
| [`PERSIST_RO_VARIABLES_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_persist-ro-variables-admin) | Server administration                             |
| [`REPLICATION_APPLIER`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_replication-applier) | `PRIVILEGE_CHECKS_USER` for a replication channel |
| [`REPLICATION_SLAVE_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_replication-slave-admin) | Replication administration                        |
| [`RESOURCE_GROUP_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_resource-group-admin) | Resource group administration                     |
| [`RESOURCE_GROUP_USER`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_resource-group-user) | Resource group administration                     |
| [`ROLE_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_role-admin) | Server administration                             |
| [`SESSION_VARIABLES_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_session-variables-admin) | Server administration                             |
| [`SET_USER_ID`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_set-user-id) | Server administration                             |
| [`SHOW_ROUTINE`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_show-routine) | Server administration                             |
| [`SYSTEM_USER`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_system-user) | Server administration                             |
| [`SYSTEM_VARIABLES_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_system-variables-admin) | Server administration                             |
| [`TABLE_ENCRYPTION_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_table-encryption-admin) | Server administration                             |
| [`VERSION_TOKEN_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_version-token-admin) | Server administration                             |
| [`XA_RECOVER_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_xa-recover-admin) | Server administration=                            |

# 其他

1. 在SQL语句之后加上`\G`会将结果的表格形式转换成行文本形式
2. 查看Mysql数据库占用空间：
```mysql
SELECT table_schema "Database Name"
     , SUM(data_length + index_length) / (1024 * 1024) "Database Size in MB"
FROM information_schema.TABLES
GROUP BY table_schema;
```

