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
    csize = 20;

d3.json("maps/world-110m.json", function(e, topology) {
  var countries = topojson
    .feature(topology, topology.objects.countries).features,
  countryGroups = g.selectAll("g")
    .data(countries)
    .enter()
    .append("g")
    .classed("country", true);
  // calculate centroids
  countries.map(function(d) {
    d.centroid = path.centroid(d);
    d.x = d.centroid[0];
    d.y = d.centroid[1];
    d.bb = path.bounds(d);
    d.bb_w = (d.bb[1][0] - d.bb[0][0]),
    d.bb_h = (d.bb[1][1] - d.bb[0][1]);
    d.bb_maxdim = d.bb_w > d.bb_h ? d.bb_w : d.bb_h;
    d.scale = d.bb_w > d.bb_h ? csize / d.bb_w : csize / d.bb_h;
    return d;
  });
  // Scale the groups
  // Draw the country outlines
  countryGroups.append("path")
    .attr("d", path)
    .attr("vector-effect", "non-scaling-stroke") // Stops stroke scaling with translate()
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")"
        + "scale(" + d.scale + ")"
        + "translate(" + -d.x + "," + -d.y + ")";
    });
  // Draw a box around each country
  countryGroups.append("rect")
    .attr("width", function(d) { return csize; })
    .attr("height", function(d) { return csize; })
    .attr("vector-effect", "non-scaling-stroke") // Stops stroke scaling with translate()
    .attr("x", 0)
    .attr("y", 0)
    .attr("transform", function(d) {
      /* scale-factor to ensure neither width nor height is
      * greater than csize */
      return "translate(" + (d.x - csize / 2) + "," + (d.y - csize / 2) + ")";
        //+ "scale(" + d.scale + ")";
    });
});
