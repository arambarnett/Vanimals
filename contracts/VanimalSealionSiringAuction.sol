pragma solidity ^0.4.11;

import './SiringClockAuction.sol';

contract VanimalSealionSiringAuction is SiringClockAuction {
	function VanimalSealionSiringAuction(address _nftAddr, uint256 _cut) public
	SiringClockAuction(_nftAddr, _cut) {}
}
