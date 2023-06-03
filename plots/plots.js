const plotNames = ['Start:C/Measure:L', 'Start:CR/Measure:L', 'Start:R/Measure:L',
    'User:C/Measure:L', 'User:CR/Measure:L', 'User:R/Measure:L',
    'Start:C/Measure:CL', 'Start:CR/Measure:CL', 'Start:R/Measure:CL',
    'User:C/Measure:CL', 'User:CR/Measure:CL', 'User:R/Measure:CL',
    'Start:C/Measure:C', 'Start:CR/Measure:C', 'Start:R/Measure:C',
    'User:C/Measure:C', 'User:CR/Measure:C', 'User:R/Measure:C',
    'Start:C/Measure:CR', 'Start:CR/Measure:CR', 'Start:R/Measure:CR',
    'User:C/Measure:CR', 'User:CR/Measure:CR', 'User:R/Measure:CR',
    'Start:C/Measure:R', 'Start:CR/Measure:R', 'Start:R/Measure:R',
    'User:C/Measure:R', 'User:CR/Measure:R', 'User:R/Measure:R']

function createAxis(id) {
    // Set up the SVG element
    const margin = { top: 10, right: 10, bottom: 20, left: 50 };
    const width = 200 - margin.left - margin.right;
    const height = 150 - margin.top - margin.bottom;

    // Define the scales
    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // Create the axes
    const xAxis = d3.axisBottom(x).ticks(0)
    const yAxis = d3.axisLeft(y).ticks(0)

    const svg = d3
        .select(`#${id}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", `svg-${id}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)

    svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

    // Add the y-axis
    svg.append("g").call(yAxis);
}

function createPlot(id, plotName, data) {
    // Set up the SVG element
    const margin = { top: 10, right: 10, bottom: 20, left: 50 };
    const width = 200 - margin.left - margin.right;
    const height = 150 - margin.top - margin.bottom;

    // Define the scales
    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // Create the axes
    const xAxis = d3.axisBottom(x).ticks(11);
    const yAxis = d3.axisLeft(y).tickFormat(d => (d * 100).toFixed(2)).ticks(5);

    // Define the line generator
    const line = d3
        .line()
        .x((d) => x(d.Iteration))
        .y((d) => y(d.Value));

    const svg = d3
        .select(`.svg-${id}`)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // ... rest of the code
    // Filter the data
    const recommendationData = data.filter(
        (d) => d.Plot === plotName && d.Line === "recommendation"
    );
    const choiceData = data.filter(
        (d) => d.Plot === plotName && d.Line === "choice"
    );

    // Set the domain for the scales
    x.domain(d3.extent(recommendationData, (d) => +d.Iteration));
    const yMin = Math.min(
        d3.min(recommendationData, (d) => +d.Value),
        d3.min(choiceData, (d) => +d.Value)
    );
    const yMax = Math.max(
        d3.max(recommendationData, (d) => +d.Value),
        d3.max(choiceData, (d) => +d.Value)
    );
    y.domain([yMin, yMax]);

    // Add the x-axis
    svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .transition()
        .call(xAxis);

    // Add the y-axis
    svg.append("g")
        .transition()
        .call(yAxis);
    // Draw the recommendation line with animation
    drawLineWithAnimation(recommendationData, "steelblue", svg, line);

    // Draw the choice line with animation
    drawLineWithAnimation(choiceData, "red", svg, line);
}

// Add a function to draw lines with animation
function drawLineWithAnimation(data, color, svg, line) {
    const path = svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 1.5)
        .attr("d", line)
        .attr("stroke-dasharray", function () {
            const totalLength = this.getTotalLength();
            return `${totalLength} ${totalLength}`;
        })
        .attr("stroke-dashoffset", function () {
            return this.getTotalLength();
        });

    path
        .transition()
        .duration(data.length * 500)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
}

let rightPlots = ['Start:C/Measure:R', 'Start:CR/Measure:R', 'Start:R/Measure:R',
    'User:C/Measure:R', 'User:CR/Measure:R', 'User:R/Measure:R']

d3.csv("https://mateo762.github.io/data/plots.csv.txt").then((data) => {
    let iteration = 1
    for (let plotName of plotNames) {
        createAxis(`plot-${iteration++}`)
    }
    iteration = 1
    for (let rightPlot of rightPlots) {
        createAxis(`plot-compare-${iteration++}`)
    }
    iteration = 1
    document.querySelector(".start-button").addEventListener("click", createPlots)

    function createPlots() {
        for (let plotName of plotNames) {
            createPlot(`plot-${iteration++}`, plotName, data)
        }
        iteration = 1
    for (let rightPlot of rightPlots) {
        createPlot(`plot-compare-${iteration++}`, rightPlot, data)
    }
    }
});

