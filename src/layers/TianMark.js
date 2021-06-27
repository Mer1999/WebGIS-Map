import TileLayer from "ol/layer/Tile";
import TianSourceMark from "../source/TianMapMark";

function TianMarkLayer() {
    return new TileLayer({
        title: "天地图文字标注",
        source: TianSourceMark(),
        visible: false
    })
}

export default TianMarkLayer;
