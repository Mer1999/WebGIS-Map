import TileLayer from 'ol/layer/Tile';
import osm from "../source/OSM";

const TileLayers = () => {
    let source = osm();
    let tileLayer = new TileLayer({
        source: source,

    });
    return tileLayer;
}

export default TileLayers;
