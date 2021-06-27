import Draw, {createBox, createRegularPolygon} from "ol/interaction/Draw";
import Polygon from "ol/geom/Polygon";

function addInteraction(source, map, drawType, history, style) {
    let value = drawType;
    if (value !== "None") {
        let geometryFunction;//可以根据这个函数实现自定义的绘制图形（拉框交互）
        if (value === 'Polygon') {
            value = 'Circle';
            geometryFunction = createRegularPolygon(4);
        } else if (value === 'Box') {
            value = 'Circle';
            geometryFunction = createBox();
        } else if (value === 'Star') {
            value = 'Circle';
            geometryFunction = function (coordinates, geometry) {
                let center = coordinates[0];
                let last = coordinates[coordinates.length - 1];
                let dx = center[0] - last[0];
                let dy = center[1] - last[1];
                let radius = Math.sqrt(dx * dx + dy * dy);
                let rotation = Math.atan2(dy, dx);
                let newCoordinates = [];
                let numPoints = 10;//五角星一共有10条边
                //计算它们的位置
                for (let i = 0; i < numPoints; ++i) {
                    let angle = rotation + (i * 2 * Math.PI) / numPoints;
                    let fraction = i % 2 === 0 ? 1 : 0.5;
                    let offsetX = radius * fraction * Math.cos(angle);
                    let offsetY = radius * fraction * Math.sin(angle);
                    newCoordinates.push([center[0] + offsetX, center[1] + offsetY]);
                }
                newCoordinates.push(newCoordinates[0].slice());
                if (!geometry) {
                    geometry = new Polygon([newCoordinates]);
                } else {
                    geometry.setCoordinates([newCoordinates]);
                }
                return geometry;
            };
        }
        //circle.point,lineString,Polygon都是它默认的
        let draw = new Draw({
            source: source,
            type: value,
            geometryFunction: geometryFunction,
        });
        //画完之后，保存feature入栈
        draw.on("drawend", e => {
            //设置feature的style
            e.feature.setStyle(style);
            history.counter.push(e.feature);
            history.Overlayer.push(e.feature);
        })
        map.addInteraction(draw);
        return draw;
    } else return null;
}

export default addInteraction;
