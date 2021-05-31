##  *我学小程序遇到的问题或遇到的新知识*

#### 1. **defineProperty**

```javascript
let data={
    username:"curry",
    age:33
}
let _this={

}

//利用object.defineProperty
for(let item in data){
    //console.log(item,data[item],{
        //get:获取扩展属性值
        get(){
            return data[item]
        },
        //set : 监视扩展属性的，只要一修改就调用.
        set(newValue){
            console.log('set()',newValue);
            //_this.username=newValue;  千万不要在set中修改当前拓展属性的值，会出现死循环
            data[item]=newValue;
        }
    })
}
console.log(_this);
//通过Object.defineProperty的get方法添加的拓展属性不能直接对象属性修改
_this.username='wade';
console.log(_this.username);
//output ought to be : wade

//代理模式简称 狸猫换太子
```

2. 优先级
```
前言
css选择器的权重问题看似简单，但是如果出错，想要找到出错的原因可是不容易的。本文具体介绍css选择器权重，希望对你有所帮助。

选择器的种类
!important
内联样式
ID选择器
class选择器
元素选择器
通配符选择器
权值和权级的概念
我们可以通过给选择器添加权值和权级这两个概念的方式来更好的理解选择器的权重
（注意:“权值”和“权级”的概念是为了更好的理解权重而提出的，并不是真是存在的)


选择器的权重
有了权值和权级的概念以后，我们就可以参考表格来对元素的权重进行理解。
选择器的权重可以相加，例：


span的权值为 = id选择器100+类选择器10+元素选择器1 = 111

权值相同时
由于HTML代码的执行特点时从上往下执行，因此在权值相同的情况下，后面的选择器会覆盖前面的选择器相同的属性
例：


两个类选择器同时选中div元素，且color属性发生冲突，此时生效的是后面的class2，因此元素的前景色为蓝色

权值不同时
两种选择器覆盖了同一属性，此时权重高的选择器生效。

例：




当前形况下，元素选择器的权值为1，大于通配选择器的权值0，因此对div生效的样式应该是元素选择器里的样式。


权值跃迁

权值跃迁讨论的问题是，当有11个元素选择器和1个类选择器同时选中同一元素时，哪个选择器的样式会生效。
结论是：权级高的选择器的样式会生效。
理解方式1
因为权值不能跃迁，也就意味着无论有多少个0级的选择器，生效的仍然是1级选择器，因 为选择器的权级无法跃迁。
理解方式2
CSS里面的进制并不是10进制，而是256进制，所以10个低级选择器并不能等于1个高级选择器


其他选择器


伪类选择器
属性选择器
伪类选择器和属性选择器的权重相当于类选择器的权重，权级为2级。
伪元素选择器
伪元素选择器的权重相当于元素选择器的权重，权级为1级。
子代选择器
后代选择器
子代和后代有可能是元素选择器、类选择器、id选择器，因此要根据具体情况来具体分析。

```

3. -webkit-box 还需花时间掌握
```

```
4. export default ok
5. promise需要学习 ok
6. 模板字符串
7. bindtouchend
8. transition:{{coverTransition}}
9. map用法
10. box-sizing
11. 42集的一些样式暂时还没弄
12. calc() (css3里面的东西)
13. 三点运算符
14.  transition: transform 1s;
15.  c3中的动画