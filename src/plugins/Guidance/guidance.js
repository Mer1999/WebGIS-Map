import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Toolbar from "@material-ui/core/Toolbar";
import $ from 'jquery';
import NativeSelect from "@material-ui/core/NativeSelect";
import {transform} from 'ol/proj';
import LineString from "ol/geom/LineString";

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
        //height: 700,
        position: "absolute"
    },
    row: {
        marginTop: "40px",
        marginBottom: "30px",
        marginLeft:"20px",
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
    coordinate: {
        float: "left",
        position: "absolute",
        bottom: "10px",
        width: "400px",
        height: "20px",
    },
    select:{
        marginLeft:"20px",
    },
    btn:{
        marginRight:"20px",
    },
})

class GuidanceView extends React.Component {
    constructor(props) {
        super(props);
        this.mapModel = props.mapModel;
        this.history=[];
        this.state={
            type:0,
            show:false,
            page:0,
            total:0
        }
    }

    guide(originlat,originlng,deslat,deslng,originuid,desuid){
        var _this=this;
        var url="";
        switch(this.state.type){
            case 0:
                url='http://api.map.baidu.com/directionlite/v1/driving?origin='+originlat+','+originlng+'&destination='+deslat+','+deslng+'&origin_uid='+originuid+'&destination_uid='+desuid+'&ak=v8Cny4rsTP9Lmy6Ev0oTgVg1pcGCvG2W';
                break;
            case 1:
                url='http://api.map.baidu.com/directionlite/v1/driving?origin='+originlat+','+originlng+'&destination='+deslat+','+deslng+'&origin_uid='+originuid+'&destination_uid='+desuid+'&ak=v8Cny4rsTP9Lmy6Ev0oTgVg1pcGCvG2W';
                break;
            case 2:
                url='http://api.map.baidu.com/directionlite/v1/transit?origin='+originlat+','+originlng+'&destination='+deslat+','+deslng+'&origin_uid='+originuid+'&destination_uid='+desuid+'&ak=v8Cny4rsTP9Lmy6Ev0oTgVg1pcGCvG2W';
                break;
            case 3:
                url='http://api.map.baidu.com/directionlite/v1/riding?origin='+originlat+','+originlng+'&destination='+deslat+','+deslng+'&origin_uid='+originuid+'&destination_uid='+desuid+'&ak=v8Cny4rsTP9Lmy6Ev0oTgVg1pcGCvG2W';
                break;
            case 4:
                url='http://api.map.baidu.com/directionlite/v1/walking?origin='+originlat+','+originlng+'&destination='+deslat+','+deslng+'&origin_uid='+originuid+'&destination_uid='+desuid+'&ak=v8Cny4rsTP9Lmy6Ev0oTgVg1pcGCvG2W';
                break;        
        }
        console.log("url:",url);
        $.ajax({
            url:url,
            type:"GET",
            async:false,
            dataType:"jsonp",
            jsonpCallback:"callback",
            contentType:"application/json;charset=utf-8",
            success:function(data){
                var map=_this.mapModel.mapData;
                let view = map.getView();
                // ????????????????????????????????????
                view.setCenter(transform([originlng, originlat], 'EPSG:4326', 'EPSG:3857'));
                view.setZoom(13);
                map.render();
                console.log("dataroute:",data);
                console.log("routes:",data.result.routes[0].steps.length);
                _this.setState({
                    show:true,
                    total:data.result.routes[0].steps.length
                })
                if(_this.state.type==2){
                    for(var j=0;j<data.result.routes[0].steps.length;j++){
                        _this.draw(data.result.routes[0].steps[j][0].start_location.lng,data.result.routes[0].steps[j][0].start_location.lat,data.result.routes[0].steps[j][0].end_location.lng,data.result.routes[0].steps[j][0].end_location.lat);
                    }
                }
                else{
                    for(var j=0;j<data.result.routes[0].steps.length;j++){
                        _this.draw(data.result.routes[0].steps[j].start_location.lng,data.result.routes[0].steps[j].start_location.lat,data.result.routes[0].steps[j].end_location.lng,data.result.routes[0].steps[j].end_location.lat);
                    }
                }
               
                for(var i=1;i<7;i++){
                    var stepnum=_this.state.page*6+i-1;
                    if(data.result.routes[0].steps[stepnum]){
                        var resultname="step"+i;
                        var elename=document.getElementById(resultname);
                        if(_this.state.type==2){
                            elename.innerHTML=data.result.routes[0].steps[stepnum][0].instruction;
                        }
                        else{
                            elename.innerHTML=data.result.routes[0].steps[stepnum].instruction;
                        }
                    }      
                }
            },
            error:function(data){
                alert('fail');
            }
        })
    }

    onclick(){
        var map=this.mapModel.mapData;
        while(this.history.length !== 0){
            map.removeLayer(this.history.pop());
        }
        this.setState({
            show:false,
            page:0,
            total:0
        })
        this.doguide();
    }

    doguide(){
        var origin=document.getElementById("origin").value;//??????
        var destination=document.getElementById("destination").value;//??????
        var originlat,originlng,deslat,deslng,originuid,desuid;
        var originname,desname;
        var _this=this;
        $.ajax({
            url:'http://api.map.baidu.com/place/v2/suggestion?query='+origin+'&region=??????&output=json&ak=v8Cny4rsTP9Lmy6Ev0oTgVg1pcGCvG2W',
            type:"GET",
            async:false,
            dataType:"jsonp",
            jsonpCallback:"callback",
            contentType:"application/json;charset=utf-8",
            success:function(data){
                console.log("oridata:",data);
                console.log("orilat:",data.result[0].location.lat);
                console.log("orilng:",data.result[0].location.lng);
                console.log("oriuid:",data.result[0].uid);
                originlat=data.result[0].location.lat;
                originlng=data.result[0].location.lng;
                originuid=data.result[0].uid;
                originname=data.result[0].name;
                $.ajax({
                    url:'http://api.map.baidu.com/place/v2/suggestion?query='+destination+'&region=??????&output=json&ak=v8Cny4rsTP9Lmy6Ev0oTgVg1pcGCvG2W',
                    type:"GET",
                    async:false,
                    dataType:"jsonp",
                    jsonpCallback:"callbackdes",
                    contentType:"application/json;charset=utf-8",
                    success:function(data){
                        console.log("desdata:",data);
                        console.log("deslat:",data.result[0].location.lat);
                        console.log("deslng:",data.result[0].location.lng);
                        console.log("desuid:",data.result[0].uid);
                        deslat=data.result[0].location.lat;
                        deslng=data.result[0].location.lng;
                        desuid=data.result[0].uid;
                        desname=data.result[0].name;
                        _this.drawtext(originname,originlng,originlat);
                        _this.drawtext(desname,deslng,deslat);
                        _this.guide(originlat,originlng,deslat,deslng,originuid,desuid);
                    },
                    error:function(data){
                        alert('fail');
                    }
                })
            },
            error:function(data){
                alert('fail');
            }
        })
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
        //alert(type);
    }

    nextPage(){
        for(var i=1;i<7;i++){
            var resultname="step"+i;
            var elename=document.getElementById(resultname);
            elename.innerHTML="";   
        }
        var nowpage=this.state.page;
        var total=this.state.total;
        var nextpage=nowpage+1;
        if(nextpage*6>=total){
            alert("?????????????????????");
        }else{
            this.setState({
                page:nextpage
            })
        }
        this.doguide();
    }

    prePage(){
        for(var i=1;i<7;i++){
            var resultname="step"+i;
            var elename=document.getElementById(resultname);
            elename.innerHTML="";   
        }
        var nowpage=this.state.page;
        if(nowpage==0){
            alert("??????????????????");
        }else{
            var prepage=nowpage-1;
            this.setState({
                page:prepage
            })
        }
        this.doguide();
    }

    //????????????
    draw(orilng,orilat,deslng,deslat){
        let feature=new Feature({
            geometry: new LineString([fromLonLat([orilng-0.012186, orilat-0.003701]),fromLonLat([deslng-0.012186, deslat-0.003701])]),
            name:'Line'
        })
        let source = new VectorSource({
            features: [feature],
        })
        let layer = new VectorLayer({
            source: source,
            style:new Style({
                stroke:new Stroke({
                    width:8,
                    color:'#FF4500'
                })
            })
        })
        var map=this.mapModel.mapData;
        map.addLayer(layer);
        this.history.push(layer);
    }

    //?????????????????????
    drawtext(inputText,lng,lat){
        let createStyle = (feature) => {
            return new Style({
                
                text: new TextStyle({
                    //??????
                    textAlign: 'center',
                    //?????????
                    textBaseline: 'middle',
                    //????????????
                    front: 'normal 14px ????????????',
                    //????????????
                    text: feature.get('name'),
                    //??????????????????
                    fill: new Fill({color: '#FFFFFF'}),
                    stroke: new Stroke({color: '#FF4500', width: 10})
                })
            });
        }
        //let inputText = "test";
        //??????????????????
        let newFeature = new Feature({
            //????????????
            geometry: new Point(fromLonLat([lng-0.012186, lat-0.003701])),
            //????????????
            name: inputText === "" ? '?????????' : inputText
        });
        //?????????????????????
        newFeature.setStyle(createStyle(newFeature));
        //?????????source??????
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

    render() {
        const {classes} = this.props;
        if (this.props.visible)
            return (
                <div>
                    <Paper className={classes.root}>
                        <Toolbar className={classes.toolbar}>
                            <IconButton className={classes.button} onClick={() => {
                                this.props.closeWindow();
                                this.setState({
                                    show:false
                                })
                                var map=this.mapModel.mapData;
                                while(this.history.length !== 0){
                                    map.removeLayer(this.history.pop());
                                }
                                }}>
                                <CloseIcon className={classes.closeIcon}/>
                            </IconButton>
                        </Toolbar>
                        <NativeSelect onChange={this.update} className={classes.select}>
                                <option value="0">????????????</option>
                                <option value="1">??????</option>
                                <option value="2">??????</option>
                                <option value="3">??????</option>
                                <option value="4">??????</option>
                            </NativeSelect>
                        <div className={classes.row}>
                            <TextField 
                                label="???????????????" 
                                id="origin" 
                                defaultValue="" 
                                size="small" 
                                variant="outlined"/>
                        </div>
                        <div className={classes.row}>
                            <TextField 
                                label="???????????????" 
                                id="destination" 
                                defaultValue="" 
                                size="small" 
                                variant="outlined"/>
                        </div>
                        <div className={classes.row}>
                            <Button onClick={() => this.onclick()} variant="outlined" color="primary">????????????</Button>
                        </div>
                        {this.state.show?
                        <div className={classes.row}>
                        <p>???????????????<a id="route"/></p>
                        <Button onClick={()=>this.prePage()} variant="outlined" className={classes.btn} color="primary">?????????</Button>
                        <Button onClick={()=>this.nextPage()} variant="outlined"  className={classes.btn} color="primary">?????????</Button>
                        <p><a id="step1"/></p>
                        <p><a id="step2"/></p>
                        <p><a id="step3"/></p>
                        <p><a id="step4"/></p>
                        <p><a id="step5"/></p>
                        <p><a id="step6"/></p>
                        </div>
                        :null
                        }
                        
                    </Paper>
                </div>
            )
        else return null;
    }
}

export default withStyles(styles)(GuidanceView);
