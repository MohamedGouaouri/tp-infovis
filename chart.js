var colors =
    ["#fdb863",
        "#b2abd2",
        "#f1a340",
        "#d8daeb",
        "#998ec3",
        "#f1a340",
        "#fee0b6",
        "#d8daeb",
        "#998ec3",
        "#e08214",
        "#d8daeb",
        "#b2abd2",
        "#8073ac",
        "#e08214",
        "#fee0b6",
        "#d8daeb",
        "#b2abd2",
        "#8073ac",
        "#b35806",
        "#e08214",
        "#d8daeb",
        "#b2abd2",
        "#8073ac",
        "#542788",
        "#b35806",
        "#e08214",
        "#d8daeb",
        "#b2abd2",
        "#8073ac",
        "#542788"]

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
// svg.style("background-color", "#f3e0f5");
svg.style("background-color", "#000000");

// var color = d3.scale.ordinal(d3.schemeCategory20);
// var color = d3.scale.category20b();

d3.json("a_dataset.json", function (error, graph) {
    if (error) throw error;

    console.log(graph.links);

    var unit = colors.length / graph.nodes.length;

    var force = d3.layout.force()
        .size([width, height])
        .charge(-550)
        .linkDistance(60)
        .gravity(0.1)
        .on("tick", tick);

    function dragstarted(d) {
        console.log("dragstarted");
        // if (!d3.event.active) force.restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        console.log("dragged");
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        // if (!d3.event.active) force.alphaTarget(0);

        console.log("dragended");
        d.x = d.fx;
        d.y = d.fy;
        d.fx = null;
        d.fy = null;

    }

    drag = force.drag()
        // .on("dragstart", function(d){
        //     d3.select(this).classed("fixed", d.fixed = true);
        //     })
        .on("dragstart", dragstarted)
        .on("drag", dragged)
        .on("dragend", dragended)
        ;

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .style("stroke", "#7a7a7a")
        .attr("stroke-width", function (d) { return d.weight / 2; });

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes)
        .enter().append("g")
        .call(drag);


    var circles = node.append("circle")
        .attr("r", function (d) { return d.value3 * 20; })
        .attr("cx", function (d) { return d.value1; })
        .attr("cy", function (d) { return d.value2; })
        .style("stroke", "#000000")
        .attr("fill", function (d) { return colors[Math.floor(d.id * unit)]; })
        .style("cursor", "pointer");


    var lables = node.append("text")
        .text(function (d) {
            return d.label;
        })
        .attr("font-weight", 9000)
        .style('fill', 'white')
        .attr('x', 15)
        .attr('y', 3);

    node.append("title")
        .text(function (d) { return d.label; });

    force.links(graph.links);
    force.nodes(graph.nodes);

    function tick() {
        node
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
        link.attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });
        // node.attr("cx", function(d) { return d.x; })
        // .attr("cy", function(d) { return d.y; });    
    }

    force.start();

    var fisheye = d3.fisheye.circular()
        .radius(100)
        .distortion(50);

    svg.on("mousemove", function () {
        fisheye.focus(d3.mouse(this));
    });

    svg.on("mousemove", function () {
        fisheye.focus(d3.mouse(this));

        node.each(function (d) { d.fisheye = fisheye(d); })
            .attr("transform", function (d) {
                return "translate(" + d.fisheye.x + "," + d.fisheye.y + ")";
            })
            .attr("r", function (d) { return d.fisheye.z * 20; });


        link.attr("x1", function (d) { return d.source.fisheye.x; })
            .attr("y1", function (d) { return d.source.fisheye.y; })
            .attr("x2", function (d) { return d.target.fisheye.x; })
            .attr("y2", function (d) { return d.target.fisheye.y; });
    });

});



