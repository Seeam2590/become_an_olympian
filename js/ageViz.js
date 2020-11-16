/*
 *  ageViz - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 */

class AgeViz {

    /*
     *  Constructor method
     */
    constructor(parentElement, displayData) {
        this.parentElement = parentElement;
        this.displayData = displayData;

        this.initVis();
    }



    initVis () {
        let vis = this;

        console.log(vis.displayData)

        var circleData = [
            { "cx": 100, "cy": 250, "radius": 100, "color" : "#d7d7d7", "text" : "SILVER: " },
            { "cx": 500, "cy": 250, "radius": 100, "color" : "#6a3805", "text" : "BRONZE: " },
            { "cx": 300, "cy": 250, "radius": 150, "color" : "#af9500", "text" : "GOLD: " }];

        var svg = d3.select("#ageViz").append("svg")
            .attr("width", 600)
            .attr("height", 500);

        var circles = svg.selectAll("circle")
            .data(circleData)
            .enter()
            .append("circle");

        var circleAttributes = circles
            .attr("cx", d => d.cx)
            .attr("cy", d =>  d.cy)
            .attr("r", d => d.radius)
            .style("fill", d => d.color);

        var text = svg.selectAll("text")
            .data(circleData)
            .enter()
            .append("text");

        var textLabels = text
            .attr("x", d => d.cx -30)
            .attr("y", d =>  d.cy -50)
            .text( function (d) { return d.text; })
            .attr("font-family", "Varela Round")
            .attr("font-size", "0.8rem")
            .attr("fill", "black");

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