var stores_handle = Meteor.subscribe('store_status');

Template.map.onRendered(function(){

	var svg, width = window.innerWidth, height = window.innerHeight;

	svg = d3.select('#map').append('svg')
			.attr('width', width)
			.attr('height', height);
		
	var projection = d3.geo.mercator()
		.scale(700)
        .center([-100,34])
        //.center([-105,49])
		.translate([width/2, height/2]);
		
	var path = d3.geo.path().projection(projection);

    var hoverbox = d3.select('body').append('div')
        .attr('class', 'hoverbox')
        .style('opacity', 0);

    var clickbox = d3.select('body').append('div')
        .attr('class', 'clickbox')
        .style('opacity', 0)
        .on('click', function(){
            d3.select(this).transition()
                .duration(500)
                .style("opacity", 0)
                .style('pointer-events', 'none');
        });

	d3.json('/world_hi_lakes_topo.json', function(world){

		console.log(world);

        // Transforms a featureset from the topo file into an array of objects (features).
        var countries = topojson.feature(world, world.objects.countries).features;
        var us_states = topojson.feature(world, world.objects.states).features;

		svg.selectAll('.countries')
		.data(countries)
		.enter().append('path')
            .attr('stroke','white')
            .attr('class', function(d) {
                var id = d.properties.SU_A3;
                return 'countries ' + id;
            })
			.attr('d',path);

        svg.selectAll('.states')
            .data(us_states)
            .enter().append('path')
                .attr('stroke','white')
                .attr('class', function(d){
                    var id = d.properties.iso_3166_2.substr(0,2);
                    return 'states ' + id;
                })
                .attr('d',path);

		Tracker.autorun(function(){

		    // Checks to make sure data from mongo has loaded:
			if(stores_handle.ready()){


				var store_status = StoreStatus.find().fetch();

				var circles = svg.selectAll("circle")
					.data(store_status)
						.style('fill', function(d){
					        return d.status;
				        })
					    .attr('stroke', 'darkgray')
					.enter().append('circle')
						.attr('transform', function(d) {
							return 'translate(' + projection([Number(d.lng), Number(d.lat)]) + ')';
						})
						.attr('class', 'place')
						.attr('r', 4)
						.style('fill', function(d){
							return d.status;
						})
						.attr('stroke', 'darkgray')
                        .on("mouseover", function(d) {
                            hoverbox.transition()
                                .duration(200)
                                .style("opacity", .8);
                            hoverbox .html(d.num + "<br/>"  + d.status)
                                .style("left", (d3.event.pageX) + "px")
                                .style("top", (d3.event.pageY - 28) + "px");
                        })
                        .on("mouseout", function(d) {
                            hoverbox.transition()
                                .duration(500)
                                .style("opacity", 0);
                        })
                    .on('click', function(d){
                        hoverbox.style('opacity',0);
                        clickbox.transition()
                            .duration(200)
                            .style("opacity", .8);
                        clickbox .html(d.num + "<br/>"  + d.status)
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px")
                            .style('pointer-events', 'auto');
                    });
			}
		});

		
	});
}
);


