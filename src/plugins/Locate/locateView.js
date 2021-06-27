import React from "react";
import LocateModel from "./locate";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Toolbar from "@material-ui/core/Toolbar";
import PresetView from '../Preset/presetView';
import PresetModel from "../Preset/preset";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputLabel from "@material-ui/core/InputLabel";


const styles = (theme) => ({
    root: {
        zIndex: 2,
        //height: 400,
        position: "absolute"
    },
    row: {
        marginTop: "40px",
        marginLeft:"20px",
        marginBottom: "30px"
    },
    distance: {
        marginLeft: "100px"
    },
    toolbar: {
        minHeight: 0,
        alignItems: 'flex-start',
        marginRight: "0px",
        marginBottom: "10px"
    },
    closeIcon: {
        fontSize: "normal",
    },
    button: {
        marginLeft: "320px",
    },
    input:{
        //marginLeft:"10px",
        marginRight:"10px"
    },
    coordinate: {
        float: "left",
        position: "absolute",
        bottom: "10px",
        width: "400px",
        height: "20px",
    },
    btn:{
        marginRight:"10px",
    },
})

class LocateView extends React.Component {
    constructor(props) {
        super(props);
        this.mapModel = props.mapModel;
        this.locateModel = new LocateModel(this.mapModel);
        this.presetModel=new PresetModel(this.mapModel);
        this.state = {
            type:0,
            lng0:113.8,
            lat0:34.6,
            zoom0:5,
            lng1:113.8,
            lat1:34.6,
            zoom1:5,
            now:0,//记录当前使用的是哪一组state数据
            show:false,
        }
    }

    componentDidMount() {
        this.locateModel.coordinate();
    }

    update = (e)=>{
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
            type: type,
            show:false
        })
        this.moveCity(type);
    }

    moveCity(type){
        switch(type){
            case 1:
                this.presetModel.moveToShanghai();
                break;
            case 2:
                this.presetModel.moveToBeijing();
                break;
            case 3:
                this.presetModel.moveToHarbin();
                break;
            case 4:
                this.presetModel.moveToGuangzhou();
                break;
            default:
                break;
        }
    }

    render() {
        const {classes} = this.props;
        if (this.props.visible)
            return (
                <div>
                    <Paper className={classes.root}>
                        <Toolbar className={classes.toolbar}>
                            <IconButton className={classes.button} onClick={() => this.props.closeWindow()}>
                                <CloseIcon className={classes.closeIcon}/>
                            </IconButton>
                        </Toolbar>
                        <div className={classes.row}>
                            <InputLabel className={classes.label1} htmlFor="shape-native-helper">
                                选择预设城市
                            </InputLabel>
                            <NativeSelect className={classes.label1}
                                  value={this.state.type}
                                  onChange={this.update}
                            >
                            <option value="0"></option>
                            <option value="1">上海</option>
                            <option value="2">北京</option>
                            <option value="3">哈尔滨</option>
                            <option value="4">广州</option>
                            </NativeSelect>
                        </div>
                        <div className={classes.row}>
                            <TextField label="请输入经度" id="x" defaultValue="" size="small" variant="outlined" className={classes.input}/>
                            <TextField label="请输入纬度" id="y" defaultValue="" size="small" variant="outlined" className={classes.input}/>
                        </div>
                        <div className={classes.row}>
                            <Button onClick={this.locateModel.xyLocate.bind(this)} variant="outlined" className={classes.btn}  color="primary">经纬度定位</Button>
                            <Button onClick={this.locateModel.getPosition.bind(this)} variant="outlined" className={classes.btn} color="primary">获取当前位置</Button>
                            <Button onClick={this.locateModel.goBack.bind(this)} variant="outlined" className={classes.btn} color="primary">撤销</Button>
                        </div>
                        {this.state.show?
                        <div className={classes.row}>
                            <p>当前经度: <a id="longitude"/></p>
                            <p>当前纬度: <a id="latitude"/></p>
                        </div>
                        :null}
                    </Paper>
                </div>
            )
        else return null;
    }
}

export default withStyles(styles)(LocateView);
