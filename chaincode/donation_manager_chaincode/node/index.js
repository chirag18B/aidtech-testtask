const shim = require("fabric-shim");

const DonationManager = require("./donationManager");

shim.start(new DonationManager());
