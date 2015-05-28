var Circles = new Meteor.Collection('circles');

if(Meteor.isServer){
  Meteor.startup(function(){
    if(Circles.find().count() === 0){
      Circles.insert({data: [5,8,11,14,17,20]});
    }
  });

  Meteor.setInterval(function(){
    var newData = _.shuffle(Circles.findOne().data);
    Circles.update({}, {data: newData});
  }, 2000);
}

if(Meteor.isClient){
  /*Template.vis.rendered = function(){
    var svg, width = 700, height = 75, x;

    svg = d3.select('#circles').append('svg')
        .attr('width', width)
        .attr('height', height);

    var drawCircles = function(update){
      var data = Circles.findOne().data;
      var circles = svg.selectAll('circle').data(data);

      if(!update){
        circles = circles.enter().append('circle')
            .attr('cx', function(d,i){ return x(i); })
            .attr('cy', height/2);
      }else{
        circles = circles.transition().duration(1000);
      }
      circles.attr('r', function(d){ return d; });
    };

    Circles.find().observe({
      added: function(){
        x = d3.scale.ordinal()
            .domain(d3.range(Circles.findOne().data.length))
            .rangePoints([0,width], 1);
          drawCircles(false);
      },
        changed: _.partial(drawCircles, true)
    });
  };*/

    Template.mappy.rendered = function(){

        var width = 1160,
            height = 800;

        var svg = d3.select('#na_map').append('svg')
            .attr('width', width)
            .attr('height', height);
        console.log(this);
        d3.json('assets/thd_states.json', function(error, thd_states){
            if(error)return console.error(error);
            console.log(thd_states);

            var subunits = topojson.feature(thd_states, thd_states.objects.na_states_places).features;

            var projection = d3.geo.mercator()
                .scale(300)
                .center([-105,49])
                .translate([width/2, height/2]);

            var path = d3.geo.path()
                .projection(projection);

            svg.selectAll('.subunit')
                .data(subunits)
                .enter().append('path')
                .attr('class', function(d) {
                    var classes = 'subunit ';
                    var cId = d.id.toString().substring(0,3);
                    classes += cId;
                    return classes;
                })
                .attr('d', path);
        });
    };
}