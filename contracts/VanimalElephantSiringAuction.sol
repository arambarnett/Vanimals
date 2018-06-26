pragma solidity ^0.4.11;

import './SiringClockAuction.sol';

contract VanimalElephantSiringAuction is SiringClockAuction {
	function VanimalElephantSiringAuction(address _nftAddr, uint256 _cut) public
	SiringClockAuction(_nftAddr, _cut) {}
}
