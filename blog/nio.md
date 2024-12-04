# 网络编程

Java的I/0模型，就是用什么样的通道或者说是通信模式和架构进行数据的传输和接收，很大程度上决定了程序
通信的性能 , Java共支持3种网络编程的I/O模型：**BlO**. **NIO**. **AlO**

## Blocking IO

同步并阻塞，服务器实现模式为一个连接一个线程，即客户端有连接请求时服务器端就
需要启动一个线程进行处理，如果这个连接不做任何事情会造成不必要的线程开销，
适用于连接数目比小且固定的架构，这种方式对服务器资源要求比较高，并发局限于应用中

### 工作机制

网络编程的基本模型是Client/Server模型，也就是两个进程之间进行相互通信，其中服务端提供位置信息（绑定IP地址和端口），客户端通过连接操作向服务端监听的端口地址发起连接请求，基于TCP协议下进行三次握手连接，连接成功后，双方通过网络套接字（Socket）进行通信。

传统的同步阻塞模型开发中，服务端 `ServerSocket` 负责绑定IP地址，启动监听端口；客户端 `Socket` 负责发起连接操作。连接成功后，双方通过输入和输出流进行同步阻塞式通信。基于BIO模式下的通信，客户端-服务端是完全同步，完全藕合的
![](/doc/nio/img-01.jpg)

::: code-group
```java [服务端]
public class Server {
    public static void main(String[] args) {
        try {
            ServerSocket ss = new ServerSocket(9999);
            Socket socket = ss.accept();
            InputStream is = socket.getInputStream();
            BufferedReader br = new BufferedReader(new InputStreamReader(is));
            String msg;
            if ((msg = br.readLine()) != null){
                System.out.println("Client Message：" + msg);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```
```java [客户端]
public class Client {
    public static void main(String[] arg) {
        try {
            Socket socket = new Socket("127.0.0.1",9999);
            OutputStream os = socket.getOutputStream();
            PrintStream ps = new PrintStream(os);
            ps.println("hello World! 服务端，你好");
            ps.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```
:::

在以上通信中，服务端会一直等待客户端的消息，如果客户端没有进行消息的发送，服务端将一直进入阻塞状态，同时服务端是按照行获取消息的，这意味育客户端也必须按照行进行消息的发送，否则服务端将进
入等待消息的阻塞状态！

### 伪异步IO
采用一个伪异步I/O的通信框架，采用线程池和任务队列实现，当客户端接入时，将客户端的 `Socket` 封装成一个 `Runnable` 交给后端的线程池中进行处理。

JDK的线程池维护一个消息队列和N个活跃的线程，对消息队列中Socket任务进行处理，由于线程池可以设置消息队列的大小和最大线程数，因此，它的资源占用是可控的

![](/doc/nio/img-02.jpg)

::: code-group
```java [服务端]
public class Server {
    public static void main(String[] args) {
        try {
            ServerSocket ss = new ServerSocket(9999);
            HandlerSocketServerPool pool = new HandlerSocketServerPool(3,10);
            while(true){
                Socket socket = ss.accept();
                Runnable target = new ServerRunnableTarget(socket);
                pool.execute(target);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    ｝
}
```
```java [Runnable]
public class ServerRunnableTarget implements Runnable {
    private Socket socket;
    public ServerRunnableTarget(Socket socket){
        this.socket = socket;
    }
    @Override
    public void run() {
        try {
            InputStream is = socket.getInputStream();
            BufferedReader br = new BufferedReader(new InputStreamReader(is));
            String msg;
            while((msg = br.readLine()) != null){
                System.out.println("服务端收到：" + msg);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
```
```java [Pool]
public class HandlerSocketServerPool {
    private ExecutorService executorService;
   
    public HandlerSocketServerPool(int maxThreadNum, int queueSize) {
        this.executorService = new ThreadPoolExecutor(3, maxThreadNum, 120,
            TimeUnit.SECONDS, new ArrayBlockingQueue<Runnable>(queueSize));
    }
 
    public void execute(Runnable target){
        executorService.execute(target);
    }
}
```
:::

## Non-Blocking IO

NIO也可以叫做 `New IO`，NIO与原来的IO有同样的作用和目的，但是使用的方式完全不同，NIO支持面向缓冲区的、基于通道的IO操作。

NIO可以理解为非阻塞IO，传统的IO 的 `read` 和 `write` 只能阻塞执行，线程在读写期间不能干其他事倩，比如调用 `socket.read(）` 时，如果服务器一直没有数据传输过来，线程就一直阻塞，而NIO中可以配置socket为非阻塞模式

NIO相关类都被放在 `java.nio` 包及子包下，并且对原Java.io包中的很多类进行改写，NIO有三大核心部分：**Channel**（通道），**Buffer**（缓冲区），**Selector**（选择器）

![](/doc/nio/img-03.jpg)


NIO的非阻塞模式，使一个线程从某通道发送请求或者读取数据，但是它仅能得到目前可用的数据，如果目前没有数据可用时，就什么都不会获取，而不是保持线程阻塞，所以直至数据变的可以读取之前，该线程可以继续做其他的事情。非阻塞写也是如此，一个线程请求写入一些数据到某通道，但不需要等待它完全写 入，这个线程同时可以去做别的事情，可以做到用一个线程来处理多个操作的


|         NIO          |                   BIO                   |
|:--------------------:|:---------------------------------------:|
|    面向缓存区（Buffer）     |               面向流（Stream）               |
| 非堵塞（Non Blocking IO） |             堵塞（Blocking IO）             |
|    选择器（Selector）     |                        |

### Buffer
一个用于特定基本数据类型的容器。由Java.nio包定义的，所有缓冲区都是Buffer抽象类的子类．Java NIO中的Buffer主要用于与NIO通道进行交互，数据是从通道读入缓冲区，从缓冲区写入通道中的

![](/doc/nio/img-04.jpg)

Buffer就像一个数组，可以保存多个相同类型的数据。根据数据类型不同，有以下Buffer常用子类：

- ByteBuffer
- CharBuffer
- ShortBuffer
- IntBuffer
- LongBuffer
- FloatBuffer
- DoubleBuffer

上述Buffer类 他们都采用相似的方法进行管理数据，只是各自管理的数据类型不同而已。都是通过如下方法获取一个Buffer对象：
```java
static ByteBuffer allocate(int capacity)
```

#### 缓存区的基本属性

- **Capacity**

  作为一个内存块，Buffer具有一定的固定大小，也称为”容量”，缓冲区容量不能为负，并且 创建后不能更改

- **Limit**

  表示缓冲区中可以操作数据的大小（Limit后数据不能进行读写），缓冲区的限制不能为负，并且不能大于其容量，写入模式，限制等于buffer的容量，读取模式下，Limit等于写入的数据量

- **Position**

  下一个要读取或写入的数据的索引，缓存区的位置不能为负，并且不能大于其限制

- **Mark**、**Reset**

  标记（Mark）是一个索引，通过Buffer中的 `mark()` 方法指定Buffer中一个特定的 `position`，之后可以通过调用 `reset()` 方法恢复到这个position

  标记、位置、限制、容量遵守以T不变式：0 <= mark <= position <= limit <= capacity

![](/doc/nio/img-05.jpg)

#### 直接与非直接缓存区

`byte buffer` 有两种类型，一种是基于直接内存（非堆内存），另一种是非直接内存（堆内存）

对于直接内存来说，JVM将会在IO操作上具有更高的性能，因为它直接作用于本地系统的IO操作。而非直接内存，也就是堆内存中的数据，如果要作IO操作，会先从本进程内存复制到直接内存，再利用本地IO处理

- 非直接内存：本地IO -> 直接内存 -> 非直接内存 -> 直接内存 -> 本地IO
- 直接内存：本地IO -> 直接内存 -> 本地IO

在做IO处理时，比如网络发送大量数据时，直接内存会具有更高的效率。直接内存使用 `allocateDirect` 创建，但是它比申请普通的堆内存需要耗费更高的性能。

不过，这部分的数据是在JVM之外的，因此它不会占用应用的内存。所以呢，当你有很大的数据要缓存，并且它的生命周期又很长，那么就比较适合使用直接内存。只是一般来说，如果不是能带来很明显的性能提升，还是推荐直接使用堆内存。字节缓冲区是直接缓冲区还是非直接缓冲区可通过调用其 `isDirect()` 方法来确定

```java
public void test(){
    ByteBuffer buffer = ByteBuffer.allocate(1024);
    System.out.println(buffer.isDirect());
    ByteBuffer buffer2 = ByteBuffer.allocateDirect(1024);
    System.out.println(buffer2.isDirect());
}
```

使用场景

- 有很大的数据需要存储，他的生命周期又很长
- 适合频繁的IO操作，比如网络并发场景
