import React from 'react';
import BasePage from '../../lib/BasePage';
import Footer from '../../components/footer';

export default class AboutPage extends BasePage {
	render() {
		return (
			<div
				className="page-fade-in"
				data-ix="page-fade-in"
				style={{ opacity: 1, transition: 'opacity 200ms' }}
			>
				<div className="banner about portfolio">
					<div className="container w-container">
						<div className="center">
							<div>
								<div className="section-tittle dark">About Us</div>
							</div>
						</div>
					</div>
				</div>
				<div className="section">
					<div className="container w-container">
						<div className="vertical-column-row w-row">
							<div className="w-col w-col-6">
								<div
									className="left-side-div-image about"
									data-ix="fade-right"
									style={{
										opacity: 1,
										transform: 'translateX(0px) translateY(0px) translateZ(0px)',
										transition: 'opacity 500ms, transform 800ms'
									}}
								/>
							</div>
							<div className="w-col w-col-6">
								<div
									className="left-side-div-image about _2"
									data-ix="fade-up-2"
									style={{
										opacity: 1,
										transform: 'translateX(0px) translateY(0px) translateZ(0px)',
										transition: 'opacity 500ms, transform 800ms'
									}}
								/>
								<div
									className="left-side-div-image about _3"
									data-ix="fade-up-3"
									style={{
										opacity: 1,
										transform: 'translateX(0px) translateY(0px) translateZ(0px)',
										transition: 'opacity 500ms, transform 800ms'
									}}
								/>
							</div>
						</div>
						<div className="about-us-copy">
							<div className="w-row">
								<div className="project-column-content w-col w-col-6">
									<p>We are a team who loves animals and technology</p>
								</div>
								<div className="project-column-content-2 w-col w-col-6">
									<p>Using the blockchain to make a change in the world.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div />
				<div className="section">
					<div className="container w-container">
						<div className="bottom-padding-80">
							<div className="algin-center">
								<h2 className="crew-section-header">Our Talented Crew</h2>
								<div className="subtittle">Meet the team behind Vanimals</div>
								<div className="headline-sign">
									<div className="line-features gray" />
									<div className="color-line" />
								</div>
							</div>
						</div>
						<div>
							<div className="w-row">
								<div className="w-col w-col-3 w-col-medium-6">
									<div
										className="team-wrapper"
										data-ix="fade-left"
										style={{
											transition: 'all 0.2s ease 0s, opacity 500ms, transform 800ms',
											opacity: 1,
											transform: 'translateX(0px) translateY(0px) translateZ(0px)'
										}}
									>
										<img
											src="static/images/team3.jpg"
											srcSet="static/images/team3-p-500.jpeg 500w, static/images/team3.jpg 600w"
											sizes="(max-width: 479px) 33vw, 96px"
											className="team-image _2"
										/>
										<h4 className="team-heading">Harrison</h4>
										<div className="line-features tint" />
										<div className="color-line" />
										<div className="team-member-text">
											Full Stack Developer.<br /> On the weekends he enjoys breaking walnuts with
											his eyelids.
										</div>
										<div className="links-block">
											<a href="#" className="social-icon twitter w-inline-block" />
											<a href="#" className="social-icon w-inline-block" />
											<a href="#" className="social-icon gmail w-inline-block" />
										</div>
									</div>
								</div>
								<div className="w-col w-col-3 w-col-medium-6">
									<div
										className="team-wrapper"
										data-ix="fade-left-2"
										style={{
											transition: 'all 0.2s ease 0s, opacity 500ms, transform 800ms',
											opacity: 1,
											transform: 'translateX(0px) translateY(0px) translateZ(0px)'
										}}
									>
										<img
											src="static/images/team1.jpg"
											srcSet="static/images/team1-p-500.jpeg 500w, static/images/team1.jpg 600w"
											sizes="(max-width: 479px) 33vw, 96px"
											className="team-image _2"
										/>
										<h4 className="team-heading">Ali</h4>
										<div className="line-features tint" />
										<div className="color-line" />
										<div className="team-member-text">
											Vanimator.<br /> $5 and he'll photoshop you with abs and a full head of hair.<br />‍
										</div>
										<div className="links-block">
											<a href="#" className="social-icon twitter w-inline-block" />
											<a href="#" className="social-icon w-inline-block" />
											<a href="#" className="social-icon gmail w-inline-block" />
										</div>
									</div>
								</div>
								<div className="w-col w-col-3 w-col-medium-6">
									<div>
										<div
											className="team-wrapper"
											data-ix="fade-left-3"
											style={{
												transition: 'all 0.2s ease 0s, opacity 500ms, transform 800ms',
												opacity: 1,
												transform: 'translateX(0px) translateY(0px) translateZ(0px)'
											}}
										>
											<img
												src="static/images/team-5.jpg"
												srcSet="static/images/team-5-p-500.jpeg 500w, static/images/team-5.jpg 600w"
												sizes="(max-width: 479px) 33vw, 96px"
												className="team-image _2"
											/>
											<h4 className="team-heading">Trevor</h4>
											<div className="line-features tint" />
											<div className="color-line" />
											<div className="team-member-text">
												Web Designer.<br />Family man.<br />Loves skiing.<br />Hates snow.<br />‍
											</div>
											<div className="links-block">
												<a href="#" className="social-icon twitter w-inline-block" />
												<a href="#" className="social-icon w-inline-block" />
												<a href="#" className="social-icon gmail w-inline-block" />
											</div>
										</div>
									</div>
								</div>
								<div className="w-col w-col-3 w-col-medium-6">
									<div
										className="team-wrapper"
										data-ix="fade-left-4"
										style={{
											transition: 'all 0.2s ease 0s, opacity 500ms, transform 800ms',
											opacity: 1,
											transform: 'translateX(0px) translateY(0px) translateZ(0px)'
										}}
									>
										<img
											src="static/images/team-2.jpg"
											srcSet="static/images/team-2-p-500.jpeg 500w, static/images/team-2.jpg 600w"
											sizes="(max-width: 479px) 33vw, 96px"
											className="team-image _4"
										/>
										<h4 className="team-heading">Aram</h4>
										<div className="line-features tint" />
										<div className="color-line" />
										<div className="team-member-text">
											I'm a Scorpio with Capricorn tendencies. Occasionally I do things with
											Blockchain.
										</div>
										<div className="links-block">
											<a href="#" className="social-icon twitter w-inline-block" />
											<a href="#" className="social-icon w-inline-block" />
											<a href="#" className="social-icon gmail w-inline-block" />
										</div>
									</div>
								</div>
							</div>
							<div className="team-member" />
							<div className="team-member" />
							<div className="team-member" />
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);
	}
}
