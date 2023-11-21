# JAVA JUC（并发编程工具包）

## 线程和进程

线程的状态
```java
public enum State{
    // 新生
 	NEW,
    // 运行
    RUNNABLE,
   	// 堵塞
    BLOCKED,
    // 等待
    WAITNG,
    // 超时等待
    TIMED_WAITING,
    // 终止
    TERMINATED;
}
```

wait/sleep 区别
- 来自不同的类 
   -  wait ==> OBject
   - sleep ==> Thread
- 关于所的释放
   - wait会释放锁，sleep睡觉了，抱着锁睡，不会释放
- 使用的范围不同
   - wait 必须在同步代码块中
   - sleep可以在任何地方睡
- 是否需要捕获异常
   - wait 不需要捕获异常
   - sleep 必须捕获
## Lock锁 
```java
public static void main(String[] args){
 	   Ticket ticket = new Ticket();
}

class Ticket{
 	private int number = 30;
    
    Lock lock = bew ReentrantLock();
    
    public void sale(){
        
        lock.lock(); // 加锁
        
        try{
        	if(number > 0){
          		System.out.println(Thread.currentThread().getName() + "卖出了" + (number--) 					+ "票，剩余：" + number);
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
         	lock.unlock();  // 解锁   
        }
    }
}
```

Synchronized 和 Lock 的区别
- Synchronized 内置的java关键字，Lock是一个java类
- Synchronized 无法判断获取锁的状态，Lock 可以判断是否获取到了锁
- Synchronized 会自动释放锁，lock必须手动释放锁！如果不释放会死锁
- Synchronized 线程1（获得锁）、线程2（等待），Lock锁不一定会等待线程1 结束
- Synchronized 可重入锁，不可以中断的，非公平；lock，可重入锁，可以判断锁
- Synchronized 适合锁少量代码同步问题，Lock可以锁大量代码同步

## 生产者和消费者问题
面试必问 ： 单例模式、排序算法、生产者与消费者

```java
public class A{
 	public static void main(String[] args){
     	
        MyThread myThread = new MyThread();
        
        new Thread(() -> {
            for(int i = 0;i < 10; i++){
             	myThread.increment();
            }
        },"A").start();
        
        new Thread(() -> {
            for(int i = 0;i < 10; i++){
             	myThread.decrement();
            }
        },"B").start();
    }
}

class MyThread{
    
 	private int number  = 0;
    
    public synchronized void increment() throws InterruptedException{
     	if(number != 0){
         	// 等待
            this.wait();
        }
        number++:
        System.out.println(Thread.currentThread().getName() + "=>" + number);
        // 唤醒其他线程，我+1完毕了
        this.notifyAll();
    }
    
    public synchronized void decrement() throws InterruptedException{
     	if(number == 0){
         	// 等待
            this.wait();
        }
        number--;
        System.out.println(Thread.currentThread().getName() + "=>" + number);
        this.notifyAll();
    }
}
```
问题： 如果有A、B、C、D四个线程会出现问题

解决： 将 if 改成 while

![image.png](/doc/juc/img-0.png)

JUC版本
```java
public class A{
 	public static void main(String[] args){
     	
        MyThread myThread = new MyThread();
        
        new Thread(() -> {
            for(int i = 0;i < 10; i++){
             	myThread.increment();
            }
        },"A").start();
        
        new Thread(() -> {
            for(int i = 0;i < 10; i++){
             	myThread.decrement();
            }
        },"B").start();
        
         new Thread(() -> {
            for(int i = 0;i < 10; i++){
             	myThread.increment();
            }
        },"C").start();
        
        new Thread(() -> {
            for(int i = 0;i < 10; i++){
             	myThread.decrement();
            }
        },"D").start();
    }
}

class MyThread{
    
 	private int number  = 0;
    
    Lock lock = new ReentrantLock();
    Condition condition = lock.newCondition();
    
    public synchronized void increment() throws InterruptedException{
     	try{
     		while(number != 0){
         		// 等待
            	condition.await();
        	}
       	 	number--;
        	System.out.println(Thread.currentThread().getName() + "=>" + number);
        	condition.signalAll();
        } catch (Exception e){
			e.printStackTrace();
        } finally {
         	lock.unlock();   
        }
    }
    
    public synchronized void decrement() throws InterruptedException{
        
        try{
     		while(number == 0){
         		// 等待
            	condition.await();
        	}
       	 	number--;
        	System.out.println(Thread.currentThread().getName() + "=>" + number);
        	condition.signalAll();
        } catch (Exception e){
			e.printStackTrace();
        } finally {
         	lock.unlock();   
        }
        
    }
}
```
问题：线程不会按照顺序执行

```java
public class MyThread{
    
 	public static void main(String[] args){
        
        Data data = new Data();
        
     	new Thread(() -> {
            data.printA();
        },"A").start();  
        
        new Thread(() -> {
            data.printB();
        },"B").start();  
        
        new Thread(() -> {
            data.printC();
        },"C").start();   
        
    }
}
class Data{
    
 	private Lock lock = new ReeentrantLock();
    private Condition condition1 = lock.newCondition();
    private Condition condition2 = lock.newCondition();
    private Condition condition3 = lock.newCondition();
    private int number = 0;
    
    public void printA(){
        
        lock.lock();
     	try{
            // 业务 判断->执行->通知
            while (number !=1){
                condition1.await();
            }
            System.out.println(Thread.currentThread().getName() + "=>AAAA");
            // 唤醒指定的人 B
            number = 2;
        	condition2.signal();
        } catch (Exception e) {
            e.printStarckTrace();
        } finally {
            lock.unlock();
        }
    }
    public void printB(){
        
        lock.lock();
     	try{
            // 业务 判断->执行->通知
            while (number !=2){
                condition2.await();
            }
            System.out.println(Thread.currentThread().getName() + "=>BBBB");
            // 唤醒指定的人 B
            number = 3;
        	condition3.signal();
        } catch (Exception e) {
            e.printStarckTrace();
        } finally {
            lock.unlock();
        }
    }
    public void printC(){
        
        lock.lock();
     	try{
            // 业务 判断->执行->通知
            while (number !=3){
                condition3.await();
            }
            System.out.println(Thread.currentThread().getName() + "=>CCCC");
            // 唤醒指定的人 B
            number = 1;
        	condition1.signal();
        } catch (Exception e) {
            e.printStarckTrace();
        } finally {
            lock.unlock();
        }
    }
}
```
## 8锁现象
如何判断锁是谁，永远的知道什么锁，锁到底锁的是谁？

对象 class

new this 具体的

static Class 唯一的一个模板

## 集合类不安全

List不安全
```java
public class ListTest {
 	public static void main(String[] args){
        
        // 并发下ArrayList不安全
        /**
        	解决方案:
            	1. List<String> list = new Vector<>();
                2. 工具类 
                	List<String> list = Collections.synchronizedList(new ArrayList<>());
                3.  List<String> list = new CopyOnWriteArrayList<>();
                	CopyOnWrite 写入时复制， COW 计算机程序设计领域的一种优化策略
                	在写入的时候避免覆盖，造成数据问题  读写分离
        **/
     	List<String> list = new ArrayList<>();
        
        for(int i = 0;i < 10;i++){
            new Thread(() ->{
                list.add(UUID.randomUUID().toString().substring(0,5));
                System.out.println(list);
            },String.valueOf(i)).start();
        }
    }
}
```

Set不安全
```java
public class SetTest{
 	public static void main(String[] args){
        
         /**
         	解决方案
            	1.Set<String> set = Collections.synchronizedSet(new HashSet<>());
                2.HashSet底层：hashMap
                	
         **/
     	Set<String> set = new HashSet<>();
        
        for (int i = 0;i < 10;i++){
            
             new Thread(() ->{
                set.add(UUID.randomUUID().toString().substring(0,5));
                System.out.println(set);
            },String.valueOf(i)).start();
        }
    }
}
```

Map不安全
```java
public class MapTest{
 	public static void main(String[] args){
        
         /**
         	map 是这样用的嘛？ 不是，工作中不用 HashMap
            Map<String,String> map = new ConcurrentHashMap();
         **/
     	Map<String,String> map = new HashMap<>(16，0.75);
        
        for (int i = 0;i < 30;i++){
            
             new Thread(() ->{
                map.put(Thread.currentThread().getName(),UUID.randomUUID().toString().substring(0,5));
                System.out.println(map);
            },String.valueOf(i)).start();
        }
    }
}
```
## Callable
![image.png](/doc/juc/img-1.png)
- 可以有返回值
- 可以抛出异常
- 方法不同 run -> call

![image.png](/doc/juc/img-11.png)

## 常用辅助类

CountDownLatch 减法计数器

![image.png](/doc/juc/img-2.png)
```java
// 必须要执行任务的时候在使用
CountDownLatch countDownLatch = new CountDownLatch(6);
for (int i = 0;i < 6;i++){
            
    new Thread(() ->{
    	System.out.println(Thread.currentThread().getName() + "Go out");
        countDownLatch.countDown(); // 数量减一
    },String.valueOf(i)).start();
}
countDownLatch.await(); // 等待计数器归零，然后再向下执行
// 每次有线程调用countDown数量-1，假设计数器变为0，await就会被唤醒，继续执行
System.out.println("Close Door");

```

CyclicBarrier 加法计数器

![image.png](/doc/juc/img-3.png)

```java
CyclicBarrier cyclicBarrier = new CyclicBarrier(7),()->{
    // 加到 7 才会执行
    System.out.println("招呼神龙成功")；
});

for (int i = 0;i <= 7;i++){
    final int temp = i;
    new Thread(() ->{
    	System.out.println(Thread.currentThread().getName() + "收齐龙珠");
        cyclicBarrier.await(); // 等待
    }).start();
}
```
Semaphore 信号量

![image.png](/doc/juc/img-4.png)

```java
// 线程量，停车位 限流
Semaphore semaphore = new Semaphore(3);
for (int i = 0;i <= 6;i++){
     new Thread(() ->{
         try {
            // acquire()  得到
         	semaphore.acquire();
         	System.out.println(Thread.currentThread().getName() + "抢车位")；
         	TimeUnit.SECONDS.sleep(2);
         	System.out.println(Thread.currentThread().getName() + "离开车位")；
    	
         } catch () {
         } finally {
             // release()  释放
             semaphore.release();
         }
    },String.valueOf(i)).start();
}
```
:::tip 原理
semaphore.acquire();  获得，假设如果已经满了，等待，等待被释放为止
semaphore.release();  释放，会将当前的信号量释放为 + 1 ，然后唤醒等待的线程
作用：多个共享资源互斥的使用！并发限流，控制最大的线程数
:::

## ReadWriteLock 读写锁 

![image.png](/doc/juc/img-5.png)

```java
public class ReadWirteLock{
    
    publuc static void main(String[] args){
     	MyCache myCache = new MyCache();
        // 写入
        for(int i = 1;i <= 5;i++){
            final int temp = i;
            new Thread(()->{
        		myCache.put(temp+"",temp + "");
        	},String.valueOf(i)).start();
        }
        
        // 读取
         for(int i = 1;i <= 5;i++){
            final int temp = i;
            new Thread(()->{
        		myCache.get(temp+"");
        	},String.valueOf(i)).start();
        }
       
    }
}

class MyCache{
    
 	private volatile Map<String,Object> map = new HashMap<>();
    // private Lock lock = new RenntrantLock();
    // 更加细粒度的控制线程
    private ReadWriteLock readWriteLock = new ReentrantReadWriteLock();
    
    // 存 写  只希望同时只有一个线程写
    public void put(String key,Object value){
        // lock.lock();
        readWriteLock.writeLock();
        try {
    	 	System.out.println(Thread.currentThread().getName() + "写入key" + key)；
        	map.put(key,value);
        	System.out.println(Thread.currentThread().getName() + "写OK")；
        } catch () {
        } finally {
            // 解锁
            readWriteLock.writeLock().unlock();
        }
    }
    
     // 取 读 所有人都可以读
    public void put(String key){
        readWriteLock.readLock(); // 读锁
        try {
    	 	System.out.println(Thread.currentThread().getName() + "读取key" + key)；
       		map.get(key);
        	System.out.println(Thread.currentThread().getName() + "读取OK")；
        } catch () {
        } finally {
            // 解锁
            readWriteLock.readLock().unlock();
        }
     
    }
}
```
## 堵塞队列

![image.png](/doc/juc/img-6.png)

什么情况下使用堵塞队列？  多线程并发处理，线程池
学会使用队列
添加、移除

四组API

| **方式** | **抛出异常** | **有返回值** | **堵塞 等待** | **超时等待** |
| --- | --- | --- | --- | --- |
| 添加 | add | offer | put | offer... |
| 移除 | remove | poll | tacke | poll.... |
| 判断队首元素 | element | peek |  |  |

```java
// 抛出异常
ArrayBlockingQueue arrayBlockingQueue = new ArrayBlockingQueue<>(3); // 队列大小

System.out.println(arrayBlockingQueue.add("a"));
System.out.println(arrayBlockingQueue.add("b"));
System.out.println(arrayBlockingQueue.add("c"));

// Queue full 抛出异常
arrayBlockingQueue.add("d");
// 检测队首元素
System.out.println(arrayBlockingQueue.element());

System.out.println(arrayBlockingQueue.remove());
System.out.println(arrayBlockingQueue.remove());
System.out.println(arrayBlockingQueue.remove());

// 全部删除后在删除抛出异常  NoSuchElementException
System.out.println(arrayBlockingQueue.remove());
```
```java
ArrayBlockingQueue arrayBlockingQueue = new ArrayBlockingQueue<>(3); // 队列大小

System.out.println(arrayBlockingQueue.offer("a"));
System.out.println(arrayBlockingQueue.offer("b"));
System.out.println(arrayBlockingQueue.offer("c"));
// 不抛出异常 flase
System.out.println(arrayBlockingQueue.offer("d"));

// 检测队首元素
System.out.println(arrayBlockingQueue.peek());
// 弹出
System.out.println(arrayBlockingQueue.poll());
System.out.println(arrayBlockingQueue.poll());
System.out.println(arrayBlockingQueue.poll());
// 不抛出异常 null
System.out.println(arrayBlockingQueue.poll());
```
```java
// 等待
ArrayBlockingQueue arrayBlockingQueue = new ArrayBlockingQueue<>(3); // 队列大小

// 一直堵塞
arrayBlockingQueue.put("a");
arrayBlockingQueue.put("b");
arrayBlockingQueue.put("c");

System.out.println(arrayBlockingQueue.tacke());
System.out.println(arrayBlockingQueue.tacke());
System.out.println(arrayBlockingQueue.tacke());
// 一直等待取出来 卡在这了
System.out.println(arrayBlockingQueue.tacke());
```

##  SynchronousQueue  同步队列

没有容量，进去一个元素，必须等待取出来之后，才能再往里放一个
```java
BlockingQueue<String> blockingQueue = new SynchronousQueue<String>();
// 写入一个取出一个 put了一个元素必须取出来才能再次put
new Thread(()->{
    try {
        blockingQueue.put("1");
        blockingQueue.put("2");
        blockingQueue.put("3");
    } catch (){
    } 
},"T1").start();

new Thread(()->{
    try {
        TimeUnit.SECONDS.sleep(3);
        System.out.println(arrayBlockingQueue.tacke());
       	TimeUnit.SECONDS.sleep(3);
        System.out.println(arrayBlockingQueue.tacke());
        TimeUnit.SECONDS.sleep(3);
        System.out.println(arrayBlockingQueue.tacke());
    } catch (){
    } 
},"T2").start();
```
## 线程池

三大方法、七大参数、四种拒绝策略

程序的运行，本质：占用系统资源！优化资源的使用！=> 池化技术
线程池、连接池、内存池、对象池、
池化技术：事先准备好资源，用的时候来拿就可以了，用完再还给我

线程池的好处：

- 降低资源消耗
- 提高响应速度
- 方便管理
- 线程复用，可以控制最大并发数

### 三大方法  

![image.png](/doc/juc/img-7.png)
```java
ExecutorService threadPool = Executors.newSingleThreadExecutor(); // 单个线程
Executors.newFixedThreadPool(3);  // 	创建一个固定线程池大小
Executors.newCachedThreadPool(); // 可伸缩的

try{
    for(int i = 0;i < 10;i++){
    	// 使用线程池创建线程
    	threadPool.execute(() -> {
      
    	})；
	}	
} catch () {
    
} finally {
    // 使用后关闭线程池
	threadPool.shutdown();	
}


```

### 七大参数

源码分析 
![image.png](/doc/juc/img-8.png)
本质： ThreadPoolExecutor()

![image.png](/doc/juc/img-9.png)

```java
// 自定义线程池
ExecutorService threadPool = new ThreadPoolExecutor(
    	2,
    	5, // 线程数 Runtime.getRuntime().availableProcessors() 获取核数
    	3,
    	TimeUnit.SECONDS,
    	new LinkedBlockingDeque<>(3),
    	Executors.defaultThreadFactory(),
    	new ThreadPoolExecutor.AbortPolicy()); // 银行满了但是还有人进来，不处理这个人，抛异常
		// ThreadPoolExecutor.CallerRunsPolicy()  哪来的回哪去
		// ThreadPoolExecutor.DiscardPolicy()  队列满了不处理不抛出异常
		// ThreadPoolExecutor.DiscardOldestPolicy() 队列满了会尝试与第一个竞争，成功了执行，失败了丢弃，不抛出异常
```
### 四大拒绝策略

- ThreadPoolExecutor.AbortPolicy()   银行满了但是还有人进来，不处理这个人，抛异常
- ThreadPoolExecutor.CallerRunsPolicy()  哪来的回哪去
- ThreadPoolExecutor.DiscardPolicy()  队列满了不处理不抛出异常
- ThreadPoolExecutor.DiscardOldestPolicy()  队列满了会尝试与第一个竞争成功了执行失败了丢弃，不抛出异常

### 扩展

IO密集型、CPU密集型
最大线程到底该如何定义

- CPU密集型，几核，就是几，可以保持CPU的效率最高
- IO 密集型 判断你程序中十分耗IO的线程

程序 15个大任务 io十分占用资源！

## 四大函数式接口

> **@FunctionalInterface**

Function  一个输入一个输出

```java
@FunctionalInterface
public interface Function<T,R> {
 	R apply(T t);   
}
```
```java
Function function = new Function<String,String>() {
 
    @Verride
    public String apply(String str){
        return str;
    }
}

// lambda
Function function = (str)->{return str;};
```
Predicate 一个输入，输出boolean

```java
public static void main(String[] args){
    
 	   Predicate<Stirng> predicate = new Predicate<String>(){
           @Verride
           public boolean test(String str){
               
               return str.isEmpty();
           }
       };
}

// lambda
Predicate predicate = (str)->{return str.isEmpty(); };
```
Consumer 只进不出

```java
Consumer<String> consumer = new Consumer<String>(){
 	@Override
    public void accept(String str){
     	System.out.println(str);
     
    }
}

// lambda
Consumer<String> consumer = (str) -> {System.out.println(str); }
consumer.accept("consumer");

```
Supplier 只出不进

```java
Supplier supplier = new Supplier<Integer>() {
 	@Override
    public Integer get(){
     	System.out.println("get()");
        return 1024;
    }
}

// lambda
Supplier supplier = () -> { return 1024;}
supplier.get();
```
## Stream流计算

```java
/**

	要求：
    	ID 为偶数
        年龄大于23
        用户名转成大写字母
        用户名字母倒着排序
        只输出一个用户
**/
// 编写一时爽，调试哭到爽
List<User> list = Array.asList(u1,u2,u3,u4,u5);
list.stream()
    .filter(u ->{
    	return u.getId() % 2 == 0; 
    })
    .filter(u ->{
     	return u.getAge() > 23;   
    })
    .map(u ->{
     	return u.getName().toUpperCase();   
    })
    .sorted((uu1,uu2) ->{
        return uu1.compareTo(uu2);
    })
    .limit(1)
    .forEach(System.out::println);
```
## ForkJoin
分支合并,并行执行！提高效率，处理大数据量（ 双端队列 ）

![image.png](/doc/juc/img-12.png)
![image.png](/doc/juc/img-10.png)

1. forkjoinPool 通过他来执行
2. 继承 RecursiveTask
3. 计算任务 execute(ForkJoinTast<?> task)
```java
// 计算类
public class Demo extends RecursiveTask<Long>{
    
    private Long start;
    private Long end;
    // 临界值
    private Long temp = 10000L;
    
    public Demo(Long start,Long end){
    	this.start = start;
        this.end = end;
    }
    
    // 计算
    @Verride
    protected Long compute() {
     	if( (end - start) > temp ){
           	// forkjoin 递归
           	long middle = ( start + end ) / 2;
            Demo demo1 = new Demo(start,middle);
            demo1.fork(); // 拆分任务，压如线程队列
            Demo demo2 = new Demo(middle + 1,end);
            demo2.fork();
            return demo1.join() + demo2.join();
        }else{
            Long sum = 0L;
        	for (Long i = start;i <= end;i++){
         		sum += i;
        	}
            return sum;
        }  
    }
}

// 使用
psvm{
    long start = System.currentTimeMillis();
 	ForkJoinPool forkJoinPool = new ForkJoinPool();
    
    ForkJoinTask<Long> task = new Demo(0L,1000000000L);
    forkJoinPool.execute(task); // 执行任务，没有结果
    ForkJoinTask<Long> submit = forkJoinPool.submit(task); // 提交任务 有结果
    Long sum = submit.get(); // 结果
    long end = System.currentTimeMillis();
    System.out.println(end - start);
}

```

## 异步回调
Future 设计的初衷：对将来的某个事件的结果进行建模

```java
// 没有返回值
CompletableFuture<Void> comoletableFuture = CompletableFuture.runAsync( () -> {
  
  
})
CompletableFuture<Integer> comoletableFuture = CompletableFuture.suppAsync( () -> {
  return 0;
  
})  
Integer int = comoletableFuture.get();
comoletableFuture.whenComplete(( t, u ) -> {
    
}).exceptionally( (e) -> {
    e.printStackTrace();
    return 0;
}).get());
```

## JMM
JVM java虚拟机，JMM java内存模型

同步约定：

1. 线程解锁前，必须将共享变量立刻刷回主存
2. 线程加锁前，必须读取主存中的最新值到工作内存中
3. 加锁和解锁是同一把锁

线程 工作内存、主内存
![image.png](/doc/juc/img-13.png)
## Volatile

- 保证可见性
- 不保证原子性
- 禁止指令重排

不使用 lock 和 synchronized 使用原子类解决原子性问题
![image.png](/doc/juc/img-14.png)
![image.png](/doc/juc/img-16.png)
```java
// 原子类的 Integer
private volatile static AtomicInteger num = new AtomicInteger();

// num++ 不是一个原子操作
public static void add() {
 num.getAndIncrement(); // AtomicInteger  + 1 方法， CAS   
}

public static void main() {
 
    for(int i = 0; i <= 20; i++) {
     new Thread( () -> {
         for(int j = 0; j < 1000; j++) {
          add();   
         }
     }).start(); 
    }
    
    while ( Thead.activeCount() > 2) {
     Thread.yield();   
    }
}

```
这些类在底层都直接和操作系统挂钩，在内存中修改值 Unsafe是一个特殊的存在

## 单例模式
饿汉式、DCL懒汉式、

```java
// 饿汉
pubic class Hungry {
    
    private Hungry() {
        
    }
    
    private final static Hungry HUNGRY = new Hungry();
    
    public static Hungry getInstance() {
        return HUNGRY;
    }
}
```
```java
// 使用枚举
public enum EnumSingle {
    INSTANCE;
    
    public EnumSingle getInstance() {
        return INSTANCE;
    }
}

// 懒汉
pubic class LazyMan {
    
    // 可以对该字段进行加密
    private static boolean fxb = false;
    
    private LazyMan() {
        synchronized (LazyMan.class) {
            if (fxb == false) {
                fxb = true;
            }else {
                throw new RuntimeException("不要试图通过反射破坏单例");
            }
            
            // if (lazyMan != null) {
                // throw new RuntimeException("不要试图通过反射破坏单例");
            // }
            
        }
        System.out.println("构造器");
    }
    
    private volatile final static LazyMan lazyMan ;
    
    // 双重检测锁
    public static LazyMan getInstance() {
        if (lazyMan == null) {
            synchronized (LazyMan.class) {
                if (lazyMan == null) {
                    lazyMan = new LazyMan();
                     /**
            		  * 1. 分配内存空间
                      * 2. 执行构造方法，初始化对象
                      * 3. 把对象指向这个空间
                      *
                      * 三步有可能发生指令重排 加Volatile
                      * 
                      */
                }
            }
          
        }
        return lazyMan;
    }
    
    
}
```
```java
// 静态内部类

pubic class Holder {
    
    private Holder() {
        
    }
 
    public static class InnerClass() {
        private static final Holder HOLDER = new Holder();
    }
    
    public static Holder getInstance() {
        return InnerClass.HOLDER;
    }
}
```


## CAS
Unsafe类

CAS ：比较当前工作内存中的值和主内存中的值，如果这个值是期望的，那么执行，不是就一直循环

缺点：循环耗时，一次性只能保证一个共享变量的原子性，存在ABA问题

![image.png](/doc/juc/img-15.png)

![image.png](/doc/juc/img-24.png)

![image.png](/doc/juc/img-17.png)


> ABA问题 狸猫换太子


```java
AtomicInteger atomicInteger = new AtomicInteger(2020);

/**
 *  期望 更新
 *  public final boolean compareAndSet(int expect, int update)
 *  如果我期望的值达到了，那么就更新，否则，则不更新，CAS 是CPU的并发原语
 *
 *	捣乱线程
 */
System.out.println(atomicInteger.compareAndSet(2020, 2021));
System.out.println(atomicInteger.get());

System.out.println(atomicInteger.compareAndSet(2021, 2020));
System.out.println(atomicInteger.get());

// 期望线程
System.out.println(atomicInteger.compareAndSet(2020, 2021));
System.out.println(atomicInteger.get());
```
> 如何解决以上问题 使用**带版本号的原子引用**

## 原子引用
![image.png](/doc/juc/img-23.png)

```java
// Integer 使用对象缓存机制，默认范围是 -128 ~ 127 ，推荐使用静态工厂方法valueOf获取对象实例
// 而不是new，因为valueOf使用缓存，而new一定会创建对象分配新的空间
AtomicStampedReference<Integer> atomicInteger = new AtomicStampedReference<Integer>(124,1);

new Thread(  () -> {

    int stamp = atomicInteger.getStamp(); // 获取版本号
    System.out.println("a1 =>" + stamp);

    try {
        TimeUnit.SECONDS.sleep(2);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    // version  + 1
    atomicInteger.compareAndSet(124,125,
            atomicInteger.getStamp(),atomicInteger.getStamp() + 1);
    System.out.println("a2 =>" + atomicInteger.getStamp());

    atomicInteger.compareAndSet(125,124,
            atomicInteger.getStamp(),atomicInteger.getStamp() + 1);
    System.out.println("a3 =>" + atomicInteger.getStamp());
} , "a").start();
new Thread(  () -> {

    int stamp = atomicInteger.getStamp(); // 获取版本号
    System.out.println("b1 =>" + stamp);

    try {
        TimeUnit.SECONDS.sleep(2);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }

    // version  + 1
    atomicInteger.compareAndSet(124,126,
            stamp,stamp + 1);
    System.out.println("b2 =>" + atomicInteger.getStamp());
} , "b").start();
```
![image.png](/doc/juc/img-18.png)

## 可重入锁

```java
psvm {
    
  Phone phone = new Phone();
  new Thread(() -> {
   	   phone.sms();
  },"A").start();

  new Thread(() -> {
   	   phone.sms();
  },"B").start();
}

class Phone {
    
    public sychronized void sms() {
        sout("sms");
     	call();   
    }
    public sychronized void call() {
     	 sout("call");
    }
}
```
```java
psvm {
    
  Phone phone = new Phone();
  new Thread(() -> {
   	   phone.sms();
  },"A").start();

  new Thread(() -> {
   	   phone.sms();
  },"B").start();
}

class Phone {
    Lock lock = new RenntrantLock();
    
    public void sms() {
        lock.lock();
        try {
           	sout("sms");
     		call();   
        }catch (E e) {
            
        } finally {
         	lock.unlock();   
        }
      
    }
    public sychronized void call() {
        lock.lock();
        try {
            sout("call");
        }catch(E e) {
            
        } finally {
            lock.unlock();
            
        } 	 
    }
}
```
## 自旋锁
![image.png](/doc/juc/img-19.png)

![image.png](/doc/juc/img-20.png)

## 死锁排查

![image.png](/doc/juc/img-21.png)

怎么排除死锁

![image.png](/doc/juc/img-25.png)

![image.png](/doc/juc/img-22.png)

使用 jsp -l 定位进程号

使用 jstack 进程号 找到死锁问题
















