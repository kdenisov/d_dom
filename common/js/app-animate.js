'use strict';
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
    .animation('.room-equipment-panel', function() {
        return {
            beforeRemoveClass: function(element, className, done) {
                if (className === 'ng-hide') {
                    element.css('left', '-300px');
                    done();
                }

                return animationCancelHandler(element);
            },
            removeClass: function(element, className, done) {
                if (className === 'ng-hide') {
                    element.animate({ left: '56px' }, animationDuration, done);
                }

                return animationCancelHandler(element);
            },
            beforeAddClass: function(element, className, done) {
                if (className === 'ng-hide') {
                    element.animate({ left: '-300px' }, animationDuration, done);
                }

                return animationCancelHandler(element);
            }
        };
    })
    .animation('.room-equipment', function() {
        return {
            enter: function(item, done) {
                $(item).css({ opacity: 0 });
                $(item).animate({ opacity: 1 }, animationDuration, done);
                return animationCancelHandler(item);
            },

            leave: function(item, done) {
                $(item).css({ opacity: 1 });
                $(item).animate({ opacity: 0 }, animationDuration, done);
                return animationCancelHandler(item);
            }
        };
    })
    .animation('.tree-view', function() {
        return {
            enter: function (item, done) {
                item = $(item);
                item.css({top: '-100%'});
                item.animate({ top: 0 }, animationDuration, done);
                return animationCancelHandler(item);
            },

            leave: function(item, done) {
                item = $(item);
                item.css({ top: 0 });
                item.animate({ top: '-100%' }, animationDuration, done);
                return animationCancelHandler(item);
            }
        }
    });


function animationCancelHandler(item) {
    return function (cancelled) {
        if (!cancelled) {
            return;
        }

        $(item).stop();
    };
}

var animationDuration = 300;