import React, { useEffect, useState, useRef } from 'react';
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import ReactDOM from 'react-dom';

const render = (status) => {
    return <h1>{status}</h1>;
};

// function initMap() {
//     const champaign = {lat: 40.1395143, lng: -88.4763818};
//     const map = new google.maps.Map(document.getElementById("map"), {
//         zoom: 10,
//         center: champaign,
//     });

// }

const County = () => {

    // useEffect(
    //     () => {
    //         initMap();
    //         console.log("map rendered");
    //     }, []
    // );

    const center = useState({
        lat: 40.1395143,
        lng: -88.4763818,
      });
    const zoom = useState(10);

    return (
        <Wrapper apiKey={""} render={render}>
            <Map
                center  = {center}
                zoom    = {zoom}
            ></Map>
        </Wrapper>
    );
}

export default County;