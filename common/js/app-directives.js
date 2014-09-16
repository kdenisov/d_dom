angular.module('appConfigurator')
    .directive('ngFocus', function() {
        var FOCUS_CLASS = "ng-focused";
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {
                ctrl.$focused = false;
                element.bind('focus', function(evt) {
                    element.addClass(FOCUS_CLASS);
                    scope.$apply(function() { ctrl.$focused = true; });
                }).bind('blur', function(evt) {
                    element.removeClass(FOCUS_CLASS);
                    scope.$apply(function() { ctrl.$focused = false; });
                });
            }
        };
    })
    .directive('ngRouteLoader', function($rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                //check this value in scope to get the loading state
                $rootScope.isLoadingRoute = false;
                $rootScope.$on('$routeChangeStart', function() {
                    $rootScope.isLoadingRoute = true;
                    element.data('preloader-store', element.html());
                    element.html('');
                    element.css('background', 'url("common/img/loader.gif") center center no-repeat');
                });

                $rootScope.$on('$routeChangeSuccess', function() {
                    $rootScope.isLoadingRoute = false;
                    element.html(element.data('preloader-store'));
                    element.css('background-image', 'none');
                });
            }
        };
    });