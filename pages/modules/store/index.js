import React from 'react';
import BasePage from '../../lib/BasePage';
import Footer from '../../components/footer';

export default class VanimalPage extends BasePage {
	render() {
		return (
			<div
				className="page-fade-in"
				data-ix="page-fade-in"
				style={{ opacity: 1, transition: 'opacity 200ms' }}
			>
				<div className="banner portfolio single">
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
											className="dropdown-link w-dropdown-link"
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
									Vanimal Pack
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
										Vanimal Pack
									</h1>
									<p
										data-ix="fade-up-2"
										style={{
											opacity: 1,
											transform: 'translateX(0px) translateY(0px) translateZ(0px)',
											transition: 'opacity 500ms, transform 800ms'
										}}
									>
										This Vanimal pack
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
										What's Included
									</h6>
									<p
										data-ix="fade-up-5"
										style={{
											opacity: 1,
											transform: 'translateX(0px) translateY(0px) translateZ(0px)',
											transition: 'opacity 500ms, transform 800ms'
										}}
									>
										Each Vanimal Pack comes with one Vanimal and one snap code<br />
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
										Charity
									</h6>
									<p
										data-ix="fade-up-7"
										style={{
											opacity: 1,
											transform: 'translateX(0px) translateY(0px) translateZ(0px)',
											transition: 'opacity 500ms, transform 800ms'
										}}
									>
										30% of each purchase is donated to the World Wildlife Fund and other agencies
										that are dedicated to the preservation{' '}
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
											<div
												className="button-overlay"
												data-ix="intitialoverlay-button"
												style={{
													width: '0%',
													transform: 'translateX(0px) translateY(0px) translateZ(0px)'
												}}
											/>
											<div className="button-text">Purchase THROUGH FACEBOOK</div>
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
											<div
												className="button-overlay"
												data-ix="intitialoverlay-button"
												style={{
													width: '0%',
													transform: 'translateX(0px) translateY(0px) translateZ(0px)'
												}}
											/>
											<div className="button-text">Purchase WITH ETHER</div>
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
								<div className="subtittle">
									Here are some of our favorite Vanimals available in our Marketplace
								</div>
								<div className="headline-sign">
									<div className="line-features gray" />
									<div className="color-line" />
								</div>
							</div>
						</div>
						<div
							className="portfolio-row w-row"
							data-ix="fade-up-2"
							style={{ opacity: 0, transform: 'translateX(0px) translateY(60px) translateZ(0px)' }}
						>
							<div className="column-iteam w-clearfix w-col w-col-4 w-col-stack">
								<a
									href="../vanimals-site/single-portfolio.html"
									className="project-wrapper style2 w-inline-block"
									data-ix="project-wrapper"
									style={{ transition: 'all 0.3s ease 0s' }}
								>
									<div className="project-image">
										<img
											src="static/images/oleg-stebenyev-r4-gorilla-f.jpg"
											width={200}
											height={260}
											srcSet="static/images/oleg-stebenyev-r4-gorilla-f-p-500.jpeg 500w, static/images/oleg-stebenyev-r4-gorilla-f-p-800.jpeg 800w, static/images/oleg-stebenyev-r4-gorilla-f-p-1080.jpeg 1080w, static/images/oleg-stebenyev-r4-gorilla-f-p-1600.jpeg 1600w, static/images/oleg-stebenyev-r4-gorilla-f.jpg 1827w"
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
									className="project-wrapper style2 w-inline-block"
									data-ix="project-wrapper"
									style={{ transition: 'all 0.3s ease 0s' }}
								>
									<div className="project-image">
										<img
											src="static/images/jona-dinges-tiger.jpg"
											width={200}
											height={260}
											srcSet="static/images/jona-dinges-tiger-p-500.jpeg 500w, static/images/jona-dinges-tiger.jpg 800w"
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
									className="project-wrapper style2 w-inline-block"
									data-ix="project-wrapper"
									style={{ transition: 'all 0.3s ease 0s' }}
								>
									<div className="project-image">
										<img
											src="static/images/image.png"
											width={200}
											height={260}
											srcSet="static/images/image-p-500.png 500w, static/images/image-p-800.png 800w, static/images/image.png 1080w"
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
							style={{ opacity: 0, transform: 'translateX(0px) translateY(60px) translateZ(0px)' }}
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
