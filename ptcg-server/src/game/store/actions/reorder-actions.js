"use strict";
exports.__esModule = true;
exports.ReorderHandAction = exports.ReorderBenchAction = void 0;
var ReorderBenchAction = /** @class */ (function () {
    function ReorderBenchAction(id, from, to) {
        this.id = id;
        this.from = from;
        this.to = to;
        this.type = 'REORDER_BENCH_ACTION';
    }
    return ReorderBenchAction;
}());
exports.ReorderBenchAction = ReorderBenchAction;
var ReorderHandAction = /** @class */ (function () {
    function ReorderHandAction(id, order) {
        this.id = id;
        this.order = order;
        this.type = 'REORDER_HAND_ACTION';
    }
    return ReorderHandAction;
}());
exports.ReorderHandAction = ReorderHandAction;
