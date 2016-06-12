jQuery(function ($) {
    var categoryTable = $('#category-table').dataTable({
        "aaSorting": [[1, 'asc'], [2, 'asc']],
        "aLengthMenu": [10, 30, 50],
        "iDisplayLength": 30,
        "sDom": '<"row"<"col-xs-4"i><"col-xs-2"r><"col-xs-6"p>>t<"row"<"col-xs-5"l><"col-xs-7"p>>',
        "fnRowCallback": function (nRow, aData, iDisplayIndex) {
            $(nRow).dblclick(function () {
                $(this).closest('table').find('tbody > tr').each(function () {
                    var row = this;
                    roleTableTool.fnDeselect(row);
                });
                roleTableTool.fnSelect(nRow);
                //var editButton = $("#category-edit-btn");
                //editButton.trigger("click");
            });

            //hide灰掉文字
            var categoryStatus=aData["status"];
            if(categoryStatus == 'HIDE'){
                $(nRow).css("color","darkgrey");
            }
        },

        "ajax": {
            "url": contextPath + "/category/list",
            "type": "POST",
            "data": function (d) {
                d.id = getElementValue('category-search-id');
                d.title = getElementValue('category-search-title');
                return d;
            }
        },

        "aoColumns": [{
            "sWidth": "7%",
            "bSortable": true,
            "iDataSort": "ID",
            "sTitle": "编号",
            "mData": "id"
        }, {
            "sWidth": "7%",
            "bSortable": true,
            "iDataSort": "SORT_FLAG",
            "sTitle": "排序号",
            "mData": "sortFlag"
        }, {
            "sWidth": "15%",
            "bSortable": true,
            "iDataSort": "TITLE",
            "sTitle": "名称",
            "mData": "title"
        }, {
            "sWidth": "23%",
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
            "iDataSort": "TITLE",
            "sTitle": "关联二级类目",
            "mData": "subCategoryList"
        }, {
            "sWidth": "10%",
            "bSortable": false,
            "iDataSort": "STATUS",
            "sTitle": "状态",
            "mData": "status",
            "mRender": statusRender
        }, {
            "sWidth": "15%",
            "bSortable": false,
            "sTitle": "操作",
            "mData": "status",
            "render": function (data, type, row) {
                var code = row.id;
                var content = '<button class="btn btn-xs btn-info" id="category-edit-btn"  onclick="update(\'' + code + '\');"><i class="icon-edit"></i>编辑</button>';
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

    var roleTableTool = $.createDataTableTools("role-table", categoryTable);
    //检索
    $("#category-search-query-button").click(function () {
        categoryTable._fnDraw();
    });
    //清空检索项
    $("#category-search-clear-button").click(function () {
        $("#category-search-form")[0].reset();
    });

    //新增一级类目
    $("#category-save-btn").on('click', function () {
        //清空表单
        cleanEditForm();
        $("#category-edit-sortFlag").removeAttr("readonly").val("0");
        $("output img").each(function () {
            this.remove();
        });
        $("#category-hidden-logo").val("");
        $("#thumbs").html("");
        showEditCategoryDialog("ADD");
    });

});

/*logo*/
function imagesSelected(myFiles) {
    var logo = myFiles[0];
    for (var i = 0, f; f = myFiles[i]; i++) {
        var imageReader = new FileReader();
        imageReader.onload = (function (aFile) {
            return function (e) {
                var span = document.createElement('span');
                var imageText = e.target.result;
                span.innerHTML = ['<img class="images" width="75px" height="75px" ondblclick="doubleClickRemove(this)" src="', e.target.result, '" title="', aFile.name, '"/>'].join('');
                $("#thumbs").html(span);
            };
        })(f);
        imageReader.readAsDataURL(f);
    }
}

function dropIt(e) {
    imagesSelected(e.dataTransfer.files);
    e.stopPropagation();
    e.preventDefault();
}

//双击删除
function doubleClickRemove(obj) {
    $(obj).remove();
    var obj = document.getElementById('category-edit-logo');
    obj.select();
    $("#category-hidden-logo").val("");
    $("#category-edit-logo").val("");
}
//修改排序号
$("#category-update-sort-btn").click(function () {
    $.ajax({
        url: contextPath + "/category/getCategory",
        type: "POST",
        success: function (data, textStatus, jqXHR) {
            var categoryList = data.data;
            var content = "<table>";
            var count = 1;
            $(categoryList).each(function (i, category) {
                if (count == 0) {
                    content += "<tr>";
                }
                content += "<td> <label style='margin-left:20px;'>" + category.title + ":</label>";
                content += "<input type='hidden' name='id' value='" + category.id + "' />";
                content += "<input type='text'  name='sortFlag' value='" + category.sortFlag + "'";
                content += " style='width:120px;height:30px;margin-left:10px;' maxlength='11' onkeyup='checkInputNumber(this)'/></td>";
                if (count == 3) {
                    content += "</tr>";
                    count = 0;
                }
                count++;
            });
            content += "</table>";
            $("#category-sort-div").html(content);
            $.showDialog("category-sort-dialog", 800, "修改一级类目排序")
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.alertDialog("服务器异常，请联系管理员！");
        }
    });
});

//保存排序号
$("#category-sort-button").click(function () {
        if (!checkSortForm()) {
            return false;
        }

        $.ajax({
            url: contextPath + "/category/updateSort",
            type: "POST",
            data: $("#category-sort-form").serialize(),
            success: function (data, textStatus, jqXHR) {
                if (data.code = 'SUCCESS') {
                    $("#category-sort-dialog").dialog("close");
                    $('#category-table').dataTable()._fnDraw();
                } else {
                    $.alertDialog(data.message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $.alertDialog("服务器异常，请联系管理员！");
            }
        });
    }
)
;

/*列表操作 编辑*/
function update(code) {
    cleanEditForm();
    $.ajax({
        url: contextPath + "/category/get",
        type: "post",
        data: {
            "id": code
        },
        success: function (data, textStatus, jqXHR) {
            if (data.code == 'SUCCESS') {
                setElementValue('category-edit-id', data.data.id);
                setElementValue('category-edit-title', data.data.title);
                setElementValue('category-edit-sortFlag', data.data.sortFlag);
                $("#category-edit-sortFlag").attr("readonly", "readonly");
                setElementValue('category-hidden-logo', data.data.logo);
                $("#thumbs").html("<img src='" + data.data.logo + "' alt='图标' ondblclick='doubleClickRemove(this)' height='75px' width='75px'>");

                showEditCategoryDialog("EDIT");
            } else {
                $.alertDialog(data.message);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.alertDialog("服务器异常，请联系管理员！");
        }
    });


}

/*列表操作 隐藏 已隐藏*/
function changeStatus(code, status) {
    $.ajax({
        url: contextPath + "/category/showOrHide",
        type: "POST",
        data: {categoryId: code, status: status},
        success: function (data, textStatus, jqXHR) {
            if (data.code == 'SUCCESS') {
                $('#category-table').dataTable()._fnDraw();
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
function showEditCategoryDialog(type) {
    getSubCategoryList();
    var title, url;
    if (type == 'ADD') {
        title = "新增一级类目";
        url = contextPath + "/category/save";
    } else {
        title = "编辑一级类目";
        url = contextPath + "/category/update";
    }
    var dialog = $.showDialogWithButton("category-edit-dialog", 700, title, "保存", function () {
        if (checkIdHasError('category-edit-title')) {
            return false;
        }
        if (checkIdHasError('category-edit-logo') && checkIdHasError("category-hidden-logo")) {
            return false;
        }
        var file = $("#category-edit-logo").val();
        if (!isBlank(file)) {
            var fileType = file.substring(file.lastIndexOf(".") + 1);
            if (fileType != "png" && fileType != "jpg") {
                alert("上传文件格式错误");
                return;
            }
        }
        /*关联二级类目*/
        var items = $.SubCategoryCheckedItems("subCategory-related-list");
        var idList = "";
        if (items) {
            items.each(function (i, item) {
                idList += item.defaultValue + ",";
            });
        }

        $.ajaxFileUpload({
            type: 'POST',
            url: url,
            fileElementId: "category-edit-logo",        //file的id
            dataType: "json",                //返回数据类型为文本
            data: {
                id: $("#category-edit-id").val(), title: $("#category-edit-title").val(),
                sortFlag: $("#category-edit-sortFlag").val(), subCategoryIds: idList
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $.alertDialog("服务器异常，请联系管理员！");
            },
            success: function (data, status) {
                if (data.code == 'SUCCESS') {
                    dialog.dialog("close");
                    $('#category-table').dataTable()._fnDraw();
                } else {
                    $.alertDialog(data.message);
                }
            }
        });

    }, "取消", function () {
        $(this).dialog("close");
    });
}


//关联的二级类目列表
function getSubCategoryList() {
    //当前一级类目的Id
    var editCategoryId = $("#category-edit-id").val();
    $.ajax({
        url: contextPath + "/category/getSubCategory",
        type: "POST",
        success: function (data, textStatus, jqXHR) {
            var categoryList = data.data;
            var content = "<table id='subCategory-related-list'>";
            var count = 1;
            $(categoryList).each(function (i, category) {
                if (count == 0) {
                    content += "<tr>";
                }

                if (category.categoryId != null) {
                    if (editCategoryId == category.categoryId) {
                        content += "<td> <label style='margin-left:20px;'><input type='checkbox' checked='checked' name='id' value='" + category.id + "'>" + category.alias + "(" + "<span style='color:gray'>已关联</span>" + category.cateGoryTitle + ")</label>";
                    } else {
                        content += "<td> <label style='margin-left:20px;'><input type='checkbox' name='id' value='" + category.id + "'>" + category.alias + "(" + "<span style='color:gray'>已关联</span>" + category.cateGoryTitle + ")</label>";
                    }
                } else {
                    content += "<td> <label style='margin-left:20px;color: #2a91d8'><input type='checkbox' name='id' value='" + category.id + "'>" + category.alias + "</label>";
                }
                if (count == 3) {
                    content += "</tr>";
                    count = 0;
                }
                count++;
            });
            content += "</table>";
            $("#subcategory-list").html(content);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.alertDialog("服务器异常，请联系管理员！");
        }
    });
}

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
    $("#category-edit-form")[0].reset();
    $(".form-horizontal").find("input").each(function (index, element) {
        $(this).val("");
        $(this).parent().parent().removeClass("has-error");
    });
    $(".form-horizontal").find("select").each(function (index, element) {
        $(this).val("");
        $(this).parent().parent().removeClass("has-error");
    });
    $(".form-horizontal").find("label").each(function (index, element) {
        $(this).val("");
        $(this).parent().parent().removeClass("has-error");
    });
}

/*关联二级类目 选择Checkbox*/
$.SubCategoryCheckedItems = function (id) {
    var table = $("#" + id);
    var checkItems = table.find("label input[type='checkbox']:checked");
    var selectedLength = checkItems.length;
    if (selectedLength <= 0) {
        return false;
    }
    return checkItems;
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
    var items = $("#category-sort-div input[type=text]");
    var flag = true;
    $(items).each(function (i, category) {
        if (isBlank(category.value)) {
            $.alertDialog("一级类目 " + $(category).prevAll("label").html() + "排序信息不能为空");
            flag = false;
        }
    });
    return flag;
}

function statusRender(data){
    if(data == 'SHOW'){
        return '显示';
    }else if(data =='HIDE'){
        return '隐藏';
    }else{
        return '';
    }
}