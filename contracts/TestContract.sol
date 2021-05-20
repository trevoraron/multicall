pragma solidity >=0.7.6;
pragma experimental ABIEncoderV2;

/// @title TestContract -- to test the Multicall Contract
/// @author Trevor Aron <trevor.aron@coinbase.com>

contract TestContract {
    uint256 internal val;
    bool internal broke;

    constructor(uint256 initialVal, bool isBroke) {
        val = initialVal;
        broke = isBroke;
    }

    function getVal() public view returns (uint256) {
        require(!broke, "broken");
        return val;
    }
}
