
/*
 *  UsaMapViz - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 */

class UsaMapViz {

    /*
     *  Constructor method
     */
    constructor(parentElement, geo, data) {
        this.parentElement = parentElement;
        this.worldGeo = geo;
        this.data = data;
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
        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;

        vis.data.forEach(function (d) {
            d.athletes = +d.athletes;
        });

        vis.maxAthletes = vis.data.reduce((a,b)=>a.athletes>b.athletes?a:b).athletes;
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // Color scale
        vis.color = d3.scaleSequential(d3.interpolateGreens)
            .domain([0, vis.maxAthletes])

        // Draw the map
        vis.svg.append("g")
            .selectAll("path")
            .data(vis.worldGeo.features)
            .enter().append("path")
            .attr("fill", d => {
                var info = vis.data.filter(e => e.code == d.id);
                if(info.length > 0)
                    return vis.color(info[0].athletes)
                else
                    return "#fff";
            })
            .attr("d", d3.geoPath()
                .projection(vis.projection)
            )
            .style("stroke", "#000")
    }
}

