import {transform} from 'ol/proj';
import {MousePosition, ScaleLine} from 'ol/control';
import {createStringXY} from 'ol/coordinate';

class LocateModel {
    constructor(props) {
        this.mapModel = props;
    }

    //获取鼠标点经纬度
    coordinate() {
        let map = this.mapModel.mapData;
        var coor = new MousePosition({
            coordinateFormat: new createStringXY(3),
            projection: "EPSG:4326",
            //target: document.getElementById('coordinate'),
            undefinedHTML: '&nbsp;'
        })
        map.addControl(coor);
        map.addControl(new ScaleLine());//比例尺
    }

    //输入经纬度切换中心位置
    xyLocate() {
        this.setState({
            show:false
        })
        var longitude = document.getElementById("x").value;
        var latitude = document.getElementById("y").value;
        if(this.state.now==1){
            this.setState({
                lng0:longitude,
                lat0:latitude,
                zoom0:14,
                now:0
            })
        }else{
            this.setState({
                lng1:longitude,
                lat1:latitude,
                zoom1:14,
                now:1
            })
        }
        let map = this.mapModel.mapData;
        var view = map.getView();
        // 根据获取的经纬度重新定位
        view.setCenter(transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857'));
        view.setZoom(14);
        map.render();
    }

    //获取当前位置并将地图居中位置修改
    getPosition() {
        var _this=this;
        this.setState({
            show:true
        })
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                let latitude = document.getElementById("latitude");
                let longitude = document.getElementById("longitude");
                latitude.innerHTML = position.coords.latitude;
                longitude.innerHTML = position.coords.longitude;
                if(_this.state.now==1){
                    _this.setState({
                        lng0:position.coords.longitude,
                        lat0:position.coords.latitude,
                        zoom0:17,
                        now:0
                    });
                }else{
                    _this.setState({
                        lng1:position.coords.longitude,
                        lat1:position.coords.latitude,
                        zoom1:17,
                        now:1
                    });
                }
                let map = this.mapModel.mapData;
                let view = map.getView();
                // 根据获取的经纬度重新定位
                view.setCenter(transform([position.coords.longitude, position.coords.latitude], 'EPSG:4326', 'EPSG:3857'));
                view.setZoom(17);
                map.render();
            });
        }
    }

    //回到上一步
    goBack() {
        let map = this.mapModel.mapData;
        let view = map.getView();
        // 根据state中存储的上一步经纬度以及缩放大小重新设置中心
        if(this.state.now==1){
            view.setCenter(transform([this.state.lng0, this.state.lat0], 'EPSG:4326', 'EPSG:3857'));
            view.setZoom(this.state.zoom0);
        }else{
            view.setCenter(transform([this.state.lng1, this.state.lat1], 'EPSG:4326', 'EPSG:3857'));
            view.setZoom(this.state.zoom1);
        }
        map.render();
    }
}

export default LocateModel;
