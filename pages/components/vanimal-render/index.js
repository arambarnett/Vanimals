import React from 'react';

class DemoScene extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			scene: {}
		};
	}

	componentDidMount() {
		const { scene } = this.refs;
		this.setState({ scene });
	}

	render() {
		return (
			<div style={{ height: 500, width: 500 }}>
				<iframe src="http://127.0.0.1:8000" />
			</div>
		);
	}
}

export default DemoScene;
