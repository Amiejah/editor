(function($){
    if(window.CCEDITOR && window.CCEDITOR.dom) return;
    $.fn.CCEDITOR = function(options) {
        var $this = $(this).hide();
        var settings = $.extend({
            height: 250,
            width: 320
        }, options);

        var i = 0;
        // Hide the textarea first

        return this.each(function(){

            var CCEDITOR = $('<iframe/>', {
                frameborder: 0,
                css: {
                    width: settings.width,
                    height: settings.height
                },
                class: 'cce_wysiwyg_frame cce_reset cce'
            });

            $(CCEDITOR).insertAfter(this);
        });


    }
}(jQuery));