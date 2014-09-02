'use strict';

// Router

appConfigurator.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider
		.when('/room', '/room/1/1')
		.when('/level', '/level/1')
		.when('/collector', '/collector/1/1')
        .when('/summary/5', '/summary/5')
        .when('/summary', '/summary/1')
		.otherwise('/');

	$stateProvider
		.state('cottage', {
			url: '/',
			views: {
				'sidebar': { templateUrl: 'common/views/cottage_sidebar.htm', controller: 'CottageCtrl' },
				'content': { templateUrl: 'common/views/cottage_content.htm', controller: 'CottageCtrl' }
			}
		})
		.state('level', {
			url: '/level/:levelId',
			views: {
				'sidebar': { templateUrl: 'common/views/level_sidebar.htm', controller: 'LevelCtrl' },
				'content': { templateUrl: 'common/views/level_content.htm', controller: 'LevelCtrl' }
			}
		})
		/*.state('room', {
			abstract: true,
			url: '/room/1/1',
			views: {
				'sidebar': { templateUrl: 'common/views/room_sidebar.htm', controller: 'RoomCtrl' },
				'content': { templateUrl: 'common/views/room_content.htm', controller: 'RoomCtrl' }
			}
		})*/
		.state('room', {
			url: '/room/:levelId/:roomId',
			views: {
				'sidebar': { templateUrl: 'common/views/room_sidebar.htm', controller: 'RoomCtrl' },
				'content': { templateUrl: 'common/views/room_content.htm', controller: 'RoomCtrl' }
			}
		})
		.state('boiler', {
			url: '/boiler',
			views: {
				'sidebar': { templateUrl: 'common/views/boiler_sidebar.htm', controller: 'BoilerCtrl' },
				'content': { templateUrl: 'common/views/boiler_content.htm', controller: 'BoilerCtrl' }
			}
		})
		/*.state('collectors', {
			url: '/collectors/',
			views: {
				'sidebar': { templateUrl: 'common/views/collector_sidebar.htm', controller: 'CollectorCtrl' },
				'content': { templateUrl: 'common/views/collector_content.htm', controller: 'CollectorCtrl' }
			}
		})*/
		.state('collector', {
			url: '/collector/:levelId/:collectorId',
			views: {
				'sidebar': { templateUrl: 'common/views/collector_sidebar.htm', controller: 'CollectorCtrl' },
				'content': { templateUrl: 'common/views/collector_content.htm', controller: 'CollectorCtrl' }
			}
		})
		.state('summary', {
		    url: '/summary/:page',
		    views: {
		        'sidebar': { templateUrl: 'common/views/summary_sidebar.htm', controller: 'SummaryCtrl' },
		        'content': { templateUrl: 'common/views/summary_content.htm', controller: 'SummaryCtrl' }
		    }
		})
        .state('product', {
            url: '/summary/:page/:itemCode',
            views: {
                'sidebar': { templateUrl: 'common/views/summary_sidebar.htm', controller: 'SummaryCtrl' },
                'content': { templateUrl: 'common/views/summary_content.htm', controller: 'SummaryCtrl' }
            }
        })
});
