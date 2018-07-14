import React from 'react';
import BasePage from '../../lib/BasePage';
import Footer from '../../components/footer';

export default class VanimalPage extends BasePage {
	render() {
		return (
			<div>
				<div className="section-3 color-purple clients coming">
					<div
						data-collapse="all"
						data-animation="over-right"
						data-duration={500}
						data-easing="ease-in-out"
						data-easing2="ease-out"
						data-doc-height={1}
						className="navigation-2 left-ham-color w-nav"
					>
						<a href="#" className="brand w-nav-brand">
							<img
								src="static/images/42134.png"
								width={140}
								srcSet="static/images/42134-p-500.png 500w, static/images/42134.png 659w"
								sizes="(max-width: 479px) 54vw, 140px"
								className="logo-image"
							/>
						</a>
						<div className="menu-button background color w-nav-button" data-ix="menu-button-hover">
							<div className="line-6 white" />
							<div className="line-4 white" />
							<div className="line-5 white" />
						</div>
						<div className="container w-container">
							<nav role="navigation" className="nav-menu-style-1 second-style w-nav-menu">
								<a href="#" className="nav-link-second-2 w-nav-link" style={{ maxWidth: 1170 }}>
									Intro
								</a>
								<div data-delay={0} className="w-dropdown" style={{ maxWidth: 1170 }}>
									<div className="nav-link w-dropdown-toggle">
										<div className="icon-9 w-icon-dropdown-toggle" />
										<div className="text-in-block">Home</div>
									</div>
									<nav className="dropdown-list-2 w-dropdown-list">
										<a href="#" className="dropdown-link w-dropdown-link">
											Homepage 1
										</a>
										<a href="#" className="dropdown-link w-dropdown-link">
											Homepage 2
										</a>
										<a href="#" className="dropdown-link w-dropdown-link">
											Homepage 3
										</a>
										<a href="#" className="dropdown-link w-dropdown-link">
											Homepage 4
										</a>
										<a href="#" className="dropdown-link w-dropdown-link">
											Homepage 5
										</a>
										<a href="#" className="dropdown-link w-dropdown-link">
											Homepage 6
										</a>
									</nav>
								</div>
								<div data-delay={0} className="w-dropdown" style={{ maxWidth: 1170 }}>
									<div className="nav-link w-dropdown-toggle">
										<div className="icon-9 w-icon-dropdown-toggle" />
										<div className="text-in-block">Pages</div>
									</div>
									<nav className="dropdown-list-2 w-dropdown-list">
										<a href="#" className="dropdown-link w-dropdown-link">
											Pricing
										</a>
										<a href="#" className="dropdown-link w-dropdown-link">
											F.A.Q. Page
										</a>
										<a href="../401.html" className="dropdown-link w-dropdown-link">
											Password Page
										</a>
										<a href="../404.html" className="dropdown-link w-dropdown-link">
											404 Page
										</a>
										<a href="#" className="dropdown-link w-dropdown-link">
											Coming Soon
										</a>
										<a href="#" className="dropdown-link w-dropdown-link">
											Style Guide
										</a>
										<a href="#" className="dropdown-link w-dropdown-link">
											Licensing
										</a>
									</nav>
								</div>
								<div data-delay={0} className="w-dropdown" style={{ maxWidth: 1170 }}>
									<div className="nav-link w-dropdown-toggle">
										<div className="icon-9 w-icon-dropdown-toggle" />
										<div className="text-in-block">About</div>
									</div>
									<nav className="dropdown-list-2 w-dropdown-list">
										<a href="#" className="dropdown-link w-dropdown-link">
											About Us 1
										</a>
										<a href="#" className="dropdown-link w-dropdown-link">
											About Us 2
										</a>
										<a href="#" className="dropdown-link w-dropdown-link">
											About Us 3
										</a>
										<a href="#" className="dropdown-link w-dropdown-link">
											About Us 4
										</a>
									</nav>
								</div>
								<div data-delay={0} className="w-dropdown" style={{ maxWidth: 1170 }}>
									<div className="nav-link w-dropdown-toggle">
										<div className="icon-9 w-icon-dropdown-toggle" />
										<div className="text-in-block">Portfolio</div>
									</div>
									<nav className="dropdown-list-2 w-dropdown-list">
										<a href="#" className="dropdown-link w-dropdown-link">
											Portfolio 1
										</a>
										<a href="#" className="dropdown-link w-dropdown-link">
											Portfolio 2
										</a>
										<a href="#" className="dropdown-link w-dropdown-link">
											Portfolio 3
										</a>
										<a href="#" className="dropdown-link w-dropdown-link">
											Portfolio Single
										</a>
									</nav>
								</div>
								<div data-delay={0} className="w-dropdown" style={{ maxWidth: 1170 }}>
									<div className="nav-link w-dropdown-toggle">
										<div className="icon-9 w-icon-dropdown-toggle" />
										<div className="text-in-block">Services</div>
									</div>
									<nav className="dropdown-list-2 w-dropdown-list">
										<a href="#" className="dropdown-link w-dropdown-link">
											Service 1
										</a>
										<a href="#" className="dropdown-link w-dropdown-link">
											Service 2
										</a>
										<a href="#" className="dropdown-link w-dropdown-link">
											Service 3
										</a>
									</nav>
								</div>
								<div data-delay={0} className="w-dropdown" style={{ maxWidth: 1170 }}>
									<div className="nav-link w-dropdown-toggle">
										<div className="icon-9 w-icon-dropdown-toggle" />
										<div className="text-in-block">Blog</div>
									</div>
									<nav className="dropdown-list-2 w-dropdown-list">
										<a href="#" className="dropdown-link w-dropdown-link">
											Blog Page 1
										</a>
										<a href="#" className="dropdown-link w-dropdown-link">
											Blog Page 2
										</a>
										<a href="#" className="dropdown-link w-dropdown-link">
											Blog Page 3
										</a>
									</nav>
								</div>
								<div data-delay={0} className="w-dropdown" style={{ maxWidth: 1170 }}>
									<div className="nav-link w-dropdown-toggle">
										<div className="icon-9 w-icon-dropdown-toggle" />
										<div className="text-in-block">Contact</div>
									</div>
									<nav className="dropdown-list-2 w-dropdown-list">
										<a href="#" className="dropdown-link w-dropdown-link">
											Contact Us 1
										</a>
										<a href="#" className="dropdown-link w-dropdown-link">
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
					<div className="w-container">
						<div className="div-block-7">
							<h1 className="heading-6">12:34:56</h1>
						</div>
						<div className="pop-up-wrapper portfolio coming">
							<div className="image-top" />
							<div className="form-wrapper w-form">
								<form id="email-form-3" name="email-form-3" data-name="Email Form 3">
									<div className="algin-center contact">
										<h2 className="section-tittle-hero">Coming Soon</h2>
										<div className="headline-sign">
											<div className="line-features gray" />
											<div className="color-line-2" />
										</div>
									</div>
									<input
										type="text"
										className="gray-text-field center w-input"
										maxLength={256}
										name="email-4"
										data-name="Email 4"
										placeholder="Enter your email"
										id="email-4"
										required
									/>
									<input
										type="submit"
										defaultValue="Notify Me"
										data-wait="Please wait..."
										className="link-color-button-2 contact w-button"
									/>
								</form>
								<div className="w-form-done">
									<div>Thank you! Your submission has been received!</div>
								</div>
								<div className="w-form-fail">
									<div>Oops! Something went wrong while submitting the form.</div>
								</div>
							</div>
						</div>
						<div className="social-wrapper coming">
							<a href="#" className="social-icon white w-inline-block" />
							<a href="#" className="social-icon instagram w-inline-block" />
							<a href="#" className="social-icon twitter white w-inline-block" />
							<a href="#" className="social-icon google white w-inline-block" />
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);
	}
}
