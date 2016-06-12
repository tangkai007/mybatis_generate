/**
 * 跳转至商家详情页面
 * @param storeCode
 */
function openStoreItem(storeCode) {
    window.location.href = contextPath + "/store/storeDetail?storeCode=" + storeCode;

}

function isNotBlank(target) {
    return target != null && target.length > 0;
}
//定义取消原因的全局变量
var cancelReason = "";

/**
 * 页面初始化加载
 */
$(function () {
    $("#order-complete-opt-button").click(function () {
        var requestJson = {};
        var orderCode = $("#orderCode").val();
        requestJson.orderCode = orderCode;
        var orderStatus = $("#order-opt-status").val();
        if (isNotBlank(orderStatus)) {
            requestJson.orderStatus = orderStatus;
        }
        var closeAccountStatus = $("#order-opt-closeAccount").val();
        if (isNotBlank(closeAccountStatus)) {
            requestJson.closeAccountStatus = closeAccountStatus;
        }
        var orderUserName = $("#order-user-name").val();
        if (isNotBlank(orderUserName)) {
            requestJson.contactName = orderUserName;
        }
        var orderUserPhone = $("#order-user-phone").val();
        if (isNotBlank(orderUserPhone)) {
            requestJson.tel = orderUserPhone;
        }
        var orderUserAddress = $("#order-user-address").val();
        if (isNotBlank(orderUserAddress)) {
            requestJson.address = orderUserAddress;
        }
        var transferAccountsMessage = $("#order-user-transfer").val();
        if (isNotBlank(transferAccountsMessage)) {
            requestJson.transferAccountsMessage = transferAccountsMessage;
        }
        var transferAccountsRemark = $("#order-optUser-remark").val();
        if (isNotBlank(transferAccountsRemark)) {
            requestJson.transferAccountsRemark = transferAccountsRemark;
        }
        var closeAccountPrice = $("#order-store-closeAccount").val();
        if (isNotBlank(closeAccountPrice)) {
            requestJson.closeAccountPrice = closeAccountPrice;
        }

        var userSpecialNeeds = $("#order-user-specialNeeds").val();
        if (isNotBlank(userSpecialNeeds)) {
            requestJson.userSpecialNeeds = userSpecialNeeds;
        }

        if (isNotBlank(cancelReason)) {
            requestJson.cancelReason = cancelReason;
        }

        $.ajax({
            url: contextPath + "/order/completeOrderOperation",
            method: 'POST',
            data: requestJson,
            success: function (data) {
                if (data.code == "SUCCESS") {
                    window.location.reload();
                } else {
                    alert(data.message);
                }
            },
            error: function (err) {
                alert("出错了!" + err);
            }
        });
    });

    $("#order-opt-status").change(function () {
        var orderStatus = $(this).children('option:selected').text();
        if (orderStatus == "退款中" || orderStatus == "取消订单") {
            var dialog = $.showDialogWithButton("order_cancelReason_dialog", 400, "取消原因", "确定", function () {
                var selfOtherCancelReason = $("#cancelReasonOther").val();
                if (isNotBlank(selfOtherCancelReason)) {
                    cancelReason = selfOtherCancelReason;
                } else {
                    cancelReason = $("input[name='cancelReason']:checked ").val();
                }
                if (!isNotBlank(cancelReason)) {
                    alert("必须要选择或填写一个取消原因!");
                    return;
                }
                dialog.dialog('close');
            }, "取消", function () {
                dialog.dialog("close");
            });
        }
    });


});