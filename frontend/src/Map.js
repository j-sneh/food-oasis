import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import './Map.css';
import Overlay from './Overlay';
import * as d3 from "d3";
import * as topojson from "topojson";

const countyDataSource = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json";

const colorMapping = (value, rel_max) => {
    // var alpha_value = (10 ** (10 * value)) / (10 ** (10 * rel_max));
    // return "hsla(14, 100%, 51%, " + alpha_value + ")";
    return "hsla(14, 100%, 51%, " + value + ")";
};

const Map = () => {
    const d3Container = useRef(null);
    const tooltipContainer = useRef(null);
    const hasFetchedData = useRef(false);
    let [overlayVisible, setOverlayVisible] = useState(false);
    let [overlayCountyName, setOverlayCountyName] = useState("");

    const loadMap = (foodInsecurityData) => {
        if (!d3Container.current || !tooltipContainer.current) {
            return;
        }
        console.debug("Loaded food insecurity data: ")
        console.debug(foodInsecurityData);
        d3.json(countyDataSource, (error, us) => {
            if (error) throw error;
        
            console.debug("Computing heat mapping...");
            let heat_mapping = {};
            let rel_max = 0;
            for (let i = 0; i < foodInsecurityData.length; i++) {
                let fips = foodInsecurityData[i]["FIPS"].toString();
        
                if (fips.length === 4) {
                    fips = "0" + fips;
                }
        
                heat_mapping[fips] = {
                    "HEAT": foodInsecurityData[i]["HEAT"],
                    "VLFS": foodInsecurityData[i]["VLFS"]
                }
                if (foodInsecurityData[i]["VLFS"] > rel_max) {
                    rel_max = foodInsecurityData[i]["VLFS"];
                }
            }

            const svg = d3.select(d3Container.current);
            const path = d3.geoPath();
            const tooltip = d3.select(tooltipContainer.current);
          
            console.debug("Inserting SVG elements with d3...");

            const onMouseOver = (elem) => {
                const coords = d3.mouse(d3.event.currentTarget);
                tooltip
                    .html(elem.properties.name + "<br>Food Insecure Population: " + (heat_mapping[elem.id].VLFS * 100).toFixed(2) + "%")
                    .style("left", coords[0] + 10 + "px")
                    .style("top", coords[1] + "px")
                    .style("opacity", 1);
            };

            const onMouseLeave = (elem) => {
                tooltip
                    .style("opacity", 0);
            };

            const onMouseClick = (elem) => {
                setOverlayCountyName(elem.properties.name);
                setOverlayVisible(true);
            };

            svg.append("g")
                .attr("class", "counties")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.counties).features)
                .enter().append("path")
                .attr("d", path)
                .attr("fill", d => colorMapping(heat_mapping[d.id]["HEAT"], rel_max))
                .attr("stroke", "lightgrey")
                .on("mouseover", onMouseOver)
                .on("mouseleave", onMouseLeave)
                .on("click", onMouseClick);
          
            svg.append("path")
                .attr("class", "state-borders")
                .attr("d", path(topojson.mesh(us, us.objects.states)));
        });
    };

    // Runs on first render
    useEffect(
        () => {
            if (hasFetchedData.current) {
                return;
            }
            console.debug("Fetching data...");
            fetch(process.env.PUBLIC_URL + "/2020_food_insecurity.json")
                .then(response => response.json())
                .then(json => {
                    console.debug("Data fetched!");
                    hasFetchedData.current = true;
                    loadMap(json);
                });
        }, []
    );

    return (
        <div id="map-container">
            <Overlay visible={overlayVisible} countyName={overlayCountyName} onClick={() => setOverlayVisible(false)} />
            <div id="tooltip" ref={tooltipContainer}></div>
            <svg id="map-canvas" width="960" height="600" ref={d3Container}></svg>
        </div>
    );
}

export default Map;