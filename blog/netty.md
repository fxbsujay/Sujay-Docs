---
outline: deep
---
# Netty 源码分析
> 

[Netty](https://netty.io/) 是一个基于Java NIO的网络编程框架，提供了一套高效的、事件驱动的异步网络通信机制。简化了网络应用程序的开发过程，提供了可靠的、高性能的网络传输

## Netty启动流程
```java
// netty 中使用 NioEventLoopGroup （简称 nio boss 线程）来封装线程和 selector
Selector selector = Selector.open(); 

// 创建 NioServerSocketChannel，同时会初始化它关联的 handler，以及为原生ssc存储config
NioServerSocketChannel attachment = new NioServerSocketChannel();

// 创建 NioServerSocketChannel 时，创建了 java 原生的 ServerSocketChannel
ServerSocketChannel serverSocketChannel = ServerSocketChannel.open(); 
serverSocketChannel.configureBlocking(false);

// 启动 nio boss 线程执行接下来的操作

//注册（仅关联 selector 和 NioServerSocketChannel），未关注事件
SelectionKey selectionKey = serverSocketChannel.register(selector, 0, attachment);

// head -> 初始化器 -> ServerBootstrapAcceptor -> tail
// 初始化器是一次性的，只为添加 acceptor

// 绑定端口
serverSocketChannel.bind(new InetSocketAddress(8080));

// 触发 channel active 事件，在 head 中关注 op_accept 事件
selectionKey.interestOps(SelectionKey.OP_ACCEPT);
```

- 获得选择器Selector，Netty中使用 NioEventloopGroup 中的 NioEventloop 封装了线程和选择器
- 创建 NioServerSocketChannel，该Channel作为附件添加到 ServerSocketChannel 中
- 创建 ServerSocketChannel，将其设置为非阻塞模式，并注册到Selector中，`此时未关注事件，但是添加了附件NioServerSocketChannel`
- 绑定端口
- 通过 interestOps 设置感兴趣的事件

------

选择器Selector的创建是在NioEventloopGroup中完成的。NioServerSocketChannel与ServerSocketChannel的创建，ServerSocketChannel注册到Selector中以及绑定操作都是由`bind`方法完成的

所以服务器启动的入口便是`io.netty.bootstrap.ServerBootstrap.bind`
```java
public ChannelFuture bind(SocketAddress localAddress) {
	validate();
	return doBind(ObjectUtil.checkNotNull(localAddress, "localAddress"));
}
```

### doBind
> 真正完成初始化、注册以及绑定的方法是io.netty.bootstrap.AbstractBootstrap.doBind
> dobind方法在主线程中执行

```java
private ChannelFuture doBind(final SocketAddress localAddress) {
    // 负责 NioServerSocketChannel 和 ServerSocketChannel 的创建
    // ServerSocketChannel 的注册工作
    // init由main线程完成，regisetr由NIO线程完成
    final ChannelFuture regFuture = initAndRegister();
    final Channel channel = regFuture.channel();
    if (regFuture.cause() != null) {
        return regFuture;
    }

    // 因为register操作是异步的
    // 所以要判断主线程执行到这里时，register操作是否已经执行完毕
    if (regFuture.isDone()) {
        
        // 执行doBind0绑定操作
        doBind0(regFuture, channel, localAddress, promise);
        return promise;
    } else {
        // 如果register操作还没执行完，就会到这个分支中来
        final PendingRegistrationPromise promise
            = new PendingRegistrationPromise(channel);
        
        // 添加监听器，NIO线程异步进行doBind0操作
        regFuture.addListener(new ChannelFutureListener() {
            @Override
            public void operationComplete(ChannelFuture future) throws Exception {
                Throwable cause = future.cause();
                if (cause != null) {
                    promise.setFailure(cause);
                } else {
                    promise.registered();

                    doBind0(regFuture, channel, localAddress, promise);
                }
            }
        });
        return promise;
    }
}
```

- initAndRegister
- doBind0则负责连接的创建工作


### initAndRegisterd

> 主要负责NioServerSocketChannel和ServerSocketChannel的创建（主线程中完成）与ServerSocketChannel注册（NIO线程中完成）工作
```java
final ChannelFuture initAndRegister() {
    Channel channel = null;
    try {
        channel = channelFactory.newChannel();
        init(channel);
    } catch (Throwable t) {
        if (channel != null) {
            channel.unsafe().closeForcibly();
            return new DefaultChannelPromise(
                channel, GlobalEventExecutor.INSTANCE).setFailure(t);
        }
        
        return new DefaultChannelPromise(
            new FailedChannel(), GlobalEventExecutor.INSTANCE).setFailure(t);
    }

    ChannelFuture regFuture = config().group().register(channel);
    if (regFuture.cause() != null) {
        if (channel.isRegistered()) {
            channel.close();
        } else {
            channel.unsafe().closeForcibly();
        }
    }

    return regFuture;
}
```
#### 初始化
init(channel) 方法
```java
Channel channel = null;
try {
    // 通过反射初始化 NioServerSocketChannel
    channel = channelFactory.newChannel();
    init(channel);
}
```
newChannel() 方法
```java
@Override
public T newChannel() {
    try {
        // 通过反射调用 NioServerSocketChannel 的构造方法
        // 创建 NioServerSocketChannel 对象
        return constructor.newInstance();
    } catch (Throwable t) {
        throw new ChannelException(constructor.getDeclaringClass(), t)
    }
}
```
NioServerSocketChannel() 构造方法
```java
public NioServerSocketChannel() {
    // 创建了ServerSocketChannel实例
    this(newSocket(DEFAULT_SELECTOR_PROVIDER));
}
```
newSocket() 方法
```java
private static ServerSocketChannel newSocket(SelectorProvider provider) {
    try {
        // ServerSocketChannel.open 方法：
        // SelectorProvider.provider().openServerSocketChannel()
	    // 所以此处相当于 ServerSocketChannel.open()
        // 创建了 ServerSocketChannel 实例
    	return provider.openServerSocketChannel();
	} catch (IOException e) {
  	  throw new ChannelException("Failed to open a server socket.", e);
	}
}
```
#### 注册

promise.channel().unsafe().register(this, promise) 方法
```java
@Override
public final void register(EventLoop eventLoop, final ChannelPromise promise) {
    ...

    // 获取EventLoop
    AbstractChannel.this.eventLoop = eventLoop;

   	// 此处完成了由 主线程 到 NIO线程 的切换
    // eventLoop.inEventLoop()用于判断当前线程是否为NIO线程
    if (eventLoop.inEventLoop()) {
        register0(promise);
    } else {
        try {
            // 向NIO线程中添加任务
            eventLoop.execute(new Runnable() {
                @Override
                public void run() {
                    // 该方法中会执行doRegister
                    // 执行真正的注册操作
                    register0(promise);
                }
            });
        } catch (Throwable t) {
           ...
        }
    }
}
```
register0() 方法
```java
private void register0(ChannelPromise promise) {
    try {
       	...
            
        // 执行真正的注册操作
        doRegister();
        neverRegistered = false;
        registered = true;

        // 调用init中的initChannel方法
        pipeline.invokeHandlerAddedIfNeeded();

        ...
    } catch (Throwable t) {
        ...
    }
}
```
doRegister() 方法
```java
@Override
protected void doRegister() throws Exception {
    boolean selected = false;
    for (;;) {
        try {
            // javaChannel()即为ServerSocketChannel
            // eventLoop().unwrappedSelector()获取eventLoop中的Selector
            // this为NIOServerSocketChannel，作为附件
            selectionKey = 
                javaChannel().register(eventLoop().unwrappedSelector(), 0, this);
            return;
        } catch (CancelledKeyException e) {
            ...
           
        }
    }
}
```
回调 initChannel()
```java
@Override
public void initChannel(final Channel ch) {
    final ChannelPipeline pipeline = ch.pipeline();
    ChannelHandler handler = config.handler();
    if (handler != null) {
        pipeline.addLast(handler);
    }

    // 添加新任务，任务负责添加handler
    // 该handler负责发生Accepet事件后建立连接
    ch.eventLoop().execute(new Runnable() {
        @Override
        public void run() {
            pipeline.addLast(new ServerBootstrapAcceptor(
                    ch, currentChildGroup, currentChildHandler,
                     currentChildOptions, currentChildAttrs));
        }
    });
}
```
Register主要完成了以下三个操作

- 完成了主线程到NIO的线程切换
   - 通过 `eventLoop.inEventLoop()` 进行线程判断，判断当前线程是否为NIO线程
   - 切换的方式为让eventLoop执行register的操作
   - register的操作在NIO线程中完成调用doRegister方法
```java
// javaChannel()即为ServerSocketChannel
// eventLoop().unwrappedSelector()获取eventLoop中的Selector
// this为NIOServerSocketChannel，作为附件
selectionKey = javaChannel().register(eventLoop().unwrappedSelector(), 0, this);
```

- 将ServerSocketChannel注册到EventLoop的Selector中
   - 此时还未关注事件
   - 添加NioServerSocketChannel附件
- 通过invokeHandlerAddedIfNeeded调用init中的initChannel方法
   - initChannel方法主要创建了两个handler
      - 一个handler负责设置配置
      - 一个handler负责发生Accept事件后建立连接

### doBind0
绑定端口

在 doRegister 和 invokeHandlerAddedIfNeeded 操作中的完成后，会调用 safeSetSuccess(promise) 方法，向Promise中设置执行成功的结果。此时 doBind 方法中由 initAndRegister 返回的ChannelFuture对象regFuture便会由NIO线程异步执行doBind0绑定操作

```java
// initAndRegister为异步方法，会返回ChannelFuture对象
final ChannelFuture regFuture = initAndRegister();
regFuture.addListener(new ChannelFutureListener() {
    @Override
    public void operationComplete(ChannelFuture future) throws Exception {
        Throwable cause = future.cause();
        if (cause != null) {
            // Registration on the EventLoop failed so fail the ChannelPromise directly to not cause an
            // IllegalStateException once we try to access the EventLoop of the Channel.
            promise.setFailure(cause);
        } else {
            // Registration was successful, so set the correct executor to use.
            // See https://github.com/netty/netty/issues/2586
            promise.registered();
            // 如果没有异常，则执行绑定操作
            doBind0(regFuture, channel, localAddress, promise);
        }
    }
});
```
doBind0最底层调用的是ServerSocketChannel的bind方法

NioServerSocketChannel.doBind方法

通过该方法，绑定了对应的端口
```java
@SuppressJava6Requirement(reason = "Usage guarded by java version check")
@Override
protected void doBind(SocketAddress localAddress) throws Exception {
    if (PlatformDependent.javaVersion() >= 7) {
        // 调用ServerSocketChannel的bind方法，绑定端口
        javaChannel().bind(localAddress, config.getBacklog());
    } else {
        javaChannel().socket().bind(localAddress, config.getBacklog());
    }
}
```
关注事件

在绑定端口操作完成后，会判断各种所有初始化操作是否已经完成，若完成，则会添加ServerSocketChannel感兴趣的事件<br />​<br />
```java
if (!wasActive && isActive()) {
    invokeLater(new Runnable() {
        @Override
        public void run() {
            pipeline.fireChannelActive();
        }
    });
}
```
最终在 `AbstractNioChannel.doBeginRead` 方法中，会添加ServerSocketChannel添加Accept事件

```java
@Override
protected void doBeginRead() throws Exception {
    // Channel.read() or ChannelHandlerContext.read() was called
    final SelectionKey selectionKey = this.selectionKey;
    if (!selectionKey.isValid()) {
        return;
    }
    readPending = true;
    final int interestOps = selectionKey.interestOps();
    // 如果ServerSocketChannel没有关注Accept事件
    if ((interestOps & readInterestOp) == 0) {
        // 则让其关注Accepet事件
        // readInterestOp 取值是 16
        // 在 NioServerSocketChannel 创建时初始化
        selectionKey.interestOps(interestOps | readInterestOp);
    }
}
```
:::warning 注意
此处设置interestOps时使用的方法，避免覆盖关注的其他事件
:::

首先获取Channel所有感兴趣的事件
```java
final int interestOps = selectionKey.interestOps();
```
然后再设置其感兴趣的事件
```java
selectionKey.interestOps(interestOps | readInterestOp);
```
各个事件对应的值

![](/doc/netty-principle/img-0.png)

### 总结
通过上述步骤，完成了

- NioServerSocketChannel与ServerSocketChannel的创建
- ServerSocketChannel绑定到EventLoop的Selecot中，并添加NioServerSocketChannel附件
- 绑定了对应的端口
- 关注了Accept事件

## NioEventLoop剖析

### 组成
NioEventLoop的重要组成部分有三个

Selector
```java
public final class NioEventLoop extends SingleThreadEventLoop {
    
    ...
        
    // selector中的selectedKeys是基于数组的
    // unwrappedSelector中的selectedKeys是基于HashSet的    
    private Selector selector;
    private Selector unwrappedSelector;
    private SelectedSelectionKeySet selectedKeys;
    
    ...
}
```

Thread与TaskQueue

```java
public abstract class SingleThreadEventExecutor extends AbstractScheduledEventExecutor implements OrderedEventExecutor {
    // 任务队列
    private final Queue<Runnable> taskQueue;

    // 线程
    private volatile Thread thread;
}
```
#### Selector的创建
Selector是在NioEventLoop的构造方法中被创建的

```java
NioEventLoop(NioEventLoopGroup parent, Executor executor, SelectorProvider selectorProvider, SelectStrategy strategy, RejectedExecutionHandler rejectedExecutionHandler, EventLoopTaskQueueFactory queueFactory) {
    
        ...
           
        // 初始化selector，初始化过程在openSelector中
        final SelectorTuple selectorTuple = openSelector();
        this.selector = selectorTuple.selector;
        this.unwrappedSelector = selectorTuple.unwrappedSelector;
}


private SelectorTuple openSelector() {
    final Selector unwrappedSelector;
    try {
        // 此处等同于 Selector.open()方法
        // 创建了unwrappedSelector对象
        unwrappedSelector = provider.openSelector();
    } catch (IOException e) {
        throw new ChannelException("failed to open a new selector", e);
    }
}
```
NioEventLoop的构造方法中，调用了 openSelector() 方法， 该方法会返回一个 SelectorTuple 对象，该方法是创建 Selector 的核心方法。openSelector() 方法内部调用了
```java
unwrappedSelector = provider.openSelector();
```
获得了 Selector 对象 unwrappedSelector

后面会通过反射，修改 unwrappedSelector中SelectedKeys 的实现，然后通过 SelectedSelectionKeySetSelector 方法获得 selector。最后通过 SelectorTuple 的构造方法，将该 Selector 的值赋给 SelectorTuple 类中的 selector 与 unwrappedSelector
```java
private static final class SelectorTuple {
    final Selector unwrappedSelector;
    final Selector selector;

    SelectorTuple(Selector unwrappedSelector) {
        this.unwrappedSelector = unwrappedSelector;
        this.selector = unwrappedSelector;
    }

    /**
    * 一般调用的是这个构造方法
    */
    SelectorTuple(Selector unwrappedSelector, Selector selector) {
        this.unwrappedSelector = unwrappedSelector;
        this.selector = selector;
    }
}
```
再通过 NioEventLoop 的构造方法，将 SelectorTuple 中的 Selector 赋值给 NioEventLoop中的Selector

#### 两个Selector
NioEventLoop中有selector和unwrappedSelector两个Selector，它们的区别主要在于SelectedKeys的数据结构

- selector中的SelectedKeys是基于数组的
- unwrappedSelector中的是基于HashSet的

<div class="tip custom-block line">
这样做的主要目的是，数组的遍历效率要高于HashSet
</div>

```java
private SelectorTuple openSelector() {
    final Selector unwrappedSelector;
    try {
        unwrappedSelector = provider.openSelector();
    } catch (IOException e) {
        throw new ChannelException("failed to open a new selector", e);
    }

    ...
    
    // 获得基于数组的selectedKeySet实现
    final SelectedSelectionKeySet selectedKeySet = new SelectedSelectionKeySet();


    Object maybeException = AccessController.doPrivileged(new PrivilegedAction<Object>() {
        @Override
        public Object run() {
            try {
                // 通过反射拿到unwrappedSelector中的selectedKeys属性
                Field selectedKeysField = selectorImplClass.getDeclaredField("selectedKeys");
                Field publicSelectedKeysField = selectorImplClass.getDeclaredField("publicSelectedKeys");

                ...
	
                // 暴力反射，修改私有属性
                Throwable cause = ReflectionUtil.trySetAccessible(selectedKeysField, true);
                if (cause != null) {
                    return cause;
                }
                cause = ReflectionUtil.trySetAccessible(publicSelectedKeysField, true);
                if (cause != null) {
                    return cause;
                }

                // 替换为基于数组的selectedKeys实现
                selectedKeysField.set(unwrappedSelector, selectedKeySet);
                publicSelectedKeysField.set(unwrappedSelector, selectedKeySet);
                return null;
            } catch (NoSuchFieldException e) {
                return e;
            } catch (IllegalAccessException e) {
                return e;
            }
        }
    });

    selectedKeys = selectedKeySet;
    
    // 调用构造函数，创建unwrappedSelector与selector
    return new SelectorTuple(unwrappedSelector,
                             new SelectedSelectionKeySetSelector(unwrappedSelector, selectedKeySet));
}
```


获得数组实现SelectedKeys的Selector的原理是反射，主要步骤如下

- 获得基于数组的selectedKeySet实现
```java
// 获得基于数组的selectedKeySet实现
final SelectedSelectionKeySet selectedKeySet = new SelectedSelectionKeySet();

SelectedSelectionKeySet() {
	keys = new SelectionKey[1024];
}
```

- 通过反射拿到unwrappedSelector中的SelectedKeySet并将其替换为selectedKeySet
- 通过Selector的构造方法获得selector
```java
new SelectedSelectionKeySetSelector(unwrappedSelector, selectedKeySet)
```

- 通过SelectorTuple的构造方法获得拥有两种Selector的SelectorTuple对象，并返回给NioEventLoop
```java
// 调用构造函数，创建unwrappedSelector与selector
return new SelectorTuple(unwrappedSelector, new SelectedSelectionKeySetSelector(unwrappedSelector, selectedKeySet));
```

### NIO线程启动时机
启动NioEventLoop中的线程，在首次执行任务时，才会被创建，且只会被创建一次

测试代码
```java
public class TestNioEventLoop {
    public static void main(String[] args) {
        EventLoop eventLoop = new NioEventLoopGroup().next();
        // 使用NioEventLoop执行任务
        eventLoop.execute(()->{
            System.out.println("hello");
        });
    }
}
```
进入execute执行任务
```java
@Override
public void execute(Runnable task) {
    // 检测传入的任务是否为空，为空会抛出NullPointerException
    ObjectUtil.checkNotNull(task, "task");
    // 执行任务
    // 此处判断了任务是否为懒加载任务，wakesUpForTask的返回值只会为true
    execute(task, !(task instanceof LazyRunnable) && wakesUpForTask(task));
}
```
进入上述代码的execute方法
```java
private void execute(Runnable task, boolean immediate) {
    // 判断当前线程是否为NIO线程
    // 判断方法为 return thread == this.thread;
    // this.thread即为NIO线程，首次执行任务时，其为null
    boolean inEventLoop = inEventLoop();
    
    // 向任务队列taskQueue中添加任务
    addTask(task);
    
    // 当前线程不是NIO线程，则进入if语句
    if (!inEventLoop) {
        // 启动NIO线程的核心方法
        startThread();
        
        ...
        
    }
	
    // 有任务需要被执行时，唤醒阻塞的NIO线程
    if (!addTaskWakesUp && immediate) {
        wakeup(inEventLoop);
    }
}
```
进入startThread方法
```java
private void startThread() {
    // 查看NIO线程状态是否为未启动
    // 该if代码块只会执行一次
    // state一开始的值就是ST_NOT_STARTED
    // private volatile int state = ST_NOT_STARTED;
    if (state == ST_NOT_STARTED) {
        // 通过原子属性更新器将状态更新为启动（ST_STARTED）
        if (STATE_UPDATER.compareAndSet(this, ST_NOT_STARTED, ST_STARTED)) {
            boolean success = false;
            try {
                // 执行启动线程
                doStartThread();
                success = true;
            } finally {
                if (!success) {
                    STATE_UPDATER.compareAndSet(this, ST_STARTED, ST_NOT_STARTED);
                }
            }
        }
    }
}
```
进入doStartThread，真正创建NIO线程并执行任务
```java
private void doStartThread() {
    assert thread == null;
    // 创建NIO线程并执行任务
    executor.execute(new Runnable() {
        @Override
        public void run() {
            // thread即为NIO线程
            thread = Thread.currentThread();
            if (interrupted) {
                thread.interrupt();
            }

            boolean success = false;
            updateLastExecutionTime();
            try {
                // 执行内部run方法
                SingleThreadEventExecutor.this.run();
                success = true;
            } 
            
            ...
    });
}
```
通过SingleThreadEventExecutor.this.run()执行传入的任务（task）

该run方法是NioEvnetLoop的run方法
```java
@Override
protected void run() {
    int selectCnt = 0;
    // 死循环，不断地从任务队列中获取各种任务来执行
    for (;;) {	
      	// 执行各种任务
   		try {
            int strategy;
            try {
                strategy = selectStrategy.calculateStrategy(selectNowSupplier, hasTasks());
                switch (strategy) {
                case SelectStrategy.CONTINUE:
                    continue;

                case SelectStrategy.BUSY_WAIT:
                    // fall-through to SELECT since the busy-wait is not supported with NIO

                case SelectStrategy.SELECT:
                    long curDeadlineNanos = nextScheduledTaskDeadlineNanos();
                    if (curDeadlineNanos == -1L) {
                        curDeadlineNanos = NONE; // nothing on the calendar
                    }
                    nextWakeupNanos.set(curDeadlineNanos);
                    try {
                        if (!hasTasks()) {
                            strategy = select(curDeadlineNanos);
                        }
                    } finally {
                        // This update is just to help block unnecessary selector wakeups
                        // so use of lazySet is ok (no race condition)
                        nextWakeupNanos.lazySet(AWAKE);
                    }
                    // fall through
                default:
                }
       		}
    	}
	}
```
#### 唤醒
NioEvnetLoop需要IO事件、普通任务以及定时任务，任务在run方法的for循环中

```java
@Override
protected void run() {
    int selectCnt = 0;
    // 死循环，不断地从任务队列中获取各种任务来执行
    for (;;) {
      	// 执行各种任务
   		...
    }
}
```
中被执行，但该循环不会空转，执行到某些代码时，会被阻塞

run方法中有SELECT分支
```java
case SelectStrategy.SELECT:
	long curDeadlineNanos = nextScheduledTaskDeadlineNanos();
	if (curDeadlineNanos == -1L) {
        curDeadlineNanos = NONE; // nothing on the calendar
    }
	nextWakeupNanos.set(curDeadlineNanos);
	try {
    	if (!hasTasks()) {
            // 执行select方法
            strategy = select(curDeadlineNanos);
        }
    }
```
会执行NioEvnetLoop的select方法，该方法内部会根据情况，执行selector的有参和无参的select方法
```java
private int select(long deadlineNanos) throws IOException {
    // 如果没有指定阻塞事件，就调用select()
    if (deadlineNanos == NONE) {
        return selector.select();
    }
    // 否则调用select(timeoutMillis)，指定时间内未发生事件就停止阻塞
    // Timeout will only be 0 if deadline is within 5 microsecs
    long timeoutMillis = deadlineToDelayNanos(deadlineNanos + 995000L) / 1000000L;
    return timeoutMillis <= 0 ? selector.selectNow() : selector.select(timeoutMillis);
}
```
但需要注意的是，select方法是会阻塞线程的，当没有IO事件，但有其他任务需要执行时，需要唤醒线程

唤醒是通过execute最后的if代码块来完成的
```java
// 有任务需要被执行时，唤醒阻塞的NIO线程
if (!addTaskWakesUp && immediate) {
    wakeup(inEventLoop);
}
```
NioEventLoop.wakeup唤醒被selector.select方法阻塞的NIO线程
```java
@Override
protected void wakeup(boolean inEventLoop) {
    // 只有当其他线程给当前NIO线程提交任务时（如执行execute），才会被唤醒
    // 通过AtomicLong进行更新，保证每次只能有一个线程唤醒成功
    if (!inEventLoop && nextWakeupNanos.getAndSet(AWAKE) != AWAKE) {
        // 唤醒被selector.select方法阻塞的NIO线程
        selector.wakeup();
    }
}
```
唤醒时需要进行两个判断

- 判断提交任务的是否为NIO线程
   - 若是其他线程，才能唤醒NIO线程
   - 若是NIO线程自己，则不能唤醒
- 通过 `AtomicLong` 保证有多个线程同时提交任务时，只有一个线程能够唤醒NIO线程

#### SELECT分支
run方法的switch语句有多条分支，具体执行分支的代码由strategy变量控制
```java
int strategy = selectStrategy.calculateStrategy(selectNowSupplier, hasTasks());
switch (strategy) {
	...
}
```
strategy的值由calculateStrategy方法确定
```java
@Override
public int calculateStrategy(IntSupplier selectSupplier, boolean hasTasks) throws Exception {
    // selectSupplier.get() 底层是 selector.selectNow();
    return hasTasks ? selectSupplier.get() : SelectStrategy.SELECT;
}
```
该方法会根据hasTaks变量判断任务队列中是否有任务

- 若有任务，则通过selectSupplier获得strategy的值
   - get方法会selectNow方法，顺便拿到IO事件
```java
private final IntSupplier selectNowSupplier = new IntSupplier() {
    public int get() throws Exception {
        return NioEventLoop.this.selectNow();
    }
};

int selectNow() throws IOException {
    return this.selector.selectNow();
}
```

- 没有任务，就会进入SELECT分支

也就说，当任务队列中没有任务时，才会进入SELECT分支，让NIO线程阻塞，而不是空转。若有任务，则会通过get方法调用selector.selectNow方法，顺便拿到IO事件

### Java NIO空轮询BUG
Java NIO空轮询BUG也就是JavaNIO在Linux系统下的epoll空轮询问题

在NioEventLoop中，因为run方法中存在一个死循环，需要通过selector.select方法来阻塞线程。但是select方法因为BUG，可能无法阻塞线程，导致循环一直执行，使得CPU负载升高

```java
@Override
protected void run() {
    ...
    for(;;){
        ...
        // 可能发生空轮询，无法阻塞NIO线程
        strategy = select(curDeadlineNanos);  
        ...     
    
     	if(...) {
			...
     	} else if (unexpectedSelectorWakeup(selectCnt) ){
            // 通过unexpectedSelectorWakeup方法中的rebuildSelector重建selector
            // 并将selectCnt重置为0
            selectCnt = 0;
        }
	}
}
```
Netty中通过selectCnt变量来检测select方法是否发生空轮询BUG

若发生空轮询BUG，那么selectCnt的值会增长是十分迅速。当selectCnt的值大于等于SELECTOR_AUTO_REBUILD_THRESHOLD（默认512）时，Netty则判断其出现了空轮询BUG，进行如下处理
```java
if (SELECTOR_AUTO_REBUILD_THRESHOLD > 0 && selectCnt >= SELECTOR_AUTO_REBUILD_THRESHOLD) {
    // The selector returned prematurely many times in a row.
    // Rebuild the selector to work around the problem.
    logger.warn("Selector.select() returned prematurely {} times in a row; rebuilding Selector {}.",selectCnt, selector);
    // 重建selector，将原selector的配置信息传给新selector
    // 再用新selector覆盖旧selector
    rebuildSelector();
    return true;
}
```
通过rebuildSelector方法重建selector，将原selector的配置信息传给新selector，再用新selector覆盖旧selector。同时将selectCnt的值设置为0

### ioRatio
NioEventLoop可以处理IO事件和其他任务。不同的操作所耗费的时间是不同的，想要控制NioEventLoop处理IO事件花费时间占执行所有操作的总时间的比例，需要通过ioRatio来控制

NioEventLoop.run方法
```java
// 处理IO事件时间比例，默认为50%
final int ioRatio = this.ioRatio;

// 如果IO事件时间比例设置为100%
if (ioRatio == 100) {
    try {
        // 如果需要去处理IO事件
        if (strategy > 0) {
            // 先处理IO事件
            processSelectedKeys();
        }
    } finally {
        // Ensure we always run tasks.
        // 剩下的时间都去处理普通任务和定时任务
        ranTasks = runAllTasks();
    }
} else if (strategy > 0) { // 如果需要去处理IO事件
    // 记录处理IO事件前的时间
    final long ioStartTime = System.nanoTime();
    try {
        // 去处理IO事件
        processSelectedKeys();
    } finally {
        // Ensure we always run tasks.
        // ioTime为处理IO事件耗费的事件
        final long ioTime = System.nanoTime() - ioStartTime;
        // 计算出处理其他任务的事件
        // 超过设定的时间后，将会停止任务的执行，会在下一次循环中再继续执行
        ranTasks = runAllTasks(ioTime * (100 - ioRatio) / ioRatio);
    }
} else { // 没有IO事件需要处理
    // This will run the minimum number of tasks
    // 直接处理普通和定时任务
    ranTasks = runAllTasks(0); 
}
```
通过ioRatio控制各个任务执行的过程如下

- 判断ioRatio是否为100
   - 若是，判断是否需要处理IO事件（strategy>0）
      - 若需要处理IO事件，则先处理IO事件
   - 若否（或IO事件已经处理完毕），接下来去执行所有的普通任务和定时任务，直到所有任务都被处理完
```java
// 没有指定执行任务的时间
ranTasks = runAllTasks();
```
若ioRatio不为100

- 先去处理IO事件，记录处理IO事件所花费的事件保存在ioTime中
- 接下来去处理其他任务，根据ioTime与ioRatio计算执行其他任务可用的时间
```java
// 比如ioTime为10s，ioRatio为50
// 那么通过 10*(100-50)/50=10 计算出其他任务可用的时间为 10s
// 处理IO事件占用的事件总比例为50%
ranTasks = runAllTasks(ioTime * (100 - ioRatio) / ioRatio);
```
   - 执行其他任务一旦超过可用时间，则会停止执行，在下一次循环中再继续执行
- 若没有IO事件需要处理，则去执行最少数量的普通任务和定时任务
```java
// 运行最少数量的任务
ranTasks = runAllTasks(0);
```

### 处理事件
IO事件是通过NioEventLoop.processSelectedKeys()方法处理的
```java
private void processSelectedKeys() {
    // 如果selectedKeys是基于数组的
    // 一般情况下都走这个分支
    if (selectedKeys != null) {
        // 处理各种IO事件
        processSelectedKeysOptimized();
    } else {
        processSelectedKeysPlain(selector.selectedKeys());
    }
}
```
processSelectedKeysOptimized方法
```java
private void processSelectedKeysOptimized() {
    for (int i = 0; i < selectedKeys.size; ++i) {
        // 拿到SelectionKeyec
        final SelectionKey k = selectedKeys.keys[i];
        // null out entry in the array to allow to have it GC'ed once the Channel close
        // See https://github.com/netty/netty/issues/2363
        selectedKeys.keys[i] = null;

        // 获取SelectionKey上的附件，即NioServerSocketChannel
        final Object a = k.attachment();

        if (a instanceof AbstractNioChannel) {
            // 处理事件，传入附件NioServerSocketChannel
            processSelectedKey(k, (AbstractNioChannel) a);
        } else {
            @SuppressWarnings("unchecked")
            NioTask<SelectableChannel> task = (NioTask<SelectableChannel>) a;
            processSelectedKey(k, task);
        }

        if (needsToSelectAgain) {
            // null out entries in the array to allow to have it GC'ed once the Channel close
            // See https://github.com/netty/netty/issues/2363
            selectedKeys.reset(i + 1);

            selectAgain();
            i = -1;
        }
    }
}
```
该方法中通过fori的方法，遍历基于数组的SelectedKey，通过
```java
final SelectionKey k = selectedKeys.keys[i];
```
获取到SelectionKey，**然后获取其再Register时添加的附件NioServerSocketChannel**
```java
// 获取SelectionKey上的附件，即NioServerSocketChannel
final Object a = k.attachment();
```
如果附件继承自AbstractNioChannel，则会调用
```java
// 处理事件，传入附件NioServerSocketChannel
processSelectedKey(k, (AbstractNioChannel) a);
```
去处理各个事件

真正处理各种事件的方法processSelectedKey

获取SelectionKey的事件，然后进行相应处理
```java
private void processSelectedKey(SelectionKey k, AbstractNioChannel ch) {
    final AbstractNioChannel.NioUnsafe unsafe = ch.unsafe();
    if (!k.isValid()) {
        final EventLoop eventLoop;
        try {
            eventLoop = ch.eventLoop();
        } catch (Throwable ignored) {
            // If the channel implementation throws an exception because there is no event loop, we ignore this
            // because we are only trying to determine if ch is registered to this event loop and thus has authority
            // to close ch.
            return;
        }
        // Only close ch if ch is still registered to this EventLoop. ch could have deregistered from the event loop
        // and thus the SelectionKey could be cancelled as part of the deregistration process, but the channel is
        // still healthy and should not be closed.
        // See https://github.com/netty/netty/issues/5125
        if (eventLoop == this) {
            // close the channel if the key is not valid anymore
            unsafe.close(unsafe.voidPromise());
        }
        return;
    }

    try {
        int readyOps = k.readyOps();
        // We first need to call finishConnect() before try to trigger a read(...) or write(...) as otherwise
        // the NIO JDK channel implementation may throw a NotYetConnectedException.
        if ((readyOps & SelectionKey.OP_CONNECT) != 0) {
            // remove OP_CONNECT as otherwise Selector.select(..) will always return without blocking
            // See https://github.com/netty/netty/issues/924
            int ops = k.interestOps();
            ops &= ~SelectionKey.OP_CONNECT;
            k.interestOps(ops);

            unsafe.finishConnect();
        }

        // Process OP_WRITE first as we may be able to write some queued buffers and so free memory.
        if ((readyOps & SelectionKey.OP_WRITE) != 0) {
            // Call forceFlush which will also take care of clear the OP_WRITE once there is nothing left to write
            ch.unsafe().forceFlush();
        }

        // Also check for readOps of 0 to workaround possible JDK bug which may otherwise lead
        // to a spin loop
        if ((readyOps & (SelectionKey.OP_READ | SelectionKey.OP_ACCEPT)) != 0 || readyOps == 0) {
            unsafe.read();
        }
    } catch (CancelledKeyException ignored) {
        unsafe.close(unsafe.voidPromise());
    }
}
```
## Accept剖析
### NIO中处理Accept事件流程

- selector.select()阻塞线程，直到事件发生
- 遍历selectionKeys
- 获取一个key，判断事件类型是否为Accept

---

- 创建SocketChannel，设置为非阻塞
- 将SocketChannel注册到selector中
- 关注selectionKeys的read事件

代码如下
```java
// 阻塞直到事件发生
selector.select();

Iterator<SelectionKey> iter = selector.selectionKeys().iterator();
while (iter.hasNext()) {    
    // 拿到一个事件
    SelectionKey key = iter.next();
    
    // 如果是 accept 事件
    if (key.isAcceptable()) {
        
        // 执行accept，获得SocketChannel
        SocketChannel channel = serverSocketChannel.accept();
        channel.configureBlocking(false);
        
        // 将SocketChannel注册到selector中，并关注read事件
        channel.register(selector, SelectionKey.OP_READ);
    }
    // ...
}
```
其中前三步，在NioEventLoop剖析中已经分析过了，所以接下来主要分析后三步

### SocketChannel的创建与注册
发生Accept事件后，会执行NioEventLoop.run方法的如下if分支
```java
if ((readyOps & (SelectionKey.OP_READ | SelectionKey.OP_ACCEPT)) != 0 || readyOps == 0) {
	unsafe.read();
}
```
NioMessageUnsafe.read方法
```java
public void read() {

    ...
    
    try {
        try {
            do {
				// doReadMessages中执行了accept获得了SocketChannel
                // 并创建NioSocketChannel作为消息放入readBuf
                // readBuf是一个ArrayList用来缓存消息
                // private final List<Object> readBuf = new ArrayList<Object>();
                int localRead = doReadMessages(readBuf);
                
                ...
                
				// localRead值为1，就一条消息，即接收一个客户端连接
                allocHandle.incMessagesRead(localRead);
            } while (allocHandle.continueReading());
        } catch (Throwable t) {
            exception = t;
        }

        int size = readBuf.size();
        for (int i = 0; i < size; i ++) {
            readPending = false;
            // 触发read事件，让pipeline上的handler处理
            // ServerBootstrapAcceptor.channelRead
            pipeline.fireChannelRead(readBuf.get(i));
        }
        
        ...
        
    } finally {
        if (!readPending && !config.isAutoRead()) {
            removeReadOp();
        }
    }
}
```
NioSocketChannel.doReadMessages方法<br />该方法中处理accpet事件，获得SocketChannel，同时创建了NioSocketChannel，作为消息放在了readBuf中
```java
@Override
protected int doReadMessages(List<Object> buf) throws Exception {
    // 处理accpet事件，获得SocketChannel
    SocketChannel ch = SocketUtils.accept(javaChannel());

    try {
        if (ch != null) {
            // 创建了NioSocketChannel，作为消息放在了readBuf中
            buf.add(new NioSocketChannel(this, ch));
            return 1;
        }
    } catch (Throwable t) {
       ...
    }

    return 0;
}
```
ServerBootstrapAcceptor.channelRead
```java
public void channelRead(ChannelHandlerContext ctx, Object msg) {
    // 这时的msg是NioSocketChannel
    final Channel child = (Channel) msg;

    // NioSocketChannel添加childHandler，即初始化器
    child.pipeline().addLast(childHandler);

    // 设置选项
    setChannelOptions(child, childOptions, logger);

    for (Entry<AttributeKey<?>, Object> e: childAttrs) {
        child.attr((AttributeKey<Object>) e.getKey()).set(e.getValue());
    }

    try {
        // 注册 NioSocketChannel到nio worker线程，接下来的处理也移交至nio worker线程
        childGroup.register(child).addListener(new ChannelFutureListener() {
            @Override
            public void operationComplete(ChannelFuture future) throws Exception {
                if (!future.isSuccess()) {
                    forceClose(child, future.cause());
                }
            }
        });
    } catch (Throwable t) {
        forceClose(child, t);
    }
}
```
通过AbstractUnsafe.register 方法，将SocketChannel注册到了Selector中，过程与启动流程中的Register过程类似
```java
public final void register(EventLoop eventLoop, final ChannelPromise promise) {
    
    ...

    AbstractChannel.this.eventLoop = eventLoop;

    if (eventLoop.inEventLoop()) {
        register0(promise);
    } else {
        try {
            // 这行代码完成的是nio boss -> nio worker线程的切换
            eventLoop.execute(new Runnable() {
                @Override
                public void run() {
                    // 真正的注册操作
                    register0(promise);
                }
            });
        } catch (Throwable t) {
            ...
        }
    }
}
```
AbstractChannel.AbstractUnsafe.register0
```java
private void register0(ChannelPromise promise) {
    try {
        
        ...
            
        // 该方法将SocketChannel注册到Selector中
        doRegister();
        
        // 执行初始化器，执行前 pipeline 中只有 head -> 初始化器 -> tail
        pipeline.invokeHandlerAddedIfNeeded();
        // 执行后就是 head -> logging handler -> my handler -> tail

        safeSetSuccess(promise);
        pipeline.fireChannelRegistered();
        
        if (isActive()) {
            if (firstRegistration) {
                // 触发pipeline上active事件
                pipeline.fireChannelActive();
            } else if (config().isAutoRead()) {
                beginRead();
            }
        }
    } catch (Throwable t) {
        closeForcibly();
        closeFuture.setClosed();
        safeSetFailure(promise, t);
    }
}
```
AbstractNioChannel.doRegister将SocketChannel注册到Selector中
```java
@Override
protected void doRegister() throws Exception {
    boolean selected = false;
    for (;;) {
        try {
            // 将Selector注册到Selector中
            selectionKey = javaChannel().register(eventLoop().unwrappedSelector(), 0, this);
            return;
        } catch (CancelledKeyException e) {
            ...
        }
    }
}
```
HeadContext.channelActive
```java
public void channelActive(ChannelHandlerContext ctx) {
    ctx.fireChannelActive();
	// 触发read(NioSocketChannel这里read只是为了触发channel的事件注册，还未涉及数据读取)
    readIfIsAutoRead();
}
```
AbstractNioChannel.doBeginRead，通过该方法，SocketChannel关注了read事件
```java
protected void doBeginRead() throws Exception {
    // Channel.read() or ChannelHandlerContext.read() was called
    final SelectionKey selectionKey = this.selectionKey;
    if (!selectionKey.isValid()) {
        return;
    }

    readPending = true;
	// 这时候 interestOps是0
    final int interestOps = selectionKey.interestOps();
    if ((interestOps & readInterestOp) == 0) {
        // 关注read事件
        selectionKey.interestOps(interestOps | readInterestOp);
    }
}
```
## Read剖析
read事件的处理也是在
```java
if ((readyOps & (SelectionKey.OP_READ | SelectionKey.OP_ACCEPT)) != 0 || readyOps == 0) {
	unsafe.read();
}
```
分支中，通过unsafe.read()方法处理的，不过此处调用的方法在AbstractNioByteChannel.NioByteUnsafe类中
```java
@Override
public final void read() {
    // 获得Channel的配置
    final ChannelConfig config = config();
    if (shouldBreakReadReady(config)) {
        clearReadPending();
        return;
    }
    final ChannelPipeline pipeline = pipeline();
	// 根据配置创建ByteBufAllocator（池化非池化、直接非直接内存）
	final ByteBufAllocator allocator = config.getAllocator();
    // 用来分配 byteBuf，确定单次读取大小
    final RecvByteBufAllocator.Handle allocHandle = recvBufAllocHandle();
    allocHandle.reset(config);

    ByteBuf byteBuf = null;
    boolean close = false;
    try {
        do {
            // 创建ByteBuf
            byteBuf = allocHandle.allocate(allocator);
            // 读取内容，放入ByteBUf中
            allocHandle.lastBytesRead(doReadBytes(byteBuf));
            if (allocHandle.lastBytesRead() <= 0) {
                byteBuf.release();
                byteBuf = null;
                close = allocHandle.lastBytesRead() < 0;
                if (close) {
                    readPending = false;
                }
                break;
            }

            allocHandle.incMessagesRead(1);
            readPending = false;
            // 触发read 事件，让pipeline上的handler处理
            // 这时是处理NioSocketChannel上的handler
            pipeline.fireChannelRead(byteBuf);
            byteBuf = null;
        } 
        // 是否要继续循环
        while (allocHandle.continueReading());

        allocHandle.readComplete();
        // 触发 read complete事件
        pipeline.fireChannelReadComplete();

        if (close) {
            closeOnRead(pipeline);
        }
    } catch (Throwable t) {
        handleReadException(pipeline, byteBuf, t, close, allocHandle);
    } finally {
         // Check if there is a readPending which was not processed yet.
         // This could be for two reasons:
         // * The user called Channel.read() or ChannelHandlerContext.read() in channelRead(...) method
         // * The user called Channel.read() or ChannelHandlerContext.read() in channelReadComplete(...) method
         //
         // See https://github.com/netty/netty/issues/2254
        if (!readPending && !config.isAutoRead()) {
            removeReadOp();
        }
    }
}
```
DefaultMaxMessagesRecvByteBufAllocator.MaxMessageHandle.continueReading(io.netty.util.UncheckedBooleanSupplier)
```java
public boolean continueReading(UncheckedBooleanSupplier maybeMoreDataSupplier) {
    return 
           // 一般为true
           config.isAutoRead() &&
           // respectMaybeMoreData默认为true
           // maybeMoreDataSupplier的逻辑是如果预期读取字节与实际读取字节相等，返回true
           (!respectMaybeMoreData || maybeMoreDataSupplier.get()) &&
           // 小于最大次数，maxMessagePerRead默认16
           totalMessages < maxMessagePerRead &&
           // 实际读到了数据
           totalBytesRead > 0;
}
```
