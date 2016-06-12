var bannerTable;
var updateCommunityData=[]
jQuery(function ($) {
    bannerTable = $('#banner-table').dataTable({
        "aaSorting": [[1, 'desc']],
        "aLengthMenu": [10, 30, 50],
        "iDisplayLength": 30,
        "sDom": '<"row"<"col-xs-4"i><"col-xs-2"r><"col-xs-6"p>>t<"row"<"col-xs-5"l><"col-xs-7"p>>',
        "fnRowCallback": function (nRow, aData, iDisplayIndex) {
            $(nRow).dblclick(function () {
                $(this).closest('table').find('tbody > tr').each(function () {
                    var row = this;
                    bannerTableTool.fnDeselect(row);
                });
                bannerTableTool.fnSelect(nRow);
                var items = $.dataTableCheckedOneItem("banner-table", "请选择要改banner");
                clickModify(items[0].value);
            });

            var id = aData["id"];
            var status = aData["status"];
            var resource = aData["resource"];
            $('td:eq(0)', nRow).html("<label><input type='checkbox' class='ace' value=\"" + id + "\"" + "/><span class='lbl'></span></label>");
            $('td:eq(4)', nRow).html("<a  href='" + resource.url + "' target='_blank'>"+resource.name+"</a>");
            if (status == "SHOW") {
                $('td:eq(8)', nRow).html("<a class='btn btn-info btn-sm'  href='javascript:clickModify(" + id + ")'  style='margin-right:5px'>编辑</a>" +
                    "<a class='btn btn-warning btn-sm' href='javascript:clickUnable(" + id + ")' >隐藏</a>");
            } else {
                $('td:eq(8)', nRow).html("<a class='btn btn-info btn-sm'  href='javascript:clickModify(" + id + ")'  style='margin-right:5px'>编辑</a>" +
                    "<a class='btn btn-success btn-sm'  href='javascript:clickEnable(" + id + ")'  >显示</a>");
            }

            //hide灰掉文字
            var bannerStatus=aData["status"];
            if(bannerStatus == 'HIDE'){
                $(nRow).css("color","darkgrey");
            }
        },
        "ajax": {
            "url": contextPath + "/banner/listResult",
            "type": "POST",
            "data": function (d) {
                d.resourceId = getElementValue("banner-search-bannerResource");
                d.startDate = getElementValue('banner-search-startDate');
                d.startDate2 = getElementValue('banner-search-startDate2');
                d.endDate = getElementValue('banner-search-endDate');
                d.endDate2 = getElementValue('banner-search-endDate2');
                d.status = getElementValue("banner-search-status");
                d.title = getElementValue("banner-search-title");
                d.id = getElementValue("banner-search-id");

                return d;
            }
        },
        "aoColumns": [
            {
                "sWidth": "5%",
                "bSortable": false,
                "sTitle": '<input type="checkbox" class="ace" /><span class="lbl"></span>',
                "mData": "id"
            },
            {"sWidth": "7%", "bSortable": false, "iDataSort": "id", "sTitle": "编号", "mData": "id"},
            {"sWidth": "5%", "bSortable": false, "iDataSort": "sort_flag", "sTitle": "排序号", "mData": "sortFlag"},
            {"sWidth": "15%", "bSortable": false, "iDataSort": "title", "sTitle": "名称", "mData": "title"},
            {
                "sWidth": "10%",
                "bSortable": false,
                "iDataSort": "resource_id",
                "sTitle": "素材预览",
                "mData": "resource.url"
            },
            //{
            //    "sWidth": "10%",
            //    "bSortable": false,
            //    "iDataSort": "height",
            //    "sTitle": "app端显示高度",
            //    "mData": "height"
            //},
            {
                "sWidth": "10%",
                "bSortable": false,
                "iDataSort": "start_data",
                "sTitle": "开始时间",
                "mData": "startDate",
                "mRender": datetimeRender
            },
            {
                "sWidth": "10%",
                "bSortable": false,
                "iDataSort": "end_data",
                "sTitle": "结束时间",
                "mData": "endDate",
                "mRender": datetimeRender
            },
            {
                "sWidth": "10%",
                "bSortable": false,
                "iDataSort": "status",
                "sTitle": "状态",
                "mData": "status",
                "mRender": statusRender
            },
            {
                "sWidth": "15%",
                "sTitle": "操作",
                "mData": "resourceId"
            }
        ]
    });

    XQWYCommunity.initCommunityBind();

    var bannerTableTool = $.createDataTableTools("banner-table", bannerTable);

    //查询按钮
    $("#banner-search-query-button").click(function () {
        bannerTable._fnDraw();
    });
    var checkDialogData=[];
    //新增banner
    $("#banner-save-btn").click(function () {
        $("#banner-edit-form")[0].reset();
        $('#banner-edit-sortFlag').removeAttr("readonly");
        updateCommunityData=[];
        showEditBannerDialog("ADD", this['attributes']['path'].value);
    });
    //批量生效失效
    $("#banner-batch-update-btn").click(function () {
        var rows = $.dataTableCheckedItem("banner-table", "请选择选中表格中需要修改的行");
        if (rows) {
            var titleContext = "批量修改:";
            var checkIds = [];
            for (var i = 0; i < rows.length; i++) {
                var rowData = getTableRowData(rows.eq(i).val());
                checkIds.push(rowData.id);
                titleContext += "《" + rowData.title + "》"
            }
            $("#banner-batch-title").html(titleContext);
            openBatchModifyDialog(checkIds);
        }
    });
    //批量修改排序号
    $("#banner-batch-sort-btn").click(function () {
        batchUpdateSort();
    });
    //批量绑定小区
    $("#banner-bind-community-btn").click(function () {
        var rows = $.dataTableCheckedItem("banner-table", "您没有选择要修改的纪录");
        if (rows) {
            var titleContext = "批量绑定小区:";
            var checkIds = [];
            for (var i = 0; i < rows.length; i++) {
                var rowData = getTableRowData(rows.eq(i).val());
                checkIds.push(rowData.id);
                titleContext += "《" + rowData.title + "》"
            }
            $("#banner-bind-title").html(titleContext);
            var dialog = $.showDialogWithButton("banner-bind-dialog", 390, "批量绑定小区", "确认", function () {
                if(checkDialogData.length!=0){
                    batchBindCommunity(dialog,checkIds,checkDialogData);
                    checkDialogData=[];
                }
                dialog.dialog("close");
            }, "取消", function () {
                $(this).dialog("close");
            });
        }
    });
    function batchBindCommunity(dialog,checkIds,communityBindData){
        $.ajax({
            url: contextPath + "/banner/batchUpdateCommunityBind",
            type: "post",
            data: {"ids": checkIds, "bindDtos":JSON.stringify(communityBindData)},
            success: function (data, textStatus, jqXHR) {
                if (data.code == 'SUCCESS') {
                    dialog.dialog("close");
                    bannerTable._fnDraw();
                } else {
                    $.alertDialog(data.message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $.alertDialog("服务器异常，请联系管理员！");
            }
        });
    }
    //批量绑定小区dialog绑定小区按钮
    $("#dialog-bind-community-btn").click(function(){
       XQWYCommunity.openCommunityBindDialog({
           data:null,
           title: "绑定小区",
           success: function (data) {
               checkDialogData=data;
           }
       });
    });
    //新增dialog绑定小区按钮
    $("#banner-bind").click(function () {
        XQWYCommunity.openCommunityBindDialog(
            {
                data:updateCommunityData,
                title: "绑定小区",
                success: function (data) {
                    var communityStr = JSON.stringify(data);
                    $("#bindCommunitys").val(communityStr);
                }
            }
        );
    });
});

function openBatchModifyDialog(checkIds) {
    var dialog = $.showDialogWithButton("banner-batch-dialog", 390, "批量修改", "确认修改", function () {
        var status = $("#banner-batch-dialog input[type='radio']:checked").val();
        if (status != undefined) {
            $.ajax({
                url: contextPath + "/banner/batchUpdate",
                type: "post",
                data: {"ids": checkIds, status: status},
                success: function (data, textStatus, jqXHR) {
                    if (data.code == 'SUCCESS') {
                        dialog.dialog("close");
                        $.alertDialog("共更新了" + data.data + "条banner。");
                        bannerTable._fnDraw();
                    } else {
                        $.alertDialog(data.message);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $.alertDialog("服务器异常，请联系管理员！");
                }
            });
        } else {
            $.alertDialog("请选择更改状态！");
        }
    }, "取消", function () {
        $(this).dialog("close");
    });
}

//主table表中的修改banner按钮
function clickModify(id) {
    $("#banner-edit-form")[0].reset();
    $.ajax({
        url: contextPath + "/banner/get",
        dataType: 'json',
        type: "post",
        data: {"id": id},
        success: function (data, textStatus, jqXHR) {
            if (data.code == 'SUCCESS') {
                var date = new Date();
                $("#banner-edit-id").val(data.data.id);
                $("#banner-edit-title").val(data.data.title);
                $("#banner-edit-sortFlag").val(data.data.sortFlag);
                $('#banner-edit-sortFlag').attr("readonly", "readonly");
                date.setTime(data.data.startDate);
                $("#banner-edit-startDate").val(date.pattern("yyyy-MM-dd"));
                date.setTime(data.data.endDate);
                $("#banner-edit-endDate").val(date.pattern("yyyy-MM-dd"));
                $("#banner-edit-resourceId").val(data.data.resourceId);
                updateCommunityData=data.data.communityBinds;
                $("#bindCommunitys").val(JSON.stringify(updateCommunityData));
            } else {
                $.alertDialog(data.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.alertDialog("服务器异常，请联系管理员！");
        }
    });
    showEditBannerDialog("Edit", contextPath + "/banner/update");
};

function getTableRowData(id) {
    var serverData = bannerTable.fnSettings().aoData;
    var rowData = {};
    for (var i = 0; serverData.length; i++) {
        if (id == serverData[i]._aData.id) {
            rowData = serverData[i]._aData;
            break;
        }
    }
    return rowData;
}
//生效
var clickEnable = function (id) {
    bannerStatusChange(id, "SHOW");
};
//失效
var clickUnable = function (id) {
    bannerStatusChange(id, "HIDE");
};

function getRowHtml(title, sort) {
    return "<div class='form-group'>" +
        "<label class='col-sm-4 control-label no-padding-right' for='banner" + sort + "'>" + title + ":</label>" +
        "<div class='col-sm-8'>" +
        "<input type='number' id='banner" + sort + "' name='sortflag' class='col-xs-9' value='" + sort + "'/>" +
        "</div>" +
        "</div>";
}

function batchUpdateSort() {
    var rowData = getMyTableCheckRowData("banner-table", bannerTable);
    var htmlStr = "";
    if (rowData.length != 0) {
        for (var i = 0; i < rowData.length; i++) {
            htmlStr += getRowHtml(rowData[i].title, rowData[i].sortFlag);
        }
        $("#banner-batch-sort-form").html(htmlStr);

        var dialog = $.showDialogWithButton("banner-batch-sort-dialog", 390, "批量修改排序号", "确认修改", function () {
            var sortFlagObjs = $("#banner-batch-sort-form input[name='sortflag']");
            for (var i = 0; i < rowData.length; i++) {
                rowData[i].sortFlag = sortFlagObjs.eq(i).val();
                rowData[i].startDate = null;
                rowData[i].endDate = null;
            }
            $.ajax({
                url: contextPath + "/banner/batchUpdateSort",
                type: "post",
                data: {banners: JSON.stringify(rowData)},
                success: function (data, textStatus, jqXHR) {
                    dialog.dialog("close");

                    if (data.code == 'SUCCESS') {
                        bannerTable._fnDraw();
                    } else {
                        $.alertDialog(data.message);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $.alertDialog("服务器异常，请联系管理员！");
                }
            });
        }, "取消", function () {
            $(this).dialog("close");
        });
    }
}

function bannerStatusChange(id, status) {
    $.ajax({
        type: 'POST',
        url: contextPath + "/banner/changeStatus",
        data: {
            "id": id,
            "status": status
        },
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            if (data.code == "SUCCESS") {
                bannerTable._fnDraw();
            } else {
                alert("操作失败请重试！");
            }
        }, error: function (data) {
            alert("服务器忙,请稍后再试");
        }
    });
}

function showEditBannerDialog(type, pathUri) {
    var title, url;
    if (type == 'ADD') {
        title = "新增资源";
        url = pathUri;
        $("banner-edit-id").val("");
    }
    else {
        title = "编辑资源";
        url = pathUri;
    }
    var dialog = $.showDialogWithButton("banner-edit-dialog", 390, title, "保存", function () {
        if ($("#banner-edit-title").val() == "") {
            $.alertDialog("请填写名称!");
            return;
        }
        if ($("#banner-edit-sortFlag").val() == "") {
            $.alertDialog("请填写排序号!");
            return;
        }
        if ($("#banner-edit-startDate").val() == "") {
            $.alertDialog("请填写开始时间!");
            return;
        }
        if ($("#banner-edit-endDate").val() == "") {
            $.alertDialog("请填写结束时间!");
            return;
        }
        var startDate = new Date($("#banner-edit-startDate").val());
        var endDate = new Date($("#banner-edit-endDate").val());
        if (endDate < startDate) {
            $.alertDialog("开始时间不能大于结束时间！");
            return;
        }
        if ($("#banner-edit-resourceId").val() == "") {
            $.alertDialog("请选择素材!");
            return;
        }
        $.ajax({
            url: url,
            type: "post",
            data: $("#banner-edit-form").serialize(),
            success: function (data, textStatus, jqXHR) {
                if (data.code == 'SUCCESS') {
                    dialog.dialog("close");
                    bannerTable._fnDraw();
                } else {
                    $.alertDialog(data.message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $.alertDialog("服务器异常，请联系管理员！");
            }
        });
    }, "取消", function () {
        $(this).dialog("close");
    });
}

Date.prototype.pattern = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

getMyTableCheckRowData = function (tableId, dataTableObject) {
    var rowOjbs = $.dataTableCheckedItem(tableId,"您没有选择要操作的纪录");
    var rowDatas = dataTableObject.fnSettings().aoData;
    var resultRowData = [];
    for (var i = 0; rowOjbs.length > i; i++) {
        for (var j = 0; rowDatas.length > j; j++) {
            if (rowOjbs.eq(i).val() == rowDatas[j]._aData.id) {
                resultRowData.push(rowDatas[j]._aData);
                break;
            }
        }
    }

    return resultRowData;
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