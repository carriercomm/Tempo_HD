/**
 * @author JXP1195
 */
Meteor.clickboxHeader = {
	
	clickboxHeader: function(data){
		
		var header = d3.select('#viz-header')
                    .html(
		                '<div style="font-size:200%"><b>Store '+ data.num + '</br>'+
		                '<b>NAME OF STORE HERE</b></br>' +
		                '<b>Status: '+ data.status + '</b></div></br><hr></br>'
		            );
	},
	
	reset: function(){
		var header = d3.select('#viz-header')
                    .html('');
	}
};
