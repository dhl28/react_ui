import React from 'react';
const zh_url = 'https://www.zhihu.com/signup?next=%2F'
export default class SmallButton extends React.Component {
    handleClick() {
        window.open(zh_url)
    }
    render() {
        return (
            <div>
                <button onClick={this.handleClick}>知乎</button>
            </div>
        );
    }
}
