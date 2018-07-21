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
				<div
					data-collapse="all"
					data-animation="over-right"
					data-duration={500}
					data-easing="ease-in-out"
					data-easing2="ease-out"
					data-doc-height={1}
					className="navigation w-nav"
				>
					<div className="menu-button background w-nav-button" data-ix="menu-button-hover">
						<div className="line-1" />
						<div className="line-3" />
						<div className="line-2" />
					</div>
					<a href="../index.html" className="brand w-nav-brand">
						<img
							src="static/images/Vanimals-logo-main.png"
							width={140}
							srcSet="static/images/Vanimals-logo-main-p-500.png 500w, static/images/Vanimals-logo-main.png 543w"
							sizes="100vw"
							className="logo-image"
						/>
					</a>
					<nav role="navigation" className="nav-menu-style-1 second-style w-nav-menu">
						<a href="../index.html" className="nav-link-second w-nav-link">
							Intro
						</a>
						<div data-delay={0} className="w-dropdown">
							<div className="nav-link w-dropdown-toggle">
								<div className="icon w-icon-dropdown-toggle" />
								<div className="text-in-block">Home</div>
							</div>
							<nav className="dropdown-list w-dropdown-list">
								<a href="../homepages/old-home.html" className="dropdown-link w-dropdown-link">
									Homepage 1
								</a>
								<a href="../vanimals-site/home-2.html" className="dropdown-link w-dropdown-link">
									Homepage 2
								</a>
								<a href="../homepages/homepages-4.html" className="dropdown-link w-dropdown-link">
									Homepage 3
								</a>
								<a href="../homepages/homepage-6.html" className="dropdown-link w-dropdown-link">
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
						<div data-delay={0} className="w-dropdown">
							<div className="nav-link w-dropdown-toggle">
								<div className="icon w-icon-dropdown-toggle" />
								<div className="text-in-block">Market</div>
							</div>
							<nav className="dropdown-list w-dropdown-list">
								<a href="../vanimals-site/table.html" className="dropdown-link w-dropdown-link">
									Pricing
								</a>
								<a href="../pages/f-a-q.html" className="dropdown-link w-dropdown-link w--current">
									F.A.Q. Page
								</a>
								<a href="../401.html" className="dropdown-link w-dropdown-link">
									Password Page
								</a>
								<a href="../404.html" className="dropdown-link w-dropdown-link">
									404 Page
								</a>
								<a href="../homepages/home-4.html" className="dropdown-link w-dropdown-link">
									Coming Soon
								</a>
								<a href="../pages/blog.html" className="dropdown-link w-dropdown-link">
									Style Guide
								</a>
								<a href="../vanimals-site/licensing.html" className="dropdown-link w-dropdown-link">
									Licensing
								</a>
							</nav>
						</div>
						<div data-delay={0} className="w-dropdown">
							<div className="nav-link w-dropdown-toggle">
								<div className="icon w-icon-dropdown-toggle" />
								<div className="text-in-block">My Account</div>
							</div>
							<nav className="dropdown-list w-dropdown-list">
								<a href="../vanimals-site/about-4.html" className="dropdown-link w-dropdown-link">
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
						<div data-delay={0} className="w-dropdown">
							<div className="nav-link w-dropdown-toggle">
								<div className="icon w-icon-dropdown-toggle" />
								<div className="text-in-block">Vanimal Facts</div>
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
								<a href="../portfolio/portfolio-3.html" className="dropdown-link w-dropdown-link">
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
						<div data-delay={0} className="w-dropdown">
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
						<div data-delay={0} className="w-dropdown">
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
						<div data-delay={0} className="w-dropdown">
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
					<div className="w-nav-overlay" data-wf-ignore />
				</div>
				<div className="section">
					<div className="container w-container">
						<div className="bottom-padding-80">
							<div className="algin-center">
								<h2 className="section-tittle-hero">Frequently Asked Questions</h2>
								<div className="subtittle">General Questions</div>
								<div className="headline-sign">
									<div className="line-features gray" />
									<div className="color-line" />
								</div>
							</div>
						</div>
						<div className="top-padding toggle">
							<div className="toggle-wrapper" data-ix="show-toggle-content-on-click">
								<a href="#" className="toggle-header w-inline-block w-clearfix">
									<h2 className="toggle-tittle">HOw do I know my vanimal is 1/1</h2>
									<div className="toggle-icon" />
								</a>
								<div
									className="toggle-content"
									data-ix="toggle-content-initial"
									style={{ height: 0 }}
								>
									<div className="toggle-space">
										<p>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius
											enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros
											dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh
											et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique
											posuere.
										</p>
									</div>
								</div>
							</div>
							<div className="toggle-wrapper" data-ix="show-toggle-content-on-click">
								<a href="#" className="toggle-header w-inline-block w-clearfix">
									<h2 className="toggle-tittle">What is ETHEREUM?&nbsp;</h2>
									<div className="toggle-icon" />
								</a>
								<div
									className="toggle-content"
									data-ix="toggle-content-initial"
									style={{ height: 0 }}
								>
									<div className="toggle-space">
										<p>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius
											enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros
											dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh
											et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique
											posuere.
										</p>
									</div>
								</div>
							</div>
							<div className="toggle-wrapper" data-ix="show-toggle-content-on-click">
								<a href="#" className="toggle-header w-inline-block w-clearfix">
									<h2 className="toggle-tittle">WHAT DOES ROYALTY FREE MEAN?</h2>
									<div className="toggle-icon" />
								</a>
								<div
									className="toggle-content"
									data-ix="toggle-content-initial"
									style={{ height: 0 }}
								>
									<div className="toggle-space">
										<p>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius
											enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros
											dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh
											et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique
											posuere.
										</p>
									</div>
								</div>
							</div>
							<div className="toggle-wrapper" data-ix="show-toggle-content-on-click">
								<a href="#" className="toggle-header w-inline-block w-clearfix">
									<h2 className="toggle-tittle">REGULAR &amp; EXTENDED LICENSES</h2>
									<div className="toggle-icon" />
								</a>
								<div
									className="toggle-content"
									data-ix="toggle-content-initial"
									style={{ height: 0 }}
								>
									<div className="toggle-space">
										<p>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius
											enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros
											dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh
											et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique
											posuere.
										</p>
									</div>
								</div>
							</div>
							<div className="toggle-wrapper" data-ix="show-toggle-content-on-click">
								<a href="#" className="toggle-header w-inline-block w-clearfix">
									<h2 className="toggle-tittle">
										WHICH LICENSE DO I NEED TO USE AN ITEM IN A COMMERCIAL?
									</h2>
									<div className="toggle-icon" />
								</a>
								<div
									className="toggle-content"
									data-ix="toggle-content-initial"
									style={{ height: 0 }}
								>
									<div className="toggle-space">
										<p>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius
											enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros
											dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh
											et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique
											posuere.
										</p>
									</div>
								</div>
							</div>
							<div className="toggle-wrapper" data-ix="show-toggle-content-on-click">
								<a href="#" className="toggle-header w-inline-block w-clearfix">
									<h2 className="toggle-tittle">DO YOU HAVE A DEVELOPER LICENSE?</h2>
									<div className="toggle-icon" />
								</a>
								<div
									className="toggle-content"
									data-ix="toggle-content-initial"
									style={{ height: 0 }}
								>
									<div className="toggle-space">
										<p>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius
											enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros
											dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh
											et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique
											posuere.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="section subscribes blue">
					<div className="container">
						<div className="w-row">
							<div className="w-clearfix w-col w-col-5 w-col-stack">
								<div
									className="left"
									data-ix="fade-right"
									style={{
										opacity: 1,
										transform: 'translateX(0px) translateY(0px) translateZ(0px)',
										transition: 'opacity 500ms, transform 800ms'
									}}
								>
									<div className="sub-text neslwtter">Want to take change out of the question?</div>
									<div className="sub-text bottom">Visit the marketplace to buy!</div>
								</div>
							</div>
							<div className="w-col w-col-7 w-col-stack">
								<div
									data-ix="fade-left-2"
									style={{
										opacity: 1,
										transform: 'translateX(0px) translateY(0px) translateZ(0px)',
										transition: 'opacity 500ms, transform 800ms'
									}}
								>
									<div className="form-block style-1 w-form">
										<form
											id="email-form-2"
											name="email-form-2"
											data-name="Email Form 2"
											className="w-clearfix"
										>
											<input
												type="text"
												className="text-field-style-2 transparent w-input"
												maxLength={256}
												name="email-3"
												data-name="Email 3"
												placeholder="Enter your email here ...."
												id="email-3"
												required
											/>
											<input
												type="submit"
												defaultValue="Subscribe"
												data-wait="Please wait..."
												className="link-color-button suscribe-button newsletter lighter w-button"
											/>
										</form>
										<div className="sucess-mesage w-form-done">
											<div>Thank you! Your submission has been received!</div>
										</div>
										<div className="error-message w-form-fail">
											<div>Oops! Something went wrong while submitting the form.</div>
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
