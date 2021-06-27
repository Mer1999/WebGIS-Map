import React from "react";
import PresetModel from "./preset";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Toolbar from "@material-ui/core/Toolbar";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputLabel from "@material-ui/core/InputLabel";

const styles =(theme)=>({
    root:{
        zIndex:2,
        position:"absolute",
        height:"200px"

    },
    row:{
        marginTop:"10px",
        marginBottom:"10px"
    },
    distance:{
        marginLeft:"20px",
        width:"100px"
    },
    toolbar: {
        minHeight: 0,
        alignItems: 'flex-start',
        marginRight:"0px",
        marginBottom: "15px"
    },
    closeIcon:{
        fontSize:"normal",
    },
    button:{
        marginLeft: "100px",
    },
    label:{
        marginLeft:"50px",
    },
    label1:{
        marginLeft:"10px",
    }
})
class PresetView extends React.Component{
    constructor(props) {
        super(props);
        this.mapModel = props.mapModel;
        this.presetModel = new PresetModel(this.mapModel);
        this.state = {
            type:0,
        }
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
            type: type
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
        if(this.props.visible)
        return (
            <div>
                <div>
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
            </div>
        )
        else return null;
    }
}
export default withStyles(styles)(PresetView);
