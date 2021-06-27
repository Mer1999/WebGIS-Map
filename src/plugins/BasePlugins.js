import React from "react";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputLabel from "@material-ui/core/InputLabel";
import MapWithDrawTools from "./Draw/MapWithDrawTools";
import Snap from "ol/interaction/Snap";
import measureModel from "./Measure/measureModel";
import {withStyles} from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Symbol from "./Symbol";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Circle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import hexToRgb from "./hexToRgb";

const styles = (theme) => ({
    formControl: {
        marginTop:"20px",
        marginLeft:"10px",
        minWidth: 120,
    },
    paper:{
        zIndex:2,
        width:300,
        position:"absolute"
    },
    toolbar: {
        minHeight: 0,
        alignItems: 'flex-start',
        marginRight:"0px"
    },
    closeIcon:{
        fontSize:"normal",
    },
    button:{
        marginLeft: "220px",
    },
    formControl1: {
        margin: theme.spacing(1),
        marginTop:"-50px",
        marginLeft:"60px",
        minWidth: 120,
    },

    formControl2: {
        margin: theme.spacing(1),
        marginTop:"20px",
        minWidth: 120,
    },
    row: {
        marginTop:theme.spacing(3),
        marginBottom: "10px",
    },
});

class BasePlugins extends React.Component {
    constructor(props) {
        super(props);
        this.mapModel = props.mapModel;
        this.history = {'counter': [], 'Overlayer': [], 'helpMsg': []};
        this.mapWithDrawTool = new MapWithDrawTools(this.mapModel);
        this.source = this.mapModel.source;
        this.vector = this.mapModel.vector
        this.measureModel = new measureModel();
        this.type = 0;
        this.state = {
            type: 0,
            visible: true,
        }
    }
    update = () => (e) => {
        let value = e.target.value;
        if (typeof value === "string") {
            value = !Number.isNaN(parseFloat(value))
                ? parseFloat(value)
                : !Number.isNaN(parseInt(value))
                    ? parseInt(value)
                    : value;
        }
        let type = value;
        this.setState({
            type:type,
        })
        this.type = type;
        this.changeStyle();
    }
    changeStyle(){
        let color;
        let width;
        let fill;
        switch(this.type){
            case 2:
                color = this.mapModel.lineColor;
                width = this.mapModel.lineWidth;
                break;
            case 3:
                fill = this.rgba();
                color = this.mapModel.circleColor;
                width = this.mapModel.circleWidth;
                break;
            case 4:
                fill = this.rgba();
                color = this.mapModel.polygonColor;
                width = this.mapModel.polygonWidth;
                break;
            case 5:
                fill = this.rgba();
                color = this.mapModel.starColor;
                width = this.mapModel.starWidth;
                break;
            case 6:
                fill = this.rgba();
                color = this.mapModel.squareColor;
                width = this.mapModel.squareWidth;
                break;
            default:
                break;
        }
        let style = new Style({
            fill:new Fill({
                color:fill,
            }),
            stroke:new Stroke({
                color:color,
                width:width
            }),
            //点设置为圆形样式
            image: new Circle({
                radius: this.mapModel.pointRadius,
                fill: new Fill({
                    color: this.mapModel.pointFill,
                })
            })
        })
        this.addGraph(this.type,style);
    }
    rgba(){
        switch (this.type) {
            case 3:
                return hexToRgb(this.mapModel.circleFill)
                    .replace("rgb", "rgba")
                    .replace(")", `, ${this.mapModel.circleFillOpacity})`);

            case 4:
                return hexToRgb(this.mapModel.polygonFill)
                    .replace("rgb", "rgba")
                    .replace(")", `, ${this.mapModel.polygonFillOpacity})`);

            case 5:
                return hexToRgb(this.mapModel.starFill)
                    .replace("rgb", "rgba")
                    .replace(")", `, ${this.mapModel.starFillOpacity})`);

            case 6:
                return hexToRgb(this.mapModel.squareFill)
                    .replace("rgb", "rgba")
                    .replace(")", `, ${this.mapModel.squareFillOpacity})`);
            default:
                return;
        }
    }

    addGraph(type,style){
        let map = this.mapModel.mapData;
        if (this.draw !== undefined) {
            map.removeInteraction(this.draw);
            map.removeInteraction(this.snap);
            if (this.history.helpMsg.length !== 0)
                map.removeOverlay(this.history.helpMsg.pop());
        }
        let drawType = "None";
        switch (type) {
            case 0:
                drawType = "None";
                break;
            case 1:
                drawType = "Point";
                break;
            case 2:
                drawType = "LineString";
                break;
            case 3:
                drawType = "Circle";
                break;
            case 4:
                drawType = "Polygon";
                break;
            case 5:
                drawType = "Star";
                break;
            case 6:
                drawType = "Box";
                break;
            case 7:
                drawType = "LineString";
                break;
            case 8:
                drawType = "Polygon";
                break;
            default:
                break;
        }
        if (type !== 7 && type !== 8) {
            this.draw = this.mapWithDrawTool.addGraph(this.source,drawType, this.history,style);
            this.snap = new Snap({source:this.source});
            map.addInteraction(this.snap);
        } else {
            this.draw = this.measureModel.measure(drawType, this.source, map, this.history);
        }
    }

    undo(){//删除上一次的绘画
        if (this.history.counter.length!==0) {
            this.source.removeFeature(this.history.counter.pop());
        }
        if(this.history.Overlayer.length!==0)
            this.mapModel.mapData.removeOverlay(this.history.Overlayer.pop());
        return null;
    }

    clear() {
        //删除全部的绘画
        while (this.history.Overlayer.length!==0 && this.history.counter.length!==0)
        {
            this.source.removeFeature(this.history.counter.pop());
            this.mapModel.mapData.removeOverlay(this.history.Overlayer.pop());
        }

    }
    renderForm(){
        const {classes} = this.props;
        return(
            <div className="component">
                <FormControl className={classes.formControl}>
                    <InputLabel className="component" htmlFor="shape-native-helper">
                        绘图对象的类型
                    </InputLabel>
                    <NativeSelect className="component"
                        value={this.state.type}
                        onChange={this.update()}
                        input={<Input name="shape" id="shape-native-helper" />}
                    >
                        <option value="0">None</option>
                        <option value="1">添加点</option>
                        <option value="2">添加线</option>
                        <option value="3">添加圆形</option>
                        <option value="4">添加正方形</option>
                        <option value="5">添加星星</option>
                        <option value="6">添加矩形</option>
                        <option value="7">测量距离</option>
                        <option value="8">测量面积</option>
                    </NativeSelect>
                </FormControl>
                <Symbol mapModel = {this.mapModel} type = {this.state.type} change={()=>this.changeStyle()}/>
            </div>

        )
    }
    render() {
        const {classes} = this.props;
        if(this.props.visible)
        return (
            <div >
                <Paper className={classes.paper}>
                    <Toolbar className={classes.toolbar}>
                        <IconButton className={classes.button} onClick={()=>this.props.closeWindow()}>
                            <CloseIcon className={classes.closeIcon}/>
                        </IconButton>
                    </Toolbar>
                <FormControl className="component" >
                <div className="component">
                    {this.renderForm()}
                    <div className={classes.row}>
                        <Button color = "primary" onClick={()=>this.undo()}>
                            <DeleteIcon />
                            撤销
                        </Button>
                        <Button color = "primary" onClick={() => this.clear()}>
                            <DeleteIcon />
                            删除所有绘画图像
                        </Button>
                    </div>
                </div>
                </FormControl>
                </Paper>
            </div>
        )
        else {
            if (this.draw !== undefined) {
                this.mapModel.mapData.removeInteraction(this.draw);
                if (this.history.helpMsg.length !== 0)
                    this.mapModel.mapData.removeOverlay(this.history.helpMsg.pop());
            }
            return null;
        }
    }
}

export default withStyles(styles)(BasePlugins);
