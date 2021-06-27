function hexToRgb(hex)
    {
        let c = hex.replace("#", "");
    if (c.length === 3) {
        let s = [...c];
        c = s.reduce((r, i) => {
            let n = i + i;
            return r + n;
        }, "");
    }
    const n = parseInt(c, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    let rgb = `rgb(${r}, ${g}, ${b})`;
    return rgb;
}export default hexToRgb;
