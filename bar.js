function startPart1B() {
    const random_data = Array.from({ length: 5 }, () => ({ "Value": 0.2 }));

    d3.csv("https://mateo762.github.io/data/utility.csv.txt").then((data) => {
        // Define the dimensions of the chart
        const width_2 = 300;
        const height_2 = 200;
        const margin = { top: 30, right: 20, bottom: 30, left: 40 };

        // Colors array
        const colors = ['#1919e6', '#6060b1', '#808080', '#b34d4d', '#e61919'];

        // Create the SVG container for the chart
        const svg = d3.select("#bar")
            .attr("width", width_2 + margin.left + margin.right)
            .attr("height", height_2 + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Add title to the chart
        svg.append("text")
            .attr("x", width_2 / 2)
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("text-decoration", "bold")
            .text("Topic Utilities");

        // Define the x and y scales
        const x = d3.scaleBand()
            .domain(['FL', 'L', 'C', 'R', 'FR'])
            .range([0, width_2])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, 1])
            .range([height_2, 0]);

        // Add the x-axis to the chart
        // svg.append("g")
        //     .attr("transform", `translate(0, ${height_2})`)
        //     .call(d3.axisBottom(x))
        //     .selectAll("text")
        //     .style("font-size", "14px") // Increase the font size of the x-axis labels
        //     .attr("fill", "#333");

        // Add the x-axis to the chart
        let xAxisGroup = svg.append("g")
            .attr("transform", `translate(0, ${height_2})`)
            .call(d3.axisBottom(x));

        xAxisGroup.selectAll("text")
            .style("display", "none");  // Hide the original x-axis text labels

        let xAxisTicks = xAxisGroup.selectAll(".tick");
        xAxisTicks.append("circle")
            .attr("r", 10)
            .attr("cy", 20)  // Adjust this to position the circles correctly
            .attr("fill", function (d, i) {
                return colors[i];
            });

        // Add the y-axis to the chart
        svg.append("g")
            .call(d3.axisLeft(y).ticks(5).tickSize(-width_2)) // Add minor ticks and set their length to the width of the chart
            .selectAll("text")
            .style("font-size", "14px") // Increase the font size of the y-axis labels
            .attr("fill", "#333");

        // Remove the default path (outline) of the axis
        svg.selectAll(".axis path")
            .style("display", "none");

        // Add event listener to the 'Start animation' button
        // Add event listeners to the radio buttons
        document.querySelectorAll('input[name="radio-topic"]').forEach(radio => {
            radio.addEventListener('click', updateChart);
        });

        const checkboxMode = document.querySelector("#checkbox-mode")
        checkboxMode.addEventListener('click', updateChart)

        function updateChart() {
            // Get the checked radio button
            const checkedRadio = document.querySelector('input[name="radio-topic"]:checked');

            let selectedData;
            if (!checkboxMode.checked) {
                switch (checkedRadio.id) {
                    case "far-left-1":
                        const far_left_data = data.filter(
                            (d) => d.Start === "L"
                        )
                        selectedData = far_left_data;
                        break;
                    case "left-1":
                        const left_data = data.filter(
                            (d) => d.Start === "CL"
                        )
                        selectedData = left_data;
                        break;
                    case "center-1":
                        const center_data = data.filter(
                            (d) => d.Start === "C"
                        )
                        selectedData = center_data;
                        break;
                    case "right-1":
                        const right_data = data.filter(
                            (d) => d.Start === "CR"
                        )
                        selectedData = right_data;
                        break;
                    case "far-right-1":
                        const far_right_data = data.filter(
                            (d) => d.Start === "R"
                        )
                        selectedData = far_right_data;
                        break;
                    default:
                        return;
                }
                selectedData = normalizeArray(selectedData)
            }
            else {
                selectedData = random_data
            }


            switch (checkedRadio.id) {
                case "far-left-1":
                    d3.selectAll(".circles-group").remove()
                    d3.selectAll('.initial')
                        .attr('opacity', 1)
                        .transition()
                        .duration(500)
                        .attr('opacity', 0)
                        .remove()
                    d3.select('#animation').append('circle')
                        .attr('cx', function () {
                            return 75
                        })
                        .attr('cy', 230 - 10)
                        .attr('r', '10')
                        .attr('fill', colors[0])
                        .attr('class', 'initial')
                        .attr('opacity', 0)
                        .transition()
                        .duration(500)
                        .attr('opacity', 1)
                    break;
                case "left-1":
                    d3.selectAll(".circles-group").remove()
                    d3.selectAll('.initial')
                        .attr('opacity', 1)
                        .transition()
                        .duration(500)
                        .attr('opacity', 0)
                        .remove()
                    d3.select('#animation').append('circle')
                        .attr('cx', function () {
                            return 225
                        })
                        .attr('cy', 230 - 10)
                        .attr('r', '10')
                        .attr('fill', colors[1])
                        .attr('class', 'initial')
                        .attr('opacity', 0)
                        .transition()
                        .duration(500)
                        .attr('opacity', 1)
                    break;
                case "center-1":
                    d3.selectAll(".circles-group").remove()
                    d3.selectAll('.initial')
                        .attr('opacity', 1)
                        .transition()
                        .duration(500)
                        .attr('opacity', 0)
                        .remove()
                    d3.select('#animation').append('circle')
                        .attr('cx', function () {
                            return 375
                        })
                        .attr('cy', 230 - 10)
                        .attr('r', '10')
                        .attr('fill', colors[2])
                        .attr('class', 'initial')
                        .attr('opacity', 0)
                        .transition()
                        .duration(500)
                        .attr('opacity', 1)
                    break;
                case "right-1":
                    d3.selectAll(".circles-group").remove()
                    d3.selectAll('.initial')
                        .attr('opacity', 1)
                        .transition()
                        .duration(500)
                        .attr('opacity', 0)
                        .remove()
                    d3.select('#animation').append('circle')
                        .attr('cx', function () {
                            return 525
                        })
                        .attr('cy', 230 - 10)
                        .attr('r', '10')
                        .attr('fill', colors[3])
                        .attr('class', 'initial')
                        .attr('opacity', 0)
                        .transition()
                        .duration(500)
                        .attr('opacity', 1)
                    break;
                case "far-right-1":
                    d3.selectAll(".circles-group").remove()
                    d3.selectAll('.initial')
                        .attr('opacity', 1)
                        .transition()
                        .duration(500)
                        .attr('opacity', 0)
                        .remove()
                    d3.select('#animation').append('circle')
                        .attr('cx', function () {
                            return 675
                        })
                        .attr('cy', 230 - 10)
                        .attr('r', '10')
                        .attr('fill', colors[4])
                        .attr('class', 'initial')
                        .attr('opacity', 0)
                        .transition()
                        .duration(500)
                        .attr('opacity', 1)
                    break;
                default:
                    return;
            }

            // Update the x-scale domain
            x.domain(selectedData.map((d, i) => i));

            // Update the bars with the new data
            const bars = svg.selectAll(".bar")
                .data(selectedData);

            // Define transition duration
            const transitionDuration = 750;

            // Update existing bars with transition
            bars
                .transition()
                .duration(transitionDuration)
                .attr("x", (d, i) => x(i))
                .attr("y", d => y(d.Value))
                .attr("width", x.bandwidth())
                .attr("height", d => height_2 - y(d.Value))
                .attr("fill", (d, i) => colors[i]);

            // Enter new bars with transition
            bars.enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", (d, i) => x(i))
                .attr("y", height_2)
                .attr("width", x.bandwidth())
                .attr("height", 0)
                .attr("fill", (d, i) => colors[i])
                .transition()
                .duration(transitionDuration)
                .attr("y", d => y(d.Value))
                .attr("height", d => height_2 - y(d.Value));

            // Remove old bars with transition
            bars.exit()
                .transition()
                .duration(transitionDuration)
                .attr("y", height_2)
                .attr("height", 0)
                .remove();
        }

        // Initial render
        updateChart();
    });


    function normalizeArray(array) {
        let sum = 0;
        for (let i = 0; i < array.length; i++) {
            sum += parseFloat(array[i].Value);
        }
        for (let i = 0; i < array.length; i++) {
            array[i].Value = (parseFloat(array[i].Value) / sum).toString();
        }
        return array;
    }
}

startPart1B()