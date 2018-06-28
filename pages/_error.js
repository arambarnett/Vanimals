import React from 'react';

export default class Error extends React.Component {
	static getInitialProps({ res, err }) {
		const statusCode = res ? res.statusCode : err ? err.statusCode : null;
		return { statusCode };
	}

	render() {
		return (
			<div
				className="page-fade-in"
				data-ix="page-fade-in"
				style={{ opacity: 1, transition: 'opacity 200ms' }}
			>
				<div className="banner password">
				</div>
				<div className="utility-page-wrap _404">
					<div className="utility-page-content">
						<img
							src="/static/images/icons8-no-access-100_1icons8-no-access-100.png"
							width={80}
							className="x"
						/>
						<h2 className="password-headline white">Page not found</h2>
						<div>The page you are looking for doesn't exist or has been moved.</div>
						<div className="top-padding">
							<a
								href="/"
								className="link-color-button line w-inline-block"
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
								<div className="button-text">Go back to home</div>
							</a>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
