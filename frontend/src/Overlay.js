import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';

import './Overlay.css';
import { Loader } from '@googlemaps/js-api-loader';

const Overlay = (props) => {
    let [imgUrl, setImgUrl] = useState("");
    
    useEffect(
        () => {
            console.log("he");
            const fetchLoader = async () => {
                const loader = new Loader({apiKey: process.env.REACT_APP_API_KEY});
                const google = await loader.load();
                //console.log(google);
                //console.log(new google.maps.DirectionsService());

                const directionsService = new google.maps.DirectionsService();
                let response = directionsService.route({
                    destination: "pennsylvania avenue residence hall",
                    origin: "illinois street residence hall",
                    travelMode: "WALKING"
                }, 
                    (results, status) => {
                        console.log(results);
                        console.log(status);
                        let location = `${props.countyName}, ${props.stateName}`;
                        setImgUrl("https://maps.googleapis.com/maps/api/staticmap?center=" + location + "&zoom=10&size=400x400&key=" + process.env.REACT_APP_API_KEY);
                    }
                );
            }
            fetchLoader().catch(console.error);

            /*let response = google.maps.DirectionServices().route({}, 
                (results, status) => {
                    let location = `${props.countyName}, ${props.stateName}`;
                    setImgUrl("https://maps.googleapis.com/maps/api/staticmap?center=" + location + "&zoom=10&size=400x400&key=" + process.env.REACT_APP_API_KEY);
                }
            );*/
        }, []
    );    
    const cssDisplay = props.visible ? "flex" : "none";
    return (
        <div id="overlay-background" style={{ display: cssDisplay }} onClick={props.onClick}>
            <div id="overlay" style={{ display: cssDisplay }}>
                <img src={imgUrl} />
                {props.countyName}
            </div>
        </div>
    );
};

export default Overlay;