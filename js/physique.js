
/*
 *  StationMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */
let maximumVal;
class PhysiqueVis {

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

        vis.margin = {top: 10, right: 100, bottom: 40, left: 40};
        vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $('#' + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.x = d3.scaleLinear()
            .range([0, vis.width]);

        vis.xAxis = d3.axisBottom()
            .tickFormat(d3.format("d"))
            .scale(vis.x);

        vis.xAxisGroup = vis.svg.append("g")
            .attr("class", "x-axis axis");

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)

        vis.yAxisGroup = vis.svg.append("g")
            .attr("class", "y-axis axis");

        // X-axis label
        vis.svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("y", 467)
            .attr("x", 590)
            .attr("font-size", "12px")
            .text("Year");

        // Y-axis label
        vis.ylabel = vis.svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 20)
            .attr("x", 0)
            .attr("font-size", "12px")
            .attr("transform", "rotate(-90)")

        //Tooltip for Female Data
        vis.tooltipF = d3.select("#" + vis.parentElement).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        //Tooltip for Male Data
        vis.tooltipM = d3.select("#" + vis.parentElement).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Legend labels and rectangles for Female
        vis.svg.append("rect")
            .attr("x", 500)
            .attr("y", 0)
            .attr("width", 30)
            .attr("height", 20)
            .style("stroke", '#000')
            .attr("fill", "#fde0ab");

        // Creating the text for the legend labels
        vis.svg.append("text")
            .attr("x", 498)
            .attr("y", 33)
            .attr("fill", "#000")
            .attr("font-size", "9px")
            .text("Female");

        // Legend labels and rectangles Male
        vis.svg.append("rect")
            .attr("x", 560)
            .attr("y", 0)
            .attr("width", 30)
            .attr("height", 20)
            .style("stroke", '#000')
            .attr("fill", "#b3dbed");

        // Creating the text for the legend labels
        vis.svg.append("text")
            .attr("x", 562)
            .attr("y", 33)
            .attr("fill", "#000")
            .attr("font-size", "9px")
            .text("Male");

        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;
        vis.full_olympics = [];

        // Getting the dimensions
        let selectBox = document.getElementById("line-y");
        vis.indepVar = selectBox.options[selectBox.selectedIndex].value;

        // Updating y-axis label
        if (vis.indepVar == "Height"){
            vis.ylabel.text("Height in cm");
        } else {
            vis.ylabel.text("Weight in kg");
        }

        vis.parameter = vis.indepVar;

        vis.displayData.forEach( row => {
            // and push rows with proper dates into filteredData
            row.Height = +row.Height;
            row.Weight = +row.Weight;
            vis.full_olympics.push(row);
        });
        vis.medallers = vis.full_olympics.filter(function(d){return d.Medal === "Gold" || d.Medal === "Silver" || d.Medal === "Bronze";})
        vis.medallers = vis.medallers.filter(function(d){return !isNaN(d[vis.indepVar])})

        vis.female = vis.medallers.filter(d=> d.Sex === "F")
        vis.male = vis.medallers.filter(d => d.Sex === "M")

        vis.HeightBySport = d3.rollups(vis.medallers, v => d3.mean(v, d => d[vis.indepVar]), d=>d.Sport, d=>d.Year)
        vis.HeightBySportF = d3.rollups(vis.female, v => d3.mean(v, d => d[vis.indepVar]), d=>d.Sport, d=>d.Year)
        vis.HeightBySportM= d3.rollups(vis.male, v => d3.mean(v, d => d[vis.indepVar]), d=>d.Sport, d=>d.Year)

        vis.HeightBySport = Array.from(vis.HeightBySport, ([key, value]) => ({key,value}));
        vis.HeightBySportF = Array.from(vis.HeightBySportF, ([key, value]) => ({key,value}));
        vis.HeightBySportM = Array.from(vis.HeightBySportM, ([key, value]) => ({key,value}));

        vis.HeightBySportNice = [];
        maximumVal = 0;

        vis.HeightBySport.forEach(function(row) {
            row.key = row.key;
            row.value.forEach(function(item){
                if(item[1] > maximumVal){
                    maximumVal = item[1]
                }
                return maximumVal;

            })
            row.value.forEach(function(item){
                vis.HeightBySportNice.push({
                    sport: row.key,
                    year: item[0],
                    indepVar: item[1]
                })
            })
        });

        vis.HeightBySportNiceF = [];

        vis.HeightBySportF.forEach(function(row) {

            row.value.forEach(function(item){
                vis.HeightBySportNiceF.push({
                    sport: row.key,
                    year: item[0],
                    indepVar: item[1]
                })
            })
        });

        vis.HeightBySportNiceM = [];

        vis.HeightBySportM.forEach(function(row) {
            row.value.forEach(function(item){
                vis.HeightBySportNiceM.push({
                    sport: row.key,
                    year: item[0],
                    indepVar: item[1]
                })
            })
        });

        vis.HeightBySportNice = vis.HeightBySportNice.filter(d => d.indepVar !== undefined)
        vis.HeightBySportNice = vis.HeightBySportNice.sort((a, b) => d3.ascending(+a.year, +b.year))

        vis.HeightBySportNiceF = vis.HeightBySportNiceF.filter(d => d.indepVar !== undefined)
        vis.HeightBySportNiceF = vis.HeightBySportNiceF.sort((a, b) => d3.ascending(+a.year, +b.year))

        vis.HeightBySportNiceM = vis.HeightBySportNiceM.filter(d => d.indepVar !== undefined)
        vis.HeightBySportNiceM = vis.HeightBySportNiceM.sort((a, b) => d3.ascending(+a.year, +b.year))

        vis.groupedData = Array.from(d3.group(vis.HeightBySportNice, d=>d.sport), ([key, value]) => ({key, value}));
        vis.groupedDataF = Array.from(d3.group(vis.HeightBySportNiceF, d=>d.sport), ([key, value]) => ({key, value}));
        vis.groupedDataM = Array.from(d3.group(vis.HeightBySportNiceM, d=>d.sport), ([key, value]) => ({key, value}));

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.selectValue = document.getElementById("selectorBox").value;
        vis.filteredDataF = vis.groupedDataF.filter(function(d){return d.key === vis.selectValue} );
        vis.circleDataF = vis.HeightBySportNiceF.filter(function(d){return d.sport === vis.selectValue});
        vis.filteredDataM = vis.groupedDataM.filter(function(d){return d.key === vis.selectValue} );
        vis.circleDataM = vis.HeightBySportNiceM.filter(function(d){return d.sport === vis.selectValue})


        vis.x.domain([d3.min(vis.HeightBySportNice, d=>+d.year) - 5, d3.max(vis.HeightBySportNice, d=>+d.year)+ 10])
        vis.y.domain([0, maximumVal + 20])

        // Update axis
        vis.svg.select(".x-axis")
            .attr("transform", "translate(0," + vis.height +  ")")
            .call(vis.xAxis);

        vis.svg.select(".y-axis")
            .transition()
            .duration(500)
            .call(vis.yAxis);

        vis.linesF = vis.svg.selectAll(".lineF")
            .data(vis.filteredDataF)
        vis.linesF.enter()
            .append("path")
            .attr("class", "lineF")
            .merge(vis.linesF)
            .transition()
            .duration(500)
            .attr("fill", "none")
            .attr("stroke", "#fde0ab")
            .attr("stroke-width", 2)
            .attr("d", function(d){
                return d3.line()
                    .x(function(d) { return vis.x(+d.year); })
                    .y(function(d) { return vis.y(+d.indepVar); })
                    (d.value)
            })

        vis.linesM = vis.svg.selectAll(".lineM")
            .data(vis.filteredDataM)
        vis.linesM.enter()
            .append("path")
            .attr("class", "lineM")
            .merge(vis.linesM)
            .transition()
            .duration(500)
            .attr("fill", "none")
            .attr("stroke", "#b3dbed")
            .attr("stroke-width", 2)
            .attr("d", function(d){
                return d3.line()
                    .x(function(d) { return vis.x(+d.year); })
                    .y(function(d) { return vis.y(+d.indepVar); })
                    (d.value)
            })

        vis.circlesF = vis.svg.selectAll(".circleF")
            .data(vis.circleDataF)
        vis.circlesF.enter()
            .append("circle")
            .attr("class", "circleF")
            .on("mouseover", function(event, d){
                d3.select(this)
                    .attr('stroke-width', '2px')
                vis.tipMouseoverF(event, d);
            })
            .on("mouseout", function(){
                d3.select(this)
                    .attr('stroke-width', '0.5px')
                vis.tipMouseoutF();
            })
            .merge(vis.circlesF)
            .transition()
            .duration(500)
            .attr("cx", d=>vis.x(+d.year))
            .attr("cy", d=>vis.y(d.indepVar))
            .attr("r", 5)
            .attr("fill", "#fde0ab");

        vis.circlesM = vis.svg.selectAll(".circleM")
            .data(vis.circleDataM)
        vis.circlesM.enter()
            .append("circle")
            .attr("class", "circleM")
            .on("mouseover", function(event, d){
                d3.select(this)
                    .attr('stroke-width', '2px')
                vis.tipMouseoverM(event, d);
            })
            .on("mouseout", function(){
                d3.select(this)
                    .attr('stroke-width', '0.5px')
                vis.tipMouseoutM();
            })
            .merge(vis.circlesM)
            .transition()
            .duration(500)
            .attr("cx", d=>vis.x(+d.year))
            .attr("cy", d=>vis.y(+d.indepVar))
            .attr("r", 5)
            .attr("fill", "#b3dbed");



        vis.linesF.exit().remove();
        vis.linesM.exit().remove();
        vis.circlesF.exit().remove();
        vis.circlesM.exit().remove();



        vis.svg.select(".y-axis")
            .transition()
            .duration(500)
            .call(vis.yAxis);

        vis.svg.select(".x-axis")
            .transition()
            .duration(500)
            .call(vis.xAxis);





    }
    tipMouseoverF(event, d) {
        // To make the tooltip easier to read
        let vis = this;

        if (vis.parameter == "Weight"){vis.unit = "kg"} else {vis.unit = "cm"}

        vis.tooltipF.html(`
         <div style="border: thin solid grey; border-radius: 5px; background: white; width: 250px">
             <h5><bold>${d.year}</bold></h5>
             <p>Average ${vis.parameter}: ${+d.indepVar.toFixed(2)} ${vis.unit}</p>
             <p>Sport: ${d.sport}</p>
             <p>Sex: Female</p>
         </div>`
        )
            .style("left", 45 + "px")
            .style("top", vis.height - 135 + "px")
            .style("text-align", "center")
            .transition()
            .duration(300) // ms
            .style("opacity", 0.9)

    };

    // tooltip mouseout event handler
    tipMouseoutF() {
        let vis = this;

        vis.tooltipF.transition()
            .duration(300) // ms
            .style("opacity", 0); // don't care about position!
    };
    tipMouseoverM(event, d) {
        // To make the tooltip easier to read
        let vis = this;
        vis.tooltipM.html(`
         <div style="border: thin solid grey; border-radius: 5px; background: white; width: 250px">
             <h5><bold>${d.year}</bold></h5>
             <p>Average ${vis.parameter}: ${+d.indepVar.toFixed(2)} cm</p>
             <p>Sport: ${d.sport}</p>
             <p>Sex: Male</p>
            
         </div>`
        )
            .style("left", 45  + "px")
            .style("top", vis.height - 135  + "px")
            .style("text-align", "center")
            .transition()
            .duration(300) // ms
            .style("opacity", 0.9)

    };

    // tooltip mouseout event handler
    tipMouseoutM() {
        let vis = this;

        vis.tooltipM.transition()
            .duration(300) // ms
            .style("opacity", 0); // don't care about position!
    };
}

