import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import LocationOnSharpIcon from '@material-ui/icons/LocationOnSharp';
import LayersIcon from '@material-ui/icons/Layers';
import CreateIcon from '@material-ui/icons/Create';
import PrintIcon from "@material-ui/icons/Print";
import RoomIcon from "@material-ui/icons/Room";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import NavigationIcon from '@material-ui/icons/Navigation';
import BasePlugins from "../plugins/BasePlugins";
import withStyles from "@material-ui/core/styles/withStyles";
import LayerOption from "../plugins/layersSwitch/layerOption";
import OptionsViewModel from "./menuModel";
import Io from "../plugins/KML/IO";
import TextView from "../plugins/Text/textView";
import SearchSharpIcon from '@material-ui/icons/SearchSharp';
import LocateView from "../plugins/Locate/locateView";
import PresetView from "../plugins/Preset/presetView";
import SearchView from "../plugins/Search/search";
import Pdf from "../plugins/PrintPdf/Pdf";
import MoveView from "../plugins/Move/moveView";
import LoginView from "../plugins/Login/login";
import GuidanceView from "../plugins/Guidance/guidance";

const useStyles = (theme) => ({
    list: {
        width: 200,
    },
    fullList: {
        width: 'auto',
    },
    row: {
        marginBottom: "10px",
    },
    root: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        padding: '0 30px',
        zIndex: 2,
    },
});

class TemporaryDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.mapModel = props.mapModel;
        this.state = {
            viewModel: new OptionsViewModel()
        }

    }

    switchWindow(index) {
        this.state.viewModel.select(index);
    }

    closeForms() {
        this.setState(this.state.viewModel.closeAllForms())
    }

    list = () => (
        <div>
            <List>
                <ListItem button onClick={() => this.switchWindow(0)}>
                    <ListItemIcon>
                        <LayersIcon/>
                    </ListItemIcon>
                    切换图层
                </ListItem>
                <ListItem button onClick={() => this.switchWindow(1)}>
                    <ListItemIcon>
                        <CreateIcon/>
                    </ListItemIcon>
                    绘图测量
                </ListItem>
                <ListItem button onClick={() => this.switchWindow(2)}>
                    <ListItemIcon>
                        <RoomIcon/>
                    </ListItemIcon>
                    文字标注
                </ListItem>
            <ListItem button onClick={()=>this.switchWindow(3)}>
                <ListItemIcon>
                    <PrintIcon/>
                </ListItemIcon>
                打印PDF
            </ListItem>
        </List>
            <Divider/>
            <List>
                <ListItem button onClick={() => this.switchWindow(4)}>
                    <ListItemIcon>
                        <AccountCircleIcon/>
                    </ListItemIcon>
                    登录
                </ListItem>
                <ListItem button onClick={() => this.switchWindow(5)}>
                    <ListItemIcon>
                        <LocationOnSharpIcon/>
                    </ListItemIcon>
                    定位
                </ListItem>
                <ListItem button onClick={() => this.switchWindow(6)}>
                    <ListItemIcon>
                        <SearchSharpIcon/>
                    </ListItemIcon>
                    搜索
                </ListItem>
                <ListItem button onClick={() => this.switchWindow(7)}>
                    <ListItemIcon>
                        <NavigationIcon/>
                    </ListItemIcon>
                    路线规划
                </ListItem>
            </List>
        </div>
    );

    renderLayer() {

        return (
            <div>
                <LayerOption mapModel={this.mapModel} visible={this.state.viewModel.onlyOpenIndex === 0}
                             closeWindow={() => this.closeForms()}/>
            </div>
        )
    }

    renderDraw() {
        return (
            <div>
                <BasePlugins mapModel={this.mapModel} visible={this.state.viewModel.onlyOpenIndex === 1}
                             closeWindow={() => this.closeForms()}/>
            </div>
        )
    }

    renderText() {
        return (
            <div>
                <TextView map={this.mapModel.mapData} visible={this.state.viewModel.onlyOpenIndex === 2}
                          closeWindow={() => this.closeForms()}/>
            </div>
        )
    }
    renderPdf(){
        return(<div>
            <Pdf map = {this.mapModel.mapData} visible = {this.state.viewModel.onlyOpenIndex === 3}
                 closeWindow = {() => this.closeForms()}/>
        </div>)
    }
 
    renderLogin() {
        return (
            <div>
                <LoginView mapModel={this.mapModel} visible={this.state.viewModel.onlyOpenIndex === 4}
                            closeWindow={() => this.closeForms()}/>
            </div>
        )
    }

    renderLocate() {
        return (
            <div>
                <LocateView mapModel={this.mapModel} visible={this.state.viewModel.onlyOpenIndex === 5}
                            closeWindow={() => this.closeForms()}/>
            </div>
        )
    }

    renderSearch() {
        return (
            <div>
                <SearchView mapModel={this.mapModel} visible={this.state.viewModel.onlyOpenIndex === 6}
                            closeWindow={() => this.closeForms()}/>
            </div>
        )
    }

    renderGuidance() {
        return (
            <div>
                <GuidanceView mapModel={this.mapModel} visible={this.state.viewModel.onlyOpenIndex === 7}
                            closeWindow={() => this.closeForms()}/>
            </div>
        )
    }


    render() {
        const {classes} = this.props;
        return (
            <div>
                <React.Fragment>
                    <Button onClick={() => this.setState(this.state.viewModel.toggleOpen())}
                            className={classes.root}>贴图工具</Button>
                    <Drawer anchor="left" open={this.state.viewModel.isOpen} onClick={() => {
                        this.setState(this.state.viewModel.toggleOpen());
                    }}>
                        {this.list()}
                    </Drawer>
                </React.Fragment>
                {this.renderLayer()}
                {this.renderDraw()}
                {this.renderText()}
                {this.renderPdf()}
                {this.renderLogin()}
                {this.renderLocate()}
                {this.renderSearch()}
                {this.renderGuidance()}
            </div>
        );
    }

}

export default withStyles(useStyles)(TemporaryDrawer);
