// Draw countries in a more-or-less geographically appropriate grid layout
// with all countries being of equal size

var w = 800,
    h = 640,
    projection = d3.geo.mercator(),
    path = d3.geo.path()
      .projection(projection),
    svg = d3.select("body").append("svg")
        .attr("width", w)
        .attr("height", h),
    g = svg.append("g"),
    csize = 10;

d3.json("maps/world-110m.json", function(e, topology) {
    var countries = topojson
        .feature(topology, topology.objects.countries).features,
        countryGroups = g.selectAll("g")
        .data(countries)
      .enter()
        .append("g")
        .classed("country", true);
    countryGroups.append("path")
        .attr("d", path)
        .attr("vector-effect", "non-scaling-stroke") // Stops stroke scaling with translate()
        .attr("transform", function(d) {
            var centroid = path.centroid(d),
                x = centroid[0],
                y = centroid[1],
                /* Bounding box for scaling */
                bounds = path.bounds(d),
                bb_w = (bounds[1][0] - bounds[0][0]),
                bb_h = (bounds[1][1] - bounds[0][1]),
                /* scale-factor to ensure neither width nor height is
                 * greater than csize */
                scale = bb_w > bb_h ? csize / bb_w : csize / bb_h;
            return "translate(" + x + "," + y + ")"
                + "scale(" + scale + ")"
                + "translate(" + -x + "," + -y + ")";
        });
});
