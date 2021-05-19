pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2;

/// @title MulticallWrapper -- Wrapper Contract for use in testing
/// @author Trevor Aron <trevor.aron@coinbase.com>
struct Call {
    address target;
    bytes callData;
}

contract MulticallDeployed {
    function aggregate(Call[] memory calls) external view returns (uint256 blockNumber, bytes[] memory returnData) {}
}

contract MulticallWrapper {
    MulticallDeployed internal md;

    constructor(address _multicallAddress) {
        md = MulticallDeployed(_multicallAddress);
    }

    function aggregate(Call[] memory calls) external view returns (uint256 blockNumber, bytes[] memory returnData) {
        return md.aggregate(calls);
    }
}
