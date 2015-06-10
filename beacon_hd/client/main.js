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
		.scale(543)
		.center([-100,46])
		.translate([width/2, height/2]);
		
	var path = d3.geo.path().projection(projection);

	d3.json('/hdgeo.json', function(states){

		console.log(states);
		
		var stores = topojson.feature(states, states.objects.store_geo_features).features;
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
								.attr('stroke', 'darkgray');
					}
				});

		
	});
}
);


