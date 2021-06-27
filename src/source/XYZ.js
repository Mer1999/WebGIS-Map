import XYZ from "ol/source/XYZ";
function Xyz(){
    return new XYZ({
        url:'https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=822b1942b2a64dd6af7449e028ebef25',
        crossOrigin: 'anonymous'
    });
}
export default Xyz;
