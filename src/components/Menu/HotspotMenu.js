import React, { Component } from 'react';

class HotspotMenu extends Component {
    render () {
        return(
            <div className="hotspot-menu" style={{transform: this.props.styleMenu}}>
                <a className="hotspot-menu-item" href="#">Rotate</a>
                <a className="hotspot-menu-item" href="#">Delete</a>
                <a className="hotspot-menu-item" href="#">Select scene</a>
                <a className="hotspot-menu-item" href="#">Navigate</a>
            </div>
        )
    }
}

export default HotspotMenu
;