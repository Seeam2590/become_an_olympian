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

let carousel2 = $('#stateCarousel2');

// prevent rotating
carousel2.carousel({
    interval: false
})

// on button click switch view
function switchView2(){
    carousel2.carousel('next')
}

/* * * * * * * * * * * * * *
*  Graph interactivity     *
* * * * * * * * * * * * * */

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

var inputElems3 = d3.selectAll(".phys1")
inputElems3.on("change", inputChange3);

var inputElems4 = d3.selectAll(".phys2")
inputElems4.on("change", inputChange4);

function inputChange3() {
    physiqueVis.season = this.value;
    physiqueVis.wrangleData();
}

function inputChange4() {
    physiqueVis.indepVar = this.value;
    physiqueVis.wrangleData();
}



$("#box-y").on("change", function() {
    physBox.wrangleData();
});