import React from "react";
import Paper from "@material-ui/core/Paper";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import withStyles from "@material-ui/core/styles/withStyles";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = (theme) => ({
    paper: {
        zIndex: 2,
        width: 240,
        position: "absolute"
    },
    toolbar: {
        minHeight: 5,
        alignItems: 'flex-start',
        marginRight: "0px"
    },
    closeIcon: {
        fontSize: "normal",
    },
    button: {
        marginLeft: "170px",
    },
});

class LayerOption extends React.Component {
    constructor(props) {
        super(props)
        this.mapModel = props.mapModel;
        this.state = {
            osm: true,
            vector: true,
            bingMap: false,
            xyz: false,
            tianNet: false,
            tianMark: false,
            stamen: false,
        }
    }

    update = (e) => {
        let type = e.target.name;
        let checked = e.target.checked;
        this.setState({
            ...this.state,
            [type]: checked
        });
        this.switch(type, checked);
    }

    switch(type, checked) {
        let map = this.mapModel.mapData;
        if (checked) {
            switch (type) {
                case "osm":
                    map.getLayers().item(0).setVisible(true);
                    break;
                case "bingMap":
                    map.getLayers().item(1).setVisible(true);
                    break;
                case "xyz":
                    map.getLayers().item(2).setVisible(true);
                    break;
                case "tianNet":
                    map.getLayers().item(3).setVisible(true);
                    break;
                case "tianMark":
                    map.getLayers().item(4).setVisible(true);
                    break;
                case "stamen":
                    map.getLayers().item(5).setVisible(true);
                    break;
                case "vector":
                    map.getLayers().item(6).setVisible(true);
                    break;
                default:
                    break;
            }
        } else {
            switch (type) {
                case "osm":
                    map.getLayers().item(0).setVisible(false);
                    break;
                case "bingMap":
                    map.getLayers().item(1).setVisible(false);
                    break;
                case "xyz":
                    map.getLayers().item(2).setVisible(false);
                    break;
                case "tianNet":
                    map.getLayers().item(3).setVisible(false);
                    break;
                case "tianMark":
                    map.getLayers().item(4).setVisible(false);
                    break;
                case "stamen":
                    map.getLayers().item(5).setVisible(false);
                    break;
                case "vector":
                    map.getLayers().item(6).setVisible(false);
                    break
                default:
                    break;
            }
        }
    }

    renderForm() {
        return (
            <FormGroup className="component">
                <FormControlLabel className="component"
                                  control={<Checkbox checked={this.state.osm} onChange={this.update} name="osm"
                                                     color="secondary"/>} label="openStreetMap"/>
                <FormControlLabel className="component"
                                  control={<Checkbox checked={this.state.bingMap} onChange={this.update} name="bingMap"
                                                     color="secondary"/>} label="Bing Map"/>
                <FormControlLabel className="component"
                                  control={<Checkbox checked={this.state.xyz} onChange={this.update} name="xyz"
                                                     color="secondary"/>} label="XYZ Map"/>
                <FormControlLabel className="component"
                                  control={<Checkbox checked={this.state.tianNet} onChange={this.update} name="tianNet"
                                                     color="secondary"/>} label="TianNet Map"/>
                <FormControlLabel className="component"
                                  control={<Checkbox checked={this.state.tianMark} onChange={this.update}
                                                     name="tianMark" color="secondary"/>} label="TianMark Map"/>
                <FormControlLabel className="component"
                                  control={<Checkbox checked={this.state.stamen} onChange={this.update} name="stamen"
                                                     color="secondary"/>} label="Stamen Map"/>
                <FormControlLabel className="component"
                                  control={<Checkbox checked={this.state.vector} onChange={this.update} name="vector"
                                                     color="secondary"/>} label="Vector Map"/>
            </FormGroup>
        )
    }

    render() {
        const {classes} = this.props;
        if (this.props.visible)
            return (
                <div>
                    <Paper className={classes.paper}>
                        <Toolbar className={classes.toolbar}>
                            <IconButton className={classes.button} onClick={()=>{
                                this.props.closeWindow()
                            }}>
                                <CloseIcon className={classes.closeIcon}/>
                            </IconButton>
                        </Toolbar>
                        {this.renderForm()}
                    </Paper>
                </div>
            )
        else
            return null;
    }
}

export default withStyles(styles)(LayerOption);
