class MoveModel {
    constructor(props) {
        this.mapModel = props;
    }

    //左移，可修改mapCenter[]+=的值来修改移动幅度
    moveLeft() {
        let map = this.mapModel.mapData;
        var view = map.getView();
        var mapCenter = view.getCenter();//获取当前中心
        mapCenter[0] += 50000;
        view.setCenter(mapCenter);
        map.render();
    }

    moveRight() {
        let map = this.mapModel.mapData;
        var view = map.getView();
        var mapCenter = view.getCenter();
        mapCenter[0] -= 50000;
        view.setCenter(mapCenter);
        map.render();
    }

    moveUp() {
        let map = this.mapModel.mapData;
        var view = map.getView();
        var mapCenter = view.getCenter();
        mapCenter[1] -= 50000;
        view.setCenter(mapCenter);
        map.render();
    }

    moveDown() {
        let map = this.mapModel.mapData;
        var view = map.getView();
        var mapCenter = view.getCenter();
        mapCenter[1] += 50000;
        view.setCenter(mapCenter);
        map.render();
    }

}

export default MoveModel;
