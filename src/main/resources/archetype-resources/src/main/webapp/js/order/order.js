jQuery(function ($) {
    $(document).on("mouseover mouseout", ".dfc", function (event) {
        if (event.type == "mouseover") {
            $(this).find(".dfc_tips").show();
        } else if (event.type == "mouseout") {
            $(this).find(".dfc_tips").hide();
        }
    });


    var orderTable = $('#order-table').dataTable({
        "aaSorting": [[1, 'desc']],
        "aLengthMenu": [10, 30, 50],
        "iDisplayLength": 30,
        "sDom": '<"row"<"col-xs-4"i><"col-xs-2"r><"col-xs-6"p>>t<"row"<"col-xs-5"l><"col-xs-7"p>>',
        "fnRowCallback": function (nRow, aData, iDisplayIndex) {
            var id = aData["orderCode"];
            $('td:eq(0)', nRow).html("<label><input type='checkbox' class='ace' value=\"" + id + "\"" + "/><span class='lbl'></span></label>");
            $(nRow).dblclick(function () {
                $(this).closest('table').find('tbody > tr').each(function () {
                    var row = this;
                    orderTableTool.fnDeselect(row);
                });
                orderTableTool.fnSelect(nRow);
                var editButton = $("#order-update-btn");
                editButton.trigger("click");
            });
            var storeCode = aData["storeCode"];
            var storeName = aData["storeName"];
            var storeUrl = "<a target='_blank' href='" + contextPath + "/store/storeDetail?storeCode=" + storeCode + "' >" + storeName + "<\/a>";
            $('td:eq(9)', nRow).html(storeUrl);

            //用户姓名
            var contactName = aData["contactName"];
            if (contactName != null && contactName.trim().length > 4) {
                var defaultContactName = contactName.substring(0, 4);
                var html = '<div  class="dfc">' + defaultContactName + '<div class="dfc_tips"><b style="display:block;"></b>' + contactName + '</div> </div>';
                $('td:eq(2)', nRow).html(html);
            } else {
                $('td:eq(2)', nRow).html(contactName);
            }

            //下单商品明细
            var orderItems = aData["orderItemsDtoList"];
            var orderItemDataJson = getOrderItemData(orderItems);
            if (orderItemDataJson != null) {
                if (orderItemDataJson.title.trim().length < 12) {
                    $('td:eq(6)', nRow).html(orderItemDataJson.context);
                } else {
                    var defaultOrderItem = orderItemDataJson.title.substring(0, 12);
                    var html = '<div  class="dfc">' + defaultOrderItem + '<div class="dfc_tips"><b style="display:block;"></b>' + orderItemDataJson.context + '</div> </div>';
                    $('td:eq(6)', nRow).html(html);
                }
            }

            //订单城市
            var orderCity = aData["city"];
            if (orderCity != null && orderCity.trim().length > 3) {
                var defaultOrderCity = orderCity.substring(0, 3);
                var html = '<div  class="dfc">' + defaultOrderCity + '<div class="dfc_tips"><b style="display:block;"></b>' + orderCity + '</div> </div>';
                $('td:eq(10)', nRow).html(html);
            } else {
                $('td:eq(10)', nRow).html(orderCity);
            }

            //客服备注
            var transferAccountsRemark = aData["transferAccountsRemark"];
            if (transferAccountsRemark != null && transferAccountsRemark.trim().length > 10) {
                var transferAccountRemarkStr = transferAccountsRemark.substring(0, 10);
                var len = transferAccountsRemark.length;
                var showContext = "";
                for (var i = 0; i < len; i++) {
                    if (i % 10 == 0) {
                        showContext += transferAccountsRemark.substr(i, 10) + "</br>";
                    }
                }
                var html = '<div  class="dfc">' + transferAccountRemarkStr + '<div class="dfc_tips"><b style="display:block;"></b>' + showContext + '</div> </div>';
                $('td:eq(12)', nRow).html(html);
            } else {
                $('td:eq(12)', nRow).html(transferAccountsRemark);
            }

            //已取消订单灰掉文字
            var orderStatus = aData["orderStatus"];
            if (orderStatus == 500) {
                $(nRow).css("color", "darkgrey");
            }
        },
        "ajax": {
            "url": contextPath + "/order/search",
            "type": "POST",
            "data": function (d) {
                var orderCode = getElementValue('order-search-orderCode');
                if (isNotBlank(orderCode)) {
                    d.orderCode = orderCode;
                }
                var storeName = getElementValue('order-search-storeName');
                if (isNotBlank(storeName)) {
                    d.storeName = storeName;
                }
                var orderStartTime = getElementValue('order-search-orderStartTime');
                if (isNotBlank(orderStartTime)) {
                    d.orderStartTime = orderStartTime + " 00:00:00";
                }
                var orderEndTime = getElementValue('order-search-orderEndTime');
                if (isNotBlank(orderEndTime)) {
                    d.orderEndTime = orderEndTime + " 23:59:59";
                }
                var categoryId = getElementValue('order-search-categoryId');
                if (isNotBlank(categoryId)) {
                    d.categoryId = categoryId;
                }
                var city = getElementValue('order-search-city');
                if (isNotBlank(city)) {
                    d.city = city;
                }
                var orderSuccessStartTime = getElementValue('order-search-orderSuccessStartTime');
                if (isNotBlank(orderSuccessStartTime)) {
                    d.orderSuccessStartTime = orderSuccessStartTime + " 00:00:00";
                }
                var orderSuccessEndTime = getElementValue('order-search-orderSuccessEndTime');
                if (isNotBlank(orderSuccessEndTime)) {
                    d.orderSuccessEndTime = orderSuccessEndTime + " 23:59:59";
                }
                var phone = getElementValue('order-search-phone');
                if (isNotBlank(phone)) {
                    d.phone = phone;
                }
                var orderStatus = getElementValue('order-search-orderStatus');
                if (isNotBlank(orderStatus)) {
                    d.orderStatus = orderStatus
                }
                var closeAccountStatus = getElementValue('order-search-closeAccount');
                if (isNotBlank(closeAccountStatus)) {
                    d.closeAccountStatus = closeAccountStatus;
                }
                var contactName = getElementValue('order-search-contactName');
                if (isNotBlank(contactName)) {
                    d.contactName = contactName;
                }
                var address = getElementValue('order-search-address');
                if (isNotBlank(address)) {
                    d.address = address;
                }
                return d;
            }
        },
        "aoColumns": [{
            "sWidth": "2%",
            "bSortable": false,
            "sTitle": '<input type="checkbox" class="ace" /><span class="lbl"></span>',
            "mData": "orderCode"
        }, {
            "sWidth": "4%",
            "bSortable": true,
            "iDataSort": "T.ORDER_CODE",
            "sTitle": "订单编号",
            "mData": "orderCode",
            "mRender": orderCodeRender
        }, {
            "sWidth": "4%",
            "bSortable": false,
            "sTitle": "用户姓名",
            "mData": "contactName"
        }, {
            "sWidth": "7%",
            "bSortable": true,
            "iDataSort": "T.ADDRESS",
            "sTitle": "下单地址",
            "mData": "address"
        }, {
            "sWidth": "5%",
            "bSortable": false,
            "sTitle": "订单电话",
            "mData": "tel"
        }, {
            "sWidth": "7%",
            "bSortable": true,
            "iDataSort": "T.CREATE_DT",
            "sTitle": "下单时间",
            "mData": "createDt",
            "mRender": datetimeRender
        }, {
            "sWidth": "8%",
            "bSortable": false,
            "sTitle": "下单商品明细",
            "mData": "orderItemsDtoList"
        }, {
            "sWidth": "4%",
            "bSortable": true,
            "iDataSort": "T.ONLINE_PAYMENT_PRICE",
            "sTitle": "实际支付",
            "mData": "onlinePaymentPrice"
        }, {
            "sWidth": "5%",
            "bSortable": true,
            "iDataSort": "T.COUPON_FEES",
            "sTitle": "优惠总金额",
            "mData": "couponFees"
        }, {
            "sWidth": "4%",
            "bSortable": false,
            "sTitle": "商家名称",
            "mData": "storeName"
        }, {
            "sWidth": "4%",
            "bSortable": false,
            "sTitle": "订单城市",
            "mData": "city"
        }, {
            "sWidth": "4%",
            "bSortable": true,
            "iDataSort": "T.ORDER_STATUS",
            "sTitle": "订单状态",
            "mData": "orderStatus",
            "mRender": orderRender
        }, {
            "sWidth": "7%",
            "bSortable": false,
            "sTitle": "客服备注",
            "mData": "transferAccountsRemark"
        }, {
            "sWidth": "4%",
            "bSortable": false,
            "sTitle": "二级类目",
            "mData": "categoryName"
        }, {
            "sWidth": "7%",
            "bSortable": true,
            "iDataSort": "T.FINISH_TIME",
            "sTitle": "完成时间",
            "mData": "finishTime",
            "mRender": datetimeRender
        }, {
            "sWidth": "4%",
            "bSortable": false,
            "iDataSoft": 'CLOSE_ACCOUNT_STATUS',
            "sTitle": "结算状态",
            "mData": "closeAccountStatus",
            "mRender": closeAccountRender
        }]
    });

    var orderTableTool = $.createDataTableTools("order-table", orderTable);


    $("#order-search-query-button").click(function () {
        orderTable._fnDraw();
    });

    $("#order-search-clear-button").click(function () {
        $("#order-search-form")[0].reset();
    });


    $("#order-batch-start-button").click(function () {
        var checkItems = $.dataTableCheckedItem("order-table", "至少选择一列订单列表数据!");
        if (checkItems) {
            $("#batchCloseAccount-order-dialog").removeAttr("hide");

            var batchCloseAccountDialog = $.showDialogWithButton("batchCloseAccount-order-dialog", 400, "批量处理结算", "确定", function () {
                var orderCodes = [];
                checkItems.each(function () {
                    orderCodes.push($(this).val());
                });

                var closeAccountStatus = $("#batchCloseAccount-order-status").val();

                $.ajax({
                    url: contextPath + "/order/batchCloseAccount",
                    method: 'POST',
                    data: {
                        "orderIds": orderCodes.toString(),
                        "closeAccountStatus": closeAccountStatus
                    },
                    success: function (data) {
                        if (data.data == true) {
                            alert("批量结算成功!");
                            batchCloseAccountDialog.dialog("close");
                            orderTable._fnDraw();
                        } else {
                            alert("批量结算失败!错误原因:" + data.message);
                        }
                    },
                    error: function (err) {
                        alert("批量操作异常" + err);
                    }
                });
            }, "取消", function () {
                $(this).dialog("close");
            });
        }
    });
});

/**
 * 校验不为空
 * @param target
 * @returns {boolean}
 */
function isNotBlank(target) {
    if (target != null && target.length > 0) {
        return true;
    }
    return false;
}

/**
 * 订单状态
 * @param orderStatus
 * @returns {*}
 */
function orderRender(orderStatus) {
    if (orderStatus == null || orderStatus.length == 0) return "未知状态";
    if (orderStatus == -1) return "支付失败";
    if (orderStatus == 0) return "未支付";
    if (orderStatus == 50) return "支付中";
    if (orderStatus == 100) return "已支付";
    if (orderStatus == 200) return "待退款";
    if (orderStatus == 300) return "退款中";
    if (orderStatus == 400) return "已退款";
    if (orderStatus == 500) return "已取消";
    if (orderStatus == 600) return "待配送/待服务";
    if (orderStatus == 700) return "已完成";
    if (orderStatus == 1000) return "未下单";
    if (orderStatus == 2000) return "待商家确认";
    if (orderStatus == 3000) return "商家已确认";
    return "异常状态";
}

/**
 * 结算状态
 * @param closeAccountStatus
 */
function closeAccountRender(closeAccountStatus) {
    if (closeAccountStatus == null || closeAccountStatus.length == 0) return "未知结算";
    if (closeAccountStatus == 0) return "未结算";
    if (closeAccountStatus == 1) return "已结算";
    return "异常结算";
}

/**
 *  获取订单详情的数据
 * @param orderItemList
 */
function getOrderItemData(orderItemList) {
    if (orderItemList == null || orderItemList.length == 0) return;
    var itemLength = orderItemList.length;
    var orderItemJson = {};
    var title = "";
    var context = "";
    for (var i = 0; i < itemLength; i++) {
        var tempContext = "";
        tempContext += orderItemList[i].serviceName + "、";
        tempContext += orderItemList[i].quantity + "、";
        tempContext += orderItemList[i].salesPrice;
        title += tempContext;
        context += tempContext + "\<br/>";
    }
    orderItemJson.title = title;
    orderItemJson.context = context;
    return orderItemJson;
}


/**
 * 订单编号返回
 * @param orderCode
 * @returns {string}
 */
function orderCodeRender(orderCode) {
    //订单编号 只显示数字
    var orderCodeNumber = orderCode.substring(11, orderCode.length);
    var a_text = "<a class='orderCode_a' href='" + contextPath + "/order/orderItem?orderCode=" + orderCode + "'>" + orderCodeNumber + "<\/a>";
    return a_text;
}

function createDialog(text) {
    var diag = new Dialog();
    diag.Width = 500;
    diag.Height = 200;
    diag.Title = "订单详情";
    diag.InnerHtml = '<div style="text-indent: 2px;text-align:center;color:#000000;font-size:14px;">' + text + '</div>'
    diag.OKEvent = function () {
        diag.close();
    };//点击确定后调用的方法
    diag.show();
}

