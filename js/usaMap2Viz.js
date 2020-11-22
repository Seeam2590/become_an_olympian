
/*
 *  usaViz - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 */

class UsaMap2Viz {

    /*
     *  Constructor method
     */
    constructor(parentElement) {
        this.parentElement = parentElement;
        this.initVis();
    }


    /*
     *  Initialize bar chart
     */
    initVis () {
        let vis = this;
        vis.margin = {top: 10, right: 120, bottom: 40, left: 40};

        vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $('#' + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;


        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Scales and axes
        vis.x = d3.scaleLinear()
            .range([0, vis.width]);

        vis.y = d3.scaleBand()
            .rangeRound([vis.height, 0])
            .paddingInner(0.5);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            .tickSize(0);

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.title = vis.svg.append("text")
            .attr("x", 30)
            .attr("y", 0)
            .attr("fill", "#000")
            .attr("font-size", "14px")
            .text("United States")

        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
    wrangleData (d = []) {
        let vis = this;
        if (d.length == 0){
            vis.bartitle = "United States of America"
            vis.displayData = [{medal: "Bronze", value: 1233, color: "#6a3805"}, {medal: "Silver", value: 1512, color: "#d7d7d7"}, {medal: "Gold", value: 2474, color: "#af9500"}]
        }
        else {
            vis.displayData = [{medal: "Bronze", value: d.Bronze, color: "#6a3805"}, {medal: "Silver", value: d.Silver, color: "#d7d7d7"}, {medal: "Gold", value: d.Gold, color: "#af9500"}]
            vis.bartitle = d.country
        }

        // Update the visualization
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // Update title and domains
        vis.title.text(vis.bartitle);
        vis.x.domain([0, d3.max(vis.displayData, d => d.value)]);
        vis.y.domain(vis.displayData.map(d => d.medal));

        // Create and update rectangles
        vis.bars = vis.svg.selectAll("rect")
            .data(vis.displayData);

        vis.text = vis.svg.selectAll(".text")
            .data(vis.displayData);

        vis.bars
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("fill", d => d.color)
            .merge(vis.bars)
            .transition()
            .duration(300)
            .attr("x", 2)
            .attr("y", d => vis.y(d.medal) + 8)
            .attr("width", d => vis.x(d.value))
            .attr("height", vis.y.bandwidth());

        vis.bars.exit().remove();

        vis.text
            .enter()
            .append("text")
            .attr("class", "text")
            .attr("fill", "#292929")
            .merge(vis.text)
            .transition()
            .duration(300)
            .attr("y", d => vis.y(d.medal) + 23)
            .attr("x", d => vis.x(d.value) + 5)
            .attr("font-size", 10)
            .text( function (d) { return d.value })

        vis.text.exit().remove();

        // Update the y-axis
        vis.svg.select(".y-axis")
            .attr("transform", "translate(0," + 8 +  ")")
            .transition().duration(600)
            .call(vis.yAxis);
    }
}

