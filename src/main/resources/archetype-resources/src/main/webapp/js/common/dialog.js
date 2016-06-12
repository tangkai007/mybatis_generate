/**
 * Created by ZuoMJ on 15/4/20.
 * desc:
 */
$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
    _title: function (title) {
        var $title = this.options.title || '&nbsp;';
        if (("title_html" in this.options) && this.options.title_html == true)
            title.html($title);
        else title.text($title);
    }
}));

$.showDialog = function (id, width, title) {
    var dialog = $("#" + id).removeClass('hide').dialog({
        resizable: false,
        width: width,
        modal: true,
        closeOnEscape: false,
        open: function (event, ui) {
            $(".ui-dialog-titlebar-close").hide();
        },
        title: "<div class='modal-header no-padding'><div class='table-header'><button type='button' class='close'><span class='white'>&times;</span></button><b>" + title + "</b></div></div>",
        title_html: true
    });
    $('.close').on("click", function(){
        dialog.dialog("close");
    });
    return dialog;
}

$.showDialogWithButton = function (id, width, title, okBtnTitle, fnOk, cancelBtnTitle, fnCancel) {
    var dialog = $("#" + id).removeClass('hide').dialog({
        resizable: false,
        width: width,
        modal: true,
        closeOnEscape: false,
        open: function (event, ui) {
            $(".ui-dialog-titlebar-close").hide();
        },
        title: "<div class='modal-header no-padding'><div class='table-header'><button type='button' class='close'><span class='white'>&times;</span></button><b>" + title + "</b></div></div>",
        title_html: true,
        buttons: [{
            html: "<i class='ace-icon fa fa-times'></i>&nbsp; " + cancelBtnTitle,
            "class": "btn btn-minier btn-danger",
            click: fnCancel
        }, {
            html: "<i class='ace-icon fa fa-check'></i>&nbsp; " + okBtnTitle,
            "class": "btn btn-minier btn-info",
            click: fnOk
        }]
    });
    $('.close').on("click", function(){
        //dialog.dialog("close");
        dialog.dialog("destroy");
        $("#" + id).hide();
    });
    return dialog;
}

$.alertDialog = function (text) {
    var id = new Date().getTime();
    //$("<div id='alert-dialog-" + id + "' class='modal fade' tabindex='-1'><div class='modal-dialog modal-content' style='width:400px'><div class='modal-header no-padding'><div class='table-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'><span class='white'>&times;</span></button>温馨提醒</div></div><div class='modal-body no-padding'><div class='modal-header'><h5>"+ text +"</h5></div></div><div class='modal-footer no-margin-top'><div class='col-sm-12 pull-right'><button class='btn btn-sm btn-danger' data-dismiss='modal'><i class='ace-icon fa fa-times bigger-110'></i> 关闭 </button></div></div></div></div>").appendTo('body');
    $("<div id='alert-dialog-" + id + "' class='modal fade' tabindex='-1'><div class='modal-dialog modal-content' style='width:400px'><div class='modal-header no-padding'><div class='table-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'><span class='white'>&times;</span></button>温馨提醒</div></div><div class='modal-body no-padding'><div class='modal-header'><h5>" + text + "</h5></div></div></div></div>").appendTo('body');
    $("#alert-dialog-" + id).modal();
}

$.confirmDialog = function (title, text, fnConfirm) {
    var id = new Date().getTime();
    $("<div id='alert-dialog-" + id + "' class='modal fade' tabindex='-1'><div class='modal-dialog modal-content' style='width:400px'><div class='modal-header no-padding'><div class='table-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'><span class='white'>&times;</span></button>" + title + "</div></div><div class='modal-body no-padding'><div class='modal-header'><h5>" + text + "</h5></div></div><div class='modal-footer no-margin-top'><div class='col-sm-12 pull-right'><button class='btn btn-sm btn-danger' data-dismiss='modal'><i class='ace-icon fa fa-times bigger-110'></i> 取消 </button><button id='ok-button-" + id + "' class='btn btn-sm btn-info'><i class='ace-icon fa fa-check bigger-110'></i> 确定 </button></div></div></div></div>").appendTo('body');
    //$("#ok-button-" + id).on('click', fnComfirm);
    $("#ok-button-" + id).on('click', fnConfirm);
    $("#alert-dialog-" + id).modal();
    return $("#alert-dialog-" + id);
}
