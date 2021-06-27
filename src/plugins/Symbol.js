import React from "react";
import FormControl from "@material-ui/core/FormControl";
import { CompactPicker as ColorPicker } from "react-color";
import withStyles from "@material-ui/core/styles/withStyles";
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";
const styles = (theme) => ({
    //设置边框界面
    root: {
        display: "flex",
        flexWrap: "wrap", //灵活拆行
        zIndex: 2
    },
    formControl: {
        margin: theme.spacing(1), //外边距
        minWidth: 120, //元素的最小宽度
        zIndex:2
    },
    selectEmpty: {
        marginTop: theme.spacing(2), //上外边距
    },
    row: {
        marginBottom: "10px", //下外边距
    },
});
class Symbol extends React.Component{
    constructor(props) {
        super(props);
        this.mapModel= props.mapModel;
        this.state = {
            lineColor :props.mapModel.lineColor,
            lineWidth: props.mapModel.lineWidth,

            pointFill:props.mapModel.pointFill,
            pointRadius:props.mapModel.pointRadius,

            polygonFill:props.mapModel.polygonFill,
            polygonColor:props.mapModel.polygonColor,
            polygonWidth:props.mapModel.polygonWidth,
            polygonFillOpacity:props.mapModel.polygonFillOpacity,

            circleColor:props.mapModel.circleColor,
            circleFill:props.mapModel.circleFill,
            circleWidth:props.mapModel.circleWidth,
            circleFillOpacity:props.mapModel.circleFillOpacity,

            starColor:props.mapModel.starColor,
            starFill:props.mapModel.starFill,
            starWidth:props.mapModel.starWidth,
            starFillOpacity:props.mapModel.starFillOpacity,

            squareColor:props.mapModel.squareColor,
            squareFill:props.mapModel.squareFill,
            squareWidth:props.mapModel.squareWidth,
            squareFillOpacity:props.mapModel.squareFillOpacity
        }
    }
    update = (props)=>(e)=> {
        let value = e.hex ? e.hex : e.target.value;
        if (typeof value === "string") {
            value = !Number.isNaN(parseFloat(value))
                ? parseFloat(value)
                : !Number.isNaN(parseInt(value))
                    ? parseInt(value)
                    : value;
        }
        this.setState({
            [props]:value,
        })
        this.props.mapModel[props] = value;
        this.props.change();
    }

    renderPointSettings() {
        const { classes } = this.props;
        switch (this.props.type) {
            case 1:
                return(
                    <div>
                        <FormControl className={classes.formControl}>
                            <div>填充色</div>
                            <ColorPicker
                                color={this.state.pointFill}
                                onChange={this.update("pointFill")}
                            />
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel>半径大小</InputLabel>
                            <NativeSelect
                                value={this.state.pointRadius}
                                onChange={this.update("pointRadius")}
                            >
                                <option value="4">4</option>
                                <option value="6">6</option>
                                <option value="8">8</option>
                                <option value="12">12</option>
                            </NativeSelect>
                        </FormControl>
                    </div>
                )
            case 2:
                return (
                    <div>
                        <FormControl className={classes.formControl}>
                            <div>颜色</div>
                            <ColorPicker
                                color={this.state.lineColor}
                                onChange={this.update("lineColor")}
                            />
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel>尺寸</InputLabel>
                            <NativeSelect
                                value={this.state.lineWidth}
                                onChange={this.update("lineWidth")}
                            >
                                <option value="2">小的</option>
                                <option value="4">普通的</option>
                                <option value="7">大的</option>
                                <option value="16">较大的</option>
                            </NativeSelect>
                        </FormControl>
                    </div>
                )
            case 3:
                return(
                    <div>
                        <FormControl className={classes.formControl}>
                            <div>颜色</div>
                            <ColorPicker
                                color={this.state.circleColor}
                                onChange={this.update("circleColor")}
                            />
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <div>填充色</div>
                            <ColorPicker
                                color={this.state.circleFill}
                                onChange={this.update("circleFill")}
                            />
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel>尺寸</InputLabel>
                            <NativeSelect
                                value={this.state.circleWidth}
                                onChange={this.update("circleWidth")}
                            >
                                <option value="2">小的</option>
                                <option value="4">普通的</option>
                                <option value="7">大的</option>
                                <option value="16">较大的</option>
                            </NativeSelect>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel>不透明度</InputLabel>
                            <NativeSelect
                                value={this.state.circleFillOpacity}
                                onChange={this.update("circleFillOpacity")}
                            >
                                <option value="0">0% (透明的)</option>
                                <option value="0.25">25%</option>
                                <option value="0.5">50%</option>
                                <option value="0.75">75%</option>
                                <option value="1">100% (填充)</option>
                            </NativeSelect>
                        </FormControl>
                    </div>
                )
            case 4:
                return (
                    <div>
                        <FormControl className={classes.formControl}>
                            <div>颜色</div>
                            <ColorPicker
                                color={this.state.polygonColor}
                                onChange={this.update("polygonColor")}
                            />
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <div>填充色</div>
                            <ColorPicker
                                color={this.state.polygonFill}
                                onChange={this.update("polygonFill")}
                            />
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel>尺寸</InputLabel>
                            <NativeSelect
                                value={this.state.polygonWidth}
                                onChange={this.update("polygonWidth")}
                            >
                                <option value="2">小的</option>
                                <option value="4">普通的</option>
                                <option value="7">大的</option>
                                <option value="16">较大的</option>
                            </NativeSelect>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel>不透明度</InputLabel>
                            <NativeSelect
                                value={this.state.polygonFillOpacity}
                                onChange={this.update("polygonFillOpacity")}
                            >
                                <option value="0">0% (透明的)</option>
                                <option value="0.25">25%</option>
                                <option value="0.5">50%</option>
                                <option value="0.75">75%</option>
                                <option value="1">100% (填充)</option>
                            </NativeSelect>
                        </FormControl>
                    </div>
                )
            case 5:
                return (
                    <div>
                        <FormControl className={classes.formControl}>
                            <div>颜色</div>
                            <ColorPicker
                                color={this.state.starColor}
                                onChange={this.update("starColor")}
                            />
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <div>填充色</div>
                            <ColorPicker
                                color={this.state.starFill}
                                onChange={this.update("starFill")}
                            />
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel>尺寸</InputLabel>
                            <NativeSelect
                                value={this.state.starWidth}
                                onChange={this.update("starWidth")}
                            >
                                <option value="2">小的</option>
                                <option value="4">普通的</option>
                                <option value="7">大的</option>
                                <option value="16">较大的</option>
                            </NativeSelect>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel>不透明度</InputLabel>
                            <NativeSelect
                                value={this.state.starFillOpacity}
                                onChange={this.update("starFillOpacity")}
                            >
                                <option value="0">0% (透明的)</option>
                                <option value="0.25">25%</option>
                                <option value="0.5">50%</option>
                                <option value="0.75">75%</option>
                                <option value="1">100% (填充)</option>
                            </NativeSelect>
                        </FormControl>
                    </div>
                )
            case 6:
                return (
                    <div>
                        <FormControl className={classes.formControl}>
                            <div>颜色</div>
                            <ColorPicker
                                color={this.state.squareColor}
                                onChange={this.update("squareColor")}
                            />
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <div>填充色</div>
                            <ColorPicker
                                color={this.state.squareFill}
                                onChange={this.update("squareFill")}
                            />
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel>尺寸</InputLabel>
                            <NativeSelect
                                value={this.state.polygonWidth}
                                onChange={this.update("squareWidth")}
                            >
                                <option value="2">小的</option>
                                <option value="4">普通的</option>
                                <option value="7">大的</option>
                                <option value="16">较大的</option>
                            </NativeSelect>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel>不透明度</InputLabel>
                            <NativeSelect
                                value={this.state.polygonFillOpacity}
                                onChange={this.update("squareFillOpacity")}
                            >
                                <option value="0">0% (透明的)</option>
                                <option value="0.25">25%</option>
                                <option value="0.5">50%</option>
                                <option value="0.75">75%</option>
                                <option value="1">100% (填充)</option>
                            </NativeSelect>
                        </FormControl>
                    </div>
                )
            default:
                return undefined;
        }
    }
    render(){
        return(
            <div>
                {this.renderPointSettings()}
            </div>
        );
    }

}
export default withStyles(styles)(Symbol);
