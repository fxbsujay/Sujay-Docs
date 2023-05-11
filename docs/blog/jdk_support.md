
# JDK 17 新特性一览

## 语言特性

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

### JEP 409：密封类

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

### JEP 412: 外部函数和内存 API（孵化中）

改进了 [JDK 14](https://www.oracle.com/java/technologies/javase/14-relnotes.html) 和 [JDK 15](https://www.oracle.com/java/technologies/javase/14-relnotes.html) 引入的 API，通过有效调用外部函数（即 JVM 之外的代码），以及安全地访问外部内存（JVM 之外的内存），这些 API 可以调用本地库和处理本地数据，与 Java 运行环境之外的代码和数据进行交互

### JEP 414: 矢量 API（二次孵化中）

Vector API 这是一个新的初始迭代孵化器模块，模块包：`jdk.incubator.vector`，用于表示在运行时可靠地编译到支持的 CPU 架构上的最佳矢量硬件指令的矢量计算，矢量运算可以提供优于等效标量计算的性能，并且在机器学习、人工智能和密码学等领域非常普遍
本次增强的 API 允许以一种在运行时，可靠地编译为支持的 CPU 架构上的最佳向量指令的方式表达向量计算

---

## 核心增强

### JEP 306：恢复始终执行严格模式的浮点定义

Java 最初只有严格的浮点语义，但从 JDK 1.2 开始，为了适应当时硬件架构的限制，默认情况下允许这些严格语义中的细微变化，而现在这些都没有必要了，已被 JEP 306 删除

---

### JEP 356：增强型伪随机数发生器

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

### JEP 382: 新的macOS渲染管道

这个新管道通过使用新的 Apple Metal API 为 macOS 实现 Java 2D 渲染管道，减少了 JDK 对已弃用的 Apple OpenGL API 的依赖

---

### JEP 403: JDK 内部强封装

JDK 内部强封装，它是 JDK 16 中 JEP 396 的延续，JDK 16 开始对 JDK 内部大部分元素默认进行强封装，sun.misc.Unsafe 之类的关键内部 API 除外，从而限制对它们的访问。
此外，用户仍然可以选择自 JDK 9 以来的默认的宽松的强封装，这样可以帮助用户毫不费力地升级到未来的 Java 版本

---

### JEP 415: 上下文特定反序列化过滤器

允许应用配置 context-specific 和 dynamically-selected 过滤器，通过一个 JVM 范围的过滤器工厂，用来为每个单独的反序列化操作选择一个过滤器

---

## 新平台支持

### JEP 391 : macOS AArch64 端口

macOS AArch64 端口，即提供可适用于 macOS 的 JDK 版本，该版本可在基于 Arm 64 的较新的 macOS 系统上本地化运行

---

## 弃用和移除项

### JEP 411: 弃用安全管理器

安全管理器从 Java 1.0 开始，这些年来它一直都不是保护 Java 应用程序代码的主要手段，也很少用于保护 Java 服务器端代码，所以这个版本标识为弃用状态了，未来的版本会进行移除

---

### JEP 398: 弃用 Applet API

Applet 是一种运行在 Web 浏览器内的 Java 程序，但 Applet 早就没什么鸟用了，现在很少有浏览器支持 Java Applet

---

### JEP 407: 移除 RMI 激活

RMI 激活机制已于 2020 年 9 月在 [JDK 15](https://mp.weixin.qq.com/s?__biz=MzI3ODcxMzQzMw%3D%3D&idx=1&mid=2247507309&scene=21&sn=e78cfee56a2b5cd617c0370f64f4c83d#wechat_redirect) 中移除了，远程方法调用 (RMI) 激活机制现也已被移除，需要说明的是，RMI 激活是 RMI 中一个过时的组件，自 Java 8 以来一直是可选的

---

### JEP 410: 移除实验性的 AOT 和 JIT 编译器

AOT 和 JIT 这两个实验性的编译器，自从在 JDK 9 中引入以来几乎没有怎么使用，市面上也出现了更为广泛使用的替代方案，并且维护它们所需的工作量很大，所以在 JDK 16 中就已经删除了，本次从 [OpenJDK](https://so.csdn.net/so/search?q=OpenJDK&spm=1001.2101.3001.7020) 项目中删除了源代码

---
