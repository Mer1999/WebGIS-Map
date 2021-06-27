import { Vector } from "ol/source";

function vectorSource() {
    return new Vector({
        wrapX:false
    });
}
export default vectorSource;
