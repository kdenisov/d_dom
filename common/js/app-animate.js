﻿'use strict';
//animation effects
angular.module('appConfigurator')
    .animation('.house-enter-leave', function() {
        return {
            enter: function(item, done) {
                item = $(item);
                item.hide();
                item.fadeIn(animationDuration, done);
                return animationCancelHandler(item);
            },

            leave: function(item, done) {
                $(item).fadeOut(animationDuration, done);
                return animationCancelHandler(item);
            }
        };
    })
    .animation('.room-equipment-panel', function () {
        var cssShow = { left: '56px' };
        var cssHide = { left: '-300px' };
        return {
            beforeRemoveClass: function(element, className, done) {
                if (className === 'ng-hide') {
                    element.css(cssHide);
                    done();
                }

                return animationCancelHandler(element);
            },
            removeClass: function(element, className, done) {
                if (className === 'ng-hide') {
                    element.animate(cssShow, animationDuration, done);
                }

                return animationCancelHandler(element);
            },
            beforeAddClass: function(element, className, done) {
                if (className === 'ng-hide') {
                    element.animate(cssHide, animationDuration, done);
                }

                return animationCancelHandler(element);
            }
        };
    })
    .animation('.room-equipment', function () {
        var cssShow = { opacity: 1 };
        var cssHide = { opacity: 0 };
        return {
            enter: function(item, done) {
                $(item).css(cssHide);
                $(item).animate(cssShow, animationDuration, done);
                return animationCancelHandler(item);
            },

            leave: function(item, done) {
                $(item).css(cssShow);
                $(item).animate(cssHide, animationDuration, done);
                return animationCancelHandler(item);
            }
        };
    })
    .animation('.tree-view', function () {
        var cssHide = { top: '-100%' };
        var cssShow = { top: 0 };
        return {
            removeClass: function(item, className, done) {
                if (className !== 'ng-hide') {
                    return animationCancelHandler(item);
                }

                item = $(item);
                item.css(cssHide);
                item.animate(cssShow, animationDuration, done);
                return animationCancelHandler(item);
            },

            beforeAddClass: function(item, className, done) {
                if (className !== 'ng-hide') {
                    return animationCancelHandler(item);
                }

                item = $(item);
                item.css(cssShow);
                item.animate(cssHide, animationDuration, done);
                return animationCancelHandler(item);
            }
        };
    })
    .animation('.aside-enter-leave', function() {
        return {
            enter: function(item, done) {
                item = $(item);
                item.css({ left: '-100%' });
                item.animate({ left: 0 }, animationDuration, done);
                return animationCancelHandler(item);
            },

            leave: function(item, done) {
                item = $(item);
                item.css({ left: 0 });
                item.animate({ left: '-100%' }, animationDuration, done);
                return animationCancelHandler(item);
            }
        };
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

        return {
            removeClass: function(item, className, done) {
                if (className !== 'ng-hide') {
                    return animationCancelHandler(item);
                }

                item = $(item);
                item.css(cssHide);
                item.animate(cssShow, animationDuration, function() {
                    done && done();
                });
                return animationCancelHandler(item);
            },

            beforeAddClass: function(item, className, done) {
                if (className !== 'ng-hide') {
                    return animationCancelHandler(item);
                }

                item = $(item);
                item.css(cssShow);
                item.animate(cssHide, animationDuration, function() {
                    done && done();
                });
                return animationCancelHandler(item);
            }
        };
    })
    .animation('.info-panel', function() {
        var cssShow = { opacity: 1 };
        var cssHide = { opacity: 0 };

        return {
            removeClass: function(item, className, done) {
                if (className !== 'ng-hide') {
                    return animationCancelHandler(item);
                }

                item = $(item);
                item.css(cssHide);
                item.animate(cssShow, animationDuration, function() {
                    done && done();
                });
                return animationCancelHandler(item);
            },

            beforeAddClass: function(item, className, done) {
                if (className !== 'ng-hide') {
                    return animationCancelHandler(item);
                }

                item = $(item);
                item.css(cssShow);
                item.animate(cssHide, animationDuration, function() {
                    done && done();
                });
                return animationCancelHandler(item);
            }
        };
    });


function animationCancelHandler(item) {
    return function (cancelled) {
        if (!cancelled) {
            return;
        }

        $(item).stop();
    };
}

window.animationDuration = 300;