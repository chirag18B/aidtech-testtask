var assert = require('assert');
var sinon = require('sinon');
var DonationManager = require('../donationManager');



describe('DonationManager', function() {
  var donation;
  before(()=> {
    donation = new DonationManager();
  })

  it('should return -1 when the value is not present', function() {

    const stub = {
      getFunctionAndParameters: () => {
        return 'tkalfj'
      }
    }

    var callback = sinon.stub(stub, 'getFunctionAndParameters');
    callback.returns(0);
    
    donation.Init({getFunctionAndParameters: stub.getFunctionAndParameters});
    // assert.equal([1, 2, 3].indexOf(4), -1);
  });
});



