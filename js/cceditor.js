(function($){
    $.fn.CCEDITOR = function(options, css_url) {
        var settings = $.extend({
            height: 250,
            width: 320,
            inputName: 'NewThreadTopic',
            toolbarPosition: 'top',
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

            $('.toolbar-icon').removeClass('toolbar-selected');
            $('.' + option).addClass('toolbar-selected');

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
            if(textarea.attr('class'))
                iframe.className = textarea.attr('class');
            if(textarea.attr('id'))
                iframe.id = textarea.attr('id');
            if(textarea.attr('name'))
                iframe.title= textarea.attr('name');


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
                var textarea = $('<input type="hidden"/>');
            } else {
                var textarea = $('<textarea cols="40" rows="10"></textarea>');
            }

            textarea.val(content);

            // Get the input data
            t = textarea.get(0);

            if(iframe.className)
                t.classNam = iframe.className;
            if(iframe.id)
                t.id = iframe.id;
            if(iframe.title)
                t.name = iframe.title;


            // Add the textarea element before the iframe
            $(iframe).before(textarea);

            if(submit != true) {
                $(iframe).remove();
            }

            return textarea;
        }
        function toolbar(iframe) {
            var tb = $('<section class="toolbar">\
                            <ul class="styles basic">\
                                <li class="bold toolbar-icon"><i class="fa fa-bold"></i></li>\
                                <li class="italic toolbar-icon"><i class="fa fa-italic"></i></li>\
                                <li class="underline toolbar-icon"><i class="fa fa-underline"></i></li>\
                            </ul>\
                            <ul class="toolbar">\
                                <li class="image attachment upload"><i class="fa fa-camera"></i></li>\
                            </ul>\
                            <div class="clear"></div>\
                        </section>');

            // Bold function
            $('.bold', tb).on('click', function(){
                formatText(iframe, 'bold', 'bold');
                return false;
            });

            // Italic function
            $('.italic', tb).on('click', function(){
                formatText(iframe, 'italic', 'italic');
                return false;
            });

            // Underline function
            $('.underline', tb).on('click', function(){
                formatText(iframe, 'underline', 'underline');
                return false;
            });

            $('.upload', tb).on('click', function() {
                imageAttachment(iframe);
                $(this).addClass('processing');
                return false;
            });

            // The submit will be renderd before it's sent
            $(iframe).parents('form').submit(function(e){
                disableDesignMode(iframe, true);
            });

            return tb;
        }

        // Creat the image atachment
        // Append the upload controller
        function imageAttachment(iframe){
            var imageUploader = $('<div class="imageAttachment attachment"><form enctype="multipart/form-data" name="' + iframe.title + '" action="upload.php" method="POST"><div class="attachmentFile"><label class="imageAttachmentUpload"><input type="file" name="image" accept="image/*" /></label><div class="attachmentInput"></div><div class="attachmentSubmit">Browse</div></div></form></div>'),
                processBar = $('.processBar');

            // Find the toolbar
            if(settings.toolbarPosition == 'top') {
                var toolbar = $(iframe).prev('.toolbar');
            } else {
                var toolbar = $(iframe).next('.toolbar');
            }

            $(imageUploader).insertAfter(toolbar).slideDown();


            // Capture the onchange Event
            $('input:file').on('change', function(){
                $('.imageAttachment form').ajaxSubmit({
                    beforeSend: function(){

                        // Create the upload progress before submitting
                        var process = $('<div class="processHolder"><div class="process-status"></div><div class="process"><span class="processBar" style="green"></span></div></div>');

                        $(process).insertAfter(imageUploader);

                        var percentVal = '0%',
                            processBar = '.processBar',
                            status = $('.process-status');


                        // Set it to 0 first
                        $(processBar).width(percentVal);
                    },
                    uploadProgress: function(event, position, total, percentComplete){

                        var percentVal = percentComplete  + '%';
                        $(processBar).width(percentVal);
                    },
                    success: function(){
                        var percentVal = '100%';
                        $(processBar).width(percentVal);
                    },
                    complete: function(xhr){
                        //status.html(xhr.responseText);
                    }

                });
            });

        }


    }
}(jQuery));