# 属性描述符


 获取属性描述符

```javascript
var obj = {
    value: 1,
    label: '名称'
}
var desc = Object.getOwnPropertyDescriptor(obj, 'value')
// desc = { configurable: true, enumerable: true, value: 1, writable: true }


```

修改属性描述符

```javascript
Object.defineProperty(obj, 'value', {
    value: 2,
    // 属性不可重写
    writable: false,
    // 属性不可遍历, 不可见 
    // for(const key in obj)、Object.keys(obj)、console.log(obj) 都看不到
    enumerable: false,
    // 属性描述符不能再修改 
    configurable: false,
    get: function() {},
    set: function(value) {}
})

```

冻结一个对象，既不能修改属性，也不能添加属性
```javascript
Object.freeze(obj)
```


密封一个对象，不能添加加属性
```javascript
Object.seal(obj)
```

密封一个对象后虽然不能直接添加属性，但可以利用prototype
```javascript
Class Goods {
    constructor(data) {
        data = { ...data }
        Object.freeze(data)
        Object.defineProperty(this, 'data', {
            get: function () {
                return data
            },
            set: function () {
                throw new Error('set data error)
            }
            configurable: false,
        })
        Object.seal(this)
    }
}


Goods.prototype.value = 'value'
```

冻结原型
```javascript
Object.freeze(Class.prototype)
```

