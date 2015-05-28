
if(Meteor.isServer){
  
}

if(Meteor.isClient){
	
  Template.map.rendered = function(){
    var svg, width = 1200, height = 800;

    svg = d3.select('#map').append('svg')
        .attr('width', width)
        .attr('height', height);
		
		Tracker.autorun(function(){
			d3.json('public/thd_states.json', function(states){
				//var path = d3.geo.path();
				
				console.log(states);
				
				//svg.selectAll('path').data(states)
			});
			
		});
		
  };
}