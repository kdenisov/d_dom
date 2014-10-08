'use strict';
//animation effects
(function() {
    var animationDuration = 300;

    function animationCancelHandler(item) {
        return function (cancelled) {
            if (!cancelled) {
                return;
            }

            $(item).stop();
        };
    }

    function getEnterLeaveAnimation(cssShow, cssHide) {
        cssShow = cssShow ? cssShow : { opacity: 1 };
        cssHide = cssHide ? cssHide : { opacity: 0 };
        return {
            enter: function (item, done) {
                item = $(item);
                item.css(cssHide);
                item.animate(cssShow, animationDuration, done);
                return animationCancelHandler(item);
            },

            leave: function (item, done) {
                item = $(item);
                item.css(cssShow);
                item.animate(cssHide, animationDuration, done);

                return animationCancelHandler(item);
            }
        };
    }

    function getAddRemoveClassAnimation(cssShow, cssHide, cssClassName) {
        cssClassName = cssClassName ? cssClassName : 'ng-hide';
        cssShow = cssShow ? cssShow : { opacity: 1 };
        cssHide = cssHide ? cssHide : { opacity: 0 };
        return {
            removeClass: function (item, className, done) {
                if (className !== cssClassName) {
                    return animationCancelHandler(item);
                }

                item = $(item);
                item.css(cssHide);
                item.animate(cssShow, animationDuration, done);
                return animationCancelHandler(item);
            },

            beforeAddClass: function (item, className, done) {
                if (className !== cssClassName) {
                    return animationCancelHandler(item);
                }

                item = $(item);
                item.css(cssShow);
                item.animate(cssHide, animationDuration, done);
                return animationCancelHandler(item);
            }
        };
    }

    angular.module('appConfigurator')
        .animation('.content-view-enter-leave', function() {
            var cssShow = { opacity: 1 };
            var cssHide = { opacity: 0 };
            return {
                enter: function (item, done) {
                    item = $(item);
                    item.css(cssHide);
                    item.animate(cssShow, animationDuration, done);
                    return animationCancelHandler(item);
                },

                leave: function (item, done) {
                    item = $(item);
                    item.css(cssShow);
                    var house = item.find('.house-enter-leave');
                    if (house.length > 0) {
                        house.animate({ opacity: 0, width: 0, height: 0, marginLeft: 0, marginTop: 0 }, animationDuration, function() {});
                    }

                    item.animate(cssHide, animationDuration, done);

                    return animationCancelHandler(item);
                }
            };
        })
        .animation('.house-enter-leave', function() {
            return getEnterLeaveAnimation();
        })
        .animation('.room-equipment-panel', function() {
            var cssShow = { left: '56px' };
            var cssHide = { left: '-300px' };
            return getAddRemoveClassAnimation(cssShow, cssHide, 'ng-hide');
        })
        .animation('.room-equipment', function() {
            return getEnterLeaveAnimation();
        })
        .animation('.tree-view', function() {
            var cssHide = { top: '-100%' };
            var cssShow = { top: 0 };
            return getAddRemoveClassAnimation(cssShow, cssHide, 'ng-hide');
        })
        .animation('.aside-enter-leave', function() {
            var cssHide = { left: '-100%' };
            var cssShow = { left: 0 };
            return getEnterLeaveAnimation(cssShow, cssHide);
        })
        .animation('.menu-aside-popup', function() {
            var animationDuration = window.animationDuration / 2;
            return {
                removeClass: function(item, className, done) {
                    if (className !== 'ng-hide') {
                        return animationCancelHandler(item);
                    }

                    item = $(item);
                    var shade = $('.menu-aside-popup-shade');
                    item.css({ width: 0 });
                    shade.css({ opacity: 0 });
                    shade.animate({ opacity: 1 }, animationDuration, function() {
                        item.animate({ width: 203 }, animationDuration, done);
                    });

                    return animationCancelHandler(item);
                },

                beforeAddClass: function(item, className, done) {
                    if (className !== 'ng-hide') {
                        return animationCancelHandler(item);
                    }

                    item = $(item);
                    var shade = $('.menu-aside-popup-shade');
                    item.css({ width: 203 });
                    shade.css({ opacity: 1 });
                    item.animate({ width: 0 }, animationDuration, function() {
                        shade.animate({ opacity: 0 }, animationDuration, done);
                    });

                    return animationCancelHandler(item);
                }
            };
        })
        .animation('.info-panel-container', function() {
            var cssShow = { width: 336 };
            var cssHide = { width: 0 };

            return getAddRemoveClassAnimation(cssShow, cssHide, 'ng-hide');
        })
        .animation('.info-panel', function() {
            return getAddRemoveClassAnimation();
        });

})();