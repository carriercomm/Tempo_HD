var stores_handle = Meteor.subscribe('store_status');

Template.map.onRendered(function(){

	var svg, width = window.outerWidth,
        height = window.outerHeight,
        currentScale = 2,
        currentTrans = [0,0];
		
	var projection = d3.geo.mercator()
		.scale(width/2/Math.PI)
        .rotate([100,0])
        .center([0,34])
		.translate([width/2/currentScale, height/2/currentScale]);
		
	var path = d3.geo.path().projection(projection);

    var zoom = d3.behavior.zoom().translate(currentTrans).scale(currentScale).scaleExtent([2, 100]).on('zoom', function(){
        var t = d3.event.translate;
        var s = d3.event.scale;

        /*var w_max = 0;
        var w_min = width * (1 - s);
        var h_max = height < s*width/2 ? s*(width/2-height)/2 : (1-s)*height/2;
        var h_min = height < s*width/2 ? -s*(width/2-height)/2-(s-1)*height : (1-s)*height/2;

        t[0] = Math.min(w_max, Math.max(w_min, t[0]));
        t[1] = Math.min(h_max, Math.max(h_min, t[1]));*/

        //zoom.translate(t);

        //var yaw = projection.rotate()[0];
        //projection.rotate([yaw+360.*t[0]/width/s, 0, 0]);

        g.attr('transform', 'translate(' + t + '),scale(' + s + ')');
        g.selectAll('path').style('stroke-width', .5 / s + 'px');
        g.selectAll('circle')
            .attr('r', 3/s)
            .attr('stroke-width',.7/s);

        currentScale = s;
        currentTrans = t;

    });

    svg = d3.select('#map').append('svg')
        .attr('width', width)
        .attr('height', height)
        .call(zoom);

    var g = svg.append('g');

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

    d3.select(window).on('resize', function() {
        var dW = width - window.outerWidth;
        var dH = height - window.outerHeight;
        width = window.outerWidth;
        height = window.outerHeight;

        svg.attr('width', width).attr('height', height);

        g.attr('transform', 'translate(' + (currentTrans[0] - dW/2) + ',' + (currentTrans[1] - dH/2) + '),scale(' + currentScale + ')');
        currentTrans[0] = currentTrans[0] - dW/2;
        currentTrans[1] = currentTrans[1] - dH/2;

        //console.log(g.attr('transform'));

        /*g.selectAll('circle')
            .attr('transform', function(d) {
                return 'translate(' + projection([Number(d.lng), Number(d.lat)]) + ')';
            })
            .attr('r', 3/currentScale);*/

    });

	d3.json('/world_hi_lakes_topo.json', function(world){

		console.log(world);

        // Transforms a featureset from the topo file into an array of objects (features).
        var countries = topojson.feature(world, world.objects.countries).features;
        var us_states = topojson.feature(world, world.objects.states).features;

		g.selectAll('.countries')
		.data(countries)
		.enter().append('path')
            .attr('stroke','white')
            .attr('class', function(d) {
                var id = d.properties.SU_A3;
                return 'countries ' + id;
            })
			.attr('d',path);

        g.selectAll('.states')
            .data(us_states)
            .enter().append('path')
                .attr('stroke','white')
                .attr('class', function(d){
                    var id = d.properties.iso_3166_2.substr(0,2);
                    return 'states ' + id;
                })
                .attr('d',path);

        g.attr('transform', 'translate(0,0),scale(2)');
        g.selectAll('path').style('stroke-width', .5 / currentScale + 'px');

		Tracker.autorun(function(){

		    // Checks to make sure data from mongo has loaded:
			if(stores_handle.ready()){

				var store_status = StoreStatus.find().fetch();

				var circles = g.selectAll("circle")
					.data(store_status)
						.style('fill', function(d){
					        return d.status;
				        })
					.enter().append('circle')
						.attr('transform', function(d) {
							return 'translate(' + projection([Number(d.lng), Number(d.lat)]) + ')';
						})
						.attr('class', 'place')
						.attr('r', 3/currentScale )
						.style('fill', function(d){
							return d.status;
						})
						.attr('stroke', 'darkgray')
                        .attr('stroke-width',.7/currentScale)
                        .on("mouseover", function(d) {
                            hoverbox.transition()
                                .duration(200)
                                .style("opacity", .8);
                            hoverbox .html(d.num + "<br/>"  + d.status)
                                .style("left", (d3.event.pageX) + "px")
                                .style("top", (d3.event.pageY - 28) + "px");
                        })
                        .on("mouseout", function() {
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
});


