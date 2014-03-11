/*
  html2canvas @VERSION@ <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
*/

function hexToRGBA(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: parseInt(result[4] || "aa", 16) / 255
    } : null;
}

function rgbaToRGBAObject (rgba) {
    var result = /^\s*(?:rgb|rgba)\(\s*([0-9]+),\s*([0-9]+),\s*([0-9]+)(?:\)|,\s*([0-9\.]+)\))/i.exec(rgba);
    return result ? {
        r: parseInt(result[1], 10),
        g: parseInt(result[2], 10),
        b: parseInt(result[3], 10),
        a: parseInt(result[4] || 1, 10)
    } : null;
}

function colorToRGBA (color) {
    return color.indexOf("rgb") == -1 ? hexToRGBA(color) : rgbaToRGBAObject(color);
}  

// size in points: 'a3': [841.89, 1190.55]
_html2canvas.Renderer.PDF = function( options ) {

    options = options || {};

    var doc = document,

    methods,

    //pageWidth = 1190,
    // pageHeight = 841;

    methods = {
        _create: function( zStack, options, doc, queue, _html2canvas ) {

            function drawShape ( pdf, originPoint, args ) {                                    
                var i, len = args.length;
                
                var endPoint = originPoint, vectorShifts = [];

                for ( i = 0; i < len; i++ ) {
                    var argsArgs = args[i]["arguments"];
                    switch(args[i].name) {
                        case "moveTo":
                            originPoint = [argsArgs[0], argsArgs[1]];
                            endPoint = originPoint;
                            break;
                        case "lineTo":
                            vectorShifts.push([argsArgs[0] - endPoint[0], argsArgs[1] - endPoint[1]]);
                            endPoint = [argsArgs[0],argsArgs[1]];
                            break;
                    }

                }
                vectorShifts.push([originPoint[0] - endPoint[0], originPoint[1] - endPoint[1]]);

                pdf.lines(vectorShifts, originPoint[0], originPoint[1], [1,1], "F");
            }

            var renderElement = $(options.elements[0]);

            var pdf = new jsPDF('landscape','pt', [renderElement.outerWidth(true), renderElement.outerHeight(true)]),
                storageContext,
                i,
                queueLen,
                a,
                bounds,
                storageLen,
                renderItem,
                safeImages,
                fstyle,
                bstyle,
                cstyle,
                tmp = {},
                value,
                fontProperties,
                property;

            tmp.fillColor = colorToRGBA(zStack.backgroundColor);
            tmp.globalAlpha = tmp.fillColor.a;
            // pdf.setDrawColor(0);
            pdf.setFillColor(tmp.fillColor.r,tmp.fillColor.b,tmp.fillColor.g);

            for ( i = 0, queueLen = queue.length; i < queueLen; i+=1 ) {

                storageContext = queue.splice(0, 1)[0];
                storageContext.canvasPosition = storageContext.canvasPosition || {};

                if (storageContext.ctx.storage){

                    for (a = 0, storageLen = storageContext.ctx.storage.length; a < storageLen; a+=1){

                        renderItem = storageContext.ctx.storage[a];


                        switch(renderItem.type){
                            case "variable":
                                // ctx[renderItem.name] = renderItem['arguments'];
                                switch(renderItem.name) {
                                    case "globalAlpha":
                                        tmp.globalAlpha = renderItem["arguments"];
                                        break;
                                    case "fillStyle":
                                        // fstyle = tmp.fillColor;
                                        value = renderItem["arguments"];
                                        tmp.fillColor = colorToRGBA(value);
                                        pdf.setFillColor(tmp.fillColor.r, tmp.fillColor.g, tmp.fillColor.b);
                                        break;
                                    case "font":
                                        // normal normal bold 32px 'DejaVu Sans', 'URW Gothic L', 'Helvetica Neue', Helvetica, Arial, 'Microsoft Sans Serif', sans-serif
                                        tmp.fontNames = renderItem["arguments"].split(","); // style size font
                                        fontProperties = tmp.fontNames[0].split(" ");
                                        if (tmp.fontNames.length > 1) {
                                            tmp.fontNames = tmp.fontNames.slice(1);
                                        } else {
                                            tmp.fontNames = [];
                                        }

                                        while ( property = fontProperties.shift() ) {

                                            if (isNaN(property.replace(/px$/,""))) {
                                                tmp.fontStyle = property;
                                            } else {
                                                tmp.fontSize = parseInt(property, 10);
                                                break;
                                            }
                                        }

                                        tmp.fontNames.unshift(fontProperties.join(" "));

                                        pdf.setFontType(tmp.fontStyle);
                                        pdf.setFontSize(tmp.fontSize);
                                        
                                        fonts:
                                        while ( tmp.fontName = tmp.fontNames.shift() ) {
                                            switch (tmp.fontName.toLowerCase()) {
                                                case "arial":
                                                case "verdana":
                                                case "tahoma":
                                                case "geneva":
                                                case "trebuchet ms":
                                                case "MS Sans Serif":
                                                case "sans-serif":
                                                    tmp.fontName = "helvetica";
                                                    break;
                                                case "arial black":
                                                case "impact":
                                                case "charcoal":
                                                case "gadget":
                                                    tmp.fontName = "helvetica";
                                                    pdf.setFontType("bold");
                                                    break;
                                                case "times new roman":
                                                case "georgia":
                                                case "comic sans ms":
                                                case "palatino linotype":
                                                case "book antiqua":
                                                case "palatino":
                                                case "MS Serif":
                                                case "New York":
                                                case "serif":
                                                    tmp.fontName = "times";
                                                    break;
                                                case "lucida console":
                                                case "lucida sans unicode":
                                                case "monaco":
                                                case "lucida grande":
                                                case "monospace":
                                                    tmp.fontName = "courier";
                                                    break;
                                            }
                                            switch (tmp.fontName.toLowerCase()) {
                                                case "helvetica":
                                                case "helvetica-bold":
                                                case "helvetica-oblique":
                                                case "helvetica-boldoblique":
                                                case "courier":
                                                case "courier-bold":
                                                case "courier-oblique":
                                                case "courier-boldoblique":
                                                case "times":
                                                case "times-roman":
                                                case "times-bold":
                                                case "times-italic":
                                                case "times-bolditalic":
                                                    pdf.setFont(tmp.fontName); // only knows some fonts, so fix this
                                                    break fonts;
                                                default:
                                                    try {
                                                        pdf.setFont("times");
                                                    } catch (e) {
                                                        pdf.setFontType("normal");
                                                        pdf.setFont("times");
                                                        console.log(JSON.stringify(pdf.getFontList()));
                                                    }
                                                    break;
                                            }
                                        }
                                        break;
                                    default:
                                        name = renderItem.name;
                                        value = renderItem["arguments"];
                                        break;
                                }
                                break;
                            case "function":
                                if (renderItem.name === "fillRect") {
                                    // globally non-transparent and fill color non-transparent
                                    if (tmp.globalAlpha && tmp.fillColor.a) {
                                        pdf.rect.apply(pdf, Array.prototype.slice.call(renderItem["arguments"]).concat("F"));
                                    }

                                } else if (renderItem.name === "drawShape") {
                                    if (tmp.globalAlpha && tmp.fillColor.a) {
                                        var originPoint = [0,0];
                                        
                                        drawShape(pdf, originPoint, renderItem["arguments"]);
                                    }
                                } else if (renderItem.name === "fillText") {
                                    if (tmp.globalAlpha) {
                                        value = renderItem["arguments"];
                                        pdf.setTextColor(tmp.fillColor.r, tmp.fillColor.g, tmp.fillColor.b);
                                        pdf.text.call(pdf, value[1], value[2], value[0]);
                                    }

                                } else if (renderItem.name === "drawImage") {

                                    if (tmp.globalAlpha && renderItem['arguments'][8] > 0 && renderItem['arguments'][7]) {

                                        value = renderItem["arguments"];
                                        tmp.img = value[0];

                                        tmp.canvas = document.createElement("canvas");
                                        document.body.appendChild(tmp.canvas);
                                        tmp.canvas.width = tmp.img.width;
                                        tmp.canvas.height = tmp.img.height;

                                        tmp.ctx = tmp.canvas.getContext("2d");
                                        tmp.ctx.drawImage( tmp.img, 0, 0);

                                        switch(tmp.img.src.substring(tmp.img.src.lastIndexOf("."))) {
                                            case ".jpg":
                                                tmp.imageMime = "image/jpeg";
                                                tmp.imageType = "JPEG";
                                                break;
                                            case ".png":
                                                tmp.imageMime = "image/png";
                                                tmp.imageType = "PNG";
                                                break;
                                        }
                                        tmp.data = atob(tmp.canvas.toDataURL(tmp.imageMime).slice(('data:' + tmp.imageMime + ";base64,").length));
                                        document.body.removeChild(tmp.canvas);

                                        pdf.addImage(tmp.data, tmp.imageType, value[5], value[6], value[7], value[8]);
                                    }
                                }

                                break;
                            default:

                        }

                    }

                }

            }

            pdf.output("datauriwindow");
            return pdf;
        }
    };

    return methods;

};