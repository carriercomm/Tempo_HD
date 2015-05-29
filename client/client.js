Meteor.subscribe('country_status');

Template.map.rendered = function(){
	var svg, width = 1200, height = 700;

	svg = d3.select('#map').append('svg')
			.attr('width', width)
			.attr('height', height);
			
	var projection = d3.geo.conicConformal()
    .rotate([98, 0])
    .center([0, 38])
    .parallels([29.5, 45.5])
    .scale(500)
    .translate([width / 2, height / 2]);
		
	var path = d3.geo.path().projection(projection);
	
	// Commented out this wrapper, I think this file should only be loaded once, on render. This will be 
	// moved to an inner location once we begin loading the store data.
	//Tracker.autorun(function(){
		
		d3.json('/thd_states.json', function(states){
			
			console.log(states);
			
			svg.selectAll('path')
			.data(topojson.feature(states, states.objects.na_states_places).features)
			.enter().append('path')
				.attr('class', function(d){ 
					var id = d.id.slice(0,3);
					var status = Countries.findOne({cid: id}).status;
					return 'cid_' + id + ' status_' + status;
				})
				.attr('d',path);
		});
		
	//});
	
};
