import App, { Container } from 'next/app';

import JssProvider from 'react-jss/lib/JssProvider';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import React from 'react';
import Header from './components/header';
import getPageContext from './utilities/get-page-context';

export default class MyApp extends App {
	state = { loading: true };

	constructor(props) {
		super(props);
		this.pageContext = getPageContext();
	}

	static async getInitialProps({ Component, router, ctx }) {
		let pageProps = {};

		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx);
		}

		return { pageProps };
	}

	componentDidMount() {
		const jssStyles = document.querySelector('#jss-server-side');
		if (jssStyles && jssStyles.parentNode) {
			jssStyles.parentNode.removeChild(jssStyles);
		}

		this.setState({ loading: false });
	}

	render() {
		const { Component, pageProps } = this.props;

		return (
			<Container>
				<JssProvider
					registry={this.pageContext.sheetsRegistry}
					generateClassName={this.pageContext.generateClassName}
				>
					<MuiThemeProvider
						theme={this.pageContext.theme}
						sheetsManager={this.pageContext.sheetsManager}
					>
						{this.renderLoading()}
						<Header />
						<Component {...pageProps} />
					</MuiThemeProvider>
				</JssProvider>
			</Container>
		);
	}

	renderLoading() {
		if (!this.state.loading) {
			return;
		}

		return (
			<div style={{ position: 'fixed', height: '100%', width: '100%', background: 'white', zIndex: 2000 }}></div>);;
	}
}
