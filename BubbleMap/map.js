// map.js
d3.json('gz_2010_us_050_00_500k.json').then(data => {
    const width = 960;
    const height = 600;
    const projection = d3.geoAlbersUsa().fitSize([width, height], data);
    console.log("Projection:", projection);
    const path = d3.geoPath().projection(projection);
    console.log("Map drawn");
    
    d3.select('body')
        .append('svg')
        .attr('id', 'map')  // Add this line
        .attr('width', width)
        .attr('height', height)
        .selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', 'steelblue');


    // Load the city job count and coordinates data
    d3.json('city_job_count_with_coordinates.json').then(cityData => {
        
        console.log("Loaded city data:", cityData);
        // Adding city markers
        cityData.forEach(d => {
            const coordinates = projection([d.coordinates[0], d.coordinates[1]]);
            if (coordinates) {  // Check if the coordinates are within the map
                d3.select('#map')  // Select the SVG with id 'map'
                    .append('circle')
                    .datum(d)  // Explicitly bind the data to this circle
                    .attr('cx', coordinates[0])
                    .attr('cy', coordinates[1])
                    .attr('r', Math.sqrt(d.job_count) * 2)  // Radius based on job_count
                    .attr('fill', 'red')
                    .attr('opacity', 0.6)

                    .on("mouseover", function(event) {
                        const d = d3.select(this).datum();  // Get the data bound to this element
                        // Show tooltip with city name and job count
                        d3.select("body")
                            .append("div")
                            .attr("class", "tooltip")
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 10) + "px")
                            .html(`<strong>${d.city}</strong><br/>Jobs: ${d.job_count}`);
                    })
                    
    
                    .on("mouseout", function() {
                        // Remove tooltip
                        d3.select(".tooltip").remove();
                    });

            }
        });
    });

});


