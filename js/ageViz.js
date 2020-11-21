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

        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;

        vis.full_olympics = [];

        vis.displayData = vis.displayData.forEach( row => {
            // and push rows with proper dates into filteredData
            row.Age = +row.Age;

            vis.full_olympics.push(row);

        });
        console.log(vis.full_olympics)

        //Filter by medals
        vis.medallers = vis.full_olympics.filter(function(d){return d.Medal == "Gold" || d.Medal == "Silver" || d.Medal == "Bronze";});
        console.log("Medallers = ", vis.medallers)

        //Mean age by medal
        vis.AgeByMedal = d3.rollups(vis.medallers, v => d3.mean(v, d => d.Age), d => d.Medal);
        //d => d.Sex, d => d.Games, d => d.Sport);
        // d => d.Sport, d => d.Games, d => d.Sex
        vis.AgeByMedal = Array.from(vis.AgeByMedal, ([key, value]) => ({key,value}));
        console.log("Medal array = ",vis.AgeByMedal)

        //Isolating number
        vis.gold = vis.AgeByMedal[0].value
        vis.silver = vis.AgeByMedal[2].value
        vis.bronze = vis.AgeByMedal[1].value

        //Adding to medal
        vis.goldText.text(vis.gold.toFixed(1))
        vis.silverText.text(vis.silver.toFixed(1))
        vis.bronzeText.text(vis.bronze.toFixed(1))

        vis.title.text("ALL")

        vis.updateVis();
    }

    all() {

        let vis = this;

        //Filter by medals
        vis.medallers = vis.full_olympics.filter(function(d){return d.Medal == "Gold" || d.Medal == "Silver" || d.Medal == "Bronze";});
        console.log("Medallers = ", vis.medallers)

        //Mean age by medal
        vis.AgeByMedal = d3.rollups(vis.medallers, v => d3.mean(v, d => d.Age), d => d.Medal);
        //d => d.Sex, d => d.Games, d => d.Sport);
        // d => d.Sport, d => d.Games, d => d.Sex
        vis.AgeByMedal = Array.from(vis.AgeByMedal, ([key, value]) => ({key,value}));
        console.log("Medal array = ",vis.AgeByMedal)

        //Isolating number
        vis.gold = vis.AgeByMedal[0].value
        vis.silver = vis.AgeByMedal[2].value
        vis.bronze = vis.AgeByMedal[1].value

        //Adding to medal
        vis.goldText.text(vis.gold.toFixed(1))
        vis.silverText.text(vis.silver.toFixed(1))
        vis.bronzeText.text(vis.bronze.toFixed(1))

        vis.title.text("ALL")

        vis.updateVis();

    }



    male() {
        let vis = this;

        //Filter by medals by MALE
        vis.medallersMale = vis.medallers.filter(function(d){return d.Sex == "M";});
        console.log("Males = ", vis.medallersMale);

        //Mean age by medal for MALE
        vis.AgeByMedalMALE = d3.rollups(vis.medallersMale, v => d3.mean(v, d => d.Age), d => d.Medal);
        vis.AgeByMedalMALE = Array.from(vis.AgeByMedalMALE, ([key, value]) => ({key,value}));
        console.log("Male array = ", vis.AgeByMedalMALE)

        //Isolating number
        vis.goldMale = vis.AgeByMedalMALE[0].value
        vis.silverMale = vis.AgeByMedalMALE[2].value
        vis.bronzeMale = vis.AgeByMedalMALE[1].value

        //Adding to medal
        vis.goldText.text(vis.goldMale.toFixed(1))
        vis.silverText.text(vis.silverMale.toFixed(1))
        vis.bronzeText.text(vis.bronzeMale.toFixed(1))

        vis.title.text("Male")

        vis.updateVis();

    }

    female() {
        let vis = this;

        //Filter by medals by FEMALE
        vis.medallersFemale = vis.medallers.filter(function(d){return d.Sex == "F";});
        console.log("Females = ", vis.medallersFemale);

        //Mean age by medal for MALE
        vis.AgeByMedalFEMALE = d3.rollups(vis.medallersFemale, v => d3.mean(v, d => d.Age), d => d.Medal);
        vis.AgeByMedalFEMALE = Array.from(vis.AgeByMedalFEMALE, ([key, value]) => ({key,value}));
        console.log("Female array = ", vis.AgeByMedalFEMALE)

        //Isolating number
        vis.goldFemale = vis.AgeByMedalFEMALE[0].value
        vis.silverFemale = vis.AgeByMedalFEMALE[2].value
        vis.bronzeFemale = vis.AgeByMedalFEMALE[1].value

        vis.goldText.text(vis.goldFemale.toFixed(1))
        vis.silverText.text(vis.silverFemale.toFixed(1))
        vis.bronzeText.text(vis.bronzeFemale.toFixed(1))

        vis.title.text("Female")

        vis.updateVis();

    }

    winter() {
        let vis = this;

        //Filter by medals by WINTER
        vis.medallersWinter = vis.medallers.filter(function(d){return d.Season == "Winter";});
        console.log("Winter = ", vis.medallersWinter);

        //Mean age by medal for MALE
        vis.AgeByMedalWINTER = d3.rollups(vis.medallersWinter, v => d3.mean(v, d => d.Age), d => d.Medal);
        vis.AgeByMedalWINTER = Array.from(vis.AgeByMedalWINTER, ([key, value]) => ({key,value}));
        console.log("Winter array = ", vis.AgeByMedalWINTER)

        //Isolating number
        vis.goldWinter = vis.AgeByMedalWINTER[0].value
        vis.silverWinter = vis.AgeByMedalWINTER[2].value
        vis.bronzeWinter = vis.AgeByMedalWINTER[1].value

        vis.goldText.text(vis.goldWinter.toFixed(1))
        vis.silverText.text(vis.silverWinter.toFixed(1))
        vis.bronzeText.text(vis.bronzeWinter.toFixed(1))

        vis.title.text("Winter")

        vis.updateVis();

    }

    summer() {
        let vis = this;

        //Filter by medals by SUMMER
        vis.medallersSummer = vis.medallers.filter(function(d){return d.Season == "Summer";});
        console.log("Summer = ", vis.medallersSummer);

        //Mean age by medal for SUMMER
        vis.AgeByMedalSUMMER = d3.rollups(vis.medallersSummer, v => d3.mean(v, d => d.Age), d => d.Medal);
        vis.AgeByMedalSUMMER = Array.from(vis.AgeByMedalSUMMER, ([key, value]) => ({key,value}));
        console.log("Summer array = ", vis.AgeByMedalSUMMER)

        //Isolating number
        vis.goldSummer = vis.AgeByMedalSUMMER[0].value
        vis.silverSummer = vis.AgeByMedalSUMMER[2].value
        vis.bronzeSummer = vis.AgeByMedalSUMMER[1].value

        vis.goldText.text(vis.goldSummer.toFixed(1))
        vis.silverText.text(vis.silverSummer.toFixed(1))
        vis.bronzeText.text(vis.bronzeSummer.toFixed(1))

        vis.title.text("Summer")

        vis.updateVis();

    }

    maleWinter() {
        let vis = this;

        //Filter by medals by MALE WINTER
        vis.medallersMaleWinter = vis.medallers.filter(function(d){return d.Sex == "M", d.Season == "Winter";});
        console.log("Male-Winter = ", vis.medallersMaleWinter);

        //Mean age by medal for MALE WINTER
        vis.AgeByMedalMALEWINTER = d3.rollups(vis.medallersMaleWinter, v => d3.mean(v, d => d.Age), d => d.Medal);
        vis.AgeByMedalMALEWINTER = Array.from(vis.AgeByMedalMALEWINTER, ([key, value]) => ({key,value}));
        console.log("Male-Winter array = ", vis.AgeByMedalMALEWINTER)

        //Isolating number
        vis.goldMaleWinter = vis.AgeByMedalMALEWINTER[0].value
        vis.silverMaleWinter = vis.AgeByMedalMALEWINTER[2].value
        vis.bronzeMaleWinter = vis.AgeByMedalMALEWINTER[1].value

        vis.goldText.text(vis.goldMaleWinter.toFixed(1))
        vis.silverText.text(vis.silverMaleWinter.toFixed(1))
        vis.bronzeText.text(vis.bronzeMaleWinter.toFixed(1))

        vis.title.text("Male Winter")

        vis.updateVis();

    }

    maleSummer() {
        let vis = this;

        //Filter by medals by MALE SUMMER
        vis.medallersMaleSummer = vis.medallers.filter(function(d){return d.Sex == "M", d.Season == "Winter";});
        console.log("Male-Summer = ", vis.medallersMaleSummer);

        //Mean age by medal for MALE SUMMER
        vis.AgeByMedalMALESUMMER = d3.rollups(vis.medallersMaleSummer, v => d3.mean(v, d => d.Age), d => d.Medal);
        vis.AgeByMedalMALESUMMER = Array.from(vis.AgeByMedalMALESUMMER, ([key, value]) => ({key,value}));
        console.log("Male-Summer array = ", vis.AgeByMedalMALESUMMER)

        //Isolating number
        vis.goldMaleSummer = vis.AgeByMedalMALESUMMER[0].value
        vis.silverMaleSummer = vis.AgeByMedalMALESUMMER[2].value
        vis.bronzeMaleSummer = vis.AgeByMedalMALESUMMER[1].value

        vis.goldText.text(vis.goldMaleSummer.toFixed(1))
        vis.silverText.text(vis.silverMaleSummer.toFixed(1))
        vis.bronzeText.text(vis.bronzeMaleSummer.toFixed(1))

        vis.title.text("Male Summer")

        vis.updateVis();

    }

    femaleWinter() {
        let vis = this;

        //Filter by medals by FEMALE WINTER
        vis.medallersFemaleWinter = vis.medallers.filter(function(d){return d.Sex == "M", d.Season == "Winter";});
        console.log("Female-Winter = ", vis.medallersFemaleWinter);

        //Mean age by medal for FEMALE WINTER
        vis.AgeByMedalFEMALEWINTER = d3.rollups(vis.medallersMaleWinter, v => d3.mean(v, d => d.Age), d => d.Medal);
        vis.AgeByMedalFEMALEWINTER = Array.from(vis.AgeByMedalFEMALEWINTER, ([key, value]) => ({key,value}));
        console.log("Female-Winter array = ", vis.AgeByMedalFEMALEWINTER)

        //Isolating number
        vis.goldFemaleWinter = vis.AgeByMedalFEMALEWINTER[0].value
        vis.silverFemaleWinter = vis.AgeByMedalFEMALEWINTER[2].value
        vis.bronzeFemaleWinter = vis.AgeByMedalFEMALEWINTER[1].value

        vis.goldText.text(vis.goldFemaleWinter.toFixed(1))
        vis.silverText.text(vis.silverFemaleWinter.toFixed(1))
        vis.bronzeText.text(vis.bronzeFemaleWinter.toFixed(1))

        vis.title.text("Female Winter")

        vis.updateVis();

    }

    femaleSummer() {
        let vis = this;

        //Filter by medals by FEMALE SUMMER
        vis.medallersFemaleSummer = vis.medallers.filter(function(d){return d.Sex == "M", d.Season == "Winter";});
        console.log("Female-Summer = ", vis.medallersFemaleSummer);

        //Mean age by medal for MALE SUMMER
        vis.AgeByMedalFEMALESUMMER = d3.rollups(vis.medallersMaleSummer, v => d3.mean(v, d => d.Age), d => d.Medal);
        vis.AgeByMedalFEMALESUMMER = Array.from(vis.AgeByMedalFEMALESUMMER, ([key, value]) => ({key,value}));
        console.log("Female-Summer array = ", vis.AgeByMedalFEMALESUMMER)

        //Isolating number
        vis.goldFemaleSummer = vis.AgeByMedalFEMALESUMMER[0].value
        vis.silverFemaleSummer = vis.AgeByMedalFEMALESUMMER[2].value
        vis.bronzeFemaleSummer = vis.AgeByMedalFEMALESUMMER[1].value

        vis.goldText.text(vis.goldFemaleSummer.toFixed(1))
        vis.silverText.text(vis.silverFemaleSummer.toFixed(1))
        vis.bronzeText.text(vis.bronzeFemaleSummer.toFixed(1))

        vis.title.text("Female Summer")

        vis.updateVis();

    }




    updateVis() {
        let vis = this;

        var inputElems = d3.selectAll("input");
        console.log(inputElems)


    }
}