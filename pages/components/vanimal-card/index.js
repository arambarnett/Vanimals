import BaseComponent from '../../lib/BaseComponent';

export default class VanimalCard extends BaseComponent {
	render() {
		return (
			<div>
				<a
					href={`/vanimals/${this.props.vanimal.vanimal_id}`}
					className="project-wrapper style2 w-inline-block"
					data-ix="fade-up"
					style={{
						transition: 'all 0.3s ease 0s, opacity 500ms, transform 800ms',
						opacity: 1,
						transform: 'translateX(0px) translateY(0px) translateZ(0px)',
						marginBottom: '0px !important'
					}}
				>
					<div className="project-image">
						{this.renderImage()}
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
						<p className="paragraph-project dark _5">{this.props.vanimal.name || 'Untitled'}</p>
						<h4 className="project-header white-content">
							{this.props.vanimal.short_description || '--'}
						</h4>
					</div>
				</a>
			</div>
		);
	}

	renderImage() {
		const imageUrl = this.props.vanimal.image_url;

		if (!imageUrl) {
			return (
				<div
					style={{ height: 260, background: 'rgba(0, 0, 0, .1)' }}
					sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 30vw"
					className="tab-style-2-image"
				/>
			);
		}

		return (
			<img
				src={imageUrl}
				width={200}
				height={260}
				sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, 30vw"
				className="tab-style-2-image"
			/>
		);
	}
}
