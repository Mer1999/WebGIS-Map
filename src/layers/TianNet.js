import TileLayer from "ol/layer/Tile";
import TianSource from "../source/TianMapNet";

function TianNetLayer() {
    return new TileLayer({
        title: "天地图路网",
        source: TianSource(),
        visible: false,
    })
}

export default TianNetLayer;
