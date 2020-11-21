
/*
 *  UsaScatterViz - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 */

class UsaScatterViz {

    /*
     *  Constructor method
     */
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.initVis();
    }


    /*
     *  Initialize scatter plot
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

        // Add X axis
        vis.x = d3.scaleLinear()
            .range([ 0, vis.width ])
            .domain([-1000, 18000]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.xAxisGroup = vis.svg.append("g")
            .attr("class", "x-axis axis");

        // Drawing the X-axis
        vis.svg.select(".x-axis")
            .attr("transform", "translate(0," + vis.height +  ")")
            .call(vis.xAxis);

        // X-axis label
        vis.svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("y", 470)
            .attr("x", 580)
            .attr("font-size", "12px")
            .text("Total Olympians");

        // Add Y axis
        vis.y = d3.scaleLinear()
            .range([ vis.height, 0])
            .domain([-500, 6000]);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            .tickValues([0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000]);

        vis.yAxisGroup = vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.svg.select(".y-axis")
            .call(vis.yAxis);

        // Y-axis label
        vis.svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 20)
            .attr("x", 0)
            .attr("font-size", "12px")
            .attr("transform", "rotate(-90)")
            .text("Total Medals");

        // append tooltip
        vis.tooltip = d3.select("#" + vis.parentElement).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Add a scale for bubble size
        vis.z = d3.scaleLinear()
            .range([ 3, 27]);

        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;

        // Update the visualization
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // Choosing value from form
        let selectBox = document.getElementById("scatter-x");
        let selectedValue = selectBox.options[selectBox.selectedIndex].value;

        // Setting the domains for different possibilities
        vis.z.domain(d3.extent(vis.data, function(d) { return d[selectedValue]; }))

        // Add dots
        vis.dots = vis.svg
            .selectAll("circle")
            .data(vis.data)

        vis.dots
            .enter()
            .append("circle")
            .attr("stroke", "black")
            .attr('stroke-width', '0.5px')
            .on("mouseover", function(event, d){
                d3.select(this)
                    .attr('stroke-width', '2px')
                vis.tipMouseover(event, d);
            })
            .on("mouseout", function(){
                d3.select(this)
                    .attr('stroke-width', '0.5px')
                vis.tipMouseout();
            })
            .merge(vis.dots)
            .transition()
            .duration(800)
            .attr("cx", function (d) { return vis.x(d.athletes); } )
            .attr("cy", function (d) { return vis.y(d.total); } )
            .attr("r", function (d) { return vis.z(d[selectedValue]); } )
            .style("fill", "#69b3a2")
            .style("opacity", "0.7")

        // Exit
        vis.dots.exit().remove();
    }
    // tooltip mouseover event handler
    tipMouseover(event, d) {
        // To make the tooltip easier to read
        let vis = this;
        let gdp = parseFloat(d.gdp_per_capita).toFixed(2)
        vis.tooltip.html(`
         <div style="border: thin solid grey; border-radius: 5px; background: white; width: 250px">
             <h5><bold>${d.country}</bold></h5>
             <h6>Medals: ${d.total}</h6>
             <h6>Population: ${(d.population / 1000000).toFixed(2)}M</h6>
             <h6>GDP/Capita in USD: ${gdp}</h6>
             <h6>Olympians: ${d.athletes}</h6>
         </div>`
        )
            .style("left", 445 + "px")
            .style("top", 150 + "px")
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

