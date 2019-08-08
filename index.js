"use strict";
module.exports = /** @class */ (function () {
    function DFD(duration) {
        this.duration = duration;
        this.start = this.getStartDatetime();
        this.end = this.getEndDatetime();
    }
    DFD.prototype.getStartDatetime = function () {
        return new Date().toLocaleString();
    };
    DFD.prototype.getEndDatetime = function () {
        return new Date(this.getEndDatetimePOSIX()).toLocaleString();
    };
    DFD.prototype.getEndDatetimePOSIX = function () {
        return Date.now() + 1000 * 60 * 60 * this.duration;
    };
    return DFD;
}());
