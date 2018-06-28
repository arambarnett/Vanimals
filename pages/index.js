import React from 'react';
import BasePage from './lib/BasePage';

import Footer from './components/footer';
import Header from './components/header';

export default class HomePage extends BasePage {
	static async getInitialProps() {
		return {};
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
					<Header />
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
											href="../about-us/about.html"
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
										href="../service/service.html"
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
										href="../service/service-2.html"
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
									opacity: 0,
									transform: 'translateX(-60px) translateY(0px) translateZ(0px)'
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
										href="../service/service-2.html"
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
						style={{ opacity: 0, transform: 'translateX(-60px) translateY(0px) translateZ(0px)' }}
					>
						<div className="center-container-content intro">
							<div>
								<h1 className="section-tittle-hero-white in-half-section">Vanimal Colors</h1>
								<div className="subtittle left-padding">Check out the amazing colorways</div>
								<div className="top-padding _40">
									<div className="row-button w-row">
										<div className="w-col w-col-3 w-col-medium-3">
											<a href="../about-us/about.html" className="inner-link w-button">
												Diamond
											</a>
										</div>
										<div className="w-col w-col-3 w-col-medium-3">
											<a href="../about-us/about-2.html" className="inner-link w-button">
												Green
											</a>
										</div>
										<div className="w-col w-col-3 w-col-medium-3">
											<a href="../about-us/about-3.html" className="inner-link w-button">
												Gold
											</a>
										</div>
										<div className="w-col w-col-3 w-col-medium-3">
											<a href="../about-us/about-4.html" className="inner-link w-button">
												Orange
											</a>
										</div>
									</div>
									<div className="row-button w-row">
										<div className="w-col w-col-3">
											<a href="../service/service.html" className="inner-link w-button">
												Tourquoise
											</a>
										</div>
										<div className="w-col w-col-3">
											<a href="../service/service-2.html" className="inner-link w-button">
												Galaxy
											</a>
										</div>
										<div className="w-col w-col-3">
											<a href="../service/service-3.html" className="inner-link w-button">
												Chrome
											</a>
										</div>
										<div className="w-col w-col-3">
											<a href="../vanimals-site/portfolio-3.html" className="inner-link w-button">
												Purple
											</a>
										</div>
									</div>
									<div className="row-button w-row">
										<div className="w-col w-col-3">
											<a href="../vanimals-site/portfolio-2.html" className="inner-link w-button">
												Jade
											</a>
										</div>
										<div className="w-col w-col-3">
											<a href="../portfolio/portfolio-3.html" className="inner-link w-button">
												Lemon
											</a>
										</div>
										<div className="w-col w-col-3">
											<a
												href="../vanimals-site/single-portfolio.html"
												className="inner-link w-button"
											>
												Red
											</a>
										</div>
										<div className="w-col w-col-3">
											<a href="../blog/blog.html" className="inner-link w-button">
												Water
											</a>
										</div>
									</div>
									<div className="row-button w-row">
										<div className="w-col w-col-3">
											<a href="../blog/blog-2.html" className="inner-link w-button">
												Lobster
											</a>
										</div>
										<div className="w-col w-col-3">
											<a href="../blog/blog-3.html" className="inner-link w-button">
												Copper
											</a>
										</div>
										<div className="w-col w-col-3">
											<a href="../contact/contact-1.html" className="inner-link w-button">
												Green Fractal
											</a>
										</div>
										<div className="w-col w-col-3">
											<a href="../contact/contact.html" className="inner-link w-button">
												Circuit Board
											</a>
										</div>
									</div>
									<div className="row-button w-row">
										<div className="w-col w-col-3">
											<a href="../pages/table.html" className="inner-link w-button">
												Raspberry
											</a>
										</div>
										<div className="w-col w-col-3">
											<a href="../pages/f-a-q.html" className="inner-link w-button">
												Circuit Board
											</a>
										</div>
										<div className="w-col w-col-3">
											<a href="../vanimals-site/coming-soon.html" className="inner-link w-button">
												Glowing Moss
											</a>
										</div>
										<div className="w-col w-col-3">
											<a href="../pages/blog.html" className="inner-link w-button">
												Speckled Blue
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div
						className="half-section image-background intro"
						data-ix="fade-left-2"
						style={{ opacity: 0, transform: 'translateX(60px) translateY(0px) translateZ(0px)' }}
					/>
				</div>
				<div className="section">
					<div className="container w-container">
						<div className="algin-center">
							<div className="bottom-padding-80">
								<div className="algin-center">
									<h2 className="tab-features-heading">Featured Vanimals</h2>
									<div className="subtittle">The Vanimals you can collect</div>
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
										<div className="tab-tittle">Critically Endangered</div>
									</a>
									<a data-w-tab="Tab 5" className="tab-link-style-2 w-inline-block w-tab-link">
										<div className="tab-tittle">Endangered</div>
									</a>
									<a data-w-tab="Tab 6" className="tab-link-style-2 w-inline-block w-tab-link">
										<div className="tab-tittle">Ubiquitous</div>
									</a>
								</div>
								<div className="tabs-content w-tab-content">
									<div data-w-tab="Tab 3" className="w-tab-pane w--tab-active">
										<div className="portfolio-row style2 w-row">
											<div className="column-iteam style-2 w-clearfix w-col w-col-4 w-col-medium-4">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
													data-ix="fade-up"
													style={{
														transition: 'all 0.3s ease 0s',
														opacity: 0,
														transform: 'translateX(0px) translateY(60px) translateZ(0px)'
													}}
												>
													<div className="project-image">
														<img
															src="/static/images/jona-dinges-tiger.jpg"
															width={200}
															height={260}
															srcSet="/static/images/jona-dinges-tiger-p-500.jpeg 500w, /static/images/jona-dinges-tiger.jpg 800w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 30vw"
															className="tab-style-2-image"
														/>
														<div
															className="overlay-image"
															data-ix="overlay-hide-content-image"
															style={{ transition: 'all 0.3s ease 0s' }}
														>
															<div
																className="project-content style _4"
																data-ix="hide-project-overlay-on-initial"
																style={{ opacity: 0 }}
															/>
														</div>
													</div>
													<div className="white-portfolio-content">
														<p className="paragraph-project dark _5">Critically Endangered</p>
														<h4 className="project-header white-content">Sumatran Tiger</h4>
													</div>
												</a>
											</div>
											<div className="column-iteam style-2 w-clearfix w-col w-col-4 w-col-medium-4">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
													data-ix="fade-up-2"
													style={{
														transition: 'all 0.3s ease 0s',
														opacity: 0,
														transform: 'translateX(0px) translateY(60px) translateZ(0px)'
													}}
												>
													<div className="project-image">
														<img
															src="/static/images/oleg-stebenyev-r4-gorilla-f.jpg"
															width={200}
															height={260}
															srcSet="/static/images/oleg-stebenyev-r4-gorilla-f-p-500.jpeg 500w, /static/images/oleg-stebenyev-r4-gorilla-f-p-800.jpeg 800w, /static/images/oleg-stebenyev-r4-gorilla-f-p-1080.jpeg 1080w, /static/images/oleg-stebenyev-r4-gorilla-f-p-1600.jpeg 1600w, /static/images/oleg-stebenyev-r4-gorilla-f.jpg 1827w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 30vw"
															className="tab-style-2-image"
														/>
														<div
															className="overlay-image"
															data-ix="overlay-hide-content-image"
															style={{ transition: 'all 0.3s ease 0s' }}
														>
															<div
																className="project-content style _5"
																data-ix="hide-project-overlay-on-initial"
																style={{ opacity: 0 }}
															/>
														</div>
													</div>
													<div className="white-portfolio-content">
														<p className="paragraph-project dark _3"> Critically Endangered</p>
														<h4 className="project-header white-content">Cross River Gorilla</h4>
													</div>
												</a>
											</div>
											<div className="column-iteam style-2 w-clearfix w-col w-col-4 w-col-medium-4">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
													data-ix="fade-up-3"
													style={{
														transition: 'all 0.3s ease 0s',
														opacity: 0,
														transform: 'translateX(0px) translateY(60px) translateZ(0px)'
													}}
												>
													<div className="project-image">
														<img
															src="/static/images/elephant.jpg"
															width={200}
															height={260}
															srcSet="/static/images/elephant-p-500.jpeg 500w, /static/images/elephant-p-800.jpeg 800w, /static/images/elephant.jpg 900w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 30vw"
															className="tab-style-2-image"
														/>
														<div
															className="overlay-image"
															data-ix="overlay-hide-content-image"
															style={{ transition: 'all 0.3s ease 0s' }}
														>
															<div
																className="project-content style _1"
																data-ix="hide-project-overlay-on-initial"
																style={{ opacity: 0 }}
															/>
														</div>
													</div>
													<div className="white-portfolio-content">
														<p className="paragraph-project dark _3">Critically Endangered</p>
														<h4 className="project-header white-content">Elephant</h4>
													</div>
												</a>
											</div>
										</div>
										<div className="portfolio-row style2 w-row">
											<div className="column-iteam style-2 w-clearfix w-col w-col-4 w-col-medium-4">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
													data-ix="fade-up-4"
													style={{
														transition: 'all 0.3s ease 0s',
														opacity: 0,
														transform: 'translateX(0px) translateY(60px) translateZ(0px)'
													}}
												>
													<div className="project-image">
														<img
															src="/static/images/alvaro-bernal-21561.jpg"
															srcSet="/static/images/alvaro-bernal-21561-p-1080.jpeg 1080w, /static/images/alvaro-bernal-21561-p-1600.jpeg 1600w, /static/images/alvaro-bernal-21561-p-2000.jpeg 2000w, /static/images/alvaro-bernal-21561-p-2600.jpeg 2600w, /static/images/alvaro-bernal-21561-p-3200.jpeg 3200w, /static/images/alvaro-bernal-21561.jpg 4272w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 30vw"
															className="tab-style-2-image"
														/>
														<div
															className="overlay-image"
															data-ix="overlay-hide-content-image"
															style={{ transition: 'all 0.3s ease 0s' }}
														>
															<div
																className="project-content style _1"
																data-ix="hide-project-overlay-on-initial"
																style={{ opacity: 0 }}
															/>
														</div>
													</div>
													<div className="white-portfolio-content">
														<p className="paragraph-project dark _2">Critically Endangered</p>
														<h4 className="project-header white-content">Lemur</h4>
													</div>
												</a>
											</div>
											<div className="column-iteam style-2 w-clearfix w-col w-col-4 w-col-medium-4">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
													data-ix="fade-up-5"
													style={{
														transition: 'all 0.3s ease 0s',
														opacity: 0,
														transform: 'translateX(0px) translateY(60px) translateZ(0px)'
													}}
												>
													<div className="project-image">
														<img
															src="/static/images/malte-wingen-381987.jpg"
															srcSet="/static/images/malte-wingen-381987-p-1080.jpeg 1080w, /static/images/malte-wingen-381987-p-1600.jpeg 1600w, /static/images/malte-wingen-381987-p-2000.jpeg 2000w, /static/images/malte-wingen-381987-p-2600.jpeg 2600w, /static/images/malte-wingen-381987-p-3200.jpeg 3200w, /static/images/malte-wingen-381987.jpg 5760w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 30vw"
															className="tab-style-2-image"
														/>
														<div
															className="overlay-image"
															data-ix="overlay-hide-content-image"
															style={{ transition: 'all 0.3s ease 0s' }}
														>
															<div
																className="project-content style _2"
																data-ix="hide-project-overlay-on-initial"
																style={{ opacity: 0 }}
															/>
														</div>
													</div>
													<div className="white-portfolio-content">
														<p className="paragraph-project dark _5">Endangered</p>
														<h4 className="project-header white-content">Sea Lion</h4>
													</div>
												</a>
											</div>
											<div className="column-iteam style-2 w-clearfix w-col w-col-4 w-col-medium-4">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
													data-ix="fade-up-6"
													style={{
														transition: 'all 0.3s ease 0s',
														opacity: 0,
														transform: 'translateX(0px) translateY(60px) translateZ(0px)'
													}}
												>
													<div className="project-image">
														<img
															src="/static/images/temple-cerulean-421274.jpg"
															srcSet="/static/images/temple-cerulean-421274-p-1080.jpeg 1080w, /static/images/temple-cerulean-421274-p-1600.jpeg 1600w, /static/images/temple-cerulean-421274-p-2000.jpeg 2000w, /static/images/temple-cerulean-421274-p-2600.jpeg 2600w, /static/images/temple-cerulean-421274-p-3200.jpeg 3200w, /static/images/temple-cerulean-421274.jpg 6000w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 30vw"
															className="tab-style-2-image"
														/>
														<div
															className="overlay-image"
															data-ix="overlay-hide-content-image"
															style={{ transition: 'all 0.3s ease 0s' }}
														>
															<div
																className="project-content style"
																data-ix="hide-project-overlay-on-initial"
																style={{ opacity: 0 }}
															/>
														</div>
													</div>
													<div className="white-portfolio-content">
														<p className="paragraph-project dark">Endangered</p>
														<h4 className="project-header white-content">Panda</h4>
													</div>
												</a>
											</div>
										</div>
									</div>
									<div data-w-tab="Tab 4" className="w-tab-pane">
										<div className="portfolio-row style2 w-row">
											<div className="column-iteam style-2 w-clearfix w-col w-col-4 w-col-medium-4">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
												>
													<div className="project-image">
														<img
															src="/static/images/alvaro-bernal-21561.jpg"
															srcSet="/static/images/alvaro-bernal-21561-p-1080.jpeg 1080w, /static/images/alvaro-bernal-21561-p-1600.jpeg 1600w, /static/images/alvaro-bernal-21561-p-2000.jpeg 2000w, /static/images/alvaro-bernal-21561-p-2600.jpeg 2600w, /static/images/alvaro-bernal-21561-p-3200.jpeg 3200w, /static/images/alvaro-bernal-21561.jpg 4272w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 30vw"
															className="tab-style-2-image"
														/>
														<div
															className="overlay-image"
															data-ix="overlay-hide-content-image"
															style={{ transition: 'all 0.3s ease 0s' }}
														>
															<div
																className="project-content style _1"
																data-ix="hide-project-overlay-on-initial"
																style={{ opacity: 0 }}
															/>
														</div>
													</div>
													<div className="white-portfolio-content">
														<p className="paragraph-project dark _4">Design Idea</p>
														<h4 className="project-header white-content">Design Domo</h4>
													</div>
												</a>
											</div>
											<div className="column-iteam style-2 w-clearfix w-col w-col-4 w-col-medium-4">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
												>
													<div className="project-image">
														<img
															src="/static/images/malte-wingen-381987.jpg"
															srcSet="/static/images/malte-wingen-381987-p-1080.jpeg 1080w, /static/images/malte-wingen-381987-p-1600.jpeg 1600w, /static/images/malte-wingen-381987-p-2000.jpeg 2000w, /static/images/malte-wingen-381987-p-2600.jpeg 2600w, /static/images/malte-wingen-381987-p-3200.jpeg 3200w, /static/images/malte-wingen-381987.jpg 5760w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 30vw"
															className="tab-style-2-image"
														/>
														<div
															className="overlay-image"
															data-ix="overlay-hide-content-image"
															style={{ transition: 'all 0.3s ease 0s' }}
														>
															<div
																className="project-content style _2"
																data-ix="hide-project-overlay-on-initial"
																style={{ opacity: 0 }}
															/>
														</div>
													</div>
													<div className="white-portfolio-content">
														<p className="paragraph-project dark _5">Design Idea</p>
														<h4 className="project-header white-content">Design Domo</h4>
													</div>
												</a>
											</div>
											<div className="column-iteam style-2 w-clearfix w-col w-col-4 w-col-medium-4">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
												>
													<div className="project-image">
														<img
															src="/static/images/temple-cerulean-421274.jpg"
															srcSet="/static/images/temple-cerulean-421274-p-1080.jpeg 1080w, /static/images/temple-cerulean-421274-p-1600.jpeg 1600w, /static/images/temple-cerulean-421274-p-2000.jpeg 2000w, /static/images/temple-cerulean-421274-p-2600.jpeg 2600w, /static/images/temple-cerulean-421274-p-3200.jpeg 3200w, /static/images/temple-cerulean-421274.jpg 6000w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 30vw"
															className="tab-style-2-image"
														/>
														<div
															className="overlay-image"
															data-ix="overlay-hide-content-image"
															style={{ transition: 'all 0.3s ease 0s' }}
														>
															<div
																className="project-content style"
																data-ix="hide-project-overlay-on-initial"
																style={{ opacity: 0 }}
															/>
														</div>
													</div>
													<div className="white-portfolio-content">
														<p className="paragraph-project dark">Design Idea</p>
														<h4 className="project-header white-content">Design Domo</h4>
													</div>
												</a>
											</div>
										</div>
									</div>
									<div data-w-tab="Tab 5" className="w-tab-pane">
										<div className="portfolio-row style2 w-row">
											<div className="column-iteam style-2 w-clearfix w-col w-col-4 w-col-medium-4">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
												>
													<div className="project-image">
														<img
															src="/static/images/temple-cerulean-421274.jpg"
															srcSet="/static/images/temple-cerulean-421274-p-1080.jpeg 1080w, /static/images/temple-cerulean-421274-p-1600.jpeg 1600w, /static/images/temple-cerulean-421274-p-2000.jpeg 2000w, /static/images/temple-cerulean-421274-p-2600.jpeg 2600w, /static/images/temple-cerulean-421274-p-3200.jpeg 3200w, /static/images/temple-cerulean-421274.jpg 6000w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 30vw"
															className="tab-style-2-image"
														/>
														<div
															className="overlay-image"
															data-ix="overlay-hide-content-image"
															style={{ transition: 'all 0.3s ease 0s' }}
														>
															<div
																className="project-content style"
																data-ix="hide-project-overlay-on-initial"
																style={{ opacity: 0 }}
															/>
														</div>
													</div>
													<div className="white-portfolio-content">
														<p className="paragraph-project dark">Design Idea</p>
														<h4 className="project-header white-content">Design Domo</h4>
													</div>
												</a>
											</div>
											<div className="column-iteam style-2 w-clearfix w-col w-col-4 w-col-medium-4">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
												>
													<div className="project-image">
														<img
															src="/static/images/malte-wingen-381987.jpg"
															srcSet="/static/images/malte-wingen-381987-p-1080.jpeg 1080w, /static/images/malte-wingen-381987-p-1600.jpeg 1600w, /static/images/malte-wingen-381987-p-2000.jpeg 2000w, /static/images/malte-wingen-381987-p-2600.jpeg 2600w, /static/images/malte-wingen-381987-p-3200.jpeg 3200w, /static/images/malte-wingen-381987.jpg 5760w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 30vw"
															className="tab-style-2-image"
														/>
														<div
															className="overlay-image"
															data-ix="overlay-hide-content-image"
															style={{ transition: 'all 0.3s ease 0s' }}
														>
															<div
																className="project-content style _2"
																data-ix="hide-project-overlay-on-initial"
																style={{ opacity: 0 }}
															/>
														</div>
													</div>
													<div className="white-portfolio-content">
														<p className="paragraph-project dark _5">Design Idea</p>
														<h4 className="project-header white-content">Design Domo</h4>
													</div>
												</a>
											</div>
											<div className="column-iteam style-2 w-clearfix w-col w-col-4 w-col-medium-4">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
												>
													<div className="project-image">
														<img
															src="/static/images/scott-webb-347201.jpg"
															srcSet="/static/images/scott-webb-347201-p-500.jpeg 500w, /static/images/scott-webb-347201-p-1080.jpeg 1080w, /static/images/scott-webb-347201-p-1600.jpeg 1600w, /static/images/scott-webb-347201-p-2000.jpeg 2000w, /static/images/scott-webb-347201-p-2600.jpeg 2600w, /static/images/scott-webb-347201-p-3200.jpeg 3200w, /static/images/scott-webb-347201.jpg 6000w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 30vw"
															className="tab-style-2-image"
														/>
														<div
															className="overlay-image"
															data-ix="overlay-hide-content-image"
															style={{ transition: 'all 0.3s ease 0s' }}
														>
															<div
																className="project-content style _5"
																data-ix="hide-project-overlay-on-initial"
																style={{ opacity: 0 }}
															/>
														</div>
													</div>
													<div className="white-portfolio-content">
														<p className="paragraph-project dark _2">Design Idea</p>
														<h4 className="project-header white-content">Design Domo</h4>
													</div>
												</a>
											</div>
										</div>
									</div>
									<div data-w-tab="Tab 6" className="w-tab-pane">
										<div className="portfolio-row style2 w-row">
											<div className="column-iteam style-2 w-clearfix w-col w-col-4 w-col-medium-4">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
												>
													<div className="project-image">
														<img
															src="/static/images/keila-hotzel-395555.jpg"
															srcSet="/static/images/keila-hotzel-395555-p-1080.jpeg 1080w, /static/images/keila-hotzel-395555-p-1600.jpeg 1600w, /static/images/keila-hotzel-395555-p-2000.jpeg 2000w, /static/images/keila-hotzel-395555-p-2600.jpeg 2600w, /static/images/keila-hotzel-395555-p-3200.jpeg 3200w, /static/images/keila-hotzel-395555.jpg 4200w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 30vw"
															className="tab-style-2-image"
														/>
														<div
															className="overlay-image"
															data-ix="overlay-hide-content-image"
															style={{ transition: 'all 0.3s ease 0s' }}
														>
															<div
																className="project-content style _4"
																data-ix="hide-project-overlay-on-initial"
																style={{ opacity: 0 }}
															/>
														</div>
													</div>
													<div className="white-portfolio-content">
														<p className="paragraph-project dark _1">Design Idea</p>
														<h4 className="project-header white-content">Design Domo</h4>
													</div>
												</a>
											</div>
											<div className="column-iteam style-2 w-clearfix w-col w-col-4 w-col-medium-4">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
												>
													<div className="project-image">
														<img
															src="/static/images/scott-webb-347201.jpg"
															srcSet="/static/images/scott-webb-347201-p-500.jpeg 500w, /static/images/scott-webb-347201-p-1080.jpeg 1080w, /static/images/scott-webb-347201-p-1600.jpeg 1600w, /static/images/scott-webb-347201-p-2000.jpeg 2000w, /static/images/scott-webb-347201-p-2600.jpeg 2600w, /static/images/scott-webb-347201-p-3200.jpeg 3200w, /static/images/scott-webb-347201.jpg 6000w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 30vw"
															className="tab-style-2-image"
														/>
														<div
															className="overlay-image"
															data-ix="overlay-hide-content-image"
															style={{ transition: 'all 0.3s ease 0s' }}
														>
															<div
																className="project-content style _5"
																data-ix="hide-project-overlay-on-initial"
																style={{ opacity: 0 }}
															/>
														</div>
													</div>
													<div className="white-portfolio-content">
														<p className="paragraph-project dark _2">Design Idea</p>
														<h4 className="project-header white-content">Design Domo</h4>
													</div>
												</a>
											</div>
											<div className="column-iteam style-2 w-clearfix w-col w-col-4 w-col-medium-4">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
												>
													<div className="project-image">
														<img
															src="/static/images/ash-edmonds-488225.jpg"
															srcSet="/static/images/ash-edmonds-488225-p-800.jpeg 800w, /static/images/ash-edmonds-488225-p-1080.jpeg 1080w, /static/images/ash-edmonds-488225-p-1600.jpeg 1600w, /static/images/ash-edmonds-488225-p-2000.jpeg 2000w, /static/images/ash-edmonds-488225-p-2600.jpeg 2600w, /static/images/ash-edmonds-488225-p-3200.jpeg 3200w, /static/images/ash-edmonds-488225.jpg 4570w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 30vw"
															className="tab-style-2-image"
														/>
														<div
															className="overlay-image"
															data-ix="overlay-hide-content-image"
															style={{ transition: 'all 0.3s ease 0s' }}
														>
															<div
																className="project-content style _1"
																data-ix="hide-project-overlay-on-initial"
																style={{ opacity: 0 }}
															/>
														</div>
													</div>
													<div className="white-portfolio-content">
														<p className="paragraph-project dark _4">Design Idea</p>
														<h4 className="project-header white-content">Design Domo</h4>
													</div>
												</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="section color-purple clients">
					<div className="w-container">
						<div className="bottom-padding _50">
							<div className="algin-center">
								<h1 className="section-tittle-hero-white white">Our Partners</h1>
								<div className="subtittle white">Build Motion Digital Projects for Startups</div>
								<div className="headline-sign">
									<div className="line-features gray" />
									<div className="color-line white" />
								</div>
							</div>
						</div>
						<div
							data-ix="fade-up-2"
							style={{
								opacity: 1,
								transform: 'translateX(0px) translateY(0px) translateZ(0px)',
								transition: 'opacity 500ms, transform 800ms'
							}}
						>
							<a className="client-logo color-link first w-inline-block" />
							<a href="#" className="client-logo _1 color-link w-inline-block" />
							<a href="#" className="client-logo _2 color-link w-inline-block" />
							<a href="#" className="client-logo color-link w-inline-block" />
							<a href="#" className="client-logo _5 color-link w-inline-block" />
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
													opacity: 0,
													transform: 'translateX(-60px) translateY(0px) translateZ(0px)'
												}}
											>
												FOrever yours
											</div>
											<div
												className="baner-big-text white center"
												data-ix="fade-left"
												style={{
													opacity: 0,
													transform: 'translateX(60px) translateY(0px) translateZ(0px)'
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
													opacity: 0,
													transform: 'translateX(0px) translateY(60px) translateZ(0px)'
												}}
											>
												Branding Design&nbsp; +&nbsp;&nbsp; Mobile Website &nbsp;+&nbsp; eNewsletter
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
}
