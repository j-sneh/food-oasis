import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import './Map.css';
import Overlay from './Overlay';
import * as d3 from "d3";
import * as topojson from "topojson";
import state_data from "./StateFips.json";
const countyDataSource = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json";

const colorMapping = (value) => {
    return "hsla(14, 100%, 24%, " + value + ")";
};

const createLegend = (svg, maxHeat, maxVLFS) => {
    const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(600,30)");

    let numTicks = 15;
    let tickInterval = maxHeat / numTicks;
    let tickValues = [];
    for (let i = 0; i < numTicks; i++) {
        tickValues.push(tickInterval * i);
    }
    legend.selectAll("rect")
        .data(tickValues)
        .enter()
        .append("rect")
        .attr("x", (d, i) => {
            return i * 15;
        })
        .attr("y", 0)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", (d, i) => {
            return colorMapping(d / maxHeat);
        });

    legend.append("text")
        .attr("x", 15)
        .attr("y", -10)
        .attr("dy", "0.32em")
        .text("Food Insecurity Level");

    legend.append("text")
        .attr("x", -15)
        .attr("y", 8)
        .attr("dy", "0.32em")
        .text("0%");

    legend.append("text")
        .attr("x", numTicks * 15 + 5)
        .attr("y", 8)
        .attr("dy", ".32em")
        .text((maxVLFS * 100).toFixed(2) + "%");

    return legend;
};

const Map = () => {
    const d3Container = useRef(null);
    const tooltipContainer = useRef(null);
    const hasFetchedData = useRef(false);
    let [overlayVisible, setOverlayVisible] = useState(false);
    let [overlayCountyName, setOverlayCountyName] = useState("");
    let [overlayStateName, setOverlayStateName] = useState("");

    const loadMap = (foodInsecurityData) => {
        if (!d3Container.current || !tooltipContainer.current) {
            return;
        }
        console.debug("Loaded food insecurity data: ")
        console.debug(foodInsecurityData);
        d3.json(countyDataSource, (error, us) => {
            if (error) throw error;

            let geometries = us.objects.counties.geometries;
            let countyNames = [];
            for (let i = 0; i < geometries.length; i++) {
                countyNames.push(geometries[i].properties.name + ", " + geometries[i].properties.state);
            }

            console.debug("Computing heat mapping...");
            let heatMapping = {};
            let maxHeat = 0;
            let maxVLFS = 0;
            for (let i = 0; i < foodInsecurityData.length; i++) {
                let fips = foodInsecurityData[i]["FIPS"].toString();
        
                if (fips.length === 4) {
                    fips = "0" + fips;
                }
        
                heatMapping[fips] = {
                    "HEAT": foodInsecurityData[i]["HEAT"],
                    "VLFS": foodInsecurityData[i]["VLFS"]
                }
                if (foodInsecurityData[i]["HEAT"] > maxHeat) {
                    maxHeat = foodInsecurityData[i]["HEAT"];
                }
                if (foodInsecurityData[i]["VLFS"] > maxVLFS) {
                    maxVLFS = foodInsecurityData[i]["VLFS"];
                }
            }

            const svg = d3.select(d3Container.current)

            const path = d3.geoPath();
            const tooltip = d3.select(tooltipContainer.current);
            const legend = createLegend(svg, maxHeat, maxVLFS);      

            // zoom in and zoom out on mouse scroll
            const zoom = d3.zoom()
                .scaleExtent([1, 8])
                .on("zoom", () => {
                    svg.selectAll("path")
                        .attr("transform", d3.event.transform)
                });
            svg.call(zoom);

            console.debug("Inserting SVG elements with d3...");
            const elem = svg.append("g")
                .attr("class", "counties")
                .attr("cursor", "pointer");
            elem.selectAll("path")

            const onMouseOver = (elem) => {
                const coords = d3.mouse(d3.event.currentTarget);
                tooltip
                    .html(elem.properties.name + "<br>Food Insecure Population: " + (heatMapping[elem.id].VLFS * 100).toFixed(2) + "%")
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
                const stateFIPS = elem.id.substring(0,2);
                setOverlayStateName(state_data[stateFIPS]);
                setOverlayVisible(true);
            };

            svg.append("g")
                .attr("class", "counties")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.counties).features)
                .enter().append("path")
                .attr("d", path)
                .attr("fill", d => colorMapping(heatMapping[d.id]["HEAT"]))
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
        <div id="map-container" className="col-md-9">
            <Overlay visible={overlayVisible} countyName={overlayCountyName} onClick={() => setOverlayVisible(false)} />
            <div id="tooltip" ref={tooltipContainer}></div>
            <svg id="map-canvas" width="960" height="600" ref={d3Container}></svg>
        </div>
        
    );
}

export default Map;