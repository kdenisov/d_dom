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
            console.log('fade-in');
            $(item).fadeIn(300, done);
            return cancelHanlder(item);
        },

        leave: function(item, done) {
            console.log('fade-out');
            $(item).fadeOut(300, done);
            return cancelHanlder(item);
        }
    };
});