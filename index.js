"use strict";
module.exports = class DFD {
    constructor(duration) {
        this.duration = duration;
        // Units start out as hours
        // inXXXX will recalculate all the times.
        this.start = "";
        this.end = "";
        const HOURS = 1000 * 60 * 60;
        this.units = HOURS;
        this.createStartAndEndTimes(duration);
    }
    createStartAndEndTimes(duration) {
        if (typeof duration === "number" || typeof duration === "string") {
            // Calc the start and end time for a single number;
            this.duration = parseInt(this.duration);
            this.start = this.getStartDatetime();
            this.end = this.getEndDatetime();
        }
        else if (Array.isArray(duration)) {
            // It's likely that strings will be passed in instead of 
            // actual numbers (do to form submissions). Convert the numbers
            // into arrays.
            this.convertDurationsFromStringsToNumbers();
            // Store start and end times in an index
            if (duration.length === 0) {
                throw "Array of durations must be of length > 0";
            }
            else if (duration.length === 1) {
                // Calc the start and end time for a single number, but in the 0 property;
                this.setFirstStartAndEndTime();
            }
            else if (duration.length > 1) {
                this.setFirstStartAndEndTime();
                for (let i = 1; i < duration.length; i++) {
                    this[i] = {};
                    this[i].start = this[i - 1].end;
                    this[i].end = this.getEndDatetime(this[i].start, parseInt((duration[i])));
                }
            }
        }
    }
    convertDurationsFromStringsToNumbers() {
        let durations = [];
        for (let i = 0; i < this.duration.length; i++) {
            // parseInt also works with integers.
            durations.push(parseInt(this.duration[i]));
        }
        ;
        this.duration = durations;
    }
    setFirstStartAndEndTime() {
        this[0] = {};
        this[0].start = this.getStartDatetime();
        this[0].end = this.getEndDatetime();
    }
    setSingleNumberDatetimes(obOrProperty) {
        obOrProperty.start = this.getStartDatetime();
        obOrProperty.end = this.getEndDatetime();
    }
    getStartDatetime() {
        return new Date().toLocaleString();
    }
    getEndDatetime(startTime, duration) {
        if (!startTime || !duration) {
            return new Date(this.getEndDatetimePOSIX()).toLocaleString();
        }
        else {
            this.getEndDatetimePOSIX(startTime, duration);
            return new Date(this.getEndDatetimePOSIX(startTime, duration)).toLocaleString();
        }
    }
    getEndDatetimePOSIX(startTime, duration) {
        if (!startTime && !duration) {
            let startTime = new Date(this.getStartDatetime()).valueOf(); // can this be this.start?
            if (Array.isArray(this.duration)) {
                return startTime + this.units * this.duration[0];
            }
            else {
                return startTime + this.units * this.duration;
            }
        }
        else if (!startTime || !duration) {
            throw "You need both the start time and duration for this method.";
        }
        else {
            return new Date(startTime).valueOf() + this.units * duration;
        }
    }
    /**
     * DFD will use the duration(s) as hours to determine start
     * and end datetimes.
     */
    inDays() {
        this.units = 1000 * 60 * 60 * 24;
    }
    /**
     * DFD will use the duration(s) as hours to determine start
     * and end datetimes.
     */
    inHours() {
        this.units = 1000 * 60 * 60;
    }
    /**
     * DFD will use the duration(s) as minutes to determine start
     * and end datetimes.
     */
    inMinutes() {
        this.units = 1000 * 60;
        this.createStartAndEndTimes(this.duration);
        return this;
    }
};
