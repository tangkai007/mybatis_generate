jQuery.baiduMapDialog = {
    open: function (callListener, lng, lat) {
        $("#community-baiduMap-search-form")[0].reset();
        var dialog = $("#community-baiduMap-dialog").removeClass('hide').dialog({
            modal: true,
            width: 700,
            height: 820,
            title_html: true,
            buttons: [
                {
                    text: "取消",
                    "class": "btn btn-xs",
                    click: function () {
                        $(this).dialog("close");
                    }
                },
                {
                    text: "确认",
                    "class": "btn btn-primary btn-xs",
                    click: function () {
                        var mapWindow = window.frames["baiduMap"].window;
                        callListener(mapWindow["pointLng"], mapWindow["pointLat"]);
                        $(this).dialog("close");
                    }
                }
            ]
        });

        window.setTimeout(location, 2000);
        function location(){
            var mapWindow = window.frames["baiduMap"].window;
            mapWindow.theLocation(lng,lat);
        }
        
        $("#community-baiduMap-search-clear-button").click(function(){
            $("#community-baiduMap-search-form")[0].reset();
        });

        $("#community-baiduMap-search-query-button").click(function(){
            var mapWindow = window.frames["baiduMap"].window;
            var city = $("#community-baiduMap-search-city").val();
            var address = $("#community-baiduMap-search-address").val();
            if(city && address){
                mapWindow.getLocationByAddress(city,address);
            }else if (city){
                mapWindow["map"].centerAndZoom(city,15);
            }else if(address){
                mapWindow.getLocationByAddress("上海",address);
            }else{
                mapWindow["map"].centerAndZoom("上海",15);
            }
        });
    }
};


