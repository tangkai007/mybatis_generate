<%@ page language="java" pageEncoding="UTF-8" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="../common/taglibs.jsp" %>

<div id="dialog-edit-pwd" class="hide">
    <form id="edit-pwd-form" class="form-horizontal" role="form"
          method="post"
          style="width: auto; min-height: 34px; max-height: none; height: auto;">
        <div class="form-group">
            <label class="col-sm-4 control-label col-xs-12  no-padding-right">用户名:</label>

            <div class="col-xs-12 col-sm-6">
                <div style="margin-top: 5px;">
                    <shiro:principal type="java.lang.String"/>
                    <input type="hidden" name="userName" id="userName"
                           value="<shiro:principal type="java.lang.String"/>"/>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label col-xs-12  no-padding-right"
                   for="password">原密码*:</label>

            <div class="col-xs-12 col-sm-8">
                <div class="clearfix">
                    <input type="password" name="password" id="password"/>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label col-xs-12  no-padding-right"
                   for="newPassword">新密码*:</label>

            <div class="col-xs-12 col-sm-8">
                <div class="clearfix">
                    <input type="password" name="newPassword" id="newPassword"/>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label col-xs-12  no-padding-right"
                   for="confirmNewPassword">确认新密码*:</label>

            <div class="col-xs-12 col-sm-8">
                <div class="clearfix">
                    <input type="password" name="confirmNewPassword"
                           id="confirmNewPassword"/>
                </div>
            </div>
        </div>
    </form>
</div>