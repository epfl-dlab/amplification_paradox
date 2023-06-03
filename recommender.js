function startRecommender() {

    const startButton = document.querySelector('.start-button-recommender')
    const stopButton = document.querySelector('.stop-button-recommender')

    // Data - initialize the user-item matrix data
    const numRows = 7;
    const numCols = 7;
    let data = Array.from({ length: numRows }, () => Array.from({ length: numCols }, () => Math.random()));
    let consumed = Array.from({ length: numRows }, () => Array.from({ length: numCols }, () => 0));

    // Dimensions
    const cellSize = 55;
    const width = cellSize * numCols;
    const height = cellSize * numRows;
    const margin = { top: 80, right: 20, bottom: 20, left: 80 };

    // Color scale
    const colorScale = d3.scaleOrdinal([0, 1], ["#eee", "#2c7bb6"]);

    // Create SVG
    const svg = d3.select(".recommender-matrix")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    const rowGroups = svg.selectAll(".row-group")
        .data(consumed)
        .join("g")
        .attr("class", "row-group")
        .attr("transform", (d, i) => `translate(${margin.left}, ${margin.top + i * cellSize})`);

    function drawCells() {
        const cells = rowGroups.selectAll(".cell")
            .data(d => d)
            .join("rect")
            .attr("class", "cell")
            .attr("x", (d, i) => i * cellSize)
            .attr("y", 0)
            .attr("width", cellSize - 2) // Adjust cell width
            .attr("height", cellSize - 2) // Adjust cell height
            .attr("fill", d => colorScale(d))
            .attr("stroke", "#ccc")
            .attr("stroke-width", "3px")

        // Add text elements for each cell
        const cellTexts = rowGroups.selectAll(".cell-text")
            .data(d => d)
            .join("text")
            .attr("class", "cell-text")
            .attr("x", (d, i) => i * cellSize + cellSize / 2)
            .attr("y", cellSize / 2)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr('font-size', '18px')
            .attr("fill", "#333")
            .text(""); // Initialize with an empty string

        // Add labels
        svg.append("text")
            .attr("x", margin.left / 2)
            .attr("y", (height + margin.top) / 2)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr('font-size', '30px')
            .attr("transform", `rotate(-90, ${margin.left / 2}, ${(height + margin.top) / 2})`)
            .text("Users");

        svg.append("text")
            .attr("x", (width / 2) + margin.left)
            .attr("y", margin.top / 2)
            .attr("text-anchor", "middle")
            .attr('font-size', '30px')
            .attr("alignment-baseline", "middle")
            .text("Items");
    }
    drawCells()


    let interactionCounter = 0;
    const interactionsPerUser = 4;
    const totalInteractions = numRows * interactionsPerUser;
    let intervalId;

    const users = Array.from({ length: numRows }, (_, i) => i);
    let shuffledUsers = shuffle(users.slice());

    function animate() {
        if (interactionCounter >= totalInteractions) {
            return;
        }

        const userInteraction = generateUserInteraction();
        if (userInteraction) {
            const { user, item } = userInteraction;

            const similarUsers = getMostSimilarUsers(user);
            const topItems = selectTopCosineSimilarityVideos(user, similarUsers);

            // Highlight the current user
            d3.select('.recommender-step-4').style("color", "black")
            d3.select('.recommender-step-1').style("color", "green")
            rowGroups.filter((_, i) => i === user) // Select the user row
                .selectAll(".cell") // Select the cells within the user row
                .attr("stroke-width", "4px") // Set stroke width directly
                .transition()
                .duration(250)
                .attr("stroke", "red"); // Set stroke color directly

            // Highlight top similar users
            setTimeout(() => {
                d3.select('.recommender-step-1').style("color", "black")
                d3.select('.recommender-step-2').style("color", "green")
                rowGroups.filter((_, i) => similarUsers.includes(i))
                    .selectAll(".cell") // Select the cells within the group
                    .attr("stroke-width", "4px") // Set stroke width directly
                    .transition()
                    .duration(250)
                    .attr("stroke", "green")
            }, 500); // Set stroke color directly

            // Highlight top items
            setTimeout(() => {
                d3.select('.recommender-step-2').style("color", "black")
                d3.select('.recommender-step-3').style("color", "green")
                rowGroups
                    .filter((_, i) => i === user)
                    .selectAll(".cell")
                    .filter((_, i) => topItems.map(item => item.item).includes(i))
                    .transition()
                    .duration(250)
                    .attr("fill", "purple")
                    .attr("opacity", "0.6")
            }, 1000);

            // Display cosine similarity scores for current user's cells
            setTimeout(() => {
                rowGroups
                    .filter((_, i) => i === user)
                    .selectAll(".cell-text")
                    .text((_, i) => {
                        const similarity = topItems.find(item => item.item === i);
                        return similarity ? similarity.similarity.toFixed(2) : '';
                    });
                setTimeout(() => {
                    rowGroups
                        .filter((_, i) => i === user)
                        .selectAll(".cell-text")
                        .text((_, i) => {
                            const similarUsers = getMostSimilarUsers(user);
                            const similarity = selectTopCosineSimilarityVideos(user, similarUsers).find(item => item.item === i);
                            return '';
                        });
                }, 1000);
            }, 1000);

            // Schedule the removal of top item highlighting after a delay

            // Schedule the removal of highlighting after a delay
            setTimeout(() => {
                rowGroups.selectAll(".cell") // Select the cells within the group
                    .transition()
                    .duration(250)
                    .attr("stroke", "#ccc") // Remove stroke color
                    .attr("stroke-width", "2px"); // Reset stroke width to 0
            }, 2000); // Adjust the delay as needed

            // Update cell in the data matrix
            consumed[user][item] = 1;

            // Update the specific cell
            setTimeout(() => {
                d3.select('.recommender-step-3').style("color", "black")
                d3.select('.recommender-step-4').style("color", "green")
                setTimeout(() => {
                    d3.selectAll('.recommender-step').style("color", "black")
                }, 400)
                rowGroups
                    .filter((_, i) => i === user)
                    .selectAll(".cell")
                    .transition()
                    .duration(200)
                    .attr("fill", (d, i) => colorScale(consumed[user][i]))
                    .attr("opacity", "1")
            }, 1700);

            interactionCounter++;

            if (interactionCounter % numRows === 0) {
                shuffledUsers = shuffle(users.slice());
            }
        }
        if (interactionCounter >= numRows * interactionsPerUser) {
            setStartButtonDisabled(false)
            d3.selectAll('.recommender-step').style("color", "black")
        }

    }



    function startAnimate() {
        // Schedule next update
        animate()
        intervalId = setInterval(animate, 3000); // Adjust delay as needed
    }

    // Calculate cosine similarity
    function cosineSimilarity(a, b) {
        const dotProduct = a.reduce((sum, aVal, idx) => sum + aVal * b[idx], 0);
        const aMagnitude = Math.sqrt(a.reduce((sum, aVal) => sum + aVal * aVal, 0));
        const bMagnitude = Math.sqrt(b.reduce((sum, bVal) => sum + bVal * bVal, 0));
        return dotProduct / (aMagnitude * bMagnitude);
    }

    // Get the 2 most similar users
    function getMostSimilarUsers(userIndex, numSimilarUsers = 2) {
        const userSimilarities = data.map((otherUser, idx) => ({
            index: idx,
            similarity: idx === userIndex ? -1 : cosineSimilarity(data[userIndex], otherUser)
        }));

        userSimilarities.sort((a, b) => b.similarity - a.similarity);
        return userSimilarities.slice(0, numSimilarUsers).map(u => u.index);
    }


    function selectTopCosineSimilarityVideos(user, similarUsers, topN = 3) {
        const availableItems = consumed[user].map((val, idx) => val === 0 ? idx : -1).filter(val => val !== -1);
        const itemSimilarities = [];

        availableItems.forEach(item => {
            const itemSimilarity = similarUsers.reduce(
                (sum, otherUser) => sum + cosineSimilarity(data[user], data[otherUser]) * data[otherUser][item],
                0
            );

            itemSimilarities.push({ item, similarity: itemSimilarity });
        });

        itemSimilarities.sort((a, b) => b.similarity - a.similarity);
        return itemSimilarities.slice(0, topN);
    }


    function generateUserInteraction() {
        const user = shuffledUsers.shift();
        const similarUsers = getMostSimilarUsers(user);
        const topItems = selectTopCosineSimilarityVideos(user, similarUsers);

        if (topItems.length > 0) {
            const totalSimilarity = topItems.reduce((sum, item) => sum + item.similarity, 0);
            const randomSimilarity = Math.random() * totalSimilarity;
            let accumulatedSimilarity = 0;
            let selectedItem = -1;

            for (const item of topItems) {
                accumulatedSimilarity += item.similarity;
                if (randomSimilarity <= accumulatedSimilarity) {
                    selectedItem = item.item;
                    break;
                }
            }

            return { user, item: selectedItem };
        } else {
            return null;
        }
    }




    // Shuffle array function
    function shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    function reset() {
        interactionCounter = 0
        consumed = Array.from({ length: numRows }, () => Array.from({ length: numCols }, () => 0));
        shuffledUsers = shuffle(users.slice());
    }

    startButton.addEventListener('click', () => {
        clearInterval(intervalId)
        reset()
        drawCells()
        startAnimate()
        setStartButtonDisabled(true)
    })

    stopButton.addEventListener('click', () => {
        clearInterval(intervalId)
        setStartButtonDisabled(false)
    })

    function setStartButtonDisabled(isDisabled) {
        startButton.disabled = isDisabled
        if (isDisabled) {
            startButton.classList.add("disabled")
        } else {
            startButton.classList.remove("disabled")
        }
    }
}

startRecommender()