import React from "react";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import NativeSelect from "@material-ui/core/NativeSelect";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import withStyles from "@material-ui/core/styles/withStyles";
import MVT from "ol/format/MVT";
import TabUnselectedIcon from '@material-ui/icons/TabUnselected';
import FormControl from "@material-ui/core/FormControl";
import {unByKey} from "ol/Observable";
import {CompactPicker as ColorPicker} from "react-color";
import InputLabel from "@material-ui/core/InputLabel";
import hexToRgb from "../hexToRgb";
import MapView from "../../Map/MapView";

//设置CSS样式
const styles = (theme) => ({
    paper: {
        right: "13px",
        width: "auto",
        marginTop: "140px",
        position: "fixed",
        zIndex: 2
    },
    row:{
        marginBottom:"10px",
    },
    formControl: {
        margin: theme.spacing(1), //外边距
        minWidth: 250, //元素的最小宽度
        zIndex:2
    },
    selectEmpty: {
        marginTop: theme.spacing(2), //上外边距
    },
    gap:{
        marginRight:"50px",
    }
});

class SelectFrame extends React.Component{
    //构造函数
    constructor(props){
        super(props);
        this.mapModel = props.mapModel;
        this.map = this.mapModel.mapData;
        this.layer = this.Layer();
        this.state = {
            selectElement:"null",
            open: false,
            Color:this.mapModel.Color,
            Fill: this.mapModel.Fill,
            FillOpacity:this.mapModel.FillOpacity,
        }
        this.style = new Style({
            stroke: new Stroke({
                color: this.mapModel.Color,
                width: 2,
            }),
            fill: new Fill({
                color: this.rgba(),
            }),
        });
    }
    //图标按钮
    change(){
        this.setState({open: !this.state.open},()=>{
            if(this.state.open === true)
            {
                this.map.addLayer(this.layer);
            }
            if(this.state.open === false)
            {
                this.map.removeLayer(this.layer);
            }
        });
    }

    //更新
    update = (props)=>(e)=>{
        let value = e.hex ? e.hex : e.target.value;
        this.selection = {};
        if(props === "selectElement")
        {
            this.setState({
                selectElement:value,
            })
        }
       else if (typeof value === "string") {
            value = !Number.isNaN(parseFloat(value))
                ? parseFloat(value)
                : !Number.isNaN(parseInt(value))
                    ? parseInt(value)
                    : value;
            this.setState({
                [props]: value,
            })
            //更新颜色
            this.mapModel[props] = value;
            this.style.getStroke().setColor(this.mapModel.Color);
            this.style.getFill().setColor(this.rgba());
        }
       //调用Selected函数，更新feature的style
        this.Selected(this.layer,this.style,this.selection);
    }

    Selected(layer,style,selection){
        let selectionLayer = new VectorTileLayer({
                map:this.map,
                renderMode:'vector',
                source: layer.getSource(),
                style:function (feature) {
                    if(feature.getId() in selection){
                        return style;
                    }
                }
        })
         this.listener = this.map.on('click',(event) => {
                layer.getFeatures(event.pixel).then((features) => {
                    if (!features.length||this.state.selectElement === "null") {
                        selection = {};
                        selectionLayer.changed();
                        return;
                    }
                    if(this.state.open === false){
                        selection = {};
                        selectionLayer.changed();
                        unByKey(this.listener);
                        return;
                    }
                    let feature = features[0];
                    if(!feature){
                        return;
                    }
                let fid = feature.getId();
                if (this.state.selectElement === 'singleSelect')
                {
                    selection = {};
                }
                // add selected feature to lookup
                selection[fid] = feature;
                selectionLayer.changed();
            });
        });
    }

    Layer(){
        let layer = new VectorTileLayer({
            source: new VectorTileSource({
                maxZoom: 20,
                format: new MVT({
                    idProperty: 'iso_a3',
                }),
                url: 'https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/' +
                    'ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf',
            }),
        })
        return layer;
    }

    rgba()
    {
        return hexToRgb(this.mapModel.Fill)
            .replace("rgb", "rgba")
            .replace(")", `, ${this.mapModel.FillOpacity})`);
    }

    renderSelect(){
        if(this.state.open)
        return(
            <div>
                <div>
                <FormControl>
                    <InputLabel>选择方式</InputLabel>
                    <NativeSelect
                        value={this.state.selectElement}
                        onChange={this.update('selectElement')}>
                        <option value="null">null</option>
                        <option value="singleSelect">单选择</option>
                        <option value="multiSelect">多选择</option>
                    </NativeSelect>
                </FormControl>
            </div>
                <FormControl>
                    <InputLabel>不透明度</InputLabel>
                    <NativeSelect
                        value={this.state.FillOpacity}
                        onChange={this.update("FillOpacity")}
                    >
                        <option value="0">0% (透明的)</option>
                        <option value="0.25">25%</option>
                        <option value="0.5">50%</option>
                        <option value="0.75">75%</option>
                        <option value="1">100%(填充)</option>
                    </NativeSelect>
                </FormControl>
                {this.renderColor()}
            </div>
        )
        else return null;
    }
    renderColor(){
        return(
            <div>
                <div>
                    <FormControl className={this.props.formControl}>
                        <div>颜色</div>
                        <ColorPicker
                            color={this.state.Color}
                            onChange={this.update('Color')}
                        />
                    </FormControl>
                </div>
                <div>
                    <FormControl className={this.props.formControl}>
                        <div>填充色</div>
                        <ColorPicker
                            color={this.state.Fill}
                            onChange={this.update('Fill')}
                        />
                    </FormControl>
                </div>
            </div>
        )
    }

    render() {
        let {classes} = this.props;
        return(
            <div>
                <FormControl className={classes.formControl}>
                    <div>
                        <Paper className={classes.paper}>
                            <Tooltip title="高亮显示国家板块">
                                <IconButton
                                    onClick={()=>this.change()}><TabUnselectedIcon fontSize="normal"/></IconButton>
                            </Tooltip>
                            {this.renderSelect()}
                        </Paper>
                    </div>
                </FormControl>
        </div>
        )
    }
}
export default withStyles(styles)(SelectFrame);
