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