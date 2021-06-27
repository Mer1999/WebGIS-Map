import Map from "ol/Map";
import TileLayers from "../layers/TileLayer";
import view from "../View/view";
import vectorSource from "../source/vector";
import {fromLonLat} from "ol/proj";
import vectorLayer from "../layers/VectorLayer";
import BingMapLayer from "../layers/BingMapLayer";
import XYZLayer from "../layers/XYZLayer";
import TianNetLayer from "../layers/TianNet";
import TianMarkLayer from "../layers/TianMark";
import StamenLayer from "../layers/StamenLayer";
import OverviewMap from "ol/control/OverviewMap";
import {defaults as defaultControls} from "ol/control";
import {
    DragRotateAndZoom,
    defaults as defaultInteractions,
} from 'ol/interaction';
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

class MapModel {
    constructor() {
        this.source = vectorSource();
        this.view = view(3, fromLonLat([113.8, 34.6]));
        this.Tile = TileLayers();
        this.vector = vectorLayer(this.source);
        this.BingMap = BingMapLayer();
        this.XYZ = XYZLayer();
        this.TianNetMap = TianNetLayer();
        this.TianMarkMap = TianMarkLayer()
        this.stamenLayer = StamenLayer();
        this.overviewMapControl = new OverviewMap({
            //CSS样式
            className:'ol-overviewmap ol-custom-overviewmap',
            //图层
            layers: [new TileLayer({
                source: new OSM(),
            })],
            //收缩后的图标按钮
            collapseLabel: '\u00BB',
            //当 overviewmapcontrol 收缩为图标按钮时，显示在图标按钮上的文字或者符号，默认为 »；
            label: '\u00AB',
            //收缩
            collapsed: true,
        });
        this.mapData = new Map({
            //添加鹰眼图控件
            controls:defaultControls().extend([this.overviewMapControl]),
            //按住shift用鼠标实现地图的旋转和拖拽
            interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
            layers: [this.Tile, this.BingMap, this.XYZ, this.TianNetMap, this.TianMarkMap, this.stamenLayer, this.vector],
            // 延迟target设置
            target: '',
            view: this.view,
        });
        //设置绘图的style元素初始值

        this.pointRadius = 4;
        this.pointFill = "#e73030";

        this.lineColor = "#a80c30";
        this.lineWidth = 2;

        this.circleColor = "#e73030";
        this.circleFill = '#950f9a';
        this.circleWidth = 2;
        this.circleFillOpacity = 0.25;

        this.polygonFill = '#950f9a';
        this.polygonColor = '#e73030';
        this.polygonWidth = 2;
        this.polygonFillOpacity = 0.25;

        this.squareColor = "#e73030";
        this.squareFill = "#950f9a";
        this.squareWidth = 2;
        this.squareFillOpacity = 0.25;

        this.starColor = "#e73030";
        this.starFill = "#950f9a";
        this.starWidth = 2;
        this.starFillOpacity = 0.25;

        //给国家填充颜色
        this.Color = '#e73030';
        this.Fill = '#950f9a';
        this.FillOpacity = 0.25;


    }
}

export default MapModel;
