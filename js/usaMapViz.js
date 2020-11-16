
/*
 *  UsaMapViz - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 */

class UsaMapViz {

    /*
     *  Constructor method
     */
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.worldGeo = data;
        this.initVis();
    }


    /*
     *  Initialize station map
     */
    initVis () {
        let vis = this;
        vis.margin = {top: 10, right: 150, bottom: 40, left: 0};

        vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $('#' + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;


        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Getting the projection
        vis.projection = d3.geoNaturalEarth()
            .scale(vis.width / 1.3 / Math.PI)
            .translate([vis.width / 2, vis.height / 2])

        // Draw the map
        vis.svg.append("g")
            .selectAll("path")
            .data(vis.worldGeo.features)
            .enter().append("path")
            .attr("fill", "#fff")
            .attr("d", d3.geoPath()
                .projection(vis.projection)
            )
            .style("stroke", "#000")

        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;
        vis.updateVis();
    }

    updateVis() {
        let vis = this;
    }
}

