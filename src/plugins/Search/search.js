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
import NativeSelect from "@material-ui/core/NativeSelect";
import StarOutlineRoundedIcon from '@material-ui/icons/StarOutlineRounded';
import StarRoundedIcon from '@material-ui/icons/StarRounded'
import {yellow} from '@material-ui/core/colors'
//import { array } from "prop-types";
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
        width:450,
        position: "absolute"
    },
    row: {
        marginTop: "40px",
        marginBottom: "30px",
        marginLeft:"20px"
    },
    row1:{
        marginLeft:"10px",
        fontSize: "17px",
        color:"blue"
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
    tr_link:{
        cursor:"pointer",
    },
    row1:{
        marginLeft:"10px",
        fontSize:"17px",
        color:"blue"
    },
    btn:{
        marginRight:"30px",
        marginLeft:"10px"
    },
    input:{
        marginLeft:'20px'
    },
})

class SearchView extends React.Component {
    constructor(props) {
        super(props);
        this.mapModel = props.mapModel;
        this.history = [];
        this.state={
            //display:'none',//“搜索结果”四个字是否显示
            total:0,//搜索结果总数
            page:0,//搜索结果的第几页,每页5个，从0开始
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
            type:0,
            usernow:'nobody',
            star0:0,
            star1:0,
            star2:0,
            star3:0,
            star4:0,
            show:false,
            star0show:false,
            star1show:false,
            star2show:false,
            star3show:false,
            star4show:false,
            totalnum:0
        }
    }

    //在搜索结果处标注
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
    
    //普通关键字搜索
    search(page){
        var keywd=document.getElementById("keywd").value;//搜索关键词
        var _this=this;
    
        $.ajax({
            url:'http://api.map.baidu.com/place/v2/search?query='+keywd+'&region=上海&output=json&coord_type=1&page_size=5&page_num='+page+'&ak=RkAsQ9mCsKn7iIUWgGzicIb7635BIbvV',
            type:"GET",
            async:false,
            dataType:"jsonp",
            jsonpCallback:"callback",
            contentType:"application/json;charset=utf-8",
            success:function(data){
                //console.log(data)
                if(data.status!=0){
                   alert("搜索失败");
                }else if(data.results.length==0){
                    alert("暂无结果");
                }else{
                    //alert(data.total);
                    //控制”搜索结果“四个字在搜索后显示
                    var nowpage=_this.state.page+1;
                    _this.setState({
                        //display:'block',
                        show:true,
                        totalnum:data.total,
                        total:'搜索结果共有'+data.total+'条，当前为第'+nowpage+'页结果',
                    })
                    //将地图中心移到第一个结果的位置
                    let map = _this.mapModel.mapData;
                    var view = map.getView();
                    view.setCenter(transform([data.results[0].location.lng-0.012186, data.results[0].location.lat-0.003701], 'EPSG:4326', 'EPSG:3857'));
                    view.setZoom(16);
                    map.render();
            //-------------------------笨比行为但有用---------------------------------------
                    //0
                    if(data.results[0]){
                        $.ajax({
                            type:'GET',
                            url:'http://localhost:8000/isstar1?',
                            dataType:"jsonp",
                            async:false,
                            data:{Username:_this.state.usernow,Placename:data.results[0].name,Placeinfo:data.results[0].address},
                            jsonp:'cbis',
                            jsonpCallback:'fnis1',
                            success:function(data){
                                if(data.result=='yes'){
                                    _this.setState({star0:1});
                                    //console.log("1star0");
                                }
                                else{
                                    _this.setState({star0:0});
                                    //console.log("0star0");
                                }
                            },
                            error:function(err){
                                alert("isstarfail");
                            }
                        });
                        _this.setState({
                            star0show:true
                        })
                    }
                    
                    //1
                    if(data.results[1]){
                        $.ajax({
                            type:'GET',
                            url:'http://localhost:8000/isstar2?',
                            dataType:"jsonp",
                            async:false,
                            data:{Username:_this.state.usernow,Placename:data.results[1].name,Placeinfo:data.results[1].address},
                            jsonp:'cbis',
                            jsonpCallback:'fnis2',
                            success:function(data){
                                if(data.result=='yes'){
                                    _this.setState({star1:1});
                                    //console.log("1star1");
                                }
                                else{
                                    _this.setState({star1:0});
                                    //console.log("0star1");
                                }
                            },
                            error:function(err){
                                alert("isstarfail");
                            }
                        });
                        _this.setState({
                            star1show:true
                        })
                    }
                    
                    //2
                    if(data.results[2]){
                        $.ajax({
                            type:'GET',
                            url:'http://localhost:8000/isstar3?',
                            dataType:"jsonp",
                            async:false,
                            data:{Username:_this.state.usernow,Placename:data.results[2].name,Placeinfo:data.results[2].address},
                            jsonp:'cbis',
                            jsonpCallback:'fnis3',
                            success:function(data){
                                if(data.result=='yes'){
                                    _this.setState({star2:1});
                                    //console.log("1star2");
                                }
                                else{
                                    _this.setState({star2:0});
                                    //console.log("0star2");
                                }
                            },
                            error:function(err){
                                alert("isstarfail");
                            }
                        });
                        _this.setState({
                            star2show:true
                        })
                    }
                    
                    //3
                    if(data.results[3]){
                        $.ajax({
                            type:'GET',
                            url:'http://localhost:8000/isstar4?',
                            dataType:"jsonp",
                            async:false,
                            data:{Username:_this.state.usernow,Placename:data.results[3].name,Placeinfo:data.results[3].address},
                            jsonp:'cbis',
                            jsonpCallback:'fnis4',
                            success:function(data){
                                if(data.result=='yes'){
                                    _this.setState({star3:1});
                                    //console.log("1star3");
                                }
                                else{
                                    _this.setState({star3:0});
                                    //console.log("0star3");
                                }
                            },
                            error:function(err){
                                alert("isstarfail");
                            }
                        });
                        _this.setState({
                            star3show:true
                        })
                    }
                    
                    //4
                    if(data.results[4]){
                        $.ajax({
                            type:'GET',
                            url:'http://localhost:8000/isstar5?',
                            dataType:"jsonp",
                            async:false,
                            data:{Username:_this.state.usernow,Placename:data.results[4].name,Placeinfo:data.results[4].address},
                            jsonp:'cbis',
                            jsonpCallback:'fnis5',
                            success:function(data){
                                if(data.result=='yes'){
                                    _this.setState({star4:1});
                                    //console.log("1star4");
                                }
                                else{
                                    _this.setState({star4:0});
                                    //console.log("0star4");
                                }
                            },
                            error:function(err){
                                alert("isstarfail");
                            }
                        });
                        _this.setState({
                            star4show:true
                        })
                    }
                    
            //-------------------------笨比行为但有用---------------------------------------
                   
                    //对前5个结果进行输出
                    for(var i=0;i < 5;i++){
                        if(data.results[i]){
                            _this.draw(data.results[i].name,data.results[i].location.lng,data.results[i].location.lat)
                            var resultname="result"+i+"_name";
                            var elename=document.getElementById(resultname);
                            elename.innerHTML=data.results[i].name;
                            var resultaddress="result"+i+"_address";
                            var eleaddress=document.getElementById(resultaddress);
                            eleaddress.innerHTML=data.results[i].address;
                            //将每个地点的经纬度存入state以供之后点击切换位置
                            var resultlng="result"+i+"_lng";
                            var resultlat="result"+i+"_lat";
                            _this.setState({
                                [resultlng]:data.results[i].location.lng,
                                [resultlat]:data.results[i].location.lat,
                            })
                        }
                        else{
                            break;
                        }
                    }
                }
            },
            error:function(data){
                alert(data);
            }
        })
    }

    //区域搜索
    searchPro(page){
        var keywd=document.getElementById("keywd").value;//搜索关键词
        var _this=this;
        let map = this.mapModel.mapData;
        var view = map.getView();
        var mapCenter = view.getCenter();
        var mapExtent=view.calculateExtent(map.getSize());
        var radius=(mapExtent[3]-mapExtent[1])/2;//粗估半径
        //alert(radius);
        var center=transform(mapCenter, 'EPSG:3857', 'EPSG:4326');//屏幕中心点
        var temp=center[0];
        center[0]=center[1];
        center[1]=temp;
        //alert(keywd+'a'+center+'a'+radius);
        $.ajax({
            url:'http://api.map.baidu.com/place/v2/search?query='+keywd+'&location='+center+'&radius='+radius+'&radius_limit=true&output=json&coord_type=1&page_size=5&page_num='+page+'&ak=RkAsQ9mCsKn7iIUWgGzicIb7635BIbvV',
            type:"GET",
            async:false,
            dataType:"jsonp",
            jsonpCallback:"callback",
            contentType:"application/json;charset=utf-8",
            success:function(data){
                //console.log(data)
                if(data.status!=0){
                   alert("搜索失败");
                }else if(data.results.length==0){
                    alert("暂无结果");
                }else{
                    //alert(data.total);
                    //控制”搜索结果“四个字在搜索后显示
                    var nowpage=_this.state.page+1;
                    _this.setState({
                        show:true,
                        totalnum:data.total,
                        total:'搜索结果共有'+data.total+'条，当前为第'+nowpage+'页结果',
                    })
                    //将地图中心移到第一个结果的位置
                    let map = _this.mapModel.mapData;
                    var view = map.getView();
                    view.setCenter(transform([data.results[0].location.lng-0.012186, data.results[0].location.lat-0.003701], 'EPSG:4326', 'EPSG:3857'));
                    view.setZoom(16);
                    map.render();
                    //-------------------------笨比行为但有用---------------------------------------
                    //0
                    if(data.results[0]){
                        $.ajax({
                            type:'GET',
                            url:'http://localhost:8000/isstar1?',
                            dataType:"jsonp",
                            async:false,
                            data:{Username:_this.state.usernow,Placename:data.results[0].name,Placeinfo:data.results[0].address},
                            jsonp:'cbis',
                            jsonpCallback:'fnis1',
                            success:function(data){
                                if(data.result=='yes'){
                                    _this.setState({star0:1});
                                    //console.log("1star0");
                                }
                                else{
                                    _this.setState({star0:0});
                                    //console.log("0star0");
                                }
                            },
                            error:function(err){
                                alert("isstarfail");
                            }
                        });
                        _this.setState({
                            star0show:true
                        })
                    }
                    
                    //1
                    if(data.results[1]){
                        $.ajax({
                            type:'GET',
                            url:'http://localhost:8000/isstar2?',
                            dataType:"jsonp",
                            async:false,
                            data:{Username:_this.state.usernow,Placename:data.results[1].name,Placeinfo:data.results[1].address},
                            jsonp:'cbis',
                            jsonpCallback:'fnis2',
                            success:function(data){
                                if(data.result=='yes'){
                                    _this.setState({star1:1});
                                    //console.log("1star1");
                                }
                                else{
                                    _this.setState({star1:0});
                                    //console.log("0star1");
                                }
                            },
                            error:function(err){
                                alert("isstarfail");
                            }
                        });
                        _this.setState({
                            star1show:true
                        })
                    }
                    
                    //2
                    if(data.results[2]){
                        $.ajax({
                            type:'GET',
                            url:'http://localhost:8000/isstar3?',
                            dataType:"jsonp",
                            async:false,
                            data:{Username:_this.state.usernow,Placename:data.results[2].name,Placeinfo:data.results[2].address},
                            jsonp:'cbis',
                            jsonpCallback:'fnis3',
                            success:function(data){
                                if(data.result=='yes'){
                                    _this.setState({star2:1});
                                    //console.log("1star2");
                                }
                                else{
                                    _this.setState({star2:0});
                                    //console.log("0star2");
                                }
                            },
                            error:function(err){
                                alert("isstarfail");
                            }
                        });
                        _this.setState({
                            star2show:true
                        })
                    }
                    
                    //3
                    if(data.results[3]){
                        $.ajax({
                            type:'GET',
                            url:'http://localhost:8000/isstar4?',
                            dataType:"jsonp",
                            async:false,
                            data:{Username:_this.state.usernow,Placename:data.results[3].name,Placeinfo:data.results[3].address},
                            jsonp:'cbis',
                            jsonpCallback:'fnis4',
                            success:function(data){
                                if(data.result=='yes'){
                                    _this.setState({star3:1});
                                    //console.log("1star3");
                                }
                                else{
                                    _this.setState({star3:0});
                                    //console.log("0star3");
                                }
                            },
                            error:function(err){
                                alert("isstarfail");
                            }
                        });
                        _this.setState({
                            star3show:true
                        })
                    }
                    
                    //4
                    if(data.results[4]){
                        $.ajax({
                            type:'GET',
                            url:'http://localhost:8000/isstar5?',
                            dataType:"jsonp",
                            async:false,
                            data:{Username:_this.state.usernow,Placename:data.results[4].name,Placeinfo:data.results[4].address},
                            jsonp:'cbis',
                            jsonpCallback:'fnis5',
                            success:function(data){
                                if(data.result=='yes'){
                                    _this.setState({star4:1});
                                    //console.log("1star4");
                                }
                                else{
                                    _this.setState({star4:0});
                                    //console.log("0star4");
                                }
                            },
                            error:function(err){
                                alert("isstarfail");
                            }
                        });
                        _this.setState({
                            star4show:true
                        })
                    }
                    
            //-------------------------笨比行为但有用---------------------------------------
                    //对前5个结果进行输出
                    for(var i=0;i < 5;i++){
                        if(data.results[i]){
                            _this.draw(data.results[i].name,data.results[i].location.lng,data.results[i].location.lat)
                            var resultname="result"+i+"_name";
                            var elename=document.getElementById(resultname);
                            elename.innerHTML=data.results[i].name;

                            var resultaddress="result"+i+"_address";
                            var eleaddress=document.getElementById(resultaddress);
                            eleaddress.innerHTML=data.results[i].address;

                            //将每个地点的经纬度存入state以供之后点击切换位置
                            var resultlng="result"+i+"_lng";
                            var resultlat="result"+i+"_lat";
                            _this.setState({
                                [resultlng]:data.results[i].location.lng,
                                [resultlat]:data.results[i].location.lat,
                            })
                        }
                        else{
                            break;
                        }
                    }
                }
            },
            error:function(data){
                alert(data);
            }
        })
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

    //上一页
    prePage(){
        var map=this.mapModel.mapData;
        while(this.history.length !== 0){
            map.removeLayer(this.history.pop());
        }
        var pagenow=this.state.page;
        var pagepre=pagenow-1;
        if(pagenow==0){
            alert("已是第一页！");
        }
        else{
            this.setState({
                page:pagepre,
                show:false,
                star0show:false,
                star1show:false,
                star2show:false,
                star3show:false,
                star4show:false
            })
            this.doSearch(pagepre);
        }
    }

    //下一页
    nextPage(){
        var map=this.mapModel.mapData;
        while(this.history.length !== 0){
            map.removeLayer(this.history.pop());
        }
        var pagenow=this.state.page;
        var pagenext=pagenow+1;
        var total=this.state.totalnum;
        //console.log("pagenext,total",pagenext,total);
        if(pagenext*5>=total){
            alert("已是最后一页！");
        }
        else{
            this.setState({
                page:pagenext,
                show:false,
                star0show:false,
                star1show:false,
                star2show:false,
                star3show:false,
                star4show:false
            })
            this.doSearch(pagenext);
        }
    }

    //修改state中的type
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

    doSearch(page){ 
        switch(this.state.type){
            case 0://默认普通搜索
                this.search(page);
                break;
            case 1:
                this.search(page);
                break;
            case 2:
                this.searchPro(page);
                break;
        }
    }

    //收藏
    star(id){
        if(this.state.usernow=='nobody'){
            alert("要使用收藏功能请先登录!");
        }
        else{
            var starname="star"+id;
            this.setState({
                [starname]:1
            });
            //将收藏地点写入数据库
            var resultname="result"+id+"_name";
            var resultaddress="result"+id+"_address";
            var Username=this.state.usernow;
            var Placename=document.getElementById(resultname).innerHTML;
            var Placeinfo=document.getElementById(resultaddress).innerHTML;
            switch(id){
                case 0:
                    var Placelng=this.state.result0_lng;
                    var Placelat=this.state.result0_lat;
                    break;
                case 1:
                    var Placelng=this.state.result1_lng;
                    var Placelat=this.state.result1_lat;
                    break;
                case 2:
                    var Placelng=this.state.result2_lng;
                    var Placelat=this.state.result2_lat;
                    break;
                case 3:
                    var Placelng=this.state.result3_lng;
                    var Placelat=this.state.result3_lat;
                    break;
                case 4:
                    var Placelng=this.state.result4_lng;
                    var Placelat=this.state.result4_lat;
                    break;
            }
            //alert(Username+'?'+Placename+'?'+Placeinfo+'?'+Placelng+'?'+Placelat);
            $.ajax({
                type:'GET',
                url:'http://localhost:8000/star?',
                dataType:"jsonp",
                data:{Username:Username,Placename:Placename,Placeinfo:Placeinfo,Placelng:Placelng,Placelat:Placelat},
                jsonp:'cbstar',
                jsonpCallback:'fnstar',
                success:function(data){
                    //alert(data.result);
                },
                error:function(err){
                   alert("starfail");
                }
            });
        }
    }

    //取消收藏
    unstar(id){
        if(this.state.usernow=='nobody'){
            alert("请先登录!");
        }
        else{
            var starname="star"+id;
            this.setState({
                [starname]:0
            });
            //将收藏地点从数据库删除
            var resultname="result"+id+"_name";
            var resultaddress="result"+id+"_address";
            var Username=this.state.usernow;
            var Placename=document.getElementById(resultname).innerHTML;
            var Placeinfo=document.getElementById(resultaddress).innerHTML;
            //alert(Username+'?'+Placename+'?'+Placeinfo+'?'+Placelng+'?'+Placelat);
            $.ajax({
                type:'GET',
                url:'http://localhost:8000/unstar?',
                dataType:"jsonp",
                data:{Username:Username,Placename:Placename,Placeinfo:Placeinfo},
                jsonp:'cbunstar',
                jsonpCallback:'fnunstar',
                success:function(data){
                    //alert(data.result);
                },
                error:function(err){
                   alert("unstarfail");
                }
            });
        }
    }

    //搜索按钮点击触发
    onclick(){
         //先访问后端获得当前登录情况
         var _this=this;
         $.ajax({
             type:'GET',
             url:'http://localhost:8000/getnowuser?',
             dataType:"jsonp",
             jsonp:'cbg',
             jsonpCallback:'fng',
             success:function(data){
                 //若已经登录则usernow是用户名，否则为nobody
                 _this.setState({
                     usernow:data.result
                 });
                 //alert(_this.state.usernow);
             },
             error:function(err){
                alert("searchgetuserfail");
             }
         });
         var map=this.mapModel.mapData;
         while(this.history.length !== 0){
             map.removeLayer(this.history.pop());
         }
        this.setState({
            show:false,
            page:0,
            total:0,
            totalnum:0,
            star0show:false,
            star1show:false,
            star2show:false,
            star3show:false,
            star4show:false
        })
        this.doSearch();
    }

    render() {
        let star0,star1,star2,star3,star4;
        if(this.state.star0){
            star0=(
                <td onClick={()=>this.unstar(0)}><StarRoundedIcon style={{ color: yellow[500] }} /></td>
            )
        }
        else{
            star0=(
                <td onClick={()=>this.star(0)}><StarOutlineRoundedIcon/></td>
            )
        }
        if(this.state.star1){
            star1=(
                <td onClick={()=>this.unstar(1)}><StarRoundedIcon style={{ color: yellow[500] }}/></td>
            )
        }
        else{
            star1=(
                <td onClick={()=>this.star(1)}><StarOutlineRoundedIcon/></td>
            )
        }
        if(this.state.star2){
            star2=(
                <td onClick={()=>this.unstar(2)}><StarRoundedIcon style={{ color: yellow[500] }}/></td>
            )
        }
        else{
            star2=(
                <td onClick={()=>this.star(2)}><StarOutlineRoundedIcon/></td>
            )
        }
        if(this.state.star3){
            star3=(
                <td onClick={()=>this.unstar(3)}><StarRoundedIcon style={{ color: yellow[500] }}/></td>
            )
        }
        else{
            star3=(
                <td onClick={()=>this.star(3)}><StarOutlineRoundedIcon/></td>
            )
        }
        if(this.state.star4){
            star4=(
                <td onClick={()=>this.unstar(4)}><StarRoundedIcon style={{ color: yellow[500] }}/></td>
            )
        }
        else{
            star4=(
                <td onClick={()=>this.star(4)}><StarOutlineRoundedIcon/></td>
            )
        }
        const {classes} = this.props;
        if (this.props.visible)
            return (
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
                            <NativeSelect
                                  //value={this.state.type}
                                  onChange={this.update}
                            >
                                <option value="0">搜索方式</option>
                                <option value="1">关键字搜索</option>
                                <option value="2">屏幕内搜索</option>
                            </NativeSelect>
                            <TextField label="请输入地名关键词" id="keywd" defaultValue="" size="small" variant="outlined"/>
                            <Button onClick={() => this.onclick()} className={classes.row1}>搜索</Button>
                        </div>
                        
                        {this.state.show?
                        <div>
                            {this.state.usernow==="nobody"?null:
                        <p className={classes.input}>当前用户: <strong>{this.state.usernow}</strong><a id="nowuser"/></p>
                        }
                        <div className={classes.row} >
                            <p id="result_title">{this.state.total}</p>
                            <Button onClick={()=>this.prePage()} variant="outlined" className={classes.btn} variant="outlined" color="primary">上一页</Button>
                            <Button onClick={()=>this.nextPage()} variant="outlined" className={classes.btn} variant="outlined" color="primary">下一页</Button>
                        </div>
                        <div className={classes.row}>
                            <table>
                                {this.state.star0show?
                                <tr className={classes.tr_link}>
                                    {star0}
                                    <td><p id='result0_name' onClick={()=>this.jump(0)}></p></td>
                                    <td><p id='result0_address' onClick={()=>this.jump(0)}></p></td>
                                </tr>
                                :null}
                                {this.state.star1show?
                                <tr className={classes.tr_link}>
                                    {star1}
                                    <td><p id='result1_name' onClick={()=>this.jump(1)}></p></td>
                                    <td><p id='result1_address' onClick={()=>this.jump(1)}></p></td>
                                </tr>
                                :null}
                                {this.state.star2show?
                                <tr className={classes.tr_link}>
                                    {star2}
                                    <td><p id='result2_name' onClick={()=>this.jump(2)}></p></td>
                                    <td><p id='result2_address' onClick={()=>this.jump(2)}></p></td>
                                </tr>
                                :null}
                                {this.state.star3show?
                                <tr className={classes.tr_link}>
                                    {star3}
                                    <td><p id='result3_name' onClick={()=>this.jump(3)}></p></td>
                                    <td><p id='result3_address' onClick={()=>this.jump(3)}></p></td>
                                </tr>
                                :null}
                                {this.state.star4show?
                                <tr className={classes.tr_link}>
                                    {star4}
                                    <td><p id='result4_name' onClick={()=>this.jump(4)}></p></td>
                                    <td><p id='result4_address' onClick={()=>this.jump(4)}></p></td>
                                </tr>
                                :null}
                            </table>
                        </div>
                        </div>
                        :null}
                        
                    </Paper>
                </div>
            )
        else return null;
    }
}

export default withStyles(styles)(SearchView);