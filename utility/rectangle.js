// const colors = ['#1919e6','#6060b1','#808080','#b34d4d','#e61919'];
// const totalHeight = 200;

// console.log("hola")

// const exampleName = 'User:R';
// const mode = 'choice';

// d3.csv("https://mateo762.github.io/data/plots.csv.txt").then((data) => {
//   const plotData = data.filter(d => d.Plot.startsWith(exampleName) && d.Line === mode);
//   createRectangleCompare(plotData)
// });

// function createRectangleCompare(plotData){
//   let L, CL, C, CR, R = [];
//   L = plotData.filter(d => d.Plot.endsWith(":L")).map(d => d.Value);
//   CL = plotData.filter(d => d.Plot.endsWith(":CL")).map(d => d.Value);
//   C = plotData.filter(d => d.Plot.endsWith(":C")).map(d => d.Value);
//   CR = plotData.filter(d => d.Plot.endsWith(":CR")).map(d => d.Value);
//   R = plotData.filter(d => d.Plot.endsWith(":R")).map(d => d.Value);

//   const numIterations = L.length;
//   const transitionDuration = 500;
//   const delayBetweenIterations = 1000;

//   const scale = d3.scaleLinear()
//     .domain([0, 1])
//     .range([0, totalHeight]);

//   const rectangle = d3.select('#rectangle-compare')
//     .append('div')
//     .classed('rectangle', true)
//     .style('height', `${totalHeight}px`)
//     .style('width', '50px')
//     .style('border', '1px solid black');

//   const segments = rectangle.selectAll('.segment')
//     .data(Array(5).fill(0))
//     .enter()
//     .append('div')
//     .classed('segment', true)
//     .style('background-color', (d, i) => colors[i])
//     .style('height', d => `${scale(d)}px`)
//     .style('width', '100%');

//   function update(iteration) {
//     const currentValues = [L[iteration], CL[iteration], C[iteration], CR[iteration], R[iteration]];
//     segments.data(currentValues)
//       .transition()
//       .duration(transitionDuration)
//       .style('height', d => `${scale(d)}px`);

//     if (iteration + 1 < numIterations) {
//       setTimeout(() => update(iteration + 1), transitionDuration + delayBetweenIterations);
//     }
//   }

//   update(0);
// }