const expect = require('chai').expect;
const sinon = require('sinon');
const DFD = require('../index.js');

describe("Datetimes from Duration", () => {
    const getStartDatetime = sinon.stub(DFD.prototype, "getStartDatetime").returns("8/8/2019, 1:42:42 AM");
    const getEndDatetimePOSIX = sinon.stub(DFD.prototype, "getEndDatetimePOSIX").returns(1565260962879);
    // start time 1565242962879
    // end time 1565260962879

    it("Returns now for the start time.", () => {
        const dfd = new DFD(5); // Duration is in hours.
        expect(dfd.start).to.equal("8/8/2019, 1:42:42 AM");
    });
    
    it("Returns five hours from now for the end time.", () => {
        const dfd = new DFD(5); 
        expect(dfd.end).to.equal("8/8/2019, 6:42:42 AM");
    });
});