import React from 'react';
import ReactDOM from 'react-dom';
import './Map.css';
import * as d3 from "d3";
import * as topojson from "topojson";

class Map extends React.Component {

    drawMap() {
        // const svg = d3.select("body").append("svg")
        //     .attr("width", this.props.width)
        //     .attr("height", this.props.height);
        const svg = d3.select("svg");

        var path = d3.geoPath();

        var original = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json";

        var Tooltip = d3.select("#div_template")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        d3.json(original, function(error, us) {
            if (error) throw error;

            const elem = svg.append("g")
                .attr("class", "counties");
            const res = elem.selectAll("path")
                .data(topojson.feature(us, us.objects.counties).features)
                .enter().append("path")
                .attr("d", path)
                .on("mouseover", (x) => {
                    // console.log(x);
                    Tooltip
                        .html("<a href='https://www.google.com/search?q=food+banks+near+" + x.properties.name + "+county'>" + x.properties.name + "</a>")
                        .style("left", d3.mouse(d3.event.currentTarget)[0]+10 + "px")
                        .style("top", d3.mouse(d3.event.currentTarget)[1] + "px")
                        .style("opacity", 1)
                })
                .on("mouseleave", (x) => {
                    Tooltip
                    .style("opacity", 0)
                });     

            console.log(topojson.feature(us, us.objects.counties).features);

            svg.append("path")
                .attr("class", "county-borders")
                .attr("d", path(topojson.mesh(us, us.objects.states)));
        });
    }

    componentDidMount() {
        this.drawMap();
    }

    // render(){
    //     return <div id={"#" + this.props.id}></div>
    // }

    render() {
        return (
            <div id="div_template">
                <svg width="960" height="600"></svg>
            </div>
        );
    }
}

export default Map;