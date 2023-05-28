const path = require('path');
module.exports = {
    webpack: {
        /*resolve: {
            fallback: {
                'querystring': require.resolve('querystring-es3')
            }
        }*/
        
    },
    devServer: {
        compress: false,
        port: 3005,
        hot: true,
        https: true,
        host: '127.0.0.1',
        proxy: {
            '/api/v1': {
                target: 'https://cluster.sigm-a.ru',
                changeOrigin: true,
            }
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        },
        allowedHosts: [
            'localhost'
        ]
    },
};
