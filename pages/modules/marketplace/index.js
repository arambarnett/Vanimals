import React from 'react';
import BasePage from '../../lib/BasePage';
import api from '../../utilities/api';

import Grid from '@material-ui/core/Grid';

import Footer from '../../components/footer';
import VanimalCard from '../../components/vanimal-card';

export default class MarketplacePage extends BasePage {
	static async getInitialProps() {
		const vanimalsResponse = await api.listVanimals();
		const attributesResponse = await api.listAttributes();

		return { vanimals: vanimalsResponse.data, attributes: attributesResponse.data };
	}

	render() {
		return (
			<div
				className="page-fade-in"
				data-ix="page-fade-in"
				style={{ opacity: 1, transition: 'opacity 200ms' }}
			>
				<div className="banner portfolio">
					<div
						data-collapse="all"
						data-animation="over-right"
						data-duration={500}
						data-easing="ease-in-out"
						data-easing2="ease-out"
						data-doc-height={1}
						className="navigation left-ham-color w-nav"
					>
						<a href="../index.html" className="brand w-nav-brand">
							<img
								src="static/images/Vanimals-logo-main-white.png"
								width={140}
								srcSet="static/images/Vanimals-logo-main-white-p-500.png 500w, static/images/Vanimals-logo-main-white.png 543w"
								sizes="100vw"
								className="logo-image"
							/>
						</a>
						<div className="menu-button background color w-nav-button" data-ix="menu-button-hover">
							<div className="line-1 white" />
							<div className="line-3 white" />
							<div className="line-2 white" />
						</div>
						<div className="w-nav-overlay" data-wf-ignore />
					</div>
					<div className="container w-container">
						<div className="center text">
							<div>
								<div className="section-tittle dark" style={{ color: 'white' }}>
									Current Vanimals
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="section image small-footer">
					<div className="container w-container">
						<div className="algin-center">
							<div className="bottom-padding-80 marketplace-page">
								<div className="algin-center">
									<h2 className="tab-features-heading">MARKETPLACE</h2>
									<div className="subtittle">Hopefully you get lucky and get the one you want</div>
									<div className="headline-sign">
										<div className="line-features gray" />
										<div className="color-line" />
									</div>
									<form action="/search" className="search w-form">
										<input
											type="search"
											className="search-input w-input"
											maxLength={256}
											name="query"
											placeholder="Search…"
											id="search"
											required
										/>
										<input type="submit" defaultValue="Search" className="search-button w-button" />
									</form>
								</div>
							</div>
						</div>
						<div className="div-block-8">
							<a href="#" className="marketplace-tab w-button">
								All
							</a>
							<a href="#" className="marketplace-tab w-button">
								Breeding
							</a>
							<a href="#" className="marketplace-tab w-button">
								For Sale
							</a>
							<div data-delay={0} className="dropdown-2 w-dropdown">
								<div className="marketplace-tab dropdown w-dropdown-toggle">
									<div className="icon-10 w-icon-dropdown-toggle" />
									<div className="text-block-4">Type</div>
								</div>
								<nav className="w-dropdown-list">
									<a href="#" className="type-dropdown-link w-dropdown-link">
										Some
									</a>
									<a href="#" className="type-dropdown-link w-dropdown-link">
										Example
									</a>
									<a href="#" className="type-dropdown-link w-dropdown-link">
										Types
									</a>
								</nav>
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
								</div>
								<div className="tabs-content w-tab-content">
									<div data-w-tab="Tab 3" className="w-tab-pane w--tab-active">
										<Grid container spacing={24}>
											{this.props.vanimals.map(this.renderVanimal.bind(this))}
										</Grid>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="marketplace-button-wrapper">
						<a href="#" className="link-color-button-2 w-button">
							Next page
						</a>
					</div>
				</div>
				<Footer />
			</div>
		);
	}

	renderVanimal(vanimal) {
		return (
			<Grid key={vanimal.vanimal_id} item xs={12} sm={6} md={4}>
				<VanimalCard vanimal={vanimal} />
			</Grid>
		);
	}
}
