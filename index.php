<?php
  session_start();
  $_SESSION['isLoggedIn'] = true;
  $_SESSION['moxiemanager.filesystem.rootpath'] = $_SERVER["DOCUMENT_ROOT"].'/vpe/uploads/images';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">


    <title>Theme Template for Bootstrap</title>

    <!-- Bootstrap core CSS -->
    <link href="vendors/bootstrap-3.2.0/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap theme -->
    <link href="vendors/bootstrap-3.2.0/css/bootstrap-theme.min.css" rel="stylesheet">
    <link href="vendors/bootstrap-3.2.0/css/docs.min.css" rel="stylesheet">
    <link href="vendors/bootstrap-dialog/css/bootstrap-dialog.min.css" rel="stylesheet">
    <style>
        .modal-dialog {
            width: 1042px;
        }
        .bootstrap-dialog .modal-header.bootstrap-dialog-draggable {
            cursor: move;
        }
    </style>



    <!-- Custom styles for this template -->
   <!-- <link href="theme.css" rel="stylesheet">-->


    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

    <!-- Bootstrap core JavaScript
================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->

    <script src="vendors/jquery-2.1.1.min.js"></script>
    <script src="vendors/bootstrap-3.2.0/js/bootstrap.min.js"></script>

    <script src="vendors/bootstrap-dialog/js/bootstrap-dialog.min.js"></script>


    <script src="vendors/tinymce/js/tinymce/tinymce.min.js"></script>
    <!--<script src="vendors/tinymce/js/tinymce/jquery.tinymce.min.js"></script>-->
    <script src="vendors/tinymce/js/tinymce/langs/ru.js"></script>

    <script src="js/vpe.js"></script>



</head>

<body role="document">

<!-- Fixed navbar -->
<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">Редактор страницы</a>
        </div>
        <div class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
                <li class="active"><a href="#" docs>Документация</a></li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">Редактировать сраницы<span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <?php
                        $files = scandir(dirname(__FILENAME__).'/pages');
                        foreach ($files as &$value) {
                          if ($value !== '.' && $value !== '..') {
                             echo '<li class="divider"></li>';
                             echo '<li class="dropdown-header">'.$value.'</li>';
                             $files2 = scandir(dirname(__FILENAME__).'/pages/'.$value);
                             foreach ($files2 as &$value2) {
                               if (stripos($value2, '.html') !== FALSE) {
                                 echo '<li><a href="#" page="pages/'.$value.'/'.$value2.'">'.$value2.'</a></li>';
                               }
                             }
                          }
                        }
                        ?>
                    </ul>
                </li>
            </ul>
        </div><!--/.nav-collapse -->
    </div>
</div>

<div class="container theme-showcase" role="main">
   <div id="docs" style="/*margin-top: 100px;*/">
     <iframe src="docs/index.html" scrolling="auto" height="auto" seamless="seamless" style="display: block; border: medium none; width: 100%; height: 100%; min-height: 2000px; padding: 0px; margin: 0px; margin-top: 60px;"></iframe>
   </div>
   <div id="editPage">
   </div>
</div> <!-- /container -->

<style type="text/css">


</style>

<script language="JavaScript">
   jQuery(document).ready(function () {
      jQuery('a[docs]').on('click', function () {
        jQuery('#docs').show();
        jQuery('#editPage').hide();
      });
      jQuery('a[page]').on('click', function () {
         //console.log(jQuery(this).attr('page'));
         jQuery('#docs').hide();
         jQuery('#editPage').show();
         var vpe = new Vpe(
              jQuery('#editPage'),
              jQuery(this).attr('page'), {
                  onAddContent: function (pageURL, blockID, content, afterAdd) {
                      console.log(pageURL);
                      console.log(blockID);
                      console.log(content);
                      afterAdd(content, blockID, -100);
                  },
                  onEditContent: function (itemID, content, afterEdit) {
                      console.log(itemID);
                      console.log(content);
                      afterEdit(content);
                  },
                  onDeleteContent: function (itemID, afterDelete) {
                      console.log(itemID);
                      afterDelete();
                  },
                  onReOrderContent: function (items) {
                      console.log(items);
                  }
              }
          );

      });
   });
</script>



</body>
</html>


