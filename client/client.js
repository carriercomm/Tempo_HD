if(Meteor.isClient){
	
  Template.map.rendered = function(){
    var svg, width = 1600, height = 1200;

    svg = d3.select('#map').append('svg')
        .attr('width', width)
        .attr('height', height);
				
		var path = d3.geo.path();
		
		// Commented out this wrapper, I think this file should only be loaded once, on render. This will be 
		// moved to an inner location once we begin loading the store data.
		//Tracker.autorun(function(){
			
			d3.json('/thd_states.json', function(states){
				
				
				console.log(states);
				
				svg.selectAll('path').data(topojson.feature(states, states.objects.na_states_places).features)
					.enter().append('path')
						.attr('d',path);
			});
			
		//});
		
  };
}