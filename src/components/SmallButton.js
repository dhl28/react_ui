import React from 'react';
import {Button} from 'antd'
const zh_url = 'https://www.zhihu.com/signup?next=%2F'
export default class SmallButton extends React.Component {
    handleClick() {
        window.open(zh_url)
    }
    render() {
        return (
            <div>
                <Button type='primary' onClick={this.handleClick}>知乎</Button>
            </div>
        );
    }
}
