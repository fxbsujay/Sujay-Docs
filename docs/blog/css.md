# CSS选择器

### *

```css
* {
 margin: 0;
 padding: 0;
}
```

首先我们来认识一些简单的选择器，尤其针对初学者，然后再看其他高级的选择器。

星号可以用来定义页面的所有元素。许多开发者会使用这个技巧来把 `margin` 和 `padding` 都设为0。在快速开发测试中这种设置固然是好的，但我建议绝对不要在最终的产品代码中使用。因为会给浏览器增加大量不必要的 `负荷`

星形 `*` 也可以用于子元素选择器（child selectors）

```css
#container * {
 border: 1px solid black;
}
```

这段代码会定义 `#container`  `div` 所有子元素的样式。跟上面一样，如果可以尽量避免使用这个方法

**兼容的浏览器**

- IE6+
- Firefox
- Chrome
- Safari
- Opera

----



### #X

```css
#container {
 width: 960px;
 margin: auto;
}
```

使用＃号作为前缀可以选择该`id`的元素。这是最常见的用法，但使用`id`选择器时要谨慎

**兼容的浏览器**

- IE6+
- Firefox
- Chrome
- Safari
- Opera

------



###  .X

```css
.error {
color: red;
}
```

这是 `class`  类选择器。`id`  和 `class`  类选择器的区别是，类选择器可以定义多个元素。当你想定义一组元素的样式时可以使用 `class` 选择器。另外，可以使用 `id` 选择器来定义某一个特定的元素

**兼容的浏览器**

- IE6+
- Firefox
- Chrome
- Safari
- Opera

------



### X Y

```css
li a {
text-decoration: none;
}
```

> 如果选择器看起来像 `X Y Z A B.error` 这样就错了，问问自己是否真的需要加入这么多*负荷* 

下一个最常见的选择器是 `descendant` 后代选择器。当你需要更精确地定位时，可以使用后代选择器。例如，假如说你只想选择无序列表里的链接，而不是所有的链接？这种情况下你就应该使用后代选择器

****

- IE6+
- Firefox
- Chrome
- Safari
- Opera

------



### X

```css
a { color: red; }
ul { margin-left: 0; }
```

假如你想定义页面里所有 `type` 标签类型一样的元素，而不使用`id`或者 `class` 呢？可以简单地使用元素选择器。比如选择所有的无序列表，可以用 `ul {}` 

- 

------



### X:visited and X:link

```css
a:link { color: red; }
a:visted { color: purple; }
```



我们使用 `:link` 伪类来定义所有还没点击的链接。

另外还有 `:visited` 伪类可以让我们给*曾经*点击过或者*访问过*的链接添加样式

**兼容的浏览器**

- IE7+
- Firefox
- Chrome
- Safari
- Opera

------



### X + Y

```css
ul + p {
 color: red;
}
```

这是邻近元素选择器，*只会*选中紧接在另一个元素后的元素。这上面的示例中，只有每个 `ul` 后面的第一个段落是红色的

**兼容的浏览器**

- IE7+
- Firefox
- Chrome
- Safari
- Opera

------



### X > Y

```css
div#container > ul {
  border: 1px solid black;
}
```

`X Y ` 和 `X > Y` 的区别是后者只会选中直接后代。例如，看看下面的代码

```html
<div id="container">
    <ul>
       <li> List Item
         <ul>
            <li> Child </li>
         </ul>
       </li>
       <li> List Item </li>
       <li> List Item </li>
       <li> List Item </li>
    </ul>
 </div>
```

`#container > ul` 只会定义`id`为 `container` 的`div`里的`ul`元素，而不会定义第一个 `li` 里的 `ul`



因此，使用这种选择器的效果更佳。实际上，在JavaScript中尤其适用

**兼容的浏览器**

- IE7+
- Firefox
- Chrome
- Safari
- Opera

------



### X ~ Y

```css
ul ~ p {
 color: red;
}
```

这种兄弟选择器跟 `X + Y` 很像，但没有那么严格。邻近选择器（ `ul + p` ）只会选择*紧接*在前一个元素后的元素，但兄弟选择器更广泛。比如，在上面的例子中，只要在 `ul` 后的 `p` 兄弟元素都会被选中

**兼容的浏览器**

- IE7+
- Firefox
- Chrome
- Safari
- Opera

------



### X:checked

```css
input[type=radio]:checked {
 border: 1px solid black;
}
```

很简单，这个伪类可以用来定义*选中（checked）*的元素，比如单选按钮（radio）或多选按钮（checkbox）

**兼容的浏览器**

- IE9+
- Firefox
- Chrome
- Safari
- Opera

------



### X:after

> 根据CSS3选择器规范，语法上你应该使用双冒号来`::`来指定伪类。然而，为了兼容多数浏览器，单冒号也被承认。实际上，在目前的情况下，使用单冒号的选择是明智的

伪类 `before` 和 `after` 属于高级用法。几乎每一天都有人找到高效而有创意的新用法。这两个伪类可以在元素前面和后面添加内容。

许多人认识到这两个伪类是因为这是清除浮动的技巧

```css
.clearfix:after {
  content: "";
  display: block;
  clear: both;
  visibility: hidden;
  font-size: 0;
  height: 0;
 }

.clearfix { 
 *display: inline-block; 
 _height: 1%;
}
```

这个例子利用 `:after` 在元素后面添加间隔和清除浮动的元素。这是你值得拥有的高级技巧，尤其是当 `overflow: hidden;` 不管用的时候

**兼容的浏览器**

- IE8+
- Firefox
- Chrome
- Safari
- Opera

------



### X:hover

> 要记住的是在旧版的IE里，hover 只能用于链接标签

```css
div:hover {
	background: #e3e3e3;
}
```

好吧，这个你一定懂。正式的叫法是用户交互伪类 `user action pseudo class` 。听起来有些费解，但实际上并非如此。想给用户鼠标划过的元素添加样式？这就派上用场了

**兼容的浏览器**

- IE6+ （只能用于链接标签）
- Firefox
- Chrome
- Safari
- Opera

------



### X:not(selector)

```css
div:not(#container) {
 color: blue;
}
```

否定伪类非常有用。比如，我希望选中所有的div元素，除了一个`id`为`container`的div。上面的代码就很巧妙地做到了这一点

或者，如果我想选中所有不是段落标签的元素，可以像下面这样，但不建议这样使用

```css
*:not(p) {
	color: green;
}
```

**兼容的浏览器**

- IE9+
- Firefox
- Chrome
- Safari
- Opera

------



### X::pseudoElement

```css
/*段落的第一行*/
p::first-line {
 font-weight: bold;
 font-size: 1.2em;
}
/*段落的第一个字母*/
p::first-letter {
 font-weight: bold;
 font-size: 1.2em;
}
```

**兼容的浏览器**

- IE6+
- Firefox
- Chrome
- Safari
- Opera

------

### X:nth-child(n)

```css
li:nth-child(3) {
 color: red;
}
```

还记得以前我们不可以匹配一组序列元素里的某个元素吗？ `nth-child` 伪元素就能解决这个问题！

要注意的是 `nth-child` 指序列里的第n个元素，从1数起。如果你想匹配列表里的第二个元素，可以使用 `li:nth-child(2)`

我们甚至可以使用这种方法来选择一系列的子元素。比如 `li:nth-child(4n)` 可以选择排在4的倍数的元素

**兼容的浏览器**

- IE9+
- Firefox 3.5+
- Chrome
- Safari

------



### X:nth-last-child(n)

```css
li:nth-last-child(2) {
 color: red;
}
```

假如你有一个无序列表里面有很多子元素，但你只想匹配第三到最后一个元素，那该怎么办？你可以使用伪类 `nth-last-child`

这个技巧跟上面的一样，但是从集合的最后一个数起

**兼容的浏览器**

- IE9+
- Firefox 3.5+
- Chrome
- Safari
- Opera

------



### X:nth-of-type(n)

```css
ul:nth-of-type(3) {
 border: 1px solid black;
}
```

有时候你可能想通过元素的类型 `type` 来选择，而不是子元素 `child`

假设有5个无序列表。如果你想定义第三个 `ul` 的样式，但又没有 `id` 来进行匹配，那么可以使用伪类 `nth-of-type(n)` 。在上面的代码中，只有第三个 `ul` 会有边框

**兼容的浏览器**

- IE9+
- Firefox 3.5+
- Chrome
- Safari

------



### X:nth-last-of-type(n)

```css
ul:nth-last-of-type(3) {
 border: 1px solid black;
}
```

当然，我们也可以使用 `nth-last-of-type` 来选择倒数第n个元素

**兼容的浏览器**

- IE9+
- Firefox 3.5+
- Chrome
- Safari
- Opera

------

### X:first-child

```css
ul li:first-child {
 border-top: none;
}
```

这种伪类可以用于选中母元素的第一个子元素，常常用于去掉第一个或最后一个元素的边框。

例如，假设你有一个序列，每一行的元素都有上边框 `border-top` 和下边框 `border-bottom` 。这样的话第一个和最后一个元素看来起就没有那么整齐。

许多设计师就会通过给第一个和最后一个元素添加样式来解决，但实际上可以使用这里提到的伪类

**兼容的浏览器**

- IE7+
- Firefox
- Chrome
- Safari
- Opera

------

### X:last-child

```css
ul > li:last-child {
 color: green;
}
```

`last-child` 是 `first-child` 的反面，可以匹配最后一个子元素

**兼容的浏览器**

- IE9+
- Firefox
- Chrome
- Safari
- Opera

IE8也支持 `:first-child `，但不支持 `:last-child`

------

### X:only-of-type

```css
ul > li:only-of-type {
 font-weight: bold;
}
```

这个伪类有几种不同的用法。only-of-type会匹配母元素里没有邻近兄弟元素的子元素。例如，匹配所有只有一个列表元素的 `ul`。

首先想想要怎么做？你可以使用 `ul li` ，但这样会匹配*所有*无序列表的元素，这样 `only-of-type` 就是唯一的解决方法

**兼容的浏览器**

- IE9+
- Firefox 3.5+
- Chrome
- Safari
- Opera

------

### X:first-of-type

`first-of-type `可以用来选择该类型的第一个元素



```html
<div>
 <p> My paragraph here. </p>
 <ul>
    <li> List Item 1 </li>
    <li> List Item 2 </li>
 </ul>
 <ul>
    <li> List Item 3 </li>
    <li> List Item 4 </li>
 </ul>   
</div>
```

怎么选中*"List Item 2"*。想到答案了（或者选择放弃）才继续看下面

答案有很多种，首先是使用 `first-of-type`

```css
ul:first-of-type > li:nth-child(2) {
 font-weight: bold;
}
```

上面的代码中，首先找到页面中的第一个无序列表，然后找到它的直接后代，然后选择第二个元素

另一个选择是使用邻近选择器，这里先找到紧跟在 `p` 后面的 `ul`，然后找到最后的元素

```css
p + ul li:last-child {
 font-weight: bold;
}
```

我们还可以尝试使用不同的组合

```css
ul:first-of-type li:nth-last-child(1) {
 font-weight: bold;   
}
```

这里我们先找到页面的第一个 `ul`，然后找到倒数第一个元素

**兼容的浏览器**

- IE9+
- Firefox 3.5+
- Chrome
- Safari
- Opera



### X[title]

```css
a[title] {
 color: green;
}
```

这种是*属性选择器*，在上面的例子中，带有 `title` 属性的链接标签才会被匹配。没有title属性的标签不会受到影响。但如果想更具体地根据属性的值来选择，就继续往下看吧



- IE7+
- Firefox
- Chrome
- Safari
- Opera

------



### X[href]

```css
a[href="http://baidu.com"] {
	color: #1f6053; /* green */
}
```

上面的代码定义了所以指向 http://baidu.com 的链接都是绿色。其他的链接不受影响

我们把赋值放在引号里面，在 JavaScript 中选择元素的时候也要记住这么使用。尽可能地使用 CSS3 标准的选择器

```css
a[href*="baidu"] {
	color: #1f6053; /* green */
}
```

包含baidu的的所有链接

```css

a[href^="http"] {
 background: url(path/to/external/icon.png) no-repeat;
 padding-left: 10px;
}
```

链接前缀中带有http

```css
a[href$=".jpg"] {
 color: red;
}
```

还可以使用正则表达式符号 `$` 来表示字符串的后缀

```css
a[data-info~="external"] {
 color: red;
}
a[data-info~="image"] {
 border: 1px solid black;
}
```

波浪符号（ `~` ）可以让你定义取值带有空格的属性，继续使用前面的自定义属性，创建 `data-info` 属性来匹配带有空格的取值。举个例子，这里我们匹配外部链接和图片链接

```html
<a href="path/to/image.jpg" data-info="external image"> Click Me, Fool </a>
```

**兼容的浏览器**

- IE7+
- Firefox
- Chrome
- Safari
- Opera
