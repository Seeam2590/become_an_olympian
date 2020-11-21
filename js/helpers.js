/* * * * * * * * * * * * * *
*         Carousel         *
* * * * * * * * * * * * * */

// define carousel behaviour
let carousel = $('#stateCarousel');

// prevent rotating
carousel.carousel({
    interval: false
})

// on button click switch view
function switchView(){
    carousel.carousel('next')
}

// Interactive scatter plot
$("#scatter-x").on("change", function() {
    usaScatterViz.updateVis();
});

$("#top-choice").on("change", function() {
    usaViz.updateVis();
});

// For age vis
var inputElems1 = d3.selectAll(".age1")
inputElems1.on("change", inputChange1);

var inputElems2 = d3.selectAll(".age2")
inputElems2.on("change", inputChange2);

function inputChange1() {
    ageViz.sex = this.value;
    ageViz.wrangleData();
}

function inputChange2() {
    ageViz.season = this.value;
    ageViz.wrangleData();
}