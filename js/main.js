require.config({
    baseUrl: 'js/',
    paths: {
        'jquery': 'jquery-1.11.1.min',
        'tenOnTen': 'tenOnTen',
        'cube': 'cube',
        'cubes': 'cubes',
        'data': 'data',
        'movemap': 'moveMap',
        'transit': 'jquery.transit.min'
    }
});

require(['jquery', 'tenOnTen', 'transit'], function ($, TenOnTen) {
    //console.log(transition)
    var tenOnTen = new TenOnTen({
        appContainer: "#app"
    });
});