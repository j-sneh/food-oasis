import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';

import './Overlay.css';
import { Loader } from '@googlemaps/js-api-loader';
import OriginsData from "./food_manufacturers_champaign.json";
import $ from "jquery";

const originPoints = [
    {
      "lat": 40.1388718,
      "lng": -88.2642161
    },
    {
      "lat": 40.156133,
      "lng": -88.40654959999999
    },
    {
      "lat": 40.0347569,
      "lng": -87.95808919999999
    },
    {
      "lat": 40.1383003,
      "lng": -88.2684611
    },
    {
      "lat": 40.1677526,
      "lng": -88.2951094
    },
    {
      "lat": 40.2996406,
      "lng": -88.1291252
    },
    {
      "lat": 40.1115965,
      "lng": -88.04152409999999
    },
    {
      "lat": 40.1180493,
      "lng": -88.23854999999999
    },
    {
      "lat": 40.0927635,
      "lng": -88.16351859999999
    },
    {
      "lat": 40.1872807,
      "lng": -88.4039155
    },
    {
      "lat": 40.1054873,
      "lng": -88.19804289999999
    },
    {
      "lat": 40.1350982,
      "lng": -88.2632277
    },
    {
      "lat": 40.1115888,
      "lng": -88.1993754
    },
    {
      "lat": 40.1585416,
      "lng": -88.2762834
    },
    {
      "lat": 40.1084199,
      "lng": -88.31212359999999
    },
    null,
    {
      "lat": 40.1143177,
      "lng": -88.217407
    },
    {
      "lat": 40.1075729,
      "lng": -83.73797069999999
    },
    {
      "lat": 40.1063634,
      "lng": -83.7365569
    },
    {
      "lat": 40.6331249,
      "lng": -89.3985283
    },
    {
      "lat": 40.1105875,
      "lng": -88.2072697
    },
    {
      "lat": 40.1105875,
      "lng": -88.2072697
    },
    {
      "lat": 40.1124743,
      "lng": -88.21020510000001
    },
    {
      "lat": 40.1148481,
      "lng": -88.22022899999999
    }
];

const Overlay = (props) => {
    let [imgUrl, setImgUrl] = useState("");
    let google = useRef(null);
    // var origins = GetOriginsPoints(props, props.countyName, props.stateName);

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

    const getOriginsPoints = (county, state) => {
        var result = undefined;
        if(county === "Champaign") {
            $.ajaxSetup({
                async: false
            });
            
            Promise.all(OriginsData.map((elem) => {
                // if (elem.ADDRESS != "915 W Marketview Dr") {
                //     return Promise.resolve();
                // }
                let http_addr = `${elem.ADDRESS} ${elem.CITY} ${state}&key=${process.env.REACT_APP_API_KEY}`;
                let link = `https://maps.googleapis.com/maps/api/geocode/json?address=${http_addr.replaceAll(" ", "%20")}`;
                console.log(link);
                // return fetch(link);
                return link;
                // return a.results.geometry.location
            })).then((responses) => {
                Promise.all(
                    responses.map(async (response) => {
                        if (response === undefined) {
                            return {};
                        }
                        const data = await response.json();
                        try {
                            return data.results[0].geometry.location;
                        } catch {
                            console.log(data);
                            return undefined;
                        }
                    })
                ).then((result) => {console.log(result)});
            });
        }
        $.ajaxSetup({
            async: true
        });
        return result;
    }
    
    useEffect(
        () => {
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
            // getOriginsPoints(props.countyName, props.stateName);
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