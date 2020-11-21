/*
 *  ageViz - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 */

class AgeVizTest {

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

        vis.silverText = svg
            .attr("class", "silver")
            .append("text")
            .attr("x", 85)
            .attr("y", 270)
            .attr("font-family", "Varela Round")
            .attr("font-size", "3rem")
            .attr("fill", "black");

        vis.goldText = svg
            .attr("class", "gold")
            .append("text")
            .attr("x", 240)
            .attr("y", 300)
            .attr("font-family", "Varela Round")
            .attr("font-size", "6rem")
            .attr("fill", "black");

        vis.bronzeText = svg
            .attr("class", "bronze")
            .append("text")
            .attr("x", 505)
            .attr("y", 270)
            .attr("font-family", "Varela Round")
            .attr("font-size", "3rem")
            .attr("fill", "black");

        vis.title = svg
            .attr("class", "title")
            .append("text")
            .attr("x", 260)
            .attr("y", 100)
            .attr("font-family", "Varela Round")
            .attr("font-size", "4rem")
            .attr("fill", "black");

        vis.sex = 'All';
        vis.season = 'All';
        vis.full_olympics = [];
        vis.displayData = vis.displayData.forEach( row => {
            // and push rows with proper dates into filteredData
            row.Age = +row.Age;
            vis.full_olympics.push(row);

        });

        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;

        //Filter by medals
        vis.medallers = vis.full_olympics.filter(function(d){return d.Medal == "Gold" || d.Medal == "Silver" || d.Medal == "Bronze";});

        if (vis.season == "All"){
            vis.medallers = vis.medallers.filter(function(d){return d.Season == "Winter" || d.Season == "Summer";});
        } else {
            vis.medallers = vis.medallers.filter(function(d){return d.Season == vis.season;});
        }

        if (vis.sex == "All"){
            vis.medallers = vis.medallers.filter(function(d){return d.Sex == "M" || d.Sex == "F";});
        } else {
            vis.medallers = vis.medallers.filter(function(d){return d.Sex == vis.sex;});
        }

        // Mean age by medal
        vis.AgeByMedal = d3.rollups(vis.medallers, v => d3.mean(v, d => d.Age), d => d.Medal);
        vis.AgeByMedal = Array.from(vis.AgeByMedal, ([key, value]) => ({key,value}));

        vis.updateVis();
    }
    updateVis() {
        let vis = this;
        //Isolating number
        vis.gold = vis.AgeByMedal[0].value
        vis.silver = vis.AgeByMedal[2].value
        vis.bronze = vis.AgeByMedal[1].value

        //Adding to medal
        vis.goldText.text(vis.gold.toFixed(1))
        vis.silverText.text(vis.silver.toFixed(1))
        vis.bronzeText.text(vis.bronze.toFixed(1))
    }
}