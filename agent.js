function startPart1A() {
	// Define the dimensions of the SVG container
	const width = 690,
		height = 230;


	// Define the number of boxes
	const numBoxes = 5;
	const boxWidth = 90
	const boxHeight = 110;
	const boxOpacity = 0.3
	// Define the x-coordinate of the first box
	const boxX = 0;
	// Define the x-coordinate increment for each box
	const boxXIncrement = 150;


	const circlesSeparation = 30
	const circleRadius = 10


	// Legend items array
	const legendItems = [
		{ color: "#1919e6", text: "Far Left" },
		{ color: "#6060b1", text: "Left" },
		{ color: "#808080", text: "Center" },
		{ color: "#b34d4d", text: "Right" },
		{ color: "#e61919", text: "Far Right" },
	];

	// Create a group for the legend
	const legendGroup = d3.select("#legend").append("g")
		.attr("class", "legend-group");

	// Create legend items
	const legend = legendGroup.selectAll(".legend")
		.data(legendItems)
		.enter()
		.append("g")
		.attr("class", "legend")
		.attr("transform", (d, i) => `translate(${i * 120}, 0)`);  // Horizontal placement

	// Draw legend colored circles
	legend.append("circle")
		.attr("class", "legend-icon")
		.attr("cx", 10)
		.attr("cy", 10)
		.attr("r", 10)
		.style("fill", d => d.color);

	// Draw legend text
	legend.append("text")
		.attr("class", "text-block legend-text")
		.attr("x", 30)  // Space legend text after the circle
		.attr("y", 15)
		.text(d => d.text);



	// Create a group for the boxes
	const boxGroup = d3.select("#animation").append("g")
		.attr("class", "box-group")

	// Create the boxes
	const boxes = boxGroup.selectAll(".box")
		.data(d3.range(numBoxes))
		.enter()
		.append("rect")
		.attr("class", function (_d, i) {
			return 'box-' + i
		})
		.attr("x", function (d, i) { return boxX + (boxXIncrement * i); })
		.attr("y", height - boxHeight)
		.attr("width", boxWidth)
		.attr("height", boxHeight)
		.attr("opacity", boxOpacity)

	let progressBarData = new Array(20).fill(0);

	const progressBar = d3.select("#agent-progress-bar")
		.selectAll("circle")
		.data(progressBarData)
		.enter()
		.append("circle")
		.attr("class", function (d, i) {
			if (i == 0) {
				return "circle green"
			} else {
				return "circle"
			}
		})
		.attr("cx", function (d, i) {
			return 80 + i * 30;
		})
		.attr("cy", 50)
		.attr("r", 10);

	const startButton = document.querySelector(".start-button-agent")
	startButton.addEventListener("click", start)

	let intervalId;
	let progressIntervalId;
	let progressIndex = 1

	function updateProgressBar(speed) {
		setTimeout(function () {
			if (progressIndex < progressBarData.length) {
				d3.select("#agent-progress-bar").select("circle:nth-child(" + (progressIndex + 1) + ")")
					.attr("opacity", 0.5)
					.transition()
					.duration(500)
					.attr("class", "circle green")
					.attr("opacity", 1)
				progressIndex++;
			}
		}, 0)
		progressIntervalId = setInterval(function () {
			if (progressIndex < progressBarData.length) {
				d3.select("#agent-progress-bar").select("circle:nth-child(" + (progressIndex + 1) + ")")
					.attr("opacity", 0.5)
					.transition()
					.duration(500)
					.attr("class", "circle green")
					.attr("opacity", 1)
				progressIndex++;
			} else {
				clearInterval(progressIntervalId);
			}
		}, speed);
	}

	function start() {
		resetProgressBar()
		setStartButtonDisabled(true)
		clearInterval(intervalId)

		let speed;
		let link_csv = ""
		const checkedRadioTopic = document.querySelector('input[name="radio-topic"]:checked');
		const checkedMode = document.querySelector("#checkbox-mode")

		document.querySelector('.checkbox-progress').addEventListener("click", resetProgressBar)
		document.querySelectorAll('input[name="radio-topic"]').forEach((radioBox) => radioBox.addEventListener("click", resetProgressBar))

		if (checkedMode.checked) {
			if (checkedRadioTopic.id == 'far-left-1') {
				link_csv = "https://mateo762.github.io/data/R_L_user_482_sim_0_idy_0.csv.txt"
			} else if (checkedRadioTopic.id == 'left-1') {
				link_csv = "https://mateo762.github.io/data/R_CL_user_424_sim_0_idy_0.csv.txt"
			} else if (checkedRadioTopic.id == 'center-1') {
				link_csv = "https://mateo762.github.io/data/R_C_user_287_sim_0_idy_0.csv.txt"
			} else if (checkedRadioTopic.id == 'right-1') {
				link_csv = "https://mateo762.github.io/data/R_CR_user_162_sim_0_idy_0.csv.txt"
			} else if (checkedRadioTopic.id == 'far-right-1') {
				link_csv = "https://mateo762.github.io/data/R_R_user_594_sim_0_idy_0.csv.txt"
			}
		} else {
			if (checkedRadioTopic.id == 'far-left-1') {
				link_csv = "https://mateo762.github.io/data/U_L_user_0_idy_1011_sim_0.csv.txt"
			} else if (checkedRadioTopic.id == 'left-1') {
				link_csv = "https://mateo762.github.io/data/U_CL_user_150_idy_1629_sim_0.csv.txt"
			} else if (checkedRadioTopic.id == 'center-1') {
				link_csv = "https://mateo762.github.io/data/U_C_user_300_idy_156_sim_0.csv.txt"
			} else if (checkedRadioTopic.id == 'right-1') {
				link_csv = "https://mateo762.github.io/data/U_CR_user_450_idy_963_sim_0.csv.txt"
			} else if (checkedRadioTopic.id == 'far-right-1') {
				link_csv = "https://mateo762.github.io/data/U_R_user_599_idy_364_sim_0.csv.txt"
			}
		}

		const checkedRadioSpeed = document.querySelector('input[name="radio-speed"]:checked');
		if (checkedRadioSpeed.id == 'slow') {
			speed = 0
		} else if (checkedRadioSpeed.id == 'medium') {
			speed = 1
		} else if (checkedRadioSpeed.id == 'fast') {
			speed = 2
		}

		const progressSpeeds = [2700, 2000, 1200]
		updateProgressBar(progressSpeeds[speed])

		const circleData = []
		let oneIteration = []
		let iteration = 0
		let selectedIteration = -1
		const numCircles = 20

		d3.csv(link_csv, function (data) {
			if (iteration == numCircles + 1) {
				shuffledOneIteration = shuffle(oneIteration)
				for (let i = 0; i < numCircles + 1; ++i) {
					if (shuffledOneIteration[i].kind == 'choice') {
						selectedIteration = i
					}
				}
				circleData.push({
					selected: selectedIteration,
					circles: shuffledOneIteration
				})
				oneIteration = []
				iteration = 0
			}
			oneIteration.push({
				kind: data.kind,
				value: mapKindToValue(data.label),
				idx: data.idx,
				radius: 10
			})
			iteration++
		}).then(startAnimation);


		function mapKindToValue(kind) {
			if (kind == 'L') return 1
			else if (kind == 'CL') return 2
			else if (kind == 'C') return 3
			else if (kind == 'CR') return 4
			else if (kind == 'R') return 5
		}


		function startAnimation() {

			d3.selectAll(".circles-group").remove()

			const iterationDuration = [1000, 700, 500]
			const betweenIterationDuration = [2700, 2000, 1200]

			const circlesAppearDuration = [600, 400, 300]
			const circlesAppearDelay = [40, 35, 25]
			const circlesRemoveDuration = [600, 400, 300]

			const waitUntilStart = [600, 400, 200]

			let countTopics;

			if (checkedRadioTopic.id == 'far-left-1') {
				countTopics = [1, 0, 0, 0, 0]
			} else if (checkedRadioTopic.id == 'left-1') {
				countTopics = [0, 1, 0, 0, 0]
			} else if (checkedRadioTopic.id == 'center-1') {
				countTopics = [0, 0, 1, 0, 0]
			} else if (checkedRadioTopic.id == 'right-1') {
				countTopics = [0, 0, 0, 1, 0]
			} else if (checkedRadioTopic.id == 'far-right-1') {
				countTopics = [0, 0, 0, 0, 1]
			}


			const iterations = circleData.length
			const circleLastCx = circleRadius + (circlesSeparation * numCircles - 1)

			const circleGroup = d3.select("#animation")
				.append("g")
				.attr("class", "circles-group");

			function updateData(iteration) {
				setTimeout(() => {
					d3.select('.agent-step-1').style("color", "black")
					d3.select('.agent-step-2').style("color", "black")
				}, betweenIterationDuration[speed] - 200)
				d3.select('.agent-step-2').style("color", "black")
				d3.select('.agent-step-1').style("color", "green")
				circleGroup.selectAll(".circle")
					.data(circleData[iteration].circles)
					.enter()
					.append("circle")
					.attr("cx", function (d, i) {
						return ((width - circleLastCx) - circleRadius) / 2 + circleRadius + (circlesSeparation * i)
					})
					.attr("cy", 40)
					.attr("id", function (d, i) {
						if (i == circleData[iteration].selected) {
							countTopics[d.value - 1]++
							return "selected"
						} else {
							return "non-selected"
						}
					})
					.transition()
					.duration(circlesAppearDuration[speed])
					.delay(function (_d, i) {
						return 0 //(numCircles - i) * circlesAppearDelay[speed]
					})
					.attr("class", function (d) {
						return "circle-" + d.value
					})
					.attr("r", circleRadius)
			}

			function update() {

				setTimeout(() => {
					d3.select('.agent-step-1').style("color", "black")
					d3.select('.agent-step-2').style("color", "green")
					d3.select("#selected")
						.transition()
						.duration(circlesRemoveDuration[speed])
						.attr("r", 10)
						.attr('cx', function (d) {
							// Return the corresponding box center for each circle
							position = (countTopics[d.value - 1] - 1) % 4
							const boxIndex = d.value - 1;
							const boxCenterX = boxX + (boxXIncrement * boxIndex) + ((boxWidth / 3) * 1.5);
							return (boxCenterX + (boxWidth / 3) * 1.5 - d.radius) - position * 2 * d.radius - 5

						})
						.attr('cy', function (d) {
							position = countTopics[d.value - 1] - 1 == 0 ? 0 : Math.floor((countTopics[d.value - 1] - 1) / 4)
							return (height - d.radius) - position * 2 * d.radius
						})
						.attr('id', "inside")
				}, waitUntilStart[speed])

				// Add a filter to select only the non-selected circles
				const nonSelectedCircles = circleGroup.selectAll("circle")
					.filter(function (d) {
						return d3.select(this).attr("id") == "non-selected";
					})
					.attr('opacity', 1)
					.transition()
					.duration(circlesRemoveDuration[speed])
					.attr('opacity', 0)

				// Remove the non-selected circles
				nonSelectedCircles.remove();
			}

			const progressBarSpeed = [2700, 2000, 1200]




			let iter = 0

			function updateAll() {
				updateData(iter)
				setTimeout(update, iterationDuration[speed])
				iter++
				if (iter == iterations) {
					clearInterval(intervalId)
					setStartButtonDisabled(false)
				}
			}

			updateAll()

			intervalId = setInterval(updateAll, betweenIterationDuration[speed])
		}
	}


	function stop() {
		clearInterval(progressIntervalId);
		clearInterval(intervalId);
		setStartButtonDisabled(false)
		d3.selectAll(".circles-group").selectAll(".inside").remove();
	}

	document.querySelector(".stop-button-agent").addEventListener("click", stop);


	function setStartButtonDisabled(isDisabled) {
		startButton.disabled = isDisabled
		if (isDisabled) {
			startButton.classList.add("disabled")
			// disable radio buttons and checkbox
			document.querySelectorAll('input[name="radio-topic"]').forEach((radioBox) => radioBox.disabled = true);
			document.querySelectorAll('input[name="radio-speed"]').forEach((radioBox) => radioBox.disabled = true);
			document.getElementById("checkbox-mode").disabled = true;
		} else {
			startButton.classList.remove("disabled")
			// enable radio buttons and checkbox
			document.querySelectorAll('input[name="radio-topic"]').forEach((radioBox) => radioBox.disabled = false);
			document.querySelectorAll('input[name="radio-speed"]').forEach((radioBox) => radioBox.disabled = false);
			document.getElementById("checkbox-mode").disabled = false;
		}
	}

	function shuffle(array) {
		let currentIndex = array.length, randomIndex;

		// While there remain elements to shuffle.
		while (currentIndex != 0) {

			// Pick a remaining element.
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [
				array[randomIndex], array[currentIndex]];
		}

		return array;
	}

	function resetProgressBar() {
		progressIndex = 1
		d3.select("#agent-progress-bar").selectAll("circle")
			.attr("class", function (_d, i) {
				if (i == 0) {
					return "circle green"
				} else {
					return "circle"
				}
			})
	}
}

startPart1A()