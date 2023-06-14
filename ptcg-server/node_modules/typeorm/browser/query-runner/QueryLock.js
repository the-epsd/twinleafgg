import { __awaiter, __generator, __read, __spreadArray } from "tslib";
var QueryLock = /** @class */ (function () {
    function QueryLock() {
        this.queue = [];
    }
    QueryLock.prototype.acquire = function () {
        return __awaiter(this, void 0, void 0, function () {
            var release, waitingPromise, otherWaitingPromises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        waitingPromise = new Promise(function (ok) { return release = ok; });
                        otherWaitingPromises = __spreadArray([], __read(this.queue));
                        // Put ourselves onto the end of the queue
                        this.queue.push(waitingPromise);
                        if (!(otherWaitingPromises.length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all(otherWaitingPromises)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, function () {
                            release();
                            if (_this.queue.includes(waitingPromise)) {
                                _this.queue.splice(_this.queue.indexOf(waitingPromise), 1);
                            }
                        }];
                }
            });
        });
    };
    return QueryLock;
}());
export { QueryLock };

//# sourceMappingURL=QueryLock.js.map
