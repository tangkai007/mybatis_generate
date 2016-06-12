var XQWYCommunity = {
    setting: {},
    checkRowData: [],
    communityTable:{},
    openCommunityBindDialog: function (settingObject) {
        this.setting=settingObject;
        $("#xqwy-city-radio").trigger("click");
        XQWYCommunity.resetResult();
        if(settingObject.data!=undefined&&settingObject.data!=null&&settingObject.data.length!=0){
            XQWYCommunity.addResultItemForUpdate(settingObject.data);
        }
        var dialog = $.showDialogWithButton("xqwy-banner-bind-dialog", 890, settingObject.title, "确定", function () {
            settingObject.success(XQWYCommunity.checkRowData);
            $(this).dialog("destroy");
            $("#xqwy-banner-bind-dialog").hide();
        }, "取消", function () {
            $(this).dialog("destroy");
            $("#xqwy-banner-bind-dialog").hide();
        });
    },
    initCommunityBind: function () {
        //清空结果集
        $("#xqwy-clearall-btn").click(function () {
            $.alertDialog("清空直接保存不会删除数据");
            XQWYCommunity.resetResult();
        });
        //城市全选框
        $("#checkAllCity").click(function(){
            var checkObjects=$("#xqwy-city-body input[type=checkbox]");
            if($(this).prop("checked")){
                for(var i=1;i<checkObjects.length;i++){
                    checkObjects.get(i).checked=true;
                }
            }else{
                for(var i=1;i<checkObjects.length;i++){
                    checkObjects.get(i).checked=false;
                }
            }
        });
        //区域全选框
        $(document).on("click","#checkAllSection" ,function(){
            var checkSectionObjects =$("#xqwy-area-section-body input[type=checkbox]");
            if($(this).prop("checked")){
                for(var i=2;i<checkSectionObjects.length;i++){
                    checkSectionObjects.get(i).checked=true;
                }
            }else{
                for(var i=2;i<checkSectionObjects.length;i++){
                    checkSectionObjects.get(i).checked=false;
                }
            }
        });
        //城市下拉列表框监听事件
        $("#xqwy-city-select").change(function () {
            $.ajax({
                url: contextPath + "/community/getAreas",
                method: "post",
                dataType: 'json',
                data: {"cityName": $(this).val()},
                success: function (data) {
                    var areaHtmlStr = "";
                    if (data.code == "SUCCESS") {
                        for (var i = 0; i < data.data.length; i++) {
                            areaHtmlStr += getAreaHtml(data.data[i]);
                        }
                        $("#xqwy-area-label-ul").empty();
                        $("#xqwy-area-section-body").empty();
                        $("#xqwy-area-label-ul").append(areaHtmlStr);
                    }
                },
            });
        });
        //城市单选按钮
        $("#xqwy-city-radio").click(function () {
            $("#xqwy-city-body input[type=checkbox]:checked").removeAttr("checked");
            $("#checkAllCity").removeAttr("checked");
            $("#xqwy-city-bold").show();
            $("#xqwy-area-section-bold").hide();
            $("#xqwy-community-bold").hide();
            if (cities.length ==0) {
                $.ajax({
                    url: contextPath + "/community/getCities",
                    dataType: 'json',
                    type: "post",
                    success: function (data, textStatus, jqXHR) {
                        if (data.code == 'SUCCESS') {
                            var cityHtmlStr = "";
                            var citySelectHtmlStr = "";
                            cities=data.data;
                            for (var i = 0; i < cities.length; i++) {
                                //初始化城市
                                cityHtmlStr += getCityOrSectionHtml(cities[i].cityName);
                                //初始化城市下拉框
                                citySelectHtmlStr += "<option value='" + cities[i].cityName + "'>" + cities[i].cityName + "</option>"
                            }
                            $("#xqwy-city-body").append(cityHtmlStr);
                            $("#xqwy-city-select").html('<option value="">城市</option>');
                            $("#xqwy-city-select").append(citySelectHtmlStr);
                            $("#xqwy-community-city-select").html('<option value="">全国</option>');
                            $("#xqwy-community-city-select").append(citySelectHtmlStr);
                        } else {
                            $.alertDialog(data.message);
                        }
                    }
                });
            }
        });
        //区域／板块 单选按钮
        $("#xqwy-area-radio").click(function () {
            $("#xqwy-area-section-body input[type=checkbox]:checked").removeAttr("checked");
            $("#xqwy-area-section-body input[type=checkbox]").removeAttr("disabled");
            $("#xqwy-area-section-bold").show();
            $("#xqwy-city-bold").hide();
            $("#xqwy-community-bold").hide();
        });
        //小区 单选按钮监听
        $("#xqwy-community-radio").click(function () {
            $("#xqwy-city-bold").hide();
            $("#xqwy-area-section-bold").hide();
            $("#xqwy-community-bold").show();
            XQWYCommunity.communityTable = $('#xqwy-community-table').dataTable({
                "aaSorting": [[1, 'desc']],
                "aLengthMenu": [5, 10, 30, 50],
                "iDisplayLength": 5,
                "sDom": '<"row"<"col-xs-4"i><"col-xs-2"r><"col-xs-6"p>>t<"row"<"col-xs-5"l><"col-xs-7"p>>',
                "fnRowCallback": function (nRow, aData, iDisplayIndex) {
                    var code = aData["communityCode"];
                    var status = aData["status"];
                    var resource = aData["resource"];
                    $('td:eq(0)', nRow).html("<label><input type='checkbox' class='ace' value=\"" + code + "\"" + "/><span class='lbl'></span></label>");
                },
                "ajax": {
                    "url": contextPath + "/community/searchCommunitys",
                    "type": "POST",
                    "data": function (d) {
                        d.communityName =getElementValue('xqwy-community-search-communityName');
                        d.city = getElementValue('xqwy-community-city-select');
                        return d;
                    }
                },
                "aoColumns": [
                    {
                        "sWidth": "5%",
                        "bSortable": false,
                        "sTitle": '<input type="checkbox" class="ace" id="checkAllCommunity"/><span class="lbl"></span>',
                        "mData": "communityCode"
                    },
                    {
                        "sWidth": "10%",
                        "bSortable": false,
                        "iDataSort": "CODE",
                        "sTitle": "编号",
                        "mData": "communityCode"
                    },
                    {"sWidth": "10%", "bSortable": false, "iDataSort": "city", "sTitle": "城市", "mData": "city"},
                    {"sWidth": "15%", "bSortable": false, "iDataSort": "area", "sTitle": "区域", "mData": "area"},
                    {"sWidth": "15%", "bSortable": false, "iDataSort": "section", "sTitle": "板块", "mData": "section"},
                    {
                        "sWidth": "15%",
                        "bSortable": false,
                        "iDataSort": "communityName",
                        "sTitle": "小区名称",
                        "mData": "communityName"
                    }
                ]
            });
            var XQWYCommunityTableTool = $.createDataTableTools("xqwy-community-table", XQWYCommunity.communityTable);
        });
        //向结果集中添加区域或板块数据
        $("#xqwy-add-area-section-btn").click(function () {
            var cityVal = $("#xqwy-city-select").val();
            var areaVal = $("#xqwy-area-label-ul li[xqwy-attr='check']").text();
            var sectionObjs = $("#xqwy-area-section-body input[type=checkbox]:checked");
            if (sectionObjs.eq(0).val() == "全部") {
                XQWYCommunity.addResultItem("xqwy-area-result", cityVal + "-" + areaVal,"");
            } else if(sectionObjs.eq(0).val() == "全选") {
                for (var i = 1; i < sectionObjs.length; i++) {
                    XQWYCommunity.addResultItem("xqwy-section-result", cityVal + "-" + areaVal + "-" + sectionObjs.eq(i).val(),"");
                }
            }else{
                for (var i = 0; i < sectionObjs.length; i++) {
                    XQWYCommunity.addResultItem("xqwy-section-result", cityVal + "-" + areaVal + "-" + sectionObjs.eq(i).val(),"");
                }
            }

        });
        //区域点击事件监听
        $(document).on("click", "#xqwy-area-label-ul li", function () {
            var spanObjs=$("#xqwy-area-label-ul li");
            for(var j=0;j<spanObjs.length;j++){
                if(spanObjs.eq(j).find("span").hasClass('label-warning'))
                {
                    spanObjs.eq(j).find("span").removeClass('label-warning');
                    spanObjs.eq(j).removeAttr("xqwy-attr");
                }
            }
            $(this).find("span").removeClass("label-info");
            $(this).find("span").addClass("label-warning");
            $(this).attr({"xqwy-attr": "check"});
            $.ajax({
                url: contextPath + "/community/getSections",
                method: "post",
                dataType: "json",
                data: {"areaName": $(this).text(),
                        "city":$("#xqwy-city-select").val()},
                success: function (data) {
                    var sectionHtmlStr = "";

                    if (data.code == "SUCCESS") {
                        sectionHtmlStr += getCityOrSectionHtml("全部");
                        sectionHtmlStr += "<label style='margin-right: 5px'>"+
                            "<input type='checkbox' value='全选' id='checkAllSection'/>全选"+
                            "</label>"
                        for (var i = 0; i < data.data.length; i++) {
                            sectionHtmlStr += getCityOrSectionHtml(data.data[i]);
                        }
                        $("#xqwy-area-section-body").empty();
                        $("#xqwy-area-section-body").append(sectionHtmlStr);
                    }
                }
            });
        });
        //地区全部复选框选中事件监听
        $(document).on("click", "#xqwy-area-section-body input[value='全部']", function () {
            if ($(this).prop("checked")) {
                $("#xqwy-area-section-body input[type='checkbox']").attr('disabled', 'disabled');
                $(this).removeAttr('disabled');
            } else {
                $("#xqwy-area-section-body input[type='checkbox']").removeAttr('disabled');
            }
        });


        var checkBoxObj={};
        $("#xqwy-add-city-btn").click(function () {
            var checkCityObj = $("#xqwy-city-body input[type=checkbox]:checked");
            for (var i = 0; i < checkCityObj.length; i++) {
                XQWYCommunity.addResultItem("xqwy-city-result", checkCityObj.eq(i).val(),"");
            }
        });
        //向结果集中添加小区
        $("#xqwy-add-community-btn").click(function () {
            var checkCommunityRowData = getTableCheckRowData("xqwy-community-table",XQWYCommunity.communityTable);
            for (var i = 0; i < checkCommunityRowData.length; i++) {
                XQWYCommunity.addResultItem("xqwy-community-result",checkCommunityRowData[i].city+"-"+checkCommunityRowData[i].area+"-"+
                    checkCommunityRowData[i].section+"-"+checkCommunityRowData[i].communityName,checkCommunityRowData[i].communityCode);
            }
        });
        //搜索小区
        $("#xqwy-community-search-communityName-btn").click(function(){
            XQWYCommunity.communityTable._fnDraw();
        });

        function getCityOrSectionHtml(cityOrSection) {
            return "<label style='margin-right: 5px'>" +
                "<input type='checkbox' value='" + cityOrSection + "'/>" + cityOrSection +
                "</label>";
        }

        function getAreaHtml(area) {
            return "<li class='list-group-item' style='float: left;border: 0px;padding: 2px'>" +
                "<span class='label label-primary'>" + area + "</span>" +
                "</li>";
        }

        var cities = [];
    },
    resetResult: function () {
        $("#xqwy-city-result").empty();
        $("#xqwy-area-result").empty();
        $("#xqwy-section-result").empty();
        $("#xqwy-community-result").empty();
        XQWYCommunity.checkRowData = [];
    },
    createCommunityRow:function(itemValue,communityCode){
        var row = {};
        var rowElements = itemValue.split("-");
        if (rowElements.length == 1) {
            if(rowElements[0]=="全国"){
                row["city"] = "";
            }else{
                row["city"] = rowElements[0];
            }
            row["area"] = "";
            row["section"] = "";
            row["communityName"] = "";
            row["communityCode"] = communityCode;
        } else if (rowElements.length == 2) {
            row["city"] = rowElements[0];
            row["area"] = rowElements[1];
            row["section"] = "";
            row["communityName"] = "";
            row["communityCode"] = communityCode;
        } else if (rowElements.length == 3) {
            row["city"] = rowElements[0];
            row["area"] = rowElements[1];
            row["section"] = rowElements[2];
            row["communityName"] = "";
            row["communityCode"] = communityCode;
        } else if (rowElements.length == 4) {
            row["city"] = rowElements[0];
            row["area"] = rowElements[1];
            row["section"] = rowElements[2];
            row["communityName"] = rowElements[3];
            row["communityCode"] = communityCode;
        }
        return row;
    },
    indexFlag :0,
    addResultItem: function (resultDivId, itemValue,communityCode) {

        var row=XQWYCommunity.createCommunityRow(itemValue,communityCode);
        if (addResultRow(row)) {
            if(itemValue==""){
                itemValue="全国";
            }
            $("#" + resultDivId).append("<li class='search-choice' id='block-item" + XQWYCommunity.indexFlag + "'>" +
                "<span>" + itemValue + "</span><a class='search-choice-close' href='javascript:XQWYCommunity.clickClose(" + XQWYCommunity.indexFlag + ");'></a></li>");
            XQWYCommunity.indexFlag++;
        };
        function addResultRow(row) {
            var addFlag = true;
            var result = XQWYCommunity.checkRowData;
            if (result.length == 0) {
                result.push(row);
                return true;
            }
            for (var i = 0; i < result.length; i++) {
                if(row.city==""){
                    if(result[i].city==row.city){
                        addFlag=false;
                        break;
                    }
                } else if(row.communityCode == "" && row.section == "" && row.area == "") {
                    if ((result[i].city == row.city && result[i].area == "" && result[i].section == "" && result[i].communityCode == "")||result[i].city=="") {
                        addFlag = false;
                        break;
                    }
                } else if (row.communityCode == "" && row.section == "") {
                    if (result[i].city == row.city && result[i].area == row.area && result[i].section == "" && result[i].communityCode == "") {
                        addFlag = false;
                        break;
                    }
                } else if (row.communityCode == "") {
                    if (result[i].city == row.city && result[i].area == row.area && result[i].section == row.section && result[i].communityCode == "") {
                        addFlag = false;
                        break;
                    }
                } else {
                    if (result[i].city == row.city && result[i].area == row.area && result[i].section == row.section && result[i].communityCode == row.communityCode) {
                        addFlag = false;
                        break;
                    }
                }
            }
            if (addFlag) {
                result.push(row);
                return true;
            } else {
                return false;
            }
        }
    },
    addResultItemForUpdate:function(updateData){
        for(var i=0;i<updateData.length;i++){
            if((updateData[i].area==""||updateData[i].area==null)&&(updateData[i].section==""||updateData[i].section==null)
                &&(updateData[i].communityName==""||updateData[i].communityName==null)){
                XQWYCommunity.addResultItem("xqwy-city-result",updateData[i].city,"");
            }else if((updateData[i].section==""||updateData[i].section==null)
                &&(updateData[i].communityName==""||updateData[i].communityName==null)){
                XQWYCommunity.addResultItem("xqwy-area-result",updateData[i].city+"-"+updateData[i].area,"");
            }else if((updateData[i].communityName==""||updateData[i].communityName==null)){
                XQWYCommunity.addResultItem("xqwy-section-result",updateData[i].city+"-"+updateData[i].area+"-"+updateData[i].section,"");
            }else{
                XQWYCommunity.addResultItem("xqwy-community-result",
                    updateData[i].city+"-"+updateData[i].area+"-"+updateData[i].section+"-"+updateData[i].communityName,updateData[i].communityCode);
            }
        }
    },
    clickClose: function (id) {
        var resultData=XQWYCommunity.checkRowData;
        var rowObject=XQWYCommunity.createCommunityRow($("#block-item"+id+" span").text(),"");
        for(var i=0;i<XQWYCommunity.checkRowData.length;i++){
            if(XQWYCommunity.checkRowData[i].city==rowObject.city&&XQWYCommunity.checkRowData[i].area==rowObject.area
                &&XQWYCommunity.checkRowData[i].section==rowObject.section&&XQWYCommunity.checkRowData[i].communityName==rowObject.communityName){
                XQWYCommunity.checkRowData.splice(i,1);
            }
        }
        $("#block-item" + id).remove();
    }
};


