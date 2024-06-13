---
description: 对Java JDK 17 新特性的概述
outline: [2, 3]
---

# JDK 新特性一览

## JDK 8

### Interface
新 interface 的方法可以用 `default` 或 `static` 修饰，这样就可以有方法体，实现类也不必重写此方法。 
一个 interface 中可以有多个方法被它们修饰，这 2 个修饰符的区别主要也是普通方法和静态方法的区别

- default修饰的方法，是普通实例方法，可以用this调用，可以被子类继承、重写
- static修饰的方法，使用上和一般类静态方法一样。但它不能被子类继承，只能用Interface调用



使用 `@FunctionalInterface` 声明接口，也称 SAM 接口，即 Single Abstract Method interfaces，有且只有一个抽象方法，但可以有多个非抽象方法的接口。注解只是在编译时起到强制规范定义的作用
```java
@FunctionalInterface
public interface Interface {

    String execute(String s);

    static void sm() {
        System.out.println("interface提供的方式实现");
    }
    
    default void def() {
        System.out.println("interface default方法");
    }
}
```

### Lambda

可以用来替代匿名内部类，简化函数式接口，允许使用 :: 关键字来传递方法或者构造函数引用。

```java
public class LambdaClassSuper {
   LambdaInterface sf(){
       return null;
   }
}

public class LambdaClass extends LambdaClassSuper {
   public static LambdaInterface staticF() {
       return null;
   }
   public LambdaInterface f() {
       return null;
   }
   void show() {
       //1.调用静态函数，返回类型必须是functional-interface
       LambdaInterface t = LambdaClass::staticF;
       //2.实例方法调用
       LambdaClass lambdaClass = new LambdaClass();
       LambdaInterface lambdaInterface = lambdaClass::f;
       //3.超类上的方法调用
       LambdaInterface superf = super::sf;
       //4. 构造方法调用
       LambdaInterface tt = LambdaClassSuper::new;
   }
}
```
lambda 表达式可以引用外边变量，但是该变量默认拥有 final 属性，不能被修改，如果修改，编译时就报错。
```java
int i = 0;
Collections.sort(strings, (Integer o1, Integer o2) -> o1 - i);
```

### Stream
Stream依然不存储数据，不同的是它可以检索(Retrieve)和逻辑处理集合数据、包括筛选、排序、统计、计数等。可以想象成是 Sql 语句。
它的源数据可以是 Collection、Array 等。由于它的方法参数都是函数式接口类型，所以一般和 Lambda 配合使用。
```java
public static void main(String[] args) {
    List<String> strings = Arrays.asList("abc", "def", "gkh", "abc");
    
    //返回符合条件的stream
    Stream<String> stringStream = strings.stream().filter(s -> "abc".equals(s));
    //计算流符合条件的流的数量
    long count = stringStream.count();

    //forEach遍历->打印元素
    strings.stream().forEach(System.out::println);

    //limit 获取到1个元素的stream
    Stream<String> limit = strings.stream().limit(1);
    //toArray 比如我们想看这个limitStream里面是什么，比如转换成String[],比如循环
    String[] array = limit.toArray(String[]::new);

    //map 对每个元素进行操作返回新流
    Stream<String> map = strings.stream().map(s -> s + "22");

    //sorted 排序并打印
    strings.stream().sorted().forEach(System.out::println);

    //Collectors collect 把abc放入容器中
    List<String> collect = strings.stream().filter(string -> "abc".equals(string)).collect(Collectors.toList());
    //把list转为string，各元素用，号隔开
    String mergedString = strings.stream().filter(string -> !string.isEmpty()).collect(Collectors.joining(","));

    //对数组的统计，比如用
    List<Integer> number = Arrays.asList(1, 2, 5, 4);

    IntSummaryStatistics statistics = number.stream().mapToInt((x) -> x).summaryStatistics();
    System.out.println("列表中最大的数 : "+statistics.getMax());
    System.out.println("列表中最小的数 : "+statistics.getMin());
    System.out.println("平均数 : "+statistics.getAverage());
    System.out.println("所有数之和 : "+statistics.getSum());

    //concat 合并流
    List<String> strings2 = Arrays.asList("xyz", "jqx");
    Stream.concat(strings2.stream(),strings.stream()).count();

    //注意 一个Stream只能操作一次，不能断开，否则会报错。
    Stream stream = strings.stream();
    //第一次使用
    stream.limit(2);
    //第二次使用
    stream.forEach(System.out::println);
    //报错 java.lang.IllegalStateException: stream has already been operated upon or closed

    //但是可以这样, 连续使用
    stream.limit(2).forEach(System.out::println);
}
```

### Optional
他建议使用 Optional 解决 NPE（java.lang.NullPointerException）问题，它就是为 NPE 而生的，其中可以包含空值或非空值
```java
class Zoo {
   private Dog dog;
}

class Dog {
   private int age;
}

Optional.ofNullable(zoo).map(o -> o.getDog()).map(d -> d.getAge()).ifPresent(age ->
    System.out.println(age)
)
```

### Date-Time API
添加了 `LocalDateTime`, `LocalDate`, `LocalTime` 等日期类，解决了 Date 类非线程安全，各种格式化、和时间计算繁琐等问题

```java
LocalDate date = LocalDate.of(2021, 1, 26);
LocalDate.parse("2021-01-26");

LocalDateTime dateTime = LocalDateTime.of(2021, 1, 26, 12, 12, 22);
LocalDateTime.parse("2021-01-26 12:12:22");

LocalTime time = LocalTime.of(12, 12, 22);
LocalTime.parse("12:12:22");

```

下面仅以一周后日期为例，其他单位（年、月、日、1/2 日、时等等）大同小异。另外，这些单位都在 java.time.temporal.ChronoUnit 枚举中定义
```java
// 一周后的日期
LocalDate localDate = LocalDate.now();
// 方法1
LocalDate after = localDate.plus(1, ChronoUnit.WEEKS);
// 方法2
LocalDate after2 = localDate.plusWeeks(1);
System.out.println("一周后日期：" + after);

// 算两个日期间隔多少天，计算间隔多少年，多少月
LocalDate date1 = LocalDate.parse("2021-02-26");
LocalDate date2 = LocalDate.parse("2021-12-23");
Period period = Period.between(date1, date2);

// 这里period.getDays()得到的天是抛去年月以外的天数，并不是总天数
System.out.println("date1 到 date2 相隔："
           + period.getYears() + "年"
           + period.getMonths() + "月"
           + period.getDays() + "天");

// 如果要获取纯粹的总天数应该用下面的方法
long day = date2.toEpochDay() - date1.toEpochDay();
System.out.println(date1 + "和" + date2 + "相差" + day + "天");

```

获取特定一个日期，比如获取本月最后一天，第一天
```java
LocalDate today = LocalDate.now();

// 获取当前月第一天：
LocalDate firstDayOfThisMonth = today.with(TemporalAdjusters.firstDayOfMonth());

// 取本月最后一天
LocalDate lastDayOfThisMonth = today.with(TemporalAdjusters.lastDayOfMonth());

// 取下一天：
LocalDate nextDay = lastDayOfThisMonth.plusDays(1);

// 当年最后一天
LocalDate lastday = today.with(TemporalAdjusters.lastDayOfYear());

// 2021年最后一个周日，如果用Calendar是不得烦死。
LocalDate lastMondayOf2021 = LocalDate.parse("2021-12-31")
    .with(TemporalAdjusters.lastInMonth(DayOfWeek.SUNDAY));
```

在新特性中引入了 java.time.ZonedDateTime 来表示带时区的时间。它可以看成是 LocalDateTime + ZoneId

```java
// 当前时区时间
ZonedDateTime zonedDateTime = ZonedDateTime.now();
System.out.println("当前时区时间: " + zonedDateTime);

// 东京时间
ZoneId zoneId = ZoneId.of(ZoneId.SHORT_IDS.get("JST"));
ZonedDateTime tokyoTime = zonedDateTime.withZoneSameInstant(zoneId);
System.out.println("东京时间: " + tokyoTime);

// ZonedDateTime 转 LocalDateTime
LocalDateTime localDateTime = tokyoTime.toLocalDateTime();
System.out.println("东京时间转当地时间: " + localDateTime);

// LocalDateTime 转 ZonedDateTime
ZonedDateTime localZoned = localDateTime.atZone(ZoneId.systemDefault());
System.out.println("本地时区时间: " + localZoned);

```



## JDK 17
### 语言特性

[JDK 17](https://www.oracle.com/java/technologies/javase/17-relnotes.html) 引入的 API，通过有效调用外部函数（即 JVM 之外的代码），以及安全地访问外部内存（JVM 之外的内存），这些 API 可以调用本地库和处理本地数据，与 Java 运行环境之外的代码和数据进行交互
这个版本提供了 14 个增强功能，另外在性能、稳定性和安全性上面也得到了大量的提升，以及还有一些孵化和预览特性，有了这些新变化，Java 会进一步提高开发人员的生产力

| id  | 特性                                                 | 说明                   |
| --- | -------------------------------------------------- | -------------------- |
| 1   | 306:Restore Always-Strict Floating-Point Semantics | 恢复始终执行严格模式的浮点定义      |
| 2   | 356:Enhanced Pseudo-Random Number Generators       | 增强型伪随机数生成器           |
| 3   | 382:New macOS Rendering Pipeline                   | 新的 macOS 渲染管道        |
| 4   | 391:macOS/AArch64 Port                             | macOS AArch64 端口     |
| 5   | 398:Deprecate the Applet API for Removal           | 弃用 Applet API        |
| 6   | 403:Strongly Encapsulate JDK Internals             | JDK 内部强封装            |
| 7   | 406:Pattern Matching for switch (Preview)          | 为 switch 支持模式匹配      |
| 8   | 407:Remove RMI Activation                          | 移除 RMI 激活            |
| 9   | 409:Sealed Classes                                 | 密封类                  |
| 10  | 410:Remove the Experimental AOT and JIT Compiler   | 移除实验性的 AOT 和 JIT 编译器 |
| 11  | 411:Deprecate the Security Manager for Removal     | 弃用安全管理器              |
| 12  | 412:Foreign Function & Memory API (Incubator)      | 外部函数和内存 API（孵化中）     |
| 13  | 414:Vector API (Second Incubator)                  | 矢量 API（二次孵化中）        |
| 14  | 415:Context-Specific Deserialization Filters       | 上下文特定反序列化过滤器         |

#### JEP 406：为 switch 支持模式匹配

老版

```java
static String formatter(Object o) {
    String formatted = "unknown";
    if (o instanceof Integer i) {
        formatted = String.format("int %d", i);
    } else if (o instanceof Long l) {
        formatted = String.format("long %d", l);
    } else if (o instanceof Double d) {
        formatted = String.format("double %f", d);
    } else if (o instanceof String s) {
        formatted = String.format("String %s", s);
    }
    return formatted;
}
```

新版

```java
static String formatterPatternSwitch(Object o) {
    return switch (o) {
        case Integer i -> String.format("int %d", i);
        case Long l    -> String.format("long %d", l);
        case Double d  -> String.format("double %f", d);
        case String s  -> String.format("String %s", s);
        default        -> o.toString();
    };
}
```

---

#### JEP 409：密封类

密封类，这个特性在 [JDK 15](https://www.oracle.com/java/technologies/javase/15-relnotes.html) 中首次成为预览特性，在 JDK 16 中进行二次预览，在 JDK 17 这个版本中终于正式转正了。
密封类可以用来增强 Java 编程语言，防止其他类或接口扩展或实现它们
类 Student 被`sealed`修饰，说明它是一个密封类，并且只允许指定的 3 个子类继承

```java
public abstract sealed class Student
    permits ZhangSan, LiSi, ZhaoLiu {
    ...

}
```

---

#### JEP 412: 外部函数和内存 API（孵化中）

改进了 [JDK 14](https://www.oracle.com/java/technologies/javase/14-relnotes.html) 和 [JDK 15](https://www.oracle.com/java/technologies/javase/14-relnotes.html) 引入的 API，通过有效调用外部函数（即 JVM 之外的代码），以及安全地访问外部内存（JVM 之外的内存），这些 API 可以调用本地库和处理本地数据，与 Java 运行环境之外的代码和数据进行交互

#### JEP 414: 矢量 API（二次孵化中）

Vector API 这是一个新的初始迭代孵化器模块，模块包：`jdk.incubator.vector`，用于表示在运行时可靠地编译到支持的 CPU 架构上的最佳矢量硬件指令的矢量计算，矢量运算可以提供优于等效标量计算的性能，并且在机器学习、人工智能和密码学等领域非常普遍
本次增强的 API 允许以一种在运行时，可靠地编译为支持的 CPU 架构上的最佳向量指令的方式表达向量计算

---

### 核心增强


#### JEP 306：恢复始终执行严格模式的浮点定义

Java 最初只有严格的浮点语义，但从 JDK 1.2 开始，为了适应当时硬件架构的限制，默认情况下允许这些严格语义中的细微变化，而现在这些都没有必要了，已被 JEP 306 删除

---

#### JEP 356：增强型伪随机数发生器

增加了伪随机数相关的类和接口来让开发者使用stream流进行操作

- RandomGenerator
- RandomGeneratorFactory

之前的 java.util.Random 和 java.util.concurrent.ThreadLocalRandom 都是 RandomGenerator 接口的实现类

```java
RandomGenerator generator = RandomGeneratorFactory.all()
    .filter(RandomGeneratorFactory::isJumpable)
    .filter(factory -> factory.stateBits() > 128)
    .findAny()
    .map(RandomGeneratorFactory::create)
    //  if you need a `JumpableGenerator`:
    //  .map(JumpableGenerator.class::cast)
    .orElseThrow();
```

---

#### JEP 382: 新的macOS渲染管道

这个新管道通过使用新的 Apple Metal API 为 macOS 实现 Java 2D 渲染管道，减少了 JDK 对已弃用的 Apple OpenGL API 的依赖

---

#### JEP 403: JDK 内部强封装

JDK 内部强封装，它是 JDK 16 中 JEP 396 的延续，JDK 16 开始对 JDK 内部大部分元素默认进行强封装，sun.misc.Unsafe 之类的关键内部 API 除外，从而限制对它们的访问。
此外，用户仍然可以选择自 JDK 9 以来的默认的宽松的强封装，这样可以帮助用户毫不费力地升级到未来的 Java 版本

---

#### JEP 415: 上下文特定反序列化过滤器

允许应用配置 context-specific 和 dynamically-selected 过滤器，通过一个 JVM 范围的过滤器工厂，用来为每个单独的反序列化操作选择一个过滤器

---

### 新平台支持

#### JEP 391 : macOS AArch64 端口

macOS AArch64 端口，即提供可适用于 macOS 的 JDK 版本，该版本可在基于 Arm 64 的较新的 macOS 系统上本地化运行

---

### 弃用和移除项

#### JEP 411: 弃用安全管理器

安全管理器从 Java 1.0 开始，这些年来它一直都不是保护 Java 应用程序代码的主要手段，也很少用于保护 Java 服务器端代码，所以这个版本标识为弃用状态了，未来的版本会进行移除

---

#### JEP 398: 弃用 Applet API

Applet 是一种运行在 Web 浏览器内的 Java 程序，但 Applet 早就没什么鸟用了，现在很少有浏览器支持 Java Applet

---

#### JEP 407: 移除 RMI 激活

RMI 激活机制已于 2020 年 9 月在 [JDK 15](https://mp.weixin.qq.com/s?__biz=MzI3ODcxMzQzMw%3D%3D&idx=1&mid=2247507309&scene=21&sn=e78cfee56a2b5cd617c0370f64f4c83d#wechat_redirect) 中移除了，远程方法调用 (RMI) 激活机制现也已被移除，需要说明的是，RMI 激活是 RMI 中一个过时的组件，自 Java 8 以来一直是可选的

---

#### JEP 410: 移除实验性的 AOT 和 JIT 编译器

AOT 和 JIT 这两个实验性的编译器，自从在 JDK 9 中引入以来几乎没有怎么使用，市面上也出现了更为广泛使用的替代方案，并且维护它们所需的工作量很大，所以在 JDK 16 中就已经删除了，本次从 [OpenJDK](https://so.csdn.net/so/search?q=OpenJDK&spm=1001.2101.3001.7020) 项目中删除了源代码


## JDK 21

### 虚拟线程
![](/doc/jdk/img-0.png)

代码层面兼容性更好，基本和原来的线程池是一样的
```java

try(var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    InStream.range(0, 10_100).forEach(i -> {
        executor.submit(() -> {
            Thread.sleep(Duration.ofSeconds(1));
            return i;
        })
    })
}

```

### Sequedced Collections
![](/doc/jdk/img-1.png)

重新统一了方法的定义
```java
interface SequedcedCollections<E> extends Collection<E> {
    SequedcedCollections<E> reversed();
    void addFirst(E);
    void addLast(E);
    void getFirst(E);
    void getLast(E);
    void removeFirst(E);
    void removeLast(E);
}

```
### 动态代理
![](/doc/jdk/img-2.png)
### 逐渐抛弃对32位的支持
### ZGC 低延迟的垃圾回收

### switch 模式匹配
```java

static String formatterPatternSwitch(Object o) {
    return switch (o) {
        case null -> String.format("Null");
        case "Foo", "Bar"  -> String.format("Foo And Bar");
        default        -> o.toString();
    };
}

```

### Record Patterns

```java
record Person(String name, int age){}

public class Main {
    public static void main(String[] args) {
        Person person = new Person("Test", 25);
        if (persion instanceof Persion p) {
            System.out.println(p.name());
            System.out.println(p.age());
        }
    }
}

```