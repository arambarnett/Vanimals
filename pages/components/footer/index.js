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
									create a product that is fun.
								</p>
							</div>
							<div className="social-wrapper">
								<a href="#" className="social-icon w-inline-block" />
								<a href="#" className="social-icon insta w-inline-block" />
								<a href="#" className="social-icon twitter w-inline-block" />
								<a href="#" className="social-icon gmail w-inline-block" />
							</div>
						</div>
						<div className="w-col w-col-3">
							<div className="div-useful-links">
								<h6 className="tittle-footer">Our Office</h6>
								<a href="#" className="footer-link">
									Boston
								</a>
								<a href="#" className="footer-link">
									San Francisco
								</a>
								<a href="#" className="footer-link">
									Chicago
								</a>
								<a href="#" className="footer-link">
									Houston
								</a>
								<a href="#" className="footer-link">
									New York
								</a>
							</div>
						</div>
						<div className="w-col w-col-3">
							<div className="useful-pages">
								<h6 className="tittle-footer">Useful Links</h6>
								<a href="../vanimals-site/coming-soon.html" className="footer-link">
									Coming Soon
								</a>
								<a href="../401.html" className="footer-link">
									Password Page
								</a>
								<a href="../404.html" className="footer-link">
									404 Page
								</a>
								<a href="../pages/blog.html" className="footer-link">
									Style Guide
								</a>
								<a href="../vanimals-site/licensing.html" className="footer-link">
									Licensing
								</a>
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
