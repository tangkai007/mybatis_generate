$(function(){
    $("#storeProduct-edit-storeName").click(function(){
        $.getScript( contextPath + "/js/manager/storeDialog.js",function(){
            $.storeDialog.open(storeAddInfo);
        })
    });
});
var storeProductTable;
jQuery(function ($) {
    storeProductTable = $('#storeProduct-table').dataTable({
        "aaSorting": [[10, 'desc']],
        "aLengthMenu": [10, 30, 50],
        "iDisplayLength": 30,
        "sDom": '<"row"<"col-xs-4"i><"col-xs-2"r><"col-xs-6"p>>t<"row"<"col-xs-5"l><"col-xs-7"p>>',
        "fnRowCallback": function (nRow, aData, iDisplayIndex) {

            var code = aData["code"];
            var storeCode = aData["storeCode"];
            var storeName = aData["storeName"];
            $('td:eq(0)', nRow).html("<label><input type='checkbox' class='ace' value=\"" + code + "\"" + "/><span class='lbl'></span></label>");
            var storeUrl = "<a href='" + contextPath + "/store/storeDetail?storeCode=" + storeCode + "' >" + storeName + "<\/a>";
            $('td:eq(4)', nRow).html(storeUrl);


            $(nRow).dblclick(function () {
                $(this).closest('table').find('tbody > tr').each(function () {
                    var row = this;
                    storeProductTableTool.fnDeselect(row);
                });
                storeProductTableTool.fnSelect(nRow);
                var storeProductButton = $("#storeProduct-update-btn");
                storeProductButton.trigger("click");
            });

            //hide灰掉文字
            var storeProductStatus=aData["status"];
            if(storeProductStatus == 'HIDE'){
                $(nRow).css("color","darkgrey");
            }
        },
        "ajax": {
            "url": contextPath + "/storeProduct/search",
            "type": "POST",
            "data": function (d) {
                d.name = getElementValue('storeProduct-search-storeProductName');
                d.code = getElementValue('storeProduct-search-storeProductCode');
                d.storeAliasName = getElementValue('storeProduct-search-store');
                d.status = getElementValue('storeProduct-search-hidden');
                d.hotFlag = getElementValue('storeProduct-search-storeFlag');
                d.subCategoryId = getElementValue('storeProduct-search-subCategoryId');
                d.display =getElementValue('storeProduct-search-display');
                return d;
            }
        },

        "aoColumns": [
            {"sWidth": "5%", "bSortable": false, "sTitle": '<input type="checkbox" class="ace" /><span class="lbl"></span>', "mData": "code"},
            {"sWidth": "7%", "bSortable": true, "iDataSort": "CODE", "sTitle": "商品编号", "mData": "code"},
            {"sWidth": "7%", "bSortable": true, "iDataSort": "NAME", "sTitle": "商品名称", "mData": "name"},
            {"sWidth": "5%", "bSortable": true, "iDataSort": "SALE_DESC", "sTitle": "价格描述", "mData": "saleDesc"},
            {"sWidth": "7%", "bSortable": false, "sTitle": "商家唯一名", "mData": "storeName"},
            {"sWidth": "7%", "bSortable": false, "sTitle": "二级类目", "mData": "alias"},
            {"sWidth": "5%", "bSortable": true, "iDataSort": "SORT_FLAG", "sTitle": "排序", "mData": "sortFlag"},
            {"sWidth": "5%", "bSortable": true, "iDataSort": "HOT_FLAG", "sTitle": "是否爆品", "mData": "hotFlag","render":function(data){
                var content="";
                if(data =="YES"){
                    content='是';
                }else if(data =="NO"){
                    content='否';
                }else{
                    content='未知';
                }
                return content;
            }},
            {"sWidth": "5%", "bSortable": true, "iDataSort": "STATUS", "sTitle": "是否显示", "mData": "status","render":function(data){
                var content="";
                if(data =="SHOW"){
                    content='显示';
                }else if(data =="HIDE"){
                    content='隐藏';
                }else{
                    content='未知';
                }
                return content;
            }},
            {"sWidth": "5%", "bSortable": true, "iDataSort": "PAYMENT", "sTitle": "支付方式", "mData": "payment","render":function(data){
                var content="";
                if(data == "ONLINE"){
                    content= '在线支付';
                }else if(data == "OFFLINE"){
                    content= '线下支付';
                }else{
                    content='未知';
                }
                return content;
            }},
            {"sWidth": "1%", "bSortable": true, "iDataSort": "MODIFY_DT", "sTitle": "修改时间", "mData": "modifyDt",visible:false } //默认排序列
        ]
    });

    var storeProductTableTool = $.createDataTableTools("storeProduct-table", storeProductTable);

    $("#storeProduct-search-query-button").click(function () {
        storeProductTable._fnDraw();
    });

    $("#storeProduct-search-clear-button").click(function () {
        $("#storeProduct-search-form")[0].reset();
    });

});


function changeStoreProductType(){
    var storeCode = $("#storeProduct-edit-storeCode").val();
    if(!storeCode){
        $("#storeProduct-edit-storeProductTypeId").html("<option value=''>请选择</option>");
        //return;
    }
    $.ajax({
        url:contextPath +"/storeProduct/storeProductTypeList",
        type:"post",
        data:{
            "storeCode":storeCode
        },
        success:function(data,textStatus,jqXHR){
            if(data.code=='SUCCESS' && data.data && data.data.length >0){
                //var pid = $("#storeProduct-edit-storeProductTypeId").val();
                $("#storeProduct-edit-storeProductTypeId").html("");
                var storeProductTypeList = data.data;
                for(var index in storeProductTypeList){
                    var storeProductTypeId = storeProductTypeList[index].id;
                    var storeProductTypeName = storeProductTypeList[index].name;
                    $("#storeProduct-edit-storeProductTypeId").append("<option value="+storeProductTypeId +">"+storeProductTypeName+"</option>");
                }
                setElementValue('storeProduct-edit-storeProductTypeId',productTypeIdResult);
            }else{
                $("#storeProduct-edit-storeProductTypeId").html("<option value=''>请选择</option>");
                if(data.message){
                    $.alertDialog(data.message);
                }
            }
        },
        error:function(jqXHR,textStatus,errorThrown){
            $.alertDialog("服务器异常,请联系管理员！");
        }
    });

}

function storeAddInfo(storeCode,storeName){
    $("#storeProduct-edit-storeName").val(storeName);
    $("#storeProduct-edit-storeCode").val(storeCode);
    changeStoreProductType();
}

function updateStatus(code,status){
    $.ajax({
        url:contextPath + "/storeProduct/updateStatus",
        type:"post",
        data:{
            "code":code,
            "status":status
        },
        success:function(data,textStatus,jqXHR){
            if(data.code == 'SUCCESS'){
                $("#storeProduct-search-subCategoryId").html("<option value=''>请选择</option>");
            }else{
                $.alertDialog(data.message);
            }
        },
        error:function(jqXHR,textStatus,errorThrown){
            $.alertDialog("服务器异常，请联系管理员！");
        }
    });
}

//批量隐藏显示
$("#storeProduct-batch-update-btn").click(function(){
    var rows=$.dataTableCheckedItem("storeProduct-table","请选择选中表格中需要修改的行");
    if(rows){
        var nameContext="批量修改:";
        var checkIds=[];
        for(var i=0;i<rows.length;i++){
            var rowData=getTableRowData(rows.eq(i).val());
            checkIds.push(rowData.code);
            nameContext += "《"+rowData.name+"》"
        }
        $("#storeProduct-batch-name").html(nameContext);
        batchChangeStatus(checkIds);
    }
});

//选择图片
function imagesSelected(myFiles) {
    var logo = myFiles[0];
    for (var i = 0, f; f = myFiles[i]; i++) {
        var imageReader = new FileReader();
        imageReader.onload = (function(aFile) {
            return function(e) {
                var span = document.createElement('span');
                var imageText = e.target.result;
                span.innerHTML = ['<img class="images" width="75px" height="75px" ondblclick="dubbleClickRemove(this)" src="', e.target.result,'" title="', aFile.name, '"/>'].join('');
                document.getElementById('thumbs').insertBefore(span, null);
            };
        })(f);
        imageReader.readAsDataURL(f);
    }
}

//拖拽图片
function dropIt(e) {
    imagesSelected(e.dataTransfer.files);
    e.stopPropagation();
    e.preventDefault();
}

//双击删除
function dubbleClickRemove(obj){
    $(obj).remove();
    var obj = document.getElementById('storeProduct-edit-image') ;
    obj.select();
    document.selection.clear();
    $("#storeProduct-hiden-image").val("");
}

$("#storeProduct-add-btn").on('click',function(){
    var storeName = $("#storeProduct-edit-storeName").val();
    var storeCode = $("#storeProduct-edit-storeCode").val();
    $("#storeProduct-edit-form")[0].reset();
    $("output span").each(function(){this.remove();});
    files = [];
    setElementValue('storeProduct-edit-storeName',storeName);
    setElementValue('storeProduct-edit-storeCode',storeCode);
    showEditStoreProductDialog("ADD");
})

var productTypeIdResult;
$("#storeProduct-update-btn").click(function (){
    var items = $.dataTableCheckedOneItem("storeProduct-table","请选择一个你要编辑的数据。");
    if(items){
        //查询商品信息
        $.ajax({
            url:contextPath + "/storeProduct/get",
            type:"POST",
            data:{
                "code":items[0].value
            },
            success:function(data,textStatus,jqXHR){
                if(data.code=='SUCCESS'){
                    $("#storeProduct-edit-form")[0].reset();
                    $("#storeProduct-edit-storeProductTypeId").val("");
                    $("#thumbs").html("");
                    files = [];
                    productTypeIdResult = data.data.productTypeId;
                    setElementValue('storeProduct-edit-code',data.data.code);
                    setElementValue('storeProduct-edit-storeName',data.data.storeName);
                    setElementValue('storeProduct-edit-storeCode',data.data.storeCode);
                    setElementValue('storeProduct-edit-name',data.data.name);
                    setElementValue('storeProduct-edit-salesPrice',data.data.salesPrice);
                    setElementValue('storeProduct-edit-marketPrice',data.data.marketPrice);
                    setElementValue('storeProduct-edit-saleDesc',data.data.saleDesc);
                    setElementValue('storeProduct-edit-description',data.data.description);
                    //setElementValue('storeProduct-edit-storeProductTypeId',data.data.productTypeId);
                    setElementValue('storeProduct-edit-sortFlag',data.data.sortFlag);
                    var imageDtoList = data.data.imageDtoList;
                    for(var i=0;i<imageDtoList.length;i++){
                        var imageUrl = imageDtoList[i].imagePath;
                        var imageId = imageDtoList[i].id;
                        var span = document.createElement('span');
                        span.innerHTML = ['<img class="images" id="'+imageId+'" width="75px" height="75px" ondblclick="dubbleClickRemove(this)" src="' + imageUrl  + '"/>'].join('');
                        document.getElementById('thumbs').insertBefore(span, null);
                    }
                    if (data.data.hotFlag == "YES") {
                        $("#storeProduct-edit-hotFlag-YES").prop("checked", true);
                    } else {
                        $("#storeProduct-edit-hotFlag-NO").prop("checked", true);
                    }

                    if (data.data.productStatus == "UP") {
                        $("#storeProduct-edit-productStatus-UP").prop("checked", true);
                    } else {
                        $("#storeProduct-edit-productStatus-DOWN").prop("checked", true);
                    }

                    if (data.data.payment == "ONLINE") {
                        $("#storeProduct-edit-payment-ONLINE").prop("checked", true);
                    } else {
                        $("#storeProduct-edit-payment-OFFLINE").prop("checked",true);
                    }
                    showEditStoreProductDialog("EDIT");
                }else{
                    $.alertDialog(data.message);
                }
            },
            error:function(jqXHR,textStatus,errorThrown){
                $.alertDialog("服务器异常，请联系管理员！");
            }
        });
    }
});

function showEditStoreProductDialog(type){

    changeStoreProductType();
    validateStoreProduct();

    var title,url;
    if(type == 'ADD'){
        title = "新增商品";
        url = contextPath + "/storeProduct/save";

    }else{
        title = "编辑商品";
        url = contextPath + "/storeProduct/update";
    }
    var dialog= $.showDialogWithButton("storeProduct-edit-dialog",950,title,"保存",function(){

            if (blankAndBorder("input","storeProduct-edit-storeName")) {
                return false;
            }
            if (blankAndBorder("input","storeProduct-edit-name")) {
                return false;
            }
            if (blankAndBorder("input","storeProduct-edit-salesPrice")) {
                return false;
            }
            if (blankAndBorder("input","storeProduct-edit-saleDesc")) {
                return false;
            }
            if (blankAndBorder("textarea","storeProduct-edit-description")) {
                return false;
            }
            if (blankAndBorder("input","storeProduct-edit-sortFlag")) {
                return false;
            }
            $("#storeProduct-edit-name").focus(function(){
                $("#showResult").html("");
            });

            if($("#showResult").html()){
                return false;
            }

            var imageIds =[];
            $(".images").each(function(index,element){
                if($(element).prop("id")){
                    imageIds.push($(element).prop("id"));
                }
            });

            var fd = new FormData($('#storeProduct-edit-form')[0]);
                for(var i = 0; i < files.length; i++){
                    fd.append("uploadFiles", files[i]);
                }
            fd.append("imageIds",imageIds);

            fd.append("hotFlagStr",$("input[name='hotFlag']:checked").val());
            fd.append("productStatusStr",$("input[name='productStatus']:checked").val());

            $.ajax({
                url:url,
                type:'POST',
                cache:false,
                data:fd,
                async: false,
                processData:false,
                contentType:false
            }).done(function(data){
                console.log(data)
                if(data.code=="SUCCESS"){
                    $('#storeProduct-table').dataTable()._fnDraw();
                    $("#storeProduct-edit-dialog").dialog("destroy");
                    $("#storeProduct-edit-dialog").hide();
                    $.alertDialog("保存成功");
                }else{
                    $.alertDialog(data.message);
                }
            }).fail(function(data){
                console.log(data);
                $.alertDialog("服务器异常，请联系服务器管理员！")
            });
    },"取消",function(){
            $(this).dialog("destroy")
            $("#storeProduct-edit-dialog").hide();
        }
    );
}
//文件上传
var files = [];
var $fileToUpload = $('#storeProduct-edit-image');
var $barList = null;
var index = 0;
function fileSelected() {
    var fs = $fileToUpload.get(0).files;
    var file = $("#storeProduct-edit-image").val();
    var fileType = file.substring(file.lastIndexOf(".")+ 1);
    if (fileType != "png" && fileType != "jpg" && fileType !='bmp') {
        alert("上传文件格式错误");
        return false;
    }
    var html = '';
    for(var i = 0; i < fs.length; i++) {
        var file = fs[i];
        files.push(file);
    }
    $barList = $('.bar');
}

$fileToUpload.change(function() {
    fileSelected();
});

function getTableRowData(id){
    var serverData=storeProductTable.fnSettings().aoData;
    var rowData={};
    for(var i=0;serverData.length;i++){
        if(id==serverData[i]._aData.code){
            rowData=serverData[i]._aData;
            break;
        }
    }
    return rowData;
}

function validateStoreProductName(){
    $("#showResult").html("");
    var storeCode = $("#storeProduct-edit-storeCode").val();
    var storeProductCode = $("#storeProduct-edit-code").val();
    var storeProductName = $("#storeProduct-edit-name").val();
    if(storeProductName){
        $.ajax({
            url:contextPath + "/storeProduct/validateStoreProduct",
            type: "post",
            async: false,
            data: {
                "storeCode":storeCode,
                "storeProductName":storeProductName,
                "storeProductCode":storeProductCode
            },
            success:function(data,textStatus,jqXHR){
                if(data.code == 'SUCCESS'){

                }else {
                    //$.alertDialog(data.message);
                    $("#showResult").html(data.message);
                    $("#showResult").css("color","red");
                    return false;
                }
            },
            error:function(jqXHR,textStatus,errorThrown){
                $.alertDialog("服务器异常，请联系管理员！");
            }

        })
    }
}
function batchChangeStatus(checkIds){
    var dialog=$.showDialogWithButton("storeProduct-batch-dialog", 420, "批量修改状态", "确认修改", function () {
        var status=$("#storeProduct-batch-dialog input[type='radio']:checked").val();
        if(status!=undefined){
            $.ajax({
                url: contextPath + "/storeProduct/batchChangeStatus",
                type: "post",
                data: {"codes":checkIds,status:status},
                success: function (data, textStatus, jqXHR) {
                    if (data.code == 'SUCCESS') {
                        dialog.dialog("close");
                        $.alertDialog("更新成功！");
                        storeProductTable._fnDraw();
                    } else {
                        $.alertDialog(data.message);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $.alertDialog("服务器异常，请联系管理员！");
                }
            });
        }else{
            $.alertDialog("请选择更改状态！");
        }
    }, "取消", function () {
        $(this).dialog("close");
    });
}

function changeProductStatus(dom){
    var sData = $('#storeProduct-table').dataTable().fnGetData($(dom).parents('#storeProduct-table tr').get(0));
    var storeProductCode = sData.code;
    var storeProductStatus = sData.status;
    if(storeProductStatus == 'SHOW'){
        $(dom).html('<i class="icon-edit"></i>隐藏');
        updateStatus(storeProductCode,'HIDE');
        sData.status = 'HIDE';
    }else{
        $(dom).html('<i class="icon-edit"></i>显示');
        updateStatus(storeProductCode,'SHOW');
        sData.status = 'SHOW';
    }
}

function blankAndBorder(type,name){
    if(isBlank($("#storeProduct-edit-form").find(type+"[id='"+name+"']").val())){
        addBorder($("#storeProduct-edit-form").find(type+"[id='"+name+"']"));
        console.log("type:"+type+"  id:"+name)
        return true;
    }
    return false
}

function validateStoreProduct(){
    removeFormInputBorders("#storeProduct-edit-form");
    removeFormSelectBorders("#storeProduct-edit-form");
    removeFormLabelBorders("#storeProduct-edit-form");
    removeFormTextAreaBorders("#storeProduct-edit-form");
    $("#showResult").html("");
}