
/*
 *  UsaMapViz - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 */

class UsaMapViz {

    /*
     *  Constructor method
     */
    constructor(parentElement, geo, data) {
        this.parentElement = parentElement;
        this.worldGeo = geo;
        this.data = data;
        this.initVis();
    }


    /*
     *  Initialize station map
     */
    initVis () {
        let vis = this;
        vis.margin = {top: 10, right: 150, bottom: 40, left: 0};

        vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $('#' + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;


        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Getting the projection
        vis.projection = d3.geoNaturalEarth()
            .scale(vis.width / 1.3 / Math.PI)
            .translate([vis.width / 2, vis.height / 2])

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
            d.athletes = +d.athletes;
        });

        vis.maxAthletes = vis.data.reduce((a,b)=>a.athletes>b.athletes?a:b).athletes;

        // Color scale
        vis.color = d3.scaleSequential(d3.interpolateGreens)
            .domain([0, vis.maxAthletes]);

        vis.worldGeo.features.forEach(function (d) {
            var info = vis.data.filter(e => e.code == d.id);
            if(info.length > 0) {
                d.color = vis.color(info[0].athletes)
                d.athletes = info[0].athletes
                d.country = info[0].country
            } else {
                d.color = "#fff";
                d.athletes = 0;
                d.country = d.id
            }
        });

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // Draw the map
        vis.svg.append("g")
            .selectAll("path")
            .data(vis.worldGeo.features)
            .enter().append("path")
            .on("mouseover", function(event, d){
                vis.tipMouseover(event, d);
            })
            .on("mouseout", function(){
                vis.tipMouseout();
            })
            .attr("fill", d => { return d.color})
            .attr("d", d3.geoPath()
                .projection(vis.projection)
            )
            .style("stroke", "#000")
    }

    // tooltip mouseover event handler
    tipMouseover(event, d) {
        // To make the tooltip easier to read
        let vis = this;
        vis.tooltip.html(`
         <div style="border: thin solid grey; border-radius: 5px; background: white; width: 200px">
             <h5>${d.country}</h5>
             <h6>Olympic Athletes: ${d.athletes}</h6>
         </div>`
        )
            .style("left", event.pageX - 200 + "px")
            .style("top", 100 + "px")
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

