import Stamen from "ol/source/Stamen";

function StameSource(){
    return new Stamen({
        layer: 'toner',
    })
};
export default StameSource;
