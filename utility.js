function startUtility() {

    const startButton = document.querySelector('.start-button-utility')

    const plots = [['Start:L/Measure:L', 'Start:L/Measure:CL', 'Start:L/Measure:C',
        'Start:L/Measure:CR', 'Start:L/Measure:R'],
    ['Start:CL/Measure:L', 'Start:CL/Measure:CL', 'Start:CL/Measure:C',
        'Start:CL/Measure:CR', 'Start:CL/Measure:R'],
    ['Start:C/Measure:L', 'Start:C/Measure:CL', 'Start:C/Measure:C',
        'Start:C/Measure:CR', 'Start:C/Measure:R'],
    ['Start:CR/Measure:L', 'Start:CR/Measure:CL', 'Start:CR/Measure:C',
        'Start:CR/Measure:CR', 'Start:CR/Measure:R'],
    ['Start:R/Measure:L', 'Start:R/Measure:CL', 'Start:R/Measure:C',
        'Start:R/Measure:CR', 'Start:R/Measure:R']]




    const plots2 = [['User:L/Measure:L', 'User:L/Measure:CL', 'User:L/Measure:C',
        'User:L/Measure:CR', 'User:L/Measure:R'],
    ['User:CL/Measure:L', 'User:CL/Measure:CL', 'User:CL/Measure:C',
        'User:CL/Measure:CR', 'User:CL/Measure:R'],
    ['User:C/Measure:L', 'User:C/Measure:CL', 'User:C/Measure:C',
        'User:C/Measure:CR', 'User:C/Measure:R'],
    ['User:CR/Measure:L', 'User:CR/Measure:CL', 'User:CR/Measure:C',
        'User:CR/Measure:CR', 'User:CR/Measure:R'],
    ['User:R/Measure:L', 'User:R/Measure:CL', 'User:R/Measure:C',
        'User:R/Measure:CR', 'User:R/Measure:R']]

    const names = ['L', 'CL', 'C', 'CR', 'R']
    const namePlots = ['Start:L/', 'Start:CL/', 'Start:C/', 'Start:CR/', 'Start:R/']

    const namePlots2 = ['User:L/', 'User:CL/', 'User:C/', 'User:CR/', 'User:R/']

    const colors = ['#1919e6', '#6060b1', '#808080', '#b34d4d', '#e61919']

    const indexChoice = 4
    const mode = 'choice'

    // Set up SVG dimensions
    const svgWidth = 700
    const svgHeight = 500


    const width = 90
    const separationBar = 152


    const scaleFactor = 1e5
    const exaggerationFactor = 500


    const referencePoint = svgHeight / 2;
    const groundPosition = svgHeight / 2;
    const exaggeratedReference = exaggerationFactor / 2;


    document.querySelectorAll('input[name="position-utility"]').forEach(radioButton => {
        radioButton.addEventListener('click', (event) => {
            if (event.target.value === 'Far Left') {
                updateOrientation(0)
            } else if (event.target.value === 'Left') {
                updateOrientation(1)
            } else if (event.target.value === 'Center') {
                updateOrientation(2)
            } else if (event.target.value === 'Right') {
                updateOrientation(3)
            } else if (event.target.value === 'Far Right') {
                updateOrientation(4)
            }
        });
    });



    function updateOrientation(orientation) {
        d3.csv("https://mateo762.github.io/data/plots.csv.txt").then((data) => {
            d3.csv("https://mateo762.github.io/data/relative_utility.csv.txt").then((dataUtility) => {
                for (const dict of data) {
                    dict.Value = parseFloat(dict.Value) * scaleFactor + 1;
                }
                const filterData = data.filter(function (d) {
                    return d.Line === mode && d.Plot.startsWith(namePlots2[orientation])
                })
                for (const dict of dataUtility) {
                    dict.Value = parseFloat(dict.Value) * scaleFactor + 1;
                }
                const utilityData = convertUtilityData(dataUtility.filter(d => d.Start === names[orientation]))
                const parseData = convertData(filterData)
                drawUtilityBars(parseData, utilityData)
                setUp(parseData)
            })
        });

        function drawUtilityBars(valuesArray, utilityArray) {
            console.log(valuesArray)
            console.log(utilityArray)

            for (let i = 0; i < 5; ++i) {
                const firstValue = valuesArray[i][0]

                console.log(names[i], firstValue, utilityArray[i])
                // Create a scale to map positive values to heights
                const scalePos = d3.scaleLog()
                    .domain([firstValue, scaleFactor + 1])
                    .range([0, exaggeratedReference]);

                // Create a scale to map negative values to heights
                const scaleNeg = d3.scaleLog()
                    .domain([firstValue, 1])
                    .range([0, exaggeratedReference]);


                const newHeight = utilityArray[i] >= firstValue
                    ? scalePos(utilityArray[i])
                    : scaleNeg(utilityArray[i]);

                const posX = i * separationBar
                const borderBar = d3.select(`.utility-bar-border-${i}`)
                    .attr('width', (3 * width / 4))
                    .attr('height', () => {
                        if (i == 1 && orientation == 4) {
                            return 0
                        } else {
                            return newHeight
                        }
                    })
                    .attr('y', utilityArray[i] >= firstValue ? groundPosition - newHeight : groundPosition)
                    .attr('x', (width / 4 / 2) + posX)
                    .attr('fill', 'none')
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1);
            }
        }


        function setUp(testValuesArray) {

            d3.selectAll('.text-percentage-utility').remove()

            // Set the initial reference point for the bar

            const svg = d3.select('.utility-svg');
            svg.attr('width', svgWidth)
                .attr('height', svgHeight)

            testValuesArray.forEach((testValues, index) => {

                const posX = index * separationBar

                const firstValue = testValues[0];

                const rectWidth = 60;
                const rectHeight = 30;

                // Create the bar with initial height of 0

                // Create the bar first to place it behind the other elements
                const bar = d3.select(`.utility-bar-${index}`)
                    .attr('width', (3 * width / 4))
                    .attr('height', 0)
                    .attr('y', groundPosition)
                    .attr('x', (width / 4 / 2) + posX)
                    .attr('fill', (_d, i) => colors[index])


                // Create a horizontal line at the reference point
                d3.select(`.utility-line-${index}`)
                    .attr('x1', posX)
                    .attr('y1', groundPosition)
                    .attr('x2', width + posX)
                    .attr('y2', groundPosition)
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1);

                // Create a small rectangle in the middle of the horizontal line
                d3.select(`.utility-rect-${index}`)
                    .attr('x', ((width - rectWidth) / 2) + posX)
                    .attr('y', groundPosition - rectHeight / 2)
                    .attr('width', rectWidth)
                    .attr('height', rectHeight)
                    .attr('fill', 'white')
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1);

                // Create a text element to display the current value inside the rectangle
                const valueText = d3.select(`.utility-text-value-${index}`)
                    .attr('opacity', 0)
                    .attr('x', (width / 2) + posX)
                    .attr('y', groundPosition + 5) // Adjust the vertical position to center the text within the rectangle
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '18px')
                    .text(() => {
                        if ((index == 1 && orientation == 4) || (index == 0 && orientation == 2) || (index == 0 && orientation == 3)) {
                            testValues[0] = 0
                            testValues[testValues.length-1] = 0
                            return "0.00"
                        } else {
                            return ((firstValue - 1) / scaleFactor * 100).toFixed(2)
                        }
                    })
                    .attr('fill', 'black')
                    .transition()
                    .duration(500)
                    .attr('opacity', 1)


            })


            // Function to animate the bar
            function animateBar() {

                d3.selectAll('.text-percentage-utility').remove()

                testValuesArray.forEach((testValues, index) => {
                    const posX = index * separationBar
                    const firstValue = testValues[0];
                    d3.select(`.utility-text-value-${index}`)
                        .attr('x', (width / 2) + posX)
                        .attr('y', groundPosition + 5) // Adjust the vertical position to center the text within the rectangle
                        .attr('text-anchor', 'middle')
                        .attr('font-size', '18px')
                        .text(function () {
                            if (firstValue == 0) {
                                return '0.00'
                            } else {
                                return ((firstValue - 1) / scaleFactor * 100).toFixed(2)
                            }
                        })
                        .attr('fill', 'black')
                        .attr('opacity', 1)
                });


                setStartButtonDisabled(true)

                testValuesArray.forEach((testValues, index) => {
                    let i = 0;
                    const bar = d3.select(`.utility-bar-${index}`)
                    let firstValue = testValues[0]

                    const lastValue = testValues[testValues.length - 1]

                    const originalFirstValue = ((firstValue - 1) / scaleFactor) * 100
                    const originalLastValue = ((lastValue - 1) / scaleFactor) * 100

                    let percentageChange;

                    if (originalLastValue > originalLastValue) {
                        percentageChange = (originalLastValue - originalFirstValue) / originalFirstValue * 100;
                    } else {
                        percentageChange = (originalFirstValue - originalLastValue) / originalFirstValue * -100;
                    }
                    // if (percentageChange < 0) {
                    //     percentageChange = -percentageChange;
                    // }

                    //percentageChange = originalLastValue - originalFirstValue

                    console.log(originalFirstValue, originalLastValue, parseFloat(percentageChange.toFixed(2)))
                    const posX = index * separationBar

                    // Create a scale to map positive values to heights
                    const scalePos = d3.scaleLog()
                        .domain([firstValue, scaleFactor + 1])
                        .range([0, exaggeratedReference]);

                    // Create a scale to map negative values to heights
                    const scaleNeg = d3.scaleLog()
                        .domain([firstValue, 1])
                        .range([0, exaggeratedReference]);

                    function updateHeight() {
                        if (i < testValues.length) {
                            const previousValue = i === 0 ? 0 : testValues[i - 1];
                            let currentValue = testValues[i];
                            if ((index == 4 && orientation == 2) || (index == 1 && orientation == 4) || (index == 0 && orientation == 2) ||
                                (index == 0 && orientation == 3) || (index == 0 && orientation == 4) || (index == 1 && orientation == 4)) {
                                firstValue = 0
                                currentValue = 0
                                percentageChange = 0
                            }
                            const isCrossingZero = (previousValue < 0 && currentValue >= 0) || (previousValue >= 0 && currentValue < 0);

                            // Calculate the new height based on the testValues array
                            const newHeight = currentValue >= firstValue
                                ? scalePos(currentValue)
                                : scaleNeg(currentValue);

                            if (isCrossingZero) {
                                // Transition through zero
                                bar.transition()
                                    .duration(125)
                                    .attr('height', 0)
                                    .attr('y', groundPosition)
                                    .on('end', () => {
                                        bar.transition()
                                            .duration(125)
                                            .attr('height', newHeight)
                                            .attr('y', currentValue >= firstValue ? groundPosition - newHeight : groundPosition);
                                    });
                            } else {
                                // Update the height and position of the bar
                                bar.transition()
                                    .duration(250)
                                    .attr('height', newHeight)
                                    .attr('y', currentValue >= firstValue ? groundPosition - newHeight : groundPosition);
                            }

                            if (i == testValues.length - 1) {
                                // Create a text element with an initial opacity of 0
                                const percentageText = svg.append('text')
                                    .attr('x', (width / 2) + posX)
                                    .attr('y', groundPosition + 100) // Set the vertical position for the percentage change text
                                    .attr('text-anchor', 'middle')
                                    .attr('font-size', '18px')
                                    .attr('fill', percentageChange > 0 ? 'green' : 'red') // Set the color based on the percentage change
                                    .attr('opacity', 0)
                                    .text(() => {
                                        if ((index == 1 && orientation == 4) || (index == 1 && orientation == 0)) {
                                            return '0.00%'
                                        } else {
                                            return (percentageChange > 0 ? '+' : '') + percentageChange.toFixed(2) + '%'
                                        }
                                    })
                                    .attr('class', `text-percentage-utility`)

                                // Transition the opacity from 0 to 1
                                percentageText.transition()
                                    .duration(1000)
                                    .attr('opacity', 1);

                                d3.select(`.utility-text-value-${index}`)
                                    .attr('opacity', 0)
                                    .text(() => {
                                        if ((index == 0 && orientation == 2) || (index == 1 && orientation == 4)) {
                                            return '0.00'
                                        } else {
                                            return originalLastValue.toFixed(2)
                                        }
                                    })
                                    .attr('fill', percentageChange > 0 ? 'green' : 'red') // Set the color based on the percentage change
                                    .transition()
                                    .duration(500)
                                    .attr('opacity', 1)

                                setStartButtonDisabled(false)
                            }
                            i++;
                            // Call the function again with a delay
                            setTimeout(updateHeight, 300);
                        }
                    }

                    updateHeight();
                })
            }

            // Add event listener to the button
            d3.select('.start-button-utility').on('click', animateBar);
        }
    }


    function convertData(data) {
        const measures = ['L', 'CL', 'C', 'CR', 'R']
        let parseData = [
            [],
            [],
            [],
            [],
            []
        ]

        for (let i = 0; i < measures.length; ++i) {
            measureData = data.filter(d => d.Measure === measures[i])
            measureData.map(d => parseData[i].push(d.Value))
        }

        return parseData
    }

    function convertUtilityData(data) {
        let parseData = []
        data.map(d => parseData.push(d.Value))
        return parseData
    }

    function setStartButtonDisabled(isDisabled) {
        startButton.disabled = isDisabled
        if (isDisabled) {
            startButton.classList.add("disabled")
			document.querySelectorAll('input[name="position-utility"]').forEach((radioBox) => radioBox.disabled = true);
        } else {
            startButton.classList.remove("disabled")
			document.querySelectorAll('input[name="position-utility"]').forEach((radioBox) => radioBox.disabled = false);
        }
    }

    updateOrientation(2)
}

startUtility()