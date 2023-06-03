// Define data
var data = new Array(20).fill(0);

// Create SVG object
var svg = d3.select("#progress-bar");

// Create circles
var circles = svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("cx", function(d, i) {
        return 30 + i * 30;
    })
    .attr("cy", 50)
    .attr("r", 10);

var intervalId;

// Define update function
function update() {
    var index = 0;
    intervalId = setInterval(function() {
        if (index < data.length) {
            svg.select("circle:nth-child(" + (index + 1) + ")")
                .attr("class", "circle green");
            index++;
        } else {
            clearInterval(intervalId);
        }
    }, 1000);
}

function stop(){
    clearInterval(intervalId)
}

// Tie update function to button click event
d3.select("#start").on("click", update);

d3.select("#stop").on("click", stop)