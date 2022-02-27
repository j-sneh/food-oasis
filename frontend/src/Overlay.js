import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';

import './Overlay.css';
import { Loader } from '@googlemaps/js-api-loader';

const Overlay = (props) => {
    let [imgUrl, setImgUrl] = useState("");
    let google = useRef(null);

    const loadDirections = (g) => {
        const directionsService = new g.maps.DirectionsService();
        directionsService.route(
            {
                destination: "1002 W College Ct, Urbana, IL",
                origin: "201 N Goodwin Ave, Urbana, IL",
                travelMode: "DRIVING"
            },
            (results, status) => {
                console.log(results);
                console.log(status);
                let location = `${props.countyName}, ${props.stateName}`;
                setImgUrl("https://maps.googleapis.com/maps/api/staticmap?center=" + location + "&zoom=10&size=400x400&key=" + process.env.REACT_APP_API_KEY);
            }
        );
    };
    
    useEffect(
        () => {
            console.log("he");
            const fetchLoader = async () => {
                const loader = new Loader({apiKey: process.env.REACT_APP_API_KEY});
                google.current = await loader.load();
                loadDirections(google.current);
            }
            fetchLoader().catch(console.error);
        }, []
    );

    useEffect(() => {
        if (props.visible && google.current) {
            console.log(props);
            loadDirections(google.current);
        }
    }, [props.visible]);

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