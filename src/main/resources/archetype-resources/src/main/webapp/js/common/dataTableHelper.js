$.extend(true, $.fn.dataTable.defaults, {
    "bJQueryUI": false,
    "bProcessing": true,
    "bServerSide": true,
    "sServerMethod": "POST",
    "bDestroy": true,
    "bFilter": false,
    "bAutoWidth": false,
    "oLanguage": {
        "sLengthMenu": "每页显示 _MENU_ 条记录",
        "sEmptyTable": "没有数据！",
        "sZeroRecords": "没有数据！",
        "sInfo": "当前显示 _START_ 到 _END_ / 共 _TOTAL_ 条记录",
        "sInfoEmpty": "",
        "sSearch": "搜索：",
        "sInfoFiltered": "",
        "sProcessing": "正在获取数据，请稍候...",
        "oPaginate": {
            "sFirst": "首页",
            "sLast": "末页",
            "sNext": "下一页",
            "sPrevious": "上一页"
        }
    }
});

$.dataTableCheckedOneItem = function (id, message) {
    var table = $("#" + id);
    var checkItems = table.find("label input[type='checkbox']:checked");
    var selectedLength = checkItems.length;
    if (selectedLength <= 0 || selectedLength > 1) {
        $.alertDialog(message);
        return false;
    }
    return checkItems;
}

$.dataTableCheckedItem = function (id, message) {
    var table = $("#" + id);
    var checkItems = table.find("label input[type='checkbox']:checked");
    var selectedLength = checkItems.length;
    if (selectedLength <= 0) {
        $.alertDialog(message);
        return false;
    }
    return checkItems;
}

$.createDataTableTools = function (dtId, dtObject) {
    var tableTools_obj = new $.fn.dataTable.TableTools(dtObject, {
        //"sRowSelector": "td:not(:last-child)",
        "sRowSelect": "multi",
        "fnRowSelected": function (row) {
            try {
                $(row).find('input[type=checkbox]').get(0).checked = true
            }
            catch (e) {
            }
        },
        "fnRowDeselected": function (row) {
            try {
                $(row).find('input[type=checkbox]').get(0).checked = false
            }
            catch (e) {
            }
        },

        "sSelectedClass": "success"
    });

    dtObject.on('click', 'td input[type=checkbox]', function () {
        var row = $(this).closest('tr').get(0);
        if (!this.checked) tableTools_obj.fnSelect(row);
        else tableTools_obj.fnDeselect($(this).closest('tr').get(0));
    });

    $('#' + dtId + ' > thead > tr > th input[type=checkbox]').eq(0).on('click', function () {
        var th_checked = this.checked;
        $(this).closest('table').find('tbody > tr').each(function () {
            var row = this;
            if (th_checked) tableTools_obj.fnSelect(row);
            else tableTools_obj.fnDeselect(row);
        });
    });

    return tableTools_obj;
}