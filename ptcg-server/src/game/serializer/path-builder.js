"use strict";
exports.__esModule = true;
exports.PathBuilder = void 0;
var PathBuilder = /** @class */ (function () {
    function PathBuilder() {
        this.parents = [];
    }
    PathBuilder.prototype.goTo = function (node, key) {
        var parentIndex = this.parents.findIndex(function (p) { return p.node === node; });
        if (parentIndex !== -1) {
            this.parents.length = parentIndex;
        }
        this.parents.push({ node: node, key: key });
    };
    PathBuilder.prototype.getPath = function () {
        var parts = this.parents
            .map(function (p) { return p.key; })
            .filter(function (key) { return !!key; });
        return parts.join('.');
    };
    PathBuilder.prototype.getValue = function (root, path) {
        var parts = path.split('.');
        var value = root;
        try {
            for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                var part = parts_1[_i];
                value = value[part];
            }
        }
        catch (error) {
            return;
        }
        return value;
    };
    return PathBuilder;
}());
exports.PathBuilder = PathBuilder;
