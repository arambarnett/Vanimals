pragma solidity ^0.4.11;

import './SiringClockAuction.sol';

contract VanimalPigeonSiringAuction is SiringClockAuction {
	function VanimalPigeonSiringAuction(address _nftAddr, uint256 _cut) public
	SiringClockAuction(_nftAddr, _cut) {}
}
