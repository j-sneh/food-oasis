import React, {Component} from 'react';
import * as d3 from "d3";

class BarChart extends Component {
    
    drawChart() {
        const data = this.props.data;
        const h = 600;

        const svg = d3.select("body").append("svg")
            .attr("width", this.props.width)
            .attr("height", this.props.height);
                    
        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * 70)
            .attr("y", (d, i) => h - 10 * d)
            .attr("width", 65)
            .attr("height", (d, i) => d * 10)
            .attr("fill", "green");
    }

    componentDidMount() {
        this.drawChart();
    }

    render(){
        return <div id={"#" + this.props.id}></div>
    }
}

export default BarChart;