import VectorSource from "ol/source/Vector";
import KML from "ol/format/KML";
function Kml(url){
    return new VectorSource({
        url: url,
        format: new KML({
            extractStyles: false //至关重要
        }),
        crossOrigin: 'anonymous'
    })
}
export default Kml;
