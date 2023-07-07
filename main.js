var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-70, 0])
    .html(function(d) {
        return d['movie_title']+'('+d['content_rating']+')';
    });

var svg = d3.select('svg');

// Call the Tooltip
svg.call(toolTip);

// ################################### Other Vars #######################################

// Get layout parameters
var svgWidth = +svg.attr('width')/2;
var svgHeight = +svg.attr('height')/2;

var padding = {t: 60, r: 40, b: 30, l: 40};

// scatter chart dimensions 
var chartWidth = 900;
var chartHeight = 700;

// Bar Chart dimensions
var barChartHeight = 400;
var barChartWidth = 550;

// Create a group element for appending chart elements
var chartGScatter = svg.append('g')
    .attr('transform', 'translate('+[padding.l + 40 , padding.t]+')');
var legendG = svg.append('g')
    .attr('transform', 'translate('+[padding.l + 60 + chartWidth, padding.t]+')');
var chartGBar = svg.append('g')
    .attr('transform', 'translate('+[padding.l + 90 + chartWidth, padding.t + 300]+')');

// Scatterplot Scale
var xScatter = d3.scaleLinear().range([ 0, chartWidth ]);
var yScatter = d3.scaleLinear().range([chartHeight, 0]);

// Global Data
var movieData;
var colorScale;
var yearsData = ["2010", "2011", "2012", "2013", "2014", "2015", "2016"];



// ################################### Functions #######################################

// recall that when data is loaded into memory, numbers are loaded as strings
function dataPreprocessor(row) {
    return {
        'color': row['color'],
        'director_name': +row['director_name'],
        'num_critic_for_reviews': +row['num_critic_for_reviews'],
        'duration': +row['duration'],
        'director_facebook_likes': +row['director_facebook_likes'],
        'actor_3_facebook_likes': +row['actor_3_facebook_likes'],
        'actor_2_name': +row['actor_2_name'],
        'actor_1_facebook_likes': +row['actor_1_facebook_likes'],
        'gross': +row['gross'],
        'genres': +row['genres'],
        'actor_1_name': +row['actor_1_name'],
        'movie_title': row['movie_title'],
        'num_voted_users': +row['num_voted_users'],
        'cast_total_facebook_likes': +row['cast_total_facebook_likes'],
        'actor_3_name': +row['actor_3_name'],
        'facenumber_in_poster': +row['facenumber_in_poster'],
        'plot_keywords': +row['plot_keywords'],
        'movie_imdb_link': +row['movie_imdb_link'],
        'num_user_for_reviews': +row['num_user_for_reviews'],
        'language': +row['language'],
        'country': +row['country'],
        'content_rating': row['content_rating'],
        'budget': +row['budget'],
        'title_year': +row['title_year'],
        'actor_2_facebook_likes': +row['actor_2_facebook_likes'],
        'imdb_score': +row['imdb_score'],
        'aspect_ratio': +row['aspect_ratio'],
        'movie_facebook_likes': +row['movie_facebook_likes']
    };
}

// Maps selection to a actual datafield name
function nameDataMap(input) {
    if (input == "Duration") {
        return "duration";
    } else if (input == "Aspect Ratio") {
        return "aspect_ratio";
    } else if (input == "IMDb Score") {
        return "imdb_score";
    } else if (input == "Budget") {
        return "budget";
    } else if (input == "Gross") {
        return "gross";
    } else if (input == "Number of Users for Reviews") {
        return "num_user_for_reviews";
    } else if (input == "Number of Faces in Poster") {
        return "facenumber_in_poster";
    } else if (input == "Number of Voted Users") {
        return "num_voted_users";
    }
}

// ################################# Legend Code ####################################

legendG.append("text").attr('transform', 'translate('+[padding.l + 10, 0]+')').text("Movie Year").style("font-size", "20px");

legendG.append("circle").attr('transform', 'translate('+[padding.l + 20, 25]+')').attr("r", 6).style("fill", "#4e79a7");
legendG.append("text").attr('transform', 'translate('+[padding.l + 30, 25]+')').text("2010").style("font-size", "17px").attr("alignment-baseline","middle");

legendG.append("circle").attr('transform', 'translate('+[padding.l + 20, 55]+')').attr("r", 6).style("fill", "#f28e2c");
legendG.append("text").attr('transform', 'translate('+[padding.l + 30, 55]+')').text("2011").style("font-size", "17px").attr("alignment-baseline","middle");

legendG.append("circle").attr('transform', 'translate('+[padding.l + 20, 85]+')').attr("r", 6).style("fill", "#e15759");
legendG.append("text").attr('transform', 'translate('+[padding.l + 30, 85]+')').text("2012").style("font-size", "17px").attr("alignment-baseline","middle");

legendG.append("circle").attr('transform', 'translate('+[padding.l + 20, 115]+')').attr("r", 6).style("fill", "#76b7b2");
legendG.append("text").attr('transform', 'translate('+[padding.l + 30, 115]+')').text("2013").style("font-size", "17px").attr("alignment-baseline","middle");

legendG.append("circle").attr('transform', 'translate('+[padding.l + 20, 145]+')').attr("r", 6).style("fill", "#59a14f");
legendG.append("text").attr('transform', 'translate('+[padding.l + 30, 145]+')').text("2014").style("font-size", "17px").attr("alignment-baseline","middle");

legendG.append("circle").attr('transform', 'translate('+[padding.l + 20, 175]+')').attr("r", 6).style("fill", "#edc949");
legendG.append("text").attr('transform', 'translate('+[padding.l + 30, 175]+')').text("2015").style("font-size", "17px").attr("alignment-baseline","middle");

legendG.append("circle").attr('transform', 'translate('+[padding.l + 20, 205]+')').attr("r", 6).style("fill", "#af7aa1");
legendG.append("text").attr('transform', 'translate('+[padding.l + 30, 205]+')').text("2016").style("font-size", "17px").attr("alignment-baseline","middle");


// ################################### CSV  #######################################

d3.csv('data.csv', dataPreprocessor).then(function(dataset) {
// Data Code
    movieData = dataset;
    colorScale = d3.scaleOrdinal().domain(yearsData).range(["#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f","#edc949","#af7aa1"]);
    
    // Call the Tooltip
    svg.call(toolTip);
    updateScatterPlot('duration','imdb_score', 'All');
});

// ################################# Scatter Plot Chart Draw Funciton ##########################################
function updateScatterPlot(xAxisSelection, yAxisSelection, yearSelection) {
    // Data for Scatterplot
    var movieDataFiltered;

    // Figure out whether to filter the data or not
    if (yearSelection == 'All') {
        movieDataFiltered = movieData;
    } else { // Filter Data Set based on the year selection
        var yearS = parseInt(yearSelection);
        movieDataFiltered = movieData.filter(function (d) { return d['title_year'] == yearS; });
    }

    // Add Axes imdb_score
    // X Axis
    xScatter.domain([d3.min(movieDataFiltered, function(d) { return d[xAxisSelection] - 1}), d3.max(movieDataFiltered, function(d) { return d[xAxisSelection] + 1})]);
    chartGScatter.append("g")
            .attr("transform", "translate(0," + (chartHeight) + ")")
            .call(d3.axisBottom(xScatter));

    // Y Axis
    yScatter.domain([d3.min(movieDataFiltered, function(d) { return d[yAxisSelection] - 1}), d3.max(movieDataFiltered, function(d) { return d[yAxisSelection] + 1})]);
    chartGScatter.append("g")
            .call(d3.axisLeft(yScatter));

    // Add Dots
    var dots = chartGScatter.append('g')
        .selectAll("dot")
        .attr("class", "dot")
        .data(movieDataFiltered)
        .enter()
        .append("circle")
          .attr("cx", function (d) { return xScatter(d[xAxisSelection]); } )
          .attr("cy", function (d) { return yScatter(d[yAxisSelection]); } )
          .attr("r", 3)
          .attr("fill", function(d) { return colorScale(d['title_year']); });
    
    // Remove Bar Chart on Double click
    dots.on('dblclick', function(d, i) {
        chartGBar.selectAll("*").remove();
    });

    // Hover and Show Names
    dots.on('mouseover', toolTip.show)
        .on('mouseout', toolTip.hide);

    // Click and draw barchart
    dots.on('click', function(d, i) {
        chartGBar.selectAll("*").remove();
        drawBarChart(d, d['movie_title']);
    });

}


// ############################## On Demand Bar Chart Draw Function #############################################

function drawBarChart(data, movieName) {
    var barChartData = {
        'actor_1_facebook_likes' : data.actor_1_facebook_likes,
        'actor_2_facebook_likes': data.actor_2_facebook_likes,
        'actor_3_facebook_likes': data.actor_3_facebook_likes,
        'director_facebook_likes' : data.director_facebook_likes,
        'cast_total_facebook_likes' : data.cast_total_facebook_likes,
        'movie_facebook_likes' : data.movie_facebook_likes,

    };

    // Variables to assist with Bar Chart Drawing
    var names = Object.keys( barChartData );
    var val = Object.keys( barChartData ).map(function ( key ) { return barChartData[key]; });
    var min = Math.min.apply( null, val );
    var max = Math.max.apply( null, val );


    // Title
    chartGBar.append("text")
       .attr("transform", "translate(-45,-70)")
       .attr("x", 50)
       .attr("y", 50)
       .attr("font-size", "24px")
       .text(movieName);

    // X Axis Scale
    var xScaleBar = d3.scaleLinear()
        .domain([0, max])
        .range([0, barChartWidth]);

    // Y Axis Scale
    var yScaleBar = d3.scaleBand()
        .range([ 0, barChartHeight ])
        .domain(names)
        .padding(.1);


    // Append Axes 
    chartGBar.append("g")
        .attr("transform", "translate(0," + barChartHeight + ")")
        .call(d3.axisBottom(xScaleBar));
    chartGBar.append("g")
        .call(d3.axisLeft(yScaleBar));

    // Bars
    var bars = chartGBar.selectAll("bars")
        .data(val)
        .enter()
        .append("rect")
        .attr("x", xScaleBar(0))
        .attr("width", function(d) { return xScaleBar(d); })
        .attr("height", yScaleBar.bandwidth());
    bars.data(names)
        .attr("y", function(d) { return yScaleBar(d) + 1; });
}


// ################################### Event Listeners #######################################

// When the dropdown is changed, run the updateChart function
d3.select("#xSelector").on("change", function(d) {
    var xCategory = d3.select(this).property("value");
    var yCategory = d3.select("#ySelector").property("value");
    var yearNum = d3.select("#yearSelector").property("value");
    // Clear the old chart
    chartGScatter.selectAll("*").remove();
    // Draw the new chart
    updateScatterPlot(nameDataMap(xCategory), nameDataMap(yCategory), yearNum);
});

// When the dropdown is changed, run the updateChart function
d3.select("#ySelector").on("change", function(d) {
    var xCategory = d3.select("#xSelector").property("value");
    var yCategory = d3.select(this).property("value");
    var yearNum = d3.select("#yearSelector").property("value");
    // Clear the old chart
    chartGScatter.selectAll("*").remove();
    // Draw the new chart
    updateScatterPlot(nameDataMap(xCategory), nameDataMap(yCategory), yearNum);
});

// When the dropdown is changed, run the updateChart function
d3.select("#yearSelector").on("change", function(d) {
    var xCategory = d3.select("#xSelector").property("value");
    var yCategory = d3.select("#ySelector").property("value");
    var yearNum = d3.select(this).property("value");
    // Clear the old chart
    chartGScatter.selectAll("*").remove();
    // Draw the new chart
    updateScatterPlot(nameDataMap(xCategory), nameDataMap(yCategory), yearNum);
});

