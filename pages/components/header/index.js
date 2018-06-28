import React from 'react';
import BaseComponent from '../../lib/BaseComponent';

export default class HeaderComponent extends BaseComponent {
	render() {
		return (
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
						src="/static/images/Vanimals-logo-main.png"
						width={140}
						srcSet="/static/images/Vanimals-logo-main-p-500.png 500w, /static/images/Vanimals-logo-main.png 543w"
						sizes="(max-width: 479px) 54vw, 140px"
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
							<a
								href="../vanimals-site/home-2.html"
								className="dropdown-link w-dropdown-link w--current"
							>
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
							<a href="../pages/table.html" className="dropdown-link w-dropdown-link">
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
							<a href="../about-us/about.html" className="dropdown-link w-dropdown-link">
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
							<a href="../vanimals-site/portfolio-3.html" className="dropdown-link w-dropdown-link">
								Portfolio 1
							</a>
							<a href="../vanimals-site/portfolio-2.html" className="dropdown-link w-dropdown-link">
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
		);
	}
}
