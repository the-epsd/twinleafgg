"use strict";
// export class Base64 {
exports.__esModule = true;
exports.Base64 = void 0;
//   public decode(s: string): string {
//     return decodeURIComponent(escape(atob(s)));
//   }
//   public encode(s: string): string {
//     return btoa(unescape(encodeURIComponent(s)));
//   }
// }
var Base64 = /** @class */ (function () {
    function Base64() {
        this.padchar = '=';
        this.alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    }
    Base64.prototype.getByte64 = function (s, i) {
        var idx = this.alpha.indexOf(s.charAt(i));
        if (idx === -1) {
            throw new Error('Cannot decode base64');
        }
        return idx;
    };
    Base64.prototype.decode = function (s) {
        // convert to string
        s = String(s);
        var pads = 0;
        var imax = s.length;
        if (imax === 0) {
            return s;
        }
        if (imax % 4 !== 0) {
            throw new Error('Cannot decode base64');
        }
        if (s.charAt(imax - 1) === this.padchar) {
            pads = 1;
            if (s.charAt(imax - 2) === this.padchar) {
                pads = 2;
            }
            // either way, we want to ignore this last block
            imax -= 4;
        }
        var x = [];
        var b10;
        var i;
        for (i = 0; i < imax; i += 4) {
            b10 = (this.getByte64(s, i) << 18) | (this.getByte64(s, i + 1) << 12) |
                (this.getByte64(s, i + 2) << 6) | this.getByte64(s, i + 3);
            x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff, b10 & 0xff));
        }
        switch (pads) {
            case 1:
                b10 = (this.getByte64(s, i) << 18) | (this.getByte64(s, i + 1) << 12) |
                    (this.getByte64(s, i + 2) << 6);
                x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff));
                break;
            case 2:
                b10 = (this.getByte64(s, i) << 18) | (this.getByte64(s, i + 1) << 12);
                x.push(String.fromCharCode(b10 >> 16));
                break;
            default:
        }
        return x.join('');
    };
    Base64.prototype.getByte = function (s, i) {
        var x = s.charCodeAt(i);
        if (x > 255) {
            throw new Error('INVALID_CHARACTER_ERR: DOM Exception 5');
        }
        return x;
    };
    Base64.prototype.encode = function (s) {
        s = String(s);
        var imax = s.length - s.length % 3;
        if (s.length === 0) {
            return s;
        }
        var x = [];
        var b10;
        var i;
        for (i = 0; i < imax; i += 3) {
            b10 = (this.getByte(s, i) << 16) | (this.getByte(s, i + 1) << 8) | this.getByte(s, i + 2);
            x.push(this.alpha.charAt(b10 >> 18));
            x.push(this.alpha.charAt((b10 >> 12) & 0x3F));
            x.push(this.alpha.charAt((b10 >> 6) & 0x3f));
            x.push(this.alpha.charAt(b10 & 0x3f));
        }
        switch (s.length - imax) {
            case 1:
                b10 = this.getByte(s, i) << 16;
                x.push(this.alpha.charAt(b10 >> 18) + this.alpha.charAt((b10 >> 12) & 0x3F) +
                    this.padchar + this.padchar);
                break;
            case 2:
                b10 = (this.getByte(s, i) << 16) | (this.getByte(s, i + 1) << 8);
                x.push(this.alpha.charAt(b10 >> 18) + this.alpha.charAt((b10 >> 12) & 0x3F) +
                    this.alpha.charAt((b10 >> 6) & 0x3f) + this.padchar);
                break;
            default:
        }
        return x.join('');
    };
    return Base64;
}());
exports.Base64 = Base64;
