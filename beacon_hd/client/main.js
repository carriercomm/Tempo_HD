var stores_handle = Meteor.subscribe('store_status');

Template.map.onRendered(function(){

	var svg, width = window.innerWidth, height = window.innerHeight;

	svg = d3.select('#map').append('svg')
			.attr('width', width)
			.attr('height', height);

	// Different projection, looks a little funky on the edges,
	// might be good for a USA only map.
	/*var projection = d3.geo.conicConformal()
    .rotate([98, 0])
    .center([0, 38])
    .parallels([29.5, 45.5])
    .scale(500)
    .translate([width / 2, height / 2]);*/
		
	var projection = d3.geo.mercator()
		.scale(723)
		.center([-100,44])
		.translate([width/2, height/2]);
		
	var path = d3.geo.path().projection(projection);

    var hoverbox = d3.select('body').append('div')
        .attr('class', 'hoverbox')
        .style('opacity', 0);

    var clickbox = d3.select('body').append('div')
        .attr('class', 'clickbox')
        .style('opacity', 0)
        .on('click', function(){
			svg.attr('class','');
            d3.select(this).transition()
                .duration(500)
                .style("opacity", 0)
                .style('pointer-events', 'none');
        });
		clickbox.heightOfBox = 0;
		clickbox.getMetrics = function (d){
			var html='';
			clickbox.heightOfBox = 0;
			var count = 1;
			for(metric in d.metrics) {

				if (count % 3 != 0) {
					html += '<td><b>' + metric + ':</b></td><td>' + d.metrics[metric] + '</td>';
				}
				else if (count % 3 == 0 || count != 0) {
					html += '<td><b>' + metric + ':</b></td><td>' + d.metrics[metric] + '</td></tr><tr>';
					clickbox.heightOfBox += 60;
				}
				count++;
			}
			return html;
		}

	d3.json('/hdgeo.json', function(states){

		console.log(states);
		
		//var stores = topojson.feature(states, states.objects.store_geo_features).features;
		var political_borders_01 = topojson.feature(states, states.objects.world).features;

		svg.selectAll('path')
		.data(political_borders_01)
		.enter().append('path')
			.attr('class', function(d){
				var id = d.properties.SU_A3;
				return 'cid_' + id;
			})
			.attr('d',path);

		Tracker.autorun(function(){
			if(stores_handle.ready()){
			// Checks to make sure data from mongo has loaded:

				var store_status = StoreStatus.find().fetch();

				var circles = svg.selectAll("circle")
					.data(store_status)
						.style('fill', function(d){

					//var status = StoreStatus.find({num: d.properties.num}).fetch()[0];
					return d.status;
					/*if (status) {
					 //console.log(status);
					 return status.status;
					 } else {
					 return 'GREEN';
					 }*/
				})
					.attr('stroke', 'darkgray')
					.enter().append('circle')
						.attr('transform', function(d) {
							//var coords = d.geometry.coordinates;
							//console.log(d);
							//console.log(Number(d.lng) + ' ' + Number(d.lat));
							return 'translate(' + projection([Number(d.lng), Number(d.lat)]) + ')';
						})
						.attr('class', 'place')
						.attr('r', 4)
						//.style('fill', '#76FF03')
						// Sample meteor code to bind the pin color to values in the mongodb
						.style('fill', function(d){

							//var status = StoreStatus.find({num: d.properties.num}).fetch()[0];
							return d.status;
							/*if (status) {
								//console.log(status);
								return status.status;
							} else {
								return 'GREEN';
							}*/
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
                        clickbox .html(
							'<div style="text-align:center;font-size:200%"><b>Store '+ d.num +
							//'<span id="close" onclick="buttonClose()">x</span>' +
							'</b>' +
								'</br>'+
							'<b>NAME OF STORE HERE</b></br>' +
							'<b>Status: '+ d.status + '</b></br></br></div>' +
							'<div style="font-size:150%"><table style="width:100%">' + clickbox.getMetrics(d) + '</table></div>'
						)
                            .style("left", (width/2)-350 + "px")
                            .style("top", height/2-250 + "px")
							.style('height',clickbox.heightOfBox + 'px')
                            .style('pointer-events', 'auto');
						svg.attr('class','dimming');
							//.style("position","fixed")
							//.style("width","100%")
							//.style("height","100%")
							//.style("top","0")
							//.style("left","0")
							//.style("opacity",0.6);
                    });
			}
		});

		
	});
}
);


