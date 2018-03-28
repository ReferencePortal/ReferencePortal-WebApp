var referenceToken = artifacts.require("./ReferenceToken.sol");

module.exports = function(deployer) {
  deployer.deploy(referenceToken);
};