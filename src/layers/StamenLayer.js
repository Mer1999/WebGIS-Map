import StameSource from "../source/stamen";
import TileLayer from "ol/layer/Tile";

function StamenLayer() {
    return new TileLayer({
        source: StameSource(),
        visible: false
    })
}

export default StamenLayer;
