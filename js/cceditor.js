(function($){
    $.fn.CCEDITOR = function(options, css_url) {
        var settings = $.extend({
            height: 250,
            width: 320,
            inputName: 'NewThreadTopic'
        }, options);

        var i = 0;
        if(document.designMode || document.contentEditable) {
            return this.each(function(){
                var $this = $(this);
                enableDesignMode($this);
            });
        }


        function formatText(iframe, command, option) {
            iframe.contentWindow.focus();
            try {
                iframe.contentWindow.document.execCommand(command, false, option);
            } catch(e) {
                console.log(e);
            }
            iframe.contentWindow.focus();
        }

        // Check if the design mode is enabled.
        // If not set please set it.
        function tryEnableDesignMode(iframe, doc, callback){
            try {
                iframe.contentWindow.document.open();
                iframe.contentWindow.document.write(doc);
                iframe.contentWindow.document.close();
            } catch (error) {
                console.log(error);
            }

            if(document.contentEditable) {
                iframe.contentWindow.document.designMode = "on";
                callback();
                return true;
            } else if(document.designMode != null) {
                try {
                    iframe.contentWindow.document.designMode = "on";
                    callback();
                    return true;
                } catch(error) {
                    console.log(error);
                }
            }

            setTimeout(function(){
                tryEnableDesignMode(iframe, doc, callback);
            }, 250);
            return false;
        }

        function enableDesignMode(textarea) {
            // Set the iframe settings first
            var iframe = document.createElement('iframe');
            iframe.frameBorder = 0;
            iframe.frameMargin = 0;
            iframe.framePadding = 0;
            iframe.height = settings.height;
            iframe.width = settings.width;

            // Check if the textarea contains any classes, id's or name value
            // Use these values to set them on the iframe
            if(textarea.attr('class')){
                iframe.className = textarea.attr('class');
            } else if(textarea.attr('id')) {
                iframe.id = textarea.attr('id');
            } else if(textarea.attr('name')) {
                iframe.id = textarea.attr('name');
            }

            // Add the iframe
            textarea.after(iframe);


            var css = "";
            if(css_url) {
                var css = "<link type='text/css' rel='stylesheet' href='" + css_url + "'/>";
            }

            var content = textarea.val();
            if($.trim(content) == '') {
                content = '<br>';
            }
            var doc = '<html><head>' + css + '</head><body class="framebody">' + content + '</body></html>';
            tryEnableDesignMode(iframe, doc, function() {
                $('#toolbar-' + iframe.title).remove();
                $(iframe).before(toolbar(iframe));
                textarea.remove();
            });
        }

        // Function to disable the design mode
        function disableDesignMode(iframe, submit) {

            var content = iframe.contentWindow.document.getElementsByTagName("body")[0].innerHTML;

            if(submit == true) {
                var textarea = $('<input type="hidden" name="' + settings.inputName + '"/>');
            } else {
                var textarea = $('<textarea cols="40" rows="10" name="' + settings.inputName + '"></textarea>');
            }

            textarea.val(content);

            // Get the input data
            t = textarea.get(0);


            if(iframe.className) {
                t.classNam = iframe.className;
            } else if(iframe.id) {
                t.id = iframe.id;
            } else if(iframe.title) {
                t.name = iframe.title;
            }

            // Add the textarea element before the iframe
            $(iframe).before(textarea);

            if(submit != true) {
                $(iframe).remove();
            }

            return textarea;
        }

        function toolbar(iframe) {
            var tb = $('<div class="toolbar">toolbar</div>');

            // The submit will be renderd before it's sent
            $(iframe).parents('form').submit(function(e){
                disableDesignMode(iframe, true);
            });

            return tb;
        }

    }
}(jQuery));