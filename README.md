# tell-you-write-manage-page

教你如何写一个后端管理页面

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

### 4.2、搞定header

观察效果：

1. 中间文字居中；
2. 右侧头像和content区域内容最右边靠左一点；

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