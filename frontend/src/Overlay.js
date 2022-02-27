import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import './Overlay.css';

const Overlay = (props) => {
    let location = `${props.countyName}, ${props.stateName}`;
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