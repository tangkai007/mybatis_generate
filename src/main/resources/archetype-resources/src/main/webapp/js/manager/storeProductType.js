var storeProductTable;
var groups = [];
jQuery(function ($) {
    storeProductTable = $('#storeProductType-table').dataTable({
        "bPaginate": false, //翻页功能
        "sDom": '<"row"<"col-xs-4"i><"col-xs-2"r><"col-xs-6"p>>t<"row"<"col-xs-5"l><"col-xs-7"p>>',
        "fnRowCallback": function (nRow, aData, iDisplayIndex) {
            var storeCode = aData["storeCode"];
            var productTypeId = aData["id"];
            var groupStatus=aData['status'];
            var group = {};
            group.id = productTypeId;
            group.name = aData["name"];
            addGroup(group);
            if (productTypeId != -1) {
                if(groupStatus=="SHOW"){
                    $('td:eq(3)', nRow).html(
                        '<button style="margin-left:5px" class="btn btn-primary" type="button" onclick="updateProductSort(\'' + storeCode + '\',' + productTypeId + ')">修改排序</button>' +
                        '<button style="margin-left:5px" class="btn btn-info" type="button" onclick="updateProductGroup(\'' + storeCode + '\',' + productTypeId + ')">修改分组</button>' +
                        //'<button style="margin-left:5px" class="btn btn-warning" type="button" onclick="hideProductGroupStatus(\'' + storeCode + '\',' + productTypeId + ')">隐藏</button>'+
                        '<button style="margin-left:5px" class="btn btn-danger" type="button" onclick="deleteProductGroup(\'' + storeCode + '\',' + productTypeId + ')">删除</button>');
                }else{
                    $('td:eq(3)', nRow).html(
                        '<button style="margin-left:5px" class="btn btn-primary" type="button" onclick="updateProductSort(\'' + storeCode + '\',' + productTypeId + ')">修改排序</button>' +
                        '<button style="margin-left:5px" class="btn btn-info" type="button" onclick="updateProductGroup(\'' + storeCode + '\',' + productTypeId + ')">修改分组</button>' +
                        //'<button style="margin-left:5px" class="btn btn-success" type="button" onclick="showProductGroupStatus(\'' + storeCode + '\',' + productTypeId + ')">显示</button>'+
                        '<button style="margin-left:5px" class="btn btn-danger" type="button" onclick="deleteProductGroup(\'' + storeCode + '\',' + productTypeId + ')">删除</button>');
                }
            } else {
                $('td:eq(3)', nRow).html(
                    '<button style="margin-left:5px" class="btn btn-primary" type="button" onclick="updateProductSort(\'' + storeCode + '\',' + productTypeId + ')">修改排序</button>' +
                    '<button style="margin-left:5px" class="btn btn-info" type="button" onclick="updateProductGroup(\'' + storeCode + '\',' + productTypeId + ')">修改分组</button>');
            }
            $(nRow).dblclick(function () {
                $(this).closest('table').find('tbody > tr').each(function () {
                    var row = this;
                    storeProductTable.fnDeselect(row);
                });
                storeProductTable.fnSelect(nRow);
                var storeProductButton = $("#storeProduct-update-btn");
                storeProductButton.trigger("click");
            });
        },
        "ajax": {
            "url": contextPath + "/storeProductType/getProductTypeByCode",
            "type": "POST",
            "data": function (d) {
                d.storeCode = getElementValue('storeCode');
                return d;
            }
        },
        "aoColumns": [
            {"sWidth": "17%", "bSortable": true, "iDataSort": "NAME", "sTitle": "分组名称", "mData": "name"},
            {"sWidth": "7%", "bSortable": true, "iDataSort": "SORT_FLAG", "sTitle": "组顺序", "mData": "sortFlag"},
            {"sWidth": "5%", "bSortable": true, "sTitle": "sku数量", "mData": "productCount"},
            //{"sWidth": "5%", "bSortable": true, "sTitle": "状态", "mData": "status",render:productTypeStatus},
            {"sWidth": "27%", "bSortable": false, "sTitle": "操作", "mData": "storeCode"}
        ]
    });
    $("#batch-update-group-btn").click(function () {
        var rowDatas = storeProductTable.fnSettings().aoData;
        var updateProductTypes = [];
        $("#storeProductType-sort-body").html("");
        var storeName = $("#storeName").val();
        var dialogBodyHtmlStr = '<div style="margin:5px auto;width: 75%">商家名称：' + storeName + '</div>';
        for (var i = 1; i < rowDatas.length; i++) {
            var productType = {};
            productType.id = rowDatas[i]._aData.id;
            productType.sortFlag = "";
            updateProductTypes.push(productType);
            dialogBodyHtmlStr += getSortHtmlStr(rowDatas[i]._aData.name, rowDatas[i]._aData.sortFlag);
        }
        $("#storeProductType-sort-body").append(dialogBodyHtmlStr);
        openUpdateSortDialog("groupSort", updateProductTypes);
    });

    $("#add-group-btn").click(function () {
        $("#group-form")[0].reset();
        var dialog = $.showDialogWithButton("add-group-dialog", 490, "新增分组", "确认修改", function () {
            var groupName=$("#group-name").val();
            var groupSort=$("#group-sortFlag").val();
            if(groupName=="")
            {
                $.alertDialog("请输入分组名称！");
                return;
            }
            if(groupSort==""){
                groupSort=1;
            }
            $.ajax({
                url: contextPath + "/storeProductType/saveGroup",
                data: $("#group-form").serialize(),
                dataType: 'json',
                method: 'post',
                success: function (data) {
                    if (data.code != "SUCCESS") {
                        $.alertDialog(data.message);
                        dialog.dialog("close");
                    } else {
                        dialog.dialog("close");
                        storeProductTable._fnDraw();
                    }
                }, error: function () {
                    $.alertDialog("服务器忙请重试！");
                }
            });
        }, "取消", function () {
            $(this).dialog("close");
        });
    });

    function addGroup(group) {
        var addFlag = true;
        for (var i = 0; i < groups.length; i++) {
            if (group.id == groups[i].id) {
                addFlag = false;
            }
        }
        if (addFlag) {
            groups.push(group);
        }
    }

    $(document).on("click","#checkAll",function(){
        console.log("entry click all check");
        if($(this).prop("checked")){
            console.log("all check click true");
            $("#product-group-table tbody input[type='checkbox']").attr({checked:true});
        }else{
            console.log("all check click false");
            $("#product-group-table tbody input[type='checkbox']").attr({checked:false});
        }
    });
});

function updateProductSort(storeCode, productTypeId) {
    var updateProducts = [];
    $.ajax({
        url: contextPath + "/storeProductType/getProductByStoreCode",
        type: 'post',
        dataType: 'json',
        data: {storeCode: storeCode, productTypeId: productTypeId},
        success: function (data) {
            if (data.code == "SUCCESS") {
                $("#storeProductType-sort-body").html("");
                var dialogBodyHtmlStr="";
                if(data.data.productType!=null){
                    dialogBodyHtmlStr= '<div style="margin: 10px auto;text-align: center;width: 80%">' +
                        '<label>商家名称：' + $("#storeName").val() + '</label>' +
                        '<label class="form-controller" for="productTypeName" style="margin-left: 10px">分组名称：</label>' +
                        '<input type="text" id="productTypeName" style="width: 60px" value="'+data.data.productType.name+'">' +
                        '</div>';
                }else{
                    dialogBodyHtmlStr= '<div style="margin: 10px auto;text-align: center;width: 80%">' +
                        '<label>商家名称：' + $("#storeName").val() + '</label>' +
                        '<label class="form-controller" for="productTypeName" style="margin-left: 10px">分组名称：</label>' +
                        '<input type="text" id="productTypeName" style="width: 60px" readOnly value="未分组">' +
                        '</div>';
                }
                for (var i = 0; i < data.data.products.length; i++) {
                    var product = {};
                    product.code = data.data.products[i].code;
                    product.sortFlag = "";
                    updateProducts.push(product);
                    dialogBodyHtmlStr += getSortHtmlStr(data.data.products[i].name, data.data.products[i].sortFlag);
                }
                $("#storeProductType-sort-body").append(dialogBodyHtmlStr);
            }
        }
    });
    openUpdateSortDialog("productSort", updateProducts,productTypeId);

}

function updateProductGroup(storeCode, productTypeId) {
    var storeProductList = [];
    $("#storeProductType-group-dialog").empty();
    $.ajax({
        url: contextPath + "/storeProductType/getProductByStoreCode",
        method: "POST",
        dataType: 'json',
        data: {storeCode: storeCode, productTypeId: productTypeId},
        success: function (data) {
            if (data.code == "SUCCESS") {
                $("#storeProductType-group-dialog").append(getGroupHtmlStr(data.data.products,productTypeId));

                var dialog = $.showDialogWithButton("storeProductType-group-dialog", 490, "商品分组", "确认修改", function () {
                    var selectGroupId = $("#select-group").val();
                    var checkProductCodes = $("#group-product-table tbody input[type='checkbox']:checked");
                    for (var k = 0; k < checkProductCodes.length; k++) {
                        var storeProduct = {};
                        storeProduct.code = checkProductCodes.eq(k).val();
                        storeProduct.productTypeId = selectGroupId;
                        storeProductList.push(storeProduct);
                    }
                    $.ajax({
                        url: contextPath + "/storeProductType/updateGroupStoreProduct",
                        type: "post",
                        data: {storeProducts: JSON.stringify(storeProductList)},
                        success: function (data, textStatus, jqXHR) {
                            if (data.code == 'SUCCESS') {
                                dialog.dialog("close");
                                $.alertDialog("共更新了" + data.data + "条纪录。");
                                storeProductTable._fnDraw();
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
            } else {
                $.alertDialog("获取商品信息失败");
            }
        }, error: function () {
            $.alertDialog("服务器忙，请稍后再试！");
        }
    });
}

function deleteProductGroup(storeCode, productTypeId) {
    var confirm = $.confirmDialog("删除商品分组", "删除后，分组内的商品归入未非分组。", function () {
        $.ajax({
            url: contextPath + "/storeProductType/deleteGroup",
            data: {productTypeId: productTypeId},
            dataType: "json",
            method: 'post',
            success: function (data) {
                if (data.code == "SUCCESS") {
                    confirm.remove();
                    //storeProductTable._fnDraw();
                    window.location.reload();
                } else {
                    $.alertDialog("操作失败，请重试！");
                }
            }, error: function () {
                confirm.remove();
                $.alertDialog("服务器忙，请稍后再试！");
            }
        });
    });
}

function openUpdateSortDialog(opertion, updateData,productTypeId) {
    var title = "";
    var contextUrl = "";
    if (opertion == "groupSort") {
        title = "调整商品分组顺序";
        contextUrl = "/storeProductType/batchUpdateGroupSort";
    } else {
        title = "调整商品排序";
        contextUrl = "/storeProductType/batchUpdateSort";
    }
    var dialog = $.showDialogWithButton("storeProductType-sort-dialog", 490, title, "确认", function () {
        var productType={};
        var paramObject={};
        var sortFlags = $("#storeProductType-sort-body input[name='productSortFlag']");
        for (var i = 0; i < updateData.length; i++) {
            updateData[i].sortFlag = sortFlags.eq(i).val();
        }
        paramObject.updateData=JSON.stringify(updateData);
        if(productTypeId!=null){
            productType.id=productTypeId;
            productType.name=$("#productTypeName").val();
            paramObject.productTypeData=JSON.stringify(productType);
        }
        $.ajax({
            url: contextPath + contextUrl,
            type: "post",
            data: paramObject,
            success: function (data, textStatus, jqXHR) {
                if (data.code == 'SUCCESS') {
                    dialog.dialog("close");
                    storeProductTable._fnDraw();
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

function getSortHtmlStr(storeProductNam, sort) {
    return  '<div class="col-sm-11">' +
                '<label class="col-sm-5" style="text-align:right;margin-top: 5px">' + storeProductNam +
                ':</label><input class="col-sm-5" name="productSortFlag" type="number" value="' + sort + '" min="0" />' +
            '</div>';
}

function getGroupHtmlStr(storeProducts,productTypeId) {
    var htmlStr = "";
    var productTableHtmlStr = "";

    var localGroups = $.extend(true, [], groups);
    var thisGroup=[];
    for (var i = 0; i < localGroups.length; i++) {
        if (productTypeId == localGroups[i].id) {
            thisGroup=localGroups.splice(i, 1);
        }
    }

    for (var j = 0; j < storeProducts.length; j++) {
        productTableHtmlStr += getGroupTableHtmlStr(storeProducts[j]);
    }

    var optionHtmlStr = "";
    for (var i = 0; i < localGroups.length; i++) {
        optionHtmlStr += getGroupSelectOptionHtmlStr(localGroups[i]);
    }

    htmlStr ='<div class="row" style="padding-left:20px;margin-top:20px">商家:'+$("#storeName").val()+'<span style="margin-left:15px">分组名称：'+thisGroup[0].name+'</span></div>'+
        '<div id="product-group-table" class="row">' +
        '<table id="group-product-table" class="table table-condensed table-bordered" style="width: 80%;margin: 30px auto">' +
        '<thead><tr><td style="width: 20%"><label for="checkAll"><input type="checkbox" id="checkAll">全选</label></td><td>商品名称</td></tr></thead>' +
        '<tbody>' + productTableHtmlStr + '</tbody>' +
        '</table>' +
        '</div>' +
        '<div class="row" style="width: 80%;margin: 0 auto">' +
        '<label style="margin-left:20px;" for="select-group">可选移动分组:</label>' +
        '<select id="select-group" class="list-group">' + optionHtmlStr + '</select>' +
        '</div>';
    return htmlStr;
}

function getGroupTableHtmlStr(storeProduct) {
    return '<tr><td><input type="checkbox" value="' + storeProduct.code + '"></td><td>' + storeProduct.name + '</td></tr>';
}

function getGroupSelectOptionHtmlStr(group) {
    return '<option class="list-group-item" value="' + group.id + '">' + group.name + '</option>';
}

function hideProductGroupStatus(storeCode,productTypeId){
    updateProductGroupStatus(storeCode,productTypeId,"HIDE");
}
function showProductGroupStatus(storeCode,productTypeId){
    updateProductGroupStatus(storeCode,productTypeId,"SHOW");
}
function updateProductGroupStatus(storeCode,productTypeId,status){
    $.ajax({
        url:contextPath+"/storeProductType/updateStatusStoreProduct",
        method:"post",
        data:{storeCode:storeCode,storeProductId:productTypeId,storeProductStatus:status},
        dataType:"json",
        success:function(data){
            if(data.code!="SUCCESS"){
                $.alertDialog(data.message);
            }else{
                storeProductTable._fnDraw();
            }
        },error:function(){
            $.alertDialog("服务器忙，请重试！");
        }
    });
}

function productTypeStatus(data){
    if(data == 'SHOW'){
        return '显示';
    }else if(data =='HIDE'){
        return '隐藏';
    }else{
        return '';
    }
}