var force;

function rectangleLayout(selection, w, h) {
  // Ripped mercilessly from 
  // http://bl.ocks.org/mbostock/3231307
  var abs = Math.abs,
      nodes = selection.data();

  force = d3.layout.force()
    .gravity(0.02)
    .charge(function(d, i) { return 0; })
    .nodes(nodes)
    .size([w, h]);


  force.on("tick", function(e) {
    var q = d3.geom.quadtree(nodes),
    i,
    n = nodes.length;

    for (i = 0; i < n; ++i) q.visit(collide(nodes[i]));
    drawNodes()
  });

  function drawNodes() {
    selection.data(nodes).attr("transform", function(d) {
      return "translate(" + (d.x - d.centroid[0])
                    + "," + (d.y - d.centroid[1]) + ")";
    });
  }

  svg.on("click", function(d) {
    force.start();
    force.resume();
  });

  function collide(node) {
    // This part of the code is what behaves diffrerently to the blocks
    // example
    var rx = node.width / 2 + 16, // Not sure yet what this is for
        ry = node.height / 2 + 16,
        nx1 = node.x - rx,
        nx2 = node.x + rx,
        ny1 = node.y - ry,
        ny2 = node.y + ry;
    return function(quad, x1, y1, x2, y2) {
      // quad is the 'box' of the quad tree.
      // it might have a point in it, or not.
      // It also contains its child nodes
      // unless quad.leaf == true
      if (quad.point && (quad.point !== node)) {
        // This box contains a point
        var p = quad.point;
        var x = node.x - p.x, // Distance from node to the quad square's point
            y = node.y - p.y,
            lx = abs(x),
            ly = abs(y),
            rx = (node.width + p.width) / 2;
            ry = (node.height + p.height) / 2;
        // The following "do we overlap" test is courtesy of
        // http://gamedev.stackexchange.com/a/587
        if ((abs(node.x - p.x) * 2 < (node.width + p.width)) &&
            (abs(node.y - p.y) * 2 < (node.height + p.height))) {
              // The rectangles overlap (since difference in x is smaller than
              // the two sizes and so is the difference in y.)
              // Move node and quad in opposite directions
              // But only move in whichever direction is the smallest
              var dx = ((lx - rx) > (ly - ry)) ? (lx - rx) / lx * .5 : 0;
              var dy = ((lx - rx) < (ly - ry)) ? (ly - ry) / ly * .5 : 0;
              node.x -= x *= dx;
              node.y -= y *= dy;
              p.x += x;
              p.y += y;
            }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1; // This is quad tree stuff
    };
  }
};

