import React from "react";

class MapView extends React.Component {
    constructor(props) {
        super(props);
        this.mapModel = props.mapModel;
    }

    render() {
        return (
            <div>
                <div id="map" className="map"> </div>
            </div>
        )
    }


}

export default MapView;
