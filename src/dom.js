window.dom = {
    create(string) {
        const container = document.createElement('template');
        container.innerHTML = string.trim();
        return container.content.firstChild;
    },
    //用于创建节点
    before(node, node2) {
        node.parentNode.insertBefore(node2, node);
        //insertBefore语句是将第一个参数插到第二个参数之前
    },
    //将node2插入node的前面
    after(node, node2) {
        node.parentNode.insertBefore(node2, node.nextSibling);
    },
    //将node2插入node的后面，即是将node2插入node下一个节点的前面
    append(parent, node) {
        parent.appendChild(node);
    },
    //将子节点放入父节点，用于新增儿子
    wrap(node, parent) {
        dom.before(node, parent);
        //将父节点放到node节点的前面，成为兄弟关系
        dom.append(parent, node);
        //再将node作为子节点放入父节点,之前的兄弟关系被移除
    },
    //用于给node节点新增父亲

    remove(node) {
        //node.remove()太新了，ie不支持
        node.parentNode.removeChild(node);
        return node;
        //返回移除的node，方便获取
    },
    //用于删除节点
    empty(node) {
        /*用循环删除后获得引用，如果不需要引用直接用，
       node.innerHTML = ''可以代替下方所有语句 
       */
        /*
         const childNodes = node.childNodes
         等价于
         const {childNodes} = node
         */
        const array = []
        let x = node.firstChild
        //让x等于node的第一个孩子(包含文本节点)
        while (x) {
            array.push(dom.remove(node.firstChild))
            //删除第一个孩子并将其放入数组
            x = node.firstChild
            /*node.childNodes的长度是实时变化的，所以x等于
            他新的第一个孩子*/
        }
        return array
    },
    //用于删除所有后代，不包括自己

    attr(node, name, value) { // 重载
        if (arguments.length === 3) {
            //如果参数个数等于三，设置属性
            node.setAttribute(name, value)
        } else if (arguments.length === 2) {
            //如果参数个数等于二，读取属性
            return node.getAttribute(name)
            //注意读取属性需要返回值
        }
    },
    //用于设置或者读取属性
    text(node, string) { // 适配
        if (arguments.length === 2) {
            if ('innerText' in node) {
                //IE浏览器
                node.innerText = string
            } else {
                //其他浏览器
                node.textContent = string
            }
        } else if (arguments.length === 1) {
            if ('innerText' in node) {
                return node.innerText
            } else {
                return node.textContent
            }
        }
    },
    //用于写入或者读取文本内容，不同浏览器用适配解决
    html(node, string) {
        if (arguments.length === 2) {
            node.innerHTML = string
        } else if (arguments.length === 1) {
            return node.innerHTML
        }
    },
    //用于读写Html内容
    style(node, name, value) {
        if (arguments.length === 3) {
            // dom.style(div, 'color', 'red')
            node.style[name] = value
        } else if (arguments.length === 2) {
            if (typeof name === 'string') {
                // dom.style(div, 'color')
                return node.style[name]
            } else if (name instanceof Object) {
                //如果name是Object实例
                // dom.style(div, {color: 'red'})
                const object = name
                for (let key in object) {
                    node.style[key] = object[key]
                }
            }
        }
    },
    //用于修改style
    /*
    name是变量，node.style[key]= node.style.color
    所以node.style[key] = object[key]
    等价于
    node.style.border= object.border
     */
    class: {
        add(node, className) {
            node.classList.add(className)
        },
        //用于添加class
        remove(node, className) {
            node.classList.remove(className)
        },
        //用于删除class
        has(node, className) {
            return node.classList.contains(className)
        }
        //用于判断有无class
    },
    on(node, eventName, fn) {
        node.addEventListener(eventName, fn)
    },
    //用于添加事件监听
    off(node, eventName, fn) {
        node.removeEventListener(eventName, fn)
    },
    //用于删除事件监听
    find(selector, scope) {
        return (scope || document).querySelectorAll(selector)
        //scope为指定的范围，如果有scope，就在scope里面调用querySelectorAll，
        //如果没有指定scope，则就在document之中调用querySelectorAll
    },
    //用于获取标签或标签们
    parent(node) {
        return node.parentNode
    },
    //用于获取父元素
    children(node) {
        return node.children
    },
    //用于获取子元素
    siblings(node) {
        return Array.from(node.parentNode.children)
            .filter(n => n !== node)
        //先获取这个节点的父节点的所有儿子的伪数组，将其转换为数组。
        //然后过滤，只要不等于这个节点就将其放入数组中
    },
    //用于获取兄弟姐妹元素
    next(node) {
        let x = node.nextSibling
        while (x && x.nodeType === 3) {
            x = x.nextSibling
        }
        /*如果下一个节点存在并且节点的类型为文本，继续循环，
        直到为空或者下一个节点为元素，返回x
         */
        return x
    },
    //用于获取弟弟
    previous(node) {
        let x = node.previousSibling
        while (x && x.nodeType === 3) {
            x = x.previousSibling
        }
        /*如果上一个节点存在并且节点的类型为文本，继续循环，
        直到为空或者上一个节点为元素，返回x
        */
        return x
    },
    //用于获取哥哥
    each(nodeList, fn) {
        for (let i = 0; i < nodeList.length; i++) {
            fn.call(null, nodeList[i])
        }
    },
    //用于遍历所有节点
    index(node) {
        const list = dom.children(node.parentNode)
        //获得node父节点的所有子节点
        let i
        //声明在for外面，在里面的话 return i 会没有被声明
        for (i = 0; i < list.length; i++) {
            if (list[i] === node) {
                break
            }
        }
        return i
    }
    //用于获取排行老几
};

