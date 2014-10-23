// Draw countries in a more-or-less geographically appropriate grid layout
// with all countries being of equal size
//
var w = 800,
    h = 640,
    projection = d3.geo.mercator(),
    path = d3.geo.path()
      .projection(projection),
    svg = d3.select("body").append("svg")
        .attr("width", w)
        .attr("height", h),
    g = svg.append("g");

d3.json("maps/world-110m.json", function(e, topology) {
    var countries = topojson.feature(topology, topology.objects.countries)
        .features;
    g.selectAll("path")
        .data(countries)
      .enter()
        .append("path")
        .attr("d", path)
        .classed("country", true)
        .attr("transform", function(d) {
            var centroid = path.centroid(d),
                x = centroid[0],
                y = centroid[1];
            return "translate(" + x + "," + y + ")"
                + "scale(0.6)"
                + "translate(" + -x + "," + -y + ")";
        });
});
