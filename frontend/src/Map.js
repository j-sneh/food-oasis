import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import './Map.css';
import Overlay from './Overlay';
import * as d3 from "d3";
import * as topojson from "topojson";
import state_data from "./StateFips.json";

setTimeout(function () {
    window.scrollTo(0,document.body.scrollHeight);
}, 3000);

const StateFips = {
    "10": "DE",
    "11": "DC",
    "12": "FL",
    "13": "GA",
    "15": "HI",
    "16": "ID",
    "17": "IL",
    "18": "IN",
    "19": "IA",
    "20": "KS",
    "21": "KY",
    "22": "LA",
    "23": "ME",
    "24": "MD",
    "25": "MA",
    "26": "MI",
    "27": "MN",
    "28": "MS",
    "29": "MO",
    "30": "MT",
    "31": "NE",
    "32": "NV",
    "33": "NH",
    "34": "NJ",
    "35": "NM",
    "36": "NY",
    "37": "NC",
    "38": "ND",
    "39": "OH",
    "40": "OK",
    "41": "OR",
    "42": "PA",
    "44": "RI",
    "45": "SC",
    "46": "SD",
    "47": "TN",
    "48": "TX",
    "49": "UT",
    "50": "VT",
    "51": "VA",
    "53": "WA",
    "54": "WV",
    "55": "WI",
    "56": "WY",
    "60": "AS",
    "66": "GU",
    "69": "MP",
    "72": "PR",
    "74": "UM",
    "78": "VI",
    "01": "AL",
    "02": "AK",
    "04": "AZ",
    "05": "AR",
    "06": "CA",
    "08": "CO",
    "09": "CT"
};

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
    let [termMatches, setTermMatches] = useState([]);
    let countyNames = useRef([]);
    let countyNamesToFips = useRef({});
    let heatMapping = useRef({});

    const showResults = (event) => {
        setTermMatches(autocompleteMatch(event.target.value));
    }

    function autocompleteMatch(input) {
        if (input === "") {
            return [];
        }

        // Get all the terms that start with the input
        let terms = countyNames.current.filter(function(term) {
            return term.toLowerCase().startsWith(input.toLowerCase());
        });
        return terms.slice(0, 20);
    }

    const infoClick = (event) => {

    }


    const loadMap = (foodInsecurityData) => {
        if (!d3Container.current || !tooltipContainer.current) {
            return;
        }
        console.debug("Loaded food insecurity data: ")
        console.debug(foodInsecurityData);
        d3.json(countyDataSource, (error, us) => {
            if (error) throw error;

            let geometries = us.objects.counties.geometries;
            for (let i = 0; i < geometries.length; i++) {
                countyNames.current.push(geometries[i].properties.name + ", " + StateFips[geometries[i].id.substring(0, 2)]);
                countyNamesToFips.current[geometries[i].properties.name + ", " + StateFips[geometries[i].id.substring(0, 2)]] = geometries[i].id;
            }

            console.debug("Computing heat mapping...");
            let maxHeat = 0;
            let maxVLFS = 0;
            for (let i = 0; i < foodInsecurityData.length; i++) {
                let fips = foodInsecurityData[i]["FIPS"].toString();
        
                if (fips.length === 4) {
                    fips = "0" + fips;
                }
        
                heatMapping.current[fips] = {
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
            // const zoom = d3.zoom()
            //     .scaleExtent([1, 8])
            //     .on("zoom", () => {
            //         svg.selectAll("path")
            //             .attr("transform", d3.event.transform)
            //     });
            // svg.call(zoom);
            
            console.debug("Inserting SVG elements with d3...");
            const elem = svg.append("g")
                .attr("class", "counties")
                .attr("cursor", "pointer");
            elem.selectAll("path")

            const onMouseOver = (elem) => {
                const coords = d3.mouse(d3.event.currentTarget);
                tooltip
                    .html(elem.properties.name + "<br>Food Insecure Population: " + (heatMapping.current[elem.id].VLFS * 100).toFixed(2) + "%")
                    .style("left", coords[0] + 20 + "px")
                    .style("top", coords[1] + "px")
                    .style("display", "block");
            };

            const onMouseLeave = (elem) => {
                tooltip
                    .style("display", "none");
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
                .attr("fill", d => colorMapping(heatMapping.current[d.id]["HEAT"]))
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
        <div>
            <div style={{marginBottom: "80px"}} className="container">
            <div className="row mb-2">
                <div data-bs-toggle="modal" data-bs-target="#infoModal" style={{cursor: "pointer"}} onClick={infoClick()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>                 
                </div>
            </div>
            <div className="row">
                <div id="map-container" className="col-md-9">
                    <Overlay visible={overlayVisible} countyName={overlayCountyName} stateName={overlayStateName} onClick={() => setOverlayVisible(false)} />
                    <div id="tooltip" ref={tooltipContainer}></div>
                    <svg id="map-canvas" width="960" height="600" ref={d3Container}></svg>
                </div>
                <div className="col">
                    <form autoComplete="off">
                        <input type="text" className="form-control" placeholder="Search County" name="q" id="q" onChange={showResults} />
                        <div id="result">
                            <ul style={{paddingLeft: "5px", listStyle: "none"}} className="mt-2">
                                {[].concat(termMatches).sort((a, b) => {
                                    return heatMapping.current[countyNamesToFips.current[b]]["VLFS"] * 100 - heatMapping.current[countyNamesToFips.current[a]]["VLFS"] * 100
                                }).map((term, i) => <li style={{cursor: "pointer"}} onClick={() => {
                                    console.log(`Clicked on ${term}`);
                                    const name = term.split(", ")[0];
                                    setOverlayCountyName(name);
                                    const stateName = term.split(", ")[1];
                                    setOverlayStateName(stateName);
                                    setOverlayVisible(true);
                                }} key={i}>{term} <span style={{backgroundColor: colorMapping(heatMapping.current[countyNamesToFips.current[term]]["HEAT"]), fontSize: "12px"}}
                                    className="badge float-end">{(heatMapping.current[countyNamesToFips.current[term]]["VLFS"] * 100).toFixed(2) + "%"}
                                    </span></li>)}
                            </ul>
                        </div>
                    </form>
                </div>
            </div>
            </div>
            <footer className="text-center text-lg-start text-white" style={{backgroundColor: "#3e4551"}}>
                <div className="text-center p-3" style={{backgroundColor: "rgba(0, 0, 0, 0.2)"}}> Made with ❤️ by <a style={{color: "rgb(255, 255, 255)"}} target="_blank" href="https://github.com/AdeliaSolarman">Adelia</a>, <a style={{color: "rgb(255, 255, 255)"}} target="_blank" href="https://github.com/Debusan13">Devak</a>, <a style={{color: "rgb(255, 255, 255)"}} target="_blank" href="https://github.com/imathur1">Ishaan</a>, <a style={{color: "rgb(255, 255, 255)"}} target="_blank" href="https://github.com/j-sneh">Jonathan</a>, <a style={{color: "rgb(255, 255, 255)"}} target="_blank" href="https://github.com/LouisAsanaka">Louis</a>, and <a style={{color: "rgb(255, 255, 255)"}} target="_blank" href="https://github.com/21xiaofanli">Xiaofan</a>
                </div>
            </footer>
        </div>
    );
}

export default Map;