import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Toolbar from "@material-ui/core/Toolbar";
import $ from 'jquery';
import {transform} from 'ol/proj';
import LockIcon from '@material-ui/icons/Lock';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Icon, Text as TextStyle} from "ol/style";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {fromLonLat} from 'ol/proj';
const styles = (theme) => ({
    root: {
        zIndex: 2,
        width:400,
        position: "absolute"
    },
    row: {
        marginTop: "40px",
        marginBottom: "30px",
    },
    row1:{
        marginLeft:"70px",
        fontSize: "17px",
        color:"blue"
    },
    btn:{
        marginLeft:"50px",
        //fontSize: "17px",
        //color:"blue"
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
    tr_link:{
        cursor:"pointer",
    },
    input:{
        marginLeft:'55px'
    },
    tbl:{
        marginLeft:'20px'
    }
})

class LoginView extends React.Component {
    constructor(props) {
        super(props);
        this.mapModel = props.mapModel;
        this.history=[];
        this.state={
           usernow:'nobody',//当前用户，若nobody则是无登录用户
           //存放5个地点的经纬度以供跳转
           result0_lng:0,
           result0_lat:0,
           result1_lng:0,
           result1_lat:0,
           result2_lng:0,
           result2_lat:0,
           result3_lng:0,
           result3_lat:0,
           result4_lng:0,
           result4_lat:0,
           show:false,
        }
    }

    componentWillMount(){
        //模拟一个cookie的效果
        var _this=this;
        $.ajax({
            type:'GET',
            url:'http://localhost:8000/getnowuser?',
            dataType:"jsonp",
            jsonp:'cbg',
            jsonpCallback:'fng',
            success:function(data){
                console.log(data.result);
                //若已经登录则usernow是用户名，否则为nobody
                _this.setState({
                    usernow:data.result
                });
            },
            error:function(err){
                alert("getuserfail");
            }
        })
    }

    register(){
        var usrname=document.getElementById("usrname").value;//用户名
        var pwd=document.getElementById("keywd").value;//密码
        if(usrname==''){
            alert("用户名不能为空!");
        }
        else if(pwd==''){
            alert("密码不能为空!");
        }
        else{
            var _this=this;
            $.ajax({
                type:'GET',
                url:'http://localhost:8000/register?',
                dataType:"jsonp",
                data:{usrname:usrname,pwd:pwd},
                jsonp:'cb',
                jsonpCallback:'fn',
                success:function(data){
                    document.getElementById("usrname").value="";
                    document.getElementById("keywd").value="";
                    alert(data.result);
                },
                error:function(err){
                    alert("fail");
                }
            })
        }
    }
    
    login(){
        var usrname=document.getElementById("usrname").value;//用户名
        var pwd=document.getElementById("keywd").value;//密码
        if(usrname==''){
            alert("用户名不能为空!");
        }
        else if(pwd==''){
            alert("密码不能为空!");
        }
        else{
            var _this=this;
            $.ajax({
                type:'GET',
                url:'http://localhost:8000/login?',
                dataType:"jsonp",
                data:{usrname:usrname,pwd:pwd},
                jsonp:'cbl',
                jsonpCallback:'fnl',
                success:function(data){
                    alert(data.result);
                    //登录成功后修改state中的usernow引发重新渲染
                    if(data.result=="登录成功"){
                        _this.setState({
                            usernow:usrname
                        })
                    }
                },
                error:function(err){
                    alert("faillogin");
                }
            })
        }
    }

    //获取收藏列表
    getStarTable(){
        this.setState({
            show:true
        })
        var _this=this;
$.ajax({
    type:'GET',
    url:'http://localhost:8000/userplace?',
    dataType:"jsonp",
    data:{usrname:_this.state.usernow},
    jsonp:'cblt',
    jsonpCallback:'fnlt',
    success:function(data){
        //alert(data.results.length);
        //对前5个结果进行输出
        if(data.results.length!==0){
            let map = _this.mapModel.mapData;
            var view = map.getView();
            view.setCenter(transform([data.results[0].Placelng-0.012186,data.results[0].Placelat-0.003701], 'EPSG:4326', 'EPSG:3857'));
            view.setZoom(16);
            map.render();
            for(var i=0;i < 5;i++){
                if(data.results[i]){
                    _this.draw(data.results[i].Placename,data.results[i].Placelng,data.results[i].Placelat);
                    var resultname="result"+i+"_name";
                    var elename=document.getElementById(resultname);
                    elename.innerHTML=data.results[i].Placename;
                    var resultaddress="result"+i+"_address";
                    var eleaddress=document.getElementById(resultaddress);
                    eleaddress.innerHTML=data.results[i].Placeinfo;
                    //将每个地点的经纬度存入state以供之后点击切换位置
                    var resultlng="result"+i+"_lng";
                    var resultlat="result"+i+"_lat";
                    _this.setState({
                        [resultlng]:data.results[i].Placelng,
                        [resultlat]:data.results[i].Placelat,
                    })
                }
                else{
                    break;
                }
            }
        }
        else{
            var elename=document.getElementById("result1_name");
            elename.innerHTML="收藏列表为空...";
        }
    },
    error:function(err){
        alert("failgetuesrplace");
    }
})
    }

    logout(){
        var map=this.mapModel.mapData;
        while(this.history.length !== 0){
            map.removeLayer(this.history.pop());
        }
        var _this=this;
        $.ajax({
            type:'GET',
            url:'http://localhost:8000/logout?',
            dataType:"jsonp",
            jsonp:'cbo',
            jsonpCallback:'fno',
            success:function(data){
                alert(data.result);
                //修改state中的usernow引发重新渲染
                _this.setState({
                    usernow:'nobody'
                })
            },
            error:function(err){
                alert("faillogout");
            }
        })
    }

    //在收藏地点标注
    draw(inputText,lng,lat){
        let createStyle = (feature) => {
            return new Style({
                
                text: new TextStyle({
                    //位置
                    textAlign: 'center',
                    //基准线
                    textBaseline: 'middle',
                    //文字样式
                    front: 'normal 14px 微软雅黑',
                    //文本内容
                    text: feature.get('name'),
                    //文字填充颜色
                    fill: new Fill({color: '#FFFFFF'}),
                    stroke: new Stroke({color: '#FF4500', width: 10})
                })
            });
        }
        //let inputText = "test";
        //新建一个要素
        let newFeature = new Feature({
            //几何信息
            geometry: new Point(fromLonLat([lng-0.012186, lat-0.003701])),
            //名称属性
            name: inputText === "" ? '标注点' : inputText
        });
        //设置要素的样式
        newFeature.setStyle(createStyle(newFeature));
        //添加到source层上
        let source = new VectorSource({
            features: [newFeature],
        })
        let layer = new VectorLayer({
            source: source,
        })
        var map=this.mapModel.mapData;
        map.addLayer(layer);
        this.history.push(layer);
    }

    //跳转到搜索结果位置
    jump(id){
        let map = this.mapModel.mapData;
        var view = map.getView();
        //笨方法曲线救国
        switch(id){
            case 0:
                view.setCenter(transform([this.state.result0_lng-0.012186,this.state.result0_lat-0.003701], 'EPSG:4326', 'EPSG:3857'));
                break;
            case 1:
                view.setCenter(transform([this.state.result1_lng-0.012186,this.state.result1_lat-0.003701], 'EPSG:4326', 'EPSG:3857'));
                break;
            case 2:
                view.setCenter(transform([this.state.result2_lng-0.012186,this.state.result2_lat-0.003701], 'EPSG:4326', 'EPSG:3857'));
                break;
            case 3:
                view.setCenter(transform([this.state.result3_lng-0.012186,this.state.result3_lat-0.003701], 'EPSG:4326', 'EPSG:3857'));
                break;
            case 4:
                view.setCenter(transform([this.state.result4_lng-0.012186,this.state.result4_lat-0.003701], 'EPSG:4326', 'EPSG:3857'));
                break;
        }
        view.setZoom(16);
        map.render();
    }

    render() {
        const {classes} = this.props;
        if (this.props.visible){
            if(this.state.usernow=='nobody'){
                return (
                        <div>
                            <Paper className={classes.root}>
                                <Toolbar className={classes.toolbar}>
                                    <IconButton className={classes.button} onClick={() => {
                                        this.props.closeWindow();
                                        this.setState({display:'none',});
                                        }}>
                                        <CloseIcon className={classes.closeIcon}/>
                                    </IconButton>
                                </Toolbar>
                                <div className={classes.row}>
                                    <TextField 
                                        label="用户名" 
                                        id="usrname" 
                                        defaultValue="" 
                                        size="small" 
                                        variant="outlined" 
                                        className={classes.input}
                                        InputProps={{
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                <AccountCircle />
                                              </InputAdornment>
                                            ),
                                          }}
                                    />
                                </div>
                                <div className={classes.row}>
                                    <TextField 
                                        label="密码" 
                                        id="keywd" 
                                        type="password"
                                        defaultValue="" 
                                        size="small" 
                                        variant="outlined" 
                                        className={classes.input}
                                        InputProps={{
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                <LockIcon />
                                              </InputAdornment>
                                            ),
                                          }}
                                    />
                                </div>
                                <div className={classes.row}>
                                    <Button onClick={() => this.register()} id="regisbtn" className={classes.row1}>注册</Button>
                                    <Button onClick={() => this.login()} id="loginbtn" className={classes.row1}>登录</Button>
                                </div>
                            </Paper>
                        </div>
                )
            }
            else{
                return(
                    <div>
                    <Paper className={classes.root}>
                        <Toolbar className={classes.toolbar}>
                            <IconButton className={classes.button} onClick={() => {
                                this.props.closeWindow();
                                this.setState({show:false});
                                var map=this.mapModel.mapData;
                                        while(this.history.length !== 0){
                                            map.removeLayer(this.history.pop());
                                        }
                                }}>
                                <CloseIcon className={classes.closeIcon}/>
                            </IconButton>
                        </Toolbar>
                        <div className={classes.row}>
                            <p className={classes.input}>当前用户: <strong>{this.state.usernow}</strong><a id="nowuser"/></p>
                            <Button onClick={() => this.logout()} id="logoutbtn" className={classes.btn} variant="outlined" color="primary">退出登录</Button>
                            <Button onClick={() => this.getStarTable()} id="getStarTablebtn" className={classes.btn} variant="outlined" color="primary">获取收藏列表</Button>
                        </div>
                        {this.state.show?
                        <div className={classes.row}>
                            <table className={classes.tbl}>
                                <tr className={classes.tr_link}>
                                    <td><p id='result0_name' onClick={()=>this.jump(0)}></p></td>
                                    <td><p id='result0_address' onClick={()=>this.jump(0)}></p></td>
                                </tr>
                                <tr className={classes.tr_link}>
                                    <td><p id='result1_name' onClick={()=>this.jump(1)}></p></td>
                                    <td><p id='result1_address' onClick={()=>this.jump(1)}></p></td>
                                </tr>
                                <tr className={classes.tr_link}>
                                    <td><p id='result2_name' onClick={()=>this.jump(2)}></p></td>
                                    <td><p id='result2_address' onClick={()=>this.jump(2)}></p></td>
                                </tr>
                                <tr className={classes.tr_link}>
                                    <td><p id='result3_name' onClick={()=>this.jump(3)}></p></td>
                                    <td><p id='result3_address' onClick={()=>this.jump(3)}></p></td>
                                </tr>
                                <tr className={classes.tr_link}>
                                    <td><p id='result4_name' onClick={()=>this.jump(4)}></p></td>
                                    <td><p id='result4_address' onClick={()=>this.jump(4)}></p></td>
                                </tr>
                            </table>
                        </div>
                         :null
                        }
                    </Paper>
                </div>
                )
            }
        }
        else return null;
    }
}

export default withStyles(styles)(LoginView);