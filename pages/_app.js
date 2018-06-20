import App, { Container } from 'next/app';
import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './styles/theme';

export default class MyApp extends App {
	static async getInitialProps({ Component, router, ctx }) {
		let pageProps = {};

		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx);
		}

		return { pageProps };
	}

	render() {
		const { Component, pageProps } = this.props;

		return (
			<React.Fragment>
				<CssBaseline>
					<MuiThemeProvider theme={theme}>
						<Component {...pageProps} />
					</MuiThemeProvider>
				</CssBaseline>
			</React.Fragment>
		);
	}
}
