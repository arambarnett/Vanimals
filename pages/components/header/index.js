import React from 'react';
import BaseComponent from '../../lib/BaseComponent';

export default class HeaderComponent extends BaseComponent {
	render() {
		return (
			<div style={{ height: '80px'}}>
			<div
				data-collapse="medium"
				data-animation="default"
				data-duration={400}
				className="sticky-navbar w-nav"
			>
				<div className="container w-container">
					<a href="static/index.html" className="brand-link-second w-nav-brand">
						<img
							src="static/images/Vanimals-logo-main.png"
							width={120}
							srcSet="static/images/Vanimals-logo-main-p-500.png 500w, static/images/Vanimals-logo-main.png 543w"
							sizes="120px"
							className="eight"
						/>
					</a>
					<nav role="navigation" className="nav-menu vertical w-nav-menu">
						<a
							href="/"
							className="dropdown vertical w-nav-link w--current"
							style={{ maxWidth: 1170 }}
						>
							HOME
						</a>
						<a
							href="/about"
							className="dropdown vertical w-nav-link"
							style={{ maxWidth: 1170 }}
						>
							About
						</a>
						<a
							href="/marketplace"
							className="dropdown vertical w-nav-link"
							style={{ maxWidth: 1170 }}
						>
							market
						</a>
						<a
							href="/store"
							className="dropdown vertical w-nav-link"
							style={{ maxWidth: 1170 }}
						>
							Store
						</a>
						<a
							href="/my-account"
							className="dropdown vertical w-nav-link"
							style={{ maxWidth: 1170 }}
						>
							account
						</a>
						<a
							href="/faq"
							className="dropdown vertical w-nav-link"
							style={{ maxWidth: 1170 }}
						>
							faq
						</a>
						<a
							href="/settings"
							className="dropdown vertical w-nav-link"
							style={{ maxWidth: 1170 }}
						>
							settings
						</a>
						<a
							href="/coming-soon"
							className="dropdown vertical w-nav-link"
							style={{ maxWidth: 1170 }}
						>
							coming soon
						</a>
					</nav>
					<div className="menu-b w-nav-button">
						<div className="second-icon w-icon-nav-menu" />
					</div>
				</div>
				<div className="w-nav-overlay" data-wf-ignore />
			</div>
			</div>
		);
	}
}
