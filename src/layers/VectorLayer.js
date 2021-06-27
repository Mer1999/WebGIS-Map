import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Circle from "ol/style/Circle";

function vectorLayer(source) {
    return new VectorLayer({
        source: source,
        visible: true,
        style: new Style({
            //填充样式
            fill: new Fill({
                color: 'rgba(177,7,196,0.2)',
            }),
            //设置线条的样式
            stroke: new Stroke({
                color: '#1c49ce',
                lineCap: 'round',//设置线的两端为圆头
                lineJoin: 'round',//线条连接处的样式
                width: 3
            }),
            //点设置为圆形样式
            image: new Circle({
                radius: 4,
                fill: new Fill({
                    color: '#e73030'
                }),
            }),
        })
    });
}

export default vectorLayer;
