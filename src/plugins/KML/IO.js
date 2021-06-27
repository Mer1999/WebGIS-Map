import React from "react";
import Export from "./export";
import Import from "./Import";
import FormControl from "@material-ui/core/FormControl";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import GetAppIcon from '@material-ui/icons/GetApp';
import ImportContactsSharpIcon from '@material-ui/icons/ImportContactsSharp';
import MoveView from "../Move/moveView";
import Tooltip from "@material-ui/core/Tooltip";

const styles = (theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 10,
        background: "inherit",
        zIndex: 2,
        top: "50px",
        position: "fixed"
    },
    row: {
        marginBottom: "10px",
    },
    Icon: {
        fontSize: "small",
        color: "black",
        marginLeft: "1px",
    },
    paper: {
        right: "13px",
        width:"auto",
        height:"auto",
        marginTop: "90px",
        position: "fixed",
        zIndex: 2
    },
    paper0: {
        marginTop: "200px",
        right: "13px",
        position: "fixed",
        zIndex: 2
    }
});

class Io extends React.Component {
    constructor(props) {
        super(props);
        this.mapModel = props.mapModel;
        this.state = {
            open: false,
        }
    }

    componentDidMount() {
        document.getElementById("export-png").addEventListener('click', () => Export(this.mapModel.mapData));
    }

    renderImport() {
        return <Import mapModel={this.mapModel} open={this.state.open}/>;
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                <FormControl className={classes.formControl}>
                    <div>
                        <Paper className={classes.paper0}>
                            <Tooltip title="导入Kml文件">
                                <IconButton
                                    onClick={() => this.setState({open: !this.state.open})}><ImportContactsSharpIcon
                                    fontSize="normal"/></IconButton>
                            </Tooltip>
                            {this.renderImport()}
                        </Paper>
                    </div>
                </FormControl>
                <Paper className={classes.paper}>
                    <Tooltip title="下载地图图片">
                        <IconButton id="export-png" className="btn btn-default"><GetAppIcon
                            fontSize="normal"/></IconButton>
                    </Tooltip>
                    <a id="image-download" download="map.png"></a>
                </Paper>
            </div>
        )
    }
}

export default withStyles(styles)(Io);
