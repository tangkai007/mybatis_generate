# mybatis_generate
mybatis自动生成的maven骨架
#一、简介
1.对maven骨架的学习
2.使用maven骨架生成一个项目的通用demo方便后面的开发操作

#二、项目的使用
1.首先下载项目
2.在本地执行命令 mvn eclipse:eclipse  
3.将项目导入到eclipse中执行 mvn clean install
4.执行完成上面的命令之后，在想要创建项目demo的目录执行下面的命令:
mvn archetype:generate -DarchetypeCatalog=local

5.命令行会显示出请选择的界面：
1: local -> com.ytx:my-archetype-mybatisGen (my-archetype-mybatisGen)
Choose a number or apply filter (format: [groupId:]artifactId, case sensitive contains): :

输入我们自己的骨架编号1
项目本身设置的有默认的组织名，项目名，版本号，如果输入y则直接生成项目，如果输入n则输入对应的组织名，项目名，版本号
