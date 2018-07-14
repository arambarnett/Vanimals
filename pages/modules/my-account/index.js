import React from 'react';
import BasePage from '../../lib/BasePage';
import Footer from '../../components/footer';
import Header from '../../components/header';

export default class VanimalPage extends BasePage {
	render() {
		return (
			<div>
				<Header />
				<div className="container-2 w-container">
					<h1 className="heading-2">My Account</h1>
				</div>
				<div className="container-3 w-container">
					<h2 className="heading-3">Leaderboard</h2>
					<p>
						Here's a collection of the current rarest Vanimals. Check out the store for a chance to
						get one of them!
					</p>
				</div>
				<div className="w-container">
					<div className="vanimal-row w-row">
						<div className="w-col w-col-4">
							<div className="vanimal-individual-wrapper">
								<img
									src="static/images/image-1.png"
									srcSet="static/images/image-1-p-500.png 500w, static/images/image-1-p-800.png 800w, static/images/image-1.png 900w"
									sizes="(max-width: 479px) 90vw, (max-width: 767px) 93vw, (max-width: 991px) 199.328125px, 269.984375px"
									className="individual-vanimal"
								/>
							</div>
						</div>
						<div className="w-col w-col-4">
							<div className="vanimal-individual-wrapper">
								<img
									src="static/images/Screen-Shot-2018-06-14-at-5.02.38-PM.png"
									srcSet="static/images/Screen-Shot-2018-06-14-at-5.02.38-PM-p-500.png 500w, static/images/Screen-Shot-2018-06-14-at-5.02.38-PM.png 726w"
									sizes="(max-width: 479px) 90vw, (max-width: 767px) 93vw, (max-width: 991px) 199.328125px, 269.984375px"
									className="individual-vanimal"
								/>
							</div>
						</div>
						<div className="w-col w-col-4">
							<div className="vanimal-individual-wrapper">
								<img
									src="static/images/oleg-stebenyev-r4-gorilla-f.jpg"
									srcSet="static/images/oleg-stebenyev-r4-gorilla-f-p-500.jpeg 500w, static/images/oleg-stebenyev-r4-gorilla-f-p-800.jpeg 800w, static/images/oleg-stebenyev-r4-gorilla-f-p-1080.jpeg 1080w, static/images/oleg-stebenyev-r4-gorilla-f-p-1600.jpeg 1600w, static/images/oleg-stebenyev-r4-gorilla-f.jpg 1827w"
									sizes="(max-width: 479px) 90vw, (max-width: 767px) 93vw, (max-width: 991px) 199.328125px, 269.984375px"
									className="individual-vanimal"
								/>
							</div>
						</div>
					</div>
					<div className="vanimal-row w-row">
						<div className="w-col w-col-4">
							<div className="vanimal-individual-wrapper">
								<img
									src="static/images/Screen-Shot-2018-06-14-at-5.01.55-PM.png"
									srcSet="static/images/Screen-Shot-2018-06-14-at-5.01.55-PM-p-500.png 500w, static/images/Screen-Shot-2018-06-14-at-5.01.55-PM.png 726w"
									sizes="(max-width: 479px) 90vw, (max-width: 767px) 93vw, (max-width: 991px) 199.328125px, 269.984375px"
									className="individual-vanimal"
								/>
							</div>
						</div>
						<div className="w-col w-col-4">
							<div className="vanimal-individual-wrapper">
								<img
									src="static/images/jona-dinges-tiger.jpg"
									srcSet="static/images/jona-dinges-tiger-p-500.jpeg 500w, static/images/jona-dinges-tiger.jpg 800w"
									sizes="(max-width: 479px) 90vw, (max-width: 767px) 93vw, (max-width: 991px) 199.328125px, 269.984375px"
									className="individual-vanimal"
								/>
							</div>
						</div>
						<div className="w-col w-col-4">
							<div className="vanimal-individual-wrapper">
								<img
									src="static/images/image-1.png"
									srcSet="static/images/image-1-p-500.png 500w, static/images/image-1-p-800.png 800w, static/images/image-1.png 900w"
									sizes="(max-width: 479px) 90vw, (max-width: 767px) 93vw, (max-width: 991px) 199.328125px, 269.984375px"
									className="individual-vanimal"
								/>
							</div>
						</div>
					</div>
					<div className="vanimal-row w-row">
						<div className="w-col w-col-4">
							<div className="vanimal-individual-wrapper">
								<img
									src="static/images/image-1.png"
									srcSet="static/images/image-1-p-500.png 500w, static/images/image-1-p-800.png 800w, static/images/image-1.png 900w"
									sizes="(max-width: 479px) 90vw, (max-width: 767px) 93vw, (max-width: 991px) 199.328125px, 269.984375px"
									className="individual-vanimal"
								/>
							</div>
						</div>
						<div className="w-col w-col-4">
							<div className="vanimal-individual-wrapper">
								<img
									src="static/images/Screen-Shot-2018-06-14-at-5.02.38-PM.png"
									srcSet="static/images/Screen-Shot-2018-06-14-at-5.02.38-PM-p-500.png 500w, static/images/Screen-Shot-2018-06-14-at-5.02.38-PM.png 726w"
									sizes="(max-width: 479px) 90vw, (max-width: 767px) 93vw, (max-width: 991px) 199.328125px, 269.984375px"
									className="individual-vanimal"
								/>
							</div>
						</div>
						<div className="w-col w-col-4">
							<div className="vanimal-individual-wrapper">
								<img
									src="static/images/oleg-stebenyev-r4-gorilla-f.jpg"
									srcSet="static/images/oleg-stebenyev-r4-gorilla-f-p-500.jpeg 500w, static/images/oleg-stebenyev-r4-gorilla-f-p-800.jpeg 800w, static/images/oleg-stebenyev-r4-gorilla-f-p-1080.jpeg 1080w, static/images/oleg-stebenyev-r4-gorilla-f-p-1600.jpeg 1600w, static/images/oleg-stebenyev-r4-gorilla-f.jpg 1827w"
									sizes="(max-width: 479px) 90vw, (max-width: 767px) 93vw, (max-width: 991px) 199.328125px, 269.984375px"
									className="individual-vanimal"
								/>
							</div>
						</div>
					</div>
					<div className="vanimal-row w-row">
						<div className="w-col w-col-4">
							<div className="vanimal-individual-wrapper">
								<img
									src="static/images/Screen-Shot-2018-06-14-at-5.02.27-PM.png"
									srcSet="static/images/Screen-Shot-2018-06-14-at-5.02.27-PM-p-500.png 500w, static/images/Screen-Shot-2018-06-14-at-5.02.27-PM.png 728w"
									sizes="(max-width: 479px) 90vw, (max-width: 767px) 93vw, (max-width: 991px) 199.328125px, 269.984375px"
									className="individual-vanimal"
								/>
							</div>
						</div>
						<div className="w-col w-col-4">
							<div className="vanimal-individual-wrapper">
								<img
									src="static/images/oleg-stebenyev-r4-gorilla-f.jpg"
									srcSet="static/images/oleg-stebenyev-r4-gorilla-f-p-500.jpeg 500w, static/images/oleg-stebenyev-r4-gorilla-f-p-800.jpeg 800w, static/images/oleg-stebenyev-r4-gorilla-f-p-1080.jpeg 1080w, static/images/oleg-stebenyev-r4-gorilla-f-p-1600.jpeg 1600w, static/images/oleg-stebenyev-r4-gorilla-f.jpg 1827w"
									sizes="(max-width: 479px) 90vw, (max-width: 767px) 93vw, (max-width: 991px) 199.328125px, 269.984375px"
									className="individual-vanimal"
								/>
							</div>
						</div>
						<div className="w-col w-col-4">
							<div className="vanimal-individual-wrapper">
								<img
									src="static/images/image-1.png"
									srcSet="static/images/image-1-p-500.png 500w, static/images/image-1-p-800.png 800w, static/images/image-1.png 900w"
									sizes="(max-width: 479px) 90vw, (max-width: 767px) 93vw, (max-width: 991px) 199.328125px, 269.984375px"
									className="individual-vanimal"
								/>
							</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);
	}
}
