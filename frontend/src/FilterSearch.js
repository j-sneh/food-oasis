import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import './Overlay.css';
import OriginsData from "./food_manufacturers_champaign.json";
import $ from "jquery";


function GetOriginsPoints(props, county, state) {
    var result = undefined;
    if(props.countyName === "Champaign") {
        $.ajaxSetup({
            async: false
        });
        
        result = OriginsData.map((elem) => {
            let http_addr = elem.ADDRESS.replaceAll(" ", "%20");
            let city_state = elem.CITY + "%20" + props.stateName
            let a = $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address=" + http_addr + "%20" + city_state + "&key=" + process.env.REACT_APP_API_KEY);
            console.log(a.responseJSON);
            // return a.results.geometry.location
        });
    }
    $.ajaxSetup({
        async: true
    });
    return result;
}



const Overlay = (props) => {
    let location = `${props.countyName}, ${props.stateName}`;
    var origins = GetOriginsPoints(props, props.countyName, props.stateName);
    let img_url = "https://maps.googleapis.com/maps/api/staticmap?center=" + location + "&zoom=10&size=400x400&key=" + process.env.REACT_APP_API_KEY;
    const cssDisplay = props.visible ? "flex" : "none";


    return (
        <div id="overlay-background" style={{ display: cssDisplay }} onClick={props.onClick}>
            <div id="overlay" style={{ display: cssDisplay }}>
                <img src={img_url} />
                {props.countyName}
            </div>
        </div>
    );
};

export default Overlay;