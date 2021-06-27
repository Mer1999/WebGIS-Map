import React from "react";
import MoveModel from "./move";
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import IconButton from "@material-ui/core/IconButton";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import SelectFrame from "../SelectFrame/SelectFrame";

const styles = (theme) => ({
    root: {
        marginTop: "740px",
        marginLeft: "0px",
        zIndex: 2,
        position: "absolute"
    }
})

class MoveView extends React.Component {
    constructor(props) {
        super(props);
        this.mapModel = props.mapModel;
        this.moveModel = new MoveModel(this.mapModel);
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Paper className={classes.root}>
                    <IconButton onClick={() => this.moveModel.moveLeft()}><KeyboardArrowLeftIcon/></IconButton>
                    <IconButton onClick={() => this.moveModel.moveRight()}><KeyboardArrowRightIcon/></IconButton>
                    <IconButton onClick={() => this.moveModel.moveUp()}><KeyboardArrowUpIcon/></IconButton>
                    <IconButton onClick={() => this.moveModel.moveDown()}><KeyboardArrowDownIcon/></IconButton>
                </Paper>
            </div>
        )
    }
}

export default withStyles(styles)(MoveView);
