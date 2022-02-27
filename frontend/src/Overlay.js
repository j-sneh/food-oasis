import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import './Overlay.css';

const Overlay = (props) => {
    const cssDisplay = props.visible ? "flex" : "none";
    return (
        <div id="overlay-background" style={{ display: cssDisplay }} onClick={props.onClick}>
            <div id="overlay" style={{ display: cssDisplay }}>
                {props.countyName}
            </div>
        </div>
    );
};

export default Overlay;