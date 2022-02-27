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
                destination: "232 Burwash Ave, Savoy, IL",
                origin: "201 N Goodwin Ave, Urbana, IL",
                travelMode: "DRIVING"
            },
            (results, status) => {
                // console.log(results);
                // console.log(status);
                let location = `${props.countyName}, ${props.stateName}`;
                console.log(results.routes[0].overview_polyline);
                setImgUrl("https://maps.googleapis.com/maps/api/staticmap?center=" + location
                + "&zoom=10&size=400x400"
                + "&path=weight:3%7Ccolor:blue%7Cenc:" + results.routes[0].overview_polyline
                + "&key=" + process.env.REACT_APP_API_KEY);
                console.log(imgUrl);
            }
        );
    };
    
    useEffect(
        () => {
            //console.log("ss");
            /*if (!props.visible) {
                return;
            }*/
            // console.log("he");
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