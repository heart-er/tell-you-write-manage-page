# tell-you-write-manage-page

教你如何写一个后端管理页面

# 手把手教你写页面的时候如何使用各种套路（HTML、CSS初中级前端教学）

很多人不太会写 HTML 和 CSS，这里教你如何分析页面结构，如何使用各种标准套路写出各种页面。

以 HTML 和 CSS 为主，部分动态内容加入 js 实现。

所有技巧全部简单暴力，没有兼容性问题（除非你要兼容IE8），但是非常好用。

* 源代码：https://github.com/qq20004604/tell-you-write-manage-page
* 作者微信：qq20004604
* 讨论（QQ群）：387017550


## 1、确定页面内容

<img src='./img/01.png' style='width:100%'/>

## 2、环境准备

* 脚手架：webpack3；
* 前端框架：React；
* css预处理器：less、postcss；
* 其他：babel、eslint、file-loader、style-loader、css-loader、uglifyjs-webpack-plugin、url-loader；

采用我自己之前配好的脚手架，见github链接：https://github.com/qq20004604/react-with-webpack

可以直接fork该脚手架，然后在该脚手架基础上进行开发；

## 3、第一次页面区块划分

前注解释：

* div#box，表示 \<div id='box'>\</div>
* div.content-box，表示 \<div class='content-box'>\</div>

原图分为三块：

* header：Crulse和头像所在的那个部分；
* content：中间的左边栏和右边主要内容区域；
* footter：下方的copyright；

总体思路：

1. 上下部分固定，中间高度可变，宽度都为100%；
2. 中间区域固定宽度，左和右定宽不定高；

详细思路如下：

1. 整体被 div#app 所包含，撑满 100% 的页面区域，position设置为relative；
2. div#app 下包含 div#header，div#content，div#footter 三部分，三部分的position都设置为 absolute；
3. div#header 设置为 top：0，left：0，with：100%，height设置为实际高度；
4. div#footter 思路同样，bottom：0，left：0，with：100%，height设置为实际高度；
5. div#content的top和bottom设置为header和footter的height，left和right设置为0；

然后，div#content再划分为两块，具体思路如下：

1. div#content下包含 div.content-box，宽度设置为定宽。而 div#content 的 overflow-x 属性设置为auto，目的是当中间过窄时，出现滚动条；
2. div.content-box 下含 div.aside和div.article。具体需要注意的情况，等下一次页面模块划分时再进行分析；

## 4、第一次页面区块划分代码

于 src/page 文件夹下新建 main 文件夹，并在该文件夹下新建 app.jsx。

此时 jsx 部分写法如下：

```
render() {
    return <div id={s.root}>
        <Header/>

        <Content/>

        <Footter/>
    </div>;
}
```

因此要引入（当然你也要新建）三个不同的jsx文件和根容器的样式文件，如下：

```
import s from './style.less';
import Header from './header.jsx';
import Content from './content.jsx';
import Footter from './footter.jsx';
```


### 技巧1：上下固定中自适应布局

以这个页面为例，是标准的上下固定中自适应布局。

这种布局其实很简单。

第一，先引入reset.css统一样式，确保不同浏览器的样式是一致的。

第二，DOM结构如下，容器内包含上中下

```
<div id='app'>
    <Header/>

    <Content/>

    <Footter/>
</div>
```

第三，最外层DOM（``<div id='app'>``）的思路是，撑满整个可视区域作为基准容器，并设置绝对定位，为子容器提供定位参考。

这种写法的好处是，我们可以确定最外层DOM一定的撑满的，如果我们使用body标签作为最外层DOM，因为默认样式的不同，我们是不确定的。

样式如下：

```
#root {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

第四，上和下这2个固定。

通过设置绝对定位的属性，使得上和下，分别位于基准容器的最上面和最下面。

样式如下：

```
#header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
}

#footter {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
}
```

第五，中自适应。

自适应的前提是不需要设置高度，因此同样适用绝对定位，通过配置 top 和 bottom 属性，使得高度自适应。

样式如下：

```
#content {
  position: absolute;
  top: 80px;
  bottom: 40px;
  left: 0;
  width: 100%;
}
```

总结：

此时你有了一个上下固定中自适应布局并且宽度100%可视区域的布局了。并且他们都带有定位属性，你下面的布局可以基于这三块进行开发了。

### 4.1、先搞定root样式文件

核心有两步，其他都不太重要（也就是说，不重要的地方你就自己搞定咯）：

```
@import '~common/css/reset.css';

#root {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

分别表示引入reset.css（这个我预置在脚手架里了，只要引入就行，全局生效）；

和设置根容器撑满整个可视区域。


### 技巧2：定高不定宽，内有居中和相对最右侧的元素

这也是一个比较典型的布局。

以本页面为例：

* header部分里有居中和相对最右侧一定距离两个DOM；
* footter部分有居中元素；
* content区域也可以认为，左右两个分栏他们作为总体来看，也是居中的；

写法思路如下：

第一，父容器设置定位属性，不管是absolute或者是relative都可以；

第二，居中元素的思路是很简单。

以左右居中为例，通过 ``left:50%`` 的属性，使其相对于最左侧半个容器宽度的距离。然后再通过 ``transform: translateX(-50%);`` 往回拉自身元素宽度 ``50%`` 的距离。这样自然就实现左右居中。

如果上下居中，思路是一样的，无非是设置 ``top:50%`` 和 ``transform: translateY(-50%);``


第三，相对于最右侧一定距离的元素，这个思路也很简单。

* 该元素设置绝对定位：``position: absolute;``；
* 配置 ``right`` 属性，设置该元素最右侧距离父容器最右侧的距离；
* 设置该元素的宽高；
* 有必要的话，设置上下居中（参考上面第二条的方法）；

同样，如果是相对于左侧，顶部，底部，思路是同样的，只是换个css属性罢了。

### 4.2、搞定header

观察效果：

1. 中间文字居中；
2. 右侧头像和content区域内容最右边靠左一点；

参考上面的【技巧2：定高不定宽，内有居中和相对最右侧的元素】，我们将整个结构变为：

1. 中间文字和右侧头像作为整体，放在一个DIV下，这个DIV相对于整个header居中；
2. 中间文字相对于他父DIV，居中；
3. 右侧头像，相对于父DIV，靠右设置位置；

整体思路如下：

1. div#header内部设一容器div.header-box，固定宽度（同div#content区域宽度）且居中，相对定位；
2. 居中的正常相对于div.header-box居中，右侧头像绝对定位并设置right的值来控制位置；
3. 由于头像应该是可配置的，并且有默认值，因此头像的路径放在根路径中，有默认值（一个默认图片的地址），并将该值传到 div#header，作为头像 img 标签的 src 属性；

具体代码见 src/page/main/header.jsx 相关

<b>图片路径写法：</b>

需要注意的是，js和css中，图片路径的写法是不同的。

具体来说，以我这个webpack的配置为例，

1、同样图片放在 src/img 文件夹下，css中的写法是：

```
background-image: url('~@/title-icon.png');
```

根据的配置是：

```
{
    loader: 'css-loader',
    options: {
        modules: false,
        minimize: true,
        sourceMap: false,
        alias: {
            '@': resolve('src/img'), // '~@/logo.png' 这种写法，会去找src/img/logo.png这个文件
            'common': resolve('src/common')
        }
    }
}
```

2、js中的写法是：

```
state = {
    // 注意，css和js中，图片路径写法不同
    avatarIcon: require('@/img/default-avatar.png')
}
```

根据的配置是：

```
resolve: {
    // 省略后缀名
    extensions: ['.js', '.jsx'],
    alias: {
        '@': resolve('src'),
        'component': resolve('src/components'),
        'common': resolve('src/common'),
        'api': resolve('src/api'),
        'page': resolve('src/page'),
        'assets': resolve('src/assets')
    }
} 
```

当然，也可以写成：``avatarIcon: require('../../img/default-avatar.png')``

3、如果图片会上传到CDN，有固定路径，那就更好写了，直接写成绝对路径即可；

4、图片放在static文件夹下，css可以直接写为：``background-image: url('/default-avatar.png')``

js的话可以写为：

```
state = {
    avatarIcon: 'static/default-avatar.png'
}
```

### 技巧3：文字居中，大小不定但高度固定

文字居中是一个很常见的需求，但情况又比较多。因此我们采用固定套路来实现。

要求描述：

* 父容器 footer，不定高不定宽；
* 文字的 ``font-size`` 已知，但里面文字内容数量不定（也就是说宽度不固定），但要求上下居中，左右居中；

考虑到要求，因此将文字包含在一个div中，整体考虑，于是HTML代码如下：

```
<div id='footter'>
    <div className='footter-copyright'>
        @Copyright 2019 company
    </div>
</div>
```

思路：

1. 将所有文字视为一个整体，不设 div 宽度，让文字大小自然撑起来 div 的宽度和高度；
2. 通过技巧2，让该文字所在div上下左右居中；
3. 需求完成；

css如下：

```
.footter-copyright {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    /* 下面三个属性的px值保持一致
     * 另外，除了第三个，其他2个可以省略，但我习惯明确写其高度和行高
     * 好处是，如果有特殊需求，调起来很方便。
     */
    height: 16px;
    line-height: 16px;
    font-size: 16px;
}
```

另一种写法（已知高度固定）：

```
  .footter-copyright2 {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    height: 40px;
    line-height: 40px;
    font-size: 16px;
  }
```


### 4.3、搞定footter

footter 明显就更简单了，只有一段居中文字而已。参考【技巧3：文字居中，大小不定但高度固定】实现他。

### 技巧4：不定高，整体居中，左右分栏

这也是一个典型的情况。

* 整体居中，宽度固定（可以观察，包括淘宝在内绝大多数页面，中间区域都是定宽的）；
* 居中部分左右分栏，且宽度固定；
* 这里额外情况是，左右分栏之间有距离，但其实没什么影响；
* 左中右三层分栏和左右两层分栏的写法是没有区别的；

思路如下：

* 不考虑极端情况的显示效果（比如用户让浏览器可视区域高度特别小）；
* 三层DIV：
* 祖父容器提供定位属性；
* 父容器定宽，左右居中，且高度撑满祖父容器；
* 左右分栏在该父容器下，且高度撑满，位置分别相对于父容器的左右，宽度定宽配置；

特殊情况：

* 例如整体是撑满整个页面的（即不定宽）；
* 此时一般是左侧定宽，右侧不定宽；
* 左侧写法同上面；
* 右侧写法其实没啥变化，无非是通过 right 和 width 定位，变为通过 left 和 right 定位；
* 此时右侧内部应写成可响应模式，然后使用浮动布局（即 float）；


### 4.4、搞定content

参考上面的 【技巧4：不定高，整体居中，左右分栏】

需要注意的是，这个中间整体看似只有1170px宽，实际应该是1200px宽，右侧分栏的左右分别有 30px 宽度的空隙（这种需要经验和交互进行沟通，或者自己量一下）。

因此右侧分栏实际应该多写一层div，即实际内容区域应在右侧分栏div区域内。

代码如下：

```
@aside-bk-color: #2d4054;

#content {
  position: absolute;
  top: 80px;
  bottom: 40px;
  left: 0;
  width: 100%;
  background-color: #f3f3f3;

  .content {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 1200px;
    height: 100%;

    .aside {
      position: absolute;
      left: 0;
      width: 270px;
      height: 100%;
      background-color: @aside-bk-color;
    }

    .article-box {
      position: absolute;
      left: 270px;
      right: 0;
      height: 100%;
      padding: 0 30px;

      .article {
        position: relative;
        width: 100%;
        height: 100%;
        // 带上颜色，用于确定该位置是正确的
        background-color: #fff;
      }
    }
  }
}
```