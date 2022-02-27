import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import originPoints from "./originPoints.json";
import originPaths from "./originPaths.json";
import './Overlay.css';
import { Loader } from '@googlemaps/js-api-loader';
import OriginsData from "./food_manufacturers_champaign.json";
import $ from "jquery";

const Overlay = (props) => {
    let [imgUrl, setImgUrl] = useState("");
    let google = useRef(null);
    // var origins = GetOriginsPoints(props, props.countyName, props.stateName);

    const loadDirections = (g) => {
        if (!props.visible) {
            return;
        }
        const directionsService = new g.maps.DirectionsService();
        let location = `${props.countyName}, ${props.stateName}`;
        let paths = "";
        let colors = ["red", "orange", "yellow", "green", "purple"];
        let i = 0;
        for (let path of originPaths) {
            paths = paths + `&path=weight:3%7Ccolor:${colors[i % colors.length]}%7Cenc:` + path['polyline'];
            i++;
        }
        // const originsDataSliced = originPoints.slice(18, 24);
        // Promise.all(originPoints.map(coords => {
        //     console.log(coords);
        //     if (coords === null) {
        //         return Promise.resolve(null);
        //     }
        //     return directionsService.route(
        //         {
        //             destination: "1012 W Illinois St, Urbana, IL",
        //             origin: new g.maps.LatLng(coords.lat, coords.lng),
        //             travelMode: "DRIVING"
        //         }
        //            // paths = paths + "&path=weight:3%7Ccolor:blue%7Cenc:" + results.routes[0].overview_polyline;
        //     );
        // })).then(
        //     (results) => {
        //         console.log(results.map((result) => {
        //             if (result === null) {
        //                 return {};
        //             } 
        //             return {
        //                 polyline: result.routes[0].overview_polyline
        //             };
        //         }));
        //     }
        // );
        const url = `https://maps.googleapis.com/maps/api/staticmap?center=${location}&zoom=10&size=400x400${paths}&key=${process.env.REACT_APP_API_KEY}`;
        console.log(url);
        setImgUrl(url);
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