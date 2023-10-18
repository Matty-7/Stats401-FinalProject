
d3.json('gz_2010_us_050_00_500k.json').then(data => {
    const width = 960;
    const height = 600;
    const projection = d3.geoAlbersUsa().fitSize([width, height], data);
    console.log("Projection:", projection);
    const path = d3.geoPath().projection(projection);
    console.log("Map drawn");
    
    d3.select('body')
        .append('svg')
        .attr('id', 'map')
        .attr('width', width)
        .attr('height', height)
        .selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', 'steelblue');

    function drawCities(cityData, filter) {
        // Remove existing circles first
        d3.selectAll("circle").remove();
    
        // Filter data based on the job count
        let filteredData = cityData;
        if (filter !== "all") {
            const [min, max] = filter.split("-").map(Number);
            filteredData = cityData.filter(d => d.job_count >= min && d.job_count <= max);
        }
        
        // Draw circles (existing code)
        filteredData.forEach(d => {
            const coordinates = projection([d.coordinates[0], d.coordinates[1]]);
            if (coordinates) {
                d3.select('#map')
                    .append('circle')
                    .datum(d)
                    .attr('cx', coordinates[0])
                    .attr('cy', coordinates[1])
                    .attr('r', Math.sqrt(d.job_count) * 2)
                    .attr('fill', 'red')
                    .attr('opacity', 0.6)
                    .on("mouseover", function(event) {
                        const d = d3.select(this).datum();
                        d3.select("body")
                            .append("div")
                            .attr("class", "tooltip")
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 10) + "px")
                            .html(`<strong>${d.city}</strong><br/>Jobs: ${d.job_count}`);
                    })
                    .on("mouseout", function() {
                        d3.select(".tooltip").remove();
                    });
            }
        });
    }
    
    // Load the city job count and coordinates data
    d3.json('city_job_count_with_coordinates.json').then(cityData => {
        drawCities(cityData, "all");  // Draw all cities by default

        // Add event listener for the dropdown
        d3.select("#jobCountFilter").on("change", function() {
            const selectedValue = d3.select(this).property("value");
            drawCities(cityData, selectedValue);
        });
    });
});
