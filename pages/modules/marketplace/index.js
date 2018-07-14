import React from 'react';
import BasePage from '../../lib/BasePage';
import Footer from '../../components/footer';

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
						<div className="container w-container">
							<nav role="navigation" className="nav-menu-style-1 second-style w-nav-menu">
								<a
									href="../index.html"
									className="nav-link-second w-nav-link"
									style={{ maxWidth: 1170 }}
								>
									Intro
								</a>
								<div data-delay={0} className="w-dropdown" style={{ maxWidth: 1170 }}>
									<div className="nav-link w-dropdown-toggle">
										<div className="icon w-icon-dropdown-toggle" />
										<div className="text-in-block">Home</div>
									</div>
									<nav className="dropdown-list w-dropdown-list">
										<a href="../homepages/old-home.html" className="dropdown-link w-dropdown-link">
											Homepage 1
										</a>
										<a
											href="../vanimals-site/home-2.html"
											className="dropdown-link w-dropdown-link"
										>
											Homepage 2
										</a>
										<a
											href="../homepages/homepages-4.html"
											className="dropdown-link w-dropdown-link"
										>
											Homepage 3
										</a>
										<a
											href="../homepages/homepage-6.html"
											className="dropdown-link w-dropdown-link"
										>
											Homepage 4
										</a>
										<a href="../homepages/home-5.html" className="dropdown-link w-dropdown-link">
											Homepage 5
										</a>
										<a href="../homepages/home-4.html" className="dropdown-link w-dropdown-link">
											Homepage 6
										</a>
									</nav>
								</div>
								<div data-delay={0} className="w-dropdown" style={{ maxWidth: 1170 }}>
									<div className="nav-link w-dropdown-toggle">
										<div className="icon w-icon-dropdown-toggle" />
										<div className="text-in-block">Pages</div>
									</div>
									<nav className="dropdown-list w-dropdown-list">
										<a href="../vanimals-site/table.html" className="dropdown-link w-dropdown-link">
											Pricing
										</a>
										<a href="../pages/f-a-q.html" className="dropdown-link w-dropdown-link">
											F.A.Q. Page
										</a>
										<a href="../401.html" className="dropdown-link w-dropdown-link">
											Password Page
										</a>
										<a href="../404.html" className="dropdown-link w-dropdown-link">
											404 Page
										</a>
										<a
											href="../vanimals-site/coming-soon.html"
											className="dropdown-link w-dropdown-link"
										>
											Coming Soon
										</a>
										<a href="../pages/blog.html" className="dropdown-link w-dropdown-link">
											Style Guide
										</a>
										<a
											href="../vanimals-site/licensing.html"
											className="dropdown-link w-dropdown-link"
										>
											Licensing
										</a>
									</nav>
								</div>
								<div data-delay={0} className="w-dropdown" style={{ maxWidth: 1170 }}>
									<div className="nav-link w-dropdown-toggle">
										<div className="icon w-icon-dropdown-toggle" />
										<div className="text-in-block">About</div>
									</div>
									<nav className="dropdown-list w-dropdown-list">
										<a
											href="../vanimals-site/about-4.html"
											className="dropdown-link w-dropdown-link"
										>
											About Us 1
										</a>
										<a href="../about-us/about-2.html" className="dropdown-link w-dropdown-link">
											About Us 2
										</a>
										<a href="../about-us/about-3.html" className="dropdown-link w-dropdown-link">
											About Us 3
										</a>
										<a href="../about-us/about-4.html" className="dropdown-link w-dropdown-link">
											About Us 4
										</a>
									</nav>
								</div>
								<div data-delay={0} className="w-dropdown" style={{ maxWidth: 1170 }}>
									<div className="nav-link w-dropdown-toggle">
										<div className="icon w-icon-dropdown-toggle" />
										<div className="text-in-block">Portfolio</div>
									</div>
									<nav className="dropdown-list w-dropdown-list">
										<a
											href="../vanimals-site/portfolio-3.html"
											className="dropdown-link w-dropdown-link w--current"
										>
											Portfolio 1
										</a>
										<a
											href="../vanimals-site/portfolio-2.html"
											className="dropdown-link w-dropdown-link"
										>
											Portfolio 2
										</a>
										<a
											href="../portfolio/portfolio-3.html"
											className="dropdown-link w-dropdown-link"
										>
											Portfolio 3
										</a>
										<a
											href="../vanimals-site/single-portfolio.html"
											className="dropdown-link w-dropdown-link"
										>
											Portfolio Single
										</a>
									</nav>
								</div>
								<div data-delay={0} className="w-dropdown" style={{ maxWidth: 1170 }}>
									<div className="nav-link w-dropdown-toggle">
										<div className="icon w-icon-dropdown-toggle" />
										<div className="text-in-block">Services</div>
									</div>
									<nav className="dropdown-list w-dropdown-list">
										<a href="../service/service.html" className="dropdown-link w-dropdown-link">
											Service 1
										</a>
										<a href="../service/service-2.html" className="dropdown-link w-dropdown-link">
											Service 2
										</a>
										<a href="../service/service-3.html" className="dropdown-link w-dropdown-link">
											Service 3
										</a>
									</nav>
								</div>
								<div data-delay={0} className="w-dropdown" style={{ maxWidth: 1170 }}>
									<div className="nav-link w-dropdown-toggle">
										<div className="icon w-icon-dropdown-toggle" />
										<div className="text-in-block">Blog</div>
									</div>
									<nav className="dropdown-list w-dropdown-list">
										<a href="../blog/blog.html" className="dropdown-link w-dropdown-link">
											Blog Page 1
										</a>
										<a href="../blog/blog-2.html" className="dropdown-link w-dropdown-link">
											Blog Page 2
										</a>
										<a href="../blog/blog-3.html" className="dropdown-link w-dropdown-link">
											Blog Page 3
										</a>
									</nav>
								</div>
								<div data-delay={0} className="w-dropdown" style={{ maxWidth: 1170 }}>
									<div className="nav-link w-dropdown-toggle">
										<div className="icon w-icon-dropdown-toggle" />
										<div className="text-in-block">Contact</div>
									</div>
									<nav className="dropdown-list w-dropdown-list">
										<a href="../contact/contact-1.html" className="dropdown-link w-dropdown-link">
											Contact Us 1
										</a>
										<a href="../contact/contact.html" className="dropdown-link w-dropdown-link">
											Contact Us 2
										</a>
									</nav>
								</div>
								<div className="social-wrapper nav">
									<a href="#" className="social-icon w-inline-block" />
									<a href="#" className="social-icon insta w-inline-block" />
									<a href="#" className="social-icon twitter w-inline-block" />
									<a href="#" className="social-icon gmail w-inline-block" />
								</div>
							</nav>
						</div>
						<div className="w-nav-overlay" data-wf-ignore />
					</div>
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
										<div className="portfolio-row style2 marketplace-page w-row">
											<div className="column-iteam style-2 w-clearfix w-col w-col-3">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
												>
													<div
														className="project-image"
														data-ix="fade-up-2"
														style={{
															transition: 'all 0.4s ease 0s, opacity 500ms, transform 800ms',
															opacity: 1,
															transform: 'translateX(0px) translateY(0px) translateZ(0px)'
														}}
													>
														<img
															src="static/images/keila-hotzel-395555.jpg"
															srcSet="static/images/keila-hotzel-395555-p-1080.jpeg 1080w, static/images/keila-hotzel-395555-p-1600.jpeg 1600w, static/images/keila-hotzel-395555-p-2000.jpeg 2000w, static/images/keila-hotzel-395555-p-2600.jpeg 2600w, static/images/keila-hotzel-395555-p-3200.jpeg 3200w, static/images/keila-hotzel-395555.jpg 4200w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 22vw"
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
											<div className="column-iteam style-2 w-clearfix w-col w-col-3">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
													data-ix="fade-up-2"
													style={{
														transition: 'all 0.3s ease 0s, opacity 500ms, transform 800ms',
														opacity: 1,
														transform: 'translateX(0px) translateY(0px) translateZ(0px)'
													}}
												>
													<div className="project-image">
														<img
															src="static/images/scott-webb-347201.jpg"
															srcSet="static/images/scott-webb-347201-p-500.jpeg 500w, static/images/scott-webb-347201-p-1080.jpeg 1080w, static/images/scott-webb-347201-p-1600.jpeg 1600w, static/images/scott-webb-347201-p-2000.jpeg 2000w, static/images/scott-webb-347201-p-2600.jpeg 2600w, static/images/scott-webb-347201-p-3200.jpeg 3200w, static/images/scott-webb-347201.jpg 6000w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 22vw"
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
											<div className="column-iteam style-2 w-clearfix w-col w-col-3">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
													data-ix="fade-up-3"
													style={{
														transition: 'all 0.3s ease 0s, opacity 500ms, transform 800ms',
														opacity: 1,
														transform: 'translateX(0px) translateY(0px) translateZ(0px)'
													}}
												>
													<div className="project-image">
														<img
															src="static/images/ash-edmonds-488225.jpg"
															srcSet="static/images/ash-edmonds-488225-p-800.jpeg 800w, static/images/ash-edmonds-488225-p-1080.jpeg 1080w, static/images/ash-edmonds-488225-p-1600.jpeg 1600w, static/images/ash-edmonds-488225-p-2000.jpeg 2000w, static/images/ash-edmonds-488225-p-2600.jpeg 2600w, static/images/ash-edmonds-488225-p-3200.jpeg 3200w, static/images/ash-edmonds-488225.jpg 4570w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 22vw"
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
														<p className="paragraph-project dark _3">Design Idea</p>
														<h4 className="project-header white-content">Design Domo</h4>
													</div>
												</a>
											</div>
											<div className="w-clearfix w-col w-col-3">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
													data-ix="fade-up-6"
													style={{
														transition: 'all 0.3s ease 0s, opacity 500ms, transform 800ms',
														opacity: 1,
														transform: 'translateX(0px) translateY(0px) translateZ(0px)'
													}}
												>
													<div className="project-image">
														<img
															src="static/images/temple-cerulean-421274.jpg"
															srcSet="static/images/temple-cerulean-421274-p-1080.jpeg 1080w, static/images/temple-cerulean-421274-p-1600.jpeg 1600w, static/images/temple-cerulean-421274-p-2000.jpeg 2000w, static/images/temple-cerulean-421274-p-2600.jpeg 2600w, static/images/temple-cerulean-421274-p-3200.jpeg 3200w, static/images/temple-cerulean-421274.jpg 6000w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 22vw"
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
										<div className="portfolio-row style2 marketplace-page w-row">
											<div className="column-iteam style-2 w-clearfix w-col w-col-3">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
													data-ix="fade-up-4"
													style={{
														transition: 'all 0.3s ease 0s, opacity 500ms, transform 800ms',
														opacity: 1,
														transform: 'translateX(0px) translateY(0px) translateZ(0px)'
													}}
												>
													<div className="project-image">
														<img
															src="static/images/alvaro-bernal-21561.jpg"
															srcSet="static/images/alvaro-bernal-21561-p-1080.jpeg 1080w, static/images/alvaro-bernal-21561-p-1600.jpeg 1600w, static/images/alvaro-bernal-21561-p-2000.jpeg 2000w, static/images/alvaro-bernal-21561-p-2600.jpeg 2600w, static/images/alvaro-bernal-21561-p-3200.jpeg 3200w, static/images/alvaro-bernal-21561.jpg 4272w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 22vw"
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
														<p className="paragraph-project dark _3">Design Idea</p>
														<h4 className="project-header white-content">Design Domo</h4>
													</div>
												</a>
											</div>
											<div className="column-iteam style-2 w-clearfix w-col w-col-3">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
													data-ix="fade-up-5"
													style={{
														transition: 'all 0.3s ease 0s, opacity 500ms, transform 800ms',
														opacity: 1,
														transform: 'translateX(0px) translateY(0px) translateZ(0px)'
													}}
												>
													<div className="project-image">
														<img
															src="static/images/malte-wingen-381987.jpg"
															srcSet="static/images/malte-wingen-381987-p-1080.jpeg 1080w, static/images/malte-wingen-381987-p-1600.jpeg 1600w, static/images/malte-wingen-381987-p-2000.jpeg 2000w, static/images/malte-wingen-381987-p-2600.jpeg 2600w, static/images/malte-wingen-381987-p-3200.jpeg 3200w, static/images/malte-wingen-381987.jpg 5760w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 22vw"
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
											<div className="column-iteam style-2 w-clearfix w-col w-col-3">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
													data-ix="fade-up-6"
													style={{
														transition: 'all 0.3s ease 0s, opacity 500ms, transform 800ms',
														opacity: 1,
														transform: 'translateX(0px) translateY(0px) translateZ(0px)'
													}}
												>
													<div className="project-image">
														<img
															src="static/images/temple-cerulean-421274.jpg"
															srcSet="static/images/temple-cerulean-421274-p-1080.jpeg 1080w, static/images/temple-cerulean-421274-p-1600.jpeg 1600w, static/images/temple-cerulean-421274-p-2000.jpeg 2000w, static/images/temple-cerulean-421274-p-2600.jpeg 2600w, static/images/temple-cerulean-421274-p-3200.jpeg 3200w, static/images/temple-cerulean-421274.jpg 6000w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 22vw"
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
											<div className="w-clearfix w-col w-col-3">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
													data-ix="fade-up-6"
													style={{
														transition: 'all 0.3s ease 0s, opacity 500ms, transform 800ms',
														opacity: 1,
														transform: 'translateX(0px) translateY(0px) translateZ(0px)'
													}}
												>
													<div className="project-image">
														<img
															src="static/images/temple-cerulean-421274.jpg"
															srcSet="static/images/temple-cerulean-421274-p-1080.jpeg 1080w, static/images/temple-cerulean-421274-p-1600.jpeg 1600w, static/images/temple-cerulean-421274-p-2000.jpeg 2000w, static/images/temple-cerulean-421274-p-2600.jpeg 2600w, static/images/temple-cerulean-421274-p-3200.jpeg 3200w, static/images/temple-cerulean-421274.jpg 6000w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 22vw"
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
										<div className="portfolio-row style2 marketplace-page w-row">
											<div className="column-iteam style-2 w-clearfix w-col w-col-3">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
													data-ix="fade-up-4"
													style={{
														transition: 'all 0.3s ease 0s, opacity 500ms, transform 800ms',
														opacity: 1,
														transform: 'translateX(0px) translateY(0px) translateZ(0px)'
													}}
												>
													<div className="project-image">
														<img
															src="static/images/alvaro-bernal-21561.jpg"
															srcSet="static/images/alvaro-bernal-21561-p-1080.jpeg 1080w, static/images/alvaro-bernal-21561-p-1600.jpeg 1600w, static/images/alvaro-bernal-21561-p-2000.jpeg 2000w, static/images/alvaro-bernal-21561-p-2600.jpeg 2600w, static/images/alvaro-bernal-21561-p-3200.jpeg 3200w, static/images/alvaro-bernal-21561.jpg 4272w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 22vw"
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
														<p className="paragraph-project dark _3">Design Idea</p>
														<h4 className="project-header white-content">Design Domo</h4>
													</div>
												</a>
											</div>
											<div className="column-iteam style-2 w-clearfix w-col w-col-3">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
													data-ix="fade-up-5"
													style={{
														transition: 'all 0.3s ease 0s, opacity 500ms, transform 800ms',
														opacity: 1,
														transform: 'translateX(0px) translateY(0px) translateZ(0px)'
													}}
												>
													<div className="project-image">
														<img
															src="static/images/malte-wingen-381987.jpg"
															srcSet="static/images/malte-wingen-381987-p-1080.jpeg 1080w, static/images/malte-wingen-381987-p-1600.jpeg 1600w, static/images/malte-wingen-381987-p-2000.jpeg 2000w, static/images/malte-wingen-381987-p-2600.jpeg 2600w, static/images/malte-wingen-381987-p-3200.jpeg 3200w, static/images/malte-wingen-381987.jpg 5760w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 22vw"
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
											<div className="column-iteam style-2 w-clearfix w-col w-col-3">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
													data-ix="fade-up-6"
													style={{
														transition: 'all 0.3s ease 0s, opacity 500ms, transform 800ms',
														opacity: 1,
														transform: 'translateX(0px) translateY(0px) translateZ(0px)'
													}}
												>
													<div className="project-image">
														<img
															src="static/images/temple-cerulean-421274.jpg"
															srcSet="static/images/temple-cerulean-421274-p-1080.jpeg 1080w, static/images/temple-cerulean-421274-p-1600.jpeg 1600w, static/images/temple-cerulean-421274-p-2000.jpeg 2000w, static/images/temple-cerulean-421274-p-2600.jpeg 2600w, static/images/temple-cerulean-421274-p-3200.jpeg 3200w, static/images/temple-cerulean-421274.jpg 6000w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 22vw"
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
											<div className="w-clearfix w-col w-col-3">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
													data-ix="fade-up-6"
													style={{
														transition: 'all 0.3s ease 0s, opacity 500ms, transform 800ms',
														opacity: 1,
														transform: 'translateX(0px) translateY(0px) translateZ(0px)'
													}}
												>
													<div className="project-image">
														<img
															src="static/images/temple-cerulean-421274.jpg"
															srcSet="static/images/temple-cerulean-421274-p-1080.jpeg 1080w, static/images/temple-cerulean-421274-p-1600.jpeg 1600w, static/images/temple-cerulean-421274-p-2000.jpeg 2000w, static/images/temple-cerulean-421274-p-2600.jpeg 2600w, static/images/temple-cerulean-421274-p-3200.jpeg 3200w, static/images/temple-cerulean-421274.jpg 6000w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 22vw"
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
										<div className="portfolio-row style2 marketplace-page w-row">
											<div className="column-iteam style-2 w-clearfix w-col w-col-3">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
													data-ix="fade-up-4"
													style={{
														transition: 'all 0.3s ease 0s, opacity 500ms, transform 800ms',
														opacity: 1,
														transform: 'translateX(0px) translateY(0px) translateZ(0px)'
													}}
												>
													<div className="project-image">
														<img
															src="static/images/alvaro-bernal-21561.jpg"
															srcSet="static/images/alvaro-bernal-21561-p-1080.jpeg 1080w, static/images/alvaro-bernal-21561-p-1600.jpeg 1600w, static/images/alvaro-bernal-21561-p-2000.jpeg 2000w, static/images/alvaro-bernal-21561-p-2600.jpeg 2600w, static/images/alvaro-bernal-21561-p-3200.jpeg 3200w, static/images/alvaro-bernal-21561.jpg 4272w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 22vw"
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
														<p className="paragraph-project dark _3">Design Idea</p>
														<h4 className="project-header white-content">Design Domo</h4>
													</div>
												</a>
											</div>
											<div className="column-iteam style-2 w-clearfix w-col w-col-3">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
													data-ix="fade-up-5"
													style={{
														transition: 'all 0.3s ease 0s, opacity 500ms, transform 800ms',
														opacity: 1,
														transform: 'translateX(0px) translateY(0px) translateZ(0px)'
													}}
												>
													<div className="project-image">
														<img
															src="static/images/malte-wingen-381987.jpg"
															srcSet="static/images/malte-wingen-381987-p-1080.jpeg 1080w, static/images/malte-wingen-381987-p-1600.jpeg 1600w, static/images/malte-wingen-381987-p-2000.jpeg 2000w, static/images/malte-wingen-381987-p-2600.jpeg 2600w, static/images/malte-wingen-381987-p-3200.jpeg 3200w, static/images/malte-wingen-381987.jpg 5760w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 22vw"
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
											<div className="column-iteam style-2 w-clearfix w-col w-col-3">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
													data-ix="fade-up-6"
													style={{
														transition: 'all 0.3s ease 0s, opacity 500ms, transform 800ms',
														opacity: 1,
														transform: 'translateX(0px) translateY(0px) translateZ(0px)'
													}}
												>
													<div className="project-image">
														<img
															src="static/images/temple-cerulean-421274.jpg"
															srcSet="static/images/temple-cerulean-421274-p-1080.jpeg 1080w, static/images/temple-cerulean-421274-p-1600.jpeg 1600w, static/images/temple-cerulean-421274-p-2000.jpeg 2000w, static/images/temple-cerulean-421274-p-2600.jpeg 2600w, static/images/temple-cerulean-421274-p-3200.jpeg 3200w, static/images/temple-cerulean-421274.jpg 6000w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 22vw"
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
											<div className="w-clearfix w-col w-col-3">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
													data-ix="fade-up-6"
													style={{
														transition: 'all 0.3s ease 0s, opacity 500ms, transform 800ms',
														opacity: 1,
														transform: 'translateX(0px) translateY(0px) translateZ(0px)'
													}}
												>
													<div className="project-image">
														<img
															src="static/images/temple-cerulean-421274.jpg"
															srcSet="static/images/temple-cerulean-421274-p-1080.jpeg 1080w, static/images/temple-cerulean-421274-p-1600.jpeg 1600w, static/images/temple-cerulean-421274-p-2000.jpeg 2000w, static/images/temple-cerulean-421274-p-2600.jpeg 2600w, static/images/temple-cerulean-421274-p-3200.jpeg 3200w, static/images/temple-cerulean-421274.jpg 6000w"
															sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 22vw"
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
									<div data-w-tab="Tab 4" className="w-tab-pane">
										<div className="portfolio-row style2 w-row">
											<div className="column-iteam style-2 w-clearfix w-col w-col-4 w-col-medium-4">
												<a
													href="../vanimals-site/single-portfolio.html"
													className="project-wrapper style2 w-inline-block"
												>
													<div className="project-image">
														<img
															src="static/images/alvaro-bernal-21561.jpg"
															srcSet="static/images/alvaro-bernal-21561-p-1080.jpeg 1080w, static/images/alvaro-bernal-21561-p-1600.jpeg 1600w, static/images/alvaro-bernal-21561-p-2000.jpeg 2000w, static/images/alvaro-bernal-21561-p-2600.jpeg 2600w, static/images/alvaro-bernal-21561-p-3200.jpeg 3200w, static/images/alvaro-bernal-21561.jpg 4272w"
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
															src="static/images/malte-wingen-381987.jpg"
															srcSet="static/images/malte-wingen-381987-p-1080.jpeg 1080w, static/images/malte-wingen-381987-p-1600.jpeg 1600w, static/images/malte-wingen-381987-p-2000.jpeg 2000w, static/images/malte-wingen-381987-p-2600.jpeg 2600w, static/images/malte-wingen-381987-p-3200.jpeg 3200w, static/images/malte-wingen-381987.jpg 5760w"
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
															src="static/images/temple-cerulean-421274.jpg"
															srcSet="static/images/temple-cerulean-421274-p-1080.jpeg 1080w, static/images/temple-cerulean-421274-p-1600.jpeg 1600w, static/images/temple-cerulean-421274-p-2000.jpeg 2000w, static/images/temple-cerulean-421274-p-2600.jpeg 2600w, static/images/temple-cerulean-421274-p-3200.jpeg 3200w, static/images/temple-cerulean-421274.jpg 6000w"
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
															src="static/images/temple-cerulean-421274.jpg"
															srcSet="static/images/temple-cerulean-421274-p-1080.jpeg 1080w, static/images/temple-cerulean-421274-p-1600.jpeg 1600w, static/images/temple-cerulean-421274-p-2000.jpeg 2000w, static/images/temple-cerulean-421274-p-2600.jpeg 2600w, static/images/temple-cerulean-421274-p-3200.jpeg 3200w, static/images/temple-cerulean-421274.jpg 6000w"
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
															src="static/images/malte-wingen-381987.jpg"
															srcSet="static/images/malte-wingen-381987-p-1080.jpeg 1080w, static/images/malte-wingen-381987-p-1600.jpeg 1600w, static/images/malte-wingen-381987-p-2000.jpeg 2000w, static/images/malte-wingen-381987-p-2600.jpeg 2600w, static/images/malte-wingen-381987-p-3200.jpeg 3200w, static/images/malte-wingen-381987.jpg 5760w"
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
															src="static/images/scott-webb-347201.jpg"
															srcSet="static/images/scott-webb-347201-p-500.jpeg 500w, static/images/scott-webb-347201-p-1080.jpeg 1080w, static/images/scott-webb-347201-p-1600.jpeg 1600w, static/images/scott-webb-347201-p-2000.jpeg 2000w, static/images/scott-webb-347201-p-2600.jpeg 2600w, static/images/scott-webb-347201-p-3200.jpeg 3200w, static/images/scott-webb-347201.jpg 6000w"
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
}
