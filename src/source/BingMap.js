import BingMaps from "ol/source/BingMaps";

function BingMapSource(){
    return new BingMaps({
        key:'AmH5AL7rzxcP64ZITUP6Qx4v2_hdFbw924vMkCFAtkVtlkUbz-jsnALeAcnIGt-F',
        imagerySet:'AerialWithLabels',
        crossOrigin: 'anonymous'//实现跨域
    });
}
export default BingMapSource;
