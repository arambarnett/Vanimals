import react from 'react';
import BaseComponent from '../../lib/BaseComponent';
import Grid from '@material-ui/core/Grid';

export default class ContractLog extends BaseComponent {
	render() {
		return (
			<Grid container spacing={0}>
				<Grid
					item
					xs={12}
					style={{
						background: 'rgba(0, 0, 0, .1)',
						borderRadius: '7px',
						width: 'calc(100% - 24px)',
						height: '200px',
						padding: '12px',
						overflowY: 'auto'
					}}
				>
					{this.props.log.split('\n').map(this.renderLog.bind(this))}
				</Grid>
			</Grid>
		);
	}

	renderLog(each, index) {
		return <div key={index} style={{ minHeight: 18 }}>{each}</div>;
	}
}
