var svg = d3.select("svg");
var path = d3.geoPath();
var original = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json";

var Tooltip = d3.select("#chart")
  .append("div")
  .attr("class", "tooltip");

d3.json(original, function(error, us) {
  if (error) throw error;

  const elem = svg.append("g")
    .attr("class", "counties");
  const res = elem.selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
      .attr("d", path)
      .attr("fill", "#e8e8e8")
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