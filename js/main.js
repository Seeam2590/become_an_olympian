// Variable for the visualization instance
let usaViz;
let physiqueVis;
let usaMapViz;

// Paths to data
let url1 = 'data/athlete_events.csv';
let url2 = 'data/athletes.csv';
let url3 = 'data/countries.csv';
let url4 = 'data/country_extended.csv';
let url5 = 'data/events.csv';
let url6 = 'data/noc_regions.csv';


Promise.all([
    d3.csv(url1),
    d3.csv(url2),
    d3.csv(url3),
    d3.csv(url4),
    d3.csv(url5),
    d3.csv(url6),
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
]).then(gettingStarted)


// function that gets called once data has been fetched.
// We're handing over the fetched data to this function.
// From the data, we're creating the final data structure we need and create a new instance of the StationMap
function gettingStarted(data) {
    let [athlete_events, athletes, countries, country_extended, events, noc_regions, world] = data;
    console.log(athlete_events)


    // log data for checking
    // console.log(country_extended);

    // Instantiate visualization object
    usaViz = new UsaViz("usaViz", country_extended);
    physiqueVis = new PhysiqueVis("physiqueVis", athlete_events);
    ageViz = new AgeViz("ageViz", athlete_events);
    usaMapViz = new UsaMapViz("usaMapViz", world);
}
