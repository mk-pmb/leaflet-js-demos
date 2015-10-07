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
  tileMarks['65:42@7'] = '{circle cx=55% cy=94% fill=yellow /}';
  tileMarks['131:85@8'] = '{circle cx=10% cy=89% fill=yellow /}';
  tileMarks['262:171@9'] = '{circle cx=19% cy=75% fill=yellow /}';

  function initMap(map) {
    var brussels = [50.8465565, 4.351697], tileOpts = {}, mapOpts, effects;
    mapOpts = { center: brussels, zoom: 8,
      attributionControl: true, zoomControl: true, };
    if ('string' === typeof map) { map = document.getElementById(map); }

    effects = llDemo.dashOpts([map.id, map.className]);
    effects.scanNum(/ tilesize-(\d+) /, tileOpts, 'tileSize');
    effects.scanNum(/ zoomoffset-(\-?\d*\-?\d+) /, tileOpts, 'zoomOffset');
    effects.scanNum(/ zoomlevel-(\d*\-?\d+) /, mapOpts, 'zoom');

    effects = { zoom: mapOpts.zoom, tiles: tileOpts };
    effects = JSON.stringify(effects, null, 2).replace(/[\n\s]+/g, ' ');
    map = L.map(map.id, mapOpts);
    map.attributionControl.setPrefix(effects);
    tileOpts.extraSvg = tileMarks;
    llDemo.genDebugTileLayer(tileOpts).addTo(map);
    L.marker(brussels).addTo(map);
  }

  Array.from(document.querySelectorAll('div.map')).map(initMap);


















}());