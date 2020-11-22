
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

        vis.margin = {top: 20, right: 20, bottom: 40, left: 30};
        vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $('#' + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .append("g")
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);




        vis.x = d3.scaleLinear()
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);






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
        console.log(vis.medallers)
        vis.HeightBySport= d3.rollups(vis.medallers, v => d3.mean(v, d => d.Height), d=>d.Sport, d=>d.Year)
        console.log("rolledup", vis.HeightBySport)
        vis.HeightBySport = Array.from(vis.HeightBySport, ([key, value]) => ({key,value}));
        console.log("unrolled", vis.HeightBySport)
        vis.HeightBySportNice = [];
        maximumHeight = 0;
        console.log("Height by Sport", vis.HeightBySport)
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

        vis.HeightBySportNice = vis.HeightBySportNice.filter(d => d.height !== undefined)
        vis.HeightBySportNice = vis.HeightBySportNice.sort((a, b) => d3.ascending(+a.year, +b.year))
        console.log("nice", vis.HeightBySportNice)
        vis.colorDomain = [];
        vis.HeightBySportNice.forEach(row =>
            vis.colorDomain.push(row.sport)
        )


        // vis.colorDomain = d3.map(vis.HeightBySportNice, function(d){return d.sport;}).keys()
        // console.log(vis.colorDomain);

        vis.groupedData = Array.from(d3.group(vis.HeightBySportNice, d=>d.sport), ([key, value]) => ({key, value}));


        console.log("grouped", vis.groupedData);

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

        vis.filteredData = [];
        d3.select("#sportSelector")
            .on("change", function() {
                vis.selectValue = document.getElementById("sportSelector").value;
                vis.filteredData = vis.groupedData.filter(function(d){return d.key === vis.selectValue} );
                vis.updateVis();
            });



        //console.log(document.getElementById("selectorBox"));



        vis.updateVis();
    }

    updateVis() {
        let vis = this;
        //console.log(d3.min(vis.HeightBySportNice, d=>+ d.year))




        vis.x.domain([d3.min(vis.HeightBySportNice, d=>+d.year) - 4, d3.max(vis.HeightBySportNice, d=>+d.year)+ 4])
        vis.y.domain([0, maximumHeight + 20])

        vis.svg.selectAll(".line")
            .data(vis.filteredData)
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 1.5)
            .attr("d", function(d){
                return d3.line()
                    .x(function(d) { return vis.x(+d.year); })
                    .y(function(d) { return vis.y(+d.height); })
                    (d.value)
            })

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "y-axis axis")
            .attr("transform", `translate (${vis.margin.left}, ${vis.margin.top})`);






        vis.svg.select(".y-axis").call(vis.yAxis);
        vis.svg.select(".x-axis").call(vis.xAxis);






    }
}

