setTimeout(function() {
  /////////// config ///////////////////////////
  var sizeW = 600,
    sizeH = 600,
    zoomFactor = 2;
  //////////////////////////////////////////////

  var draw = SVG('svg').size(sizeW, sizeH).viewbox(0, 0, sizeW / zoomFactor, sizeH / zoomFactor);
  draw.svg(svg);

  var hovering = false,
    connecting = false,
    connectorStart = null,
    lineObj = null,
    connectorStop = null;
  var elip = null;
  var $startingEl = null;
  var eliph = null;
  var elipw = null;
  //var svgpoint = null;

  $('ellipse').on('mouseover mouseout', function(e) {});


  $('svg').on('mousedown', function(e) {
    var point;
    if (hovering) {
      connecting = true;
      SVG.adopt($('.node')[0]).front();
      $startingEl = elip;
      elipw = (SVG.adopt($startingEl[0]).cx()) + SVG.adopt($('#first_graph')[0]).transform().x;
      eliph = (SVG.adopt($startingEl[0]).cy()) + SVG.adopt($('#first_graph')[0]).transform().y;
      $startingEl.css('opacity', 0.2);
      $startingEl.siblings().css('opacity', 0.2);
      point = {
        x: elipw,
        y: eliph
      };
      connectorStart = point;
      lineObj = draw.line(point.x, point.y, point.x, point.y)
        .stroke({
          width: 3,
          linecap: 'round',
          opacity: '0.5'
        });
    } else {
      connecting = false;
    }
  });
  $('svg').on('mouseup', function() {
    if (connecting) {
      connecting = false;
      lineObj.remove();
      lineObj = null;
      $startingEl.css('opacity', 1);
      $startingEl.siblings().css('opacity', 1);
      $startingEl.attr({
        stroke: 'black'
      });
      $startingEl = null;
    }
  });

  $('svg').on('mousemove', function(e) {
    var point = {
      x: e.offsetX / zoomFactor,
      y: e.offsetY / zoomFactor
    };

    debugger

    /*if (connecting && !hovering){
    	lineObj =draw.line(svgpoint.x,svgpoint.y, point.x, point.y)
      							.stroke({ color:'red',width: 3, linecap: 'round' }); 
      }
      else*/
    if (connecting) {
      lineObj.plot(connectorStart.x, connectorStart.y, point.x, point.y);
    };
  });

  $('svg').on('mousemove', _.debounce(function(e) {
    var point = {
      x: e.offsetX / zoomFactor,
      y: e.offsetY / zoomFactor
    };
    console.dir(e);
    hovering = false;
    var $ellipses = $('svg').find('ellipse');
    $ellipses.attr({
      stroke: 'black'
    });
    if ($startingEl) {
      $startingEl.attr({
        stroke: 'green'
      });
      /* lineObj =draw.line(svgpoint.x,svgpoint.y, point.x, point.y)
       							.stroke({ color:'red',width: 3, linecap: 'round'
       });*/
    }
    $ellipses.each(function() {
      if (hovering) return;
      var $el = $(this);
      var svgel = SVG.adopt($el[0]);
      var svgpoint = svgel.point(e.clientX, e.clientY);
      log(JSON.stringify(svgel.bbox()));
      log(JSON.stringify(svgpoint));
      if (svgel.inside(svgpoint.x, svgpoint.y)) {
        hovering = true;
        $el.attr({
          stroke: 'red'
        });
        elip = $el;
      }
    });

  }, 10));

}, 1);

log = function(x) {
  $('#log').append(x + '<br>')[0].scrollTop = 100000000;
};

svg = '<g id="first_graph" class="graph" transform="scale(1 1) rotate(0) translate(4 184)"><title>G</title><polygon fill="white" stroke="white" ></polygon><!-- Welcome --><g id="first_node" class="node"><title>Welcome</title><ellipse fill="white" stroke="black" cx="79" cy="-162" rx="48.0542" ry="18"></ellipse><text text-anchor="middle" x="79" y="-157.8" font-family="Times,serif" font-size="14.00">Welcome</text></a></g><!-- To --><g id="second_node" class="node"><title>To</title><ellipse fill="white" stroke="black" cx="79" cy="-90" rx="27" ry="18"></ellipse><text text-anchor="middle" x="79" y="-85.8" font-family="Times,serif" font-size="14.00">To</text></g><!-- Web --><g id="third_node" class="node"><title>Web</title><ellipse fill="white" stroke="black" cx="29" cy="-18" rx="28.9032" ry="18"></ellipse><text text-anchor="middle" x="29" y="-13.8" font-family="Times,serif" font-size="14.00">Web</text></g><!-- GraphViz! --><g id="fourth_node" class="node"><title>GraphViz!</title><ellipse fill="white" stroke="black" cx="129" cy="-18" rx="51.9854" ry="18"></ellipse><text text-anchor="middle" x="129" y="-13.8" font-family="Times,serif" font-size="14.00">GraphViz!</text></g></g>';