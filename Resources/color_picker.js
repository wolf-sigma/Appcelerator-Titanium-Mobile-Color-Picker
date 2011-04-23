/*
Copyright (c) 2011 CSLB, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h;}
function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16);}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16);}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16);}
function hexToRgb(hex){
	return {
		r:hexToR(hex),
		g:hexToG(hex),
		b:hexToB(hex)
	};
}
function hueToRgb(m1, m2, hue) {
    var v;
    if (hue < 0) {
        hue += 1;
    }
    else if (hue > 1)
    {
        hue -= 1;
    }

    if (6 * hue < 1)
    {
        v = m1 + (m2 - m1) * hue * 6;
    }
    else if (2 * hue < 1)
    {
        v = m2;
    }
    else if (3 * hue < 2)
    {
        v = m1 + (m2 - m1) * (2 / 3 - hue) * 6;
    } else
    {
        v = m1;
    }

    return 255 * v;
}
function hslToRgb(h, s, l) {
    var m1,
    m2,
    hue;
    var r,
    g,
    b;
    s /= 100;
    l /= 100;
    if (s == 0)
    {
        r = g = b = (l * 255);
    }
    else {
        if (l <= 0.5)
        {
            m2 = l * (s + 1);
        }
        else
        {
            m2 = l + s - l * s;
        }
        m1 = l * 2 - m2;
        hue = h / 360;
        r = Math.round(hueToRgb(m1, m2, hue + 1 / 3));
        g = Math.round(hueToRgb(m1, m2, hue));
        b = Math.round(hueToRgb(m1, m2, hue - 1 / 3));
    }
    return {
        r: r,
        g: g,
        b: b
    };
}
function intToHex(N) {
    if (N == null) {
        return "00";
    };
    if (N == 0 || isNaN(N)) {
        return "00";
    };
    N = Math.max(0, N);
    N = Math.min(N, 255);
    N = Math.round(N);
    return "0123456789ABCDEF".charAt((N - N % 16) / 16) + "0123456789ABCDEF".charAt(N % 16);
}
function rgbToHex(color) {
    return intToHex(color.r) + intToHex(color.g) + intToHex(color.b);
}
function rgbToHsl(r, g, b){
    r /= 255;
	g /= 255;
	b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {h:Math.round(h * 360), s:Math.round(s * 100), l:Math.round(l * 100)};
}
function createColorPicker(params) {
    var h,s,l;// = 0,100,50;
	if (params.hexColor) {
		var rgb = hexToRgb(params.hexColor);
		Ti.API.log('debug', rgb);
		var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
		Ti.API.log('debug', hsl);
		h = hsl.h;
		s = hsl.s;
		l = hsl.l;
	}
	else {
		h = 0;
		s = 100;
		l = 50;
	}
    var returnView = Ti.UI.createWindow();
    var LImage = Ti.UI.createImageView({
        top: 370,
        width: 300,
        height: 30,
		backgroundColor:"#FFFFFF",
        backgroundGradient: {
            type: 'linear',
            colors: ['#000001', rgbToHex(hslToRgb(h,s,50)), '#FFFFFF'],
            startPoint: {
                x: 0,
                y: 30
            },
            endPoint: {
                x: 300,
                y: 0
            }
        }
    });
	var lCrossHair = Ti.UI.createImageView({image:'image/lcrosshair.png', height:6, width:9, top:(LImage.top + LImage.height + 5)});
    var HSImage = Titanium.UI.createImageView({
        image: 'image/colormap.png',
        height:256,
        width:300,
		top:109,
		left:10
    });
	var hsCrossHair = Ti.UI.createImageView({image:'image/hscrosshair.gif', width:11, height:11});
    LImage.addEventListener('click',
    function(e) {
        l = Math.round((e.x / LImage.width) * 100);
		if (l > 100){
			l = 100;
		}
		if (l < 0){
			l = 0;
		}
        var hexColor = rgbToHex(hslToRgb(h, s, l));
        returnView.backgroundColor = hexColor;
		var x = e.x;
		if (x < 0)
		{
			x = 0;
		}
		if (x > LImage.width)
		{
			x = LImage.width;
		}
		lCrossHair.left = x + (10 - lCrossHair.width / 2);
    });
    LImage.addEventListener('touchmove',
    function(e) {
        l = Math.round((e.x / LImage.width) * 100);
		if (l > 100){
			l = 100;
		}
		if (l < 0){
			l = 0;
		}
        var hexColor = rgbToHex(hslToRgb(h, s, l));
        returnView.backgroundColor = hexColor;
		var x = e.x;
		if (x < 0)
		{
			x = 0;
		}
		if (x > LImage.width)
		{
			x = LImage.width;
		}
		lCrossHair.left = x + (10 - lCrossHair.width / 2);
    });
    HSImage.addEventListener('touchmove',
    function(e) {
       h = Math.round((e.x / HSImage.width) * 359);
        s = Math.round(100 - (e.y / HSImage.height) * 100);
        if (h < 0) {
            h = 0;
        }
        else if (h > 359)
        {
            h = 359;
        }
        if (s < 0) {
            s = 0;
        }
        else if (s > 100) {
            s = 100;
        }
        var hexColor = rgbToHex(hslToRgb(h, s, l));
		var hexColorGradient = rgbToHex(hslToRgb(h, s, 50));
        returnView.backgroundColor = hexColor;
        LImage.backgroundGradient = {
            type: 'linear',
            colors: ['#000001', "#" + hexColorGradient, '#FFFFFF'],
            startPoint: {
                x: 0,
                y: 30
            },
            endPoint: {
                x: 300,
                y: 0
            }
        };
		var x = e.x;
		var y = e.y;
		if (x < 0){
			x = 0;
		}
		if (x > HSImage.width){
			x = HSImage.width;
		}
		if (y < 0){
			y = 0;
		}
		if (y > HSImage.height){
			y = HSImage.height;
		}
		hsCrossHair.left = x + (HSImage.left - hsCrossHair.width / 2);
		hsCrossHair.top = y + (HSImage.top - hsCrossHair.width / 2);
    });
    HSImage.addEventListener('click',
    function(e) {
        h = Math.round((e.x / HSImage.width) * 359);
		Ti.API.log('debug', "h: " + h);
        s = Math.round(100 - (e.y / HSImage.height) * 100);
		Ti.API.log('debug', "s: " + s);
        if (h < 0) {
            h = 0;
        }
        else if (h > 359)
        {
            h = 359;
        }
        if (s < 0) {
            s = 0;
        }
        else if (s > 100) {
            s = 100;
        }
        var hexColor = rgbToHex(hslToRgb(h, s, l));
		var hexColorGradient = rgbToHex(hslToRgb(h, s, 50));
        returnView.backgroundColor = hexColor;
        LImage.backgroundGradient = {
            type: 'linear',
            colors: ['#000001', "#" + hexColorGradient, '#FFFFFF'],
            startPoint: {
                x: 0,
                y: 30
            },
            endPoint: {
                x: 300,
                y: 0
            }
        };
		var x = e.x;
		var y = e.y;
		if (x < 0){
			x = 0;
		}
		if (x > HSImage.width){
			x = HSImage.width;
		}
		if (y < 0){
			y = 0;
		}
		if (y > HSImage.height){
			y = HSImage.height;
		}
		hsCrossHair.left = x + (HSImage.left - hsCrossHair.width / 2);
		hsCrossHair.top = y + (HSImage.top - hsCrossHair.width / 2);
    });
	var doneButton = Ti.UI.createButton({title:"Select", top: 10, width:100, height:40});
	doneButton.addEventListener('click', function(e){
		var returnRGB = hslToRgb(h, s, l);
		var returnHex = rgbToHex(returnRGB);
		returnView.fireEvent('colorselect',{hexColor:returnHex, hexColorWithHash:"#"+returnHex, hslColor:{h:h, s:s, l:l}, rgbColor:returnRGB});
		returnView.hide();
	});
	var cancelButton = Ti.UI.createButton({title:"Cancel", top:55, width:100, height:40});
	cancelButton.addEventListener('click', function(e){
		returnView.fireEvent('selectcancel');
		returnView.hide();
	});
    returnView.add(HSImage);
    returnView.add(LImage);
	returnView.add(doneButton);
	returnView.add(cancelButton);
	returnView.add(lCrossHair);
	returnView.add(hsCrossHair);
	returnView.backgroundColor = rgbToHex(hslToRgb(h, s, l));
	// place crosshairs
	lCrossHair.left = (l * (LImage.width / 100)) + (10 - (lCrossHair.width / 2));
	hsCrossHair.left = (h * (HSImage.width / 360)) + (HSImage.left - (hsCrossHair.width / 2));
	hsCrossHair.top = (s * (HSImage.height / 100)) + (HSImage.top - (hsCrossHair.height / 2)) - 100;
	Ti.API.log(hsCrossHair.top);
    return returnView;
};