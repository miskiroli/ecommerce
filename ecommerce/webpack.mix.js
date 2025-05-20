const mix = require('laravel-mix');
const webpack = require('webpack'); // Webpack importálása

mix.js('resources/js/app.js', 'public/js')
  .react()
  .sass('resources/sass/app.scss', 'public/css')
  .version(); // Verziókezelés az éles környezetben

// Opcionálisan átadhatod a .env változókat a JavaScriptbe
mix.webpackConfig({
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        REACT_APP_API_URL: JSON.stringify(process.env.REACT_APP_API_URL || 'https://shopzone.miskiroland.com/api'),
        REACT_APP_STORAGE_URL: JSON.stringify(process.env.REACT_APP_STORAGE_URL || 'https://shopzone.miskiroland.com/storage'),
      },
    }),
  ],
});

if (mix.inProduction()) {
  mix.extract(); // Külön fájlba szedi a vendor könyvtárakat
}