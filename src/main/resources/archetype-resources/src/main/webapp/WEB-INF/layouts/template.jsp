<%@ page language="java" pageEncoding="UTF-8" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="../common/taglibs.jsp" %>
<c:set value="${pageContext.request.contextPath}" var="contextPath"
       scope="request"/>

<!DOCTYPE html>
<html lang="zh-CN">
<link rel="shortcut icon" href="${contextPath}/images/shortcut.ico"/>
<head>
    <base href="${contextPath}">
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title>运营管理系统</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0"/>

    <link rel="stylesheet" href="${contextPath}/assets/css/bootstrap.css"/>
    <link rel="stylesheet" href="${contextPath}/assets/css/font-awesome.css"/>
    <link rel="stylesheet" href="${contextPath}/assets/css/jquery-ui.css"/>
    <link rel="stylesheet" href="${contextPath}/assets/css/jquery-ui.custom.css"/>
    <link rel="stylesheet" href="${contextPath}/assets/css/chosen.css"/>
    <link rel="stylesheet" href="${contextPath}/assets/css/datepicker.css"/>
    <link rel="stylesheet" href="${contextPath}/assets/css/bootstrap-timepicker.css"/>
    <link rel="stylesheet" href="${contextPath}/assets/css/daterangepicker.css"/>
    <link rel="stylesheet" href="${contextPath}/assets/css/bootstrap-datetimepicker.css"/>
    <link rel="stylesheet" href="${contextPath}/assets/css/colorpicker.css"/>
    <link rel="stylesheet" href="${contextPath}/assets/css/ace-fonts.css"/>
    <link rel="stylesheet" href="${contextPath}/assets/css/ace.css" class="ace-main-stylesheet" id="main-ace-style"/>
    <link rel="stylesheet" type="text/css" href="${contextPath}/css/theme/webuploader.css">
    <link rel="stylesheet" type="text/css" href="${contextPath}/css/theme/diyUpload.css">

    <!-- Bootstrap Core CSS -->
    <link href="${contextPath}/static/css/bootstrap.min.css" rel="stylesheet">
    <%--<!-- Custom CSS -->--%>
    <link href="${contextPath}/static/css/sb-admin.css" rel="stylesheet">
    <%--<!-- Morris Charts CSS -->--%>
    <link href="${contextPath}/static/css/plugins/morris.css" rel="stylesheet">
    <%--<!-- Custom Fonts -->--%>
    <link href="${contextPath}/static/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">



    <script src="${contextPath}/assets/js/ace-extra.js"></script>


    <script type="text/javascript">
        window.jQuery || document.write("<script src='${contextPath}/assets/js/jquery.js'>" + "<" + "/script>");
    </script>
    <script type="text/javascript">
        if ('ontouchstart' in document.documentElement) document.write("<script src='${contextPath}/assets/js/jquery.mobile.custom.js'>" + "<" + "/script>");
    </script>
    <!-- jQuery -->
    <%--<script src="${contextPath}/static/js/jquery.js"></script>--%>

    <!-- Bootstrap Core JavaScript -->
    <%--<script src="${contextPath}/static/js/bootstrap.min.js"></script>--%>
    <script src="${contextPath}/assets/js/bootstrap.js"></script>
    <script src="${contextPath}/assets/js/jquery-ui.custom.js"></script>
    <script src="${contextPath}/assets/js/jquery.ui.touch-punch.js"></script>
    <script src="${contextPath}/assets/js/chosen.jquery.js"></script>
    <script src="${contextPath}/assets/js/fuelux/fuelux.spinner.js"></script>

    <script src="${contextPath}/assets/js/date-time/bootstrap-timepicker.js"></script>
    <script src="${contextPath}/assets/js/date-time/moment.js"></script>
    <script src="${contextPath}/assets/js/date-time/daterangepicker.js"></script>
    <script src="${contextPath}/assets/js/date-time/bootstrap-datetimepicker.js"></script>
    <script src="${contextPath}/assets/js/bootstrap-colorpicker.js"></script>
    <script src="${contextPath}/assets/js/jquery.knob.js"></script>
    <script src="${contextPath}/assets/js/jquery.autosize.js"></script>
    <script src="${contextPath}/assets/js/jquery.inputlimiter.1.3.1.js"></script>
    <script src="${contextPath}/assets/js/jquery.maskedinput.js"></script>
    <script src="${contextPath}/assets/js/bootstrap-tag.js"></script>
    <script src="${contextPath}/assets/js/ace/elements.scroller.js"></script>
    <script src="${contextPath}/assets/js/ace/elements.colorpicker.js"></script>
    <script src="${contextPath}/assets/js/ace/elements.fileinput.js"></script>
    <script src="${contextPath}/assets/js/ace/elements.typeahead.js"></script>
    <script src="${contextPath}/assets/js/ace/elements.wysiwyg.js"></script>
    <script src="${contextPath}/assets/js/ace/elements.spinner.js"></script>
    <script src="${contextPath}/assets/js/ace/elements.treeview.js"></script>
    <script src="${contextPath}/assets/js/ace/elements.wizard.js"></script>
    <script src="${contextPath}/assets/js/ace/elements.aside.js"></script>
    <script src="${contextPath}/assets/js/ace/ace.js"></script>
    <script src="${contextPath}/assets/js/ace/ace.ajax-content.js"></script>
    <script src="${contextPath}/assets/js/ace/ace.touch-drag.js"></script>
    <script src="${contextPath}/assets/js/ace/ace.sidebar.js"></script>
    <script src="${contextPath}/assets/js/ace/ace.sidebar-scroll-1.js"></script>
    <script src="${contextPath}/assets/js/ace/ace.submenu-hover.js"></script>
    <script src="${contextPath}/assets/js/ace/ace.widget-box.js"></script>
    <script src="${contextPath}/assets/js/ace/ace.settings.js"></script>
    <script src="${contextPath}/assets/js/ace/ace.settings-rtl.js"></script>
    <script src="${contextPath}/assets/js/ace/ace.settings-skin.js"></script>
    <script src="${contextPath}/assets/js/ace/ace.widget-on-reload.js"></script>
    <script src="${contextPath}/assets/js/ace/ace.searchbox-autocomplete.js"></script>

    <script src="${contextPath}/assets/js/dataTables/jquery.dataTables.js "></script>
    <script src="${contextPath}/assets/js/dataTables/jquery.dataTables.bootstrap.js"></script>
    <script src="${contextPath}/assets/js/dataTables/extensions/TableTools/js/dataTables.tableTools.js"></script>
    <script src="${contextPath}/assets/js/dataTables/extensions/ColVis/js/dataTables.colVis.js"></script>

    <script src="${contextPath}/assets/js/jquery-ui.js"></script>
    <script src="${contextPath}/assets/js/jquery.ui.touch-punch.js"></script>
    <script src="${contextPath}/assets/js/date-time/bootstrap-datepicker.js"></script>
    <%--<script src="${contextPath}/assets/js/jquery.validate.js"></script>--%>
    <%--<script src="${contextPath}/js/common/jquery.validate.custom.js"></script>--%>
    <%--<script src="${contextPath}/assets/js/bootbox.js"></script>--%>

    <script src="${contextPath}/js/common/global.js"></script>
    <script src="${contextPath}/js/common/dialog.js"></script>
    <script src="${contextPath}/js/common/dataTableHelper.js"></script>

    <!-- 时间控件 -->
    <script src="${contextPath}/assets/datepick/WdatePicker.js" charset="utf-8"></script>
    <script src="${contextPath}/js/common/diyUpload.js" charset="utf-8"></script>
    <script src="${contextPath}/js/common/webuploader.html5only.min.js" charset="utf-8"></script>
    <script src="${contextPath}/js/common/ajaxfileupload.js" charset="utf-8"></script>



    <script type="text/javascript">
        String.prototype.endsWith = function (pattern) {
            var d = this.length - pattern.length;
            return d >= 0 && this.lastIndexOf(pattern) === d;
        };
        $(function () {
            var url = window.location.href;
            $("#menu-nav-list .submenu > li").each(function () {
                var hrefSrc = $(this).children().first().attr('href');
                if (url.endsWith(hrefSrc)) {
                    $(this).addClass('active');
                    $(this).parent().parent().addClass('active open');
                }
            });
        })
    </script>
    <script type="text/javascript">
        var contextPath = "${contextPath}";
        var success = "SUCCESS", error = "ERROR";
    </script>
    <style>
        .show {
            display: block;
        }

        .my-dialog .ui-dialog-title, .my-dialog .ui-dialog-titlebar-close {
            display: none;
        }
    </style>
</head>
<body>
<div id="wrapper">

    <!-- Navigation -->
    <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="index.html">SB Admin</a>
        </div>
        <!-- Top Menu Items -->
        <ul class="nav navbar-right top-nav">
            <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-envelope"></i> <b class="caret"></b></a>
                <ul class="dropdown-menu message-dropdown">
                    <li class="message-preview">
                        <a href="#">
                            <div class="media">
                                    <span class="pull-left">
                                        <img class="media-object" src="http://placehold.it/50x50" alt="">
                                    </span>
                                <div class="media-body">
                                    <h5 class="media-heading"><strong>John Smith</strong>
                                    </h5>
                                    <p class="small text-muted"><i class="fa fa-clock-o"></i> Yesterday at 4:32 PM</p>
                                    <p>Lorem ipsum dolor sit amet, consectetur...</p>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li class="message-preview">
                        <a href="#">
                            <div class="media">
                                    <span class="pull-left">
                                        <img class="media-object" src="http://placehold.it/50x50" alt="">
                                    </span>
                                <div class="media-body">
                                    <h5 class="media-heading"><strong>John Smith</strong>
                                    </h5>
                                    <p class="small text-muted"><i class="fa fa-clock-o"></i> Yesterday at 4:32 PM</p>
                                    <p>Lorem ipsum dolor sit amet, consectetur...</p>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li class="message-preview">
                        <a href="#">
                            <div class="media">
                                    <span class="pull-left">
                                        <img class="media-object" src="http://placehold.it/50x50" alt="">
                                    </span>
                                <div class="media-body">
                                    <h5 class="media-heading"><strong>John Smith</strong>
                                    </h5>
                                    <p class="small text-muted"><i class="fa fa-clock-o"></i> Yesterday at 4:32 PM</p>
                                    <p>Lorem ipsum dolor sit amet, consectetur...</p>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li class="message-footer">
                        <a href="#">Read All New Messages</a>
                    </li>
                </ul>
            </li>
            <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-bell"></i> <b class="caret"></b></a>
                <ul class="dropdown-menu alert-dropdown">
                    <li>
                        <a href="#">Alert Name <span class="label label-default">Alert Badge</span></a>
                    </li>
                    <li>
                        <a href="#">Alert Name <span class="label label-primary">Alert Badge</span></a>
                    </li>
                    <li>
                        <a href="#">Alert Name <span class="label label-success">Alert Badge</span></a>
                    </li>
                    <li>
                        <a href="#">Alert Name <span class="label label-info">Alert Badge</span></a>
                    </li>
                    <li>
                        <a href="#">Alert Name <span class="label label-warning">Alert Badge</span></a>
                    </li>
                    <li>
                        <a href="#">Alert Name <span class="label label-danger">Alert Badge</span></a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="#">View All</a>
                    </li>
                </ul>
            </li>
            <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-user"></i> John Smith <b class="caret"></b></a>
                <ul class="dropdown-menu">
                    <li>
                        <a href="#"><i class="fa fa-fw fa-user"></i> Profile</a>
                    </li>
                    <li>
                        <a href="#"><i class="fa fa-fw fa-envelope"></i> Inbox</a>
                    </li>
                    <li>
                        <a href="#"><i class="fa fa-fw fa-gear"></i> Settings</a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="#"><i class="fa fa-fw fa-power-off"></i> Log Out</a>
                    </li>
                </ul>
            </li>
        </ul>
        <!-- Sidebar Menu Items - These collapse to the responsive navigation menu on small screens -->
        <div class="collapse navbar-collapse navbar-ex1-collapse">
            <ul class="nav navbar-nav side-nav">
                <li class="active">
                    <a href="${contextPath}/user/userInfo.do"><i class="fa fa-fw fa-dashboard"></i>用户中心</a>
                </li>
                <li>
                    <a href="${contextPath}/company/company.do"><i class="fa fa-fw fa-bar-chart-o"></i>公司信息</a>
                </li>
                <li>
                    <a href="${contextPath}/trans/transInfo.do"><i class="fa fa-fw fa-table"></i>交易信息</a>
                </li>
                <%--<li>--%>
                    <%--<a href="forms.html"><i class="fa fa-fw fa-edit"></i> Forms</a>--%>
                <%--</li>--%>
                <%--<li>--%>
                    <%--<a href="bootstrap-elements.html"><i class="fa fa-fw fa-desktop"></i> Bootstrap Elements</a>--%>
                <%--</li>--%>
                <%--<li>--%>
                    <%--<a href="bootstrap-grid.html"><i class="fa fa-fw fa-wrench"></i> Bootstrap Grid</a>--%>
                <%--</li>--%>
                <%--<li>--%>
                    <%--<a href="javascript:;" data-toggle="collapse" data-target="#demo"><i class="fa fa-fw fa-arrows-v"></i> Dropdown <i class="fa fa-fw fa-caret-down"></i></a>--%>
                    <%--<ul id="demo" class="collapse">--%>
                        <%--<li>--%>
                            <%--<a href="#">Dropdown Item</a>--%>
                        <%--</li>--%>
                        <%--<li>--%>
                            <%--<a href="#">Dropdown Item</a>--%>
                        <%--</li>--%>
                    <%--</ul>--%>
                <%--</li>--%>
                <%--<li>--%>
                    <%--<a href="blank-page.html"><i class="fa fa-fw fa-file"></i> Blank Page</a>--%>
                <%--</li>--%>
                <%--<li>--%>
                    <%--<a href="index-rtl.html"><i class="fa fa-fw fa-dashboard"></i> RTL Dashboard</a>--%>
                <%--</li>--%>
            </ul>
        </div>
        <!-- /.navbar-collapse -->
    </nav>

    <%--页面内容信息--%>
    <div id="page-wrapper">
        <tiles:insertAttribute name="content"/>
    </div>
<!-- /#wrapper -->
<!-- Morris Charts JavaScript -->
<%--<script src="${contextPath}/static/js/plugins/morris/raphael.min.js"></script>--%>
<%--<script src="${contextPath}/static/js/plugins/morris/morris.min.js"></script>--%>
<%--<script src="${contextPath}/static/js/plugins/morris/morris-data.js"></script>--%>

</body>
</body>
</html>

