import React from "react";
import KmlLayers from "../../layers/KmlLayers";
import Typography from "@material-ui/core/Typography";
import {withStyles} from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";

const styles = (theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        zIndex: 2,
    },
    row: {
        marginBottom: "10px",
        zIndex: 2,
    },
    distance: {
        marginRight: "130px",
    },
});

class Import extends React.Component {
    constructor(props) {
        super(props);
        this.mapModel = props.mapModel;
        this.map = this.mapModel.mapData;
    }

    KmlVisible() {
        //获取读取我文件的File对象
        if (this.Kml !== undefined)
            this.map.removeLayer(this.Kml);
        let selectedFile = document.getElementById('file-uploader').files[0];
        if(selectedFile === undefined)
        {
            alert("没有选择文件");
            return;
        }
        let reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = (e) => {
            this.url = e.target.result
            this.Kml = KmlLayers(this.url);
            this.map.addLayer(this.Kml);
        }
    }
    //撤销kml文件
    KmlClose() {
        if (this.Kml !== undefined) {
            this.map.removeLayer(this.Kml);
        } else return null;
    }

    render() {
        const {classes} = this.props;
        if (this.props.open)
            return (
                <div>
                    <FormControl className={classes.formControl}>
                        <Typography fontSize="small">选择要导入的KML文件:</Typography>
                        <div>
                            <input
                                type="file"
                                name="files[]"
                                accept=".kml"
                                multiple={false}
                                id="file-uploader"
                                className={classes.row}
                            />
                            <div>
                                <Button onClick={() => this.KmlVisible()} className={classes.distance}
                                        color="secondary">上传</Button>
                                <Button onClick={() => this.KmlClose()} color="secondary">取消</Button>
                            </div>
                        </div>
                    </FormControl>
                </div>
            )
        else return null;
    }
}

export default withStyles(styles)(Import);

