// Load the CSV data using D3
d3.csv("Wordcloud.csv", function(error, data) {
    if (error) throw error;

    // data.forEach(function(d) {
    //     d.salary_in_usd = d.salary_in_usd;
    //     d.frequency = d.frequency;
    // });

    const svgWidth = 800;   
    const svgHeight = 600;

    const svg = d3.select("#word-cloud")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // var myColor = d3.scaleLinear().domain([0,1]).range(["white","black"])

    var myColor = d3.scaleSequential().domain([0,10]).interpolator(d3.interpolatePuRd);

    let allGroup = Array.from(new Set(data.map(d => d.type)))

    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; })
      .attr("value", function (d) { return d; })

    const filteredData = data.filter(d => d.type === "frequency");
    fre = data.filter(function(d){return d.type === "frequency";});

    // Create the word cloud
    const wordCloudLayout = d3.layout.cloud()
        .size([svgWidth, svgHeight])
        .words(filteredData.map(d => ({
            text: d.job_title,
            frequency: d.frequency
        })))
        .padding(5)
        .rotate(0)
        // .rotate(function() { return (Math.floor(Math.random() * 2)) * 90; })
        // .fontSize(function(d) { return Math.sqrt(d.frequency * 20000); }) // Adjust as needed
        // .fontSize(function(d) { return d.frequency * 9 / d3.min(data, function(fre) { return fre.frequency })})  // for wordscloud
        .fontSize(function(d) { return d.frequency * 9 / d3.min(data, function(fre) { return fre.frequency })}) 
        .on("end", draw);

    wordCloudLayout.start();

    function update(selectedGroup){

        d3.select("#word-cloud").select("svg").select("g").remove()

        temp = data.filter(function(d){return d.type === selectedGroup;});

        if (selectedGroup === "frequency"){
            rate = 9 / d3.min(data, function(temp) { return temp.frequency; });
        }
        else if(selectedGroup === "max_salary"){
            rate = 25/d3.max(data, function(temp) { return temp.frequency; });
        }
        else{
            rate = 40/d3.max(data, function(temp) { return temp.frequency; });
        }
        

        const filteredData = data.filter(d => d.type === selectedGroup);


        // if (selectedGroup === "frequency"){
        //     rate = 5000;
        // }
        // else{
        //     rate = 0.001;
        // };

        const wordCloudLayout = d3.layout.cloud()
            .size([svgWidth, svgHeight])
            .words(filteredData.map(d => ({
                text: d.job_title,
                frequency: d.frequency
            })))
            .padding(5)
            .rotate(0)
            // .rotate(function() { return (Math.floor(Math.random() * 2)) * 90; })
            // .fontSize(function(d) { return Math.sqrt(d.frequency * 20000); }) // Adjust as needed
            .fontSize(function(d) { return (d.frequency*rate) }) // for wordscloud
            .on("end", draw);
    
        wordCloudLayout.start();
    }

    d3.select("#selectButton").on("change", function(event,d) {
        const selectedOption = d3.select(this).property("value")
        update(selectedOption)
    })


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
            const tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            // tooltip.html("Job Title: " + d.text + "<br>Salary: $" + d.salary_in_usd + "<br>Frequency: %" + d.frequency)
            tooltip.html("Job Title: " + d.text + "<br> Feature:" + d.frequency)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .transition()
                .duration(10)
                .style("opacity", 0.9);
        })
        .on("mouseout", function(d) {
            // Hide the tooltip on mouseout
            d3.select(".tooltip")
                .transition()
                .duration(1)
                .style("opacity", 0)
                .remove();
        });
    }
});
