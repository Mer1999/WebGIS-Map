import {transform} from 'ol/proj';

class PresetModel {
    constructor(props) {
        this.mapModel = props;
    }

    //将地图中央移到上海
    moveToShanghai() {
        let map = this.mapModel.mapData;
        var view = map.getView();//获取当前的view
        // 设置地图中心为上海的坐标，即可让地图移动到上海
        view.setCenter(transform([121.48, 31.22], 'EPSG:4326', 'EPSG:3857'));
        view.setZoom(11);
        map.render();
    }

    //将地图中央移到北京
    moveToBeijing() {
        let map = this.mapModel.mapData;
        var view = map.getView();
        // 设置地图中心为北京的坐标，即可让地图移动到北京
        view.setCenter(transform([116.46, 39.92], 'EPSG:4326', 'EPSG:3857'));
        view.setZoom(11);
        map.render();
    }

    //将地图中央移到哈尔滨
    moveToHarbin() {
        let map = this.mapModel.mapData;
        var view = map.getView();
        // 设置地图中心为哈尔滨的坐标，即可让地图移动到哈尔滨
        view.setCenter(transform([126.53, 45.8], 'EPSG:4326', 'EPSG:3857'));
        view.setZoom(11);
        map.render();
    }

    //将地图中央移到广州
    moveToGuangzhou() {
        let map = this.mapModel.mapData;
        var view = map.getView();
        // 设置地图中心为广州的坐标，即可让地图移动到广州
        view.setCenter(transform([113.23, 23.16], 'EPSG:4326', 'EPSG:3857'));
        view.setZoom(11);
        map.render();
    }
}

export default PresetModel;
