<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isErrorPage="true" %>
<%@ include file="taglibs.jsp" %>
<c:set value="${pageContext.request.contextPath}" var="contextPath" scope="request"/>

<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <title>权限管理系统</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <!-- basic styles -->
    <link href="${contextPath}/assets/css/bootstrap.min.css" rel="stylesheet"/>
    <link rel="stylesheet" href="${contextPath}/assets/css/font-awesome.min.css"/>

    <!--[if IE 7]>
    <link rel="stylesheet" href="${contextPath}/assets/css/font-awesome-ie7.min.css"/>
    <![endif]-->

    <!-- page specific plugin styles -->
    <link rel="stylesheet" href="${contextPath}/assets/css/jquery-ui-1.10.3.full.min.css"/>

    <!-- fonts -->

    <!-- ace styles -->

    <link rel="stylesheet" href="${contextPath}/assets/css/ace.css"/>
    <link rel="stylesheet" href="${contextPath}/assets/css/ace-rtl.min.css"/>
    <link rel="stylesheet" href="${contextPath}/assets/css/ace-skins.min.css"/>

    <!--[if lte IE 8]>
    <link rel="stylesheet" href="${contextPath}/assets/css/ace-ie.min.css"/>
    <![endif]-->

    <!-- inline styles related to this page -->

    <!-- ace settings handler -->

    <script src="${contextPath}/assets/js/ace-extra.min.js"></script>

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->

    <!--[if lt IE 9]>
    <script src="${contextPath}/assets/js/html5shiv.js"></script>
    <script src="${contextPath}/assets/js/respond.min.js"></script>
    <![endif]-->
</head>
<body>

<div class="row">
    <div class="col-xs-12">
        <!-- PAGE CONTENT BEGINS -->

        <div class="error-container">
            <div class="well">
                <h1 class="grey lighter smaller">
					<span class="blue bigger-125">
						<i class="icon-random"></i>
						500
					</span>
                    Internal Server Error
                </h1>

                <hr>
                <h3 class="lighter smaller">
                    系统错误:<%=exception.getMessage()%>
                </h3>

                <hr>
                <div class="space"></div>

                <div class="center">
                    <a class="btn btn-grey" href="#" onclick="history.back();">
                        <i class="icon-arrow-left"></i>
                        返回
                    </a>
                    <a href="${contextPath}/" class="btn btn-primary">
                        <i class="icon-desktop"></i>
                        重新登录
                    </a>
                </div>
            </div>
        </div>

        <!-- PAGE CONTENT ENDS -->
    </div>

</div>
<!-- /.row -->

<!-- basic scripts -->

<!--[if !IE]> -->
<script src="${contextPath}/assets/js/jquery-1.10.2.min.js?version=fc0dfd0f4a33a21e021397c54ab4d317"></script>

<!-- <![endif]-->

<!--[if IE]>
<script src="${contextPath}/assets/js/jquery-2.0.3.min.js?version=fc0dfd0f4a33a21e021397c54ab4d317"></script>
<![endif]-->

<!--[if !IE]> -->

<script type="text/javascript">
    window.jQuery || document.write("<script src='${contextPath}/assets/js/jquery-2.0.3.min.js'>" + "<" + "script>");
</script>

<!-- <![endif]-->

<!--[if IE]>
<script type="text/javascript">
    window.jQuery || document.write("<script src='${contextPath}/assets/js/jquery-1.10.2.min.js'>" + "<" + "script>");
</script>
<![endif]-->

<script src="${contextPath}/assets/js/jquery-ui-1.10.3.custom.min.js?version=fc0dfd0f4a33a21e021397c54ab4d317"></script>

<!-- ace scripts -->
<script src="${contextPath}/assets/js/ace-elements.min.js?version=fc0dfd0f4a33a21e021397c54ab4d317"></script>
<script src="${contextPath}/assets/js/ace.min.js?version=fc0dfd0f4a33a21e021397c54ab4d317"></script>

<!-- inline scripts related to this page -->
<script type="text/javascript">
    jQuery(function ($) {
        //绑定跳转

        //UI组件初始化


    })
</script>

</body>
</html>


