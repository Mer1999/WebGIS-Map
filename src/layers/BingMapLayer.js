import TileLayer from "ol/layer/Tile";
import BingMapSource from "../source/BingMap";

function BingMapLayer() {
    let source = BingMapSource();
    return new TileLayer({
        source: source,
        visible: false
    })
}

export default BingMapLayer;
