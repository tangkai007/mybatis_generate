jQuery.storeDialog ={
    open:function(callListener){
        this.loadData();

        var dialog = $("#ext-store-dialog").removeClass('hide').dialog({
            modal:true,
            width:900,
            height:680,
            title_html:true,
            close:function(){
                $(this).dialog("destroy");
                $("#ext-store-dialog").hide();
            },
            buttons:[
                {
                    text:"取消",
                    "class":"btn btn-xs",
                    click:function(){
                        $(this).dialog("destroy");
                        $("#ext-store-dialog").hide();
                    }
                },
                {
                    text:"确认",
                    "class":"btn btn-primary btn-xs",
                    click:function(){
                            var selectRadio=$("#storeList-table input[type='radio']:checked");
                            callListener(selectRadio.attr("codeVal"),selectRadio.attr("nameVal"));
                        $(this).dialog("destroy");
                        $("#ext-store-dialog").hide();
                    }
                }
            ]
        });
    },
    loadData:function(){
        var oTable =$('#storeList-table').dataTable(
            {
                "aaSorting":[
                    [1,'asc']
                ],
                "aLengthMenu":[10,20,30],
                "iDisplayLength":20,
                "ajax":{
                    "url":contextPath +"/store/search",
                    "type":"POST",
                    "data":function(d){
                        d.aliasName=getElementValue('store-search-storeAliasName');
                        d.city=getElementValue('store-search-city');
                        d.subCategoryId=getElementValue('store-edit-subCategoryId');
                        return d;
                    }
                },
                "aoColumns":[
                    {"sWidth":"6%","bSortable":false,"sTitle":"选择","mData":"code"},
                    {"sWidth":"7%","bSortable":true,"iDataSort":"ALIAS","sTitle":"商家唯一名","mData":"alias"},
                    {"sWidth":"7%","bSortable":true,"iDataSort":"CITY","sTitle":"城市","mData":"city"},
                    {"sWidth":"7%","bSortable":false,"sTitle":"二级类目名称","mData":"subCategoryName"}
                ],
                "fnRowCallback":function(nRow,aData,iDisplayIndex){
                    var code= aData["code"];
                    var storeName=aData["name"];
                        $('td:eq(0)',nRow).html("<label><input type='radio' name='codeRadio' class='ace' " +
                        "nameVal=\""+storeName+"\" codeVal=\""+code+"\" /><span class='lbl'></span></label>");
                }
            }
        );

        $("#store-search-query-button").click(function(){
           oTable._fnDraw();
        });

        $("#store-search-clear-button").click(function(){
            $("#storeDialog-search-form")[0].reset();
        });
    }

};























