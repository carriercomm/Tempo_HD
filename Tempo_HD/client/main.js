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
            .attr('r', function(d){
                if(d.status == 'RED') {
                    return 4 / s;
                }else{
                    return 3 / s;
                }
            })
            .attr('stroke-width',.7/s);

        currentScale = s;
        currentTrans = t;

    });

    svg = d3.select('#map').append('svg')
        .attr('width', width)
        .attr('height', height)
        .call(zoom);

    var g = svg.append('g');

    var clickbox = Meteor.clickbox.clickbox();

    var hoverbox = d3.select('body').append('div')
        .attr('class', 'hoverbox')
        .style('opacity', 0);

    d3.select(window).on('resize', function() {
        var dW = width - window.outerWidth;
        var dH = height - window.outerHeight;
        width = window.outerWidth;
        height = window.outerHeight;

        svg.attr('width', width).attr('height', height);

        g.attr('transform', 'translate(' + (currentTrans[0] - dW/2) + ',' + (currentTrans[1] - dH/2) + '),scale(' + currentScale + ')');
        currentTrans[0] = currentTrans[0] - dW/2;
        currentTrans[1] = currentTrans[1] - dH/2;

        clickbox.style("left", (width/2)-350 + "px")
            .style("top", height/2-250 + "px");

    });

	d3.json('/world_simplified_40.json', function(world){

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
					.data(store_status, function(d){return d.num;})
                        .sort(function(a,b){
                            if(a.status === 'RED'){
                                return 1;
                            }else{
                                return -1;
                            }
                        })
						.style('fill', function(d){
					        return d.status;
				        })
                        .attr('r', function(d){
                            if(d.status == 'RED') {
                                return 4 / currentScale;
                            }else{
                                return 3 / currentScale;
                            }
                        })
                        .each(function(d) {
                            if(d.num == Meteor.clickbox.current_store) {
                                var oldHtml = '<div id="toolbar" class="close"><span id="minimize">_ </span><span id="close">X</span></div>';
                                clickbox.html(oldHtml +
                                    '<div style="font-size:200%"><b>Store ' + d.num + '</br>' +
                                    '<b>NAME OF STORE HERE</b></br>' +
                                    '<b>Status: ' + d.status + '</b></div></br><hr></br>' +
                                    '<div style="font-size:150%"><table style="width:100%;">' + Meteor.clickbox.getMetrics(d) + '</table></div>'
                                );
                                Meteor.clickbox.current_store = d.num;
                            }
                        })
					.enter().append('circle').sort(function(a,b){
                        if(a.status === 'RED'){
                            return 1;
                        }else{
                            return -1;
                        }
                    })
						.attr('transform', function(d) {
							return 'translate(' + projection([Number(d.lng), Number(d.lat)]) + ')';
						})
						.attr('class', 'place')
						.attr('r', function(d){
                            if(d.status == 'RED') {
                                return 4 / currentScale;
                            }else{
                                return 3 / currentScale;
                            }
                        })
						.style('fill', function(d){
							return d.status;
						})
						.attr('stroke', 'darkgray')
                        .attr('stroke-width',.7/currentScale)
                        .on("mouseover", function(d) {
                            hoverbox.transition()
                                .duration(200)
                                .style("opacity", .8);
                            hoverbox.html(d.num + "<br/>"  + d.status)
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
                                .duration(400)
                                .style("opacity", .9);

                            //Need to add additional html generated by code to existing html in div (X button-close)
                            var oldHtml = '<div id="toolbar" class="close"><span id="minimize">_ </span><span id="close">X</span></div>';
                            clickbox.attr('class','clickbox')
                                .html( oldHtml +
                                    '<div style="font-size:200%"><b>Store '+ d.num + '</br>'+
                                    '<b>NAME OF STORE HERE</b></br>' +
                                    '<b>Status: '+ d.status + '</b></div></br><hr></br>' +
                                    '<div style="font-size:150%"><table style="width:100%;">' + Meteor.clickbox.getMetrics(d) + '</table></div>'
                                )
                                .style('height',clickbox.heightOfBox + 'px')
                                .style('pointer-events', 'auto');

                            if(clickbox.style("opacity") == 0){
                                clickbox.style("left", (width/2)-350 + "px")
                                    .style("top", height/2-250 + "px");
                            }
                            //Dim background while clickbox is open
                            //svg.attr('class','dimming');

			                Meteor.clickbox.current_store = d.num;
                        });
			}
		});
	});
});


