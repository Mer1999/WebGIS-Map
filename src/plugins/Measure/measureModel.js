import {LineString, Polygon} from "ol/geom";
import {getArea, getLength} from "ol/sphere";
import {unByKey} from "ol/Observable";
import Overlay from "ol/Overlay";
import Draw from "ol/interaction/Draw";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import CircleStyle from "ol/style/Circle";

class measureModel {
    constructor() {};

    measure(type, source, map, history) {
        //current drawFeature
        let sketch;
        //提示语
        let continuePolygonMsg = 'Click to continue drawing the polygon';
        let continueLineMsg = 'Click to continue drawing the line';
        //鼠标移动的事件（提示语会改变）
        let pointerMoveHandler = (evt) => {
            if (evt.dragging) {
                return;
            }
            //初始值
            let helpMsg = 'Click to start drawing';

            if (sketch) {
                let geom = sketch.getGeometry();
                if (geom instanceof Polygon) {
                    helpMsg = continuePolygonMsg;
                } else if (geom instanceof LineString) {
                    helpMsg = continueLineMsg;
                }
            }
            //提示框镶嵌入html
            this.helpTooltipElement.innerHTML = helpMsg;
            this.helpTooltip.setPosition(evt.coordinate);
            this.helpTooltipElement.classList.remove('hidden');
        };

        map.on('pointermove', pointerMoveHandler);

        map.getViewport().addEventListener('mouseout', () => {
            this.helpTooltipElement.classList.add('hidden');
        });

        this.draw = this.measureInteraction(type, source);
        //交互
        map.addInteraction(this.draw);
        this.createMeasureTooltip(map);
        this.createHelpTooltip(map);
        let listener;
        this.draw.on('drawstart', (evt) => {
            //set sketch
            sketch = evt.feature;
            let tooltipCoord = evt.coordinate;
            listener = sketch.getGeometry().on('change', (evt) => {
                let geom = evt.target;
                let output;
                if (geom instanceof Polygon) {
                    output = this.formatArea(geom);
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();//坐标
                } else if (geom instanceof LineString) {
                    output = this.formatLength(geom);
                    tooltipCoord = geom.getLastCoordinate();
                }
                this.measureTooltipElement.innerHTML = output; //测量得到的距离或者面积的标注
                this.measureTooltip.setPosition(tooltipCoord);
            });
        });
        this.draw.on('drawend', (e) => {
            let feature = e.feature;
            history.counter.push(feature);
            history.Overlayer.push(this.measureTooltip);
            history.helpMsg.push(this.helpTooltip);
            this.measureTooltipElement.className = 'tooltip tooltip-static';
            this.measureTooltip.setOffset([0, -7]);
            //unset sketch
            sketch = null;
            // unset tooltip so that a new one can be created
            this.measureTooltipElement = null;
            this.createMeasureTooltip(map);
            unByKey(listener);
        });
        return this.draw;
    }

    //交互
    measureInteraction(type, source) {
        let draw = new Draw({
            source: source,
            type: type,
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)',
                }),
                stroke: new Stroke({
                    color: 'rgba(0, 0, 0, 0.5)',
                    lineDash: [10, 10],
                    width: 2,
                }),
                image: new CircleStyle({
                    radius: 5,
                    stroke: new Stroke({
                        color: 'rgba(0, 0, 0, 0.7)',
                    }),
                    fill: new Fill({
                        color: 'rgba(255, 255, 255, 0.2)',
                    }),
                }),
            }),
        });
        return draw;
    }

    //计算距离
    formatLength(line) {
        let length = getLength(line);//根据坐标系得到实际的长度
        let output;
        if (length > 100) {
            output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
        } else {
            output = Math.round(length * 100) / 100 + ' ' + 'm';
        }
        return output;
    }

    //计算面积
    formatArea(polygon) {
        let area = getArea(polygon);
        let output;
        if (area > 10000) {
            output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
        } else {
            output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
        }
        return output;
    }

    createHelpTooltip(map) {
        if (this.helpTooltipElement) {
            this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
        }
        this.helpTooltipElement = document.createElement('div');
        this.helpTooltipElement.className = 'tooltip hidden';
        this.helpTooltip = new Overlay({
            element: this.helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left',
        });
        //map添加覆盖层（在地图上形成一个浮动的效果）
        map.addOverlay(this.helpTooltip);
    }

    createMeasureTooltip(map) {
        if (this.measureTooltipElement) {
            this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
        }
        this.measureTooltipElement = document.createElement('div');
        this.measureTooltipElement.className = 'tooltip tooltip-measure';
        this.measureTooltip = new Overlay({
            element: this.measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center',
        });
        map.addOverlay(this.measureTooltip);
    }

}

export default measureModel;
