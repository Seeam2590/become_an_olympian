
/*
 *  StationMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */
let maximumHeight;
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

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height);




        vis.x = d3.scaleLinear()
            .range([0, vis.width-40]);

        vis.y = d3.scaleLinear()
            .range([vis.height-30, 0]);






        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;

        //let parseDate = d3.timeParse("%Y");

        vis.full_olympics = [];

        vis.displayData.forEach( row => {
            // and push rows with proper dates into filteredData
            row.Height = +row.Height;
            vis.full_olympics.push(row);
        });
        vis.medallers = vis.full_olympics.filter(function(d){return d.Medal === "Gold" || d.Medal === "Silver" || d.Medal === "Bronze";})
        vis.medallers = vis.medallers.filter(d=> d.Season === "Summer" && !isNaN(d.Height))


        vis.female = vis.medallers.filter(d=> d.Sex === "F")
        vis.male = vis.medallers.filter(d => d.Sex === "M")

        vis.HeightBySport = d3.rollups(vis.medallers, v => d3.mean(v, d => d.Height), d=>d.Sport, d=>d.Year)
        vis.HeightBySportF = d3.rollups(vis.female, v => d3.mean(v, d => d.Height), d=>d.Sport, d=>d.Year)
        vis.HeightBySportM= d3.rollups(vis.male, v => d3.mean(v, d => d.Height), d=>d.Sport, d=>d.Year)

        vis.HeightBySport = Array.from(vis.HeightBySport, ([key, value]) => ({key,value}));
        vis.HeightBySportF = Array.from(vis.HeightBySportF, ([key, value]) => ({key,value}));
        vis.HeightBySportM = Array.from(vis.HeightBySportM, ([key, value]) => ({key,value}));

        vis.HeightBySportNice = [];
        maximumHeight = 0;

        vis.HeightBySport.forEach(function(row) {
            row.key = row.key;
            row.value.forEach(function(item){
                if(item[1] > maximumHeight){
                    maximumHeight = item[1]
                }
                return maximumHeight;

            })
            row.value.forEach(function(item){
                vis.HeightBySportNice.push({
                    sport: row.key,
                    year: item[0],
                    height: item[1]
                })
            })
        });

        vis.HeightBySportNiceF = [];

        vis.HeightBySportF.forEach(function(row) {

            row.value.forEach(function(item){
                vis.HeightBySportNiceF.push({
                    sport: row.key,
                    year: item[0],
                    height: item[1]
                })
            })
        });

        vis.HeightBySportNiceM = [];

        vis.HeightBySportM.forEach(function(row) {
            row.value.forEach(function(item){
                vis.HeightBySportNiceM.push({
                    sport: row.key,
                    year: item[0],
                    height: item[1]
                })
            })
        });

        vis.HeightBySportNice = vis.HeightBySportNice.filter(d => d.height !== undefined)
        vis.HeightBySportNice = vis.HeightBySportNice.sort((a, b) => d3.ascending(+a.year, +b.year))

        vis.HeightBySportNiceF = vis.HeightBySportNiceF.filter(d => d.height !== undefined)
        vis.HeightBySportNiceF = vis.HeightBySportNiceF.sort((a, b) => d3.ascending(+a.year, +b.year))

        vis.HeightBySportNiceM = vis.HeightBySportNiceM.filter(d => d.height !== undefined)
        vis.HeightBySportNiceM = vis.HeightBySportNiceM.sort((a, b) => d3.ascending(+a.year, +b.year))

        vis.groupedData = Array.from(d3.group(vis.HeightBySportNice, d=>d.sport), ([key, value]) => ({key, value}));
        vis.groupedDataF = Array.from(d3.group(vis.HeightBySportNiceF, d=>d.sport), ([key, value]) => ({key, value}));
        vis.groupedDataM = Array.from(d3.group(vis.HeightBySportNiceM, d=>d.sport), ([key, value]) => ({key, value}));



        vis.selector = d3.select("#selectorBox")
            .append("select")
            .attr("id", "sportSelector")
            .selectAll("option")
            .data(vis.groupedData)
            .enter().append("option")
            .text(function(d) { return d.key; })
            .attr("value", function (d) {
                return d.key;
            });

        vis.filteredDataF = vis.groupedDataF.filter(function(d){return d.key === "Gymnastics"} );
        vis.filteredDataM = vis.groupedDataM.filter(function(d){return d.key === "Gymnastics"} );
        vis.circleDataF = vis.HeightBySportNiceF.filter(function(d){return d.sport === "Gymnastics"})
        vis.circleDataM = vis.HeightBySportNiceM.filter(function(d){return d.sport === "Gymnastics"})
        d3.select("#sportSelector")
            .on("change", function() {
                vis.selectValue = document.getElementById("sportSelector").value;
                vis.filteredDataF = vis.groupedDataF.filter(function(d){return d.key === vis.selectValue} );
                console.log(vis.filteredDataF)
                vis.circleDataF = vis.HeightBySportNiceF.filter(function(d){return d.sport === vis.selectValue});
                console.log(vis.circleDataF)
                vis.filteredDataM = vis.groupedDataM.filter(function(d){return d.key === vis.selectValue} );
                console.log(vis.filteredDataM)
                vis.circleDataM = vis.HeightBySportNiceM.filter(function(d){return d.sport === vis.selectValue})
                console.log(vis.circleDataM)
                vis.updateVis();
            });

        vis.updateVis();
    }

    updateVis() {
        let vis = this;
        vis.x.domain([d3.min(vis.HeightBySportNice, d=>+d.year) - 4, d3.max(vis.HeightBySportNice, d=>+d.year)+ 10])
        vis.y.domain([0, maximumHeight + 20])

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .tickFormat(d3.format("d"));

        vis.xTranslate = vis.height - 20;

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate("+ vis.margin.left +  "," + vis.xTranslate +")");

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "y-axis axis")
            .attr("transform", `translate (${vis.margin.left}, ${vis.margin.top})`);

        // vis.linesF = vis.svg.selectAll(".lineF")
        //     .data(vis.filteredDataF)
        //     .attr("transform", `translate (${vis.margin.left}, ${vis.margin.top})`);
        // vis.linesF.enter()
        //     .append("path")
        //     .attr("class", "lineF")
        //     .merge(vis.linesF)
        //     .attr("fill", "none")
        //     .attr("stroke", "black")
        //     .attr("stroke-width", 2)
        //     .attr("d", function(d){
        //         return d3.line()
        //             .x(function(d) { return vis.x(+d.year); })
        //             .y(function(d) { return vis.y(+d.height); })
        //             (d.value)
        //     })

        vis.linesM = vis.svg.selectAll(".lineM")
            .data(vis.filteredDataM)
            .attr("transform", `translate (${vis.margin.left}, ${vis.margin.top})`);
        vis.linesM.enter()
            .append("path")
            .attr("class", "lineM")
            .merge(vis.linesM)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("d", function(d){
                return d3.line()
                    .x(function(d) { return vis.x(+d.year); })
                    .y(function(d) { return vis.y(+d.height); })
                    (d.value)
            })

        // vis.circlesF = vis.svg.selectAll("circle")
        //     .data(vis.circleDataF)
        //     .attr("transform", `translate (${vis.margin.left}, ${vis.margin.top})`);
        // vis.circlesF.enter()
        //     .append("circle")
        //     .merge(vis.circlesF)
        //     .attr("cx", d=>vis.x(+d.year))
        //     .attr("cy", d=>vis.y(d.height))
        //     .attr("r", 5);

        vis.circlesM = vis.svg.selectAll("circle")
            .data(vis.circleDataM)
            .attr("transform", `translate (${vis.margin.left}, ${vis.margin.top})`);
        vis.circlesM.enter()
            .append("circle")
            .merge(vis.circlesM)
            .attr("cx", d=>vis.x(+d.year))
            .attr("cy", d=>vis.y(d.height))
            .attr("r", 5);



        //vis.linesF.exit().remove();
        vis.linesM.exit().remove();
        //vis.circlesF.exit().remove();
        vis.circlesM.exit().remove();



        vis.svg.select(".y-axis").call(vis.yAxis);
        vis.svg.select(".x-axis").call(vis.xAxis);
    }
}

