import React from 'react';
import ReactDOM from 'react-dom';
import './style.less';
import Header from './header.jsx';
import Content from './content.jsx';
import Footter from './footter.jsx';

class Root extends React.Component {
    state = {
        // 注意，css和js中，图片路径写法不同
        avatarIcon: require('@/img/default-avatar.png')
    }

    render () {
        return <div id='app'>
            <Header avatarIcon={this.state.avatarIcon}/>

            <Content/>

            <Footter/>
        </div>;
    }
}

ReactDOM.render(<Root/>, document.getElementById('root'));
