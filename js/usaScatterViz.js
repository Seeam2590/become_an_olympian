
/*
 *  UsaScatterViz - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 */

class UsaScatterViz {

    /*
     *  Constructor method
     */
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.initVis();
    }


    /*
     *  Initialize scatter plot
     */
    initVis () {
        let vis = this;
        vis.margin = {top: 10, right: 100, bottom: 40, left: 80};

        vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $('#' + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;


        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Add X axis
        vis.x = d3.scaleLinear()
            .domain([0, 18000])
            .range([ 0, vis.width ]);

        vis.svg.append("g")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(d3.axisBottom(vis.x));

        // Add Y axis
        vis.y = d3.scaleLinear()
            .domain([0, 6000])
            .range([ vis.height, 0]);

        vis.svg.append("g")
            .call(d3.axisLeft(vis.y));

        // Add a scale for bubble size
        //vis.z = d3.scaleLinear()
          //  .domain([200000, 1310000000])
           // .range([ 1, 40]);

        // Add dots
        vis.svg.append('g')
            .selectAll("dot")
            .data(vis.data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return vis.x(d.athletes); } )
            .attr("cy", function (d) { return vis.y(d.total); } )
            .attr("r", 6)
            //.attr("r", function (d) { return z(d.pop); } )
            .style("fill", "#69b3a2")
            .style("opacity", "0.7")
            .attr("stroke", "black")

        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;

        // Update the visualization
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

    }
}

