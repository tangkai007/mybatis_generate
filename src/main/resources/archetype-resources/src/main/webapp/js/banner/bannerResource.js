jQuery(function ($) {

    var resourceTable = $('#resource-table').dataTable({
        "bPaginate": true, //翻页功能
        "bLengthChange": true, //改变每页显示数据数量
        "aaSorting": [[1, 'desc']],
        "aLengthMenu": [10, 30, 50],
        "iDisplayLength": 30,
        "sDom": '<"row"<"col-xs-4"i><"col-xs-2"r><"col-xs-6"p>>t<"row"<"col-xs-5"l><"col-xs-7"p>>',
        "fnRowCallback": function (nRow, aData, iDisplayIndex) {
            var id = aData["id"];
            var resource = aData["resource"];
            $('td:eq(0)', nRow).html("<label><input type='checkbox' class='ace' value=\"" + id + "\"" + "/><span class='lbl'></span></label>");
            $('td:eq(3)', nRow).html(filterResourceType(aData['resourceType']));
            $('td:eq(4)', nRow).html("<a href='"+aData['url']+"' target='_blank'>"+aData['url']+"</a>");
            $(nRow).dblclick(function () {
                $(this).closest('table').find('tbody > tr').each(function () {
                    var row = this;
                    resourceTableTool.fnDeselect(row);
                });
                resourceTableTool.fnSelect(nRow);
                var storeButton = $("#resource-edit-btn");
                storeButton.trigger("click");
            });
        },
        "ajax": {
            "url": contextPath + "/bannerResource/bannerResourceListResult",
            "type": "POST",
            "data": function (d) {
                d.name = getElementValue("resource-search-name");
                d.resourceType = getElementValue("resource-search-resourceType");
                d.id = getElementValue("resource-search-id");
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
            {"sWidth": "15%", "bSortable": false, "iDataSort": "sort_flag", "sTitle": "名称", "mData": "name"},
            {"sWidth": "10%", "bSortable": false, "iDataSort": "sort_flag", "sTitle": "类型", "mData": "resourceType"},
            {"sWidth": "25%", "bSortable": false, "iDataSort": "url", "sTitle": "页面地址", "mData": "url"}
        ]
    });

    var resourceTableTool = $.createDataTableTools("resource-table", resourceTable);

    $("#resource-search-query-button").click(function () {
        resourceTable._fnDraw();
    });

    $("#resource-save-btn").click(function(){
        $("#resource-edit-form")[0].reset();
        showEditBannerDialog("ADD",this['attributes']['path'].value);
    });

    $("#resource-edit-btn").click(function(){
        $("#resource-edit-form")[0].reset();
        var rowData=$.getTableCheckRowData("resource-table",resourceTable);
        if(rowData){
            if(rowData.length==1){
                $("#resource-edit-name").val(rowData[0].name);
                $("#resource-edit-resourceType").val(rowData[0].resourceType);
                $("#resource-edit-url").val(rowData[0].url);
                $("#resource-edit-id").val(rowData[0].id);
                showEditBannerDialog("EDIT",this['attributes']['path'].value);
            }else{
                $.alertDialog("只能编辑单行！");
            }
        }
    });

    function showEditBannerDialog(type,pathUri) {
        var title, url;
        if (type == 'ADD') {
            title = "新增资源";
        }
        else {
            title = "编辑资源";
        }
        var dialog = $.showDialogWithButton("resource-edit-dialog", 390, title, "保存", function () {
            var name=$("#resource-edit-name").val();
            var resourceType=$("#resource-edit-resourceType").val();
            if(name==""){
                $.alertDialog("素材名称不能为空");
                return false;
            }
            if(resourceType=="ALL"){
                $.alertDialog("请选择素材类型");
                return false;
            }
            $.ajax({
                url: pathUri,
                type: "post",
                data: $("#resource-edit-form").serialize(),
                success: function (data, textStatus, jqXHR) {
                    if (data.code == 'SUCCESS') {
                        dialog.dialog("close");
                        resourceTable._fnDraw();
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
});


$.getTableCheckRowData=function(tableId,dataTableObject){
    var rowOjbs=$.dataTableCheckedItem(tableId,"请选择数据纪录进行编辑！");
    var resultRowData=[];
    if(rowOjbs){
        var rowDatas=dataTableObject.fnSettings().aoData;
        for(var i=0;rowOjbs.length>i;i++){
            for(var j=0;rowDatas.length>j;j++){
                if(rowOjbs.eq(i).val()==rowDatas[j]._aData.id){
                    resultRowData.push(rowDatas[j]._aData);
                    break;
                }
            }
        }
    }else{
       return false;
    }
    return resultRowData;
}

function filterResourceType(type){
    if(type=="POPULARIZE"){
        return "广告";
    }
}