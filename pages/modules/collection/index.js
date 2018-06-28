import React from 'react';
import BasePage from '../../lib/BasePage';
import Footer from '../../components/footer';
import Header from '../../components/header';

export default class VanimalPage extends BasePage {
	render() {
		return (
			<div
				className="page-fade-in"
				data-ix="page-fade-in"
				style={{ opacity: 1, transition: 'opacity 200ms' }}
			>
				<div className="banner portfolio fullwidth">
					<Header />
					<div className="container w-container">
						<div className="center text">
							<div>
								<div className="section-tittle dark">Our Portfolio</div>
							</div>
						</div>
					</div>
				</div>
				<div className="section no-algin">
					<div className="bottom-padding-80">
						<div className="algin-center">
							<h2 className="tab-features-heading">Aram's Collection</h2>
							<div className="subtittle">
								Add a t tab section here to sort through my collection, we should also make the
								vanimals populate starting with the rarest first
							</div>
							<div className="headline-sign">
								<div className="line-features gray" />
								<div className="color-line" />
							</div>
						</div>
					</div>
					<div className="top-padding _80">
						<div className="portfolio-row no-padding w-row">
							<div className="column-iteam w-clearfix w-col w-col-4 w-col-stack">
								<a
									href="../vanimals-site/single-portfolio.html"
									className="project-wrapper style2 w-inline-block"
									data-ix="project-wrapper"
									style={{ transition: 'all 0.3s ease 0s' }}
								>
									<div className="project-image">
										<img
											src="/static/images/elephant.jpg"
											width={200}
											height={356}
											srcSet="/static/images/elephant-p-500.jpeg 500w, /static/images/elephant-p-800.jpeg 800w, /static/images/elephant.jpg 900w"
											sizes="(max-width: 479px) 92vw, (max-width: 767px) 95vw, (max-width: 991px) 96vw, 33vw"
											className="tab-style-2-image"
										/>
										<div
											className="overlay-image"
											data-ix="overlay-hide-content-image"
											style={{ transition: 'all 0.3s ease 0s' }}
										>
											<div
												className="project-content style _4 full"
												data-ix="hide-project-overlay-on-initial"
												style={{ opacity: 0 }}
											>
												<p className="paragraph-project">Sumatran Elephant</p>
												<h4 className="project-header">Dumbo</h4>
											</div>
										</div>
									</div>
								</a>
							</div>
							<div className="column-iteam w-clearfix w-col w-col-4 w-col-stack">
								<a
									href="../vanimals-site/single-portfolio.html"
									className="project-wrapper style2 w-inline-block"
									data-ix="project-wrapper"
									style={{ transition: 'all 0.3s ease 0s' }}
								>
									<div className="project-image">
										<img
											src="/static/images/oleg-stebenyev-r4-gorilla-f.jpg"
											width={200}
											height={356}
											srcSet="/static/images/oleg-stebenyev-r4-gorilla-f-p-500.jpeg 500w, /static/images/oleg-stebenyev-r4-gorilla-f-p-800.jpeg 800w, /static/images/oleg-stebenyev-r4-gorilla-f-p-1080.jpeg 1080w, /static/images/oleg-stebenyev-r4-gorilla-f-p-1600.jpeg 1600w, /static/images/oleg-stebenyev-r4-gorilla-f.jpg 1827w"
											sizes="(max-width: 479px) 92vw, (max-width: 767px) 95vw, (max-width: 991px) 96vw, 33vw"
											className="tab-style-2-image"
										/>
										<div
											className="overlay-image"
											data-ix="overlay-hide-content-image"
											style={{ transition: 'all 0.3s ease 0s' }}
										>
											<div
												className="project-content style _5 full"
												data-ix="hide-project-overlay-on-initial"
												style={{
													opacity: 0,
													transformStyle: 'preserve-3d',
													transition: 'opacity 400ms, transform 400ms',
													transform: 'scaleX(1) scaleY(1) scaleZ(1)'
												}}
											>
												<p
													className="paragraph-project"
													style={{
														transformStyle: 'preserve-3d',
														transition: 'transform 200ms, opacity 200ms',
														opacity: 0,
														transform: 'translateX(0px) translateY(20px) translateZ(0px)'
													}}
												>
													Cross River Gorilla
												</p>
												<h4
													className="project-header"
													style={{
														transformStyle: 'preserve-3d',
														transition: 'transform 200ms, opacity 200ms',
														opacity: 0,
														transform: 'translateX(0px) translateY(20px) translateZ(0px)'
													}}
												>
													Ginger
												</h4>
											</div>
										</div>
									</div>
								</a>
							</div>
							<div className="column-iteam w-clearfix w-col w-col-4 w-col-stack">
								<a
									href="../vanimals-site/single-portfolio.html"
									className="project-wrapper style2 w-inline-block"
									data-ix="project-wrapper"
									style={{ transition: 'all 0.3s ease 0s' }}
								>
									<div className="project-image">
										<img
											src="/static/images/Lowpoly_Pheasant_3d_model_preview_005.jpg"
											width={200}
											height={356}
											srcSet="/static/images/Lowpoly_Pheasant_3d_model_preview_005-p-1080.jpeg 1080w, /static/images/Lowpoly_Pheasant_3d_model_preview_005.jpg 1574w"
											sizes="(max-width: 479px) 92vw, (max-width: 767px) 95vw, (max-width: 991px) 96vw, 33vw"
											className="tab-style-2-image"
										/>
										<div
											className="overlay-image"
											data-ix="overlay-hide-content-image"
											style={{ transition: 'all 0.3s ease 0s' }}
										>
											<div
												className="project-content style full"
												data-ix="hide-project-overlay-on-initial"
												style={{ opacity: 0 }}
											>
												<p className="paragraph-project">Common Pigeon</p>
												<h4 className="project-header">Clayton</h4>
											</div>
										</div>
									</div>
								</a>
							</div>
						</div>
						<div className="portfolio-row no-padding w-row">
							<div className="column-iteam w-clearfix w-col w-col-4 w-col-stack">
								<a
									href="../vanimals-site/single-portfolio.html"
									className="project-wrapper style2 w-inline-block"
									data-ix="project-wrapper"
									style={{ transition: 'all 0.3s ease 0s' }}
								>
									<div className="project-image">
										<img
											src="/static/images/Pheasant3.png"
											width={200}
											height={356}
											srcSet="/static/images/Pheasant3-p-500.png 500w, /static/images/Pheasant3-p-800.png 800w, /static/images/Pheasant3.png 1074w"
											sizes="(max-width: 479px) 92vw, (max-width: 767px) 95vw, (max-width: 991px) 96vw, 33vw"
											className="tab-style-2-image"
										/>
										<div
											className="overlay-image"
											data-ix="overlay-hide-content-image"
											style={{ transition: 'all 0.3s ease 0s' }}
										>
											<div
												className="project-content style _1 full"
												data-ix="hide-project-overlay-on-initial"
												style={{ opacity: 0 }}
											>
												<p className="paragraph-project">Chinese Pheasant</p>
												<h4 className="project-header">Reginald</h4>
											</div>
										</div>
									</div>
								</a>
							</div>
							<div className="column-iteam w-clearfix w-col w-col-4 w-col-stack">
								<a
									href="../vanimals-site/single-portfolio.html"
									className="project-wrapper style2 w-inline-block"
									data-ix="project-wrapper"
									style={{ transition: 'all 0.3s ease 0s' }}
								>
									<div className="project-image">
										<img
											src="/static/images/Screen-Shot-2018-06-14-at-5.01.55-PM.png"
											width={200}
											height={356}
											srcSet="/static/images/Screen-Shot-2018-06-14-at-5.01.55-PM-p-500.png 500w, /static/images/Screen-Shot-2018-06-14-at-5.01.55-PM.png 726w"
											sizes="(max-width: 479px) 92vw, (max-width: 767px) 95vw, (max-width: 991px) 96vw, 33vw"
											className="tab-style-2-image"
										/>
										<div
											className="overlay-image"
											data-ix="overlay-hide-content-image"
											style={{ transition: 'all 0.3s ease 0s' }}
										>
											<div
												className="project-content style _2 full"
												data-ix="hide-project-overlay-on-initial"
												style={{ opacity: 0 }}
											>
												<p className="paragraph-project">Giant Panda</p>
												<h4 className="project-header">Ms Wiggles</h4>
											</div>
										</div>
									</div>
								</a>
							</div>
							<div className="column-iteam w-clearfix w-col w-col-4 w-col-stack">
								<a
									href="../vanimals-site/single-portfolio.html"
									className="project-wrapper style2 w-inline-block"
									data-ix="project-wrapper"
									style={{ transition: 'all 0.3s ease 0s' }}
								>
									<div className="project-image">
										<img
											src="/static/images/Screen-Shot-2018-06-14-at-5.02.27-PM.png"
											width={200}
											height={356}
											srcSet="/static/images/Screen-Shot-2018-06-14-at-5.02.27-PM-p-500.png 500w, /static/images/Screen-Shot-2018-06-14-at-5.02.27-PM.png 728w"
											sizes="(max-width: 479px) 92vw, (max-width: 767px) 95vw, (max-width: 991px) 96vw, 33vw"
											className="tab-style-2-image"
										/>
										<div
											className="overlay-image"
											data-ix="overlay-hide-content-image"
											style={{ transition: 'all 0.3s ease 0s' }}
										>
											<div
												className="project-content style full"
												data-ix="hide-project-overlay-on-initial"
												style={{ opacity: 0 }}
											>
												<p className="paragraph-project">Giant Panda</p>
												<h4 className="project-header">Mr Wiggles</h4>
											</div>
										</div>
									</div>
								</a>
							</div>
						</div>
					</div>
				</div>
				<div>
					<div className="portfolio-row no-padding w-row">
						<div className="column-iteam w-clearfix w-col w-col-4 w-col-stack">
							<a
								href="../vanimals-site/single-portfolio.html"
								className="project-wrapper style2 w-inline-block"
								data-ix="project-wrapper"
								style={{ transition: 'all 0.3s ease 0s' }}
							>
								<div className="project-image">
									<img
										src="/static/images/keila-hotzel-395555.jpg"
										srcSet="/static/images/keila-hotzel-395555-p-1080.jpeg 1080w, /static/images/keila-hotzel-395555-p-1600.jpeg 1600w, /static/images/keila-hotzel-395555-p-2000.jpeg 2000w, /static/images/keila-hotzel-395555-p-2600.jpeg 2600w, /static/images/keila-hotzel-395555-p-3200.jpeg 3200w, /static/images/keila-hotzel-395555.jpg 4200w"
										sizes="(max-width: 479px) 92vw, (max-width: 767px) 95vw, (max-width: 991px) 96vw, 33vw"
										className="tab-style-2-image"
									/>
									<div
										className="overlay-image"
										data-ix="overlay-hide-content-image"
										style={{ transition: 'all 0.3s ease 0s' }}
									>
										<div
											className="project-content style _4 full"
											data-ix="hide-project-overlay-on-initial"
											style={{ opacity: 0 }}
										>
											<p className="paragraph-project">Design Idea</p>
											<h4 className="project-header">Design Domo</h4>
										</div>
									</div>
								</div>
							</a>
						</div>
						<div className="column-iteam w-clearfix w-col w-col-4 w-col-stack">
							<a
								href="../vanimals-site/single-portfolio.html"
								className="project-wrapper style2 w-inline-block"
								data-ix="project-wrapper"
								style={{ transition: 'all 0.3s ease 0s' }}
							>
								<div className="project-image">
									<img
										src="/static/images/scott-webb-347201.jpg"
										srcSet="/static/images/scott-webb-347201-p-500.jpeg 500w, /static/images/scott-webb-347201-p-1080.jpeg 1080w, /static/images/scott-webb-347201-p-1600.jpeg 1600w, /static/images/scott-webb-347201-p-2000.jpeg 2000w, /static/images/scott-webb-347201-p-2600.jpeg 2600w, /static/images/scott-webb-347201-p-3200.jpeg 3200w, /static/images/scott-webb-347201.jpg 6000w"
										sizes="(max-width: 479px) 92vw, (max-width: 767px) 95vw, (max-width: 991px) 96vw, 33vw"
										className="tab-style-2-image"
									/>
									<div
										className="overlay-image"
										data-ix="overlay-hide-content-image"
										style={{ transition: 'all 0.3s ease 0s' }}
									>
										<div
											className="project-content style _5 full"
											data-ix="hide-project-overlay-on-initial"
											style={{ opacity: 0 }}
										>
											<p className="paragraph-project">Product Design</p>
											<h4 className="project-header">Web Rhythm</h4>
										</div>
									</div>
								</div>
							</a>
						</div>
						<div className="column-iteam w-clearfix w-col w-col-4 w-col-stack">
							<a
								href="../vanimals-site/single-portfolio.html"
								className="project-wrapper style2 w-inline-block"
								data-ix="project-wrapper"
								style={{ transition: 'all 0.3s ease 0s' }}
							>
								<div className="project-image">
									<img
										src="/static/images/Screen-Shot-2018-06-14-at-5.02.38-PM.png"
										width={200}
										height={356}
										srcSet="/static/images/Screen-Shot-2018-06-14-at-5.02.38-PM-p-500.png 500w, /static/images/Screen-Shot-2018-06-14-at-5.02.38-PM.png 726w"
										sizes="(max-width: 479px) 92vw, (max-width: 767px) 95vw, (max-width: 991px) 96vw, 33vw"
										className="tab-style-2-image"
									/>
									<div
										className="overlay-image"
										data-ix="overlay-hide-content-image"
										style={{ transition: 'all 0.3s ease 0s' }}
									>
										<div
											className="project-content style full"
											data-ix="hide-project-overlay-on-initial"
											style={{ opacity: 0 }}
										>
											<p className="paragraph-project">Virtual Reality</p>
											<h4 className="project-header">Invision View</h4>
										</div>
									</div>
								</div>
							</a>
						</div>
					</div>
					<div className="portfolio-row no-padding w-row">
						<div className="column-iteam w-clearfix w-col w-col-4 w-col-stack">
							<a
								href="../vanimals-site/single-portfolio.html"
								className="project-wrapper style2 w-inline-block"
								data-ix="project-wrapper"
								style={{ transition: 'all 0.3s ease 0s' }}
							>
								<div className="project-image">
									<img
										src="/static/images/alvaro-bernal-21561.jpg"
										srcSet="/static/images/alvaro-bernal-21561-p-1080.jpeg 1080w, /static/images/alvaro-bernal-21561-p-1600.jpeg 1600w, /static/images/alvaro-bernal-21561-p-2000.jpeg 2000w, /static/images/alvaro-bernal-21561-p-2600.jpeg 2600w, /static/images/alvaro-bernal-21561-p-3200.jpeg 3200w, /static/images/alvaro-bernal-21561.jpg 4272w"
										sizes="(max-width: 479px) 92vw, (max-width: 767px) 95vw, (max-width: 991px) 96vw, 33vw"
										className="tab-style-2-image"
									/>
									<div
										className="overlay-image"
										data-ix="overlay-hide-content-image"
										style={{ transition: 'all 0.3s ease 0s' }}
									>
										<div
											className="project-content style _1 full"
											data-ix="hide-project-overlay-on-initial"
											style={{ opacity: 0 }}
										>
											<p className="paragraph-project">Design Idea</p>
											<h4 className="project-header">Design Domo</h4>
										</div>
									</div>
								</div>
							</a>
						</div>
						<div className="column-iteam w-clearfix w-col w-col-4 w-col-stack">
							<a
								href="../vanimals-site/single-portfolio.html"
								className="project-wrapper style2 w-inline-block"
								data-ix="project-wrapper"
								style={{ transition: 'all 0.3s ease 0s' }}
							>
								<div className="project-image">
									<img
										src="/static/images/malte-wingen-381987.jpg"
										srcSet="/static/images/malte-wingen-381987-p-1080.jpeg 1080w, /static/images/malte-wingen-381987-p-1600.jpeg 1600w, /static/images/malte-wingen-381987-p-2000.jpeg 2000w, /static/images/malte-wingen-381987-p-2600.jpeg 2600w, /static/images/malte-wingen-381987-p-3200.jpeg 3200w, /static/images/malte-wingen-381987.jpg 5760w"
										sizes="(max-width: 479px) 92vw, (max-width: 767px) 95vw, (max-width: 991px) 96vw, 33vw"
										className="tab-style-2-image"
									/>
									<div
										className="overlay-image"
										data-ix="overlay-hide-content-image"
										style={{ transition: 'all 0.3s ease 0s' }}
									>
										<div
											className="project-content style _2 full"
											data-ix="hide-project-overlay-on-initial"
											style={{
												opacity: 0,
												transformStyle: 'preserve-3d',
												transition: 'opacity 400ms, transform 400ms',
												transform: 'scaleX(1) scaleY(1) scaleZ(1)'
											}}
										>
											<p
												className="paragraph-project"
												style={{
													transformStyle: 'preserve-3d',
													transition: 'transform 200ms, opacity 200ms',
													opacity: 0,
													transform: 'translateX(0px) translateY(20px) translateZ(0px)'
												}}
											>
												Product Design
											</p>
											<h4
												className="project-header"
												style={{
													transformStyle: 'preserve-3d',
													transition: 'transform 200ms, opacity 200ms',
													opacity: 0,
													transform: 'translateX(0px) translateY(20px) translateZ(0px)'
												}}
											>
												Web Rhythm
											</h4>
										</div>
									</div>
								</div>
							</a>
						</div>
						<div className="column-iteam w-clearfix w-col w-col-4 w-col-stack">
							<a
								href="../vanimals-site/single-portfolio.html"
								className="project-wrapper style2 w-inline-block"
								data-ix="project-wrapper"
								style={{ transition: 'all 0.3s ease 0s' }}
							>
								<div className="project-image">
									<img
										src="/static/images/temple-cerulean-421274.jpg"
										srcSet="/static/images/temple-cerulean-421274-p-1080.jpeg 1080w, /static/images/temple-cerulean-421274-p-1600.jpeg 1600w, /static/images/temple-cerulean-421274-p-2000.jpeg 2000w, /static/images/temple-cerulean-421274-p-2600.jpeg 2600w, /static/images/temple-cerulean-421274-p-3200.jpeg 3200w, /static/images/temple-cerulean-421274.jpg 6000w"
										sizes="(max-width: 479px) 92vw, (max-width: 767px) 95vw, (max-width: 991px) 96vw, 33vw"
										className="tab-style-2-image"
									/>
									<div
										className="overlay-image"
										data-ix="overlay-hide-content-image"
										style={{ transition: 'all 0.3s ease 0s' }}
									>
										<div
											className="project-content style full"
											data-ix="hide-project-overlay-on-initial"
											style={{ opacity: 0 }}
										>
											<p className="paragraph-project">Virtual Reality</p>
											<h4 className="project-header">Invision View</h4>
										</div>
									</div>
								</div>
							</a>
						</div>
					</div>
				</div>
				<div className="section color-purple clients">
					<div className="w-container">
						<div className="bottom-padding _50">
							<div className="algin-center">
								<h1 className="section-tittle-hero-white white">Our Loyal Clients</h1>
								<div className="subtittle white">What they Say</div>
							</div>
						</div>
						<div
							data-ix="fade-up-3"
							style={{
								opacity: 1,
								transform: 'translateX(0px) translateY(0px) translateZ(0px)',
								transition: 'opacity 500ms, transform 800ms'
							}}
						>
							<a href="#" className="client-logo color-link first w-inline-block" />
							<a href="#" className="client-logo _1 color-link w-inline-block" />
							<a href="#" className="client-logo _2 color-link w-inline-block" />
							<a href="#" className="client-logo color-link w-inline-block" />
							<a href="#" className="client-logo _5 color-link w-inline-block" />
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);
	}
}
