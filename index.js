(function(global) {
    'use strict'; 

    function npmtest() {
        console.log('run... npmtest');
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports.npmtest = npmtest;
    } else {
        global.npmtest = npmtest;
    }

}(this));