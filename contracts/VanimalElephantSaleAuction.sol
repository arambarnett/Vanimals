pragma solidity ^0.4.11;

import './SaleClockAuction.sol';

contract VanimalElephantSaleAuction is SaleClockAuction {
	function VanimalElephantSaleAuction(address _nftAddr, uint256 _cut) public
	SaleClockAuction(_nftAddr, _cut) {}
}
