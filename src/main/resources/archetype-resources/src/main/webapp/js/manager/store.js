jQuery(function ($) {

    $(document).on("mouseover mouseout",".dfc",function(event){
        if(event.type == "mouseover"){
            $(this).find(".dfc_tips").show();
        }else if(event.type == "mouseout"){
            $(this).find(".dfc_tips").hide();
        }
    });

    var storeTable = $('#store-table').dataTable({
        "aaSorting": [[13, 'desc']],
        "aLengthMenu": [10, 30, 50],
        "iDisplayLength": 30,
        "sDom": '<"row"<"col-xs-4"i><"col-xs-2"r><"col-xs-6"p>>t<"row"<"col-xs-5"l><"col-xs-7"p>>',
        "fnRowCallback": function (nRow, aData, iDisplayIndex) {
            $(nRow).dblclick(function () {
                $(this).closest('table').find('tbody > tr').each(function () {
                    var row = this;
                    storeTableTool.fnDeselect(row);
                });
                storeTableTool.fnSelect(nRow);
                var storeButton = $("#store-update-btn");
                storeButton.trigger("click");
            });

            var code = aData["code"];

            var name = aData["alias"];
            if(!name){
                name = aData["name"];
            }
            $('td:eq(0)', nRow).html("<label><input type='checkbox' class='ace' store_name=\""+name+"\"  value=\"" + code + "\"/><span class='lbl'></span></label>");

            var bindList = aData["bindDtoList"];
            var showHtml = '';
            var tipHtml = '';
            for(var i=0;i<bindList.length;i++){
                if(i <2){
                    showHtml +=bindList[i].city;
                    if(bindList[i].area){showHtml += "-"+bindList[i].area;}
                    if(bindList[i].section){showHtml += "-"+bindList[i].section;}
                    if(bindList[i].communityName){showHtml += "-"+bindList[i].communityName;}
                    showHtml += "<br>" ;

                    tipHtml +=bindList[i].city;
                    if(bindList[i].area){tipHtml += "-"+bindList[i].area;}
                    if(bindList[i].section){tipHtml += "-"+bindList[i].section;}
                    if(bindList[i].communityName){tipHtml += "-"+bindList[i].communityName;}
                    tipHtml +="<br>" ;

                }else{
                    tipHtml +=bindList[i].city;
                    if(bindList[i].area){tipHtml += "-"+bindList[i].area;}
                    if(bindList[i].section){tipHtml += "-"+bindList[i].section;}
                    if(bindList[i].communityName){tipHtml += "-"+bindList[i].communityName;}
                    tipHtml +="<br>" ;
                }
            }

            var html ='<div  class="dfc">'+showHtml+ '<div class="dfc_tips"><b style="display:block;"></b>'+tipHtml+'</div> </div>';
            if(tipHtml){
                $('td:eq(6)', nRow).html(html);
            }else{
                $('td:eq(6)', nRow).html(showHtml);
            }

            //hide灰掉文字
            var storeStatus=aData["status"];
            if(storeStatus == 'HIDE'){
                $(nRow).css("color","darkgrey");
            }
        },

        "ajax": {
            "url": contextPath + "/store/search",
            "type": "POST",
            "data": function (d) {
                d.aliasName = getElementValue('store-search-aliasName');
                d.phone = getElementValue('store-search-phone');
                d.startTime = getElementValue('store-search-startTime');
                d.endTime = getElementValue('store-search-endTime');
                d.operationStage = getElementValue('store-search-operationStage');
                d.employeesPhone = getElementValue('store-search-employeesPhone');
                d.accessFlag = getElementValue('store-search-accessFlag');
                d.storeStatus = getElementValue('store-search-storeStatus');
                d.city = getElementValue('store-search-city');
                d.area = getElementValue('store-search-area');
                d.section = getElementValue('store-search-section');
                d.auditStatus = getElementValue('store-search-auditStatus');
                d.productStatus = getElementValue('store-search-productStatus');
                d.storeFlag = getElementValue('store-search-storeFlag');
                return d;
            }
        },

        "aoColumns": [
            {"sWidth": "1%", "bSortable": false, "sTitle": '<input type="checkbox" class="ace" /><span class="lbl"></span>', "mData": "code"},
            {"sWidth": "5%", "bSortable": true, "iDataSort": "s.CODE", "sTitle": "商家编号", "mData": "code"},
            {"sWidth": "5%", "bSortable": true, "iDataSort": "s.NAME", "sTitle": "商家名称", "mData": "name"},
            {"sWidth": "5%", "bSortable": true, "iDataSort": "s.ALIAS", "sTitle": "商家唯一名", "mData": "alias"},
            {"sWidth": "5%", "bSortable": false,"sTitle": "二级类目", "mData": "subCategoryName"},
            {"sWidth": "5%", "bSortable": true,"iDataSort": "s.ACCESS_FLAG","sTitle": "合作方式", "mData": "accessFlag","mRender":accessFlagValue},
            {"sWidth": "5%", "bSortable": false,"sTitle": "覆盖范围", "mData": "bindDtoList"},//index 6
            /*{"sWidth": "5%", "bSortable": false,"sTitle": "覆盖小区", "mData": "code"},*/
            {"sWidth": "5%", "bSortable": true,"iDataSort": "s.CREATE_DT","sTitle": "申请日期", "mData": "createDt","mRender": datetimeRender},
            {"sWidth": "5%", "bSortable": true,"iDataSort": "e.EMPLOYEES_NAME","sTitle": "商家接口人姓名", "mData": "storeExtra.employeesName"},
            {"sWidth": "5%", "bSortable": true,"iDataSort": "e.EMPLOYEES_PHONE","sTitle": "商家接口人电话", "mData": "storeExtra.employeesPhone"},
            {"sWidth": "5%", "bSortable": true,"iDataSort": "e.AUDIT_STATUS","sTitle": "审核状态", "mData": "storeExtra.auditStatus","mRender":auditStatusValue},
            {"sWidth": "5%", "bSortable": true,"iDataSort": "e.OPERATION_STAGE","sTitle": "运营阶段", "mData": "storeExtra.operationStage","mRender":operationStageValue },
            {"sWidth": "5%", "bSortable": true,"iDataSort": "s.STATUS_FLAG","sTitle": "商家状态", "mData": "status","mRender":storeStatusValue },
            //{"sWidth": "5%", "bSortable": false,"sTitle": "SKU数", "mData": "code"},
            //{"sWidth": "5%", "bSortable": false,"sTitle": "前台为展示商品数", "mData": "code"},
            {"sWidth": "1%", "bSortable": true, "iDataSort": "MODIFY_DT", "sTitle": "修改时间", "mData": "modifyDt",visible:false } //默认排序列
        ]
    });

    var storeTableTool = $.createDataTableTools("store-table", storeTable);

    $("#store-search-query-button").click(function () {
        storeTable._fnDraw();
    });

    $("#store-search-clear-button").click(function () {
        $("#store-search-form")[0].reset();
    });

    //新建商家
    $("#store-save-btn").click(function () {
       window.location.href = contextPath + "/store/storeDetail";
    });
    //编辑商家
    $("#store-update-btn").click(function () {
        var items = $.dataTableCheckedOneItem("store-table", "请选择一个你要编辑的商家。");
        if (items) {
            window.location.href = contextPath + "/store/storeDetail?storeCode="+items[0].value
        }
    });
    //批量显示隐藏
    $("#store-batch-btn").click(function () {
        var items = $.dataTableCheckedItem("store-table", "请选择至少一条记录。");
        if( items ){
            var codes = '';
            var names = '';
            for (var i = 0; i < items.length; i++) {
                codes += items[i].value + ",";
                names += $(items[i]).attr("store_name") + ",";
            }
            $("#status_dialog_codeList").html(names);
            var dialog = $.showDialogWithButton("store-status-dialog", 500, "批量设置状态", "确定", function () {
                var status = '';
                if($("#store-status-dialog").find("input[type='radio']").eq(0).prop("checked")){
                    status = 'SHOW';
                }else{
                    status = 'HIDE';
                }
                $.ajax({
                    url: contextPath + "/store/updateStatus",
                    type: "post",
                    data: {
                        "codes": codes,
                        "status": status
                    },
                    success: function (data, textStatus, jqXHR) {
                        if (data.code == 'SUCCESS') {
                            dialog.dialog("close");
                            storeTable._fnDraw();
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
    //批量导入商家
    $("#store-import-btn").click(function () {
        window.location.href = contextPath + "/store/storeDetail";
    });
    //分组管理
    $("#store-group-btn").click(function () {
        var items = $.dataTableCheckedOneItem("store-table", "请选择一个商家。");
        if (items) {
            window.location.href = contextPath + "/storeProductType/toStoreProductType?storeCode="+items[0].value
        }
    });
});

function onchangeSearchCity(city){
    if(!city){
        $("#store-search-area").html("<option value=''>请选择</option>");
        $("#store-search-section").html("<option value=''>请选择</option>");
        return;
    }
    $.ajax({
        url: contextPath + "/store/areaList",
        type: "post",
        data: {
            "city": city
        },
        success: function (data, textStatus, jqXHR) {
            if (data.code == 'SUCCESS') {
                $("#store-search-area").html("<option value=''>请选择</option>");
                $("#store-search-section").html("<option value=''>请选择</option>");
                var areaList = data.data;
                for(var index in areaList){
                    var area = areaList[index];
                    $("#store-search-area").append("<option value="+ area+">"+area+"</option>");
                }

            } else {
                $.alertDialog(data.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.alertDialog("服务器异常，请联系管理员！");
        }
    });
}

function onchangeSearchArea(area){
    if(!area){
        $("#store-search-section").html("<option value=''>请选择</option>");
        return;
    }
    $.ajax({
        url: contextPath + "/store/sectionList",
        type: "post",
        data: {
            "area": area,
            "city":$("#store-search-city").val()
        },
        success: function (data, textStatus, jqXHR) {
            if (data.code == 'SUCCESS') {
                $("#store-search-section").html("<option value=''>请选择</option>");
                var sectionList = data.data;
                for(var index in sectionList){
                    var section = sectionList[index];
                    $("#store-search-section").append("<option value="+ section+">"+section+"</option>");
                }

            } else {
                $.alertDialog(data.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.alertDialog("服务器异常，请联系管理员！");
        }
    });
}

function changeStatus(dom){
    var sData = $('#store-table').dataTable().fnGetData($(dom).parents('#store-table tr').get(0));
    var storeCode = sData.code;
    var storeStatus = sData.status;
    if(storeStatus == 'SHOW'){
        $(dom).html('<i class="icon-edit"></i>隐藏');
        updateStatus(storeCode,'HIDE');
        sData.status = 'HIDE';
    }else{
        $(dom).html('<i class="icon-edit"></i>显示');
        updateStatus(storeCode,'SHOW');
        sData.status = 'SHOW';
    }
}

function update(storeCode){
    $.alertDialog(storeCode);
}

function storeProductType(storeCode){
    $.alertDialog(storeCode);
}


function updateStatus(code,status){

    $.ajax({
        url: contextPath + "/store/updateStatus",
        type: "post",
        data: {
            "code": code,
            "status":status
        },
        success: function (data, textStatus, jqXHR) {
            if (data.code == 'SUCCESS') {
                $("#store-search-area").html("<option value=''>请选择</option>");
                $("#store-search-section").html("<option value=''>请选择</option>");
                var areaList = data.data;
                for(var index in areaList){
                    var area = areaList[index];
                    $("#store-search-area").append("<option value="+ area+">"+area+"</option>");
                }

            } else {
                $.alertDialog(data.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.alertDialog("服务器异常，请联系管理员！");
        }
    });
}

function accessFlagValue (data) {
    if (data == "API") {
        return "API接入";
    } else if (data == "H5") {
        return "H5接入";
    } else if (data == "OPERATION") {
        return "运营采集";
    } else if (data == "SELF_SUPPORT") {
        return "商家自营";
    }else if (data == "KA") {
        return "人工转单";
    } else {
        return data;
    }
}

function auditStatusValue (data) {
    if (data == "AUDIT_SUCCESS") {
        return "审核成功";
    } else if (data == "AUDIT_FAIL") {
        return "审核失败";
    } else if (data == "AUDIT_ING") {
        return "审核中";
    }  else {
        return "审核成功";
    }
}

function operationStageValue(data){
    if (data == "TRY") {
        return "试运营";
    } else if (data == "PROMOTE") {
        return "推广期";
    } else if (data == "STABLE") {
        return "稳定期";
    }  else {
        return data;
    }
}

function storeStatusValue(data){
    if(data == 'SHOW'){
        return "显示"
    }else if (data == 'HIDE'){
        return "隐藏"
    }else{
        return data;
    }
}