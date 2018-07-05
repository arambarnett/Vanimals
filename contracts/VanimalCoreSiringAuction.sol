pragma solidity ^0.4.11;

import './SiringClockAuction.sol';

contract VanimalCoreSiringAuction is SiringClockAuction {
	function VanimalCoreSiringAuction(address _nftAddr, uint256 _cut) public
	SiringClockAuction(_nftAddr, _cut) {}
}
