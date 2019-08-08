module.exports =  class DFD {
    private start: string;
    private end: string;
    constructor(private duration: number) {
        this.start = this.getStartDatetime();
        this.end = this.getEndDatetime();
    }
    getStartDatetime(): string {
        return new Date().toLocaleString();
    }
    getEndDatetime(): string {
        return new Date(this.getEndDatetimePOSIX()).toLocaleString();
    }
    getEndDatetimePOSIX(): number {
        return Date.now() + 1000 * 60 * 60 * this.duration;
    }
}