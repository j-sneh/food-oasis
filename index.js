var svg = d3.select("svg");
var path = d3.geoPath();
var original = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json";

var foodInsecurity;
fetch("https://gist.githubusercontent.com/imathur1/fa0c1cabe97bcd194a0d71cfa3415fb0/raw/9d9d4785cf5e21c25fd5a916053fe578b12adbae/2020_food_insecurity.json")
    .then(response => response.json())
    .then(json => {
        foodInsecurity = json;
        loadChart();
    });


function colorMapping(value, rel_max) {
    // var alpha_value = (10 ** (10 * value)) / (10 ** (10 * rel_max));
    // return "hsla(14, 100%, 51%, " + alpha_value + ")";
    return "hsla(14, 100%, 51%, " + value + ")";
}


function loadChart() {
    var Tooltip = d3.select("#chart")
    .append("div")
    .attr("class", "tooltip");
  
  d3.json(original, function(error, us) {
    if (error) throw error;

    var rel_max = 0;
    heat_mapping = {};
    for (var i = 0; i < foodInsecurity.length; i++) {
        var fips = foodInsecurity[i]["FIPS"].toString();

        if (fips.length == 4) {
            fips = "0" + fips;
        }

        heat_mapping[fips] = {
            "HEAT": foodInsecurity[i]["HEAT"],
            "VLFS": foodInsecurity[i]["VLFS"]
        }
        if (foodInsecurity[i]["VLFS"] > rel_max) {
            rel_max = foodInsecurity[i]["VLFS"];
        }
    }
  
    const elem = svg.append("g")
      .attr("class", "counties");
    const res = elem.selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
      .enter().append("path")
        .attr("d", path)
        .attr("fill", d => colorMapping(heat_mapping[d.id]["HEAT"], rel_max))
        .attr("stroke", "lightgrey")
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
        })
        // .append("title")
        // .text(d => d.properties.name); 
  
    svg.append("path")
        .attr("class", "state-borders")
        .attr("d", path(topojson.mesh(us, us.objects.states)));

  });

}