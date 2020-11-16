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
            { "cx": 150, "cy": 250, "radius": 100, "color" : "#d7d7d7", "text" : "SILVER: " },
            { "cx": 550, "cy": 250, "radius": 100, "color" : "#6a3805", "text" : "BRONZE: " },
            { "cx": 350, "cy": 250, "radius": 150, "color" : "#af9500", "text" : "GOLD: " }];

        var lineData = [
            {"x1": 50, "y1": -50, "x2": 150, "y2": 300, "fill" : "grey", "thick": 100},
            {"x1": 250, "y1": -50, "x2": 150, "y2": 300, "fill" : "grey", "thick": 100},

            {"x1": 450, "y1": -50, "x2": 550, "y2": 300, "fill" : "grey", "thick": 100},
            {"x1": 650, "y1": -50, "x2": 550, "y2": 300, "fill" : "grey", "thick": 100},

            {"x1": 250, "y1": -50, "x2": 350, "y2": 300, "fill" : "darkgrey", "thick": 130 },
            {"x1": 450, "y1": -50, "x2": 350, "y2": 300, "fill" : "darkgrey", "thick": 130},
        ]

        var svg = d3.select("#ageViz").append("svg")
            .attr("width", 800)
            .attr("height", 500);

        var line = svg.selectAll("line")
            .data(lineData)
            .enter()
            .append("line");

        var lineMedals = line
            .attr("x1", d => d.x1)
            .attr("y1", d => d.y1)
            .attr("x2", d => d.x2)
            .attr("y2", d => d.y2)
            .attr("stroke-width", d => d.thick)
            .attr("stroke", d => d.fill);

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