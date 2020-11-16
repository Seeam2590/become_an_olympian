
/*
 *  usaViz - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 */

class UsaViz {

    /*
     *  Constructor method
     */
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.initVis();
    }


    /*
     *  Initialize station map
     */
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

        // append tooltip
        vis.tooltip = d3.select("#" + vis.parentElement).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;

        vis.data.forEach(function (d) {
            d.Bronze = +d.Bronze;
            d.Silver = +d.Silver;
            d.Gold = +d.Gold;
            d.total = d.Bronze + d.Silver + d.Gold;

        });

        vis.displayData = vis.data.sort((a, b) => b.total - a.total).slice(0, 10);
        vis.displayData = vis.displayData.sort((a, b) => a.total - b.total);
        console.log(vis.displayData)

        // Update the visualization
        vis.updateVis();
    }

    updateVis() {
        let vis = this;
        vis.x.domain([0, d3.max(vis.displayData, d => d.total)]);
        vis.y.domain(vis.displayData.map(d => d.country));

        // Create and update rectangles
        vis.gold = vis.svg.selectAll("rect")
            .data(vis.displayData);

        vis.silver = vis.svg.selectAll("rect")
            .data(vis.displayData);

        vis.bronze = vis.svg.selectAll("rect")
            .data(vis.displayData);

        vis.text = vis.svg.selectAll(".text")
            .data(vis.displayData);

        vis.gold
            .enter()
            .append("rect")
            .attr("class", "gold-bar")
            .attr("fill", "#af9500")
            .on("mouseover", function(event, d){
                vis.tipMouseover(event, d);
            })
            .on("mouseout", function(){
                vis.tipMouseout();
            })
            .merge(vis.gold)
            .transition()
            .duration(300)
            .attr("x", 2)
            .attr("y", d => vis.y(d.country))
            .attr("width", d => vis.x(d.total))
            .attr("height", vis.y.bandwidth());

        vis.gold.exit().remove();

        vis.silver
            .enter()
            .append("rect")
            .attr("class", "silver-bar")
            .attr("fill", "#d7d7d7")
            .on("mouseover", function(event, d){
                vis.tipMouseover(event, d);
            })
            .on("mouseout", function(){
                vis.tipMouseout();
            })
            .merge(vis.silver)
            .transition()
            .duration(300)
            .attr("x", 2)
            .attr("y", d => vis.y(d.country))
            .attr("width", d => vis.x(d.total - d.Gold))
            .attr("height", vis.y.bandwidth())

        vis.silver.exit().remove();

        vis.bronze
            .enter()
            .append("rect")
            .attr("class", "bronze-bar")
            .attr("fill", "#6a3805")
            .on("mouseover", function(event, d){
                vis.tipMouseover(event, d);
            })
            .on("mouseout", function(){
                vis.tipMouseout();
            })
            .merge(vis.bronze)
            .transition()
            .duration(300)
            .attr("x", 2)
            .attr("y", d => vis.y(d.country))
            .attr("width", d => vis.x(d.total - d.Gold - d.Silver))
            .attr("height", vis.y.bandwidth())

        vis.bronze.exit().remove();

        vis.text
            .enter()
            .append("text")
            .attr("class", "text")
            .attr("fill", "#292929")
            .merge(vis.text)
            .transition()
            .duration(300)
            .attr("y", d => vis.y(d.country) + 15)
            .attr("x", d => vis.x(d.total) + 5)
            .attr("font-size", 10)
            .text( function (d) { return d.total })

        vis.text.exit().remove();

        // Update the y-axis
        vis.svg.select(".y-axis").transition().duration(600).call(vis.yAxis);
    }
    // tooltip mouseover event handler
    tipMouseover(event, d) {
        // To make the tooltip easier to read
        let vis = this;

        vis.tooltip.html(`
         <div style="border: thin solid grey; border-radius: 5px; background: white; width: 200px">
             <h5><bold>${d.country}</bold></h5>
             <h6>Gold: ${d.Gold}</h6>
             <h6>Silver: ${d.Silver}</h6>
             <h6>Bronze: ${d.Bronze}</h6>
         </div>`
        )
            .style("left", 445 + "px")
            .style("top", (0.7*(vis.y(d.country)) + 70) + "px")
            .style("text-align", "center")
            .transition()
            .duration(300) // ms
            .style("opacity", 0.9)

    };

    // tooltip mouseout event handler
    tipMouseout() {
        let vis = this;

        vis.tooltip.transition()
            .duration(300) // ms
            .style("opacity", 0); // don't care about position!
    };
}

