import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render() {
		return (
			<html className="w-mod-js wf-lato-n1-active wf-lato-i1-active wf-lato-n3-active wf-lato-i3-active wf-lato-n4-active wf-lato-i4-active wf-lato-n7-active wf-lato-i7-active wf-lato-n9-active wf-lato-i9-active wf-opensans-n3-active wf-opensans-i3-active wf-opensans-n4-active wf-opensans-i4-active wf-opensans-n6-active wf-opensans-i6-active wf-opensans-n7-active wf-opensans-i7-active wf-opensans-n8-active wf-opensans-i8-active wf-muli-n2-active wf-muli-i2-active wf-muli-n3-active wf-muli-i3-active wf-muli-n4-active wf-muli-i4-active wf-muli-n6-active wf-muli-i6-active wf-muli-n7-active wf-muli-i7-active wf-muli-n8-active wf-muli-i8-active wf-muli-n9-active wf-muli-i9-active wf-poppins-n1-active wf-poppins-i1-active wf-poppins-n2-active wf-poppins-i2-active wf-poppins-n3-active wf-poppins-i3-active wf-poppins-n4-active wf-poppins-i4-active wf-poppins-n5-active wf-poppins-i5-active wf-poppins-n6-active wf-poppins-i6-active wf-poppins-n7-active wf-poppins-i7-active wf-poppins-n8-active wf-poppins-i8-active wf-poppins-n9-active wf-poppins-i9-active wf-active">
				<Head>
					<meta charSet="utf-8" />
					<title>Square - Agency HTML Webflow Template</title>
					<meta
						content="Square UI Kit Webflow Template is a perfect solution for all kinds of businesses and corporations. Square CMS template gives you the power to create a unique-looking and fully responsive website. On top of that, Square comes equipped with 6 creative home pages  and a lot of inner pages for a quick start."
						name="description"
					/>
					<meta content="Square - Agency HTML Webflow Template" property="og:title" />
					<meta
						content="Square UI Kit Webflow Template is a perfect solution for all kinds of businesses and corporations. Square CMS template gives you the power to create a unique-looking and fully responsive website. On top of that, Square comes equipped with 6 creative home pages  and a lot of inner pages for a quick start."
						property="og:description"
					/>
					<meta content="summary" name="twitter:card" />
					<meta content="width=device-width, initial-scale=1" name="viewport" />
					<meta content="Webflow" name="generator" />
					<link href="/static/css/normalize.css" rel="stylesheet" type="text/css" />
					<link href="/static/css/webflow.css" rel="stylesheet" type="text/css" />
					<link href="/static/css/vanimals.webflow.css" rel="stylesheet" type="text/css" />
					<link
						rel="stylesheet"
						href="http://fonts.googleapis.com/css?family=Lato:100,100italic,300,300italic,400,400italic,700,700italic,900,900italic%7COpen+Sans:300,300italic,400,400italic,600,600italic,700,700italic,800,800italic%7CMuli:200,200italic,300,300italic,regular,italic,600,600italic,700,700italic,800,800italic,900,900italic%7CPoppins:100,100italic,200,200italic,300,300italic,regular,italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic"
					/>
					{/* [if lt IE 9]><![endif] */}
					<link href="/static/images/32_132.jpg" rel="shortcut icon" type="image/x-icon" />
					<link href="/static/images/256.jpg" rel="apple-touch-icon" />
					<script src="https://code.jquery.com/jquery-3.3.1.min.js" type="text/javascript" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
					<script src="static/js/webflow.js" type="text/javascript"></script>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</html>
		);
	}
}
