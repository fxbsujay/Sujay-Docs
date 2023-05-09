
> [**版本信息**](https://start.spring.io/actuator/info)**       **[**Springcloud 中文网**](https://www.bookstack.cn/read/spring-cloud-docs/docs-index.md)

# Cloud生态
![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1645268117437-963fb223-abcc-4bff-8c70-26f4cbe3f21c.png#clientId=u793c36b2-0069-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=593&id=ubbc08bd5&margin=%5Bobject%20Object%5D&name=image.png&originHeight=593&originWidth=1622&originalType=binary&ratio=1&rotation=0&showTitle=false&size=366721&status=done&style=none&taskId=u5b69af7f-81f7-4d6f-b534-3d2b3a444ea&title=&width=1622)

# Eureka

## 服务端

@EnableEurekaServer
```yaml
eureka:
  instance:
    hostname: eureka7001.com
  client:
    # 不注册自己
    register-with-eureka: false
    # 表示自己是注册中心，不需要检索服务
    fetch-registry: false
    service-url:
      # Eureka Server 交互的地址查询服务和注册服务都依赖这个地址
      # defaultZone: http://eureka7002.com:7002/eureka/
      defaultZone: http://eureka7001.com:7001/eureka/
  server:
    # false 关闭自我保护机制，保证不可用服务被及时剔除
    nable-self-preservation: true
    eviction-interval-timer-in-ms: 2000
```
## 客户端
@EnableEurekaClient<br />@EnableDiscoveryClient
```yaml
eureka:
  instance:
    instance-id: payment8001
    # 放完路径显示ip
    prefer-ip-address: true
    # Eureka 客户端向服务端发送心跳的时间间隔，单位为秒 默认为30
    lease-renewal-interval-in-seconds: 30
    # Eureka 服务端收到最后一次心跳等待时间上限，默认为90秒，超时则剔除服务
    lease-expiration-duration-in-seconds: 90
  client:
    register-with-eureka: true
    fetch-registry: true
    service-url:
      # 集群版
      defaultZone: http://eureka7001.com:7001/eureka,http://eureka7002.com:7002/eureka
      
# 简单单机
eureka:
  client:
    register-with-eureka: true
    fetch-registry: true
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka
```
## 自我保护机制
一句话：某时刻某一个微服务不可用了，Eureka不会立刻清理，依旧会对该微服务的信息进行保存


# Zookeeper
> [说明](https://github.com/Netflix/eureka/wiki)  @EnableDiscoveryClient

zookeeper是一个分布式协调工具，可以实现注册中心功能
```yaml
spring:
  application:
    name: cloud-provoder-payment
  cloud:
    zookeeper:
      connect-string: localhost:2181

```


# Consul
> [说明](https://www.consul.io/intro/index.html)  [下载](https://www.consul.io/downloads.html) [文档](https://www.springcloud.cc/spring-cloud-consul.html)  [安装说明](https://learn.hashicorp.com/consul/getting-started/install.html)

- 服务发现 提供HTTP和DNS两种发现方式
- 健康检测 支持多种协议，HTTP、TCP、Docker、Shell脚本定制化
- KV存储 key , Value的存储方式
- 多数据中心 Consul支持多数据中心
- 可视化Web界面

下载完成后只有一个consul.exe文件，硬盘路径下双击运行，查看版本信息
```shell
consul -version
consul agent -dev
http://localhost:8500
```
通过以下地址可以访问Consul的首页：http;//localhost:8500
```yaml
server:
  port: 80
spring:
  application:
    name: cloud-provoder-payment
  cloud:
    consul:
      host: localhost
      port: 8500
      discovery:
        service-name: ${spring.application.name}

server:
  port: 8006
spring:
  application:
    name: cloud-consumer-order
  cloud:
    consul:
      host: localhost
      port: 8500
      discovery:
        service-name: ${spring.application.name}        
```
![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1649144509078-a7a071b4-6555-497a-9134-97da62cf1f1a.png#clientId=ue304c16b-4fdf-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=519&id=u85b51d0e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=519&originWidth=993&originalType=binary&ratio=1&rotation=0&showTitle=false&size=69469&status=done&style=none&taskId=u0720ee1a-6611-42e3-a89e-086b46f47b7&title=&width=993)<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1649144543578-87e1a0b8-0de2-4856-b485-d1c89a7f36a6.png#clientId=ue304c16b-4fdf-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=872&id=u9a04036d&margin=%5Bobject%20Object%5D&name=image.png&originHeight=872&originWidth=1892&originalType=binary&ratio=1&rotation=0&showTitle=false&size=56531&status=done&style=none&taskId=u6aadb6be-c238-4136-94f0-6eae9065805&title=&width=1892)

# Ribbon
> [文档地址](https://github.com/Netflix/ribbon/wiki/Getting-Started) [官网](https://docs.spring.io/spring-framework/docs/5.2.2.RELEASE/javadoc-api/org/springframework/web/client/RestTemplate.html)  负载均衡+RestTemplate调用


总结：Ribbon其实就是一个软负载均衡的客户端组件，他可以和其他所需请求的客户端结合使用，和eureka结合只是其中的一个实例。

```java
@Resource
public RestTemplate restTemplate;
/**
 * 	 getForEntity postForObject postForEntity
 */
@GetMapping
public String save() {
    return restTemplate.getForObject(PAYMENT_URL + "/payment/consul",String.class);
}
```

## 组件IRule

根据特定算法从服务列表中选取一个要访问的服务

- **轮询 **com.netflix.loadbalancer.**RoundRobinRule**
- **随机** com.netflix.loadbalancer.**RandomRule**
- **先按照RoundRobinRule的策略获取服务，如果获取服务失败则在指定时间内会进行重试  **com.netflix.loadbalancer.**RetryRule**
- **对RoundRobinRule的扩展，响应速度越快的实例选择权重越大，越容易被选择 WeightedResponseTimeRule **
- **会先过滤掉由于多次访问故障而处于断路器跳闸状态的服务，然后选择一个并发量最小的服务 BestAvailableRule **
- **先过滤掉故障实例，再选择并发较小的实例** **AvailabilityFilteringRule **
- **默认规则，复合判断server所在区域的性能和server的可用性选择服务器 ZoneAvoidanceRule**

![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1646758277695-9b3e466d-5a3c-429a-8d5a-ef400265cf12.png#clientId=u85f8f8e3-5ac2-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u60d7fe2e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1128&originWidth=2864&originalType=url&ratio=1&rotation=0&showTitle=false&size=665014&status=done&style=none&taskId=ufc8b310e-d7ef-4693-9948-1efe509bfb8&title=)
```java
@Bean    
public IRule myRule(){ 
   //定义为随机
   return new RandomRule();   
}} 


@EnableEurekaClient
@SpringBootApplication
@RibbonClient(name = "CLOUD-PAYMENTSERVICE",configuration = MySelfRule.class)
public class OrderMain80 {    
	public static void main(String[] args) {        			
}} 
```
## 负载均衡算法

rest 接口第几次请求数 % 服务器集群总量 = 实际调用服务器位置小标， 每次服务重启后rest接口计数从1开始

总计数：2台<br />List = 2 instance<br />1 % 2 = 1   ---> index =  1 list.get(index)<br />2 % 2 = 0   ---> index =  0 list.get(index)

List<ServiceInstance> instances = discoveryClient.getInstances("微服务名称")
```java
@SpringBootApplication
@EnableEurekaClient
@EnableDiscoveryClient
public class PaymentMain8002 {
                                                                                                            
    public static void main(String[] args) {
        SpringApplication.run(PaymentMain8002.class,args);
    }

}	
    
@Resource
private DiscoveryClient discoveryClient;

@GetMapping("discovery")
public Object discovery() {

    List<String> services = discoveryClient.getServices();

    for (String service : services) {
        log.info("=====服务名=====：{}",service);
    }

    List<ServiceInstance> instances = discoveryClient.getInstances("CLOUD-PAYMENT-SERVICE");
    for (ServiceInstance instance : instances) {
        log.info("=====服务信息===== 实例名：{},地址: {},端口号：{}",instance.getServiceId(),instance.getHost(),instance.getPort());
    }

    return this.discoveryClient;
}
```

## 源码分析
![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1648173056592-2aca2a0e-0f96-4da0-a3c3-ad184260f82e.png#clientId=u9c7be863-09bd-4&crop=0&crop=0&crop=1&crop=0.8468&from=paste&height=778&id=u6bca8229&margin=%5Bobject%20Object%5D&name=image.png&originHeight=778&originWidth=1046&originalType=binary&ratio=1&rotation=0&showTitle=false&size=512194&status=done&style=none&taskId=u43bf6872-7eb7-48ac-884e-1b981b3c77e&title=&width=1046)

![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1648173068960-2136fce2-1ffa-4972-a16f-490a33e7f34c.png#clientId=u9c7be863-09bd-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=307&id=u1ee36b2d&margin=%5Bobject%20Object%5D&name=image.png&originHeight=307&originWidth=932&originalType=binary&ratio=1&rotation=0&showTitle=false&size=197597&status=done&style=none&taskId=u0b052c17-c344-4e40-8566-9ae1b829e2e&title=&width=932)<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1648173089864-8eda2bef-e3a6-4894-aa85-c90c08976e86.png#clientId=u9c7be863-09bd-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=497&id=u93d15d04&margin=%5Bobject%20Object%5D&name=image.png&originHeight=497&originWidth=811&originalType=binary&ratio=1&rotation=0&showTitle=false&size=215469&status=done&style=none&taskId=u3e54cfa0-c5a6-436f-96ac-e5a2e7446e2&title=&width=811)
## 自定义算法
```java
@Component
public class MyLB implements LoadBalancer{

    private AtomicInteger atomicInteger = new AtomicInteger(0);


    @Override
    public ServiceInstance instances(List<ServiceInstance> serviceInstances) {
        int index = getAndIncrement() % serviceInstances.size();
        return serviceInstances.get(index);
    }

    public final int getAndIncrement() {
        int current;
        int next;

        do {
            current = this.atomicInteger.get();
            next = current >= 2147483647 ? 0 : current + 1;
        } while (!this.atomicInteger.compareAndSet(current,next));
        System.out.println("*****next: " + next);

        return next;
    }
}
@GetMapping("payment/{id}")
public Result<Payment> get(@PathVariable("id") Long id) {
    List<ServiceInstance> instances = discoveryClient.getInstances("CLOUD-PAYMENT-SERVICE");

    if (instances == null || instances.size() <= 0) {
        return null;
    }

    ServiceInstance serviceInstance = loadBalancer.instances(instances);
    URI uri = serviceInstance.getUri();
    return restTemplate.getForObject(uri + "/payment/" + id ,Result.class);
}
```
## 新版SpringCloud
loadbalancer 替代了ribbon  目前版本只提供了 BlockingLoadBalancerClient 的实现， 注意看中文注释
```java
//删除只保留了核心代码注意
public class BlockingLoadBalancerClient implements LoadBalancerClient {
    @Override
    public <T> T execute(String serviceId, LoadBalancerRequest<T> request)
            throws IOException {
        // 根据 服务名称去查询可用实例
        ServiceInstance serviceInstance = choose(serviceId);
        return execute(serviceId, serviceInstance, request);
    }
    @Override
    public ServiceInstance choose(String serviceId) {
        // 获取负载均衡策略
        ReactiveLoadBalancer<ServiceInstance> loadBalancer = loadBalancerClientFactory
                .getInstance(serviceId);
        // 执行负载均衡策略获取可以实例
        Response<ServiceInstance> loadBalancerResponse = Mono.from(loadBalancer.choose())
                .block();
        return loadBalancerResponse.getServer();
    }
}
```

使用跟ribbon差不多
```java
@SpringBootApplication
@LoadBalancerClients(defaultConfiguration = {MyConfig.class})
public class OrderMain80 {
    public static void main(String[] args) {
        SpringApplication.run(OrderMain80.class,args);
    }
}
@Bean
@LoadBalanced
public RestTemplate restTemplate() {
    return new RestTemplate();
}


@Configuration
public class MyConfig {
    @Bean
    public ReactorLoadBalancer<ServiceInstance> randomLoadBalancer(
        Environment environment,                                                 
        LoadBalancerClientFactory loadBalancerClientFactory){
        /**
         * 随机负载均衡
         */
        String name = environment.getProperty(LoadBalancerClientFactory.PROPERTY_NAME);
        return new RandomLoadBalancer(loadBalancerClientFactory
                .getLazyProvider(name, ServiceInstanceListSupplier.class),
                name);
    }
}

@Resource
public RestTemplate restTemplate;

@GetMapping("payment/{id}")
public Result<Payment> get(@PathVariable("id") Long id) {
    return restTemplate.getForObject(PAYMENT_URL + "/payment/" + id, Result.class);
}

```

自己去实现负载均衡算法
```java
//这个方法基本是copy的RoundRobinLoadBalancer自己改一改出来的
public class PeachLoadBalancer implements ReactorServiceInstanceLoadBalancer {
    private static final Log log = LogFactory.getLog(RoundRobinLoadBalancer.class);

    final AtomicInteger position;//请求的次数

    final String serviceId; //服务名称 用于提示报错信息的

    private int flag = 0; //自己定义的计数器

    //两个参数的构造方法 需要服务名称和实例提供者 这个在方法中传递进来
    public PeachLoadBalancer(ObjectProvider<ServiceInstanceListSupplier> serviceInstanceListSupplierProvider,
                                  String serviceId) {
        //如果不传人请求次数就自己初始化 反正每次都+1
        this(new Random().nextInt(1000), serviceId,serviceInstanceListSupplierProvider);
    }

    public PeachLoadBalancer(int seedPosition, String serviceId, ObjectProvider<ServiceInstanceListSupplier> serviceInstanceListSupplierProvider) {
        this.position = new AtomicInteger(seedPosition);
        this.serviceId = serviceId;
        this.serviceInstanceListSupplierProvider = serviceInstanceListSupplierProvider;
    }

    ObjectProvider<ServiceInstanceListSupplier> serviceInstanceListSupplierProvider;
    @Override
    public Mono<Response<ServiceInstance>> choose(Request request) {
        //从服务提供者中获取到当前request请求中的serviceInstances并且遍历
        ServiceInstanceListSupplier supplier = serviceInstanceListSupplierProvider
                .getIfAvailable(NoopServiceInstanceListSupplier::new);
        return supplier.get(request).next()
                .map(serviceInstances -> processInstanceResponse(supplier, serviceInstances));
    }

    private Response<ServiceInstance> processInstanceResponse(ServiceInstanceListSupplier supplier,
                                                              List<ServiceInstance> serviceInstances) {
        Response<ServiceInstance> serviceInstanceResponse = getInstanceResponse(serviceInstances);
        if (supplier instanceof SelectedInstanceCallback && serviceInstanceResponse.hasServer()) {
            ((SelectedInstanceCallback) supplier).selectedServiceInstance(serviceInstanceResponse.getServer());
        }
        return serviceInstanceResponse;
    }

    private Response<ServiceInstance> getInstanceResponse(List<ServiceInstance> instances) {
        if (instances.isEmpty()) {
            if (log.isWarnEnabled()) {
                log.warn("No servers available for service: " + serviceId);
            }
            return new EmptyResponse();
        }
        //pos是当前请求的次数 这样可以自定义负载均衡的切换  这个每次+1的操作是复制的 最好是不删
        int pos = Math.abs(this.position.incrementAndGet());

        if (pos%4==0){
            //是4的倍数就切换
            flag += 1;
        }
        if (flag >= instances.size()){
            flag = 0;
        }
        //主要的就是这句代码设置负载均衡切换
        ServiceInstance instance = instances.get(flag);
        return new DefaultResponse(instance);
    }
}

public class CustomLoadBalancerConfiguration {
    @Bean
    ReactorLoadBalancer<ServiceInstance> randomLoadBalancer(Environment environment,
                                                            LoadBalancerClientFactory loadBalancerClientFactory) {
        String name = environment.getProperty(LoadBalancerClientFactory.PROPERTY_NAME);

        //这里返回了我自己定义的方法
        return new PeachLoadBalancer(
            loadBalancerClientFactory.getLazyProvider(name,ServiceInstanceListSupplier.class),
            name);
}

```

# OpenFeign
简单使用
> @FeignClient @EnableFeignClients

![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1648183916831-941895c5-4d71-4011-8808-1e7f67280a02.png#clientId=u9c7be863-09bd-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=387&id=ua0613ee5&margin=%5Bobject%20Object%5D&name=image.png&originHeight=707&originWidth=1606&originalType=binary&ratio=1&rotation=0&showTitle=false&size=888977&status=done&style=none&taskId=u5f59f072-4f9d-48f4-8ae1-00688fb4ed6&title=&width=880)
## 超时控制
> OpenFeign 客户端默认等待1秒钟

```yaml
# 设置feign客户端超时时间
ribbon:
  # 连接所需要的时间
  ReadTimeout: 5000
  # 建立连接后获取数据所需要的时间
  ConnectTimeout: 5000
```
## 日志打印                                                                                                
```java
logging:
  level:
    com.susu.springcloud.service.PaymentFeignService: debug

@Bean
Logger.Level feignLoggerLevel() {
    return Logger.Level.FULL;
}
```

# Hystrix

> [官网资料](https://github.com/Netflix/Hystrix/wiki/How-To-Use)  [仓库](https://github.com/Netflix/Hystrix) [工作流程](https://github.com/Netflix/Hystrix/wiki/How-it-Works)

## 服务降级
服务器忙，请稍候再试，不让客户端等待并立刻返回一个友好提示，fallback

- 程序运行异常
- 超时
- 服务熔断触发服务降级
- 线程池/信号量打满
### 
服务提供者 @EnableHystrix
```java
/**
 *  fallbackMethod 指定降级后的处理方法
 *  timeoutInMilliseconds  超时异常 5秒
 */
@HystrixCommand(fallbackMethod = "errorHandle",commandProperties = {
    @HystrixProperty(name = "execution.isolation.thread.timeoutInMilliseconds",
                     value = "5000")
})
public String error(Long id) {

    // 运行异常
    // int age = 10/0;
    try {
        // 超时异常
        TimeUnit.SECONDS.sleep(3);
    } catch (Exception e) {
        e.printStackTrace();
    }
    return "线程池： " + Thread.currentThread().getName() + " paymentInfo_error,id: " + id + " 耗时 3 秒钟";
}

public String errorHandle(Long id) {
    return "降级触发: " + id;
}
```
服务消费者 @EnableHystrix
```yaml
# 开启openfeign的服务降级
feign:
  circuitbreaker:
    enabled: true
```
统一设置接口调用的降级处理
```java
@RestController
@RequestMapping("consumer")
@Slf4j
@DefaultProperties(defaultFallback = "errorGlobalHandle")
public class OrderController {

    @Resource
    public PaymentFeignService service;

    @HystrixCommand
    @GetMapping("/error/{id}")
    public Result<String> error(@PathVariable("id") Long id) {
        return service.error(id);
    }

    public Result<String> errorGlobalHandle() {
        return new Result<>("全局降级处理！");
    }
}
```
页可以在openfeign中设置
```java
@Component
@FeignClient(value = "CLOUD-PAYMENT-HYSTRIX-SERVICE",
             fallback = PaymentFallbackFeignServiceImpl.class)
public interface PaymentFeignService {

    @GetMapping("/payment/ok/{id}")
    public Result<String> ok(@PathVariable("id") Long id);

    @GetMapping("/payment/error/{id}")
    public Result<String> error(@PathVariable("id") Long id);
}
```
```java
/**
 * @author sujay
 * @version 17:51 2022/4/4
 */
@Component
public class PaymentFallbackFeignServiceImpl implements PaymentFeignService{

    @Override
    public Result<String> ok(Long id) {
        return new Result<>("--------Fallback__ok");
    }

    @Override
    public Result<String> error(Long id) {
        return new Result<>("--------Fallback__error");
    }
}
```
## 服务熔断
类比保险丝达到最大服务访问后，直接拒绝访问，拉闸限电，然后调用服务降级的方法并返回友好提示<br />就是保险丝  服务的降级->进而熔断->恢复调用链路

熔断类型

- 打开  多次错误,然后慢慢正确，发现刚开始不满足条件，就算是正确的访问地址也不能进行访问，需要慢慢的恢复链路、
- 关闭  熔断关闭不会对服务进行熔断
- 半开  部分请求根据规则调用当前服务，如果请求成功且符合规则则认为当前服务恢复正常，关闭熔断、

断路器开启或者关闭的条件

1. 当满足一定阀值的时候（默认10秒内超过20个请求次数）
1. 当失败率达到一定的时候（默认10秒内超过50%请求失败）
1. 到达以上阀值，断路器将会开启
1. 当开启的时候，所有请求都不会进行转发
1. 一段时间之后（默认是5秒），这个时候断路器是半开状态，会让其中一个请求进行转发。如果成功，断路器会关闭，若失败，继续开启。重复4和5

![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1649143081270-0ca26c0e-cd2f-43a9-999f-6a12eda58194.png#clientId=u7bc5d389-69d2-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=559&id=u77258819&margin=%5Bobject%20Object%5D&name=image.png&originHeight=559&originWidth=608&originalType=binary&ratio=1&rotation=0&showTitle=false&size=82857&status=done&style=none&taskId=u0c16e7d9-9548-49c2-9590-d6951e8367d&title=&width=608)
```java
// 服务熔断
@Override
@HystrixCommand(fallbackMethod = "paymentCircuitBreakerFallback",commandProperties = {
   //是否开启断路器
   @HystrixProperty(name = "circuitBreaker.enabled",value = "true"),
   //请求次数
   @HystrixProperty(name = "circuitBreaker.requestVolumeThreshold",value = "20"),
   //时间范围
   @HystrixProperty(name = "circuitBreaker.sleepWindowInMilliseconds",value = "10000"),
   //失败率达到多少后跳闸
   @HystrixProperty(name = "circuitBreaker.errorThresholdPercentage",value = "50"), 
})
public String paymentCircuitBreaker(Long id) {
    if (id < 0){
        throw new RuntimeException("*****id 不能负数");
    }
    String serialNumber = StringUtils.uuid();
    return Thread.currentThread().getName()+"\t"+"调用成功,流水号："+serialNumber;
}

public String paymentCircuitBreakerFallback(Long id) {
    return "id 不能负数，请稍候再试,(┬＿┬)/~~     id: " +id;
}
```
工作流程

![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1649143204398-4a2a167e-060d-40f3-ae30-8110695ca11d.png#clientId=u7bc5d389-69d2-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=670&id=u85c29160&margin=%5Bobject%20Object%5D&name=image.png&originHeight=670&originWidth=1372&originalType=binary&ratio=1&rotation=0&showTitle=false&size=103056&status=done&style=none&taskId=u18cd47ba-f7f2-416b-b9b5-daec402f677&title=&width=1372)

1. [构造HystrixCommand或HystrixObservable命令对象](https://github.com/Netflix/Hystrix/wiki/How-it-Works#flow1)
1. [执行命令](https://github.com/Netflix/Hystrix/wiki/How-it-Works#flow2)
1. [是否缓存响应？](https://github.com/Netflix/Hystrix/wiki/How-it-Works#flow3)
1. [电路开路吗？](https://github.com/Netflix/Hystrix/wiki/How-it-Works#flow4)
1. [线程池/队列/信号量是否已满？](https://github.com/Netflix/Hystrix/wiki/How-it-Works#flow5)
1. [HystrixObservableCommand.construct()或HystrixCommand.run()](https://github.com/Netflix/Hystrix/wiki/How-it-Works#flow6)
1. [计算电路运行状况](https://github.com/Netflix/Hystrix/wiki/How-it-Works#flow7)
1. [准备撤退](https://github.com/Netflix/Hystrix/wiki/How-it-Works#flow8)
1. [返回成功响应](https://github.com/Netflix/Hystrix/wiki/How-it-Works#flow9)
## 服务限流
秒杀高并发等操作，严禁一窝蜂的过来拥挤，大家排队，一秒钟N个，有序进行<br /> 


# Gateway
> [Zuul](https://github.com/Netflix/zuul/wiki)  [文档](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/)


## 三大核心

-  Route  路由是构建网关的基本模块，它由ID，目标URI，一系列的断言和过滤器组成，如果断言为true则匹配该路由
- Predicate 参考的是java8的java.util.function.Predicate开发人员可以匹配HTTP请求中的所有内容（例如请求头或请求参数），如果请求与断言相匹配则进行路由
- Filter 指的是Spring框架中GatewayFilter的实例，使用过滤器，可以在请求被路由前或者之后对请求进行修改。
## 工作流程
客户端向springcloudgateway发出请求。如果网关处理程序映射确定请求与路由匹配，则将其发送到网关Web处理程序。此处理程序通过特定于请求的筛选器链运行请求。过滤器被虚线分开的原因是过滤器可以在发送代理请求之前和之后运行逻辑。执行所有“预”过滤器逻辑。然后发出代理请求。发出代理请求后，运行“post”过滤器逻辑<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1651140723492-a18ba0ef-e731-4b7b-869d-8bc027b12f33.png#clientId=ud5d0ac0f-beb0-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=593&id=udd72fa7b&margin=%5Bobject%20Object%5D&name=image.png&originHeight=593&originWidth=442&originalType=binary&ratio=1&rotation=0&showTitle=false&size=28507&status=done&style=none&taskId=ud659869b-356d-4ada-bd75-f8155041166&title=&width=442)

## 路由配置

使用java
```java
@Configuration
public class GateWayConfig {
    
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder routeLocatorBuilder) {
        RouteLocatorBuilder.Builder routes = routeLocatorBuilder.routes();
        
        // http://localhost:9527/guonei -> https://news.baidu.com/guonei
        routes.route("path_route_susu",
                     r -> r.path("/guonei").uri("https://news.baidu.com/guonei")).build();
        
        return routes.build();
    }
}
```
使用配置项,其他请参考官网
```yaml
spring:
  application:
    name: cloud-gateway
  cloud:
    gateway:
      discovery:
        locator:
          enabled: true # 开启注册中心动态创建路由，利用微服务名称进行路由
      routes:
        # http://localhost:9527/payment/31  -> http://localhost:8001/payment/31
        - id: payment_routh   # 路由id
          uri: lb://CLOUD-PAYMENT-SERVICE  # 注册中心服务名称
          # uri: ws://localhost:8001
          # uri: http://localhost:8001   # 匹配后提供服务的路由地址
          predicates:
              # 断言，路径相匹配的进行路由
            - Path=/payment/** 
              # 这个时间之后的
            - After=2022-04-09T15:55:09.281+08:00[Asia/Shanghai]
             # 这个时间之前的
            - Before=2022-04-09T16:55:09.281+08:00[Asia/Shanghai]
             # 这个时间之间的
            - BetWeen=2022-04-09T15:55:09.281+08:00[Asia/Shanghai],2022-04-09T16:55:09.281+08:00[Asia/Shanghai]
              # 请求地址
            - Host=**.xuebin.xyz,xuebin.xyz
              # 请求必须携带cookie    cmd curl http://localhost:9527/payment/31 --cookie "username=fxb"
            - Cookie=username,fxb
              # 请求头需要有 X-Request-Id 属性并且值为证书的正则表达式  cmd curl http://localhost:9527/payment/31 -H "X-Request-Id:123"
            - Header=X-Request-Id, \d+
              # 请求方式
            - Method=GET
              # 请求路径要有参数名为username的参数，并且值为整数
            - Query=username, \d+
```

## 跨域
```java
@Configuration
public class GreenLeafCorsConfiguration {

    @Bean
    public CorsWebFilter corsWebFilter(){
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        CorsConfiguration corsConfiguration = new CorsConfiguration();
        // 配置跨域
        // 允许哪些头可以跨域
        corsConfiguration.addAllowedHeader("*");
        // 需要哪些请求可以跨域 get post
        corsConfiguration.addAllowedMethod("*");
        // 允许的请求来源
        corsConfiguration.addAllowedOrigin("*");
        // 允许携带 tok
        corsConfiguration.setAllowCredentials(true);
        source.registerCorsConfiguration("/**",corsConfiguration);

        return new CorsWebFilter(source);
    }
}
```
## 全局自定义过滤器
```java
@Component
@Slf4j
public class AuthGlobalFilter implements GlobalFilter, Ordered {

    private AntPathMatcher antPathMatcher = new AntPathMatcher();

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        ServerHttpRequest request = exchange.getRequest();

        log.info("根据请求参数进行拦截");
        String username = request.getQueryParams().getFirst("username");

        if (username == null) {
            log.info("============ 用户名为null ============");
            ServerHttpResponse response = exchange.getResponse();
            return out(response);
        }


        log.info("根据请求路径进行拦截");
        String path = request.getURI().getPath();

        /**
         *  等等一些列操作
         */
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return 0;
    }

    private Mono<Void> out(ServerHttpResponse response) {
        JsonObject message = new JsonObject();
        message.addProperty("success", false);
        message.addProperty("code", 28004);
        message.addProperty("data", "鉴权失败");
        byte[] bits = message.toString().getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = response.bufferFactory().wrap(bits);
        response.getHeaders().add("Content-Type", "application/json;charset=UTF-8");
        return response.writeWith(Mono.just(buffer));
    }
}

```

## 全局自定义异常处理

```java
@Configuration
@EnableConfigurationProperties({ServerProperties.class, WebProperties.class})
public class ErrorHandlerConfig {

    private final ServerProperties serverProperties;

    private final ApplicationContext applicationContext;

    private final WebProperties webProperties;

    private final List<ViewResolver> viewResolvers;

    private final ServerCodecConfigurer serverCodecConfigurer;

    public ErrorHandlerConfig(ServerProperties serverProperties,
                              WebProperties webProperties,
                                     ObjectProvider<List<ViewResolver>> viewResolversProvider,
                                        ServerCodecConfigurer serverCodecConfigurer,
                                     ApplicationContext applicationContext) {
        this.serverProperties = serverProperties;
        this.webProperties = webProperties;
        this.applicationContext = applicationContext;
        this.viewResolvers = viewResolversProvider.getIfAvailable(Collections::emptyList);
        this.serverCodecConfigurer = serverCodecConfigurer;
    }

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public ErrorWebExceptionHandler errorWebExceptionHandler(ErrorAttributes errorAttributes) {
        JsonExceptionHandler exceptionHandler = new JsonExceptionHandler(
                errorAttributes,
                webProperties.getResources(),
                this.serverProperties.getError(),
                this.applicationContext);
        exceptionHandler.setViewResolvers(this.viewResolvers);
        exceptionHandler.setMessageWriters(this.serverCodecConfigurer.getWriters());
        exceptionHandler.setMessageReaders(this.serverCodecConfigurer.getReaders());
        return exceptionHandler;
    }
}
```
```java
public class JsonExceptionHandler extends DefaultErrorWebExceptionHandler {

    public JsonExceptionHandler(ErrorAttributes errorAttributes, Resources resources,
            ErrorProperties errorProperties, ApplicationContext applicationContext) {
        super(errorAttributes, resources, errorProperties, applicationContext);
    }

    /**
     * 获取异常属性
     */
    @Override
    protected Map<String, Object> getErrorAttributes(ServerRequest request, ErrorAttributeOptions options) {
        Map<String, Object> map = new HashMap<>();
        map.put("success", false);
        map.put("code", 20005);
        map.put("message", "服务异常");
        map.put("data", null);
        return map;
    }

    /**
     * 指定响应处理方法为JSON处理的方法
     */
    @Override
    protected RouterFunction<ServerResponse> getRoutingFunction(ErrorAttributes errorAttributes) {
        return RouterFunctions.route(RequestPredicates.all(), this::renderErrorResponse);
    }

    /**
     * 根据code获取对应的HttpStatus
     */
    @Override
    protected int getHttpStatus(Map<String, Object> errorAttributes) {
        return 200;
    }
}
```
# Config

> 集中管理配置文件  [文档](https://docs.spring.io/spring-cloud-config/docs/current/reference/html/)


## 配置中心服务端
新建配置文件仓库<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1651141725896-d1a013a1-fcf2-4226-b94e-21e399d1ea9f.png#clientId=ud5d0ac0f-beb0-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=310&id=uee0e5b7c&margin=%5Bobject%20Object%5D&name=image.png&originHeight=310&originWidth=1232&originalType=binary&ratio=1&rotation=0&showTitle=false&size=32196&status=done&style=none&taskId=u98467b28-0999-4ac2-9b22-1dc41291ad1&title=&width=1232)
```java

@SpringBootApplication
@EnableConfigServer
@EnableEurekaClient
public class ConfigMain {
    
    // http://localhost:3344/main/application-test.yml
    public static void main(String[] args) {
        SpringApplication.run(ConfigMain.class,args);
    }
}

```
```yaml
spring:
  application:
    name: cloud-config-center
  cloud:
    config:
      server:
        git:
          uri: https://gitee.com/sujay/config.git
          # 搜索目录
          search-paths:
            - config
          username: ***
          password: ***
      # 读取分支
      label: master
```
## 配置中心客户端
刷新配置  [http://localhost:3355/actuator/refresh](http://localhost:3355/actuator/refresh)
```java
/**
 * 需要 post请求刷新  http://localhost:3355/actuator/refresh
 */
@RestController
@RefreshScope
public class ConfigClientController {


    @Value("${config.info}")
    private String configInfo;

    @GetMapping("config")
    public String getConfigInfo() {
        return configInfo;
    }
}
```
```yaml
spring:
  application:
    name: cloud-config-center
  cloud:
    config:
      label: master
      name: config
      profile: dev
      uri: http://localhost:3344
```
# Bus 消息总线
Spring Cloud Bus配合Spring Cloud Config使用可以实现配置的动态刷新<br />Bus支持两种消息代理：RabbitMQ和Kafka<br />设计思想：

- 利用消息总线触发一个客户端/bus/refresh,而刷新所有客户端的配置
- 利用消息总线触发一个服务端ConfigServer的/bus/refresh端点,而刷新所有客户端的配置（更加推荐）

使用RabbitMQ
> [安装Erlang](http://erlang.org/download/otp_win64_21.3.exe) [安装RabbitMQ](https://dl.bintray.com/rabbitmq/all/rabbitmq-server/3.7.14/rabbitmq-server-3.7.14.exe)

```yaml
# 启动
rabbitmq-plugins enable rabbitmq_management
# http://localhost:15672/ 输入账号密码并登录: guest guest
```

消息总线 bus 只需要刷新总线  [http://localhost:3344/actuator/bus_refresh](http://localhost:3344/actuator/bus_refresh) 其他客户端全部生效<br />定点通知 [http://localhost:3344/actuator/bus_refresh/{destination}](http://localhost:3344/actuator/bus_refresh/{destination})<br />destination:    cloud-config-center:3355  服务名称 + 端口号
```yaml
rabbitmq:
    host: localhost
    port: 5672
    username: guest
    password: guest
# rabbitmq 相关配置，暴露bus刷新配置的端点
management:
  endpoints:
    web:
      exposure:
        include: 'bus-refresh'    
```
```yaml
rabbitmq:
  host: localhost
  port: 5672
  username: guest
  password: guest
management:
  endpoints:
    web:
      exposure:
        include: "*"    
```


# Stream  消息驱动
为了解决系统中不同中间件的适配问题，出现了cloud stream，采用适配绑定的方式，自动给不同的MQ之间进行切换，屏蔽底层消息中间件的差异，降低切换成本，统一消息的编程模型<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1651143509360-96803487-ab24-4847-bc21-52e7b4b81559.png#clientId=ud5d0ac0f-beb0-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=495&id=u07d07f21&margin=%5Bobject%20Object%5D&name=image.png&originHeight=495&originWidth=538&originalType=binary&ratio=1&rotation=0&showTitle=false&size=50907&status=done&style=none&taskId=u8b9680aa-a490-4455-bd37-26d684800b8&title=&width=538)<br />应用程序通过inputs(消费者)或者outputs(生产者)来与Spring Cloud Stream中binder对象交互。通过我们配置来绑定，而Spring Cloud Stream的binder对象负责与消息中间件交互<br />Spring Cloud Stream为一些供应商的消息中间件产品提供了个性化的自动配置，引用了发布、订阅、消费、分区的三个核心概念<br />官方版本目前仅仅支持RabbitMQ和Kafka<br />Stream中的消息通信方式遵循了发布-订阅模式，Topic主题进行广播，在RabbitMQ就是Exchange，在kafka中就是Topic
## 术语
Message：生产者/消费者之间靠消息媒介传递信息内容<br />MessageChannel：消息必须走特定的通道<br />消息通道的子接口SubscribableChannel，由MessageHandle消息处理器所订阅

- Middleware：中间件，目前只支持RabbitMQ和Kafka
- Binder：应用层和消息中间件之间的封装，实现了Kafka和RabbitMQ的Binder，通过Binder可以很方便的连接中间件，可以动态的改变消息类型，这些可以通过配置文件修改
- Input：表示输入通道，消息进入该通道传到应用程序
- Output：注解标识输出通道，发布的消息将通过该通道离开应用程序
- StreamListener：监听队列，用于消费者的队列的消息接收
- EnableBinding：将信道channel和exchange绑定在一起
- Channel：通道，是队列Queue的一种抽象，在消息通讯系统中就是实现存储和转发的媒介，通过对Channel对队列进行配置
- Source和Sink：简单的可理解为参照对象是Spring Cloud Stream自身，从Stream发布消息就是输出，接受消息就是输入

## 生产者
```yaml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-stream-rabbit</artifactId>
</dependency>
```
```yaml
spring:
  application:
    name: cloud-stream-rabbitmq
  rabbitmq:
    host: localhost
    port: 5672
    username: guest
    password: guest
  cloud:
    stream:
      # 服务的整合处理  新版本不需要
      bindings:
        # 这个名字是一个通道的名称
        studyExchange-out-0:
          # 表示要使用的Exchange名称定义
          destination: studyExchange
          # 设置消息类型，本次为json，文本则设置为 text/plain
          content-type: application/json
          default-binder: defaultRabbit
```
```java
@RestController
public class StreamController {
    
    @Autowired
    private StreamBridge streamBridge;
    
    @GetMapping("send")
    public String send() {
        streamBridge.send("studyExchange",  MessageBuilder.withPayload(UUID.randomUUID().toString())
                          .build(), MediaType.APPLICATION_JSON);
        return "成功";
    }
}
```
## 消费者
```java
@Component
public class MessageController {

    @Bean
    public Consumer<String> studyExchange() {
        return System.out::println;
    }
}
```

## 分组
微服务应用放置于同一个group中，就能够保证消息只会被其中一个应用消费一次。不同的组是可以消费的，同一个组内会发生竞争关系，只有其中一个可以消费。<br />解决问题：

- 有重复消费问题 发送消息，所有消费者都会消费一次
- 消息持久化问题 发送消息，服务端未启动，再启动时没有收到消息

```yaml
spring:
  application:
    name: cloud-stream-rabbitmq
  rabbitmq:
    host: localhost
    port: 5672
    username: guest
    password: guest
  cloud:
    stream:
      bindings:
        studyExchange-in-0:
          destination: studyExchange
          content-type: application/json
          default-binder: defaultRabbit
          # 分组
          group: fxb
```
# Sleuth、Zipkin
> [sleuth](https://github.com/spring-cloud/spring-cloud-sleuth) [zipkin](https://zipkin.io/pages/quickstart.html)

Spring Cloud Sleuth提供了一套完整的服务跟踪的解决方案，在分布式系统中提供追踪解决方案并且兼容支持了zipkin，SpringCloud从F版起已不需要自己构建Zipkin server了，只需要调用jar包即可<br />[http://localhost:9411/zipkin/](http://localhost:9411/zipkin/)<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1651144447267-2f43fdb1-540d-46e0-84d1-211effa8da03.png#clientId=u4c253d3f-115b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=267&id=u79bcc0fd&margin=%5Bobject%20Object%5D&name=image.png&originHeight=267&originWidth=783&originalType=binary&ratio=1&rotation=0&showTitle=false&size=55397&status=done&style=none&taskId=u49c6e490-18e7-4a20-919f-9db4178e969&title=&width=783)

- Trace:类似于树结构的Span集合，表示一条调用链路，存在唯一标识
- span:表示调用链路来源，通俗的理解span就是一次请求信息
```yaml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-zipkin</artifactId>
    <version>2.2.8.RELEASE</version>
</dependency>
```
```yaml
spring:
  application:
    name: cloud-payment-service
  zipkin:
    base-url: http://localhost:9411
  sleuth:
    sampler:
      # 采样率值介于 0 到 1 之间， 1表示全部采集
      probability: 1
```


# Nacos
> [官网文档](https://nacos.io/zh-cn/index.html) [参考手册](https://spring-cloud-alibaba-group.github.io/github-pages/greenwich/spring-cloud-alibaba.html#_introduction) [下载](https://github.com/alibaba/nacos/releases)

修改为standalone（单机）模式启动即可<br />[http://localhost:8848/nacos](http://localhost:8848/nacos)  默认账号密码都是nacos<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1651145162016-a3eeca25-f56f-42d0-95d8-f82516873b08.png#clientId=u4c253d3f-115b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=466&id=ub777c94c&margin=%5Bobject%20Object%5D&name=image.png&originHeight=466&originWidth=666&originalType=binary&ratio=1&rotation=0&showTitle=false&size=35898&status=done&style=none&taskId=ue0ef3b00-b9ca-44be-8afd-4c6bd73193b&title=&width=666)
```yaml
server:
  port: 83

spring:
  application:
    name: cloud-order-service
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
```
```properties
spring.cloud.nacos.config.server-addr=localhost:8848
spring.cloud.nacos.discovery.server-addr=localhost:8848
spring.cloud.nacos.config.namespace=fceb9d88-ede2-44f8-935f-8ea04ac26760
spring.cloud.nacos.config.group=DEFAULT_GROUP
spring.cloud.nacos.config.prefix=dev
spring.cloud.nacos.config.file-extension=properties

spring.cloud.nacos.config.extension-configs[0].data-id=other.properties
spring.cloud.nacos.config.extension-configs[0].group=dev
spring.cloud.nacos.config.extension-configs[0].refresh=true
```
![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1651146053055-7ff35f69-0846-45f1-b6df-4b63c8cfd720.png#clientId=u3eaf6c43-6b8d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=496&id=udb2657c3&margin=%5Bobject%20Object%5D&name=image.png&originHeight=496&originWidth=1882&originalType=binary&ratio=1&rotation=0&showTitle=false&size=60574&status=done&style=none&taskId=u45ee5929-da21-444e-aeac-ef2ca6eda34&title=&width=1882)

## 持久化

![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1651146366754-8fca0eb7-b534-47a1-98db-6a4c063c31c3.png#clientId=u3eaf6c43-6b8d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=253&id=uc4c39211&margin=%5Bobject%20Object%5D&name=image.png&originHeight=253&originWidth=1365&originalType=binary&ratio=1&rotation=0&showTitle=false&size=26093&status=done&style=none&taskId=u9105825e-972a-487e-a081-a806137b62f&title=&width=1365)<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1651146325411-4bbb8fe2-3597-40ef-b7fe-7cd584344f93.png#clientId=u3eaf6c43-6b8d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=264&id=u5080061a&margin=%5Bobject%20Object%5D&name=image.png&originHeight=264&originWidth=666&originalType=binary&ratio=1&rotation=0&showTitle=false&size=110596&status=done&style=none&taskId=ub102c899-5ec7-4cb3-baa5-17b19b4a0f3&title=&width=666)
## 集群
![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1651146620005-13db695c-a0fb-40ba-adb2-9f0c681bc5ef.png#clientId=u3eaf6c43-6b8d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=409&id=uca28172e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=409&originWidth=498&originalType=binary&ratio=1&rotation=0&showTitle=false&size=62064&status=done&style=none&taskId=u2d70d02d-66eb-429a-8cf3-81b5592053a&title=&width=498)<br />配置cluster.conf
```shell
# 查看本机地址
hostname -i
vim cluster.conf

# ip:prot
# ip:prot
# ip:prot

vim startup.sh

```
![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1651146746275-69ecf780-030b-44a2-b47a-ce55134d4f4e.png#clientId=u3eaf6c43-6b8d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=69&id=ufa39f440&margin=%5Bobject%20Object%5D&name=image.png&originHeight=69&originWidth=574&originalType=binary&ratio=1&rotation=0&showTitle=false&size=28204&status=done&style=none&taskId=u613d1314-9649-4bf0-b80d-4400f60a364&title=&width=574)<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1651146784375-04cccf6c-ee46-4935-815f-16e492b60593.png#clientId=u3eaf6c43-6b8d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=94&id=udec190a0&margin=%5Bobject%20Object%5D&name=image.png&originHeight=94&originWidth=206&originalType=binary&ratio=1&rotation=0&showTitle=false&size=18384&status=done&style=none&taskId=u1f4ffe4d-d3f6-4c11-a93a-3204b56e7aa&title=&width=206)

![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1651147587194-ec4143b7-e424-4a12-baef-c5e948683553.png#clientId=u3eaf6c43-6b8d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=325&id=u4ef4f143&margin=%5Bobject%20Object%5D&name=image.png&originHeight=325&originWidth=892&originalType=binary&ratio=1&rotation=0&showTitle=false&size=123952&status=done&style=none&taskId=ufe1b5542-b807-4f04-bb7b-97dd013a632&title=&width=892)<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1651147628449-44c8cf03-850e-4355-b315-5a6129a45982.png#clientId=u3eaf6c43-6b8d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=72&id=u24732a9c&margin=%5Bobject%20Object%5D&name=image.png&originHeight=72&originWidth=874&originalType=binary&ratio=1&rotation=0&showTitle=false&size=65761&status=done&style=none&taskId=ud95cfb3f-8906-48dc-b5ed-616324886e9&title=&width=874)<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1651147652236-827b494c-aa0f-46ec-b52a-a4ce1dbe9ca6.png#clientId=u3eaf6c43-6b8d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=373&id=u05083b4f&margin=%5Bobject%20Object%5D&name=image.png&originHeight=373&originWidth=1012&originalType=binary&ratio=1&rotation=0&showTitle=false&size=310194&status=done&style=none&taskId=u5993e784-4036-4232-9699-0d3b8c4f273&title=&width=1012)<br />配置nginx
```nginx
upstream nacos-cluster {
    server 127.0.0.1:8845;
    server 127.0.0.1:8846;
    server 127.0.0.1:8847;
}

server {
    listen       80;
    server_name  localhost;

    location /nacos {
        proxy_pass http://nacos-cluster;
    }
}
```
```yaml
spring:
  cloud:
    nacos:
      server-addr: localhost:80 # Nacos地址
```

# Sentinet
> [官网](https://github.com/alibaba/Sentinel) [中文介绍](https://github.com/alibaba/Sentinel/wiki/%E4%BB%8B%E7%BB%8D) [下载](https://github.com/alibaba/Sentinel/releases) [用法](https://spring-cloud-alibaba-group.github.io/github-pages/greenwich/spring-cloud-alibaba.html#_spring_cloud_alibaba_sentinel) [系统规则配置](https://github.com/alibaba/Sentinel/wiki/%E7%B3%BB%E7%BB%9F%E8%87%AA%E9%80%82%E5%BA%94%E9%99%90%E6%B5%81)

运行 java -jar sentinel-dashboard-1.7.0.jar  [http://localhost:8080](http://localhost:8080) 登录账号密码均为sentinel<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1651147964605-2e49a152-a076-4e93-8c7e-69df911b83da.png#clientId=u3eaf6c43-6b8d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=518&id=u8e4e1d94&margin=%5Bobject%20Object%5D&name=image.png&originHeight=518&originWidth=1096&originalType=binary&ratio=1&rotation=0&showTitle=false&size=46550&status=done&style=none&taskId=u2a83d109-f5d2-4721-8470-6ed59956d4d&title=&width=1096)
```yaml
server:
  port: 8401

spring:
  main:
    allow-circular-references: true
  application:
    name: cloud-sentinel-service
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
    sentinel:
      transport:
        dashboard: localhost:8080
        port: 8719
      # 持久化配置  
      datasource:
        ds1:
          nacos:
            username: nacos
            password: nacos
            server-addr: localhost:8848
            dataId: cloud-sentinel-service
            groupId: DEFAULT_GROUP
            data-type: json
            rule-type: flow
feign:
  sentinel:
    enabled: true
```
```java
@RestController
@RequestMapping("sentinel")
@Slf4j
public class RateLimitController {

    // 资源名称为临时节点，URL为持久
    @GetMapping("testD")
    @SentinelResource(value = "testD",fallback = "fallback",
                      blockHandlerClass = SentinelHandle.class,
                      blockHandler = "handleException")
    public String testD() {
        return "testD";
    }

    public static String fallback() {
        return "异常 失败方法";
    }
    
    // 热点Key
    @GetMapping("testC")
    @SentinelResource(value = "testC",blockHandler = "dealTestC")
    public String testC(@RequestParam("p1") String p1,@RequestParam("p2") String p2) {
        return "testC";
    }

    public String dealTestC(String p1, String p2, BlockException e) {

        return "dealTestC";
    }


}

public class SentinelHandle {

    public static String handleException(BlockException e) {
        return "sentinel 失败方法";
    }
}
```
```json
[    
    {         
        "resource": "/sentinel/testD",
        "limitApp": "default",
        "grade": 1,
        "count": 1,
        "strategy": 0,
        "controlBehavior": 0,
        "clusterMode": false
    }
]
```



# Seata

> [官网](http://seata.io/zh-cn/)

## TC/TM/RM三大组件

分布式事务的执行流程

- TM开启分布式事务(TM向TC注册全局事务记录)
- 换业务场景，编排数据库，服务等事务内资源（RM向TC汇报资源准备状态）
- TM结束分布式事务，事务一阶段结束（TM通知TC提交/回滚分布式事务）
- TC汇总事务信息，决定分布式事务是提交还是回滚
- TC通知所有RM提交/回滚资源，事务二阶段结束。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1651149259995-d9ddd99f-7983-46d0-9cab-2e3611354c94.png#clientId=u3eaf6c43-6b8d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=439&id=u203038f9&margin=%5Bobject%20Object%5D&name=image.png&originHeight=439&originWidth=780&originalType=binary&ratio=1&rotation=0&showTitle=false&size=183150&status=done&style=none&taskId=u6fde7f08-5400-4c84-a208-2a032aa6484&title=&width=780)

## 配置文件
```json
registry {
  # file 、nacos 、eureka、redis、zk、consul、etcd3、sofa
  type = "file"
  nacos {
    application = "seata-server"
    serverAddr = "127.0.0.1:8848"
    group = "SEATA_GROUP"
    namespace = ""
    cluster = "default"
    username = ""
    password = ""
  }
  file {
    name = "file.conf"
  }
}

config {
  # file、nacos 、apollo、zk、consul、etcd3
  type = "file"

  nacos {
    serverAddr = "127.0.0.1:8848"
    namespace = ""
    group = "SEATA_GROUP"
    username = ""
    password = ""
    dataId = "seataServer.properties"
  }
  file {
    name = "file.conf"
  }
}

```
```json
## transaction log store, only used in seata-server
store {
  ## store mode: file、db、redis
  mode = "file"
  ## rsa decryption public key
  publicKey = ""
  ## file store property
  file {
    ## store location dir
    dir = "sessionStore"
    # branch session size , if exceeded first try compress lockkey, still exceeded throws exceptions
    maxBranchSessionSize = 16384
    # globe session size , if exceeded throws exceptions
    maxGlobalSessionSize = 512
    # file buffer size , if exceeded allocate new buffer
    fileWriteBufferCacheSize = 16384
    # when recover batch read size
    sessionReloadReadSize = 100
    # async, sync
    flushDiskMode = async
  }

  ## database store property
  db {
    ## the implement of javax.sql.DataSource, such as DruidDataSource(druid)/BasicDataSource(dbcp)/HikariDataSource(hikari) etc.
    datasource = "druid"
    ## mysql/oracle/postgresql/h2/oceanbase etc.
    dbType = "mysql"
    driverClassName = "com.mysql.jdbc.Driver"
    ## if using mysql to store the data, recommend add rewriteBatchedStatements=true in jdbc connection param
    url = "jdbc:mysql://127.0.0.1:3306/seata?rewriteBatchedStatements=true"
    user = "mysql"
    password = "mysql"
    minConn = 5
    maxConn = 100
    globalTable = "global_table"
    branchTable = "branch_table"
    lockTable = "lock_table"
    queryLimit = 100
    maxWait = 5000
  }

  ## redis store property
  redis {
    ## redis mode: single、sentinel
    mode = "single"
    ## single mode property
    single {
      host = "127.0.0.1"
      port = "6379"
    }
    ## sentinel mode property
    sentinel {
      masterName = ""
      ## such as "10.28.235.65:26379,10.28.235.65:26380,10.28.235.65:26381"
      sentinelHosts = ""
    }
    password = ""
    database = "0"
    minConn = 1
    maxConn = 10
    maxTotal = 100
    queryLimit = 100
  }
}

```
```json
registry {
  type = "nacos"

  nacos {
    application = "seata-server"
    serverAddr = "localhost:8848"
    group = "SEATA_GROUP"
    namespace = "4388013f-6618-4de0-bb88-8bf280069254"
    cluster = "default"
    username = "nacos"
    password = "nacos"
  }
}#   
#   
config {
 
  type = "nacos"
  nacos {
    serverAddr = "localhost:8848"
    namespace = "4388013f-6618-4de0-bb88-8bf280069254"
    group = "SEATA_GROUP"
    username = "nacos"
    password = "nacos"
    dataId = "seataServer.properties"
  }
}

```
![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1651148694864-4a849c92-7b37-42fd-900d-49d93de0140d.png#clientId=u3eaf6c43-6b8d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=316&id=u17c90c0e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=316&originWidth=1376&originalType=binary&ratio=1&rotation=0&showTitle=false&size=30764&status=done&style=none&taskId=u643fce4f-a3e8-478d-bd2c-4b2ff09488e&title=&width=1376)
```properties
transport.type=TCP
transport.server=NIO
transport.heartbeat=true
transport.enableClientBatchSendRequest=true
transport.threadFactory.bossThreadPrefix=NettyBoss
transport.threadFactory.workerThreadPrefix=NettyServerNIOWorker
transport.threadFactory.serverExecutorThreadPrefix=NettyServerBizHandler
transport.threadFactory.shareBossWorker=false
transport.threadFactory.clientSelectorThreadPrefix=NettyClientSelector
transport.threadFactory.clientSelectorThreadSize=1
transport.threadFactory.clientWorkerThreadPrefix=NettyClientWorkerThread
transport.threadFactory.bossThreadSize=1
transport.threadFactory.workerThreadSize=default
transport.shutdown.wait=3
transport.serialization=seata
transport.compressor=none

# store
#model改为db
store.mode=db
store.lock.mode=file
store.session.mode=file
# store.publicKey=""
store.file.dir=file_store/data
store.file.maxBranchSessionSize=16384
store.file.maxGlobalSessionSize=512
store.file.fileWriteBufferCacheSize=16384
store.file.flushDiskMode=async
store.file.sessionReloadReadSize=100
store.db.datasource=druid
store.db.dbType=mysql
#修改数据驱动，这里是mysql8，使用mysql5的话请修改
store.db.driverClassName=com.mysql.cj.jdbc.Driver
# 改为上面创建的seata服务数据库
store.db.url=jdbc:mysql://127.0.0.1:3306/seata?rewriteBatchedStatements=true&serverTimezone=UTC
# 改为自己的数据库用户名
store.db.user=root
# 改为自己的数据库密码
store.db.password=123456
store.db.minConn=5
store.db.maxConn=30
store.db.globalTable=global_table
store.db.branchTable=branch_table
store.db.distributedLockTable=distributed_lock
store.db.queryLimit=100
store.db.lockTable=lock_table
store.db.maxWait=5000
# log
log.exceptionRate=100
# metrics
metrics.enabled=false
metrics.registryType=compact
metrics.exporterList=prometheus
metrics.exporterPrometheusPort=9898
# service
# 自己命名一个vgroupMapping
service.vgroupMapping.fsp_tx_group=default
service.default.grouplist=127.0.0.1:8091
service.enableDegrade=false
service.disableGlobalTransaction=false
# client
client.rm.asyncCommitBufferLimit=10000
client.rm.lock.retryInterval=10
client.rm.lock.retryTimes=30
client.rm.lock.retryPolicyBranchRollbackOnConflict=true
client.rm.reportRetryCount=5
client.rm.tableMetaCheckEnable=false
client.rm.tableMetaCheckerInterval=60000
client.rm.sqlParserType=druid
client.rm.reportSuccessEnable=false
client.rm.sagaBranchRegisterEnable=false
client.rm.tccActionInterceptorOrder=-2147482648
client.tm.commitRetryCount=5
client.tm.rollbackRetryCount=5
client.tm.defaultGlobalTransactionTimeout=60000
client.tm.degradeCheck=false
client.tm.degradeCheckAllowTimes=10
client.tm.degradeCheckPeriod=2000
client.tm.interceptorOrder=-2147482648
client.undo.dataValidation=true
client.undo.logSerialization=jackson
client.undo.onlyCareUpdateColumns=true
client.undo.logTable=undo_log
client.undo.compress.enable=true
client.undo.compress.type=zip
client.undo.compress.threshold=64k
```

## 执行SQL进行持久化
![image.png](https://cdn.nlark.com/yuque/0/2022/png/12876479/1651148943545-054b6bbf-31fb-4502-8c63-f8f3b2f3f5f2.png#clientId=u3eaf6c43-6b8d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=286&id=PLWly&margin=%5Bobject%20Object%5D&name=image.png&originHeight=286&originWidth=203&originalType=binary&ratio=1&rotation=0&showTitle=false&size=9150&status=done&style=none&taskId=u100d6ea0-0cc4-4db4-9832-bc2cc4330a6&title=&width=203)
```sql
-- for AT mode you must to init this sql for you business database. the seata server not need it.
CREATE TABLE IF NOT EXISTS `undo_log`
(
    `branch_id`     BIGINT       NOT NULL COMMENT 'branch transaction id',
    `xid`           VARCHAR(128) NOT NULL COMMENT 'global transaction id',
    `context`       VARCHAR(128) NOT NULL COMMENT 'undo_log context,such as serialization',
    `rollback_info` LONGBLOB     NOT NULL COMMENT 'rollback info',
    `log_status`    INT(11)      NOT NULL COMMENT '0:normal status,1:defense status',
    `log_created`   DATETIME(6)  NOT NULL COMMENT 'create datetime',
    `log_modified`  DATETIME(6)  NOT NULL COMMENT 'modify datetime',
    UNIQUE KEY `ux_undo_log` (`xid`, `branch_id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4 COMMENT ='AT transaction mode undo table';
-- -------------------------------- The script used when storeMode is 'db' --------------------------------
-- the table to store GlobalSession data
CREATE TABLE IF NOT EXISTS `global_table`
(
    `xid`                       VARCHAR(128) NOT NULL,
    `transaction_id`            BIGINT,
    `status`                    TINYINT      NOT NULL,
    `application_id`            VARCHAR(32),
    `transaction_service_group` VARCHAR(32),
    `transaction_name`          VARCHAR(128),
    `timeout`                   INT,
    `begin_time`                BIGINT,
    `application_data`          VARCHAR(2000),
    `gmt_create`                DATETIME,
    `gmt_modified`              DATETIME,
    PRIMARY KEY (`xid`),
    KEY `idx_status_gmt_modified` (`status` , `gmt_modified`),
    KEY `idx_transaction_id` (`transaction_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- the table to store BranchSession data
CREATE TABLE IF NOT EXISTS `branch_table`
(
    `branch_id`         BIGINT       NOT NULL,
    `xid`               VARCHAR(128) NOT NULL,
    `transaction_id`    BIGINT,
    `resource_group_id` VARCHAR(32),
    `resource_id`       VARCHAR(256),
    `branch_type`       VARCHAR(8),
    `status`            TINYINT,
    `client_id`         VARCHAR(64),
    `application_data`  VARCHAR(2000),
    `gmt_create`        DATETIME(6),
    `gmt_modified`      DATETIME(6),
    PRIMARY KEY (`branch_id`),
    KEY `idx_xid` (`xid`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- the table to store lock data
CREATE TABLE IF NOT EXISTS `lock_table`
(
    `row_key`        VARCHAR(128) NOT NULL,
    `xid`            VARCHAR(128),
    `transaction_id` BIGINT,
    `branch_id`      BIGINT       NOT NULL,
    `resource_id`    VARCHAR(256),
    `table_name`     VARCHAR(32),
    `pk`             VARCHAR(36),
    `status`         TINYINT      NOT NULL DEFAULT '0' COMMENT '0:locked ,1:rollbacking',
    `gmt_create`     DATETIME,
    `gmt_modified`   DATETIME,
    PRIMARY KEY (`row_key`),
    KEY `idx_status` (`status`),
    KEY `idx_branch_id` (`branch_id`),
    KEY `idx_xid_and_branch_id` (`xid` , `branch_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `distributed_lock`
(
    `lock_key`       CHAR(20) NOT NULL,
    `lock_value`     VARCHAR(20) NOT NULL,
    `expire`         BIGINT,
    primary key (`lock_key`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

INSERT INTO `distributed_lock` (lock_key, lock_value, expire) VALUES ('AsyncCommitting', ' ', 0);
INSERT INTO `distributed_lock` (lock_key, lock_value, expire) VALUES ('RetryCommitting', ' ', 0);
INSERT INTO `distributed_lock` (lock_key, lock_value, expire) VALUES ('RetryRollbacking', ' ', 0);
INSERT INTO `distributed_lock` (lock_key, lock_value, expire) VALUES ('TxTimeoutCheck', ' ', 0);
```

## YML
```yaml
seata:
  #事务群组（可以每个应用独立取名，也可以使用相同的名字），要与服务端nacos-config.txt中service.vgroup_mapping中存在,并且要保证多个群组情况下后缀名要保持一致-tx_group
  enabled: true
  enable-auto-data-source-proxy: true #是否开启数据源自动代理,默认为true
  tx-service-group: fsp_tx_group  #要与配置文件中的vgroupMapping一致
  application-id: seata-server
  registry:  #registry根据seata服务端的registry配置
    type: nacos #默认为file
    nacos:
      application: seata-server #配置自己的seata服务
      server-addr: ${spring.cloud.nacos.discovery.server-addr} #根据自己的seata服务配置
      username: nacos #根据自己的seata服务配置
      password: nacos #根据自己的seata服务配置
      cluster: default # 配置自己的seata服务cluster, 默认为 default
      group: SEATA_GROUP #根据自己的seata服务配置
      namespace: 4388013f-6618-4de0-bb88-8bf280069254
  config:
    type: nacos #默认file,如果使用file不配置下面的nacos,直接配置seata.service
    nacos:
      server-addr: ${spring.cloud.nacos.discovery.server-addr} #配置自己的nacos地址
      group: SEATA_GROUP #配置自己的dev
      username: nacos #配置自己的username
      password: nacos #配置自己的password
      dataId: seataServer.properties # #配置自己的dataId,由于搭建服务端时把客户端的配置也写在了seataServer.properties,所以这里用了和服务端一样的配置文件,实际客户端和服务端的配置文件分离出来更好
      namespace: 4388013f-6618-4de0-bb88-8bf280069254
```
```java
@Service
@Slf4j
public class OrderServiceImpl implements OrderService {
    
    @Resource
    private OrderDao orderDao;
    
    @Autowired
    private StorageService storageService;
    
    @Autowired
    private AccountService accountService;
    
    @Override
    @GlobalTransactional(name = "fsp_order_insert",rollbackFor = Exception.class)
    public void insert(Order order) {
        
        log.info("----------> 新建订单");
        orderDao.insert(order);
        
        log.info("----------> 订单微服务开始调用库存服务，做扣减");
        storageService.decrease(order.getProductId(),order.getCount());
        
        log.info("----------> 订单微服务开始调用账户，做扣减");
        accountService.decrease(order.getUserId(),order.getMoney());
        
        log.info("----------> 修改订单状态 0 -> 1");
        orderDao.update(order.getUserId(),0);
        
        log.info("----------> 订单结束");
    }
    
    @Override
    public void update(Order order) {
        
    }
}

@Component
@FeignClient(name = "seata-account-service")
public interface AccountService {

    @PostMapping("/account/decrease")
    Result<Boolean> decrease(@RequestParam("userId") Long userId, @RequestParam("money") BigDecimal money);
}

@Component
@FeignClient(name = "seata-storage-service")
public interface StorageService {

    @PostMapping("/storage/decrease")
    Result<Boolean> decrease(@RequestParam("productId") Long productId,@RequestParam("count") Integer count);
}

```
