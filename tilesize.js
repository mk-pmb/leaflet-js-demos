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
  };
  tileMarks.prefixAll = '{circle- r!5px fill!none stroke!black ' +
    'stroke-width!1px}'
  tileMarks['131:85@8'] = '{circle cx=10% cy=89% fill=yellow /}';

  function initMap(map) {
    var brussels = [50.8465565, 4.351697], tileOpts = {};
    if ('string' !== typeof map) { map = map.id; }
    map.replace(/^tilesize-(\d+)$/,
      function (m, ts) { tileOpts.tileSize = (m && ts); });
    map = L.map(map, { center: brussels, zoom: 8,
      attributionControl: false, zoomControl: true });
    tileOpts.extraSvg = tileMarks;
    llDemo.genDebugTileLayer(tileOpts).addTo(map);
    L.marker(brussels).addTo(map);
  }

  Array.from(document.querySelectorAll('div.map')).map(initMap);


















}());