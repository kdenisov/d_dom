'use strict';

// Router
appConfigurator
    .factory('pageInfo', function () {
        //this factory can be used to determine current section and opened page
        var info = this;

        info.allSections = {
            configurator: 'configurator',
            summary: 'summary',
            account: 'account',
        };

        info.allPages = {
            cottage: 'cottage',
            levels: 'levels',
            rooms: 'rooms',
            collector: 'collector',
            summary: 'summary',
            account: 'account',
        };

        info.page = info.allPages.cottage;
        info.section = info.allSections.configurator;
        info.set = function(section, page) {
            info.section = section;
            info.page = page;
        };

        return info;
    })
    
    .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
        .when('/room', '/room/1/1')
        .when('/level', '/level/1')
        .when('/collector', '/collector/1/1')
        .when('/summary/5', '/summary/5')
        .when('/summary', '/summary/1')
        .when('/account', '/account/1')
        .otherwise('/');
    
    $stateProvider
        .state('cottage', {
            url: '/',
            views: {
                'sidebar': { templateUrl: 'common/views/cottage_sidebar.htm', controller: 'CottageCtrl' },
                'content': { templateUrl: 'common/views/cottage_content.htm', controller: 'CottageCtrl' }
            },
            resolve: {
                pageState: function(pageInfo) {
                    pageInfo.set(pageInfo.allSections.configurator, pageInfo.allPages.cottage);
                }
            }
        })
        .state('level', {
            url: '/level/:levelId',
            views: {
                'sidebar': { templateUrl: 'common/views/level_sidebar.htm', controller: 'LevelCollectorsCtrl' },
                'content': { templateUrl: 'common/views/level_content.htm', controller: 'LevelCtrl' }
            },
            resolve: {
                pageState: function (pageInfo) {
                    pageInfo.set(pageInfo.allSections.configurator, pageInfo.allPages.levels);
                }
            }
        })
        .state('room', {
            url: '/room/:levelId/:roomId',
            views: {
                'sidebar': { templateUrl: 'common/views/room_sidebar.htm', controller: 'RoomCtrl' },
                'content': { templateUrl: 'common/views/room_content.htm', controller: 'RoomCtrl' }
            },
            resolve: {
                pageState: function (pageInfo) {
                    pageInfo.set(pageInfo.allSections.configurator, pageInfo.allPages.rooms);
                }
            }
        })
        .state('boiler', {
            url: '/boiler',
            views: {
                'sidebar': { templateUrl: 'common/views/boiler_sidebar.htm', controller: 'BoilerCtrl' },
                'content': { templateUrl: 'common/views/boiler_content.htm', controller: 'BoilerCtrl' }
            },
            resolve: {
                pageState: function (pageInfo) {
                    pageInfo.set(pageInfo.allSections.configurator, pageInfo.allPages.rooms);
                }
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
            },
            resolve: {
                pageState: function (pageInfo) {
                    pageInfo.set(pageInfo.allSections.configurator, pageInfo.allPages.collector);
                }
            }
        })
        .state('loadConfig', {
            url: '/load/:idLoad',
            views: {
                /*'sidebar': { templateUrl: 'common/views/restore_sidebar.htm', controller: 'RestoreCtrl' },*/
                'content': { templateUrl: 'common/views/restore_content.htm', controller: 'RestoreCtrl' }
            }
        })
        .state('summary', {
            url: '/summary/:page',
            views: {
                'sidebar': { templateUrl: 'common/views/summary_sidebar.htm', controller: 'SummaryCtrl' },
                'content': { templateUrl: 'common/views/summary_content.htm', controller: 'SummaryCtrl' }
            },
            resolve: {
                pageState: function (pageInfo) {
                    pageInfo.set(pageInfo.allSections.summary, pageInfo.allPages.summary);
                }
            }
        })
        .state('product', {
            url: '/summary/:page/:itemCode',
            views: {
                'sidebar': { templateUrl: 'common/views/summary_sidebar.htm', controller: 'SummaryCtrl' },
                'content': { templateUrl: 'common/views/summary_content.htm', controller: 'SummaryCtrl' }
            },
            resolve: {
                pageState: function (pageInfo) {
                    pageInfo.set(pageInfo.allSections.summary, pageInfo.allPages.summary);
                }
            }
        })
        .state('account', {
            url: '/account/:tab',
            views: {
                'content': { templateUrl: 'common/views/account.htm', controller: 'AccountCtrl' }
            },
            resolve: {
                pageState: function (pageInfo) {
                    pageInfo.set(pageInfo.allSections.account, pageInfo.allPages.account);
                }
            }
        });
});
