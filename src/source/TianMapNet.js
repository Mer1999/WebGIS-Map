import XYZ from "ol/source/XYZ";

function TianSource(){
    return new XYZ({
        url: "http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=50059cc572a67fe5db3098190ef4ca19",
        crossOrigin: 'anonymous'
    })
}
export default TianSource;
