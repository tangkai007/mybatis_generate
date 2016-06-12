jQuery(function ($) {
    XQWYCommunity.initCommunityBind();
    var subCategoryTable = $('#subCategory-table').dataTable({
        "aaSorting": [[2, 'asc'], [3, 'asc']],
        "aLengthMenu": [10, 30, 50],
        "iDisplayLength": 30,
        "sDom": '<"row"<"col-xs-4"i><"col-xs-2"r><"col-xs-6"p>>t<"row"<"col-xs-5"l><"col-xs-7"p>>',
        "fnRowCallback": function (nRow, aData, iDisplayIndex) {
            var id = aData["id"];
            $('td:eq(0)', nRow).html("<label><input type='checkbox' class='ace' value=\"" + id + "\"" + "/><span class='lbl'></span></label>");
            $(nRow).dblclick(function () {
                $(this).closest('table').find('tbody > tr').each(function () {
                    var row = this;
                    subCategoryTool.fnDeselect(row);
                });
                subCategoryTool.fnSelect(nRow);
                //var editButton = $("#subCategory-edit-btn");
                //editButton.trigger("click");
            });

            //hide灰掉文字
            var subCategoryStatus = aData["status"];
            if (subCategoryStatus == 'HIDE') {
                $(nRow).css("color", "darkgrey");
            }
        },

        "ajax": {
            "url": contextPath + "/subCategory/list",
            "type": "POST",
            "data": function (d) {
                d.id = getElementValue('subCategory-search-id');
                d.title = getElementValue('subCategory-search-title');
                d.categoryId = getElementValue('subCategory-search-categoryId');
                d.storeServiceType = getElementValue('subCategory-search-storeServiceType');
                d.storeDetailFlag = getElementValue('subCategory-search-storeDetailFlag');
                d.productDetailFlag = getElementValue('subCategory-search-productDetailFlag');
                return d;
            }
        },

        "aoColumns": [{
            "sWidth": "5%",
            "bSortable": false,
            "sTitle": '<input type="checkbox" class="ace" /><span class="lbl"></span>',
            "mData": "id"
        }, {
            "sWidth": "6%",
            "bSortable": true,
            "iDataSort": "ID",
            "sTitle": "编号",
            "mData": "id"
        }, {
            "sWidth": "6%",
            "bSortable": true,
            "iDataSort": "SORT_FLAG",
            "sTitle": "排序号",
            "mData": "sortFlag"
        }, {
            "sWidth": "6%",
            "bSortable": true,
            "iDataSort": "TITLE",
            "sTitle": "名称",
            "mData": "title"
        }, {
            "sWidth": "6%",
            "bSortable": true,
            "iDataSort": "ALIAS",
            "sTitle": "别名",
            "mData": "alias"
        }, {
            "sWidth": "10%",
            "bSortable": false,
            "iDataSort": "LOGO",
            "sTitle": "图标",
            "mData": "logo",
            "render": function (data, type, row) {
                return "<img src='" + data + "' alt='图标' height='20px' weight='20px' />"
            }
        }, {
            "sWidth": "10%",
            "bSortable": false,
            "iDataSort": "STORE_LOGO",
            "sTitle": "商家logo默认图片",
            "mData": "storeLogo",
            "render": function (data, type, row) {
                return "<img src='" + data + "' alt='商家logo' height='20px' weight='20px'  />"
            }
        }, {
            "sWidth": "10%",
            "bSortable": true,
            "iDataSort": "CATEGORY_ID",
            "sTitle": "关联一级类目",
            "mData": "cateGoryTitle"
        }, {
            "sWidth": "6%",
            "bSortable": true,
            "iDataSort": "STORE_SERVICE_TYPE",
            "sTitle": "列表类型",
            "mData": "storeServiceType",
            "render": function (data) {
                var content = "";
                if (data == "RETAIL") {
                    content = '零售类';
                } else if (data == "SERVE") {
                    content = '服务类';
                } else if (data == "YELLOW") {
                    content = '黄页类';
                } else {
                    content = '未知';
                }
                return content;
            }
        }, {
            "sWidth": "7%",
            "bSortable": false,
            "iDataSort": "STORE_DETAIL_FLAG",
            "sTitle": "是否开放商家详情",
            "mData": "storeDetailFlag",
            "render": function (data) {
                var content = "";
                if (data == "YES") {
                    content = '是';
                } else if (data == "NO") {
                    content = '否';
                } else {
                    content = '未知';
                }
                return content;
            }
        }, {
            "sWidth": "7%",
            "bSortable": false,
            "iDataSort": "PRODUCT_DETAIL_FLAG",
            "sTitle": "是否开放商品详情",
            "mData": "productDetailFlag",
            "render": function (data) {
                var content = "";
                if (data == "YES") {
                    content = '是';
                } else if (data == "NO") {
                    content = '否';
                } else {
                    content = '未知';
                }
                return content;
            }
        }, {
            "sWidth": "5%",
            "bSortable": false,
            "iDataSort": "status",
            "sTitle": "状态",
            "mData": "status",
            "render": statusRender
        }, {
            "sWidth": "15%",
            "bSortable": false,
            "sTitle": "操作",
            "mData": "status",
            "render": function (data, type, row) {
                var code = row.id;
                var content = '<button class="btn btn-xs btn-info" id="subCategory-edit-btn"  onclick="update(\'' + code + '\');"><i class="icon-edit"></i>编辑</button>';
                if (data == "SHOW") {
                    content += '<button class="btn btn-xs btn-info" onclick="changeStatus(\'' + code + '\',\'HIDE\');"><i class="icon-edit"></i>隐藏</button>';
                } else if (data == "HIDE") {
                    content += '<button class="btn btn-xs btn-info" onclick="changeStatus(\'' + code + '\',\'SHOW\');"><i class="icon-edit"></i>显示</button>';
                } else {
                    content += '<button class="btn btn-xs btn-info" onclick="changeStatus(\'' + code + '\',\'HIDE\');"><i class="icon-edit"></i>未知</button>';
                }

                return content;
            }
        }]
    });

    var subCategoryTool = $.createDataTableTools("subCategory-table", subCategoryTable);
    //检索
    $("#subCategory-search-query-button").click(function () {
        subCategoryTable._fnDraw();
    });
    //清空检索项
    $("#subCategory-search-clear-button").click(function () {
        $("#subCategory-search-form")[0].reset();
    });
    //新增二级类目
    $("#subCategory-save-btn").click(function () {
        //清空表单
        cleanEditForm();
        $("#subCategory-edit-sortFlag").removeAttr("readonly").val("0");
        $("output img").each(function () {
            this.remove();
        });
        $("#subCategory-hidden-storeLogo").val("");
        $("#subCategory-hidden-logo").val("");
        $("#thumbs").html("");
        $("#thumbs-store").html("");
        showEditSubCategoryDialog("ADD");
    });

    $("#subCategory-batch-sortStore-btn").click(function () {
        var items = $.dataTableCheckedOneItem("subCategory-table", "请选择一条记录");
        if (!items) {
            return;
        }

        var id = items[0].value;

        $.ajax({
            url: contextPath + "/subCategory/getStoreList",
            type: "POST",
            data: {'subCategoryId': id},
            success: function (data, textStatus, jqXHR) {
                var content = "<table style='margin: 0px auto;'>";
                var count = 1;

                $(data).each(function (i, store) {
                    if (count == 0) {
                        content += "<tr>";
                    }

                    //content += "<td><label style='margin-left:20px;'>" + store.name + ":</label>";
                    //content += "<input type='hidden' name='id' value='" + store.code + "' />";
                    //content += "<input type='text'  name='sortFlag' value='" + store.sortFlag + "'";
                    //content += " style='width:120px;height:30px;margin-left:10px;' maxlength='11' onkeyup='checkInputNumber(this)'/></td>";

                    content += "<td>"
                        + "<span style='padding: 2px; width: 50%; display: inline-block; vertical-align: middle;'>"
                        + store.name + "</span>"
                        + "<input type='hidden' name='code' value='" + store.code + "'/>"
                        + "<input type='number' style='width: 40%; display: inline-block; vertical-align: middle' name='sortFlag' value='"
                        + store.sortFlag + "'>"
                        + "</td>";

                    if (count == 3) {
                        content += "</tr>";
                        count = 0;
                    }

                    count++;
                });
                content += "</table>";

                $("#subCategory-sortStore-div").html(content);

                $.showDialog("subCategory-sortStore-dialog", 800, "修改商家排序");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $.alertDialog("服务器异常");
            }
        });
    });
});

//双击删除二级类目logo
function doubleClickRemoveLogo(obj) {
    $(obj).remove();
    var obj = document.getElementById('subCategory-edit-logo');
    obj.select();
    $("#subCategory-hidden-logo").val("");
    $("#subCategory-edit-logo").val("");
}
/*商家logo默认图片*/
function imagesSelected(myFiles, id) {
    var logo = myFiles[0];
    for (var i = 0, f; f = myFiles[i]; i++) {
        var imageReader = new FileReader();
        imageReader.onload = (function (aFile) {
            return function (e) {
                var span = document.createElement('span');
                var imageText = e.target.result;
                if (id == "thumbs") {
                    span.innerHTML = ['<img class="images" width="75px" height="75px" ondblclick="doubleClickRemoveLogo(this)" src="', e.target.result, '" title="', aFile.name, '"/>'].join('');
                } else if (id == "thumbs-store") {
                    span.innerHTML = ['<img class="images" width="75px" height="75px" ondblclick="doubleClickRemoveStoreLogo(this)" src="', e.target.result, '" title="', aFile.name, '"/>'].join('');
                }
                $("#" + id).html(span);
            };
        })(f);
        imageReader.readAsDataURL(f);
    }
}
//双击删除商家logo默认图片
function doubleClickRemoveStoreLogo(obj) {
    $(obj).remove();
    var obj = document.getElementById('subCategory-edit-storeLogo');
    obj.select();
    $("#subCategory-edit-storeLogo").val("");
    $("#subCategory-hidden-storeLogo").val("");
}

function dropIt(e) {
    imagesSelected(e.dataTransfer.files);
    e.stopPropagation();
    e.preventDefault();
}
//修改二级类目排序号
$("#subCategory-update-sort-btn").click(function () {
    $.ajax({
        url: contextPath + "/subCategory/getSubCategory",
        type: "POST",
        success: function (data, textStatus, jqXHR) {
            var subCategoryList = data.data;
            var content = "<table>";
            var count = 1;
            $(subCategoryList).each(function (i, subCategory) {
                var editAlias = subCategory.alias;
                if (isBlank(subCategory.alias)) {
                    editAlias = subCategory.title;
                }
                if (count == 0) {
                    content += "<tr>";
                }
                content += "<td> <label style='margin-left:20px;'>" + editAlias + ":</label>";
                content += "<input type='hidden' name='id' value='" + subCategory.id + "' />";
                content += "<input type='text'  name='sortFlag' value='" + subCategory.sortFlag + "' style='width:120px;height:30px;margin-left:10px;' maxlength='11' onkeyup='checkInputNumber(this)' /> </td>";
                if (count == 3) {
                    content += "</tr>";
                    count = 0;
                }
                count++;
            });
            content += "</table>";
            $("#subCategory-sort-div").html(content);
            $.showDialog("subCategory-sort-dialog", 800, "修改二级类目排序")
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.alertDialog("服务器异常，请联系管理员！");
        }
    });
});

// 保存二级类目排序号
$("#subCategory-sort-save-button").click(function () {
    if (!checkSortForm()) {
        return false;
    }

    $.ajax({
        url: contextPath + "/subCategory/updateSubCategorySort",
        type: "POST",
        data: $("#subCategory-sort-form").serialize(),
        success: function (data, textStatus, jqXHR) {
            if (data.code = 'SUCCESS') {
                $("#subCategory-sort-dialog").dialog("close");
                $('#subCategory-table').dataTable()._fnDraw();
            } else {
                $.alertDialog(data.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.alertDialog("服务器异常，请联系管理员！");
        }
    });
});

// 保存二级类目下商家排序号
$("#subCategory-sortStore-button").click(function () {
    // has no need to check

    $.ajax({
        url: contextPath + "/subCategory/sortStores",
        type: "POST",
        data: $("#subCategory-sortStore-form").serialize(),
        success: function (data, textStatus, jqXHR) {
            if (data.code = 'SUCCESS') {
                $("#subCategory-sortStore-dialog").dialog("close");
            } else {
                $.alertDialog(data.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.alertDialog("服务器异常");
        }
    });
});

/*列表操作 编辑*/
function update(code) {
    cleanEditForm();
    $.ajax({
        url: contextPath + "/subCategory/get",
        type: "post",
        data: {
            "id": code
        },
        success: function (data, textStatus, jqXHR) {
            if (data.code == 'SUCCESS') {
                $("#subCategory-edit-form")[0].reset();
                setElementValue('subCategory-edit-id', data.data.id);
                setElementValue('subCategory-edit-title', data.data.title);
                setElementValue('subCategory-edit-alias', data.data.alias);
                $("#thumbs").html("<img src='" + data.data.logo + "' alt='图标' height='75px' width='75px' ondblclick='doubleClickRemoveLogo(this)' >");
                setElementValue('subCategory-hidden-logo', data.data.logo);
                setElementValue('subCategory-edit-storeServiceType', data.data.storeServiceType);
                setElementValue('subCategory-edit-categoryId', data.data.categoryId);
                setElementValue('subCategory-edit-sortFlag', data.data.sortFlag);
                if (data.data.storeDetailFlag == "YES") {
                    $("#storeDetailFlag-yes").attr("checked", "checked");
                } else {
                    $("#storeDetailFlag-no").attr("checked", "checked");
                }

                if (data.data.productDetailFlag == "YES") {
                    $("#productDetailFlag-yes").attr("checked", "checked");
                } else {
                    $("#productDetailFlag-no").attr("checked", "checked");
                }

                $("#subCategory-edit-sortFlag").attr("readonly", "readonly");
                $("#thumbs-store").html("<img src='" + data.data.storeLogo + "' alt='图标' height='75px' width='75px' ondblclick='doubleClickRemoveStoreLogo(this)'>");
                setElementValue('subCategory-hidden-storeLogo', data.data.storeLogo);
                showEditSubCategoryDialog("EDIT");
            } else {
                $.alertDialog(data.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.alertDialog("服务器异常，请联系管理员！");
        }
    });
}

//新增或编辑弹窗
function showEditSubCategoryDialog(type) {
    var title, url;
    if (type == 'ADD') {
        title = "新增二级类目";
        url = contextPath + "/subCategory/save";
    } else {
        title = "编辑二级类目";
        url = contextPath + "/subCategory/update";
    }
    var dialog = $.showDialogWithButton("subCategory-edit-dialog", 900, title, "保存", function () {
        if (checkIdHasError("subCategory-edit-title")) {
            return false;
        }
        if (checkIdHasError('subCategory-edit-alias')) {
            return false;
        }
        if (checkIdHasError('subCategory-edit-storeLogo') && checkIdHasError("subCategory-hidden-storeLogo")) {
            return false;
        }
        if (checkIdHasError('subCategory-edit-storeServiceType')) {
            return false;
        }
        var store = $("#subCategory-edit-form").find('input:radio[name="storeDetailFlag"]:checked').val();
        if (isBlank(store)) {
            $.alertDialog("请选择是否展示商家详情");
            return false;
        }
        var prod = $("#subCategory-edit-form").find('input:radio[name="productDetailFlag"]:checked').val();
        if (isBlank(prod)) {
            $.alertDialog("请选择是否展示商品详情");
            return false;
        }
        //二级类目logo，商家默认logo重置为空
        setElementValue('subCategory-hidden-logo', "");
        setElementValue('subCategory-hidden-storeLogo', "");
        var file = $("#subCategory-edit-logo").val();
        if (!isBlank(file)) {
            var fileType = file.substring(file.lastIndexOf(".") + 1);
            if (fileType != "png" && fileType != "jpg") {
                alert("上传文件格式错误");
                return false;
            }
        }
        var bindData = $("#subCategory-community-bind-data").val().replace(/\"/g, "'");
        $.ajax({
            type: 'POST',
            url: url,
            cache: false,
            data: new FormData($('#subCategory-edit-form')[0]),
            processData: false,
            contentType: false
        }).done(function (data) {
            console.log(data);
            if (data.code == "SUCCESS") {
                $('#subCategory-table').dataTable()._fnDraw();
                $("#subCategory-edit-dialog").dialog("close");
            } else {
                $.alertDialog(data.message);
            }
        }).fail(function (data) {
            console.log(data);
            $.alertDialog("服务器异常，请联系服务器管理员！")
        });

    }, "取消", function () {
        $(this).dialog("close");
    });
}

/*列表操作 隐藏 已隐藏*/
function changeStatus(code, status) {
    $.ajax({
        url: contextPath + "/subCategory/showOrHide",
        type: "POST",
        data: {subCategoryId: code, status: status},
        success: function (data, textStatus, jqXHR) {
            if (data.code == 'SUCCESS') {
                $('#subCategory-table').dataTable()._fnDraw();
            } else {
                $.alertDialog(data.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.alertDialog("服务器异常，请联系管理员！");
        }
    });
}

/*批量显示、隐藏 查询*/
$("#subCategory-batch-showHide-btn").click(function () {
    var items = $.dataTableCheckedItem("subCategory-table", "请选择至少一条记录。");
    if (items) {
        var idList = "";
        items.each(function (i, item) {
            idList += item.defaultValue + ",";
        });
        $.ajax({
            url: contextPath + "/subCategory/querySubCategoryByIds",
            type: "post",
            data: {
                "subCategoryIds": idList
            },
            success: function (data) {
                var subCategoryList = data.data;
                var content = "";
                var len = subCategoryList.length - 1;
                $(subCategoryList).each(function (i, subCategory) {
                    var editAlias = subCategory.alias;
                    if (isBlank(subCategory.alias)) {
                        editAlias = subCategory.title;
                    }
                    if (i == len) {
                        content += "<input type='hidden' name='subCategoryList' value='" + subCategory.id + "' />" + editAlias + "";
                    } else {
                        content += "<input type='hidden' name='subCategoryList' value='" + subCategory.id + "' />" + editAlias + "、";
                    }
                });
                $("#subCategory-batch-update").html(content);
                $.showDialog("subCategory-batch-dialog", 600, "批量显示/隐藏二级类目")
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $.alertDialog("服务器异常，请联系管理员！");
            }
        });
    }
});
/*批量显示、隐藏 修改*/
$("#subCategory-status-update-btn").click(function () {
    var status = $('input:radio[name="status"]:checked').val();
    if (isBlank(status)) {
        $.alertDialog("请选择显示或隐藏");
        return false;
    }
    $.ajax({
        url: contextPath + "/subCategory/batchShowOrHide",
        type: "POST",
        data: $("#subCategory-batch-form").serialize(),
        success: function (data, textStatus, jqXHR) {
            if (data.code == 'SUCCESS') {
                $('#subCategory-table').dataTable()._fnDraw();
                $("#subCategory-batch-dialog").dialog("close");
            } else {
                $.alertDialog(data.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.alertDialog("服务器异常，请联系管理员！");
        }
    });
});

/*批量修改基本信息 查询*/
$("#subCategory-batch-update-base-btn").click(function () {
    var items = $.dataTableCheckedItem("subCategory-table", "请选择至少一条记录。");
    if (items) {
        var idList = "";
        items.each(function (i, item) {
            idList += item.defaultValue + ",";
        });
        $.ajax({
            url: contextPath + "/subCategory/querySubCategoryByIds",
            type: "post",
            data: {
                "subCategoryIds": idList
            },
            success: function (data) {
                var subCategoryList = data.data;
                var content = "";
                var len = subCategoryList.length - 1;
                $(subCategoryList).each(function (i, subCategory) {
                    var editAlias = subCategory.alias;
                    if (isBlank(subCategory.alias)) {
                        editAlias = subCategory.title;
                    }
                    if (i == len) {
                        content += "<input type='hidden' name='baseSubCategoryList' value='" + subCategory.id + "' />" + editAlias + "";
                    } else {
                        content += "<input type='hidden' name='baseSubCategoryList' value='" + subCategory.id + "' />" + editAlias + "、";
                    }
                });
                $("#subCategory-batch-baseInfo-update").html(content);
                $.showDialog("subCategory-batch-baseInfo-dialog", 600, "批量修改基本信息")
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $.alertDialog("服务器异常，请联系管理员！");
            }
        });
    }
});
/*批量修改基本信息 修改*/
$("#subCategory-baseInfo-update-btn").click(function () {
    $.ajax({
        url: contextPath + "/subCategory/batchUpdateBaseInfo",
        type: "POST",
        data: $("#subCategory-batch-baseInfo-form").serialize(),
        success: function (data, textStatus, jqXHR) {
            if (data.code == 'SUCCESS') {
                $('#subCategory-table').dataTable()._fnDraw();
                $("#subCategory-batch-baseInfo-dialog").dialog("close");
            } else {
                $.alertDialog(data.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.alertDialog("服务器异常，请联系管理员！");
        }
    });
});

//新增二级类目 点击绑定小区按钮弹出绑定模式窗口
$("#subCategory-community-bind").click(function () {
    var updateCommunityData = [];
    var id = $("#subCategory-edit-id").val();
    if (id != null && id.trim() != "") {
        //查询绑定信息
        $.ajax({
            url: contextPath + "/subCategory/queryBindInfo",
            type: "POST",
            data: {
                "foundIds": id
            },
            success: function (data, textStatus, jqXHR) {
                if (data.code == 'SUCCESS') {
                    var foundList = data.data;
                    XQWYCommunity.openCommunityBindDialog(
                        {
                            data: foundList,
                            title: "小区区域绑定",
                            success: function (communityBindData) {
                                $("#subCategory-community-bind-data").val(JSON.stringify(communityBindData));
                            }
                        });
                } else {
                    $.alertDialog(data.message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $.alertDialog("服务器异常，请联系管理员！");
            }
        });
    } else {
        XQWYCommunity.openCommunityBindDialog({
            data: updateCommunityData,
            title: "小区区域绑定",
            success: function (communityBindData) {
                $("#subCategory-community-bind-data").val(JSON.stringify(communityBindData));
            }
        });
    }
});

//批量修改基本信息 点击绑定小区按钮弹出绑定模式窗口
$("#subCategory-baseInfo-community-bind").click(function () {
    var updateCommunityData = [];
    XQWYCommunity.openCommunityBindDialog(
        {
            data: updateCommunityData,
            title: "小区区域绑定",
            success: function (communityBindData) {
                $("#subCategory-baseInfo-community-bind-data").val(JSON.stringify(communityBindData));
            }
        }
    );
});

/*非空校验*/
function checkIdHasError(id) {
    var item = $("#" + id);
    var val = item.val();
    if (isBlank(val)) {
        $(item).parent().parent().addClass("has-error");
        return true;
    } else {
        $(item).parent().parent().removeClass("has-error");
        return false;
    }
}

/*清空表单*/
function cleanEditForm() {
    $("#subCategory-edit-form")[0].reset();
    $(".form-horizontal").find("input").each(function (index, element) {
        $(this).parent().parent().removeClass("has-error");
    });
    $(".form-horizontal").find("select").each(function (index, element) {
        $(this).parent().parent().removeClass("has-error");
    });
    $(".form-horizontal").find("label").each(function (index, element) {
        $(this).parent().parent().removeClass("has-error");
    });
}

/*数字校验*/
function checkInputNumber(data) {
    if (!/^[0-9]*$/.test(data.value)) {
        $.alertDialog("请输入数字!");
        return false;
    }
}
/*排序号非空校验*/
function checkSortForm() {
    var items = $("#subCategory-sort-div input[type=text]");
    var flag = true;
    $(items).each(function (i, category) {
        if (isBlank(category.value)) {
            $.alertDialog("二级类目 " + $(category).prevAll("label").html() + "排序信息不能为空");
            flag = false;
        }
    });
    return flag;
}

function statusRender(data) {
    if (data == 'SHOW') {
        return '显示';
    } else if (data == 'HIDE') {
        return '隐藏';
    } else {
        return '';
    }
}