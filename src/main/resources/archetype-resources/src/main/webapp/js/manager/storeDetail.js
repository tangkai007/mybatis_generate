jQuery(function ($) {
    //基础
    XQWYCommunity.initCommunityBind();

    $("#storeForm_alias").focus(function(){
        $("#validateResult").html("");
    });

    $("form .store_form_save_button").click(function () {

        validateStoreName();
        if($("#validateResult").html() != ''){
            $.alertDialog("商家唯一名存在！");
            return false;
        }

        if(validateStoreForm()){
            $("#storeForm").submit();
        }else{
            $.alertDialog("商家必填信息为空,请查看标记项");
        }
    });
    $("form .store_form_back_button").click(function () {
        window.location.href=contextPath + "/store";
    });

    $("#basic_next_button").click(function () {
        $("a[href='#operation_info']").trigger("click");
    });


    //运营
    $("#operation_previous_button").click(function () {
        $("a[href='#basic_info']").trigger("click");
    });
    $("#operation_next_button").click(function () {
        $("a[href='#cooperation_info']").trigger("click");
    });

    //合作
    $("#cooperation_previous_button").click(function () {
        $("a[href='#operation_info']").trigger("click");
    });
    $("#cooperation_next_button").click(function () {
        $("a[href='#contact_info']").trigger("click");
    });

    //联系方式
    $("#contact_previous_button").click(function () {
        $("a[href='#cooperation_info']").trigger("click");
    });
    $("#contact_next_button").click(function () {
        $("a[href='#settle_info']").trigger("click");
    });

    //商家结算
    $("#settle_previous_button").click(function () {
        $("a[href='#contact_info']").trigger("click");
    });
    $("#settle_next_button").click(function () {
        $("a[href='#coupon_info']").trigger("click");
    });

    //优惠券
    $("#coupon_previous_button").click(function () {
        $("a[href='#settle_info']").trigger("click");
    });

    //初始化模板
    changeServiceTypeTemplate();
});


function onchangeFormCity(city){
    if(!city){
        $("#storeForm_area").html("<option value=''>请选择</option>");
        $("#storeForm_section").html("<option value=''>请选择</option>");
        return;
    }
    $.ajax({
        url: contextPath + "/store/areaList",
        type: "post",
        data: {
            "city": city
        },
        async:false,
        success: function (data, textStatus, jqXHR) {
            if (data.code == 'SUCCESS') {
                $("#storeForm_area").html("<option value=''>请选择</option>");
                $("#storeForm_section").html("<option value=''>请选择</option>");
                var areaList = data.data;
                for(var index in areaList){
                    var area = areaList[index];
                    $("#storeForm_area").append("<option value="+ area+">"+area+"</option>");
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

function onchangeFormArea(area){
    if(!area){
        $("#storeForm_section").html("<option value=''>请选择</option>");
    }
    $.ajax({
        url: contextPath + "/store/sectionList",
        type: "post",
        data: {
            "area": area,
            "city": getElementValue("storeForm_city")
        },
        async:false,
        success: function (data, textStatus, jqXHR) {
            if (data.code == 'SUCCESS') {
                $("#storeForm_section").html("<option value=''>请选择</option>");
                var sectionList = data.data;
                for(var index in sectionList){
                    var section = sectionList[index];
                    $("#storeForm_section").append("<option value="+ section+">"+section+"</option>");
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


function showMap(){
    $.getScript(contextPath + "/js/common/communityBaiduMap.js", function () {
        $.baiduMapDialog.open(getLocationInfoAdd,$("#storeForm_longitude").val(),$("#storeForm_latitude").val());
    });
}

function getLocationInfoAdd(pointLng,pointLat){
    $("#storeForm_longitude").val(pointLng);
    $("#storeForm_latitude").val(pointLat);
}

//***********************************************************
function changeServiceTypeTemplate(){
    var template =  $("select[name='storeServiceTypeTemplate']").val();

    $("div .row").each(function(index,element){
        var attr = $(element).attr("templateVal");
        if(attr){
            $(element).hide();
        }
        if(attr && attr.indexOf(template) !=-1){
            $(element).show();
        }
    });

    if(template == 'RETAIL'){
        $("#storeForm_onSiteFees_label").html("<star>*</star>起送金额(元)");
    }
    if(template == 'SERVE'){
        $("#storeForm_onSiteFees_label").html("<star>*</star>最低消费");
    }

}

function validateStoreName(){
    var alias = $("#storeForm_alias").val();
    var storeCode = $("#id_storeCode").val();
    if(alias){
        $.ajax({
            url:contextPath + "/store/validateStoreName",
            type: "post",
            async: false,
            data: {
                "alias":alias,
                "storeCode":storeCode},
            success:function(data,textStatus,jqXHR){
             if(data.code == 'SUCCESS'){

             }else{
                 $("#validateResult").html(data.message);
                 $("#validateResult").css("color","red");
                 return false;
             }
            },
            error:function(jqXHR,textStatus,errorThrown){
                $.alertDialog("服务器异常，请联系管理员！");
            }
        })
    }
}
function validateStoreForm(){
    removeFormInputBorders("#storeForm");
    removeFormSelectBorders("#storeForm");
    removeFormLabelBorders("#storeForm");

    var validate =true;
    if(blankAndBorder("input","name")){
        validate = false;
    }
    if(blankAndBorder("select","city")){
        validate = false;
    }
    if(blankAndBorder("input","phone")){
        validate = false;
    }
    if(blankAndBorder("textarea","description")){
        validate = false;
    }
    if(!$("#storeLogoFlag").val() && blankAndBorder("input","storeLogo")  ){
        validate = false;
    }

    //运营
    if(blankAndBorder("select","subCategoryId")){
        validate = false;
    }
    if(isBlank($("#storeForm").find("input[name='matchingType']:checked ").val())){
        validate = false;
        addBorder($("#storeForm").find("input[name='matchingType']").eq(0).parent("label"))
        addBorder($("#storeForm").find("input[name='matchingType']").eq(1).parent("label"))
    }
    if($("#storeForm").find("input[name='matchingType']:checked ").val() =='RADIUS'){
        if(blankAndBorder("input","matchingRadius")){
            validate = false;
        }
        if(blankAndBorder("input","longitude") || blankAndBorder("input","latitude")){
            validate = false;
            addBorder("#storeForm_Map_label")
        }
    }

    //零售
    if("RETAIL" == $("#storeForm_template").val()){

        if(blankAndBorder("select","dayBegin")){
            validate = false;
        }
        if(blankAndBorder("select","dayEnd")){
            validate = false;
        }
        if(blankAndBorder("select","hourBegin")){
            validate = false;
        }
        if(blankAndBorder("select","hourEnd")){
            validate = false;
        }
        if(blankAndBorder("input","onSiteFees")){
            validate = false;
        }
        if(blankAndBorder("input","deliveryFees")){
            validate = false;
        }

        if(!$("#storeForm").find("input[name='sendFeeFlagArray']:checked ").val()){
            blankAndBorder("input","sendFees");
        }

    }else if("SERVE" == $("#storeForm_template").val()){
        if(blankAndBorder("select","dayBegin")){
            validate = false;
        }
        if(blankAndBorder("select","dayEnd")){
            validate = false;
        }
        if(blankAndBorder("select","hourBegin")){
            validate = false;
        }
        if(blankAndBorder("select","hourEnd")){
            validate = false;
        }
        if(blankAndBorder("input","deliveryTime")){
            validate = false;
        }
        if(blankAndBorder("input","onSiteFees")){
            validate = false;
        }

    }else if("YELLOW" == $("#storeForm_template").val()){
        if(blankAndBorder("select","dayBegin")){
            validate = false;
        }
        if(blankAndBorder("select","dayEnd")){
            validate = false;
        }
        if(blankAndBorder("select","hourBegin")){
            validate = false;
        }
        if(blankAndBorder("select","hourEnd")){
            validate = false;
        }

        if(isBlank($("#storeForm").find("input[name='phone1']").val()) && isBlank($("#storeForm").find("input[name='phone2']").val())){
            addBorder($("#storeForm").find("input[name='phone1']"));
            addBorder($("#storeForm").find("input[name='phone2']"));
            validate = false;
        }

    }else if("H5" == $("#storeForm_template").val()){
        if(blankAndBorder("input","accessOrderUrl")){
            validate = false;
        }
        if(blankAndBorder("input","accessUrl")){
            validate = false;
        }
    }

    //合作信息
    if(isBlank($("#storeForm").find("input[name='cooperationType']:checked ").val())){
        validate = false;
    }

    return validate;
}

function blankAndBorder(type,name){
    if(isBlank($("#storeForm").find(type+"[name='"+name+"']").val())){
        addBorder($("#storeForm").find(type+"[name='"+name+"']"));
        console.log("type:"+type+"  name:"+name)
        return true;
    }
    return false
}