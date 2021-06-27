import XYZ from "ol/source/XYZ";

function TianSourceMark(){
    return new XYZ({
        url: "http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=50059cc572a67fe5db3098190ef4ca19",
        crossOrigin: 'anonymous'
    })
}
export default TianSourceMark;
