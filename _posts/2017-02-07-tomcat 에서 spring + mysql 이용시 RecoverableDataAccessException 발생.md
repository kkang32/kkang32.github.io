---
layout: post
title: tomcat 에서 spring + mysql 이용시 RecoverableDataAccessException 발생
categories: spring
tags: spring
--


# tomcat 에서 spring + mysql 이용시 RecoverableDataAccessException 발생



datasource 에 아래 property를 추가해준다.

```xml
<property name="validationQuery">
<value>SELECT 1</value>
</property>
<property name="testWhileIdle">
<value>true</value>
</property>
```



