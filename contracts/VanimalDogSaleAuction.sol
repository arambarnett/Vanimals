pragma solidity ^0.4.11;

import './SaleClockAuction.sol';

contract VanimalDogSaleAuction is SaleClockAuction {
	function VanimalDogSaleAuction(address _nftAddr, uint256 _cut) public
	SaleClockAuction(_nftAddr, _cut) {}
}
