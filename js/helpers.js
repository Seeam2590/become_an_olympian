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

function switchView3(){
    carousel.carousel('prev')
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

function switchView4(){
    carousel2.carousel('prev')
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

$("#selectorBox").on("change", function() {
    physiqueVis.updateVis();
});

$("#line-y").on("change", function() {
    physiqueVis.wrangleData();
});

$("#box-y").on("change", function() {
    physBox.wrangleData();
});

$("#box-sport").on("change", function() {
    physBox.wrangleData();
});

// Button for the physique line plot key insights
i = 0;
function pickOutput() {
    let insights = ["Bobsleigh has the greatest variance in weight, an astonishing 75 kg. These values, however, are skewed due to the low number of competitors with recorded weights in early years of the event. In general, Men’s Bobsleigh competitors weigh on average 91.94 kg, which makes them the fourth heaviest athletes on average (behind Basketball, Tug-Of-War, and Rugby Sevens). This is because additional weight tends to make the bobsleds move at a greater speed, the goal of the event.",
        "Women’s Alpine Skiing has the greatest variation in weight among women’s sports (18.20 kg). This is due to early trends in the sport, and in recent years, the average weight has settled at around 64 kg, putting it at the sport with the 17th highest weight.",
        "Women’s fencing has the greatest variability in height, 21.33 cm. Again this is largely due to a dearth of data points in early years of the sport. Taking the entire time interval from 1924 to 2016, Women’s Fencing has the 18th highest height average, 169.93 cm.",
        "Men’s hockey has the greatest difference in maximum versus minimum height of 31.00 cm. Men’s Hockey has the 36th greatest average height, putting it right at the middle of the road among sports. However, we might see general downward trends in hockey players’ height and weight as the game moves away from physicality due to the high number of injuries.",
        "Women’s height and weight tend to have less variability in height and weight, but that may be due to a shorter recorded history of women’s participation in the sport. As such, trends in women’s physique may become clearer in the coming decades.",
        "While the average height about Men’s Alpine Skiing athletes has remained relatively constant, average weights seems to be trending upward.",
        "The height and weight of Athletics athletes has remained almost astonishingly constant among both males and females. Breaking into this sport obviously requires a very particular physique.",
        "Basketball athletes are, unsurprisingly, the tallest athletes on average. They also have the highest average weight among male athletes and are the 3rd heaviest athletes on average among females.",
        "Again, unsurprisingly, Gymnastics athletes (both male and female) are the shortest and lightest athletes to attend the Olympic Games on average.",
        "Swimmers tend to have a relatively linear upward trend in height over the past 50 years. Height seems to be a desirable attribute for swimmers in recent games. Michael Phelps, who is considered to be one of the most successful swimmers of all time is 193 cm tall."]
    let randinsights = insights[i]

    if(i == 9){
       i=0;
    }
    else{i++;}

    $("#modalText").html(`<p>${randinsights}</p>`)
}

function pickOutput2(){
    let insight = "# Sport: Gold + Silver + Bronze = Total<br>" +
        " 1. Athletics: 335 + 260 + 207 = 802<br>" +
        " 2. Swimming: 246 + 172 + 135 = 553<br>" +
        " 3. Wrestling: 54 + 43 + 36 = 133<br>" +
        " 4. Shooting: 54 + 29 + 27 = 110<br>" +
        " 5. Boxing: 50 + 24 + 40 = 114"

    $("#modalText2").html(`<p>${insight}</p>`)
}