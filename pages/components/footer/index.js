import React from 'react';
import BaseComponent from '../../lib/BaseComponent';

export default class FooterComponent extends BaseComponent {
	render() {
		return (
			<div className="section footer white">
				<div className="container w-container">
					<div className="w-row">
						<div className="column-about w-col w-col-6">
							<div>
								<h6 className="tittle-footer">ABOUT VANIMALS</h6>
								<p className="about-us-text">
									We are a group of technologist and animal rights activist who came together to
									create a product that is fun. Save the animals buy a vanimal<strong />
								</p>
							</div>
							<div className="social-wrapper">
								<a href="#" className="social-icon w-inline-block" />
								<a href="#" className="social-icon insta w-inline-block" />
								<a href="#" className="social-icon twitter w-inline-block" />
								<a href="#" className="social-icon gmail w-inline-block" />
							</div>
						</div>
						<div className="w-col w-col-6">
							<div className="div-useful-links">
								<h6 className="tittle-footer">useful links</h6>
								<div className="w-row">
									<div className="w-col w-col-6">
										<a href="/" className="footer-link top w--current">
											Home
										</a>
										<a href="/about" className="footer-link">
											About
										</a>
										<a href="/marketplace" className="footer-link">
											Marketplace
										</a>
										<a href="/store" className="footer-link">
											Store
										</a>
									</div>
									<div className="w-col w-col-6">
										<a
											href="/my-account"
											className="footer-link top"
										>
											My Account
										</a>
										<a href="/faq" className="footer-link">
											FAQ's
										</a>
										<a href="/settings" className="footer-link">
											Settings
										</a>
										<a href="/coming-soon" className="footer-link">
											Coming Soon
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="bottom-border">
						<div className="copyright-writter">
							<div className="w-row">
								<div className="column-footer-copyright w-col w-col-6">
									<p className="copyright dorian-hoxha">© 2018 Vanimals. All rights reserved.</p>
								</div>
								<div className="column-footer-copyright-2 w-col w-col-6" />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
