---
title: Zuul跟Gateway的区别
categories: 原理分析
tags:
  - java
  - 分布式
excerpt: Zuul跟Gateway的区别
date: 2021-11-22 9:10:03
cover: '/image/blog/springcloud_arch.png?raw=true' 
---

# Zuul和Gatway两者的比较

- zuul

- - 使用的是阻塞式的 API，不支持长连接，比如 websockets
  - 底层是servlet，Zuul处理的是http请求
  - 没有提供异步支持，流控等均由hystrix支持。
  - 依赖包spring-cloud-starter-netflix-zuul

- gatway

- - Spring Boot和Spring Webflux提供的Netty底层环境，不能和传统的Servlet容器一起使用，也不能打包成一个WAR包。
  - 依赖spring-boot-starter-webflux和/ spring-cloud-starter-gateway
  - 提供了异步支持，提供了抽象负载均衡，提供了抽象流控，并默认实现了RedisRateLimiter。

相同点：

1. 1. 底层都是servlet
   2. 两者均是web网关，处理的是http请求

不同点：

1. 1. 内部实现：gateway对比zuul多依赖了spring-webflux，在spring的支持下，功能更强大，内部实现了限流、负载均衡等，扩展性也更强，但同时也限制了仅适合于Spring Cloud套件
       zuul则可以扩展至其他微服务框架中，其内部没有实现限流、负载均衡等。
   2. 是否支持异步：zuul仅支持同步
       gateway支持异步。理论上gateway则更适合于提高系统吞吐量（但不一定能有更好的性能），最终性能还需要通过严密的压测来决定
   3. 框架设计的角度：gateway具有更好的扩展性，并且其已经发布了2.0.0的RELESE版本，稳定性也是非常好的

总结：总的来说，在微服务架构，如果使用了Spring Cloud生态的基础组件，则Spring Cloud Gateway相比而言更加具备优势，单从流式编程+支持异步上就足以让开发者选择它了。 对于小型微服务架构或是复杂架构（不仅包括微服务应用还有其他非Spring Cloud服务节点），zuul也是一个不错的选择



# Gateway

> [Zuul](https://github.com/Netflix/zuul/wiki)  [文档](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/)


## 三大核心

-  Route  路由是构建网关的基本模块，它由ID，目标URI，一系列的断言和过滤器组成，如果断言为true则匹配该路由
-  Predicate 参考的是java8的java.util.function.Predicate开发人员可以匹配HTTP请求中的所有内容（例如请求头或请求参数），如果请求与断言相匹配则进行路由
-  Filter 指的是Spring框架中GatewayFilter的实例，使用过滤器，可以在请求被路由前或者之后对请求进行修改。

## 工作流程

客户端向springcloudgateway发出请求。如果网关处理程序映射确定请求与路由匹配，则将其发送到网关Web处理程序。此处理程序通过特定于请求的筛选器链运行请求。过滤器被虚线分开的原因是过滤器可以在发送代理请求之前和之后运行逻辑。执行所有“预”过滤器逻辑。然后发出代理请求。发出代理请求后，运行“post”过滤器逻辑<br />![image.png](/image/blog/image.png?raw=true)

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

# 

