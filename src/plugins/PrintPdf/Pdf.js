import React from "react";
import jsPDF from "jspdf/dist/jspdf.min";
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import withStyles from "@material-ui/core/styles/withStyles";

const styles =(theme)=>({
    paper:{
        zIndex: 2,
        position:"absolute",
        width:"195px",
    },
    root:{
        zIndex:2,
        position:"absolute",
        height:"200px"
    },
    row:{
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
        marginBottom: "5px"
    },
    closeIcon:{
        fontSize:"normal",
    },
    button:{
        marginLeft: "120px",
    },
    label:{
        marginLeft:"50px",
    },
    label1:{
        marginLeft:"10px",
    }
})
class Pdf extends React.Component{
    constructor(props) {
        super(props);
        this.map = props.map;
        //尺寸字典
        this.dims = {
            a0: [1189,841],
            a1: [841, 594],
            a2: [594, 420],
            a3: [420, 297],
            a4: [297, 210],
            a5: [210, 148],
        }
        //初始化设置
        this.state = {
            format:"a4",
            resolution: 72,
        }

    }
    update =(props)=>(e)=>
    {
        let value = e.target.value;
        if(props !== "format") {
            if (typeof value === "string") {
                value = !Number.isNaN(parseFloat(value))
                    ? parseFloat(value)
                    : !Number.isNaN(parseInt(value))
                        ? parseInt(value)
                        : value;
            }
        }
        this.setState({
            [props]:value,
        })
    }
    printPDF() {
        //格式：a0......a5
        let format = this.state.format;
        //分辨率
        let resolution = this.state.resolution;
        //根据format选取纸张的大小
        let dim = this.dims[format];
        //画布的宽和高
        let width = Math.round((dim[0] * resolution) / 25.4);
        let height = Math.round((dim[1] * resolution) / 25.4);
        let map = this.map;
        let size = map.getSize();
        let viewResolution = map.getView().getResolution()
        map.once('rendercomplete', function () {
            let mapCanvas = document.createElement('canvas');
            mapCanvas.width = width;
            mapCanvas.height = height;
            let mapContext = mapCanvas.getContext('2d');
            Array.prototype.forEach.call(
                document.querySelectorAll('.ol-layer canvas'),
                function (canvas) {
                    if (canvas.width > 0) {
                        let opacity = canvas.parentNode.style.opacity;
                        mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
                        let transform = canvas.style.transform;
                        // Get the transform parameters from the style's transform matrix
                        let matrix = transform
                            .match(/^matrix\(([^\(]*)\)$/)[1]
                            .split(',')
                            .map(Number);
                        // Apply the transform to the export map context
                        CanvasRenderingContext2D.prototype.setTransform.apply(
                            mapContext,
                            matrix
                        );
                        mapContext.drawImage(canvas, 0, 0);
                    }
                }
            );

            let pdf = new jsPDF('landscape', undefined, format);
            pdf.addImage(
                mapCanvas.toDataURL('image/jpeg'),
                'JPEG',
                0,
                0,
                dim[0],
                dim[1]
            );
            pdf.save('map.pdf');

            //重置原始地图的大小
            map.setSize(size);
            map.getView().setResolution(viewResolution);
        });
        // Set print size
        let printSize = [width, height];
        this.map.setSize(printSize);
        let scaling = Math.min(width / size[0], height / size[1]);
        this.map.getView().setResolution(viewResolution / scaling);
        //地图同步渲染;
        this.map.renderSync();
    }
    render(){
        let {classes} = this.props;
        if(this.props.visible)
        return(
            <div>
            <Paper className={classes.paper}>
                <Toolbar className={classes.toolbar}>
                    <IconButton className={classes.button} onClick={()=>this.props.closeWindow()}>
                        <CloseIcon className={classes.closeIcon}/>
                    </IconButton>
                </Toolbar>
                <InputLabel>Page size </InputLabel>
                <NativeSelect
                        value={this.state.format}
                        onChange={this.update("format")}>
                    <option value="a0">A0</option>
                    <option value="a1">A1</option>
                    <option value="a2">A2</option>
                    <option value="a3">A3</option>
                    <option value="a4" selected>A4</option>
                    <option value="a5">A5</option>
                </NativeSelect>
                <InputLabel>Resolution </InputLabel>
                <NativeSelect value = {this.state.resolution} onChange = {this.update("resolution")} className={classes.row}>
                    <option value="72">72 dpi</option>
                    <option value="150">150 dpi</option>
                    <option value="300">300 dpi</option>
                </NativeSelect>
                <Button onClick={()=>this.printPDF()} color = "primary">打印PDF</Button>
            </Paper>
        </div>
    )
        else return null;
    }
}
export default withStyles(styles)(Pdf);
