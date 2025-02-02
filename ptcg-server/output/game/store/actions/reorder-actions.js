"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReorderHandAction = exports.ReorderBenchAction = void 0;
class ReorderBenchAction {
    constructor(id, from, to) {
        this.id = id;
        this.from = from;
        this.to = to;
        this.type = 'REORDER_BENCH_ACTION';
    }
}
exports.ReorderBenchAction = ReorderBenchAction;
class ReorderHandAction {
    constructor(id, order) {
        this.id = id;
        this.order = order;
        this.type = 'REORDER_HAND_ACTION';
    }
}
exports.ReorderHandAction = ReorderHandAction;
