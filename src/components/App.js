import React from "react";
import "./App.css";
import TemporaryDrawer from "./menu";
import SelectFrame from "../plugins/SelectFrame/SelectFrame";
import Io from "../plugins/KML/IO";
import MoveView from "../plugins/Move/moveView";
import MapView from "../Map/MapView";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.mapModel = props.mapModel;
    }

    render() {
        return (
            <div>
                <TemporaryDrawer mapModel={this.mapModel}/>
                <Io mapModel={this.mapModel}/>
                <MoveView mapModel={this.mapModel}/>
                <SelectFrame mapModel = {this.mapModel}/>
                <MapView mapModel={this.mapModel}/>
            </div>
        )
    }

}

export default App;
