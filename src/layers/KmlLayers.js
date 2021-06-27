import {Vector as VectorLayer} from "ol/layer";
import Kml from "../source/KML";

function KmlLayers(url) {
    return new VectorLayer({
        source: Kml(url),
    })
}

export default KmlLayers;
