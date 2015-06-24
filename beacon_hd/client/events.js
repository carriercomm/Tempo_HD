/**
 * Created by JXP1195 on 6/10/2015.
 */
Template.test.events = {
    'click input.test-button' : function(){
        Meteor.call('runTestProgram');
    }
}

//Event for close button on clickbox
Template.clickbox.events = {
    'click span#close': function () {
        //Fade clickbox out
        d3.select('#clickbox').transition()
            .duration(400)
            .style('opacity',0);
        //reset html so that it doesn't repeat itself
        d3.select('#clickbox').html('<span id="close" style="cursor:pointer">X</span>').style('pointer-events','none');
        //take out dim from map
        d3.select('svg').classed('dimming',false);
    }
}

//Template.map.events = {
//    'click span#close': function () {
//        d3.select('#map').attr('class','');
//    }
//}
