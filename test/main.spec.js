const expect = require('chai').expect;
const sinon = require('sinon');
const DFD = require('../index.js');

describe("Datetimes from Duration", () => {
    let getStartDatetime;
    let getEndDatetimePOSIX;

    // start time 1565242962879
    // end time 1565260962879

    beforeEach(() => {
        getStartDatetime = sinon.stub(DFD.prototype, "getStartDatetime").returns("8/8/2019, 1:42:42 AM");
        getEndDatetimePOSIX = sinon.stub(DFD.prototype, "getEndDatetimePOSIX").returns(1565260962879);
    });

    afterEach(() => {
        getStartDatetime.restore();
        getEndDatetimePOSIX.restore();
    });

    it("Returns now for the start time.", () => {
        const dfd = new DFD(5); // Duration is in hours.
        expect(dfd.start).to.equal("8/8/2019, 1:42:42 AM");
    });
    
    it("Returns five hours from now for the end time.", () => {
        const dfd = new DFD(5); 
        expect(dfd.end).to.equal("8/8/2019, 6:42:42 AM");
    });
    
    it("Returns five minutes from now for the end time.", () => {
        getEndDatetimePOSIX.restore();
        const dfd = new DFD(5).inMinutes(); 
        expect(dfd.start).to.equal("8/8/2019, 1:42:42 AM");
        expect(dfd.end).to.equal("8/8/2019, 1:47:42 AM");
    });
    
    it("Works if the number is repped as a string", () => {
        const dfd = new DFD("5"); 
        expect(dfd.start).to.equal("8/8/2019, 1:42:42 AM");
        expect(dfd.end).to.equal("8/8/2019, 6:42:42 AM");

    });

    it("Handles an array of one number", () => {
        //
        const dfd = new DFD([5]);
        expect(dfd[0].end).to.equal("8/8/2019, 6:42:42 AM");
    });

    it("Handles an array of one number repped as a string", () => {
        const dfd = new DFD(["5"]); 
        expect(dfd[0].start).to.equal("8/8/2019, 1:42:42 AM");
        expect(dfd[0].end).to.equal("8/8/2019, 6:42:42 AM");

    });

    it("Makes the start time of the second task the same as the end time of the first task", () => {
        const dfd = new DFD([5, 6]);
        expect(dfd[0].end).to.equal("8/8/2019, 6:42:42 AM");
        expect(dfd[1].start).to.equal("8/8/2019, 6:42:42 AM");
        
    });
    
    it("Makes the end time of the second task 6 hours after the end time of the first task", () => {
        getEndDatetimePOSIX.restore();
        const dfd = new DFD([5, 6]);
        expect(dfd[0].start).to.equal("8/8/2019, 1:42:42 AM");
        expect(dfd[0].end).to.equal("8/8/2019, 6:42:42 AM");
        expect(dfd[1].end).to.equal("8/8/2019, 12:42:42 PM");
        
    });
    
    it("Returns a series of start and end times if an array is passed", () => {
        getEndDatetimePOSIX.restore();
        const dfd = new DFD([5, 6, 3]);
        expect(dfd[0].end).to.equal("8/8/2019, 6:42:42 AM");
        // End time of second should be new Date(1565282562879).toLocaleString();
        expect(dfd[1].start).to.equal("8/8/2019, 6:42:42 AM");
        expect(dfd[1].end).to.equal("8/8/2019, 12:42:42 PM");
        expect(dfd[2].start).to.equal("8/8/2019, 12:42:42 PM");
        expect(dfd[2].end).to.equal("8/8/2019, 3:42:42 PM");
    });
    
    it("Returns a series of start and end times if an array of numbers repped as strings is passed", () => {
        getEndDatetimePOSIX.restore();
        const dfd = new DFD(["5", "6", "3"]);
        expect(dfd[0].end).to.equal("8/8/2019, 6:42:42 AM");
        // End time of second should be new Date(1565282562879).toLocaleString();
        expect(dfd[1].start).to.equal("8/8/2019, 6:42:42 AM");
        expect(dfd[1].end).to.equal("8/8/2019, 12:42:42 PM");
        expect(dfd[2].start).to.equal("8/8/2019, 12:42:42 PM");
        expect(dfd[2].end).to.equal("8/8/2019, 3:42:42 PM");
    });
    
    it("Batches startEndTime objects under a date", () => {
        getEndDatetimePOSIX.restore();
        const dfd = new DFD(["5", "6", "3"]).splitIt();
        let expectedResult = {
            "8/8/2019": [
                {start: "1:42:42 AM", end: "6:42:42 AM"},
                {start: "6:42:42 AM", end: "12:42:42 PM"},
                {start: "12:42:42 PM", end: "3:42:42 PM"}
            ]
        }
        expect(dfd).to.deep.include(expectedResult);
    });
    
    it("Batches startEndTime objects under a date, even if a single duration is put in", () => {
        getEndDatetimePOSIX.restore();
        const dfd = new DFD(5).splitIt();
        let expectedResult = {
            "8/8/2019": [
                {start: "1:42:42 AM", end: "6:42:42 AM"}
            ]
        }
        expect(dfd).to.deep.include(expectedResult);
    });
    
    it("Let's me get the dates from the dates property", () => {
        getEndDatetimePOSIX.restore();
        const dfd = new DFD(5).splitIt();
        let expectedResult = {
            "8/8/2019": [
                {start: "1:42:42 AM", end: "6:42:42 AM"}
            ]
        }
        expect(dfd.dates).to.deep.include(expectedResult);
    });
});