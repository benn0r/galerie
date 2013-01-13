(function($) {

	var methods = {
		init: function(options) {
			var settings = $.extend({
					speed: 1000,
					width: 700,
					height: 300,
					imagetag: 'li',

					image: {
						width: 500,
						opacity: 1,
						selector: 'bengal-active',
					},
					before: {
						width: 435,
						height: 260,
						opacity: .5,
						selector: 'bengal-before'
					},
					after: {
						width: 435,
						height: 260,
						opacity: .5,
						selector: 'bengal-after'
					}
				}, options);

			this.data('settings', settings);

			var images = this.find(settings.imagetag);
			var image = $(images.get(Math.round(images.size() / 2)));

			image.prev().addClass(settings.before.selector);
			image.addClass(settings.image.selector);
			image.next().addClass(settings.after.selector);
		},

		rotate: function(callback) {
			var settings = this.data('settings'),
				elem = this,
				before = this.find('.' + settings.before.selector),
				active = this.find('.' + settings.image.selector),
	            after = this.find('.' + settings.after.selector),
	            next = after.next(settings.imagetag),

	            spacing = (settings.width - settings.image.width) / 2,
	            spacingvert = (settings.height - settings.before.height) / 2;

	    	if (!next.size()) {
	    		// no more images left, restart with first image
	            next = this.find(settings.imagetag).first();
	        }

	        if (!before.size() || !active.size() || !after.size() || !next.size()) {
	        	// i can't work with this, something is missing here
	        	$.error('jQuery.bengal misses something');
	        }

	        // animation for next element to active
	        after.animate({
                    opacity: settings.image.opacity,
                    top: 0,
                    bottom: 0,
                    left: spacing,
                    right: spacing,
                    height: settings.height
                }, settings.speed);

	        // animation for active element to prev
	        active.animate({
                    opacity: settings.before.opacity,
                    top: spacingvert,
                    bottom: spacingvert,
                    left: 0,
                    right: settings.width - settings.before.width,
                    height: settings.before.height
                }, settings.speed);

	        // animation for prev element to hidden
	        before.animate({
                    opacity: 0,
                    top: spacingvert,
                    bottom: spacingvert,
                    left: (settings.width - settings.before.width) / 2,
                    right: (settings.width - settings.before.width) / 2
                }, settings.speed);

	        // animation for hidden element to next
	        next.show().animate({
                    opacity: settings.after.opacity,
                    top: spacingvert,
                    bottom: spacingvert,
                    left: settings.width - settings.after.width,
                    right: 0,
                    height: settings.after.height
                }, settings.speed);

	        setTimeout(function() {
                    active.css('z-index', 10);
                    after.css('z-index', 20);
                }, settings.speed / 2);

	        setTimeout(function() {
	        		// set new classes and remove the old
                    before
                        .removeClass(settings.before.selector);
                    active
                        .removeClass(settings.image.selector)
                        .addClass(settings.before.selector);
                    after
                        .removeClass(settings.after.selector)
                        .addClass(settings.image.selector);
                    next
                        .addClass(settings.after.selector);

                    // clean css from animations
                    elem.find(settings.imagetag)
                        .css('opacity', '')
                        .css('height', '')
                        .css('z-index', '')
                        .css('display', '');

                	if (settings.callback) {
                		settings.callback();
                	}

                	if (callback) {
                		callback();
                	}
                }, settings.speed);
		}
	};

	$.fn.bengal = function(method) {
		if (methods[method]) {
      		return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    	} else if (typeof method === 'object' || !method) {
      		return methods.init.apply(this, arguments);
    	} else {
			$.error('Method ' +  method + ' does not exist on jQuery.bengal');
    	}
	};

})(jQuery);