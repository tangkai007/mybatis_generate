/**
 * Created by ZuoMJ on 15/4/18.
 */
function getElementValue(id) {
    return $("#" + id).val();
}

function getValue(id) {
    return $(id).val();
}


function setElementValue(id, value) {
    return $("#" + id).val(value);
}

function isBlank(value) {
    if (null == value || "" == this.trim(value) || '' == this.trim(value)) {
        return true;
    }
    return false;
}

function isNumber(value) {
    var s = value;
    var gz = /^[+-]?[0-9.,，;]*$/;
    return gz.test(s);
}

function trim(value) {
    return value.replace(/(^\s*)|(\s*$)/g, "");
}

function dateRender(d) {
    if (!d || d == '') {
        return "";
    }
    var datetime = new Date(d);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    return year + "-" + month + "-" + date;
}

function datetimeRender(d) {
    if (!d || d == '') {
        return "";
    }
    var datetime = new Date(d);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}

function datetimeFormat(d) {
    if (!d || d == '') {
        return "";
    }
    var datetime = new Date(d);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    return year + "-" + month + "-" + date;
}


getTableCheckRowData = function (tableId, dataTableObject) {
    var rowOjbs = $.dataTableCheckedItem(tableId,"您没有选择要操作的纪录");
    var rowDatas = dataTableObject.fnSettings().aoData;
    var resultRowData = [];
    for (var i = 0; rowOjbs.length > i; i++) {
        for (var j = 0; rowDatas.length > j; j++) {
            if (rowOjbs.eq(i).val() == rowDatas[j]._aData.communityCode) {
                resultRowData.push(rowDatas[j]._aData);
                break;
            }
        }
    }

    return resultRowData;
}


function addBorder(id) {
    $(id).css("border", "1px solid red");
}
function removeBorder(id) {
    $(id).css("border", "");
}

function removeFormInputBorders(formId) {
    $(formId).find("input").each(function(index,element){
        $(this).css("border", "");
    });

}

function removeFormSelectBorders(formId) {
    $(formId).find("select").each(function(index,element){
        $(this).css("border", "");
    });
}

function removeFormLabelBorders(formId) {
    $(formId).find("label").each(function(index,element){
        $(this).css("border", "");
    });
}

function removeFormTextAreaBorders(formId) {
    $(formId).find("textarea").each(function(index,element){
       $(this).css("border","");
    });
}

