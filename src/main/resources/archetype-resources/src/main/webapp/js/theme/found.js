/**
 * Created by Tangk on 2015-08-27.
 */
var updateCommunityData = []
jQuery(function ($) {
    XQWYCommunity.initCommunityBind();
    var searchTable = $('#search-table').dataTable({
        "aaSorting": [[2, 'asc']],
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
                var editButton = $("#found-update-btn");
                editButton.trigger("click");
            });

            //hide灰掉文字
            var foundStatus=aData["status"];
            if(foundStatus == 'HIDE'){
                $(nRow).css("color","darkgrey");
            }
        },

        "ajax": {
            "url": contextPath + "/found/search",
            "type": "POST",
            "data": function (d) {
                d.id = getElementValue('res-search-id');
                d.name = getElementValue('res-search-name');
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
            "sWidth": "15%",
            "bSortable": true,
            "iDataSort": "SORT_FLAG",
            "sTitle": "排序号",
            "mData": "sortFlag"
        }, {
            "sWidth": "15%",
            "bSortable": true,
            "iDataSort": "NAME",
            "sTitle": "名称",
            "mData": "name"
        }, {
            "sWidth": "15%",
            "bSortable": true,
            "iDataSort": "ALIAS",
            "sTitle": "别名",
            "mData": "alias"
        }, {
            "sWidth": "15%",
            "bSortable": true,
            "iDataSort": "LOGO",
            "sTitle": "图标",
            "mData": "logo",
            "render": function (data, type, row) {
                return "<img src='" + data + "' alt='图标' height='20px' weight='20px' />"
            }
        }, {
            "sWidth": "18%",
            "bSortable": true,
            "iDataSort": "URL",
            "sTitle": "链接",
            "mData": "url"
        }, {
            "sWidth": "15%",
            //"iDataSort": "STATUS",
            "sTitle": "状态",
            "mData": "status",
            "render": function (data, type, row) {
                //alert("data:"+data + ", type:"+type + ", row:"+row);
                //var code = row.id;
                var content = "";
                if (data == "SHOW") {
                    content = '显示';
                } else if (data == "HIDE") {
                    content = '隐藏';
                } else {
                    content = '未知';
                }
                return content;
            }
        }]
    });

    var searchTableTool = $.createDataTableTools("search-table", searchTable);

    $("#found-search-query-button").click(function () {
        searchTable._fnDraw();
    });

    $("#found-search-clear-button").click(function () {
        $("#res-search-form")[0].reset();
    });


    //保存发现
    $("#found-save-btn").on('click', function () {
        $("#found-edit-form")[0].reset();
        $("output span").each(function () {
            this.remove();
        });
        $("#found-edit-sort").removeAttr("readonly").val("0");
        $("#found-hidden-logo").val("");
        $("#found-edit-id").val("");
        $("#thumbs").html("");
        showEditRoleDialog("ADD");
    });
    //绑定小区按钮
    $("#found-community-bind").click(function () {
        var id = $("#found-edit-id").val();
        if (id != null && id.trim() != "") {
            //查询绑定信息
            $.ajax({
                url: contextPath + "/found/queryBindInfo",
                type: "POST",
                data: {
                    "foundIds": id
                },
                success: function (data, textStatus, jqXHR) {
                    if (data.code == 'SUCCESS') {
                        var foundList = data.data;
                        XQWYCommunity.openCommunityBindDialog({
                            data: foundList,
                            title: "绑定小区",
                            success: function (data) {
                                var communityStr = JSON.stringify(data);
                                $("#found-community-bind-data").val(communityStr);
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
            XQWYCommunity.openCommunityBindDialog(
                {
                    data: updateCommunityData,
                    title: "绑定小区",
                    success: function (data) {
                        var communityStr = JSON.stringify(data);
                        $("#found-community-bind-data").val(communityStr);
                    }
                }
            );
        }
    });

    //批量隐藏/显示查询
    $("#found-displayOrHiden-btn").on("click", function () {
        var items = $.dataTableCheckedItem("search-table", "请选择至少一条记录。");
        if (items) {
            var idList = "";
            items.each(function (i, item) {
                idList += item.defaultValue + ",";
            });
            $.ajax({
                url: contextPath + "/found/queryFoundByIds",
                type: "post",
                data: {
                    "foundIds": idList
                },
                success: function (data, textStatus, jqXHR) {
                    var foundList = data.data;
                    var content = "";
                    $(foundList).each(function (i, found) {
                        var foundName = found.alias;
                        if( isBlank(foundName) ){
                            foundName = found.name;
                        }
                        content += "<input type='hidden' name='founds' value='" + found.id + "' />" + foundName + "、";
                    });
                    $("#found-batch-update").html(content.substr(0, content.length - 1));
                    $.showDialog("found-batch-dialog", 600, "批量显示/隐藏发现信息")
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $.alertDialog("服务器异常，请联系管理员！");
                }
            });
        }
    });
    //批量显示/隐藏 修改
    $("#found-status-button").click(function () {
        var status = $('input:radio[name="status"]:checked').val();
        if (isBlank(status)) {
            $.alertDialog("请选择显示或隐藏");
            return false;
        }
        $.ajax({
            url: contextPath + "/found/displayOrHiden",
            type: "POST",
            data: $("#found-batch-form").serialize(),
            success: function (data, textStatus, jqXHR) {
                if (data.code == 'SUCCESS') {
                    searchTable._fnDraw();
                    $("#found-batch-dialog").dialog("close");
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
    $("#found-update-btn").click(function () {
        //var that = $(this);
        var items = $.dataTableCheckedOneItem("search-table", "请选择一个你要编辑的数据。");
        if (items) {
            //查询发现信息
            $.ajax({
                url: contextPath + "/found/get",
                type: "post",
                data: {
                    "id": items[0].value
                },
                success: function (data, textStatus, jqXHR) {
                    if (data.code == 'SUCCESS') {
                        $("#found-edit-form")[0].reset();
                        setElementValue('found-edit-id', data.data.id);
                        setElementValue('found-edit-name', data.data.name);
                        setElementValue('found-edit-sort', data.data.sortFlag);
                        $("#found-edit-sort").attr("readonly", "readonly");
                        setElementValue('found-edit-url', data.data.url)
                        setElementValue('found-hidden-logo', data.data.logo);
                        setElementValue('found-edit-alias', data.data.alias);
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

    $("#found-bind-btn").click(function () {
        //$.alertDialog("绑定小区信息");
        var items = $.dataTableCheckedItem("search-table", "请选择至少一条发现信息。");
        if (items) {
            var idList = "";
            items.each(function (i, item) {
                idList += item.defaultValue + ",";
            });
            //绑定发现信息
            XQWYCommunity.openCommunityBindDialog({
                title: "发现绑定", success: function (data) {
                    console.log(data);
                    $.ajax({
                        url: contextPath + "/found/bindCommunity",
                        type: "POST",
                        data: {
                            foundIds: idList,
                            themeBindJson: JSON.stringify(data)
                        },
                        success: function (data, textStatus, jqXHR) {
                            if (data.code == 'SUCCESS') {
                                $.alertDialog("保存成功");
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
        }
    });

    //批量排序
    $("#found-sort-btn").on('click', function () {
        $.ajax({
            url: contextPath + "/found/foundSort",//"/found/queryFoundByIds",
            type: "POST",
            //data: {"foundIds": idList},
            success: function (data, textStatus, jqXHR) {
                var foundList = data.data;
                var content = "<table>";
                var count = 1;
                $(foundList).each(function (i, found) {
                    if (count == 0) {
                        content += "<tr>";
                    }
                    var foundName = found.alias;
                    if( isBlank(foundName) ){
                        foundName = found.name;
                    }
                    content += "<td> <label style='margin-left:20px;'>" + foundName + ":</label>";
                    content += "<input type='hidden' name='id' value='" + found.id + "' />";
                    content += "<input type='text'  name='sortFlag' onkeyup='checkNum(this)' maxlength='6' value='" + found.sortFlag + "' style='width:120px;height:30px;margin-left:10px;' /> </td>"
                    if (count == 3) {
                        content += "</tr>";
                        count = 0;
                    }
                    count++;
                });
                content += "</table>";
                $("#found-sort-div").html(content);
                $.showDialog("found-sort-dialog", 800, "批量排序发现信息")
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $.alertDialog("服务器异常，请联系管理员！");
            }
        });
    });

    //新增或编辑弹窗
    function showEditRoleDialog(type) {
        var title, url;
        if (type == 'ADD') {
            title = "新增发现";
            url = contextPath + "/found/save";
        }
        else {
            title = "编辑角色";
            url = contextPath + "/found/update";
        }
        var dialog = $.showDialogWithButton("found-edit-dialog", 490, title, "保存", function () {
            if (checkIdHasError("found-edit-name")) {
                return false;
            }
            if (checkIdHasError("found-edit-alias")) {
                return false;
            }
            var reg = /^[0-9]*$/;
            var sortFlag = $("#found-edit-sort").val();
            if (!reg.test(sortFlag)) {
                $.alertDialog("排序号只能为数字！");
                return false;
            }
            if (checkIdHasError('found-edit-url')) {
                return false;
            }
            if (checkIdHasError('found-edit-logo') && checkIdHasError("found-hidden-logo")) {
                return false;
            }
            var file = $("#found-edit-logo").val();
            var fileType = file.substring(file.lastIndexOf(".") + 1);
            if (fileType != "png" && fileType != "jpg") {
                alert("上传文件格式错误");
                return;
            }
            var bindData = $("#found-community-bind-data").val().replace(/\"/g, "'");

            $.ajaxFileUpload({
                type: 'POST',
                url: url,
                fileElementId: "found-edit-logo",        //file的id
                dataType: "json",                //返回数据类型为文本
                data: {
                    id: $("#found-edit-id").val(), name: $("#found-edit-name").val(),
                    sortFlag: $("#found-edit-sort").val(), url: $("#found-edit-url").val(),
                    bindJson: bindData, alias: $("#found-edit-alias").val()
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $.alertDialog("服务器异常，请联系管理员！");
                },
                success: function (data, status) {
                    if (data.code == 'SUCCESS') {
                        dialog.dialog("close");
                        searchTable._fnDraw();
                    } else {
                        $.alertDialog(data.message);
                    }
                }
            });

        }, "取消", function () {
            $(this).dialog("close");
        });

        function progressHandlingFunction(e) {
            if (e.lengthComputable) {
                $('progress').attr({value: e.loaded, max: e.total});
            }
        }
    }

    //更新发现的排序信息
    $("#found-sort-button").click(function () {
        if (!checkSortForm()) {
            return false;
        }

        $.ajax({
            url: contextPath + "/found/updateFoundSort",
            type: "POST",
            data: $("#found-sort-form").serialize(),
            success: function (data, textStatus, jqXHR) {
                if (data.code = 'SUCCESS') {
                    $("#found-sort-dialog").dialog("close");
                    $('#search-table').dataTable()._fnDraw();
                } else {
                    $.alertDialog(data.message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $.alertDialog("服务器异常，请联系管理员！");
            }
        });
    });
});
function checkSortForm() {
    var items = $("#found-sort-div input[type=text]");
    var flag = true;
    $(items).each(function (i, found) {
        if (isBlank(found.value)) {
            //console.log($(found).prevAll("label"));
            $.alertDialog($(found).prevAll("label").html() + "排序信息不能为空");
            flag = false;
        }
    });
    return flag;
}
function update(code) {
    $.ajax({
        url: contextPath + "/found/get",
        type: "post",
        data: {
            "id": code
        },
        success: function (data, textStatus, jqXHR) {
            if (data.code == 'SUCCESS') {
                $("#found-edit-form")[0].reset();
                setElementValue('found-edit-id', data.data.id);
                setElementValue('found-edit-name', data.data.name);
                setElementValue('found-edit-sort', data.data.sortFlag);
                $("#found-edit-sort").attr("readonly", "readonly");
                setElementValue('found-edit-url', data.data.url)
                setElementValue('found-hidden-logo', data.data.logo);
                setElementValue('found-edit-alias', data.data.alias);
                $("found-hidden-logo").parent().parent().removeClass("has-error");
                $("#thumbs").html("<img src='" + data.data.logo + "' alt='图标' ondblclick='dubbleClickRemove(this)' height='75px' width='75px'>");
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

function showEditFoundDialog(type) {

    var title, url;
    if (type == 'ADD') {
        title = "新增发现";
        url = contextPath + "/found/save";
    }
    else {
        title = "编辑发现";
        url = contextPath + "/found/update";
    }
    var dialog = $.showDialogWithButton("found-edit-dialog", 390, title, "保存", function () {
        if (checkIdHasError('found-edit-name')) {
            return false;
        }
        if (checkIdHasError('found-edit-alias')) {
            return false;
        }
        var reg = /^[0-9]*$/;
        var sortFlag = $("#found-edit-sort").val();
        if (!reg.test(sortFlag)) {
            $.alertDialog("排序号只能为数字！");
            return false;
        }
        if (checkIdHasError('found-edit-url')) {
            return false;
        }
        if (checkIdHasError('found-edit-logo') && checkIdHasError("found-hidden-logo")) {
            return false;
        }
        if (isBlank(getElementValue("found-hidden-logo"))) {
            var file = $("#found-edit-logo").val();
            var fileType = file.substring(file.lastIndexOf(".") + 1);
            if (fileType != "png" && fileType != "jpg") {
                alert("上传文件格式错误");
                return;
            }
        }
        var bindData = $("#found-community-bind-data").val().replace(/\"/g, "'");
        $.ajaxFileUpload({
            type: 'POST',
            url: url,
            fileElementId: "found-edit-logo",        //file的id
            dataType: "json",                //返回数据类型为文本
            data: {
                id: $("#found-edit-id").val(), name: $("#found-edit-name").val(),
                sortFlag: $("#found-edit-sort").val(), url: $("#found-edit-url").val(),
                bindJson: bindData, alias: $("#found-edit-alias").val()
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $.alertDialog("服务器异常，请联系管理员！");
            },
            success: function (data, status) {
                if (data.code == 'SUCCESS') {
                    dialog.dialog("close");
                    $('#search-table').dataTable()._fnDraw();
                } else {
                    $.alertDialog(data.message);
                }
            }
        });

    }, "取消", function () {
        $(this).dialog("close");
    });

    function progressHandlingFunction(e) {
        if (e.lengthComputable) {
            $('progress').attr({value: e.loaded, max: e.total});
        }
    }
}


function imagesSelected(myFiles) {
    var logo = myFiles[0];
    for (var i = 0, f; f = myFiles[i]; i++) {
        var imageReader = new FileReader();
        imageReader.onload = (function (aFile) {
            return function (e) {
                var span = document.createElement('span');
                span.innerHTML = ['<img class="images" width="75px" height="75px" ondblclick="dubbleClickRemove(this)" src="', e.target.result, '" title="', aFile.name, '"/>'].join('');
                $("#thumbs").html(span);
                //document.getElementById('thumbs').insertBefore(span, null);
            };
        })(f);
        $("#found-hidden-logo").val("");
        imageReader.readAsDataURL(f);
    }
}

function dropIt(e) {
    imagesSelected(e.dataTransfer.files);
    e.stopPropagation();
    e.preventDefault();
}


//改变状态
function changeStatus(code, status) {
    $.ajax({
        url: contextPath + "/found/displayOrHiden",
        type: "POST",
        data: {founds: code, status: status},
        success: function (data, textStatus, jqXHR) {
            if (data.code == 'SUCCESS') {
                $('#search-table').dataTable()._fnDraw();
            } else {
                $.alertDialog(data.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.alertDialog("服务器异常，请联系管理员！");
        }
    });
}


//双击删除
function dubbleClickRemove(obj) {
    $(obj).remove();
    var obj = document.getElementById('found-edit-logo');
    obj.select();
    $("#found-edit-logo").val("");
    $("#found-hidden-logo").val("");
}


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

function checkForm(formId) {
    var textItmes = $("#" + formId).find("input[type=text]");
    textItmes.each(function (i, text) {
        var val = $(text).val();
        if (isBlank(val)) {
            $(text).parent().parent().addClass("has-error");
        } else {
            $(text).parent().parent().removeClass("has-error");
        }
    });
}


function checkNum(obj) {
    var reg = /^[0-9]*$/;
    var val = $(obj).val();
    if (!reg.test(val)) {
        $.alertDialog("请填入数字！");
        return false;
    }
}