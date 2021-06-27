import TileLayer from "ol/layer/Tile";
import Xyz from "../source/XYZ";

function XYZLayer() {
    let source = Xyz();
    return new TileLayer({
        source: source,
        visible: false,
    })

}

export default XYZLayer;
