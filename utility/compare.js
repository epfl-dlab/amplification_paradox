function startPart3() {
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

    const names = ['L', 'CL', 'C', 'CR', 'R']

    const namePlots = ['User:L/', 'User:CL/', 'User:C/', 'User:CR/', 'User:R/']

    const plots = [['User:L/Measure:L', 'User:L/Measure:CL', 'User:L/Measure:C',
        'User:L/Measure:CR', 'User:L/Measure:R'],
    ['User:CL/Measure:L', 'User:CL/Measure:CL', 'User:CL/Measure:C',
        'User:CL/Measure:CR', 'User:CL/Measure:R'],
    ['User:C/Measure:L', 'User:C/Measure:CL', 'User:C/Measure:C',
        'User:C/Measure:CR', 'User:C/Measure:R'],
    ['User:CR/Measure:L', 'User:CR/Measure:CL', 'User:CR/Measure:C',
        'User:CR/Measure:CR', 'User:CR/Measure:R'],
    ['User:R/Measure:L', 'User:R/Measure:CL', 'User:R/Measure:C',
        'User:R/Measure:CR', 'User:R/Measure:R']]

    const colors = ['#1919e6', '#6060b1', '#808080', '#b34d4d', '#e61919']

    const mode = "choice" // It can be 'choice' or 'recomendation'

    const DURATION = 400

    let startButton2 = document.querySelector('.start-button-part-3')

    document.querySelectorAll('input[name="position-2"]').forEach(radioButton => {
        radioButton.addEventListener('click', (event) => {
            if (event.target.value === 'Far Left') {
                updateIndex(0)
            } else if (event.target.value === 'Left') {
                updateIndex(1)
            } else if (event.target.value === 'Center') {
                updateIndex(2)
            } else if (event.target.value === 'Right') {
                updateIndex(3)
            } else if (event.target.value === 'Far Right') {
                updateIndex(4)
            }
        });
    });


    const svg2 = d3.select('.second-compare-animation');
    const width = parseFloat(svg2.attr('width'));
    const height = parseFloat(svg2.attr('height'));


    function updateIndex(index) {
        startButton2.addEventListener("click", startAnimation2)


        d3.csv("https://mateo762.github.io/data/plots.csv.txt").then((dataPlots) => {
            d3.csv("https://mateo762.github.io/data/relative_utility.csv.txt").then((dataUtility) => {
                const plotDataCircle = plots[index].map(plotName => {
                    return dataPlots.filter(d => d.Plot === plotName && d.Line === mode);
                });
                const plotDataRectangle = dataPlots.filter(d => d.Plot.startsWith(namePlots[index]) && d.Line === mode);
                const utilityData = dataUtility.filter(d => d.Start === names[index])
                animateCircles2 = createAnimationRectangles2(plotDataCircle, utilityData);
                //animateRectangle = createRectangleCompare(plotDataRectangle);
                animateProgress2 = createProgressAnimation2()
            })
        });

        function startAnimation2() {
            if (animateCircles && animateProgress) {
                setStartButtonDisabled2(true)
                createProgressAnimation2()
                animateCircles2(0)
                animateProgress2()
            }
        }

        function createRectangleCompare(plotData) {
            totalHeight = height / 1.25
            L = plotData.filter(d => d.Plot.endsWith(":L")).map(d => d.Value);
            CL = plotData.filter(d => d.Plot.endsWith(":CL")).map(d => d.Value);
            C = plotData.filter(d => d.Plot.endsWith(":C")).map(d => d.Value);
            CR = plotData.filter(d => d.Plot.endsWith(":CR")).map(d => d.Value);
            R = plotData.filter(d => d.Plot.endsWith(":R")).map(d => d.Value);

            const numIterations = L.length;
            const transitionDuration = DURATION;
            const delayBetweenIterations = 0;

            const scale = d3.scaleLinear()
                .domain([0, 1])
                .range([0, totalHeight]);

            const rectangle = d3.select('#rectangle-compare')
                .append('div')
                .classed('rectangle', true)
                .style('height', `${totalHeight}px`)
                .style('width', '50px')
                .style('border', '1px solid black');

            const segments = rectangle.selectAll('.segment')
                .data(Array(5).fill(0))
                .enter()
                .append('div')
                .classed('segment', true)
                .style('background-color', (d, i) => colors[i])
                .style('height', d => `${scale(d)}px`)
                .style('width', '100%');

            const firstValues = [L[0], CL[0], C[0], CR[0], R[0]];
            segments.data(firstValues)
                .transition()
                .duration(transitionDuration)
                .style('height', d => `${scale(d)}px`);

            function update(iteration) {
                const currentValues = [L[iteration], CL[iteration], C[iteration], CR[iteration], R[iteration]];
                segments.data(currentValues)
                    .transition()
                    .duration(transitionDuration)
                    .style('height', d => `${scale(d)}px`);

                if (iteration + 1 < numIterations) {
                    setTimeout(() => update(iteration + 1), transitionDuration + delayBetweenIterations);
                }
            }

            return update;
        }


        function createAnimationRectangles2(dataArray, dataUtility) {

            const maxRadius = 50;
            const squareSize = 150;
            const squareSpacing = 3;

            const totalWidth = dataArray.length * squareSize + (dataArray.length - 1) * squareSpacing;
            const xOffset = (width - totalWidth) / 2; // Calculate the xOffset to center the squares

            const scale = d3.scalePow()
                .exponent(0.5)
                .domain([0, 1])
                .range([10, squareSize])

            const squares = dataArray.map((data, i) => {
                const relativeUtility = (dataUtility.filter(d => d.Measure === names[i]))[0].Value

                const initialSize = scale(parseFloat(data[0].Value));
                const utilitySize = scale(parseFloat(relativeUtility))

                const filledSquare = `.rect-utility-${i + 1}`
                const borderSquareUtility = `.rect-utility-border-${i + 1}`

                d3.select(filledSquare)
                    .transition()
                    .duration(400)
                    .attr('x', xOffset + 50 + i * (squareSize + squareSpacing) - initialSize / 2) // Update 'x' attribute
                    .attr('y', height / 2 - 40 - initialSize / 2) // Update 'y' attribute
                    .attr('width', initialSize)
                    .attr('height', initialSize)
                    .attr('fill', () => colors[i])

                // Add static square border with no color inside
                d3.select(borderSquareUtility)
                    .transition()
                    .duration(400)
                    .attr('x', xOffset + 50 + i * (squareSize + squareSpacing) - utilitySize / 2)
                    .attr('y', height / 2 - 40 - utilitySize / 2)
                    .attr('width', utilitySize)
                    .attr('height', utilitySize)
                    .attr('fill', 'none')
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1);

                // Add static square border with no color inside
                // const borderSquareInitial = svg2.append('rect')
                //     .attr('x', xOffset + 50 + i * (squareSize + squareSpacing) - initialSize / 2)
                //     .attr('y', height / 2 - 40 - initialSize / 2)
                //     .attr('width', initialSize)
                //     .attr('height', initialSize)
                //     .attr('fill', 'none')
                //     .attr('stroke', 'black')
                //     .attr('stroke-width', 1);


                return {
                    square: filledSquare,
                    borderSquareUtility: borderSquareUtility,
                    scale: scale
                };
            });


            function animateSquares(i) {
                if (i >= dataArray[0].length) return;

                squares.forEach((squareObj, plotIndex) => {
                    console.log(squareObj, plotIndex)
                    const data = dataArray[plotIndex];
                    const square = d3.select(squareObj.square);
                    const scale = squareObj.scale;

                    const newSize = scale(parseFloat(data[i].Value));

                    square.transition()
                        .duration(DURATION)
                        .attr('x', xOffset + 50 + plotIndex * (squareSize + squareSpacing) - newSize / 2) // Update 'x' attribute
                        .attr('y', height / 2 - 40 - newSize / 2) // Update 'y' attribute
                        .attr('width', newSize)
                        .attr('height', newSize)
                        .on('end', () => {
                            if (plotIndex === dataArray.length - 1) {
                                animateSquares(i + 1);
                            }
                        });
                });

                if(i==19){
                    setStartButtonDisabled2(false)
                }
                setTimeout(() => animateCircles(i + 1), DURATION);
            }

            // animateSquares(0, 0);
            return animateSquares
        }

        function createProgressAnimation2() {
            const numCircles = 20;
            const delay = DURATION; // milliseconds

            // Select the svg2 element and set its size
            const svg2 = d3.select('.progress-2')
                .attr('width', 700)
                .attr('height', 100);

            // Create a data array with the number of circles and their index
            const data = Array.from({ length: numCircles }, (_, i) => i);

            // Bind the data to the circle elements and set their attributes
            const circles = svg2.selectAll('circle')
                .data(data)
                .join('circle')
                .attr('cx', (d, i) => 50 + i * 30)
                .attr('cy', 25)
                .attr('r', 10)
                .style('fill', 'white')
                .style('stroke', 'black')

            // Bind the data to the text elements and set their attributes
            const labels = svg2.selectAll('text')
                .data(data)
                .join('text')
                .attr('x', (d, i) => 50 + i * 30)
                .attr('y', 55)
                .attr('text-anchor', 'middle')
                .style('font-size', '16px')
                .style('display', (d, i) => ((i == 0) || ((i + 1) % 5 === 0)) ? 'block' : 'none') // Only show labels for the first, fifth, and every fifth circle
                .text((d, i) => i + 1);

            // Define a function to fill the circle with the green color
            function fillColor(circle) {
                circle.transition()
                    .duration(500)
                    .style('fill', 'green');
            }

            // Iterate over the circles and call the fillColor function with a delay
            function update() {
                circles.each(function (_, i) {
                    d3.select(this).transition()
                        .delay(i * delay)
                        .on('start', () => fillColor(d3.select(this)));
                });
            }

            return update
        }



    }

    updateIndex(4)







    // function createAnimationCircles(dataArray) {

    //     const maxRadius = 50;
    //     const circleSpacing = (width - 2 * (50 + maxRadius) - 100) / (dataArray.length - 1); // Adjust the circleSpacing calculation

    //     const circles = dataArray.map((data, i) => {
    //         const maxValue = d3.max(data, d => parseFloat(d.Value));
    //         const scale = d3.scaleLinear()
    //             .domain([0, maxValue])
    //             .range([0, maxRadius]);

    //         return {
    //             circle: svg2.append('circle')
    //                 .attr('cx', 50 + maxRadius + 50 + i * circleSpacing) // Add 50 to the cx attribute
    //                 .attr('cy', height / 2 - 40)
    //                 .attr('r', scale(parseFloat(data[0].Value)))
    //                 .attr('fill', () => colors[i]),
    //             scale: scale
    //         };
    //     });

    //     const progressBar = svg2.append('rect')
    //         .attr('x', 50 + maxRadius + 50) // Add 50 to the x attribute
    //         .attr('y', height - 50)
    //         .attr('width', 0)
    //         .attr('height', 20)
    //         .attr('fill', 'black');

    //     const progressScale = d3.scaleLinear()
    //         .domain([0, 20])
    //         .range([0, width - 100 - maxRadius - maxRadius - 100]); // Adjust the range calculation

    //     const progressBarBorder = svg2.append('rect')
    //         .attr('x', 50 + maxRadius + 50) // Same x as the progress bar
    //         .attr('y', height - 50) // Same y as the progress bar
    //         .attr('width', progressScale(20)) // Same width as the progress bar when it's fully transitioned
    //         .attr('height', 20) // Same height as the progress bar
    //         .attr('fill', 'none') // No fill color
    //         .attr('stroke', 'black') // Add a stroke (border) color
    //         .attr('stroke-width', 1); // Set the stroke (border) width


    //     function animateCircles(i) {
    //         if (i >= dataArray[0].length) return;

    //         circles.forEach((circleObj, plotIndex) => {
    //             const data = dataArray[plotIndex];
    //             const circle = circleObj.circle;
    //             const scale = circleObj.scale;

    //             circle.transition()
    //                 .duration(DURATION)
    //                 .attr('r', scale(parseFloat(data[i].Value)))
    //                 .on('end', () => {
    //                     if (plotIndex === dataArray.length - 1) {
    //                         animateCircles(i + 1);
    //                     }
    //                 });
    //         });
    //         if (i === 0) {
    //             progressBar.transition()
    //                 .duration(DURATION * dataArray[0].length)
    //                 .ease(d3.easeLinear)
    //                 .attr('width', progressScale(20));
    //         }

    //         setTimeout(() => animateCircles(i + 1), DURATION);
    //     }


    //     //animateCircles(0, 0);
    //     return animateCircles
    // }


    function setStartButtonDisabled2(isDisabled) {
        startButton2.disabled = isDisabled
        if (isDisabled) {
            startButton2.classList.add("disabled")
        } else {
            startButton2.classList.remove("disabled")
        }
    }
}

startPart3()