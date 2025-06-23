/* eslint-disable prefer-arrow/prefer-arrow-functions */
// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
  pageExtensions: ['js', 'jsx'],
  experimental: {
    appDir: false
  },
  images: {
    domains: ["cdm-backend-assets.s3.amazonaws.com"],
  },
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: "file-loader",
        options: {
          publicPath: "/_next/static/images",
          outputPath: "static/images/",
        },
      },
    });

    // Ignore problematic client-side packages during server-side rendering
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push(
        '@scatterjs/core', 
        '@scatterjs/eosjs2', 
        'device-uuid',
        '@lay2/pw-core'
      );
    }

    // Add fallbacks for browser-only APIs
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "crypto": false,
      "stream": false,
      "util": false,
      "buffer": false,
      "assert": false,
    };

    return config;
  },
  // Your existing module.exports
};

const SentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
