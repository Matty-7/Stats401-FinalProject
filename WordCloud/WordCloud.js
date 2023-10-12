// Load the CSV data using D3
d3.csv("WordsCloud.csv", function(error, data) {
    if (error) throw error;

    // Parse salary_in_usd as numbers
    data.forEach(function(d) {
        d.salary_in_usd = d.salary_in_usd;
        d.frequency = d.frequency;
    });

    // Set up the SVG container for the word cloud
    const svgWidth = 800;   
    const svgHeight = 400;

    const svg = d3.select("#word-cloud")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Define the color scale based on salary_in_usd
    // var myColor = d3.scaleLinear().domain([0,1]).range(["white","black"])

    var myColor = d3.scaleSequential().domain([0,10]).interpolator(d3.interpolatePuRd);

    // Create the word cloud layout using d3-cloud
    const wordCloudLayout = d3.layout.cloud()
        .size([svgWidth, svgHeight])
        .words(data.map(function(d) {
            return { text: d.job_title, salary_in_usd : d.salary_in_usd,  frequency: d.frequency };
        }))
        .padding(5)
        .rotate(function() { return (Math.floor(Math.random() * 2)) * 90; })
        // .fontSize(function(d) { return Math.sqrt(d.frequency * 20000); }) // Adjust as needed
        .fontSize(function(d) { return Math.exp(d.frequency)*10; })  // for wordscloud
        .on("end", draw);

    wordCloudLayout.start();

    // Draw the word cloud
    function draw(words) {
        const wordCloud = svg.append("g")
            .attr("transform", "translate(" + svgWidth / 2 + "," + svgHeight / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter()
            .append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            // .style("fill",   function(d) { return myColor(d.salary_in_usd/22424); })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                // return "translate(" +     [d.x, d.y] + ")"; 
            })
            .text(function(d) { return d.text; });

        // Add mouseover interaction
        wordCloud.on("mouseover", function(d) {
            // Display job_title, salary_in_usd, and frequency near the mouse
            const tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            tooltip.html("Job Title: " + d.text + "<br>Salary: $" + d.salary_in_usd + "<br>Frequency: " + d.frequency)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .transition()
                .duration(20)
                .style("opacity", 0.9);
        })
        .on("mouseout", function(d) {
            // Hide the tooltip on mouseout
            d3.select(".tooltip")
                .transition()
                .duration(0)
                .style("opacity", 0)
                .remove();
        });
    }
});
