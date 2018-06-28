import React from 'react';
import BasePage from '../../lib/BasePage';
import Footer from '../../components/footer';
import Header from '../../components/header';

import VanimalCard from './vanimal-card';

export default class MarketplacePage extends BasePage {
	render() {
		return (
			<div
				className="page-fade-in"
				data-ix="page-fade-in"
				style={{ opacity: 1, transition: 'opacity 200ms' }}
			>
				<div className="banner portfolio">
					<Header />
					<div className="container w-container">
						<div className="center text">
							<div>
								<div className="section-tittle dark">Current Vanimals</div>
							</div>
						</div>
					</div>
				</div>
				<div className="section image small-footer">
					<div className="container w-container">
						<div className="algin-center">
							<div className="bottom-padding-80">
								<div className="algin-center">
									<h2 className="tab-features-heading">Market Place</h2>
									<div className="subtittle">Hopefully You get lucky and get the one you want</div>
									<div className="headline-sign">
										<div className="line-features gray" />
										<div className="color-line" />
									</div>
								</div>
							</div>
						</div>
						<div className="top-padding _80">
							<div data-duration-in={300} data-duration-out={100} className="w-tabs">
								<div className="tab-menu left-side w-tab-menu">
									<a
										data-w-tab="Tab 3"
										className="tab-link-style-2 w-inline-block w-tab-link w--current"
									>
										<div className="tab-tittle">All</div>
									</a>
									<a data-w-tab="Tab 4" className="tab-link-style-2 w-inline-block w-tab-link">
										<div className="tab-tittle">Breeding</div>
									</a>
									<a data-w-tab="Tab 5" className="tab-link-style-2 w-inline-block w-tab-link">
										<div className="tab-tittle">For Sale</div>
									</a>
									<a data-w-tab="Tab 6" className="tab-link-style-2 w-inline-block w-tab-link">
										<div className="tab-tittle">Design</div>
									</a>
								</div>
								<div className="tabs-content w-tab-content">
									<div className="portfolio-row style2 w-row">
										<VanimalCard />
										<VanimalCard />
										<VanimalCard />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);
	}
}
