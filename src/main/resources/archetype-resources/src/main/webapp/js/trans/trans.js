jQuery(function ($) {
    var searchTable = $('#search_table').dataTable({
        "aaSorting": [[2, 'desc']],
        "aLengthMenu": [10, 30, 50],
        "iDisplayLength": 30,
        "sDom": '<"row"<"col-xs-4"i><"col-xs-2"r><"col-xs-6"p>>t<"row"<"col-xs-5"l><"col-xs-7"p>>',
        "fnRowCallback": function (nRow, aData, iDisplayIndex) {
            var id = aData["id"];
            $('td:eq(0)', nRow).html("<label><input type='checkbox' class='ace' value=\"" + id + "\"" + "/><span class='lbl'></span></label>");
            $(nRow).dblclick(function () {
                $(this).closest('table').find('tbody > tr').each(function () {
                    var row = this;
                    searchTableTool.fnDeselect(row);
                });
                searchTableTool.fnSelect(nRow);
                var editButton = $("#trans-update-btn");
                editButton.trigger("click");
            });

            //hide灰掉文字
            var foundStatus = aData["status"];
            if (foundStatus == 'HIDE') {
                $(nRow).css("color", "darkgrey");
            }
        },
        "ajax": {
            "url": contextPath + "/trans/findTransInfoByParam.do",
            "type": "POST",
            "dataFilter": function(data){
                var json = jQuery.parseJSON( data );
                json.recordsTotal = json.data.total;
                json.recordsFiltered = json.data.total;
                json.data = json.data.result;
                return JSON.stringify( json ); // return JSON string
            },
            "data": function (d) {
                d.id = getElementValue('trans-search-id');
                d.name = getElementValue('trans-search-name');
                return d;
            }
        },

        "aoColumns": [{
            "sWidth": "5%",
            "bSortable": false,
            "sTitle": '<input type="checkbox" class="ace" /><span class="lbl"></span>',
            "mData": "id"
        }, {
            "sWidth": "7%",
            "bSortable": true,
            "iDataSort": "ID",
            "sTitle": "编号",
            "mData": "id"
        }, {
            "sWidth": "13%",
            "bSortable": true,
            "iDataSort": "company_name",
            "sTitle": "公司名称",
            "mData": "companyName"
        }, {
            "sWidth": "11%",
            "bSortable": true,
            "iDataSort": "trans_trype",
            "sTitle": "交易类型",
            "mData": "transType"
        }, {
            "sWidth": "13%",
            "bSortable": true,
            "iDataSort": "trans_money",
            "sTitle": "交易金额",
            "mData": "transMoney"
        }, {
            "sWidth": "13%",
            "bSortable": true,
            "iDataSort": "option_user",
            "sTitle": "操作人",
            "mData": "optionUser"
        }, {
            "sWidth": "13%",
            "bSortable": true,
            "iDataSort": "create_time",
            "sTitle": "交易时间",
            "mData": "createTime"
        },{
            "sWidth": "13%",
            "bSortable": true,
            "iDataSort": "update_time",
            "sTitle": "修改时间",
            "mData": "updateTime"
        },{
            "sWidth": "13%",
            "bSortable": true,
            "iDataSort": "user_name",
            "sTitle": "联系人",
            "mData": "userName"
        } ]
    });

    var searchTableTool = $.createDataTableTools("search_table", searchTable);

    $("#trans-search-query-button").click(function () {
        searchTable._fnDraw();
    });

    $("#trans-search-clear-button").click(function () {
        $("#trans-search-form")[0].reset();
    });


    //保存发现
    $("#trans-save-btn").on('click', function () {
        $("#trans-edit-form")[0].reset();
        $("output span").each(function () {
            this.remove();
        });
        $("#trans-edit-sort").removeAttr("readonly").val("0");
        $("#trans-hidden-logo").val("");
        $("#trans-edit-id").val("");
        $("#thumbs").html("");
        showEditRoleDialog("ADD");
    });

    //批量隐藏/显示查询
    $("#trans-displayOrHiden-btn").on("click", function () {
        var items = $.dataTableCheckedItem("search-table", "请选择至少一条记录。");
        if (items) {
            var idList = "";
            items.each(function (i, item) {
                idList += item.defaultValue + ",";
            });
            $.ajax({
                url: contextPath + "/trans/queryFoundByIds",
                type: "post",
                data: {
                    "foundIds": idList
                },
                success: function (data, textStatus, jqXHR) {
                    var foundList = data.data;
                    var content = "";
                    $(foundList).each(function (i, found) {
                        var foundName = found.alias;
                        if (isBlank(foundName)) {
                            foundName = found.name;
                        }
                        content += "<input type='hidden' name='founds' value='" + found.id + "' />" + foundName + "、";
                    });
                    $("#trans-batch-update").html(content.substr(0, content.length - 1));
                    $.showDialog("trans-batch-dialog", 600, "批量显示/隐藏发现信息")
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $.alertDialog("服务器异常，请联系管理员！");
                }
            });
        }
    });

    //批量显示/隐藏 修改
    $("#trans-status-button").click(function () {
        var status = $('input:radio[name="status"]:checked').val();
        if (isBlank(status)) {
            $.alertDialog("请选择显示或隐藏");
            return false;
        }
        $.ajax({
            url: contextPath + "/trans/displayOrHiden",
            type: "POST",
            data: $("#trans-batch-form").serialize(),
            success: function (data, textStatus, jqXHR) {
                if (data.code == 'SUCCESS') {
                    searchTable._fnDraw();
                    $("#trans-batch-dialog").dialog("close");
                } else {
                    $.alertDialog(data.message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $.alertDialog("服务器异常，请联系管理员！");
            }
        });
    });

    //更新
    $("#trans-update-btn").click(function () {
        //var that = $(this);
        var items = $.dataTableCheckedOneItem("search-table", "请选择一个你要编辑的数据。");
        if (items) {
            //查询发现信息
            $.ajax({
                url: contextPath + "/trans/get",
                type: "post",
                data: {
                    "id": items[0].value
                },
                success: function (data, textStatus, jqXHR) {
                    if (data.code == 'SUCCESS') {
                        $("#trans-edit-form")[0].reset();
                        setElementValue('trans-edit-id', data.data.id);
                        setElementValue('trans-edit-name', data.data.name);
                        setElementValue('trans-edit-sort', data.data.sortFlag);
                        $("#trans-edit-sort").attr("readonly", "readonly");
                        setElementValue('trans-edit-url', data.data.url)
                        setElementValue('trans-hidden-logo', data.data.logo);
                        setElementValue('trans-edit-alias', data.data.alias);
                        $("#thumbs").html("<img src='" + data.data.logo + "'  alt='图标' ondblclick='dubbleClickRemove(this)' height='75px' width='75px'>");
                        showEditFoundDialog("EDIT");
                    } else {
                        $.alertDialog(data.message);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $.alertDialog("服务器异常，请联系管理员！");
                }
            });
        }
    });
});

