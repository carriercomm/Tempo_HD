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
                    .style("left", ((d3.event.sourceEvent.pageX) - this.offsetWidth/2)+"px");
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
        var len = d.metrics.length;
        for (var i = 0; i < len; i++) {

            if (count % 3 != 0) {
                html += '<td><b>' + d.metrics[i].name + ':</b></td><td>' + d.metrics[i].value + '</td>';
            }
            else if (count % 3 == 0 || count != 0) {
                html += '<td><b>' + d.metrics[i].name + ':</b></td><td>' + d.metrics[i].value + '</td></tr><tr>';
                clickbox.heightOfBox += 25;
            }
            count++;
        }
        clickbox.heightOfBox += 25;
        return html;
    }
};