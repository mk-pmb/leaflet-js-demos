/* -*- coding: UTF-8, tab-width: 2 -*- */
/*jslint indent: 2, maxlen: 80, browser: true */
(function () {
  'use strict';
  var L = window.L, llDemo = window.llDemo;

  function tileMarks(tl) {
    var where = [tl.x, ':', tl.y, '@', tl.z].join(''),
      marks = tileMarks[where];
    if ('function' === typeof marks) { marks = marks(tl, where); }
    if ('string' === typeof marks) {
      marks = (tileMarks.prefixAll || '') + marks;
      marks += (tileMarks.suffixAll || '');
      marks = llDemo.svgExtend(marks, { fmt: 'url' });
      return marks;
    }
    return '';
  }
  tileMarks.prefixAll = '{circle- r!5px fill!none stroke!black ' +
    'stroke-width!1px}';
  tileMarks.circ = function (latlon, color) {
    var tile, zoom, prec = 0;
    color = 'fill=' + color + ' /}';
    if ('string' === typeof latlon) { latlon = llDemo.locations[latlon]; }
    for (zoom = 0; zoom < 18; zoom += 1) {
      tile = llDemo.latlon2tilefrac(zoom, latlon[0], latlon[1]);
      tile.circ = '{circle cx=' + ((tile.x % 1) * 100).toFixed(prec) +
        '% cy=' + ((tile.y % 1) * 100).toFixed(prec) + '% ' + color;
      tileMarks[tile.name] = (tileMarks[tile.name] || '') + tile.circ;
    }
  };
  tileMarks.circ('brussels', 'yellow');
  tileMarks.circ('hobart', 'red');

  function initMap(map) {
    var tileOpts = {}, mapOpts, effects;
    mapOpts = { center: 'brussels', zoom: 8,
      attributionControl: true, zoomControl: true, };
    if ('string' === typeof map) { map = document.getElementById(map); }

    effects = [map.id, map.className];
    switch (map.id) {
    case 'query':
      effects[0] = String(location.search).replace(/[?&,]+/g, '  '
        ).replace(/=/g, '-');
      break;
    }
    effects = llDemo.dashOpts(effects);
    effects.scanNum(/ tilesize-(\d+) /, tileOpts, 'tileSize');
    effects.scanNum(/ zoomoffset-(\-?\d*[\.\-]?\d+) /, tileOpts, 'zoomOffset');
    effects.scanNum(/ zoomlevel-(\d*[\.\-]?\d+) /, mapOpts, 'zoom');
    effects.scanStr(/ center-([a-z]+) /, mapOpts, 'center');

    effects = { mark: mapOpts.center, zoom: mapOpts.zoom, tiles: tileOpts };
    effects = JSON.stringify(effects, null, 2).replace(/[\n\s]+/g, ' ');
    if ('string' === typeof mapOpts.center) {
      mapOpts.center = llDemo.locations[mapOpts.center];
    }
    map = L.map(map.id, mapOpts);
    map.attributionControl.setPrefix(effects);
    tileOpts.extraSvg = tileMarks;
    llDemo.genDebugTileLayer(tileOpts).addTo(map);
    L.marker(mapOpts.center).addTo(map);
  }

  Array.from(document.querySelectorAll('div.map')).map(initMap);


















}());