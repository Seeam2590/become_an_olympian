
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

        vis.margin = {top: 20, right: 20, bottom: 40, left: 100};
        vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $('#' + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
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
        vis.medallers = vis.full_olympics.filter(function(d){return d.Medal == "Gold" || d.Medal == "Silver" || d.Medal == "Bronze";})
        console.log(vis.medallers)
        vis.HeightBySport = d3.rollups(vis.medallers, v => d3.mean(v, d => d.Height), d=>d.Year, d => d.Sport)

        vis.HeightBySport = Array.from(vis.HeightBySport, ([key, value]) => ({key,value}));
        vis.HeightBySportNice = [];
        maximumHeight = 0;
        console.log(vis.HeightBySport)
        vis.HeightBySport.forEach(function(row) {
            row.key = +row.key
            row.value.forEach(function(item){
                if(item[1] > maximumHeight){
                    maximumHeight = item[1]
                }
                return maximumHeight;

            })
            row.value.forEach(function(item){
                vis.HeightBySportNice.push({
                    year: row.key,
                    sport: item[0],
                    height: item[1]
                })
            })




        });

        vis.HeightBySportNice = vis.HeightBySportNice.filter(d => d.height !== undefined)
        console.log("nice", vis.HeightBySportNice)
        vis.colorDomain = [];
        vis.HeightBySportNice.forEach(row =>
            vis.colorDomain.push(row.sport)
        )
        vis.colorDomain = d3.map(vis.HeightBySportNice, function(d){return d.sport;}).keys()
        console.log(vis.colorDomain);


        vis.updateVis();
    }

    updateVis() {
        let vis = this;
        console.log(d3.min(vis.HeightBySportNice, d=> d.year))
        vis.x.domain([d3.min(vis.HeightBySportNice, d=>d.year) - 4, d3.max(vis.HeightBySportNice, d=>d.year)+ 4])
        vis.y.domain([0, maximumHeight + 20])

        vis.svg.selectAll("circle").data(vis.HeightBySportNice)
            .enter()
            .append("circle")
            .attr("cx", d => vis.x(d.year))
            .attr("cy", d=> vis.y(d.height))
            .attr("r", 5)
            .attr("fill", d=> d.sport);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.svg.append("g")
            .attr("class", "x-axis axis");
        //.attr("transform", "translate(0," + vis.height + ")");

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "y-axis axis");



        vis.svg.select(".y-axis").call(vis.yAxis);
        vis.svg.select(".x-axis").call(vis.xAxis);
    }
}

