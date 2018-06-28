import React from 'react';
import BaseComponent from '../../../lib/BaseComponent';

export default class VanimalCard extends BaseComponent {
	render() {
		return (
			<div className="column-iteam style-2 w-clearfix w-col w-col-4 w-col-medium-4">
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
							src="/static/images/keila-hotzel-395555.jpg"
							srcSet="/static/images/keila-hotzel-395555-p-1080.jpeg 1080w, ../images/keila-hotzel-395555-p-1600.jpeg 1600w, ../images/keila-hotzel-395555-p-2000.jpeg 2000w, ../images/keila-hotzel-395555-p-2600.jpeg 2600w, ../images/keila-hotzel-395555-p-3200.jpeg 3200w, ../images/keila-hotzel-395555.jpg 4200w"
							sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 30vw"
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
		);
	}
}
