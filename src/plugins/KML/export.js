function Export(map) {
    //map的监听，只监听一次
    map.once('rendercomplete', function () {
        //创建map画布，在网页上创建一个节点“canvas"
        let mapCanvas = document.createElement('canvas');
        let size = map.getSize();
        //设置画布的宽和高
        mapCanvas.width = size[0];
        mapCanvas.height = size[1];
        //map的内容的绘画 指定了一个二维环境
        let mapContext = mapCanvas.getContext('2d');
        //对数组的每个元素执行一次给定的函数
        Array.prototype.forEach.call(
            //返回与指定的选择器组匹配的文档中的元素列表
            document.querySelectorAll('.ol-layer canvas'),
            function (canvas) {
                if (canvas.width > 0) {
                    let opacity = canvas.parentNode.style.opacity;
                    //设置获取的元素的透明值，为空则不透明，否者和它原来的一样
                    mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);

                    let transform = canvas.style.transform;
                    // Get the transform parameters from the style's transform matrix
                    let matrix = transform
                        .match(/^matrix\(([^\(]*)\)$/)[1]
                        .split(',')
                        .map(Number);
                    // Apply the transform to the export map context
                    CanvasRenderingContext2D.prototype.setTransform.apply(
                        mapContext,
                        matrix
                    );
                    //生成图片
                    mapContext.drawImage(canvas, 0, 0);

                }
            }
        );
       //弹出下载框，设置下载的默认名字
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(mapCanvas.msToBlob(), 'map.png');
        } else {
            let link = document.getElementById('image-download');
            link.href = mapCanvas.toDataURL();
            link.click();
        }

    });
    //地图同步渲染;
    map.renderSync();
}

export default Export;
