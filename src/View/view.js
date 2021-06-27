import View from "ol/View";
import {get as getProjection} from "ol/proj";

function view(zoom, center) {
    return new View({
        projection: getProjection('EPSG:3857'),
        zoom: zoom,
        center: center
    })
}

export default view;
