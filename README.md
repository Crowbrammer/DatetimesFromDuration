# DatetimesFromDuration
To make schedules with durations (for tasks), you need two of the three pieces of the puzzle: duration, start time, and end time. The user provides the duration, the time the duration is submitted provides the start time, and this thing creates the end time from these two. I've needed this in many projects, so I've made a separate project for it.

```js
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
});
```