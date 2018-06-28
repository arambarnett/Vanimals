import React from 'react';
import BasePage from '../../lib/BasePage';
import Footer from '../../components/footer';
import Header from '../../components/header';

export default class VanimalPage extends BasePage {
	render() {
		return (
			<div
				className="page-fade-in"
				data-ix="page-fade-in"
				style={{ opacity: 1, transition: 'opacity 200ms' }}
			>
				<Header />
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
									Vanimal #3
								</p>
								<div
									className="section-tittle dark"
									data-ix="fade-up-2"
									style={{
										opacity: 1,
										transform: 'translateX(0px) translateY(0px) translateZ(0px)',
										transition: 'opacity 500ms, transform 800ms'
									}}
								>
									The Sumatran Elephant
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
												<div className="paragraph">500</div>
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
												<div className="paragraph">Critically Endangered</div>
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
												<div className="paragraph">1 in ten thousand</div>
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
										The Sumatran Elephant
									</h1>
									<p
										data-ix="fade-up-2"
										style={{
											opacity: 1,
											transform: 'translateX(0px) translateY(0px) translateZ(0px)',
											transition: 'opacity 500ms, transform 800ms'
										}}
									>
										The Sumatran Elephant is a rare subspecies of elephant that lives in the
										Indonesian Island, Sumatra. The elephant has lost much of its original habitat
										because of massive human-hunting
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
										The Sumatran Elephant inhabits the south east asian country of <br />
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
										Out of a total population of 5 million Vanimals, Elephants make up 1%<br />Out
										of the 500 elephants discovered, 12% of them have Magenta <br />Out of 60
										Elephants with Magneta, 3 are 75% Magneta
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
													transform: 'translateX(0px) translateY(0px) translateZ(0px)'
												}}
											/>
											<div className="button-text">Make an Offer</div>
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="section white">
					<div className="container">
						<div className="bottom-padding-80">
							<div className="algin-center">
								<h2 className="section-tittle-hero">Available Vanimals</h2>
								<div className="subtittle">Explore the collection of Vanimals</div>
								<div className="headline-sign">
									<div className="line-features gray" />
									<div className="color-line" />
								</div>
							</div>
						</div>
						<div
							className="portfolio-row w-row"
							data-ix="fade-up-2"
							style={{
								opacity: 1,
								transform: 'translateX(0px) translateY(0px) translateZ(0px)',
								transition: 'opacity 500ms, transform 800ms'
							}}
						>
							<div className="column-iteam w-clearfix w-col w-col-4 w-col-stack">
								<a
									href="../vanimals-site/single-portfolio.html"
									className="project-wrapper style2 w-inline-block w--current"
									data-ix="project-wrapper"
									style={{ transition: 'all 0.3s ease 0s' }}
								>
									<div className="project-image">
										<img
											src="/static/images/oleg-stebenyev-r4-gorilla-f.jpg"
											width={200}
											height={260}
											srcSet="/static/images/oleg-stebenyev-r4-gorilla-f-p-500.jpeg 500w, /static/images/oleg-stebenyev-r4-gorilla-f-p-800.jpeg 800w, /static/images/oleg-stebenyev-r4-gorilla-f-p-1080.jpeg 1080w, /static/images/oleg-stebenyev-r4-gorilla-f-p-1600.jpeg 1600w, /static/images/oleg-stebenyev-r4-gorilla-f.jpg 1827w"
											sizes="(max-width: 767px) 92vw, (max-width: 991px) 94vw, 31vw"
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
											>
												<p className="paragraph-project">Critically Endangered</p>
												<h4 className="project-header">Cross River Gorilla</h4>
											</div>
										</div>
									</div>
								</a>
							</div>
							<div className="column-iteam w-clearfix w-col w-col-4 w-col-stack">
								<a
									href="../vanimals-site/single-portfolio.html"
									className="project-wrapper style2 w-inline-block w--current"
									data-ix="project-wrapper"
									style={{ transition: 'all 0.3s ease 0s' }}
								>
									<div className="project-image">
										<img
											src="/static/images/jona-dinges-tiger.jpg"
											width={200}
											height={260}
											srcSet="/static/images/jona-dinges-tiger-p-500.jpeg 500w, /static/images/jona-dinges-tiger.jpg 800w"
											sizes="(max-width: 767px) 92vw, (max-width: 991px) 94vw, 31vw"
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
											>
												<p className="paragraph-project">Critically Endangered</p>
												<h4 className="project-header">
													Sumatran Tiger<br />
												</h4>
											</div>
										</div>
									</div>
								</a>
							</div>
							<div className="column-iteam w-clearfix w-col w-col-4 w-col-stack">
								<a
									href="../vanimals-site/single-portfolio.html"
									className="project-wrapper style2 w-inline-block w--current"
									data-ix="project-wrapper"
									style={{ transition: 'all 0.3s ease 0s' }}
								>
									<div className="project-image">
										<img
											src="/static/images/image.png"
											width={200}
											height={260}
											srcSet="/static/images/image-p-500.png 500w, /static/images/image-p-800.png 800w, /static/images/image.png 1080w"
											sizes="(max-width: 767px) 92vw, (max-width: 991px) 94vw, 31vw"
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
											>
												<p className="paragraph-project">Ubiquitous</p>
												<h4 className="project-header">Pigeon</h4>
											</div>
										</div>
									</div>
								</a>
							</div>
						</div>
						<div
							className="top-padding"
							data-ix="fade-up-3"
							style={{
								opacity: 1,
								transform: 'translateX(0px) translateY(0px) translateZ(0px)',
								transition: 'opacity 500ms, transform 800ms'
							}}
						>
							<a
								href="../vanimals-site/portfolio-3.html"
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
								<div className="button-text">View All VANimals</div>
							</a>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);
	}
}
