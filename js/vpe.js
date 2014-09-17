// Visual Page Content Editor
/**
 *
 * @param contaner - container for Page Editor
 * @param url      - URL for page
 */
var Vpe = function (contaner, url, options) {
  var self = this;

  this.options = jQuery.extend({

  }, options);

  jQuery(contaner).html('');
  this.iframeContaner = jQuery('<iframe>').appendTo(contaner);
  this.dialog = new MsgDialog();
  this.page = null;
  this.currentBlock = null;
  this.currentItem = null;

  // Toolbar for Edit page block
  this.pageBlockToolbar = jQuery('<div>');
  jQuery(this.pageBlockToolbar).css({
    height:     '30px',
    width:      '32px',
    background: 'grey',
    'border-radius': '5px',
    position:   'absolute',
    opacity: 0.6,
    zIndex       : '999999'


  });


  this.addItemButton = jQuery('<div>');
  jQuery(this.addItemButton).html('+');
  jQuery(this.addItemButton).attr('title', 'Добавить новые содержимое');
  jQuery(this.addItemButton).css({
    height:     '20px',
    width:      '20px',
    border:     'solid white 1px',
    background: 'transparent',
    'border-radius': '5px',
    cursor: 'pointer',
    color: 'white',
    fontSize: '15px',
    'text-align': 'center',
    marginTop: '4px',
    marginLeft: '4px'
  });
  jQuery(this.addItemButton).on('mouseover', function () {
    jQuery(this).css({
      background : 'white',
      color      : 'black'
    });
  });
  jQuery(this.addItemButton).on('mouseout', function () {
    jQuery(this).css({
      background : 'transparent',
      color      : 'white'
    });
  });
  jQuery(this.addItemButton).on('click', function () {
    var content = '';
    if (self.currentBlock !== null && jQuery(self.currentBlock).find('[edit-page-block-item-template]').length > 0) {
      var item = jQuery(jQuery(self.currentBlock).find('[edit-page-block-item-template]')[0]).clone();
      content = jQuery(item).html();
    }
    this.showEditor({
      content: content,
      onOk: function () {
          if (self.currentBlock !== null) {
              var content = tinyMCE.activeEditor.getContent();
              if (typeof(self.options.onAddContent) == 'function') {
                 self.options.onAddContent(self.page.location.href.split('#')[0], jQuery(self.currentBlock).attr('edit-page-block'), content, function (content, blockID, itemID) {
                   self.addContent(content, blockID, itemID);
                   self.addBlockItemHandler();
                 });
              } else {
                self.addContent(content);
                self.addBlockItemHandler();
              }

          }
      }
    });
  }.bind(this));
  this.pageBlockToolbar.append(this.addItemButton);

  // Toolbar for Edit block item
  this.pageBlockItemToolbar = jQuery('<div>');
  jQuery(this.pageBlockItemToolbar).css({
        height          : '30px',
        width           : '110px',
        background      : 'grey',
        'border-radius' : '5px',
        position        : 'absolute',
        opacity         : 0.6

  });
  this.editItemButton = jQuery('<div>');
  jQuery(this.editItemButton).html('E');
  jQuery(this.editItemButton).attr('title', 'Редактировать содержимое');
  jQuery(this.editItemButton).css({
        height:     '20px',
        width:      '20px',
        border:     'solid white 1px',
        background: 'transparent',
        'border-radius': '5px',
        cursor: 'pointer',
        color: 'white',
        fontSize: '15px',
        'text-align': 'center',
        marginTop: '4px',
        marginLeft: '4px',
        display         : 'inline-block'
  });
  jQuery(this.editItemButton).on('mouseover', function () {
        jQuery(this).css({
            background : 'white',
            color      : 'black'
        });
  });
  jQuery(this.editItemButton).on('mouseout', function () {
        jQuery(this).css({
            background : 'transparent',
            color      : 'white'
        });
  });
  jQuery(this.editItemButton).on('click', function () {
    self.currentItem = jQuery(self.pageBlockItemToolbar)[0].currentItem;
    jQuery(self.pageBlockItemToolbar).hide();

    var content = '';
    if (self.currentItem !== null) {
      content = jQuery(self.currentItem).html();
    }
    self.showEditor({
      content: content,
      onOk: function () {
        if (self.currentItem !== null) {
          var content = tinyMCE.activeEditor.getContent();
          if (typeof(self.options.onEditContent) == 'function') {
            self.options.onEditContent(jQuery(self.currentItem).attr('edit-page-block-item'), content, function (content) {
              jQuery(self.currentItem).html('');
              jQuery(self.currentItem).append(content);
            });
          } else {
            jQuery(self.currentItem).html('');
            jQuery(self.currentItem).append(content);
          }
        }
      }
    });

  });
  this.pageBlockItemToolbar.append(this.editItemButton);

  this.deleteItemButton = jQuery('<div>');
  jQuery(this.deleteItemButton).html('-');
  jQuery(this.deleteItemButton).attr('title', 'Удалить содержимое');
  jQuery(this.deleteItemButton).css({
        height:     '20px',
        width:      '20px',
        border:     'solid white 1px',
        background: 'transparent',
        'border-radius': '5px',
        cursor: 'pointer',
        color: 'white',
        fontSize: '15px',
        'text-align': 'center',
        marginTop: '4px',
        marginLeft: '4px',
        display         : 'inline-block'
  });
  jQuery(this.deleteItemButton).on('mouseover', function () {
        jQuery(this).css({
            background : 'white',
            color      : 'black'
        });
  });
  jQuery(this.deleteItemButton).on('mouseout', function () {
        jQuery(this).css({
            background : 'transparent',
            color      : 'white'
        });
  });
  jQuery(this.deleteItemButton).on('click', function () {
    self.currentItem = jQuery(self.pageBlockItemToolbar)[0].currentItem;
    jQuery(self.pageBlockItemToolbar).hide();

    if (confirm('У далить содержимое?')) {
      if (typeof(self.options.onDeleteContent) == 'function') {
        self.options.onDeleteContent(jQuery(self.currentItem).attr('edit-page-block-item'), function () {
          jQuery(self.currentItem).remove();
          self.currentItem = null;
          jQuery(self.pageBlockItemToolbar).hide();
        });
      } else {
        jQuery(self.currentItem).remove();
        self.currentItem = null;
        jQuery(self.pageBlockItemToolbar).hide();
      }


    }
  });
  this.pageBlockItemToolbar.append(this.deleteItemButton);

  this.upItemButton = jQuery('<div>');
  jQuery(this.upItemButton).html('&uarr;');
  jQuery(this.upItemButton).attr('title', 'Переместить вверх содержимое');
  jQuery(this.upItemButton).css({
        height:     '20px',
        width:      '20px',
        border:     'solid white 1px',
        background: 'transparent',
        'border-radius': '5px',
        cursor: 'pointer',
        color: 'white',
        fontSize: '15px',
        'text-align': 'center',
        marginTop: '4px',
        marginLeft: '4px',
        display         : 'inline-block'
  });
  jQuery(this.upItemButton).on('mouseover', function () {
        jQuery(this).css({
            background : 'white',
            color      : 'black'
        });
  });
  jQuery(this.upItemButton).on('mouseout', function () {
        jQuery(this).css({
            background : 'transparent',
            color      : 'white'
        });
  });
  jQuery(this.upItemButton).on('click', function () {
    self.currentItem = jQuery(self.pageBlockItemToolbar)[0].currentItem;
    jQuery(self.pageBlockItemToolbar).hide();

    var rootBlock = jQuery(self.currentItem).closest('[edit-page-block]');
    jQuery(rootBlock).find('[edit-page-block-item]').each(function (index) {
      if (index > 0 && self.currentItem == this) {
         jQuery(self.pageBlockItemToolbar).hide();
         jQuery(self.currentItem).insertBefore(jQuery(rootBlock).find('[edit-page-block-item]')[index - 1]);
      }
    });
    if (typeof(self.options.onReOrderContent) == 'function') {
      var items = [];
      jQuery(rootBlock).find('[edit-page-block-item]').each(function (index) {
        items.push(jQuery(this).attr('edit-page-block-item'));
      });
      self.options.onReOrderContent(items);
    }
  });
  this.pageBlockItemToolbar.append(this.upItemButton);

  this.downItemButton = jQuery('<div>');
  jQuery(this.downItemButton).html('&darr;');
  jQuery(this.downItemButton).attr('title', 'Переместить вниз содержимое');
  jQuery(this.downItemButton).css({
        height:     '20px',
        width:      '20px',
        border:     'solid white 1px',
        background: 'transparent',
        'border-radius': '5px',
        cursor: 'pointer',
        color: 'white',
        fontSize: '15px',
        'text-align': 'center',
        marginTop: '4px',
        marginLeft: '4px',
        display         : 'inline-block'
  });
  jQuery(this.downItemButton).on('mouseover', function () {
        jQuery(this).css({
            background : 'white',
            color      : 'black'
        });
  });
  jQuery(this.downItemButton).on('mouseout', function () {
        jQuery(this).css({
            background : 'transparent',
            color      : 'white'
        });
  });
  jQuery(this.downItemButton).on('click', function () {
     self.currentItem = jQuery(self.pageBlockItemToolbar)[0].currentItem;
     jQuery(self.pageBlockItemToolbar).hide();

     var rootBlock = jQuery(self.currentItem).closest('[edit-page-block]');
     var l = jQuery(rootBlock).find('[edit-page-block-item]').length;
     jQuery(rootBlock).find('[edit-page-block-item]').each(function (index) {
        if (index < (l - 1) && self.currentItem == this) {
           jQuery(self.pageBlockItemToolbar).hide();
           jQuery(self.currentItem).insertAfter(jQuery(rootBlock).find('[edit-page-block-item]')[index + 1]);
        }
     });
     if (typeof(self.options.onReOrderContent) == 'function') {
          var items = [];
          jQuery(rootBlock).find('[edit-page-block-item]').each(function (index) {
              items.push(jQuery(this).attr('edit-page-block-item'));
          });
          self.options.onReOrderContent(items);
     }
  });
  this.pageBlockItemToolbar.append(this.downItemButton);



  jQuery(this.iframeContaner).on('load', function () {
    this.page = jQuery(this.iframeContaner)[0].contentWindow.document;
    //jQuery(this.page).find('a').attr('href', 'javascript:void(0)');
    jQuery(this.page).find('a').on('click', function (ev) {
      ev.preventDefault();
      return false;
    });

    setTimeout(function () {
      // Показать управление блоками контента
      this.addBlockHandler();
      // Показать управление элементами контента
      this.addBlockItemHandler();
    }.bind(this), 2000);

    jQuery(this.page).ajaxStop(function() {
      // Executed when all ajax requests are done.
      // console.log('Executed when all ajax requests are done.');
      // Показать управление блоками контента
      self.addBlockHandler();

      // Показать управление элементами контента
      self.addBlockItemHandler();
    });


  }.bind(this));

  jQuery(this.iframeContaner).attr({
    height    : "auto",
    seamless  : "seamless",
    scrolling : "auto",
    style     : "display: block; border: medium none; width: 100%; height: 100%; min-height: 1000px; padding: 0px; margin: 0px; margin-top: 60px;",
    src       : url
  });

  // Обработчики управления блоком
  this.addBlockHandler = function () {
      // Визуально выделяем управляемый блок контента красной пунктирной рамокой
      jQuery(this.page).find('[edit-page-block]').css({
          border: 'dashed red 1px'
      });

      jQuery(this.page).find('[edit-page-block]').on('mouseenter', function () {
          jQuery(self.page).find('body').append(self.pageBlockToolbar);
          jQuery(self.pageBlockToolbar).css({
              top: jQuery(this).offset().top - jQuery(self.pageBlockToolbar).height(),
              left: jQuery(this).offset().left
          });
          jQuery(self.pageBlockToolbar).show();
          self.currentBlock = this;
      });
      jQuery(this.page).find('[edit-page-block]').on('mouseleave', function () {
          /*setTimeout(function () {
           jQuery(self.pageBlockToolbar).hide();
           }, 3000);*/

      });
  }

  // Обработчики управления контентом
  this.addBlockItemHandler = function () {
    // Визуально выделяем управляемый элементом контента зеленой пунктирной рамокой
    jQuery(this.page).find('[edit-page-block-item]').css({
      border: 'dashed green 1px',
      cursor: 'pointer'
    });

    jQuery(this.page).find('[edit-page-block-item]').off('mouseenter');
    jQuery(this.page).find('[edit-page-block-item]').on('mouseenter', function () {
        jQuery(this).attr('origBackgroundColor', jQuery(this).css('backgroundColor'));
        jQuery(this).attr('origOptical', jQuery(this).css('optical'));
        jQuery(this).css({
          backgroundColor : '#D4FCD4',
          optical         : 0.5
        });

        jQuery(self.page).find('body').append(self.pageBlockItemToolbar);
        jQuery(self.pageBlockItemToolbar).show();
        jQuery(self.pageBlockItemToolbar).css({
          top  : jQuery(this).offset().top /*+ jQuery(self.pageBlockItemToolbar).innerHeight()*/,
          left : jQuery(this).offset().left
        });
        jQuery(self.pageBlockItemToolbar)[0].currentItem = this;
    });

    jQuery(this.page).find('[edit-page-block-item]').off('mouseleave');
    jQuery(this.page).find('[edit-page-block-item]').on('mouseleave', function () {
      jQuery(this).css({
        backgroundColor : jQuery(this).attr('origBackgroundColor'),
        optical         : jQuery(this).attr('origOptical')
      });
    });


  }


  this.showEditor = function (options) {

      if (typeof(BootstrapDialog) == 'function') {
          $(document).on('focusin', function(e) {
              if ($(e.target).closest(".mce-window").length) {
                  e.stopImmediatePropagation();
              }
          });

          BootstrapDialog.show({
              title: 'Редактирование контента',
              message: '<div style="width: 1000px;"><textarea edit-content-item class="form-control" rows="3" style="width: 700px; height: 250px;"></textarea></div>',
              draggable: true,
              buttons: [{
                  label: 'Сохранить',
                  cssClass: 'btn-success',
                  icon: 'glyphicon glyphicon-check',
                  action: function(dialogRef){
                      if (typeof(options.onOk) == 'function') {
                          options.onOk();
                      }
                      dialogRef.close();
                  }
              }, {
                  label: 'Отменить',
                  cssClass: 'btn-danger',
                  icon: 'glyphicon glyphicon-remove',
                  action: function(dialogRef){
                      if (typeof(options.onCancel) == 'function') {
                          options.onCancel();
                      }
                      dialogRef.close();
                  }
              }
              ]
          });

      } else {
        var html = '' +
              '<div class="bs-callout bs-callout-info" style="">' +
              '<h4>Контент</h4>' +
              ' <textarea edit-content-item class="form-control" rows="3" style="width: 700px; height: 250px;"></textarea>' +
              '</div>' +
              '<div style="text-align: right;">' +
              ' <button type="button" class="btn btn-success" ok-edit-content-item>Сохранить</button>' +
              ' <button type="button" class="btn btn-primary" cancel-edit-content-item>Отменить</button>' +
              '</div>' +
              '';
        this.dialog.show({
          content: html
        });
        jQuery('[cancel-edit-content-item]').off('click');
        jQuery('[cancel-edit-content-item]').on('click', function () {
              if (typeof(options.onCancel) == 'function') {
                  options.onCancel();
              }
              self.dialog.cancel();
        }.bind(this));

        jQuery('[ok-edit-content-item]').off('click');
        jQuery('[ok-edit-content-item]').on('click', function () {
              if (typeof(options.onOk) == 'function') {
                  options.onOk();
              }
              self.dialog.hide();
        });
      }




      //tinymce.remove();
      tinymce.on('AddEditor', function(e) {
          setTimeout(function () {
              if (typeof(options.content) == 'string') {
                tinyMCE.activeEditor.setContent(options.content, {format : 'raw'});
              }
          }, 10);
      });

      // Collect all stylesheets
      var styles = [];
      jQuery(this.page).find('link[rel="stylesheet"]').each(function () {
          if (jQuery(this).attr('href').indexOf('http') == -1) {
            var pageURL = self.page.location.href.split('#')[0];
            var p = pageURL.split('/');
            if (p.length > 0 && p[p.length - 1].indexOf('.') !== -1) {
              pageURL = pageURL.substring(0, pageURL.lastIndexOf('/'));
            }
            styles.push(pageURL + '/' + jQuery(this).attr('href'));
          } else {
            styles.push(jQuery(this).attr('href'));
          }

      });

      setTimeout(function () {
      tinymce.init({
          selector : "textarea[edit-content-item]",
          theme    : "modern",
          width    : 1000,
          height   : 250,
          menubar  : false,
          toolbar_items_size: 'small',
          plugins: [
              "table textcolor colorpicker hr anchor lists link advlist autolink image media moxiemanager code contextmenu "
          ],
          toolbar1: " code | table | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat forecolor backcolor fontselect fontsizeselect | link unlink anchor | image media",
          image_advtab: true,
          relative_urls : false,
          remove_script_host : true,
          document_base_url : document.location.href.split('#')[0],
          moxiemanager_title: 'Выбор файла',
          //skin: 'pepper-grinder',
          content_css: styles,
          theme_advanced_resize_horizontal : true,
          theme_advanced_resizing : true
      });
      }, 200);

  }

  this.addContent = function (content, blockID, itemID) {
      content = jQuery(content);
      if (typeof(blockID) == 'undefined') {
        blockID = this.currentBlock;
      } else {
        blockID = jQuery(this.page).find('[edit-page-block="' + blockID + '"]');
      }
      if (typeof(itemID) == 'undefined') {
        itemID = -1;
      }

      if (jQuery(blockID).length > 0) {
          if (jQuery(blockID).find('[edit-page-block-item-template]').length > 0) {
              var item = jQuery(jQuery(blockID).find('[edit-page-block-item-template]')[0]).clone();
              jQuery(item).removeAttr('edit-page-block-item-template');
              jQuery(item).attr('edit-page-block-item', itemID);
              jQuery(item).html('');

              //jQuery(item).html(jQuery(content).html());
              jQuery(item).append(content);
              jQuery(item).css({
                  display: '',
                  border: 'dashed green 1px'
              });
              jQuery(blockID).append(item);
          } else {
              jQuery(blockID).append('<div edit-page-block-item="' + itemID + '" style="border: dashed green 1px;">' +  jQuery(content).html() +  '</div>');
          }
      }
  }

}



var MsgDialog = function (options) {

    var options = jQuery().extend(true, {
        content                : 'Сообщение ....',
        closeOnBackgroundClick : true,
        editorWidth            : 800,
        editorHeight           : 500
    }, options);

    var showOptions = {};

    this.fadePanel = jQuery('<div>').css({
        display      : 'none',
        background   : '#000000',
        position     : 'fixed',
        left         : '0px',
        top          : '0px',
        width        : '100%',
        height       : '100%',
        opacity      : '0.6',
        zIndex       : '999'
    });
    jQuery('body').append(this.fadePanel);
    if (options.closeOnBackgroundClick == true) {
        jQuery(this.fadePanel).on('click', function () {
            this.cancel();
        }.bind(this));
    }


    this.contentPanel = jQuery('<div>').css({
        display: 'none',
        padding: '10px',
        background: '#FFFFFF',
        /*minWidth:   '200px',
         minHeight: '100px',*/
        cssFloat: 'left',
        //position: 'fixed',
        position: 'absolute',
        //position: 'relative',
        top: '50%',
        left: '50%',
        zIndex: '9999',
        boxShadow: '0px 0px 20px #666'
    });
    jQuery('body').append(this.contentPanel);
    jQuery(this.contentPanel).html(options.content);


    this.cancel = function () {
        /*jQuery.post('/ryshkin/image/upload/service', {
         ajaxAction  : 'delete',
         fileName    : fileName
         },function (result) {
         result = jQuery.parseJSON(result);
         });*/
        this.hide();
    }

    this.show = function (showOptions) {
        options = jQuery().extend(true, options, showOptions);

        jQuery(this.contentPanel).html('');
        jQuery(this.contentPanel).append(options.content);

        this.fadePanel.css('display', '');
        this.contentPanel.css('display', '');
        jQuery(this.contentPanel).css({
            top:  $(window).scrollTop() + (jQuery(window).height() - jQuery(this.contentPanel).height())/2,
            //'margin-top' : -((jQuery(this.contentPanel).height() + 10) / 2),
            'margin-left' : -((jQuery(this.contentPanel).width() + 10) / 2)
        });

    }

    this.hide = function () {
        this.fadePanel.css('display', 'none');
        this.contentPanel.css('display', 'none');
    }
}