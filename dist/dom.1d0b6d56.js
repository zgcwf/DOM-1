// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"dom.js":[function(require,module,exports) {
window.dom = {
  create: function create(string) {
    var container = document.createElement('template');
    container.innerHTML = string.trim();
    return container.content.firstChild;
  },
  //用于创建节点
  before: function before(node, node2) {
    node.parentNode.insertBefore(node2, node); //insertBefore语句是将第一个参数插到第二个参数之前
  },
  //将node2插入node的前面
  after: function after(node, node2) {
    node.parentNode.insertBefore(node2, node.nextSibling);
  },
  //将node2插入node的后面，即是将node2插入node下一个节点的前面
  append: function append(parent, node) {
    parent.appendChild(node);
  },
  //将子节点放入父节点，用于新增儿子
  wrap: function wrap(node, parent) {
    dom.before(node, parent); //将父节点放到node节点的前面，成为兄弟关系

    dom.append(parent, node); //再将node作为子节点放入父节点,之前的兄弟关系被移除
  },
  //用于给node节点新增父亲
  remove: function remove(node) {
    //node.remove()太新了，ie不支持
    node.parentNode.removeChild(node);
    return node; //返回移除的node，方便获取
  },
  //用于删除节点
  empty: function empty(node) {
    /*用循环删除后获得引用，如果不需要引用直接用，
    node.innerHTML = ''可以代替下方所有语句 
    */

    /*
     const childNodes = node.childNodes
     等价于
     const {childNodes} = node
     */
    var array = [];
    var x = node.firstChild; //让x等于node的第一个孩子(包含文本节点)

    while (x) {
      array.push(dom.remove(node.firstChild)); //删除第一个孩子并将其放入数组

      x = node.firstChild;
      /*node.childNodes的长度是实时变化的，所以x等于
      他新的第一个孩子*/
    }

    return array;
  },
  //用于删除所有后代，不包括自己
  attr: function attr(node, name, value) {
    // 重载
    if (arguments.length === 3) {
      //如果参数个数等于三，设置属性
      node.setAttribute(name, value);
    } else if (arguments.length === 2) {
      //如果参数个数等于二，读取属性
      return node.getAttribute(name); //注意读取属性需要返回值
    }
  },
  //用于设置或者读取属性
  text: function text(node, string) {
    // 适配
    if (arguments.length === 2) {
      if ('innerText' in node) {
        //IE浏览器
        node.innerText = string;
      } else {
        //其他浏览器
        node.textContent = string;
      }
    } else if (arguments.length === 1) {
      if ('innerText' in node) {
        return node.innerText;
      } else {
        return node.textContent;
      }
    }
  },
  //用于写入或者读取文本内容，不同浏览器用适配解决
  html: function html(node, string) {
    if (arguments.length === 2) {
      node.innerHTML = string;
    } else if (arguments.length === 1) {
      return node.innerHTML;
    }
  },
  //用于读写Html内容
  style: function style(node, name, value) {
    if (arguments.length === 3) {
      // dom.style(div, 'color', 'red')
      node.style[name] = value;
    } else if (arguments.length === 2) {
      if (typeof name === 'string') {
        // dom.style(div, 'color')
        return node.style[name];
      } else if (name instanceof Object) {
        //如果name是Object实例
        // dom.style(div, {color: 'red'})
        var object = name;

        for (var key in object) {
          node.style[key] = object[key];
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
    add: function add(node, className) {
      node.classList.add(className);
    },
    //用于添加class
    remove: function remove(node, className) {
      node.classList.remove(className);
    },
    //用于删除class
    has: function has(node, className) {
      return node.classList.contains(className);
    } //用于判断有无class

  },
  on: function on(node, eventName, fn) {
    node.addEventListener(eventName, fn);
  },
  //用于添加事件监听
  off: function off(node, eventName, fn) {
    node.removeEventListener(eventName, fn);
  },
  //用于删除事件监听
  find: function find(selector, scope) {
    return (scope || document).querySelectorAll(selector); //scope为指定的范围，如果有scope，就在scope里面调用querySelectorAll，
    //如果没有指定scope，则就在document之中调用querySelectorAll
  },
  //用于获取标签或标签们
  parent: function parent(node) {
    return node.parentNode;
  },
  //用于获取父元素
  children: function children(node) {
    return node.children;
  },
  //用于获取子元素
  siblings: function siblings(node) {
    return Array.from(node.parentNode.children).filter(function (n) {
      return n !== node;
    }); //先获取这个节点的父节点的所有儿子的伪数组，将其转换为数组。
    //然后过滤，只要不等于这个节点就将其放入数组中
  },
  //用于获取兄弟姐妹元素
  next: function next(node) {
    var x = node.nextSibling;

    while (x && x.nodeType === 3) {
      x = x.nextSibling;
    }
    /*如果下一个节点存在并且节点的类型为文本，继续循环，
    直到为空或者下一个节点为元素，返回x
     */


    return x;
  },
  //用于获取弟弟
  previous: function previous(node) {
    var x = node.previousSibling;

    while (x && x.nodeType === 3) {
      x = x.previousSibling;
    }
    /*如果上一个节点存在并且节点的类型为文本，继续循环，
    直到为空或者上一个节点为元素，返回x
    */


    return x;
  },
  //用于获取哥哥
  each: function each(nodeList, fn) {
    for (var i = 0; i < nodeList.length; i++) {
      fn.call(null, nodeList[i]);
    }
  },
  //用于遍历所有节点
  index: function index(node) {
    var list = dom.children(node.parentNode); //获得node父节点的所有子节点

    var i; //声明在for外面，在里面的话 return i 会没有被声明

    for (i = 0; i < list.length; i++) {
      if (list[i] === node) {
        break;
      }
    }

    return i;
  } //用于获取排行老几

};
},{}],"../../../AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59915" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js","dom.js"], null)
//# sourceMappingURL=/dom.1d0b6d56.js.map