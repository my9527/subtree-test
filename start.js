require('babel-register') ({
    presets: [[ 'env' , {
        "targets": {
            "node": "current"
          }
    }]],
    "plugins": [
        "transform-decorators-legacy",
        "transform-class-properties"
    ]
})

module.exports = require('./index.js')