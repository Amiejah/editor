<!DOCTYPE html>
<html>
<head>
    <title>Editor</title>
    <link rel="stylesheet" href="css/base.css"/>
    <link rel="stylesheet" href="css/font-awesome.min.css"/>
    <link rel="stylesheet" href="css/cceditor.css"/>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script src="js/jquery.form.js"></script>
    <script src="js/cceditor.js"></script>
    <script src="js/control.js"></script>
</head>
<body>
    <section class="wrapper" style="width:420px;margin: 25px auto 0px;">
        <form name="NewThreadForm" action="post.php" method="post">
            <div class="toolbar-skin default">
                <textarea name="NewThreadForm[pagetext]" class="className">This is a test to test bla bla bla</textarea>
            </div>

            <button type="submit">Save</button>
        </form>

    </section>
</body>
</html>