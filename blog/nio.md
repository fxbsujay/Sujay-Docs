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


### Channel

由 `java.nio.channels` 包定义的。Channel表示IO源与目标打开的连接，Channel类似于传统的“流”，只不过Channel本身不能直接访问数据，Channel只能与Buffer进行交互

NIO的通道类似于流，但有些区别如下

- 通道可以同时进行读写，而流只能读或者只能写
- 通道可以实现异步读写数据
- 通道可以从缓冲读数据，也可以写数据到缓冲

BlO中的stream是单向的，例如 `FileInputStream` 对象只能进行读取数据的操作，而NIO中的通道（Channel）是双向的，可以读操作，也可以写操作

Channel在NIO中是一个接口
```java
public interface Channel extends Closeable()
```

常用的Channel实现类

- FileChannel：用于读取、写入、映射和操作文件的通道
- DatagramChannel：通过UDP读写网络中的数据通道
- SocketChannel：通过TCP读写网络中额数据
- ServerSocketChannel：可以监听新进来的TCP连接，对每一个新进来的连接都会创建一个SocketChannel

**FileChannel**
> 获取通道的一种方式是对支持通道的对象调用getChannel()方法

支持通道的类如下
- FileInputStream
- FileOutputStream
- RandomAccessFile
- DatagramSocket
- Socket
- ServerSocket

获取通道的其他方式是使用Files类的静态方法 `newByteChannel()` 获取字节通道，或通过通道的静态方法open()打开并返回指定通道

::: code-group
```java [写]
try{
  FileOutputStream fos = new FileOutputStream("data01_txt");
  FileChannel channel = fos.getChannel();
  ByteBuffer buffer = ByteBuffer.allocate(1024);
  buffer.put("Hello World".getBytes());
  buffer.flip();
  channel.write(buffer);
  channel.close();
  System.out.println("写数据到文件中");
} catch (Exception e) {
  e.printStackTrace();
}
```
```java [读]
FileInputStream is = new FileInputStream("data01_txt");
FileChannel channel = is.getChannel();
ByteBuffer buffer = ByteBuffer.allocate(1024);
channel.read(buffer);
buffer.flip();
String rs = new String(buffer.array(),0,buffer.remaining());
System.out.println(rs);
```
```java [文件复制]
File srcFile = new File("C:\\Users\\Lenovo\\Desktop\\1.jpg");
File destFile = new File("C:\\Users\\Lenovo\\Desktop\\server\\1_copy.jpg");
FileInputStream fis = new FileInputStream(srcFile);
FileOutputStream fos = new FileOutputStream(destFile);
FileChannel fisChannel = fis.getChannel();
FileChannel fosChannel = fos.getChannel();
ByteBuffer buffer = ByteBuffer.allocate(1024);
while (true){
  buffer.clear();
  int flag = fisChannel.read(buffer);
  if(flag == -1){
    break;
  }
  buffer.flip();
  fosChannel.write(buffer);
}
fisChannel.close();;
fosChannel.close();
System.out.println("复制完成");
```
:::

**分散 (Scatter) 和聚集 (Getter)**

分散读取（Scatter)：是指把Channel通道的数据读取入到多个缓存区中去，聚集写入（Gathering)：是指将多个Buffer中的数据聚集到Channel

```java
FileInputStream is = new FileInputStream("data01_txt");
FileChannel isChannel = is.getChannel();
FileOutputStream os = new FileOutputStream("data02_txt");
FileChannel osChannel = os.getChannel();
ByteBuffer buffer1 = ByteBuffer.allocate(4);
ByteBuffer buffer2 = ByteBuffer.allocate(1024);
ByteBuffer[] buffers = {buffer1,buffer2};
isChannel.read(buffers);
for(ByteBuffer buffer : buffers){
  buffer.flip();
  System.out.println(new String(buffer.array(),0,buffer.remaining()));
}
osChannel.write(buffers);
isChannel.close();
osChannel.close();
System.out.println("文件复制~");
```

### Selector

选择器（Selector）是 `SelectableChannel` 对象的多路复用器，Selector可以同时监控多个 `SelectableChannel` 的IO状况，也就是说，利用Selector可使一个单独的线程管理多个Channel，Selector是非阻塞IO的核心

![](/doc/nio/img-06.jpg)

java的NIO，用非阻塞的IO方式。可以用一个线程，处理多个的客户端连接，就会使用到Selector（选择器）

Selector能够检测多个注册的通道上篡若有事件发生（注意：多个Channel以事件的方式可以注册到同一个 Selector)，如果有事件发生，便获取事件然后针对每个事件进行相应的处理，这样就可以只用一个单线程去管 理多个通道，也就是管理多个连接和请求

只有在连接/通道真正有读写事件发生时，才会进行读写，就大大地减少了系统开销，并且不必为每个连接都 创建一个线程，不用去维护多个线程 避免了多线程之间的上下文切换导致的开销


**创建Selector**

```java
//1.获取通道
ServerSocketChannel ssChannel = ServerSocketChannel.open();

//2.切换非阻塞模式
ssChannel.configureBlocking(false);

//3.绑定连接
ssChannel.bind(new InetSocketAddress(9898));

//4.获取选择器
Selector selector = Selector.open();

//5.将通道注册到选择器上，并且指定“监听接收事件”
ssChannel.register(select, SelectionKey.OP_ACCEPT);
```


当调用register(Selector sel, mt ops)将通道注册选择器时，选择器对通道的监听事件，需要通过第二个参数

ops指定可以监听的事件类型（用可使用Selection Key的四个常量表示）

- 读：SelectionKey.OP_READ(1)
- 写：SelectionKey.OP_WRITE(4)
- 连接：SelectionKey.OP_CONNECT(8)
- 接收：SelectionKey.OP_ACCEPT(16)
- 若注册时不止监听一个事件，则可以使用‘位或”操作符连接

```java
int interestSet = selectionKey.OP_READ | SelectionKey.OP_WERITE
```

### 案例

Selector可以实现：一个I/O线程可以并发处理N个客户端连接和读写操作，这从根本上解决了传统同步阻塞I/O一连接一线程模型，架构的性能、弹性伸缩能力和可靠性都得到了极大的提升


::: code-group
```java [Server]
public class Server {
  public static void main(String[] args) throws IOException {
    System.out.println("---服务端启动---");
    // 1.获取通道
    ServerSocketChannel ssChannel = ServerSocketChannel.open();
    // 2.切换为非阻塞模式
    ssChannel.configureBlocking(false);
    // 3.绑定连接的端口
    ssChannel.bind(new InetSocketAddress(9999));
    // 4.获取选择器
    Selector selector = Selector.open();
    // 5.将通道都注册到选择器上去，并且开始指定监听接收事件
    ssChannel.register(selector, SelectionKey.OP_ACCEPT);
    // 6.使用Selector选择器轮询已经就绪好的事件
    while(selector.select() > 0){
      System.out.println("开始一轮事件处理~~~");
      // 7.获取选择器中的所有注册的通道中已经就序好的事件
      Iterator<SelectionKey> it = selector.selectedKeys().iterator();
      // 8.开始遍历这些准备好的事件
      while(it.hasNext()){
        // 提取当前这个事件
        SelectionKey sk = it.next();
        // 9.判断这个事件具体是什么事件
        if(sk.isAcceptable()){
          // 10.直接获取当前接入的客户端通道
          SocketChannel schannel = ssChannel.accept();
          // 11.将客户端通道也设置为非阻塞式的
          schannel.configureBlocking(false);
          // 12.将客户端通道也注册到选择器Selector上
          schannel.register(selector,SelectionKey.OP_READ);
        } else if (sk.isReadable()) {
          // 13.获取当前选择器上的”读就绪事件“
          SocketChannel sChannel = (SocketChannel) sk.channel();
          // 14.开始读取数据
          ByteBuffer buf = ByteBuffer.allocate(1024);
          int len = 0;
          while ((len = sChannel.read(buf)) > 0){
            buf.flip();
            System.out.println(new String(buf.array(),0,len));
            // ”清除“之前的数据
            buf.clear();
          }
        }
        // 处理完毕当前事件后，需要移除掉当前事件.否则会重复处理
        it.remove();
      }
    }
  }
}
```
```java [Client]
public class Client {
  public static void main(String[] args) throws IOException {
    // 1.获取通道
    SocketChannel sChannel = SocketChannel.open(new
    InetSocketAddress("127.0.0.1",9999));
    // 2.切换为非阻塞模式
    sChannel.configureBlocking(false);
    // 3.分配指定缓存区大小
    ByteBuffer buf = ByteBuffer.allocate(1024);
    // 4.发送数据给服务端
    Scanner sc = new Scanner(System.in);
    while (true){
      System.out.println("请输入：");
      String msg = sc.nextLine();
      buf.put(("波仔：" + msg).getBytes());
      buf.flip();
      sChannel.write(buf);
      buf.clear();
    }
  }
}
```
:::

## Asyn-Non-Blocking IO

异步非阻塞，服务器实现模式为一个有效请求一个线程，客户端的I/O请求都是由OS先完成了再通知服务器应用去启动线程进行处理，AIO是异步非阻塞，基于NIO，可以称之为NIO2.0


|         BIO          |       NIO       | AIO |
|:--------------------:|:---------------:|:---:|
|   Socket      |  SocketChannel   |    AsynchronousSocketChanne |
| ServerSocket | ServerSocketChanne |  AsynchronousServerSocketChannel   |

与NIO不同，当进行读写操作时，只须直接调用API的read或write方法即可，这两种方法均为异步的，对于读操作而言，当有流可读时，操作系统会将可读的流传入read方法的缓冲区，对于写操作而言，当操作系统将 write方法传递的流写入完毕时，操作系统主动通知应用程序

即可以理解为，read/write方法都是异步的，完成后会主动调用回调函数。在JDK1.7中，这部分内容被称作 NIO.2，主要在 `java.nio.channel` 包下增加了下面四个异步通道

- AsynchronousSocketChannel
- AsynchronousServerSocketChannel
- AsynchronousFileChannel
- AsynchronousDatagramChannel