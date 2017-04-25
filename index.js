(function(global) {
    'use strict'; 

    function npmtest() {
        console.log('run... npmtest');

        var test = require('./inner.js');

    }

    
    // require('npmtest'); 이런식으로 불러 올수 있게 함
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.npmtest = npmtest;
    } else {
        global.npmtest = npmtest;
    }


    // npmtest();

}(this));