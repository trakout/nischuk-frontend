function homeMenu() {
  var hMenu = $('.robotJazz a'),
  itsWide = hMenu.width(),
  itsHigh = hMenu.height(),
  hmOne = Raphael(hMenu.get(0), itsWide, itsHigh),
  hmTwo = Raphael(hMenu.get(1), itsWide, itsHigh),
  hmThree = Raphael(hMenu.get(2), itsWide, itsHigh),
  hmFour = Raphael(hMenu.get(3), itsWide, itsHigh),
  hMenuPath = 'M 187.455,-9.316 126.078,-9.316 112.372,-9.316 -13.908,-9.316 -33.446,-9.316 -88.991,-9.316 -127.726,49.542 -91.386,108.426 -38.534,108.426 -16.301,108.426 109.977,108.426 120.993,108.426 185.062,108.426 223.797,49.54 z';


  hmOne
  .setViewBox(-130, -10, itsWide, itsHigh, true)
  .path(hMenuPath)
  .attr({fill: '#EBD2B5'}),
  hmTwo
  .path(hMenuPath)
  .attr({fill: '#EBD2B5'}),
  hmThree
  .path(hMenuPath)
  .attr({fill: '#EBD2B5'}),
  hmFour
  .path(hMenuPath)
  .attr({fill: '#EBD2B5'});

}



function cubeConstruct() {
  var hiveMind, cube;

  hive = $('.bitcoin');
  hive.mind = 0;

  cube = $('.cube');
  cube.trace = 0;
  cube.front = $('.front');
  cube.left = $('.left');
  cube.top = $('.top');
  cube.right = $('.right');
  cube.back = $('.back');
  cube.bottom = $('.bottom');
  cube.width = $(window).width();
  cube.height = $(window).height();
  cube.transTime = 0.6;
  cube.gravity = 1;
  cube.traceR = 0;
  cube.traceX = 0;
  cube.traceY = 0;
  cube.sideTrack = 1;
  var tempRotX = 0;

  var cubeFaces = [cube.front, cube.left, cube.top, cube.right, cube.back, cube.bottom];

  cube.swingSide = function(di) {
    cube.trace += (di * cube.gravity);
    cube.sideTrack *= -1;

    switch(di * cube.gravity) {
      case -90:
        hive.mind += cube.width;
        cube.traceMid = (cube.trace + 45);
        break;
      case 90:
        hive.mind -= cube.width;
        cube.traceMid = (cube.trace - 45);
        break;
    }

    cube.shift = new TimelineMax();
      cube.shift.to(cube, cube.transTime / 2.2, {opacity:0.5, rotationY: cube.traceMid, z:-400, transformOrigin:"center center " + (-(cube.width / 2)), ease:Power1.easeIn});
      cube.shift.to(cube, cube.transTime / 2, {opacity:0.9, rotationY: cube.trace, z:0, transformOrigin:"center center " + (-(cube.width / 2)), ease:Power1.easeOut});
  };
  cube.swingOver = function() {

    if (cube.sideTrack === 1) {
      cube.traceY -= 180;
      cube.traceR -= 180;
      cube.traceYMid = (cube.traceY + 90);
      cube.traceRmid = (cube.traceR  + 90);
      cube.traceX = cube.traceY;

      if (((cube.traceR / 180) % 2) === 0) {
        cube.gravity = 1;
      } else {
        cube.gravity = -1;
      }

      // console.log('x: ' + cube.traceX + ' y: ' + cube.traceY + ' r: ' + cube.traceR);

      cube.shiftOver = new TimelineMax();
        cube.shiftOver.to(cube, cube.transTime, {rotation:cube.traceRmid, z:0, transformOrigin:"center center " + (-(cube.width / 2)), ease:Power1.easeIn});
        cube.shiftOver.to(cube, cube.transTime, {rotation:cube.traceR, z:0, transformOrigin:"center center " + (-(cube.width / 2)), ease:Power1.easeOut});
      cube.shift = new TimelineMax();
        cube.shift.to(cube, cube.transTime, {rotationX:cube.traceYMid, z:-400, transformOrigin:"center center " + (-(cube.width / 2)), ease:Power1.easeIn});
        cube.shift.to(cube, cube.transTime, {rotationX:cube.traceY, z:0, transformOrigin:"center center " + (-(cube.width / 2)), ease:Power1.easeOut});
    } else {
      cube.swingSide(90);
      cube.swingOver();
      cube.swingSide(-90);
    }
  };


  var grabKey = function(e) {
    e = e || window.event;
    switch(e.keyCode) {
      case 38: // up
        cube.swingOver();
        break;
      case 40: // down
        cube.swingOver();
        break;
      case 37: // left
        cube.swingSide(90);
        break;
      case 39: //right
        cube.swingSide(-90);
        break;
    }
  };


  




  TweenMax.set(($('.measure')), {perspective:1000});

  TweenMax.set(cube, {transformStyle: 'preserve-3d', rotationY: 0, rotationX: 0});
  TweenMax.set($('.cube div'), {transformStyle: 'preserve-3d', x:0, y:0, z:-100});

  TweenMax.set(cube.front, {rotationY:0, x:0, y:0, z:0, transformOrigin:"left top"});
  TweenMax.set(cube.left, {rotationY:-90, x:0, y:0, z:-(cube.width), transformOrigin:"left top"});
  TweenMax.set(cube.top, {rotationX:90, x:0, y:0, z:-(cube.width),transformOrigin:"left top", height: (cube.width)});
  TweenMax.set(cube.right, {rotationY:90, x:0, y:0, z:-(cube.width),transformOrigin:"right top"});
  TweenMax.set(cube.back, {rotationY:180, x:0, y:0, z:-(cube.width), transformOrigin:"50% 50%"});
  TweenMax.set(cube.bottom, {rotationX:90, x:0, y:(cube.height), z:-(cube.width),transformOrigin:"left top", height: (cube.width)});
  // TweenMax.set(cube.control, {x:0, y:0, z:-(cube.width / 2), transformOrigin: 'center center'});

  
  homeMenu();

  // TweenMax.to(cube, 2, {rotationY: -270, rotationX: 0, z:-500, transformOrigin:"center center " + (-(cube.width / 2))});
  // TweenMax.to(cube, 3, {rotationY: -360, rotationX: 0, z:0, transformOrigin:"center center " + (-(cube.width / 2))});
  document.onkeydown = grabKey;

  // Lighting
  // function renderLight() {
  //   sshine.rrender(llight, true);
  //   console.log('whooo');
  // }

  // var llight = new Photon.Light(x = 45, y = -180, z = -100),
  // sshine = new Photon.FaceGroup($('.cube')[0], $('.cube .face'), .6, .1, false);
  
  // renderLight();
}




$(document).ready(cubeConstruct);

$(window).load(function() {
  
  // back.fadeOut('slow');
});