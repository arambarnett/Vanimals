import React from 'react';
import BasePage from './lib/BasePage';

import api from './utilities/api';

import Grid from '@material-ui/core/Grid';

import Footer from './components/footer';
import VanimalCard from './components/vanimal-card';

export default class HomePage extends BasePage {
	static async getInitialProps() {
		const vanimalsResponse = await api.listVanimals({ is_featured: true });
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
				<div
					data-w-id="95f227a7-5e33-01e4-670e-8e3976c48bc9"
					className="banner second"
					style={{ willChange: 'opacity', opacity: 1 }}
				>
					<div className="colored-square-background-div colored-square-lighter" />
					<div className="colored-square-background-div" />
					<div className="container-fluid">
						<div
							data-w-id="077ddd05-2b35-be02-7011-68ba7dbe7337"
							className="row w-row"
							style={{
								willChange: 'transform',
								transform:
									'translateX(0px) translateY(0px) translateZ(0px) scaleX(1) scaleY(1) scaleZ(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skewX(0deg) skewY(0deg)'
							}}
						>
							<div className="w-col w-col-6 w-col-stack">
								<div className="div-left-headline second">
									<div
										className="subtittle bold"
										data-ix="fade-up-2"
										style={{
											opacity: 1,
											transform: 'translateX(0px) translateY(0px) translateZ(0px)',
											transition: 'opacity 500ms, transform 800ms'
										}}
									>
										Catch rare animals
									</div>
									<div
										className="baner-big-text smaller"
										data-ix="fade-up-3"
										style={{
											opacity: 1,
											transform: 'translateX(0px) translateY(0px) translateZ(0px)',
											transition: 'opacity 500ms, transform 800ms'
										}}
									>
										COLLECTING VIRTUAL EXOTIC ANIMALS<br />
										<span className="text-span-2">
											VANIMALS<br />
										</span>
									</div>
									<div
										className="top-padding"
										data-ix="fade-up-4"
										style={{
											opacity: 1,
											transform: 'translateX(0px) translateY(0px) translateZ(0px)',
											transition: 'opacity 500ms, transform 800ms'
										}}
									>
										<a
											href="/store"
											className="link-color-button w-inline-block"
											data-ix="button-overlay-on-hover"
											style={{ transition: 'all 0.3s ease 0s' }}
										>
											<div
												className="button-overlay"
												data-ix="intitialoverlay-button"
												style={{
													width: '0%',
													transform: 'translateX(0px) translateY(0px) translateZ(0px)'
												}}
											/>
											<div className="button-text">Buy Now</div>
										</a>
									</div>
								</div>
							</div>
							<div className="w-col w-col-6 w-col-stack">
								<img
									src="/static/images/image-1.png"
									srcSet="/static/images/image-1-p-500.png 500w, /static/images/image-1-p-800.png 800w, /static/images/image-1.png 900w"
									sizes="(max-width: 479px) 78vw, (max-width: 767px) 83vw, (max-width: 991px) 75vw, 46vw"
									className="imac-image"
									data-ix="fade-left-3"
									style={{
										opacity: 1,
										transform: 'translateX(0px) translateY(0px) translateZ(0px)',
										transition: 'opacity 500ms, transform 800ms'
									}}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="w-clearfix">
					<div className="half-section image-background">
						<a
							href="#"
							className="lightbox-link w-inline-block w-lightbox"
							data-ix="fade-left-2"
							style={{
								opacity: 1,
								transform: 'translateX(0px) translateY(0px) translateZ(0px)',
								transition: 'opacity 500ms, transform 800ms'
							}}
						>
							<div
								className="play-button left purple white"
								data-ix="zoom-in-hover"
								style={{ transition: 'all 0.2s ease 0s' }}
							>
								<div
									className="play-icon-style-2 white"
									data-ix="play-button-wave"
									style={{
										opacity: 0,
										transform: 'scaleX(1.7) scaleY(1.7)',
										transition: 'transform 1200ms, opacity 1200ms'
									}}
								/>
								<div
									className="play-icon-style-2 white"
									data-ix="play-button-wave-2"
									style={{ opacity: 1, transform: 'scaleX(1) scaleY(1)' }}
								/>
							</div>
						</a>
					</div>
					<div className="half-section">
						<div className="center-container-content">
							<div
								data-ix="fade-right"
								style={{
									opacity: 1,
									transform: 'translateX(0px) translateY(0px) translateZ(0px)',
									transition: 'opacity 500ms, transform 800ms'
								}}
							>
								<h1 className="section-tittle-hero-white in-half-section">
									Buy.<br />Breed.<br />Trade.
								</h1>
								<div className="subtittle left-padding">
									Buy and sell unique Vanimals through breeding
								</div>
								<p>
									Each Vanimal has its own unique and permanent DNA. These DNA can be combined to
									create an offspring, with a brand new DNA&nbsp;of its own. Buy, breed, and trade
									Vanimals with enthusiasts around the world.
								</p>
								<div className="top-padding">
									<a
										href="/about"
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
										<div className="button-text">Learn More</div>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="w-clearfix">
					<div className="half-section">
						<div className="center-container-content">
							<div
								data-ix="fade-right"
								style={{
									opacity: 1,
									transform: 'translateX(0px) translateY(0px) translateZ(0px)',
									transition: 'opacity 500ms, transform 800ms'
								}}
							>
								<h1 className="section-tittle-hero-white in-half-section">Show Them Off.</h1>
								<div className="subtittle left-padding">
									Share your Vanimals with your friends on Snapchat
								</div>
								<p>
									Vanimals are not just for the digital world. Bring your Vanimals into real-life
									via augmented reality using Vanimations. Have you ever seen an elephant dab? a
									pigeon do the foxtrot?&nbsp;These Vanimations bring your Vanimals to life with
									dances and expressions that let you interact with your Vanimal in a unique and
									human experience.
								</p>
								<div className="top-padding">
									<a
										href="/my-account"
										className="link-color-button w-inline-block"
										data-ix="button-overlay-on-hover"
										style={{ transition: 'all 0.3s ease 0s' }}
									>
										<div
											className="button-overlay"
											data-ix="intitialoverlay-button"
											style={{
												width: '0%',
												transform: 'translateX(0px) translateY(0px) translateZ(0px)'
											}}
										/>
										<div className="button-text">Try it Out</div>
									</a>
								</div>
							</div>
						</div>
					</div>
					<div
						className="half-section image-background ipad"
						data-ix="fade-left-2"
						style={{
							opacity: 1,
							transform: 'translateX(0px) translateY(0px) translateZ(0px)',
							transition: 'opacity 500ms, transform 800ms'
						}}
					/>
				</div>

				<div className="w-clearfix">
					<div className="half-section image-background">
						<a
							href="#"
							className="lightbox-link-2 w-inline-block w-lightbox"
							data-ix="fade-left-2"
							style={{
								opacity: 1,
								transform: 'translateX(0px) translateY(0px) translateZ(0px)',
								transition: 'opacity 500ms, transform 800ms'
							}}
						>
							<div
								className="play-button left purple white"
								data-ix="zoom-in-hover"
								style={{ transition: 'all 0.2s ease 0s' }}
							>
								<div
									className="play-icon-style-2 white"
									data-ix="play-button-wave"
									style={{ opacity: 1, transform: 'scaleX(1) scaleY(1)' }}
								/>
								<div
									className="play-icon-style-2 white"
									data-ix="play-button-wave-2"
									style={{ opacity: 1, transform: 'scaleX(1) scaleY(1)' }}
								/>
							</div>
						</a>
					</div>
					<div className="half-section">
						<div className="center-container-content">
							<div
								data-ix="fade-right"
								style={{
									opacity: 1,
									transform: 'translateX(0px) translateY(0px) translateZ(0px)',
									transition: 'opacity 500ms, transform 800ms'
								}}
							>
								<h1 className="section-tittle-hero-white in-half-section">Be the Best</h1>
								<div className="subtittle left-padding">
									Collect, breed, and conserve the most valuable Vanimals to ascend to the top of
									the herd.
								</div>
								<p>
									By breeding the rarest Vanimals in the world (the rarest Vanimals have the most
									unique colors), you can become the top conservationist on the planet, recognized
									far and wide across the Vanimals universe for your conservationist prowess.
								</p>
								<div className="top-padding">
									<a
										href="/faq"
										className="link-color-button w-inline-block"
										data-ix="button-overlay-on-hover"
										style={{ transition: 'all 0.3s ease 0s' }}
									>
										<div
											className="button-overlay"
											data-ix="intitialoverlay-button"
											style={{
												width: '0%',
												transform: 'translateX(0px) translateY(0px) translateZ(0px)'
											}}
										/>
										<div className="button-text">Read More</div>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="w-clearfix">
					<div
						className="half-section gray"
						data-ix="fade-right"
						style={{
							opacity: 1,
							transform: 'translateX(0px) translateY(0px) translateZ(0px)',
							transition: 'opacity 500ms, transform 800ms'
						}}
					>
						<div className="center-container-content intro">
							<div>
								<h1 className="section-tittle-hero-white in-half-section">Vanimal Colors</h1>
								<div className="subtittle left-padding">Check out the amazing colorways</div>
								<div className="top-padding _40">
									<Grid container spacing={16}>
										{this.props.attributes.map(this.renderAttribute.bind(this))}
									</Grid>
								</div>
							</div>
						</div>
					</div>
					<div
						className="half-section image-background intro"
						data-ix="fade-left-2"
						style={{
							opacity: 1,
							transform: 'translateX(0px) translateY(0px) translateZ(0px)',
							transition: 'opacity 500ms, transform 800ms'
						}}
					/>
				</div>
				<div className="section">
					<div className="container w-container">
						<div className="algin-center">
							<div className="bottom-padding-80">
								<div className="algin-center">
									<h2 className="tab-features-heading">Meet The Vanimals</h2>
									<div className="subtittle">Click on the Vanimals to learn more about them</div>
									<div className="headline-sign">
										<div className="line-features gray" />
										<div className="color-line" />
									</div>
								</div>
							</div>
						</div>
						<div className="top-padding _80">
							<div data-duration-in={300} data-duration-out={100} className="w-tabs">
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
				</div>
				<div>
					<div className="section background-image gradient">
						<div>
							<div>
								<div>
									<div className="container w-container">
										<div className="div-center-headline">
											<div
												className="subtittle bold white-one"
												data-ix="fade-right"
												style={{
													opacity: 1,
													transform: 'translateX(0px) translateY(0px) translateZ(0px)',
													transition: 'opacity 500ms, transform 800ms'
												}}
											>
												Forever yours
											</div>
											<div
												className="baner-big-text white center"
												data-ix="fade-left"
												style={{
													opacity: 1,
													transform: 'translateX(0px) translateY(0px) translateZ(0px)',
													transition: 'opacity 500ms, transform 800ms'
												}}
											>
												Every Vanimal is authentically yours. The integrity of its DNA is publicly
												visible for all to see, showing both your ownership and your Vanimal’s
												genetic heritage. This means the value you’re creating by trading, breeding,
												and conserving can never be duplicated, never be forged, and always bears
												your fingerprint.{' '}
											</div>
											<div
												className="important-text white"
												data-ix="fade-up-3"
												style={{
													opacity: 1,
													transform: 'translateX(0px) translateY(0px) translateZ(0px)',
													transition: 'opacity 500ms, transform 800ms'
												}}
											>
												&nbsp;Learn More About Blockchain Tech Here
											</div>
										</div>
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

	renderVanimal(vanimal) {
		return (
			<Grid key={vanimal.vanimal_id} item xs={12} sm={6} md={4}>
				<VanimalCard vanimal={vanimal} />
			</Grid>
		);
	}

	renderAttribute(attribute) {
		return (
			<Grid item xs={6} sm={4} md={3} key={attribute.attribute_id}>
				<a
					href={`/marketplace?attribute_id=${attribute.attribute_id}`}
					className="inner-link w-button"
				>
					{attribute.name}
				</a>
			</Grid>
		);
	}
}
