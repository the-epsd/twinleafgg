"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryLock = void 0;
var tslib_1 = require("tslib");
var QueryLock = /** @class */ (function () {
    function QueryLock() {
        this.queue = [];
    }
    QueryLock.prototype.acquire = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var release, waitingPromise, otherWaitingPromises;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        waitingPromise = new Promise(function (ok) { return release = ok; });
                        otherWaitingPromises = tslib_1.__spreadArray([], tslib_1.__read(this.queue));
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
exports.QueryLock = QueryLock;

//# sourceMappingURL=QueryLock.js.map
