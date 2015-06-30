/**
 * Created by JXP1195 on 6/25/2015.
 */

Meteor.clickbox = {

    clickbox : function(){
        var clickbox =  d3.select('#clickbox');
        var drag = d3.behavior.drag()
            .on("drag", function() {
                d3.select(this)
                    .style("top", ((d3.event.sourceEvent.pageY) - this.offsetHeight/2)+"px")
                    .style("left", ((d3.event.sourceEvent.pageX) - this.offsetWidth/2)+"px")
            });
        clickbox.call(drag);
        return clickbox;
    },

    //Gets metrics from json
    getMetrics : function(d){

        var html = '';
        //Set initial height of div for clickbox to account for Store Number, Name, etc.
        clickbox.heightOfBox = 125;
        var count = 1;
        //Create rows of 3 metrics
        for (metric in d.metrics) {

            if (count % 3 != 0) {
                html += '<td><b>' + metric + ':</b></td><td>' + d.metrics[metric] + '</td>';
            }
            else if (count % 3 == 0 || count != 0) {
                html += '<td><b>' + metric + ':</b></td><td>' + d.metrics[metric] + '</td></tr><tr>';
                clickbox.heightOfBox += 25;
            }
            count++;
        }
        clickbox.heightOfBox += 25;
        return html;
    }
}