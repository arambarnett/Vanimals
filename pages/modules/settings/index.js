import React from 'react';
import BasePage from '../../lib/BasePage';
import Footer from '../../components/footer';

export default class VanimalPage extends BasePage {
	render() {
		return (
			<div>
				<div className="container-2 w-container">
					<h1 className="heading-2">Settings</h1>
					<img
						src="static/images/Gear_icon-72a7cf.svg.png"
						srcSet="static/images/Gear_icon-72a7cf.svg-p-500.png 500w, static/images/Gear_icon-72a7cf.svg-p-800.png 800w, static/images/Gear_icon-72a7cf.svg-p-1080.png 1080w, static/images/Gear_icon-72a7cf.svg-p-1600.png 1600w, static/images/Gear_icon-72a7cf.svg.png 2000w"
						sizes="50px"
						className="image-4"
					/>
				</div>
				<div className="container-3 w-container">
					<h2 className="heading-3">Activity</h2>
					<p>
						Here's a list of your transactions. You can view recent details and keep track of what's
						happening!
					</p>
					<h3 className="heading-4">No activity yet</h3>
					<div className="button-wrapper">
						<a href="../vanimals-site/portfolio-3.html" className="settings-button w-button">
							Browse Vanimals
						</a>
						<a href="../pages/f-a-q.html" className="settings-button w-button">
							View FAQs
						</a>
					</div>
				</div>
				<div className="grey-divider" />
				<Footer />
			</div>
		);
	}
}
