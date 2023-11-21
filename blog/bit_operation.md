# 位运算

位运算是一种计算机中的基本运算，它针对二进制位进行操作。Java中的位运算符包括按位与（&）、按位或（|）、按位异或（^）、取反（~）以及左移位和右移位运算符（<<, >>, >>>）等

位运算由于其操作简单、速度快、使用灵活等特点，在很多计算机领域都有广泛的应用，主要有以下几个方面的原因：

1. 提高计算速度：位运算是直接对数字二进制表示进行操作，不需要进行转换，因此比其他运算方法更快。
2. 节省内存：位运算能够将多个标志位压缩在一起，并且可以通过位运算进行操作。这种方式可以很好地节省内存空间。
3. 位运算在图像处理、加密解密、压缩等领域非常有用，比如可以通过位运算来进行图像的压缩和解压缩，提高数据的传输效率。
4. 位运算使得代码更具可读性和可维护性，同时也让代码更加高效、简洁、易于理解和调试。



## 按位与（&）

按位与运算是指两个二进制数对应位上的数字都为1时，结果位上的数字才为1；否则结果位上的数字为0。按位与通常用于掩码操作或清零操作

```tex
3 & 5 = 1
3 的二进制表示为 0011
5 的二进制表示为 0101
& 的运算规则：
    0 & 0 = 0
    0 & 1 = 0
    1 & 0 = 0
    1 & 1 = 1
因此，3 & 5 = 0011 & 0101 = 0001 = 1
```

按位与运算主要用于掩码操作或清零操作。通过按位与运算可以将某些二进制位设置为0，从而达到掩码操作或清零操作的目的

例如：

- 判断一个数是否为奇数：x & 1 == 1
- 清除一个数的二进制末n位：x & (~0 << n)

```java
int a = 63; // 二进制：0011 1111
int b = 15; // 二进制：0000 1111
int c = a & b; // 二进制：0000 1111
System.out.println("a & b = " + c); // 输出：a & b = 15

int x = 10; // 二进制：1010
if ((x & 1) == 1) {
    System.out.println(x + " is odd number."); // 输出：10 is odd number.
} else {
    System.out.println(x + " is even number.");
}

int num = 0b1111_0000_1111_0101;
int n = 8;
num &= ~(0xFF >>> n);
System.out.println(Integer.toBinaryString(num)); // 输出：1111
```



##  按位或（|）

按位或运算是指两个二进制数对应位上的数字有一个为1时，结果位上的数字就为1。按位或运算通常用于设置某些二进制位为1

```
3 | 5 = 7
3 的二进制表示为 0011
5 的二进制表示为 0101
| 的运算规则：
    0 | 0 = 0
    0 | 1 = 1
    1 | 0 = 1
    1 | 1 = 1
因此，3 | 5 = 0011 | 0101 = 0111 = 7
```

按位或运算主要用于设置某些二进制位为1。通过按位或运算可以将某些二进制位设置为1，从而达到设置操作的目的。

例如：

- 将一个数的二进制末n位设置为1：x | ((1 << n) - 1)

```java
int a = 63; // 二进制：0011 1111
int b = 15; // 二进制：0000 1111
int c = a | b; // 二进制：0011 1111
System.out.println("a | b = " + c); // 输出：a | b = 63

int x = 10; // 二进制：1010
x |= 1; // 将x的最后一位设置为1，即变成奇数
System.out.println(x); // 输出：11

int num = 0b1111;
int n = 8;
num |= (0xFF >>> n);
System.out.println(Integer.toBinaryString(num)); // 输出：1111_1111
```

 

## 按位异或（^）

按位异或运算是指两个二进制数对应位上的数字不相同时，结果位上的数字为1；否则结果位上的数字为0。按位异或运算通常用于加密和解密操作

```
3 ^ 5 = 6
3 的二进制表示为 0011
5 的二进制表示为 0101
^ 的运算规则：
    0 ^ 0 = 0
    0 ^ 1 = 1
    1 ^ 0 = 1
    1 ^ 1 = 0
因此，3 ^ 5 = 0011 ^ 0101 = 0110 = 6
```

按位异或运算主要用于加密和解密操作。通过按位异或运算可以将某些二进制位取反，达到加密或解密的目的。

例如：

- 加密字符串：s1 ^ s2
- 取消加密：s1 ^ s2 ^ s2 = s1

```java
public static void main(String[] args) {
    int a = 63; // 二进制：0011 1111
    int b = 15; // 二进制：0000 1111
    int c = a ^ b; // 二进制：0011 0000
    System.out.println("a ^ b = " + c); // 输出：a ^ b = 48

    String s1 = "hello";
    String s2 = "world";
    String encrypted = encrypt(s1, s2);
    String decrypted = encrypt(encrypted, s2);
    System.out.println(encrypted); // 输出：¦¥ã¤ï
    System.out.println(decrypted); // 输出：hello

    int x = 10; // 二进制：1010
    int y = 5;  // 二进制：0101
    x ^= y;     // x = 1010 ^ 0101 = 1111
    y ^= x;     // y = 0101 ^ 1111 = 1010
    x ^= y;     // x = 1111 ^ 1010 = 0101
    System.out.println(x + " " + y); // 输出：5 10
}

private static String encrypt(String s1, String s2) {
    char[] chars1 = s1.toCharArray();
    char[] chars2 = s2.toCharArray();
    StringBuilder builder = new StringBuilder();
    for (int i = 0; i < chars1.length; i++) {
        builder.append((char) (chars1[i] ^ chars2[i % chars2.length]));
    }
    return builder.toString();
}
```



## 按位取反（~）

按位取反运算是指一个二进制数的每个位取反，即0变成1，1变成0

```
~3 = -4
3 的二进制表示为 0011
~ 的运算规则：
    ~0 = -1
    ~1 = -2
    ~2 = -3
    ~3 = -4
因此，~3 = 1100 = -4
```

按位取反运算主要用于一些特殊的应用场景，如在某些加密算法中，通过连续两次按位取反操作可以恢复原值

```java
 int a = 63; // 二进制：0011 1111
int b = ~a; // 二进制：1100 0000
System.out.println("~a = " + b); // 输出：~a = -64

int x = 10; // 二进制：1010
int y = ~x; // 二进制：0101
System.out.println(y); // 输出：-11

int num = 10; // 二进制：1010
num = (~num) & 0xFF; // 二进制：0101
System.out.println(num); // 输出：5
```



## 左移运算（<<）

左移运算是将一个数的二进制位向左移动指定的位数，因此在左移运算中，左移操作数的值相当于乘以 22 的左移位数次幂。左移操作数的数据类型可以是 int、long 和任意基本数据类型的 char、short、byte

```
3 << 2 = 12
3 的二进制表示为 0011
3 << 2 的运算过程如下：
    0011 -> 1100
因此，3 << 2 = 12
```

左移运算主要用于实现乘法运算，通过将乘数左移运算后得到结果。例如，对于 a * 4，可以使用 a << 2 来代替

```java
int a = 3; // 二进制：0011
int b = a << 2; // 二进制：1100
System.out.println("a << 2 = " + b); // 输出：a << 2 = 12

int c = 10; // 二进制：1010
int d = c << 1; // 二进制：10100
System.out.println("c << 1 = " + d); // 输出：c << 1 = 20

int e = 5; // 二进制：0101
int f = e << 3; // 二进制：0101000
System.out.println("e << 3 = " + f); // 输出：e << 3 = 40
```



## 右移运算（>>）

右移运算是将一个数的二进制位向右移动指定的位数，其特点是符号位不变，空出来的高位补上原符号位的值。右移操作数的数据类型可以是 int、long 和任意基本数据类型的 char、short、byte

```
-6 >> 1 = -3
-6 的二进制表示为 1111 1111 1111 1111 1111 1111 1111 1010
-6 >> 1 的运算过程如下：
    1111 1111 1111 1111 1111 1111 1111 1010 -> 1111 1111 1111 1111 1111 1111 1111 1101
因此，-6 >> 1 = -3
```

注意：对于正数而言，右移运算和无符号右移运算结果相同

右移运算主要用于实现除法运算，通过将被除数右移运算后得到结果。例如，对于 a / 2，可以使用 a >> 1 来代替

```java
int a = -6; // 二进制：1111 1111 1111 1111 1111 1111 1111 1010
int b = a >> 1; // 二进制：1111 1111 1111 1111 1111 1111 1111 1101
System.out.println("a >> 1 = " + b); // 输出：a >> 1 = -3

int c = 10; // 二进制：1010
int d = c >> 1; // 二进制：0101
System.out.println("c >> 1 = " + d); // 输出：c >> 1 = 5

int e = 5; // 二进制：0101
int f = e >> 2; // 二进制：0001
System.out.println("e >> 2 = " + f); // 输出：e >> 2 = 1
```



## 无符号右移运算（>>>）

无符号右移运算是将一个数的二进制位向右移动指定的位数，其特点是空出来的高位用0补充。右移操作数的数据类型可以是 int、long 和任意基本数据类型的 char、short、byte

```
-6 >>> 1 = 2147483645
-6 的二进制表示为 1111 1111 1111 1111 1111 1111 1111 1010
-6 >>> 1 的运算过程如下：
    1111 1111 1111 1111 1111 1111 1111 1010 -> 0111 1111 1111 1111 1111 1111 1111 1101
因此，-6 >>> 1 = 2147483645
```

注意：对于正数而言，无符号右移运算和右移运算结果相同

无符号右移运算主要用于将有符号数转换为无符号数，或者将无符号数右移运算后得到结果

```java
int a = -6; // 二进制：1111 1111 1111 1111 1111 1111 1111 1010
int b = a >>> 1; // 二进制：0111 1111 1111 1111 1111 1111 1111 1101
System.out.println("a >>> 1 = " + b); // 输出：a >>> 1 = 2147483645
int c = 10; // 二进制：1010
int d = c >>> 1; // 二进制：0101
System.out.println("c >>> 1 = " + d); // 输出：c >>> 1 = 5

int e = -5; // 二进制：1111 1111 1111 1111 1111 1111 1111 1011
int f = e >>> 2; // 二进制：0011 1111 1111 1111 1111 1111 1111 1110
System.out.println("e >>> 2 = " + f); // 输出：e >>> 2 = 1073741822
```



## 位运算在实际问题中的应用

### 判断奇偶性

对于一个整数 n，若 n & 1 的结果为 0，则说明 n 是偶数；反之，n 是奇数

```java
int n = 7;
if ((n & 1) == 0) {
    System.out.println(n + " is even");
} else {
    System.out.println(n + " is odd");
}
```

输出结果：7 is odd



### 交换两个数的值

假设有两个整数 a 和 b，我们可以使用异或运算（^）来交换它们的值

```java
int a = 5, b = 9;
System.out.println("Before swap: a = " + a + ", b = " + b);
a ^= b;
b ^= a;
a ^= b;
System.out.println("After swap: a = " + a + ", b = " + b);
```

输出结果：

```text
Before swap: a = 5, b = 9
After swap: a = 9, b = 5
```



### 快速幂运算

快速幂运算是通过位运算实现的一种高效的幂运算算法。给定一个底数 x 和指数 n，快速幂运算可以在 O(logn) 的时间复杂度内计算出 x^n 的值。

具体来说，在快速幂运算中，我们首先将指数 n 表示为二进制数，例如 13 可以表示为二进制数 1101。然后，我们对于指数的每一位，如果该位为 1，则累乘上当前的底数 x；否则，我们只需要对当前的底数平方即可

```java
int x = 2;
int n = 13;
int res = 1;
while (n > 0) {
    if ((n & 1) == 1) {
        res *= x;
    }
    x *= x;
    n >>= 1;
}
System.out.println("2^13 = " + res);
```

输出结果：2^13 = 8192



### 判断是否是 2 的幂次方

对于一个正整数 n，如果它是 2 的幂次方，则有 n & (n - 1) == 0

```java
int n = 16;
if ((n & (n - 1)) == 0) {
    System.out.println(n + " is power of two");
} else {
    System.out.println(n + " is not power of two");
}
```

输出结果：16 is power of two



### 计算数值序列的异或和

假设有一个数值序列 a1, a2, ..., an，我们可以使用位运算中的异或运算（^）来计算它们的异或和

```java
int[] arr = {1, 2, 3, 4, 5};
int res = 0;
for (int i = 0; i < arr.length; i++) {
    res ^= arr[i];
}
System.out.println("The xor sum of the array is: " + res);
```

输出结果：The xor sum of the array is: 7

异或和运算感性理解是去掉所有相同元素，留下不同元素的和。在编程中，使用异或和运算可以在一次遍历中完成对一个数组所有元素的不同性判断



### 进制转换

在计算机科学中，二进制、八进制、十进制和十六进制之间的转换是非常常见的操作。位运算可以被用来实现快速的进制转换。

例如，将一个二进制数转换为十进制数，只需要将其每一位上的数值乘以对应的权值后相加即可。对于一个长度为 n 的二进制数，这个过程可以被实现为

```java
String binaryString = "11010100";
int res = 0;
for (int i = 0; i < binaryString.length(); i++) {
    if (binaryString.charAt(i) == '1') {
        res += (1 << (binaryString.length() - i - 1));
    }
}
System.out.println(binaryString + " in decimal is: " + res);
```

输出结果：11010100 in decimal is: 212



### 位运算实现数据压缩与解压

假设有一个 String 类型的字符串，它由一些只包含 '0' 和 '1' 的字符组成。我们可以将其转换为 byte 类型的数组，每个 byte 存储 8 位二进制数

```java
String binaryString = "10101110110000101";
int length = binaryString.length();
byte[] bytes = new byte[length / 8 + ((length % 8 == 0) ? 0 : 1)];
for (int i = 0; i < length; i++) {
    if (binaryString.charAt(i) == '1') {
        bytes[i / 8] |= 1 << (i % 8);
    }
}
System.out.println(Arrays.toString(bytes));
```

输出结果：[-92, -117]



假设有一个 byte 类型的数组，其中存储了若干个压缩过的二进制数。我们可以通过位运算将其还原为字符串

```java
byte[] bytes = {-92, -117};
StringBuilder stringBuilder = new StringBuilder();
for (byte b : bytes) {
    for (int i = 0; i < 8; i++) {
        stringBuilder.append(((b & (1 << i)) > 0) ? '1' : '0');
    }
}
System.out.println(stringBuilder.toString());
```

输出结果：10101110110000101



























