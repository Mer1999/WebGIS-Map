import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import "ol/ol.css"
import './custom-ol.css';
import MapModel from "./Map/MapModel";

let globalMapModel = new MapModel()
ReactDOM.render(
  <React.StrictMode>
    <App mapModel={globalMapModel}/>
  </React.StrictMode>,
  document.getElementById('root')
);
// 延迟target的设置，不会出现undefined问题了
globalMapModel.mapData.setTarget('map');

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
