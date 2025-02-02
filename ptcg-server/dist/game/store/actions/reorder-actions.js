export class ReorderBenchAction {
    constructor(id, from, to) {
        this.id = id;
        this.from = from;
        this.to = to;
        this.type = 'REORDER_BENCH_ACTION';
    }
}
export class ReorderHandAction {
    constructor(id, order) {
        this.id = id;
        this.order = order;
        this.type = 'REORDER_HAND_ACTION';
    }
}
