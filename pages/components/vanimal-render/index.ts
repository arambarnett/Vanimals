import BaseComponent from '../../lib/BaseComponent';

class VanimalRender extends BaseComponent {
	render() {
		const imageUrl = this.props.imageUrl;

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
	j
}

export default VanimalRender;
