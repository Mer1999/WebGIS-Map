import React from 'react';
import addInteraction from "../../Interaction/addInteraction";
import Modify from "ol/interaction/Modify";

// 绘图选项 + 地图
class MapWithDrawTools {
    constructor(props) {
        this.mapModel = props;
    };

    addGraph(source, drawType, history, style) {
        let map = this.mapModel.mapData;
        //修改功能初始化
        this.modify = new Modify({
            source: source,
        });
        map.addInteraction(this.modify);
        //实现画图功能
        this.draw = addInteraction(source, map, drawType, history, style);
        return this.draw;
    }
}

export default MapWithDrawTools;
