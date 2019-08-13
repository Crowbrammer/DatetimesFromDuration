"use strict";
module.exports = class DFD {
    constructor(duration) {
        this.duration = duration;
        // Units start out as hours
        // inXXXX will recalculate all the times.
        this.start = "";
        this.end = "";
        this.dates = {};
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
    splitIt() {
        this.dates = {};
        // Is it possible to have this[0] if an array is passed in? 
        if (this[0]) {
            // Do it for all startEnd timestrings. Not an array, so I'll use 
            // the original list of durations.
            for (let i = 0; i < this.duration.length; i++) {
                // It creates an array at the date, if not arealdy
                let date = new Date(this[i].start).toLocaleDateString();
                if (!this[date])
                    this[date] = [];
                // Make it available in the dates property, too.
                if (!this.dates[date])
                    this.dates[date] = this[date];
                // Put the timestring of the start datetime string and end datetime string,
                // into another object;
                let startTime = new Date(this[i].start).toLocaleTimeString();
                let endTime = new Date(this[i].end).toLocaleTimeString();
                let startEndTimestring = {
                    start: startTime,
                    end: endTime
                };
                // Add it to the list of actions under the time.
                this[date].push(startEndTimestring);
            }
        }
        else {
            // It should handle if one number/string was passed as a duration.
            // This largely repeats the above branch. Could be refactored easily. 
            // It creates an array at the date, if not arealdy
            let date = new Date(this.start).toLocaleDateString();
            if (!this[date])
                this[date] = [];
            // Make it available in the dates property, too.
            if (!this.dates[date])
                this.dates[date] = this[date];
            // Put the timestring of the start datetime string and end datetime string,
            // into another object;
            let startTime = new Date(this.start).toLocaleTimeString();
            let endTime = new Date(this.end).toLocaleTimeString();
            let startEndTimestring = {
                start: startTime,
                end: endTime
            };
            // Add it to the list of actions under the time.
            this[date].push(startEndTimestring);
        }
        // When all start & end times are accounted for, return this.
        return this;
        // return {
        //     "8/8/2019": [
        //         {start: "1:42:42 AM", end: "6:42:42 AM"},
        //         {start: "6:42:42 AM AM", end: "12:42:42 PM"},
        //         {start: "12:42:42 PM", end: "3:42:42 PM"}
        //     ]
        // }
    }
};
