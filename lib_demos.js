/* -*- coding: UTF-8, tab-width: 2 -*- */
/*jslint indent: 2, maxlen: 80, continue: true, unparam: true, browser: true */
(function () {
  'use strict';
  var EX = {}, L = window.L;
  window.llDemo = EX;

  EX.jsSrcUrl = (function detectCurrentScriptTag() {
    var scriptTags = document.getElementsByTagName('script');
    return scriptTags[scriptTags.length - 1];
  }()).src;

  EX.jsonDeepCopy = function (obj) { return JSON.parse(JSON.stringify(obj)); };

  EX.svgExtend = function (tmpl) {
    var stickyAttrs = {}, tagRgx = /\{([a-z\-]+)(| [ -\|]+)\}/g,
      attrRgx = /\s([a-z0-9\-]+)(!|=)(\S*)/g;
    attrRgx.readAttrs = function (attrStr, roleFilter, attrDest) {
      return attrStr.replace(attrRgx, function (match, attr, role, val) {
        if (role !== roleFilter) { return match; }
        attrDest[attr] = (val || undefined);
        return '';
      });
    };
    stickyAttrs.svg = { x: "0px", y: "0px", version: "1.1",
      xmlns: "http://www.w3.org/2000/svg" };
    stickyAttrs.text = { 'font-family': 'sans-serif', 'font-size': '20px',
      'dominant-baseline': 'bottom', 'text-anchor': 'middle', x: '50%',
      fill: 'black' };
    tmpl = tmpl.replace(tagRgx, function (dflt, tag, rest) {
      var skip = Boolean(tag.match(/\-$/)), elAttr;
      if (skip) { tag = tag.substr(0, tag.length - 1); }
      dflt = stickyAttrs[tag] = (stickyAttrs[tag] || {});
      rest = attrRgx.readAttrs(rest, '!', dflt);
      if (skip) { return ''; }
      elAttr = EX.jsonDeepCopy(dflt);
      rest = attrRgx.readAttrs(rest, '=', elAttr);
      rest = EX.dict2xmlTag(tag, elAttr, rest);
      switch (tag) {
      case 'svg':
        rest = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
          '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org' +
          '/Graphics/SVG/' + elAttr.version + '/DTD/svg11.dtd">\n' + rest;
        break;
      }
      return rest;
    });
    return tmpl;
  };


  EX.dict2xmlTag = function (tag, attrDict, tail) {
    return ((tag && '<' + tag) + JSON.stringify(attrDict, null, 2
      ).replace(/(,?\n\s*)"(\S+)":\s*/g, ' $2='
      ).replace(/^\{|[\n\s\}]+$/g, '') + (tail || '') + (tag && '>'));
  };


  EX.genDebugTileSvg = function (opts) {
    var svg = '';
    if (!opts) { opts = {}; }
    svg += EX.svgExtend(['{svg width=256px height=256px}',
      '{rect x!0 y!0 width!100% height!100% stroke!none fill=white /}',
      '{rect- width!25% fill!none opacity!0.4}',
      '{rect fill=red /}', '{rect fill=orange x=50% /}',
      '{rect- width!100% height!25% opacity!0.3}',
      '{rect fill=blue /}', '{rect fill=lime y=50% /}',
      '<g transform="translate(-0.5 -0.5)">',
      '{line- x1!100% y1!100% x2!100% y2!100% fill!none }',
      '{line- stroke!black stroke-width!1px }',
      '  {line x1=0% /}', '  {line y1=0% /}',
      '</g>',
      ''].join('\n')).replace(/[\s\n]+(\n)/g, '$1');
    if (opts.caption !== '') {
      svg += EX.svgExtend('{text y=22%}{text y=82%}').replace(/>/g,
        '>' + (opts.caption || 'x{x} : y{y} @ z{z}') + '</text>\n');
    }
    if (opts.tileSize) {
      svg += EX.svgExtend('{text y=33%}tileSize=') +
        String(opts.tileSize) + '</text>\n';
    }
    if ('string' === typeof opts.extraSvg) { svg += opts.extraSvg; }
    if ('function' === typeof opts.extraSvg) { svg += '{extraSvg}'; }
    svg += '</svg>';
    switch (String(opts.fmt || '')) {
    case 'url':
      svg = 'data:image/svg+xml,' + encodeURIComponent(svg
        ).replace(/%7B([a-z_]+)%7D/ig, '{$1}');
      break;
    }
    return svg;
  };


  EX.genDebugTileLayer = function (opts) {
    var layerOpts = { attribution: '', maxZoom: 9001 };
    opts = Object.create(opts || null);
    ['tileSize', 'extraSvg', 'zoomOffset'
      ].map(function (opt) { if (opts[opt]) { layerOpts[opt] = opts[opt]; } });
    // console.log('genDebugTileLayer', opts, layerOpts);
    opts.fmt = 'url';
    return L.tileLayer(EX.genDebugTileSvg(opts), layerOpts);
  };


  EX.latlon2tilefrac = function latlon2tilefrac(zoom, lat, lon) {
    var axisLen = Math.pow(2, zoom), tile = [],
      latAngle;
    if (('number' !== typeof lon) && lat && ('number' === typeof lat[1])) {
      lon = lat[1];
      lat = lat[0];
    }
    tile[0] = tile.x = ((lon + 180) * axisLen) / 360;
    latAngle = (lat * Math.PI) / 180;
    tile[1] = tile.y = (1 -
      (Math.log(
        Math.tan(latAngle) + (1 / Math.cos(latAngle))
      ) / Math.PI)
      ) * 0.5 * axisLen;
    return tile;
  };


















}());