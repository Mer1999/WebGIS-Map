import React from "react";
import TextModel from "./text";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Toolbar from "@material-ui/core/Toolbar";
import withStyles from "@material-ui/core/styles/withStyles";
const styles = (theme) => ({
    toolbar: {
        minHeight: 0,
        alignItems: 'flex-start',
        marginRight:"0px"
    },
    closeIcon:{
        fontSize:"normal",
    },
    button:{
        marginLeft: "170px",
    },
    paper:{
        zIndex:2,
        width:240,
        height:150,
        position:"absolute"
    },
    row1:{
        marginLeft: "30px",
        marginBottom:"5px"
    },
    row2:{
        marginLeft: "10px",
    },
    distance:{
        marginLeft:"5px"
    },
    distance1:{
        marginLeft:"60px"
    }
});
class TextView extends React.Component{
    constructor(props) {
        super(props);
        this.map = props.map;
        this.history = [];
        this.textModel = new TextModel(this.map,this.history);
    }
    render() {
        const {classes} = this.props;
        if(this.props.visible)
        return (
            <div>
                <Paper className={classes.paper}>
                    <Toolbar className={classes.toolbar}>
                        <IconButton className={classes.button} onClick={()=>this.props.closeWindow()}>
                            <CloseIcon className={classes.closeIcon}/>
                        </IconButton>
                    </Toolbar>
                <div className={classes.row1}>
                <label>请输入需要添加的文字:</label>
                 </div>
                    <div className={classes.row2}>
                        <TextField label="Text" id="inputText" defaultValue="" size="small" variant="outlined" />
                    </div>
                <Button color="primary" onClick={() => this.textModel.AddMarked()} className={classes.distance}>添加文字</Button>
                <Button color="primary" onClick={() => this.textModel.removeMarker()} className={classes.distance1}>移除文字</Button>
                </Paper>
            </div>
        )
        else{
            return null;
        }
    }
}
export default withStyles(styles)(TextView);
