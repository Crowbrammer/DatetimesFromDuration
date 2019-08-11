module.exports =  class DFD {
    private start: string;
    private end: string;
    private units: number;
    constructor(private duration: number | number[]) {
        // Units start out as hours
        // inXXXX will recalculate all the times.
        this.inHours();
        if (typeof duration === "number" || typeof duration === "string") {
            // Calc the start and end time for a single number;
            this.duration = parseInt(this.duration);
            this.start = this.getStartDatetime();
            this.end = this.getEndDatetime();
        } else if (Array.isArray(duration)) {
            // It's likely that strings will be passed in instead of 
            // actual numbers (do to form submissions). Convert the numbers
            // into arrays.
            let durations: number[] = [];
            for (let i: number = 0; i < (this.duration as number[]).length; i++) {
                durations.push(parseInt((this.duration[i] as string)))
            };
            this.duration = durations;
            // Store start and end times in an index
            if (duration.length === 0) {
                throw "Array of durations must be of length > 0";
            } else if (duration.length === 1) {
                // Calc the start and end time for a single number, but in the 0 property;
                this.setFirstStartAndEndTime();
            } else if (duration.length > 1) {
                this.setFirstStartAndEndTime();
                for (let i = 1; i < duration.length; i++) {
                    this[i] = {};
                    this[i].start = this[i-1].end;
                    // getEndDatetime needs to accept past start times, durations
                    this[i].end = this.getEndDatetime(this[i].start, parseInt(duration[i]));
                }
                // After the first 
            }
        } 
    }
    private setFirstStartAndEndTime() {
        this[0] = {};
        this[0].start = this.getStartDatetime();
        this[0].end = this.getEndDatetime();
    }

    private setSingleNumberDatetimes(obOrProperty: any) {
        obOrProperty.start = this.getStartDatetime();
        obOrProperty.end = this.getEndDatetime();
    }

    getStartDatetime(): string {
        return new Date().toLocaleString();
    }

    getEndDatetime(): string; 
    getEndDatetime(startTime?: string, duration?: number): string {
        
        if (!startTime || !duration) {
            return new Date(this.getEndDatetimePOSIX()).toLocaleString();
        } else {
            this.getEndDatetimePOSIX(startTime, duration);
            return new Date(this.getEndDatetimePOSIX(startTime, duration)).toLocaleString();
        }
    }


    getEndDatetimePOSIX(): number;
    getEndDatetimePOSIX(startTime?: string, duration?: number): number {
        if (!startTime && !duration) {
            let startTime = new Date(this.getStartDatetime()).valueOf();
            if (Array.isArray(this.duration)) {
                return startTime + this.units * this.duration[0];
            } else {
                return startTime + this.units * this.duration;
            }
        } else if (!startTime || !duration) {
            throw "You need both the start time and duration for this method."
        } else {
            return new Date(startTime).valueOf() + this.units * duration;
        }
    }
    /**
     * DFD will use the duration(s) as hours to determine start 
     * and end datetimes.
     */
    inDays(): void {
        this.units = 1000 * 60 * 60 * 24;
    }
    /**
     * DFD will use the duration(s) as hours to determine start 
     * and end datetimes.
     */
    inHours(): void {
        this.units = 1000 * 60 * 60;
    }
    /**
     * DFD will use the duration(s) as minutes to determine start 
     * and end datetimes.
     */
    inMinutes(): void {
        this.units = 1000 * 60;
    }
}