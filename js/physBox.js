/*
 *  PhysBox - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 */

class PhysBox {

    /*
     *  Constructor method
     */
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        this.initVis();
    }


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
        vis.x = d3.scaleBand()
            .range([ 0, vis.width ])
            .domain(["M", "F"])
            .paddingInner(1)
            .paddingOuter(.5)

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.xAxisGroup = vis.svg.append("g")
            .attr("class", "x-axis axis");

        // Drawing the X-axis
        vis.svg.select(".x-axis")
            .attr("transform", "translate(0," + vis.height +  ")")
            .call(vis.xAxis);

        // X-axis label
        vis.svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("y", 470)
            .attr("x", 580)
            .attr("font-size", "12px")
            .text("Sex");

        // Add Y axis
        vis.y = d3.scaleLinear()
            .range([ vis.height, 0])

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)

        vis.yAxisGroup = vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.svg.select(".y-axis")
            .call(vis.yAxis);

        // Y-axis label
        vis.ylabel = vis.svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 20)
            .attr("x", 0)
            .attr("font-size", "12px")
            .attr("transform", "rotate(-90)")

        vis.data.forEach(function (d) {
            d.Weight = +d.Weight
            d.Height = +d.Height
        });

        vis.wrangleData();
    }
    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;

        let selectBox = document.getElementById("box-y");
        vis.dimension = selectBox.options[selectBox.selectedIndex].value;

        vis.sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
            .key(function(d) { return d.Sex;})
            .rollup(function(d) {
                let q1 = d3.quantile(d.map(function(g) { return g[vis.dimension];}).sort(d3.ascending),.25)
                let median = d3.quantile(d.map(function(g) { return g[vis.dimension];}).sort(d3.ascending),.5)
                let q3 = d3.quantile(d.map(function(g) { return g[vis.dimension];}).sort(d3.ascending),.75)
                let interQuantileRange = q3 - q1
                let min = q1 - 1.5 * interQuantileRange
                let max = q3 + 1.5 * interQuantileRange
                return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
            })
            .entries(vis.data)

        vis.updateVis();
    }
    updateVis() {
        let vis = this;

        // Update axis
        vis.y.domain(d3.extent(vis.data, function(d) { return d[vis.dimension]; }))
        vis.svg.select(".y-axis")
            .transition()
            .duration(500)
            .call(vis.yAxis);

        // Updating y-axis label
        if (vis.dimension == "Height"){
            vis.ylabel.text("Height in cm");
        } else {
            vis.ylabel.text("Weight in kg");
        }


        // Vertical Lines
        vis.vlines = vis.svg
            .selectAll(".vLines")
            .data(vis.sumstat)

        vis.vlines
            .enter()
            .append("line")
            .merge(vis.vlines)
            .transition()
            .duration(800)
            .attr("class", "vLines")
            .attr("x1", function(d){return(vis.x(d.key))})
            .attr("x2", function(d){return(vis.x(d.key))})
            .attr("y1", function(d){return(vis.y(d.value.min))})
            .attr("y2", function(d){return(vis.y(d.value.max))})
            .attr("stroke", "black")
            .style("width", 40)

        // Exit
        vis.vlines.exit().remove();

        // Boxes for the box plot
        vis.boxWidth = 100

        vis.boxes = vis.svg
            .selectAll("rect")
            .data(vis.sumstat)

        vis.boxes.enter()
            .append("rect")
            .merge(vis.boxes)
            .transition()
            .duration(800)
            .attr("x", function(d){return(vis.x(d.key)-vis.boxWidth/2)})
            .attr("y", function(d){return(vis.y(d.value.q3))})
            .attr("height", function(d){return(vis.y(d.value.q1)-vis.y(d.value.q3))})
            .attr("width", vis.boxWidth )
            .attr("stroke", "black")
            .style("fill", "#69b3a2")

        // Exit
        vis.boxes.exit().remove();

        // Show the median
        vis.hlines = vis.svg
            .selectAll(".hLines")
            .data(vis.sumstat)

        vis.hlines.enter()
            .append("line")
            .merge(vis.hlines)
            .transition()
            .duration(800)
            .attr("class", "hLines")
            .attr("x1", function(d){return(vis.x(d.key)-vis.boxWidth/2) })
            .attr("x2", function(d){return(vis.x(d.key)+vis.boxWidth/2) })
            .attr("y1", function(d){return(vis.y(d.value.median))})
            .attr("y2", function(d){return(vis.y(d.value.median))})
            .attr("stroke", "black")
            .style("width", 80)

        // Exit
        vis.hlines.exit().remove();


    }
}