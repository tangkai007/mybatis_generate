
var houseExpertTable;
jQuery(function ($) {
    houseExpertTable = $('#houseExpert-table').dataTable({
        "aaSorting": [[1, 'desc']],
        "aLengthMenu": [10, 30, 50],
        "iDisplayLength": 30,
        "sDom": '<"row"<"col-xs-4"i><"col-xs-2"r><"col-xs-6"p>>t<"row"<"col-xs-5"l><"col-xs-7"p>>',
        "fnRowCallback": function (nRow, aData, iDisplayIndex) {

            var id = aData["id"];
            $('td:eq(0)', nRow).html("<label><input type='checkbox' class='ace' value=\"" + id + "\"" + "/><span class='lbl'></span></label>");


            $(nRow).dblclick(function () {
                $(this).closest('table').find('tbody > tr').each(function () {
                    var row = this;
                    houseExpertTableTool.fnDeselect(row);
                });
                houseExpertTableTool.fnSelect(nRow);
                var houseExpertButton = $("#houseExpert-update-btn");
                houseExpertButton.trigger("click");
            });

            //hide灰掉文字
            var houseExpertStatus=aData["status"];
            if(houseExpertStatus == 'HIDE'){
                $(nRow).css("color","darkgrey");
            }
        },
        "ajax": {
            "url": contextPath + "/houseExpert/search",
            "type": "POST",
            "data": function (d) {
                d.phone = getElementValue('houseExpert-search-phone');
                d.communityName = getElementValue('houseExpert-search-communityName');
                d.employee = getElementValue('houseExpert-search-employee');
                d.city = getElementValue('houseExpert-search-city');
                d.contractStartDate = getElementValue('houseExpert-search-contractStartDate');
                d.contractEndDate = getElementValue('houseExpert-search-contractEndDate');
                d.status =getElementValue('houseExpert-search-status');
                return d;
            }
        },

        "aoColumns": [
            {"sWidth": "5%", "bSortable": false, "sTitle": '<input type="checkbox" class="ace" /><span class="lbl"></span>', "mData": "id"},
            {"sWidth": "7%", "bSortable": true, "iDataSort": "CONTRACT_DATE", "sTitle": "签约日期", "mData": "contractDate","mRender": datetimeFormat},
            {"sWidth": "7%", "bSortable": true, "iDataSort": "EXPERT_NAME", "sTitle": "专家姓名", "mData": "expertName"},
            {"sWidth": "5%", "bSortable": true, "iDataSort": "PHONE", "sTitle": "手机号", "mData": "phone"},
            {"sWidth": "5%", "bSortable": true, "iDataSort": "CITY", "sTitle": "城市", "mData": "city"},
            {"sWidth": "7%", "bSortable": true, "iDataSort": "COMMUNITY_NAME","sTitle": "服务小区", "mData": "communityName"},
            {"sWidth": "7%", "bSortable": true, "iDataSort": "BEGIN_DATE","sTitle":"开始展示日期","mData":"beginDate","mRender": datetimeFormat},
            {"sWidth": "7%", "bSortable": true, "iDataSort": "END_DATE","sTitle":"结束展示日期","mData":"endDate","mRender": datetimeFormat},
            {"sWidth": "7%", "bSortable": true, "iDataSort": "EMPLOYEE","sTitle":"负责销售","mData":"employee"},
            {"sWidth": "5%", "bSortable": true, "iDataSort": "STATUS", "sTitle": "发布/隐藏", "mData": "status","render":function(data){
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
            {"sWidth": "7%", "bSortable": true, "iDataSort": "CREATE_DT","sTitle":"创建时间","mData":"createDt","mRender": datetimeRender},
        ]
    });

    var houseExpertTableTool = $.createDataTableTools("houseExpert-table", houseExpertTable);

    $("#houseExpert-search-query-button").click(function () {
        houseExpertTable._fnDraw();
    });

    $("#houseExpert-search-clear-button").click(function () {
        $("#houseExpert-search-form")[0].reset();
    });

    $("#houseExpert-save-btn").click(function(){
        window.location.href=contextPath+"/houseExpert/toSave";
    });

    //批量隐藏显示
    $("#houseExpert-batch-update-btn").click(function(){
        var rows=$.dataTableCheckedItem("houseExpert-table","请选择选中表格中需要修改的行");
        if(rows){
            var nameContext="批量修改:";
            var checkIds=[];
            for(var i=0;i<rows.length;i++){
                var rowData=getTableRowData(rows.eq(i).val());
                checkIds.push(rowData.id);
                nameContext += "《"+rowData.expertName+"》"
            }
            $("#houseExpert-batch-name").html(nameContext);
            batchChangeStatus(checkIds);
        }
    });

    function batchChangeStatus(checkIds){
        var dialog=$.showDialogWithButton("houseExpert-batch-dialog", 420, "批量修改状态", "确认修改", function () {
            var status=$("#houseExpert-batch-dialog input[type='radio']:checked").val();
            if(status!=undefined){
                $.ajax({
                    url: contextPath + "/houseExpert/batchChangeStatus",
                    type: "post",
                    data: {"ids":checkIds,status:status},
                    success: function (data, textStatus, jqXHR) {
                        if (data.code == 'SUCCESS') {
                            dialog.dialog("close");
                            $.alertDialog("更新成功！");
                            houseExpertTable._fnDraw();
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

    function getTableRowData(id){
        var serverData=houseExpertTable.fnSettings().aoData;
        var rowData={};
        for(var i=0;serverData.length;i++){
            if(id==serverData[i]._aData.id){
                rowData=serverData[i]._aData;
                break;
            }
        }
        return rowData;
    }

    $("#houseExpert-update-btn").click(function(){
        var checkedRowObjs=$("#houseExpert-table input[type=checkbox]:checked");
        if(checkedRowObjs.length==1){
            window.location.href=contextPath+"/houseExpert/toUpdate?houseExpertId="+checkedRowObjs.eq(0).val();
        }else if(checkedRowObjs.length==0){
            $.alertDialog("请选择编辑记录");
        }else{
            $.alertDialog("只能选择一条编辑记录");
        }
    });
});




