/**
 * Created by JXP1195 on 6/25/2015.
 */
//Event for close button on clickbox
Template.clickbox.events = {
    'click span#close': function () {
        //Fade clickbox out
        d3.select('#clickbox').style('pointer-events','none')
            .transition()
            .duration(400)
            .style('opacity',0)
            //reset html so that it doesn't repeat itself
            .html('<span id="close" style="cursor:pointer">X</span>');

        //take out dim from map
        //d3.select('svg').classed('dimming',false);
    }
}