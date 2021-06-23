const div = dom.create("<div><span>Newdiv</span></div>");
console.log(div)
//可输入任意标签与内容

dom.before(test, div);
//将div插到test前面

dom.after(test, div);
//将div插入到test后面

dom.append(test, div);
//将div设置为test的儿子

const div3 = dom.create("<div id ='parent'>父亲</div>");
dom.wrap(test, div3);
//将div3设置为test的父亲

/*
dom.remove(div3)
删除div3节点
*/

const nodes = dom.empty(empty);
console.log(nodes);
//删除empty节点里面的所有后代并打印

dom.attr(test, 'title', 'Hi,my name zgc');
const title = dom.attr(test, 'title');
console.log(`title: ${title}`)
/*设置属性和 读取属性并打印，注意是反引号
等价于 console.log(title)
*/

dom.text(zgc, '输入新的内容，原内容被删除');
console.log(dom.text(zgc));

//dom.html(test, 'hihihi')

dom.style(test, 'border', '1px solid red');
//三个参数
console.log(dom.style(test, 'border'));
//两个参数
dom.style(test, { border: '1px solid black', color: 'blue' });
//对象

dom.class.add(test, 'red');
dom.class.add(test, 'blue');
dom.class.remove(test, 'blue');
console.log(dom.class.has(test, 'blue'));
//返回值为布尔值false，因为blue已被移除

const fn = () => {
    console.log('点击了')
}
dom.on(test, 'click', fn)
// dom.off(test, 'click', fn)
//dom.off如果不加注释点击没有反应，因为添加了之后马上又删除了

const testDiv = dom.find('#test')[0]
//注意最后带上索引，因为得到的是一个数组集合
console.log(testDiv)
const test2 = dom.find('#test2')[0]
console.log(dom.find('.red', test2)[0])
//指定了class = ‘red’ 找的范围为test2

console.log(dom.parent(test))
//查询test的父元素节点
console.log(dom.children(travel))
//查询travel的子元素节点

const s2 = dom.find('#s2')[0];
console.log(dom.siblings(s2));
//获取id为s2的节点，找到它的兄弟节点打印出来
console.log(dom.next(s2));
//获取s2的下一个元素节点
console.log(dom.previous(s2))
//获取s2的上一个元素节点

const t = dom.find('#travel')[0]
dom.each(dom.children(t), (n) => dom.style(n, 'color', 'red'))

console.log(dom.index(s2))

//作业

const div1 = dom.find('#test>.red')[0]
// 获取对应的元素
console.log(div1)

dom.style(div1, 'color', 'black')

// 设置 div.style.color
const divList = dom.find('.green')
// 获取多个 div.green元素
dom.each(divList, (n) => { dom.style(n, 'fontSize', '50px'); console.log(n) })
// 遍历 divList 里的所有元素,并将其字体大小设置为50px

