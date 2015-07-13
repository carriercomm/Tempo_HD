/**
 * @author JXP1195
 */
Meteor.simpleGuage = {
	simpleGuage : function(data) {
		
		var radius = 54,
		    padding = 7,
		    startAng = -120,
		    endAng = 120;

		var color = d3.scale.linear()
    		.domain([0,50,100])
    		.range(["green", "yellow", "red"]);

		var background_arc = d3.svg.arc()
		    .outerRadius(radius)
		    .innerRadius(radius - 20)
		    .startAngle(startAng * Math.PI / 180)
			.endAngle(endAng * Math.PI / 180);
			
		var arc = d3.svg.arc()
			.innerRadius(radius - padding)
			.outerRadius(radius)
			;
		
		var foreground_arc = d3.svg.arc()
		    .outerRadius(radius)
		    .innerRadius(radius - 20)
		    .startAngle(startAng * Math.PI / 180); 
		
		var svg = d3.select('#viz-container').selectAll('.simple-guage')
				.data(data)
			.enter().append('svg')
				.attr('class', '.simple-guage')
				.attr('width', radius * 2)
				.attr('height', radius * 2)
				.style('padding', 10);
				
		var g = svg.append("g")
 		    .attr("transform", "translate(" + radius + "," + radius + ")");
			
		var bg = g.append("path")
		    .attr("class", "b-arc")
		    .attr("d", background_arc)
		    .style("fill", '#eee');
		    
		var fg = g.append("path")
	        .datum(function(d){
	      	var percentage = d.value / 100;
	      	percentage_in_degrees = 240 * percentage;
	      	adjusted_degrees = percentage_in_degrees - 120;
	      	percentage_in_radians = adjusted_degrees * (Math.PI/180);
	      	return {
	      		value: d.value,
	      		endAngle: percentage_in_radians
	      		};
	        })
	        .attr("class", "f-arc")
	        .attr("d", foreground_arc)
	        .style("fill", function(d){ 
	      	console.log(d.value + ' ' + color(d.value));
	      	return color(d.value); 
	      	})
	        .transition()
	        	.duration(1000)
	      		.call(arcTween, function(d){ return d.value; });
		
		g.append("text")
      		.attr("dy", ".38em")
      		.style("text-anchor", "middle")
      		.style('font-weight', 'bold')
      		.text(function(d) { return d.name; });
      		
      	function arcTween(transition, newAngle){
    	
	    	transition.attrTween('d', function(d){
	    		var interpolate = d3.interpolate(startAng * Math.PI / 180, d.endAngle);
	    		
	    		return function(t){
	    			d.endAngle = interpolate(t);
	    			
	    			return foreground_arc(d);
	    		};
	    	}); 	
    	}
				
	},
	
	reset: function(){	
		var svg = d3.select('#viz-container')
			.html('');	
	}
};
