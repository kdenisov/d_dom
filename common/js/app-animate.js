'use strict';
//animation effects

appConfigurator.animation('.animate-enter-leave', function () {
    var cancelHanlder = function(item) {
        return function(cancelled) {
            if (!cancelled) {
                return;
            }

            $(item).stop();
        };
    };

    return {
        enter: function (item, done) {
            $(item).hide();
            $(item).fadeIn(300, done);
            return cancelHanlder(item);
        },

        leave: function(item, done) {
            $(item).fadeOut(300, done);
            return cancelHanlder(item);
        }
    };
});

appConfigurator.animation('.room-equipment', function () {
    var cancelHanlder = function (item) {
        return function (cancelled) {
            if (!cancelled) {
                return;
            }

            $(item).stop();
        };
    };

    return {
        enter: function (item, done) {
            $(item).css({ left: '-256px', opacity: 0 });
            $(item).animate({ left: '56px', opacity: 1 }, 300);
            return cancelHanlder(item);
        },

        leave: function (item, done) {
            $(item).css({ left: '56px', opacity: 1 });
            $(item).animate({ left: '-256px', opacity: 0 }, 300);
            return cancelHanlder(item);
        }
    };
});