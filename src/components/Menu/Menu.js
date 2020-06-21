import React, { Component } from 'react';

class Menu extends Component {
    render () {
        return(
            <div className="menu">
                <a href="#" onClick={e => this.props.onClickFunction(e)}>Add Hotspot</a>
            </div>
        )
    }
}

export default Menu;