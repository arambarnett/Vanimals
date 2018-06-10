import react from 'react';
import BasePage from '../base/page';
import { DrizzleProvider } from 'drizzle-react';

import SaleAuction from '../build/contracts/SaleClockAuction.json';
import SiringAuction from '../build/contracts/SiringClockAuction.json';
import KittyCore from '../build/contracts/KittyCore.json';

const Window = require('window');
const window = new Window();

export default class IndexPage extends BasePage {
	render() {
		const options = {
			contracts: [SaleAuction, SiringAuction, KittyCore]
		};

		return (
			<DrizzleProvider options={options}>
				<div>Welcome to next.js!</div>
			</DrizzleProvider>
		);
	}
}
