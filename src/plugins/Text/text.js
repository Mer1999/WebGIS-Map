import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import React from "react";
import { Text as TextStyle} from "ol/style";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
class TextModel {
    constructor(map, history) {
        this.map = map;
        this.history = history;
    }

    AddMarked() {
        //为地图添加单击监听事件
       this.map.once('click', (evt) => this.clickEvent(evt));

    }

    //鼠标点击时操作
    clickEvent(evt) {
        //鼠标单击点坐标
        let coordinate = evt.coordinate;
        //添加一个新的标注（矢量要素）
        let createStyle = (feature) => {
            return new Style({
                text: new TextStyle({
                    //位置
                    textAlign: 'center',
                    //基准线
                    textBaseline: 'middle',
                    //文字样式
                    front: 'normal 14px 微软雅黑',
                    //文本内容
                    text: feature.get('name'),
                    //文字填充颜色
                    fill: new Fill({color: '#070603'}),
                    stroke: new Stroke({color: '#06eeb5', width: 12})
                })
            });
        }
        let inputText = document.getElementById("inputText").value;
        //新建一个要素
        let newFeature = new Feature({
            //几何信息
            geometry: new Point(coordinate),
            //名称属性
            name: inputText === "" ? '标注点' : inputText
        });
        //设置要素的样式
        newFeature.setStyle(createStyle(newFeature));
        //添加到source层上
        let source = new VectorSource({
            features: [newFeature],
        })
        let layer = new VectorLayer({
            source: source,
        })
        this.map.addLayer(layer);
        this.history.push(layer);
    }

    //移除标记点
    removeMarker() {
        //移除layer即可
        if (this.history.length !== 0)
            this.map.removeLayer(this.history.pop());
    }
}
export default TextModel;
