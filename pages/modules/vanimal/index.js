import React from 'react';
import BasePage from '../../lib/BasePage';
import Footer from '../../components/footer';
import Header from '../../components/header';

import api from '../../utilities/api';

export default class VanimalPage extends BasePage {
	static async getInitialProps(props) {
		const vanimalId = props.query.id;
		const vanimalResponse = await api.fetchVanimal(vanimalId);

		return { vanimal: vanimalResponse.data };
	}

	render() {
		return (
			<div
				className="page-fade-in"
				data-ix="page-fade-in"
				style={{ opacity: 1, transition: 'opacity 200ms' }}
			>
				<div className="banner portfolio single">
					<div className="container w-container">
						<div>
							<div>
								<p
									className="paragraph-project dark portfolio"
									data-ix="fade-up"
									style={{
										opacity: 1,
										transform: 'translateX(0px) translateY(0px) translateZ(0px)',
										transition: 'opacity 500ms, transform 800ms'
									}}
								>
									Vanimal #{this.props.vanimal.vanimal_id}
								</p>
								<div
									className="section-tittle dark"
									data-ix="fade-up-2"
									style={{
										opacity: 1,
										transform: 'translateX(0px) translateY(0px) translateZ(0px)',
										transition: 'opacity 500ms, transform 800ms',
										color: 'white'
									}}
								>
									{this.props.vanimal.name}
								</div>
								<div className="contact-us-content portfolio">
									<div className="vertical-column-row w-row">
										<div className="w-col w-col-4">
											<div
												className="contact-small-content"
												data-ix="fade-right"
												style={{
													opacity: 1,
													transform: 'translateX(0px) translateY(0px) translateZ(0px)',
													transition: 'opacity 500ms, transform 800ms'
												}}
											>
												<h5 className="contact-us-small-tittle black">Population</h5>
												<div className="paragraph">{this.props.vanimal.population || '--'}</div>
											</div>
										</div>
										<div className="w-col w-col-4">
											<div
												className="contact-small-content middle"
												data-ix="fade-left-2"
												style={{
													opacity: 1,
													transform: 'translateX(0px) translateY(0px) translateZ(0px)',
													transition: 'opacity 500ms, transform 800ms'
												}}
											>
												<h5 className="contact-us-small-tittle black">Status</h5>
												<div className="paragraph">{this.props.vanimal.status || '--'}</div>
											</div>
										</div>
										<div className="w-col w-col-4">
											<div
												className="contact-small-content"
												data-ix="fade-right"
												style={{
													opacity: 1,
													transform: 'translateX(0px) translateY(0px) translateZ(0px)',
													transition: 'opacity 500ms, transform 800ms'
												}}
											>
												<h5 className="contact-us-small-tittle black">Distribution</h5>
												<div className="paragraph">{this.props.vanimal.distrobution || '--'}</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="section">
					<div className="container w-container">
						<div className="vertical-column-row w-row">
							<div className="w-col w-col-6 w-col-stack">
								<div
									className="left-side-div-image first"
									data-ix="fade-left-2"
									style={{
										backgroundImage: `url(${this.props.vanimal.image_url})`,
										opacity: 1,
										transform: 'translateX(0px) translateY(0px) translateZ(0px)',
										transition: 'opacity 500ms, transform 800ms'
									}}
								/>
							</div>
							<div className="w-col w-col-1 w-col-stack" />
							<div className="portfolio-content-side-block w-col w-col-5 w-col-stack">
								<div className="info-portfolio-div">
									<h1
										className="section-tittle-hero-white in-half-section"
										data-ix="fade-up"
										style={{
											opacity: 1,
											transform: 'translateX(0px) translateY(0px) translateZ(0px)',
											transition: 'opacity 500ms, transform 800ms'
										}}
									>
										{this.props.vanimal.name}
									</h1>
									<p
										data-ix="fade-up-2"
										style={{
											opacity: 1,
											transform: 'translateX(0px) translateY(0px) translateZ(0px)',
											transition: 'opacity 500ms, transform 800ms'
										}}
									>
										{this.props.vanimal.description}
									</p>
									<div
										className="divider"
										data-ix="fade-up-3"
										style={{
											opacity: 1,
											transform: 'translateX(0px) translateY(0px) translateZ(0px)',
											transition: 'opacity 500ms, transform 800ms'
										}}
									/>
									<h6
										data-ix="fade-up-4"
										style={{
											opacity: 1,
											transform: 'translateX(0px) translateY(0px) translateZ(0px)',
											transition: 'opacity 500ms, transform 800ms'
										}}
									>
										Location
									</h6>
									<p
										data-ix="fade-up-5"
										style={{
											opacity: 1,
											transform: 'translateX(0px) translateY(0px) translateZ(0px)',
											transition: 'opacity 500ms, transform 800ms'
										}}
									>
										{this.props.vanimal.location || '--'}
										<br />
									</p>
									<div
										className="divider"
										data-ix="fade-up-6"
										style={{
											opacity: 1,
											transform: 'translateX(0px) translateY(0px) translateZ(0px)',
											transition: 'opacity 500ms, transform 800ms'
										}}
									/>
									<h6
										data-ix="fade-up-6"
										style={{
											opacity: 1,
											transform: 'translateX(0px) translateY(0px) translateZ(0px)',
											transition: 'opacity 500ms, transform 800ms'
										}}
									>
										Rarity
									</h6>
									<p
										data-ix="fade-up-7"
										style={{
											opacity: 1,
											transform: 'translateX(0px) translateY(0px) translateZ(0px)',
											transition: 'opacity 500ms, transform 800ms'
										}}
									>
										{this.props.vanimal.rarity || '--'}
									</p>
									<div
										className="social-wrapper footer"
										data-ix="fade-up-8"
										style={{
											opacity: 1,
											transform: 'translateX(0px) translateY(0px) translateZ(0px)',
											transition: 'opacity 500ms, transform 800ms'
										}}
									>
										<a href="#" className="social-icon w-inline-block" />
										<a href="#" className="social-icon insta w-inline-block" />
										<a href="#" className="social-icon twitter w-inline-block" />
										<a href="#" className="social-icon gmail w-inline-block" />
									</div>
									<div
										className="top-padding"
										data-ix="fade-up-9"
										style={{
											opacity: 1,
											transform: 'translateX(0px) translateY(0px) translateZ(0px)',
											transition: 'opacity 500ms, transform 800ms'
										}}
									>
										<a
											href="../about-us/about-2.html"
											className="link-color-button w-inline-block"
											data-ix="button-overlay-on-hover"
											style={{ transition: 'all 0.3s ease 0s' }}
										>
											<div
												className="button-overlay"
												data-ix="intitialoverlay-button"
												style={{
													width: '0%',
													transform: 'translateX(0px) translateY(0px) translateZ(0px)',
													transition: 'width 400ms'
												}}
											/>
											<div className="button-text">Put up for Auction</div>
										</a>
									</div>
									<div
										className="top-padding"
										data-ix="fade-up-9"
										style={{
											opacity: 1,
											transform: 'translateX(0px) translateY(0px) translateZ(0px)',
											transition: 'opacity 500ms, transform 800ms'
										}}
									>
										<a
											href="#"
											data-w-id="78236d6c-9ff7-8929-72d0-57e3b8eafb73"
											className="link-color-button w-inline-block"
										>
											<div
												className="button-overlay"
												data-ix="intitialoverlay-button"
												style={{
													width: '0%',
													transform: 'translateX(0px) translateY(0px) translateZ(0px)'
												}}
											/>
											<div className="button-text">View Snapcode</div>
										</a>
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
