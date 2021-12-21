(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.chroma = factory());
}(this, (function () { 'use strict';

    var limit = function (x, min, max) {
        if ( min === void 0 ) min=0;
        if ( max === void 0 ) max=1;

        return x < min ? min : x > max ? max : x;
    };

    var clip_rgb = function (rgb) {
        rgb._clipped = false;
        rgb._unclipped = rgb.slice(0);
        for (var i=0; i<=3; i++) {
            if (i < 3) {
                if (rgb[i] < 0 || rgb[i] > 255) { rgb._clipped = true; }
                rgb[i] = limit(rgb[i], 0, 255);
            } else if (i === 3) {
                rgb[i] = limit(rgb[i], 0, 1);
            }
        }
        return rgb;
    };

    // ported from jQuery's $.type
    var classToType = {};
    for (var i = 0, list = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Undefined', 'Null']; i < list.length; i += 1) {
        var name = list[i];

        classToType[("[object " + name + "]")] = name.toLowerCase();
    }
    var type = function(obj) {
        return classToType[Object.prototype.toString.call(obj)] || "object";
    };

    var unpack = function (args, keyOrder) {
        if ( keyOrder === void 0 ) keyOrder=null;

    	// if called with more than 3 arguments, we return the arguments
        if (args.length >= 3) { return Array.prototype.slice.call(args); }
        // with less than 3 args we check if first arg is object
        // and use the keyOrder string to extract and sort properties
    	if (type(args[0]) == 'object' && keyOrder) {
    		return keyOrder.split('')
    			.filter(function (k) { return args[0][k] !== undefined; })
    			.map(function (k) { return args[0][k]; });
    	}
    	// otherwise we just return the first argument
    	// (which we suppose is an array of args)
        return args[0];
    };

    var last = function (args) {
        if (args.length < 2) { return null; }
        var l = args.length-1;
        if (type(args[l]) == 'string') { return args[l].toLowerCase(); }
        return null;
    };

    var PI = Math.PI;

    var utils = {
    	clip_rgb: clip_rgb,
    	limit: limit,
    	type: type,
    	unpack: unpack,
    	last: last,
    	PI: PI,
    	TWOPI: PI*2,
    	PITHIRD: PI/3,
    	DEG2RAD: PI / 180,
    	RAD2DEG: 180 / PI
    };

    var input = {
    	format: {},
    	autodetect: []
    };

    var last$1 = utils.last;
    var clip_rgb$1 = utils.clip_rgb;
    var type$1 = utils.type;


    var Color = function Color() {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var me = this;
        if (type$1(args[0]) === 'object' &&
            args[0].constructor &&
            args[0].constructor === this.constructor) {
            // the argument is already a Color instance
            return args[0];
        }

        // last argument could be the mode
        var mode = last$1(args);
        var autodetect = false;

        if (!mode) {
            autodetect = true;
            if (!input.sorted) {
                input.autodetect = input.autodetect.sort(function (a,b) { return b.p - a.p; });
                input.sorted = true;
            }
            // auto-detect format
            for (var i = 0, list = input.autodetect; i < list.length; i += 1) {
                var chk = list[i];

                mode = chk.test.apply(chk, args);
                if (mode) { break; }
            }
        }

        if (input.format[mode]) {
            var rgb = input.format[mode].apply(null, autodetect ? args : args.slice(0,-1));
            me._rgb = clip_rgb$1(rgb);
        } else {
            throw new Error('unknown format: '+args);
        }

        // add alpha channel
        if (me._rgb.length === 3) { me._rgb.push(1); }
    };

    Color.prototype.toString = function toString () {
        if (type$1(this.hex) == 'function') { return this.hex(); }
        return ("[" + (this._rgb.join(',')) + "]");
    };

    var Color_1 = Color;

    var chroma = function () {
    	var args = [], len = arguments.length;
    	while ( len-- ) args[ len ] = arguments[ len ];

    	return new (Function.prototype.bind.apply( chroma.Color, [ null ].concat( args) ));
    };

    chroma.Color = Color_1;
    chroma.version = '2.1.0';

    var chroma_1 = chroma;

    input.autodetect.push({
        p: 1,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$b(args, 'hcg');
            if (type$4(args) === 'array' && args.length === 3) {
                return 'hcg';
            }
        }
    });

    var unpack$c = utils.unpack;
    var last$4 = utils.last;
    var round$3 = Math.round;

    var rgb2hex = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$c(args, 'rgba');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var a = ref[3];
        var mode = last$4(args) || 'auto';
        if (a === undefined) { a = 1; }
        if (mode === 'auto') {
            mode = a < 1 ? 'rgba' : 'rgb';
        }
        r = round$3(r);
        g = round$3(g);
        b = round$3(b);
        var u = r << 16 | g << 8 | b;
        var str = "000000" + u.toString(16); //#.toUpperCase();
        str = str.substr(str.length - 6);
        var hxa = '0' + round$3(a * 255).toString(16);
        hxa = hxa.substr(hxa.length - 2);
        switch (mode.toLowerCase()) {
            case 'rgba': return ("#" + str + hxa);
            case 'argb': return ("#" + hxa + str);
            default: return ("#" + str);
        }
    };

    var rgb2hex_1 = rgb2hex;

    var RE_HEX = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    var RE_HEXA = /^#?([A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$/;

    var hex2rgb = function (hex) {
        if (hex.match(RE_HEX)) {
            // remove optional leading #
            if (hex.length === 4 || hex.length === 7) {
                hex = hex.substr(1);
            }
            // expand short-notation to full six-digit
            if (hex.length === 3) {
                hex = hex.split('');
                hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
            }
            var u = parseInt(hex, 16);
            var r = u >> 16;
            var g = u >> 8 & 0xFF;
            var b = u & 0xFF;
            return [r,g,b,1];
        }

        // match rgba hex format, eg #FF000077
        if (hex.match(RE_HEXA)) {
            if (hex.length === 5 || hex.length === 9) {
                // remove optional leading #
                hex = hex.substr(1);
            }
            // expand short-notation to full eight-digit
            if (hex.length === 4) {
                hex = hex.split('');
                hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3];
            }
            var u$1 = parseInt(hex, 16);
            var r$1 = u$1 >> 24 & 0xFF;
            var g$1 = u$1 >> 16 & 0xFF;
            var b$1 = u$1 >> 8 & 0xFF;
            var a = Math.round((u$1 & 0xFF) / 0xFF * 100) / 100;
            return [r$1,g$1,b$1,a];
        }

        // we used to check for css colors here
        // if _input.css? and rgb = _input.css hex
        //     return rgb

        throw new Error(("unknown hex color: " + hex));
    };

    var hex2rgb_1 = hex2rgb;

    var type$5 = utils.type;




    Color_1.prototype.hex = function(mode) {
        return rgb2hex_1(this._rgb, mode);
    };

    chroma_1.hex = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['hex']) ));
    };

    input.format.hex = hex2rgb_1;
    input.autodetect.push({
        p: 4,
        test: function (h) {
            var rest = [], len = arguments.length - 1;
            while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

            if (!rest.length && type$5(h) === 'string' && [3,4,5,6,7,8,9].indexOf(h.length) >= 0) {
                return 'hex';
            }
        }
    });
 
    var labConstants = {
        // Corresponds roughly to RGB brighter/darker
        Kn: 18,

        // D65 standard referent
        Xn: 0.950470,
        Yn: 1,
        Zn: 1.088830,

        t0: 0.137931034,  // 4 / 29
        t1: 0.206896552,  // 6 / 29
        t2: 0.12841855,   // 3 * t1 * t1
        t3: 0.008856452,  // t1 * t1 * t1
    };

    var unpack$k = utils.unpack;
    var pow = Math.pow;

    var rgb2lab = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$k(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var ref$1 = rgb2xyz(r,g,b);
        var x = ref$1[0];
        var y = ref$1[1];
        var z = ref$1[2];
        var l = 116 * y - 16;
        return [l < 0 ? 0 : l, 500 * (x - y), 200 * (y - z)];
    };

    var rgb_xyz = function (r) {
        if ((r /= 255) <= 0.04045) { return r / 12.92; }
        return pow((r + 0.055) / 1.055, 2.4);
    };

    var xyz_lab = function (t) {
        if (t > labConstants.t3) { return pow(t, 1 / 3); }
        return t / labConstants.t2 + labConstants.t0;
    };

    var rgb2xyz = function (r,g,b) {
        r = rgb_xyz(r);
        g = rgb_xyz(g);
        b = rgb_xyz(b);
        var x = xyz_lab((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / labConstants.Xn);
        var y = xyz_lab((0.2126729 * r + 0.7151522 * g + 0.0721750 * b) / labConstants.Yn);
        var z = xyz_lab((0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / labConstants.Zn);
        return [x,y,z];
    };

    var rgb2lab_1 = rgb2lab;

    var unpack$l = utils.unpack;
    var pow$1 = Math.pow;

    /*
     * L* [0..100]
     * a [-100..100]
     * b [-100..100]
     */
    var lab2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$l(args, 'lab');
        var l = args[0];
        var a = args[1];
        var b = args[2];
        var x,y,z, r,g,b_;

        y = (l + 16) / 116;
        x = isNaN(a) ? y : y + a / 500;
        z = isNaN(b) ? y : y - b / 200;

        y = labConstants.Yn * lab_xyz(y);
        x = labConstants.Xn * lab_xyz(x);
        z = labConstants.Zn * lab_xyz(z);

        r = xyz_rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z);  // D65 -> sRGB
        g = xyz_rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z);
        b_ = xyz_rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);

        return [r,g,b_,args.length > 3 ? args[3] : 1];
    };

    var xyz_rgb = function (r) {
        return 255 * (r <= 0.00304 ? 12.92 * r : 1.055 * pow$1(r, 1 / 2.4) - 0.055)
    };

    var lab_xyz = function (t) {
        return t > labConstants.t1 ? t * t * t : labConstants.t2 * (t - labConstants.t0)
    };

    var lab2rgb_1 = lab2rgb;

    Color_1.prototype.lab = function() {
        return rgb2lab_1(this._rgb);
    };

    chroma_1.lab = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['lab']) ));
    };

    input.format.lab = lab2rgb_1;



   

    var num2rgb = function (num) {
        if (type$c(num) == "number" && num >= 0 && num <= 0xFFFFFF) {
            var r = num >> 16;
            var g = (num >> 8) & 0xFF;
            var b = num & 0xFF;
            return [r,g,b,1];
        }
        throw new Error("unknown num color: "+num);
    };

    var num2rgb_1 = num2rgb;

    var type$d = utils.type;




    var unpack$u = utils.unpack;
    var type$e = utils.type;
    var round$5 = Math.round;

    Color_1.prototype.rgb = function(rnd) {
        if ( rnd === void 0 ) rnd=true;

        if (rnd === false) { return this._rgb.slice(0,3); }
        return this._rgb.slice(0,3).map(round$5);
    };

    

    input.format.rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var rgba = unpack$u(args, 'rgba');
        if (rgba[3] === undefined) { rgba[3] = 1; }
        return rgba;
    };

   



    var type$f = utils.type;

    Color_1.prototype.alpha = function(a, mutate) {
        if ( mutate === void 0 ) mutate=false;

        if (a !== undefined && type$f(a) === 'number') {
            if (mutate) {
                this._rgb[3] = a;
                return this;
            }
            return new Color_1([this._rgb[0], this._rgb[1], this._rgb[2], a], 'rgb');
        }
        return this._rgb[3];
    };


   
    Color_1.prototype.get = function(mc) {
        var ref = mc.split('.');
        var mode = ref[0];
        var channel = ref[1];
        var src = this[mode]();
        if (channel) {
            var i = mode.indexOf(channel);
            if (i > -1) { return src[i]; }
            throw new Error(("unknown channel " + channel + " in mode " + mode));
        } else {
            return src;
        }
    };

    var type$g = utils.type;
    var pow$2 = Math.pow;

    var EPS = 1e-7;
    var MAX_ITER = 20;

    var interpolator = {};

    var type$h = utils.type;


    var mix = function (col1, col2, f) {
        if ( f === void 0 ) f=0.5;
        var rest = [], len = arguments.length - 3;
        while ( len-- > 0 ) rest[ len ] = arguments[ len + 3 ];

        var mode = rest[0] || 'lrgb';
        if (!interpolator[mode] && !rest.length) {
            // fall back to the first supported mode
            mode = Object.keys(interpolator)[0];
        }
        if (!interpolator[mode]) {
            throw new Error(("interpolation mode " + mode + " is not defined"));
        }
        if (type$h(col1) !== 'object') { col1 = new Color_1(col1); }
        if (type$h(col2) !== 'object') { col2 = new Color_1(col2); }
        return interpolator[mode](col1, col2, f)
            .alpha(col1.alpha() + f * (col2.alpha() - col1.alpha()));
    };

    Color_1.prototype.mix =
    Color_1.prototype.interpolate = function(col2, f) {
    	if ( f === void 0 ) f=0.5;
    	var rest = [], len = arguments.length - 2;
    	while ( len-- > 0 ) rest[ len ] = arguments[ len + 2 ];

    	return mix.apply(void 0, [ this, col2, f ].concat( rest ));
    };

    Color_1.prototype.premultiply = function(mutate) {
    	if ( mutate === void 0 ) mutate=false;

    	var rgb = this._rgb;
    	var a = rgb[3];
    	if (mutate) {
    		this._rgb = [rgb[0]*a, rgb[1]*a, rgb[2]*a, a];
    		return this;
    	} else {
    		return new Color_1([rgb[0]*a, rgb[1]*a, rgb[2]*a, a], 'rgb');
    	}
    };

    Color_1.prototype.saturate = function(amount) {
    	if ( amount === void 0 ) amount=1;

    	var me = this;
    	var lch = me.lch();
    	lch[1] += labConstants.Kn * amount;
    	if (lch[1] < 0) { lch[1] = 0; }
    	return new Color_1(lch, 'lch').alpha(me.alpha(), true);
    };

    Color_1.prototype.desaturate = function(amount) {
    	if ( amount === void 0 ) amount=1;

    	return this.saturate(-amount);
    };

    var type$i = utils.type;

    Color_1.prototype.set = function(mc, value, mutate) {
        if ( mutate === void 0 ) mutate=false;

        var ref = mc.split('.');
        var mode = ref[0];
        var channel = ref[1];
        var src = this[mode]();
        if (channel) {
            var i = mode.indexOf(channel);
            if (i > -1) {
                if (type$i(value) == 'string') {
                    switch(value.charAt(0)) {
                        case '+': src[i] += +value; break;
                        case '-': src[i] += +value; break;
                        case '*': src[i] *= +(value.substr(1)); break;
                        case '/': src[i] /= +(value.substr(1)); break;
                        default: src[i] = +value;
                    }
                } else if (type$i(value) === 'number') {
                    src[i] = value;
                } else {
                    throw new Error("unsupported value for Color.set");
                }
                var out = new Color_1(src, mode);
                if (mutate) {
                    this._rgb = out._rgb;
                    return this;
                }
                return out;
            }
            throw new Error(("unknown channel " + channel + " in mode " + mode));
        } else {
            return src;
        }
    };




    var lab$1 = function (col1, col2, f) {
        var xyz0 = col1.lab();
        var xyz1 = col2.lab();
        return new Color_1(
            xyz0[0] + f * (xyz1[0]-xyz0[0]),
            xyz0[1] + f * (xyz1[1]-xyz0[1]),
            xyz0[2] + f * (xyz1[2]-xyz0[2]),
            'lab'
        )
    };

    // register interpolator
    interpolator.lab = lab$1;

    var type$j = utils.type;

    var pow$5 = Math.pow;

    var scale = function(colors) {

        // constructor
        var _mode = 'rgb';
        var _nacol = chroma_1('#ccc');
        var _spread = 0;
        // const _fixed = false;
        var _domain = [0, 1];
        var _pos = [];
        var _padding = [0,0];
        var _classes = false;
        var _colors = [];
        var _out = false;
        var _min = 0;
        var _max = 1;
        var _correctLightness = false;
        var _colorCache = {};
        var _useCache = true;
        var _gamma = 1;

        // private methods

        var setColors = function(colors) {
            colors = colors || ['#fff', '#000'];
            if (colors && type$j(colors) === 'string' && chroma_1.brewer &&
                chroma_1.brewer[colors.toLowerCase()]) {
                colors = chroma_1.brewer[colors.toLowerCase()];
            }
            if (type$j(colors) === 'array') {
                // handle single color
                if (colors.length === 1) {
                    colors = [colors[0], colors[0]];
                }
                // make a copy of the colors
                colors = colors.slice(0);
                // convert to chroma classes
                for (var c=0; c<colors.length; c++) {
                    colors[c] = chroma_1(colors[c]);
                }
                // auto-fill color position
                _pos.length = 0;
                for (var c$1=0; c$1<colors.length; c$1++) {
                    _pos.push(c$1/(colors.length-1));
                }
            }
            resetCache();
            return _colors = colors;
        };


        var tMapLightness = function (t) { return t; };
        var tMapDomain = function (t) { return t; };

        var getColor = function(val, bypassMap) {
            var col, t;
            if (bypassMap == null) { bypassMap = false; }
            if (isNaN(val) || (val === null)) { return _nacol; }
            if (!bypassMap) {
                if (_classes && (_classes.length > 2)) {
                    // find the class
                    var c = getClass(val);
                    t = c / (_classes.length-2);
                } else if (_max !== _min) {
                    // just interpolate between min/max
                    t = (val - _min) / (_max - _min);
                } else {
                    t = 1;
                }
            } else {
                t = val;
            }

            // domain map
            t = tMapDomain(t);

            if (!bypassMap) {
                t = tMapLightness(t);  // lightness correction
            }

            if (_gamma !== 1) { t = pow$5(t, _gamma); }

            t = _padding[0] + (t * (1 - _padding[0] - _padding[1]));

            t = Math.min(1, Math.max(0, t));

            var k = Math.floor(t * 10000);

            if (_useCache && _colorCache[k]) {
                col = _colorCache[k];
            } else {
                if (type$j(_colors) === 'array') {
                    //for i in [0.._pos.length-1]
                    for (var i=0; i<_pos.length; i++) {
                        var p = _pos[i];
                        if (t <= p) {
                            col = _colors[i];
                            break;
                        }
                        if ((t >= p) && (i === (_pos.length-1))) {
                            col = _colors[i];
                            break;
                        }
                        if (t > p && t < _pos[i+1]) {
                            t = (t-p)/(_pos[i+1]-p);
                            col = chroma_1.interpolate(_colors[i], _colors[i+1], t, _mode);
                            break;
                        }
                    }
                } else if (type$j(_colors) === 'function') {
                    col = _colors(t);
                }
                if (_useCache) { _colorCache[k] = col; }
            }
            return col;
        };

        var resetCache = function () { return _colorCache = {}; };

        setColors(colors);

        // public interface

        var f = function(v) {
            var c = chroma_1(getColor(v));
            if (_out && c[_out]) { return c[_out](); } else { return c; }
        };


        f.mode = function(_m) {
            if (!arguments.length) {
                return _mode;
            }
            _mode = _m;
            resetCache();
            return f;
        };

       
       

        f.colors = function(numColors, out) {
            // If no arguments are given, return the original colors that were provided
            if (arguments.length < 2) { out = 'hex'; }
            var result = [];

            if (arguments.length === 0) {
                result = _colors.slice(0);

            } else if (numColors === 1) {
                result = [f(0.5)];

            } else if (numColors > 1) {
                var dm = _domain[0];
                var dd = _domain[1] - dm;
                result = __range__(0, numColors, false).map(function (i) { return f( dm + ((i/(numColors-1)) * dd) ); });

            } else { // returns all colors based on the defined classes
                colors = [];
                var samples = [];
                if (_classes && (_classes.length > 2)) {
                    for (var i = 1, end = _classes.length, asc = 1 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
                        samples.push((_classes[i-1]+_classes[i])*0.5);
                    }
                } else {
                    samples = _domain;
                }
                result = samples.map(function (v) { return f(v); });
            }

            if (chroma_1[out]) {
                result = result.map(function (c) { return c[out](); });
            }
            return result;
        };


       
        return f;
    };

    function __range__(left, right, inclusive) {
      var range = [];
      var ascending = left < right;
      var end = !inclusive ? right : ascending ? right + 1 : right - 1;
      for (var i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
        range.push(i);
      }
      return range;
    }



    /**
        ColorBrewer colors for chroma.js
        Copyright (c) 2002 Cynthia Brewer, Mark Harrower, and The
        Pennsylvania State University.
        Licensed under the Apache License, Version 2.0 (the "License");
        you may not use this file except in compliance with the License.
        You may obtain a copy of the License at
        http://www.apache.org/licenses/LICENSE-2.0
        Unless required by applicable law or agreed to in writing, software distributed
        under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
        CONDITIONS OF ANY KIND, either express or implied. See the License for the
        specific language governing permissions and limitations under the License.
    */

    var  colorbrewer = {
    "orrd": [
        "#fff7ec",
        "#fee8c8",
        "#fdd49e",
        "#fdbb84",
        "#fc8d59",
        "#ef6548",
        "#d7301f",
        "#b30000",
        "#7f0000"
    ],
    "pubu": [
        "#fff7fb",
        "#ece7f2",
        "#d0d1e6",
        "#a6bddb",
        "#74a9cf",
        "#3690c0",
        "#0570b0",
        "#045a8d",
        "#023858"
    ],
    "bupu": [
        "#f7fcfd",
        "#e0ecf4",
        "#bfd3e6",
        "#9ebcda",
        "#8c96c6",
        "#8c6bb1",
        "#88419d",
        "#810f7c",
        "#4d004b"
    ],
    "oranges": [
        "#fff5eb",
        "#fee6ce",
        "#fdd0a2",
        "#fdae6b",
        "#fd8d3c",
        "#f16913",
        "#d94801",
        "#a63603",
        "#7f2704"
    ],
    "bugn": [
        "#f7fcfd",
        "#e5f5f9",
        "#ccece6",
        "#99d8c9",
        "#66c2a4",
        "#41ae76",
        "#238b45",
        "#006d2c",
        "#00441b"
    ],
    "ylorbr": [
        "#ffffe5",
        "#fff7bc",
        "#fee391",
        "#fec44f",
        "#fe9929",
        "#ec7014",
        "#cc4c02",
        "#993404",
        "#662506"
    ],
    "ylgn": [
        "#ffffe5",
        "#f7fcb9",
        "#d9f0a3",
        "#addd8e",
        "#78c679",
        "#41ab5d",
        "#238443",
        "#006837",
        "#004529"
    ],
    "reds": [
        "#fff5f0",
        "#fee0d2",
        "#fcbba1",
        "#fc9272",
        "#fb6a4a",
        "#ef3b2c",
        "#cb181d",
        "#a50f15",
        "#67000d"
    ],
    "rdpu": [
        "#fff7f3",
        "#fde0dd",
        "#fcc5c0",
        "#fa9fb5",
        "#f768a1",
        "#dd3497",
        "#ae017e",
        "#7a0177",
        "#49006a"
    ],
    "greens": [
        "#f7fcf5",
        "#e5f5e0",
        "#c7e9c0",
        "#a1d99b",
        "#74c476",
        "#41ab5d",
        "#238b45",
        "#006d2c",
        "#00441b"
    ],
    "ylgnbu": [
        "#ffffd9",
        "#edf8b1",
        "#c7e9b4",
        "#7fcdbb",
        "#41b6c4",
        "#1d91c0",
        "#225ea8",
        "#253494",
        "#081d58"
    ],
    "purples": [
        "#fcfbfd",
        "#efedf5",
        "#dadaeb",
        "#bcbddc",
        "#9e9ac8",
        "#807dba",
        "#6a51a3",
        "#54278f",
        "#3f007d"
    ],
    "gnbu": [
        "#f7fcf0",
        "#e0f3db",
        "#ccebc5",
        "#a8ddb5",
        "#7bccc4",
        "#4eb3d3",
        "#2b8cbe",
        "#0868ac",
        "#084081"
    ],
    "greys": [
        "#ffffff",
        "#f0f0f0",
        "#d9d9d9",
        "#bdbdbd",
        "#969696",
        "#737373",
        "#525252",
        "#252525",
        "#191919"
    ],
    "ylorrd": [
        "#ffffcc",
        "#ffeda0",
        "#fed976",
        "#feb24c",
        "#fd8d3c",
        "#fc4e2a",
        "#e31a1c",
        "#bd0026",
        "#800026"
    ],
    "purd": [
        "#f7f4f9",
        "#e7e1ef",
        "#d4b9da",
        "#c994c7",
        "#df65b0",
        "#e7298a",
        "#ce1256",
        "#980043",
        "#67001f"
    ],
    "blues": [
        "#f7fbff",
        "#deebf7",
        "#c6dbef",
        "#9ecae1",
        "#6baed6",
        "#4292c6",
        "#2171b5",
        "#08519c",
        "#08306b"
    ],
    "pubugn": [
        "#fff7fb",
        "#ece2f0",
        "#d0d1e6",
        "#a6bddb",
        "#67a9cf",
        "#3690c0",
        "#02818a",
        "#016c59",
        "#014636"
    ],
    "viridis": [
        "#440154",
        "#482777",
        "#3f4a8a",
        "#31678e",
        "#26838f",
        "#1f9d8a",
        "#6cce5a",
        "#b6de2b",
        "#fee825"
    ],
    "spectral": [
        "#9e0142",
        "#d53e4f",
        "#f46d43",
        "#fdae61",
        "#fee08b",
        "#ffffbf",
        "#e6f598",
        "#abdda4",
        "#66c2a5",
        "#3288bd",
        "#5e4fa2"
    ],
    "rdylgn": [
        "#a50026",
        "#d73027",
        "#f46d43",
        "#fdae61",
        "#fee08b",
        "#ffffbf",
        "#d9ef8b",
        "#a6d96a",
        "#66bd63",
        "#1a9850",
        "#006837"
    ],
    "rdbu": [
        "#67001f",
        "#b2182b",
        "#d6604d",
        "#f4a582",
        "#fddbc7",
        "#f7f7f7",
        "#d1e5f0",
        "#92c5de",
        "#4393c3",
        "#2166ac",
        "#053061"
    ],
    "piyg": [
        "#8e0152",
        "#c51b7d",
        "#de77ae",
        "#f1b6da",
        "#fde0ef",
        "#f7f7f7",
        "#e6f5d0",
        "#b8e186",
        "#7fbc41",
        "#4d9221",
        "#276419"
    ],
    "prgn": [
        "#40004b",
        "#762a83",
        "#9970ab",
        "#c2a5cf",
        "#e7d4e8",
        "#f7f7f7",
        "#d9f0d3",
        "#a6dba0",
        "#5aae61",
        "#1b7837",
        "#00441b"
    ],
    "rdylbu": [
        "#a50026",
        "#d73027",
        "#f46d43",
        "#fdae61",
        "#fee090",
        "#ffffbf",
        "#e0f3f8",
        "#abd9e9",
        "#74add1",
        "#4575b4",
        "#313695"
    ],
    "brbg": [
        "#543005",
        "#8c510a",
        "#bf812d",
        "#dfc27d",
        "#f6e8c3",
        "#f5f5f5",
        "#c7eae5",
        "#80cdc1",
        "#35978f",
        "#01665e",
        "#003c30"
    ],
    "rdgy": [
        "#67001f",
        "#b2182b",
        "#d6604d",
        "#f4a582",
        "#fddbc7",
        "#ffffff",
        "#e0e0e0",
        "#bababa",
        "#878787",
        "#4d4d4d",
        "#1a1a1a"
    ],
    "puor": [
        "#7f3b08",
        "#b35806",
        "#e08214",
        "#fdb863",
        "#fee0b6",
        "#f7f7f7",
        "#d8daeb",
        "#b2abd2",
        "#8073ac",
        "#542788",
        "#2d004b"
    ],
    "set2": [
        "#66c2a5",
        "#fc8d62",
        "#8da0cb",
        "#e78ac3",
        "#a6d854",
        "#ffd92f",
        "#e5c494",
        "#b3b3b3"
    ],
    "accent": [
        "#7fc97f",
        "#beaed4",
        "#fdc086",
        "#ffff99",
        "#386cb0",
        "#f0027f",
        "#bf5b17",
        "#666666"
    ],
    "set1": [
        "#e41a1c",
        "#377eb8",
        "#4daf4a",
        "#984ea3",
        "#ff7f00",
        "#ffff33",
        "#a65628",
        "#f781bf",
        "#999999"
    ],
    "set3": [
        "#8dd3c7",
        "#ffffb3",
        "#bebada",
        "#fb8072",
        "#80b1d3",
        "#fdb462",
        "#b3de69",
        "#fccde5",
        "#d9d9d9",
        "#bc80bd",
        "#ccebc5",
        "#ffed6f"
    ],
    "dark2": [
        "#1b9e77",
        "#d95f02",
        "#7570b3",
        "#e7298a",
        "#66a61e",
        "#e6ab02",
        "#a6761d",
        "#666666"
    ],
    "paired": [
        "#a6cee3",
        "#1f78b4",
        "#b2df8a",
        "#33a02c",
        "#fb9a99",
        "#e31a1c",
        "#fdbf6f",
        "#ff7f00",
        "#cab2d6",
        "#6a3d9a",
        "#ffff99",
        "#b15928"
    ],
    "pastel2": [
        "#b3e2cd",
        "#fdcdac",
        "#cbd5e8",
        "#f4cae4",
        "#e6f5c9",
        "#fff2ae",
        "#f1e2cc",
        "#cccccc"
    ],
    "pastel1": [
        "#fbb4ae",
        "#b3cde3",
        "#ccebc5",
        "#decbe4",
        "#fed9a6",
        "#ffffcc",
        "#e5d8bd",
        "#fddaec",
        "#f2f2f2"
    ],
    "cubehelix": [
        "#7c396e",
        "#6d4e97",
        "#5965a4",
        "#4a7aa1",
        "#428d93",
        "#499e78",
        "#af9a61",
        "#de93b3",
        "#cba9e6",
        "#b5c3ef",
        "#add9e2",
        "#c3e9cb"
    ]
}



    var colorbrewer_1 = colorbrewer;

    chroma_1.mix = chroma_1.interpolate = mix;
    chroma_1.scale = scale;

    chroma_1.brewer = colorbrewer_1;

    var chroma_js = chroma_1;

    return chroma_js;

})));



var DEFAULT_SIZE = 1000
// REMOVE HERE IN PRODUCTION

// const genRanHex = size => "0x" + [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

// let randHash = genRanHex(64)

let tokenData = {
 // hash: "0xc55ae463bb7d4a2471786426ddc23ba8ec120e82364990a7df13323a6c135a92",
  // hash: randHash,
  // tokenId: 345123344
}
// console.log(randHash)

///

let hashhash = tokenData.slice(2,66)

const hashcombo = hashhash + [...hashhash].reverse().join('')

let hashPairs = [];

for (let j = 0; j < 64; j++) {
  hashPairs.push(hashcombo.slice(0 + (j * 2), 2 + (j * 2)));
}

let hashIndex = 0


let hashData = hashPairs.map(x => {
  return parseInt(x, 16) / 255;
});
  
  let allcombi = Object.keys(chroma.brewer);
  
  // console.log(chroma.brewer)

function setup() {
  if(window.innerHeight <= window.innerWidth) {
      SIZE = window.innerHeight
  } else {
      SIZE = window.innerWidth
  }
  createCanvas(SIZE, SIZE);
  // frameRate(30)
  // createLoop({duration:6, gif:true})
  
}

function draw() {
  // let SIZE = width;
  // let SIZE = height;

  // let = 
  hashIndex = hashData.length - 1

  // let totalRadius = 250;
  let totalRadius = Math.min(SIZE, SIZE) * 0.45;

  let trrx = width / 2;
  let trry = height / 2;

  translate(trrx, trry);
  let numOrbits = round(map(hashData[inc()], 0, 1, 1, 12));
  // let numOrbits = 6;
  let numCircles = round(map(hashData[inc()], 0, 1, 1, 20));
  background(0);

  let circlesinOrbitsArray = [];
  let symmetryinOrbitsArray = [];
  // hashData[inc()]
  let globspinphase = 1;
  var ang1;
  if (mouseIsPressed) {
    ang1 = (millis() / 10000) * map(mouseX, 0, SIZE / 2, 0.05,1, true) * map(mouseX, SIZE / 2, SIZE, 1,20, true)
  } else {
    ang1 = (millis() / 10000)
  }
  // let wheremousex =  map(mouseX, 0, SIZE, 0,1, true)
  // console.log(wheremousex)
  // // var ang1 = (millis() / 10000) * map(mouseX, 0, SIZE, 1,20, true)

  let whichRotate = hashData[inc()] * 100;

  let rotateoption;

  if (whichRotate <= 10) {
    rotateoption = 0;
  } else if (whichRotate <= 20) {
    rotateoption = 1;
  } else if (whichRotate <= 30) {
    rotateoption = 2;
  } else if (whichRotate <= 40) {
    rotateoption = 3;
  } else if (whichRotate <= 47) {
    rotateoption = 4;
  } else if (whichRotate <= 54) {
    rotateoption = 5;
  } else if (whichRotate <= 61) {
    rotateoption = 6;
  } else if (whichRotate <= 68) {
    rotateoption = 7;
  } else if (whichRotate <= 85) {
    rotateoption = 8;
  } else if (whichRotate <= 92) {
    rotateoption = 9;
  } else if (whichRotate <= 96) {
    rotateoption = 10;
  } else if (whichRotate <= 100) {
    rotateoption = 11;
  }

  const areObjectsRotating = hashData[inc()] < 0.5;



  let selectPallette = floor(
    (hashData[inc()]) * (allcombi.length)
  );
  
  let palettename = allcombi[selectPallette]
  
  let pallette = chroma
    .scale(palettename)
    .mode("lab")
    .colors(numOrbits);

  if (hashData[inc()] < 0.3) {
    for (let i = pallette.length - 1; i > 0; i--) {
      const j = Math.floor(hashData[inc()] * i);
      const temp = pallette[i];
      pallette[i] = pallette[j];
      pallette[j] = temp;
    }
  }

  let colorswitch = hashData[inc()] * 100;
  // console.log(colorswitch)
  // let colorswitch = 58;
  let colorchoice;

  if (colorswitch <= 20) {
    colorchoice = 0;
  } else if (colorswitch <= 40) {
    colorchoice = 1;
  } else if (colorswitch <= 60) {
    pallette = chroma.scale(allcombi[selectPallette]).mode("lab").colors(30);
    colorchoice = 2;
  } else if (colorswitch <= 65) {
    colorchoice = 3;
  } else if (colorswitch <= 70) {
    colorchoice = 4;
  } else if (colorswitch <= 75) {
    colorchoice = 5;
  } else if (colorswitch <= 80) {
    colorchoice = 6;
  } else if (colorswitch <= 85) {
    colorchoice = 7;
  } else if (colorswitch <= 90) {
    colorchoice = 8;
  } else if (colorswitch <= 100) {
    colorchoice = 9;
  }
  
  //GLOBAL COLOR VARIABLE FOR OPTION 09
  let rglob = Math.round(map(hashData[inc()], 0, 1, 50, 255));
  let gglob = Math.round(map(hashData[inc()], 0, 1, 50, 255));
  let bglob = Math.round(map(hashData[inc()], 0, 1, 50, 255));

  ///// SHAPE SELECTOR START

  let shapeSequence = [1, 2, 3, 4, 0, 5, 6, 7, 8];
  let shapeSequenceNames = {
    1: "tringle",
    2: "square",
    3: "pentagon",
    4: "hexagon",
    0: "circle",
    5: "star_1",
    6: "star_2",
    7: "star_3",
    8: "star_4"
  };
  if (hashData[inc()] < 0.5) {
    for (let i = shapeSequence.length - 1; i > 0; i--) {
      const j = Math.floor(hashData[inc()] * i);
      const temp = shapeSequence[i];
      shapeSequence[i] = shapeSequence[j];
      shapeSequence[j] = temp;
    }
  }

  let sequenceLength = floor(
    map(hashData[inc()], 0, 1, 2, 9)
  );

  let shapeRandom = hashData[inc()] * 100;
  // let shapeRandom = 85;
  // console.log(shapeRandom)
  // let shapeRandom = 88
  let nameList = [];
  shapeSequence
    .slice(0, sequenceLength)
    .forEach((item) => nameList.push(shapeSequenceNames[item]));
  // console.log("[" + nameList.join(", ") + "]")
  // console.log(shapeSequence.slice(0,sequenceLength))
  // console.log(shapeSequence)
  // console.log(nameList)
  let whichShapesSelect;

  if (shapeRandom <= 20) {
    whichShapesSelect = 0;
  } else if (shapeRandom <= 28) {
    whichShapesSelect = 1;
  } else if (shapeRandom <= 36) {
    whichShapesSelect = 2;
  } else if (shapeRandom <= 44) {
    whichShapesSelect = 3;
  } else if (shapeRandom <= 52) {
    whichShapesSelect = 4;
  } else if (shapeRandom <= 60) {
    whichShapesSelect = 5;
  } else if (shapeRandom <= 68) {
    whichShapesSelect = 6;
  } else if (shapeRandom <= 76) {
    whichShapesSelect = 7;
  } else if (shapeRandom <= 84) {
    whichShapesSelect = 8;
  } else if (shapeRandom <= 90) {
    whichShapesSelect = 9;
  } else if (shapeRandom <= 95) {
    whichShapesSelect = 10;
    // } else if (shapeRandom <= 96) {
    //   whichShapesSelect = 11;
    //   shapeAttribute.current = "Shape sequence with " + sequenceLength.toString() + "shapes";
  } else if (shapeRandom <= 97) {
    whichShapesSelect = 11;
  } else if (shapeRandom <= 99) {
    whichShapesSelect = 12;
  } else if (shapeRandom <= 100) {
     whichShapesSelect = 13
  }
  
 

  // console.log("which shapes", whichShapesSelect)
  ///// SHAPE SELECTOR END

  for (let pp = 0; pp < numOrbits; pp++) {
    let Inset = (pp / numOrbits) * totalRadius;
    let Radius = totalRadius - Inset;

    let numCircless;
    hashData[inc()] < 0.5 ?
      (numCircless = round(
        map(hashData[inc()], 0, 1, 1, 20)
      )) :
      (numCircless = numCircles);

    circlesinOrbitsArray.push(numCircless);

    let symmetry;
    let coin2 = hashData[inc()];
    numCircless > numCircles ?
      (symmetry = numCircless) :
      coin2 < 0.2 ?
      (symmetry = numCircles) :
      (symmetry = numCircless);

    symmetryinOrbitsArray.push(coin2 < 0.2 ? "no" : "yes");

    let rot1mul = map(hashData[inc()], 0, 1, 0.1, 10);
    let rot2mul = map(hashData[inc()], 0, 1, 0.1, 10);
    let polarityglob = round(hashData[inc()]) * 2 - 1;

    let ccc1 = Math.round(map(hashData[inc()], 0, 1, 50, 255));
    let ccc2 = Math.round(map(hashData[inc()], 0, 1, 50, 255));
    let ccc3 = Math.round(map(hashData[inc()], 0, 1, 50, 255));

    for (let i = 0; i < numCircless; i++) {
      let color = distributeColors(
        colorchoice,
        i,
        pp,
        pallette,
        ccc1,
        ccc2,
        ccc3,
        rglob,
        gglob,
        bglob
      );

      let xpos = Inset + Radius;
      let ypos = Inset + Radius;
      xpos = xpos + Radius * Math.sin((i / symmetry) * PI * 2);
      ypos =
        ypos + Radius * Math.sin((i / numCircles) * PI * 2 - PI / 2);

      let polarity = round(hashData[inc()]) * 2 - 1;
      push();

      // ROTATING IS HERE
      rotationChoice(
        rotateoption,

        pp,
        i,
        symmetry,
        ang1,
        rot1mul,
        rot2mul,
        globspinphase,
        polarityglob,
        polarity
      );

      translate(Radius, 0);
      if (whichShapesSelect != 13) {
      if (areObjectsRotating) {
        0.5 < hashData[inc()] ?
          rotate(millis() / 1000) :
          rotate((millis() / 1000) * -1);
      }
      }
    
      drawShape(
        // shapeswitch,
        whichShapesSelect,
        shapeSequence,
        sequenceLength,
        i,
        pp,
        totalRadius
      );
      
      pop();
      
    }
  }

}

function inc() {
  hashIndex = (hashIndex + 1) % hashData.length;
  return hashIndex
}

function distributeColors(
  colorchoice,
  i,
  pp,
  pallette,
  ccc1,
  ccc2,
  ccc3,
  rglob,
  gglob,
  bglob
) {
  let colorr;
  switch (colorchoice) {
    case 0:
      colorr = color(pallette[i % pallette.length]);
      break;
    case 1:
      colorr = color(pallette[pp % pallette.length]);
      break;
    case 2:
      colorr = color(
        pallette[round(hashData[inc()] * (pallette.length - 1))]
      );
      break;
    case 3:
      colorr = color(
        Math.round(map(hashData[inc()], 0, 1, 200, 255)),
        Math.round(hashData[inc()] * 255),
        Math.round(hashData[inc()] * 255)
      );
      break;
    case 4:
      colorr = color(
        Math.round(hashData[inc()] * 255),
        Math.round(map(hashData[inc()], 0, 1, 200, 255)),
        Math.round(hashData[inc()] * 255)
      );
      break;
    case 5:
      colorr = color(
        Math.round(hashData[inc()] * 255),
        Math.round(hashData[inc()] * 255),
        Math.round(map(hashData[inc()], 0, 1, 200, 255))
      );
      break;
    case 6:
      colorr = color(
        Math.round(map(hashData[inc()], 0, 1, 50, 255)),
        Math.round(map(hashData[inc()], 0, 1, 50, 255)),
        Math.round(map(hashData[inc()], 0, 1, 50, 255))
      );
      break;
    case 7:
      colorr = color(Math.round(map(hashData[inc()], 0, 1, 50, 255)));
      break;
    case 8:
      colorr = color(ccc1, ccc2, ccc3);
      break;
    case 9:
      colorr = color(rglob, gglob, bglob);
      break;
    default:
      "bull";
  }
  fill(colorr);
};

function drawShape(
  whichShape,
  shapeSequence,
  sequenceLength,
  i,
  pp,
  totalRadius
) {
  switch (whichShape) {
    case 0:
      shapes(0, totalRadius);
      break;
    case 1:
      shapes(1, totalRadius);
      break;
    case 2:
      shapes(2, totalRadius);
      break;
    case 3:
      shapes(3, totalRadius);
      break;
    case 4:
      shapes(4, totalRadius);
      break;
    case 5:
      shapes(5, totalRadius);
      break;
    case 6:
      shapes(6, totalRadius);
      break;
    case 7:
      shapes(7, totalRadius);
      break;
    case 8:
      shapes(8, totalRadius);
      break;
    case 9:
      shapes(shapeSequence[pp % sequenceLength], totalRadius);
      break;
    case 10:
      shapes(shapeSequence[i % sequenceLength], totalRadius);
      break;
    case 11:
      shapes(9, totalRadius);
      break;
    case 12:
      shapes(10, totalRadius);
      break;
    case 13:
      shapes(11, totalRadius);
      break;  
    
    default:
      "wuw";
  }
};

function drawPolygon(corners, totalRadius) {
  let angle = TWO_PI / corners;
  beginShape();
  // let angle = TWO_PI / 7;
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = 0 + cos(a) * (totalRadius / 25);
    let sy = 0 + sin(a) * (totalRadius / 25);
    vertex(sx, sy);
  }
  endShape(CLOSE);
};

function drawStar(radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = cos(a) * radius2;
    let sy = sin(a) * radius2;
    vertex(sx, sy);
    sx = cos(a + halfAngle) * radius1;
    sy = sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
};

function heart(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
}
function shapes(shape, totalRadius, shuffleBag) {
  let radius2;
  let radius1;

  switch (shape) {
    case 0:
      ellipse(0, 0, totalRadius / 12.5, totalRadius / 12.5);
      break;
    case 1:
      //TRIANGLE
      drawPolygon(3, totalRadius);
      break;
    case 2:
      //RECT
      drawPolygon(4, totalRadius);
      break;
    case 3:
      //BESGEN
      drawPolygon(5, totalRadius);
      break;
    case 4:
      drawPolygon(6, totalRadius);
      break;
      // case 5:
      //   drawPolygon( 7, totalRadius);
      //   break;
      // case 6:
      //   drawPolygon( 8, totalRadius);
      //   break;
    case 5:
      radius2 = totalRadius / 25;
      radius1 = radius2 * 0.4;
      drawStar(radius1, radius2, 3);
      break;
    case 6:
      radius2 = totalRadius / 25;
      radius1 = radius2 * 0.6;
      drawStar(radius1, radius2, 4);
      break;
    case 7:
      radius2 = totalRadius / 25;
      radius1 = radius2 * 0.6;
      drawStar(radius1, radius2, 5);
      break;
    case 8:
      radius2 = totalRadius / 25;
      radius1 = radius2 * 0.6;
      drawStar(radius1, radius2, 12);
      break;
    case 9:
      let a =
        (millis() / 1000) *
        map(hashData[inc()], 0, 1, 0.05, 2);
      switch (floor((a / TWO_PI) % 2)) {
        case 0:
          arc(0, 0, totalRadius / 12.5, totalRadius / 12.5, 0, a, PIE);
          // console.log("0")
          break;
        case 1:
          arc(0, 0, totalRadius / 12.5, totalRadius / 12.5, a, 0, PIE);
          // console.log("1")
          break;
          // case 2:
          //   arc(0, 0, 20, 20, TWO_PI - a, 0);

          //   // console.log("2")
          //   break;
          // case 3:
          //   arc(0, 0, 20, 20, 0, TWO_PI - a);

          // console.log("3")
          // break;
        default:
          "none";
      }
      break;
    case 10:
      triangle(
        map(hashData[inc()], 0, 1, 0, totalRadius / 6.25),
        map(hashData[inc()], 0, 1, 0, totalRadius / 6.25),
        map(hashData[inc()], 0, 1, 0, totalRadius / 6.25),
        map(hashData[inc()], 0, 1, 0, totalRadius / 6.25),
        map(hashData[inc()], 0, 1, 0, totalRadius / 6.25),
        map(hashData[inc()], 0, 1, 0, totalRadius / 6.25)
      );
      break;
    case 11:
      heart(0, 0, totalRadius / 15)
    default:
      "wut";
  }
};

function rotationChoice(
  rotateoption,
  pp,
  i,
  symmetry,
  ang1,
  rot1mul,
  rot2mul,
  globspinphase,
  polarityglob,
  polarity
) {
  switch (rotateoption) {
    case 0:
      // OPTION 0 - ALL FORWARD - SAME SPEED
      rotate(ang1 * 5 + (TWO_PI * i) / symmetry);
      break;
    case 1:
      // OPTION 0 - ALL BACKWARDS - SAME SPEED
      rotate((ang1 * 5 + (TWO_PI * i) / symmetry) * -1);
      break;
    case 2:
      // FORWARDxBACKWARDS - SAME SPEED
      if (pp % 2 === 0) {
        rotate(ang1 + (TWO_PI * i) / symmetry);
      } else {
        rotate((ang1 + (TWO_PI * i) / symmetry) * -1);
      }
      break;
    case 3:
      // BACKWARDSxFORWARD - SAME SPEED
      if (pp % 2 === 0) {
        rotate((ang1 + (TWO_PI * i) / symmetry) * -1);
      } else {
        rotate(ang1 + (TWO_PI * i) / symmetry);
      }
      break;
    case 4:
      // FORWARDxBACKWARDS - WITH SPEED MULTIPLIERS PER ORBIT
      if (pp % 2 === 0) {
        rotate(ang1 * rot1mul + (TWO_PI * i) / symmetry);
      } else {
        rotate((ang1 * rot2mul + (TWO_PI * i) / symmetry) * -1);
      }
      break;
    case 5:
      // BACKWARDSxFORWARD - WITH SPEED MULTIPLIERS PER ORBIT
      if (pp % 2 === 0) {
        rotate((ang1 * rot2mul + (TWO_PI * i) / symmetry) * -1);
      } else {
        rotate(ang1 * rot1mul + (TWO_PI * i) / symmetry);
      }
      break;
    case 6:
      // FORWARD - WITH SPEED MULTIPLIERS PER ORBIT
      rotate(ang1 * rot1mul + (TWO_PI * i) / symmetry);
      break;
    case 7:
      // BACKWARDS - WITH SPEED MULTIPLIERS PER ORBIT
      rotate((ang1 * rot1mul + (TWO_PI * i) / symmetry) * -1);
      break;
    case 8:
      // VARIABLE ROTATION PER ORBIT - SAME SPEED;
      rotate((ang1 + (TWO_PI * i) / symmetry) * polarityglob);
      break;
    case 9:
      // VARIABLE SPEED AND ROTATION PER ORBIT
      rotate((ang1 * rot2mul + (TWO_PI * i) / symmetry) * polarityglob);
      break;
    case 10:
      // FORWARD - PHASING SPEED
      rotate(ang1 * (pp + 1) * globspinphase + (TWO_PI * i) / symmetry);
      break;
    case 11:
      // BACKWARDS - PHASING SPEED
      rotate(
        (ang1 * (pp + 1) * globspinphase + (TWO_PI * i) / symmetry) * -1
      );
      break;
    default:
      "nuttin";
  }
};