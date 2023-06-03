function startPart2() {
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

    const namePlots = ['Start:L/', 'Start:CL/', 'Start:C/', 'Start:CR/', 'Start:R/']

    const names = ['L', 'CL', 'C', 'CR', 'R']

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

    const colors = ['#1919e6', '#6060b1', '#808080', '#b34d4d', '#e61919']

    const mode = "choice" // It can be 'choice' or 'recomendation'

    const DURATION = 400

    let startButton = document.querySelector('.start-button-part-2')

    document.querySelectorAll('input[name="position-1"]').forEach(radioButton => {
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


    const svg = d3.select('.compare-animation-svg');
    const width = parseFloat(svg.attr('width'));
    const height = parseFloat(svg.attr('height'));


    function updateIndex(index) {

        startButton.addEventListener("click", startAnimation)


        d3.csv("https://mateo762.github.io/data/plots.csv.txt").then((data) => {
            const plotDataCircle = plots[index].map(plotName => {
                return data.filter(d => d.Plot === plotName && d.Line === mode);
            });
            const plotDataRectangle = data.filter(d => d.Plot.startsWith(namePlots[index]) && d.Line === mode);
            animateCircles = createAnimationRectangles(plotDataCircle);
            animateProgress = createProgressAnimation()
            //animateRectangle = createRectangleCompare(plotDataRectangle);
        });

        function startAnimation() {
            if (animateCircles && animateProgress) {
                setStartButtonDisabled(true)
                createProgressAnimation()
                animateCircles(0)
                animateProgress()
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
                .duration(DURATION)
                .style('height', d => `${scale(d)}px`);

            function update(iteration) {
                const currentValues = [L[iteration], CL[iteration], C[iteration], CR[iteration], R[iteration]];
                segments.data(currentValues)
                    .transition()
                    .duration(DURATION)
                    .style('height', d => `${scale(d)}px`);

                if (iteration + 1 < numIterations) {
                    setTimeout(() => update(iteration + 1), DURATION + delayBetweenIterations);
                }
            }

            return update;
        }


        function createAnimationRectangles(dataArray) {


            const svg = d3.select('.compare-animation-svg');
            const width = parseFloat(svg.attr('width'));
            const height = parseFloat(svg.attr('height'));

            const maxRadius = 50;
            const squareSize = 150;
            const squareSpacing = 3;

            const totalWidth = dataArray.length * squareSize + (dataArray.length - 1) * squareSpacing;
            const xOffset = (width - totalWidth) / 2; // Calculate the xOffset to center the squares

            // const exaggerationFactor = 0.5;

            // const scale = (value) => {
            //     const normalizedValue = (value - 0) / (1 - 0);
            //     const exaggeratedValue = Math.pow(normalizedValue, 1 / exaggerationFactor);
            //     const scaledValue = 10 + (squareSize - 10) * exaggeratedValue;
            //     return scaledValue;
            // };

            const scale = d3.scaleSqrt()
                .exponent(0.9)
                .domain([0, 1])
                .range([10, squareSize])


            const squares = dataArray.map((data, i) => {
                const initialSize = scale(parseFloat(data[0].Value));

                const filledSquare = `.rect-${i + 1}`
                const borderSquare = `rect-border-${i + 1}`

                d3.select(`.rect-${i + 1}`)
                    .transition()
                    .duration(400)
                    .attr('x', xOffset + 50 + i * (squareSize + squareSpacing) - initialSize / 2) // Update 'x' attribute
                    .attr('y', height / 2 - 40 - initialSize / 2) // Update 'y' attribute
                    .attr('width', initialSize)
                    .attr('height', initialSize)
                    .attr('fill', () => colors[i])

                d3.select(`.rect-border-${i + 1}`)
                    .transition()
                    .duration(400)
                    .attr('x', xOffset + 50 + i * (squareSize + squareSpacing) - initialSize / 2) // Update 'x' attribute
                    .attr('y', height / 2 - 40 - initialSize / 2) // Update 'y' attribute
                    .attr('width', initialSize)
                    .attr('height', initialSize)
                    .attr('fill', 'none')
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1)

                return {
                    square: filledSquare,
                    borderSquare: borderSquare,
                    scale: scale
                }
            });


            function animateSquares(i) {
                if (i >= dataArray[0].length) return;

                let p = 0
                squares.forEach((squareObj, plotIndex) => {
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
                    setStartButtonDisabled(false)
                }

                setTimeout(() => animateCircles(i + 1), DURATION);
            }

            // animateSquares(0, 0);
            return animateSquares
        }

        function createProgressAnimation() {
            const numCircles = 20;
            const delay = DURATION; // milliseconds

            // Select the SVG element and set its size
            const svg = d3.select('.progress')
                .attr('width', 700)
                .attr('height', 100);

            // Create a data array with the number of circles and their index
            const data = Array.from({ length: numCircles }, (_, i) => i);

            // Bind the data to the circle elements and set their attributes
            const circles = svg.selectAll('circle')
                .data(data)
                .join('circle')
                .attr('cx', (d, i) => 50 + i * 30)
                .attr('cy', 25)
                .attr('r', 10)
                .style('fill', 'white')
                .style('stroke', 'black')

            // Bind the data to the text elements and set their attributes
            const labels = svg.selectAll('text')
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



        function createAnimationCircles(dataArray) {

            const maxRadius = 50;
            const circleSpacing = (width - 2 * (50 + maxRadius) - 100) / (dataArray.length - 1); // Adjust the circleSpacing calculation

            const circles = dataArray.map((data, i) => {
                const maxValue = d3.max(data, d => parseFloat(d.Value));
                const scale = d3.scaleLinear()
                    .domain([0, maxValue])
                    .range([0, maxRadius]);

                return {
                    circle: svg.append('circle')
                        .attr('cx', 50 + maxRadius + 50 + i * circleSpacing) // Add 50 to the cx attribute
                        .attr('cy', height / 2 - 40)
                        .attr('r', scale(parseFloat(data[0].Value)))
                        .attr('fill', () => colors[i]),
                    scale: scale
                };
            });

            const progressBar = svg.append('rect')
                .attr('x', 50 + maxRadius + 50) // Add 50 to the x attribute
                .attr('y', height - 50)
                .attr('width', 0)
                .attr('height', 20)
                .attr('fill', 'black');

            const progressScale = d3.scaleLinear()
                .domain([0, 20])
                .range([0, width - 100 - maxRadius - maxRadius - 100]); // Adjust the range calculation

            const progressBarBorder = svg.append('rect')
                .attr('x', 50 + maxRadius + 50) // Same x as the progress bar
                .attr('y', height - 50) // Same y as the progress bar
                .attr('width', progressScale(20)) // Same width as the progress bar when it's fully transitioned
                .attr('height', 20) // Same height as the progress bar
                .attr('fill', 'none') // No fill color
                .attr('stroke', 'black') // Add a stroke (border) color
                .attr('stroke-width', 1); // Set the stroke (border) width


            function animateCircles(i) {
                if (i >= dataArray[0].length) return;

                circles.forEach((circleObj, plotIndex) => {
                    const data = dataArray[plotIndex];
                    const circle = circleObj.circle;
                    const scale = circleObj.scale;

                    circle.transition()
                        .duration(DURATION)
                        .attr('r', scale(parseFloat(data[i].Value)))
                        .on('end', () => {
                            if (plotIndex === dataArray.length - 1) {
                                animateCircles(i + 1);
                            }
                        });
                });
                if (i === 0) {
                    progressBar.transition()
                        .duration(DURATION * dataArray[0].length)
                        .ease(d3.easeLinear)
                        .attr('width', progressScale(20));
                }


                setTimeout(() => animateCircles(i + 1), DURATION);
            }


            //animateCircles(0, 0);
            return animateCircles
        }
    }

    updateIndex(4)


    function setStartButtonDisabled(isDisabled){
        startButton.disabled = isDisabled
        if (isDisabled) {
            startButton.classList.add("disabled")
        } else {
            startButton.classList.remove("disabled")
        }
    }
}

startPart2()