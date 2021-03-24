---
layout: post
title: robomongo 설치하기
categories: centos mongodb
tags: centos mongodb
--

# robomongo 설치하기



mongo db gui tool인 robomongo설치하기.

걍 https://robomongo.org/ 여기서 다운받고 설치하면 끝이다

그런데 로컬의 경우는 별다른 설정없이 바로 연결이 될텐데 remote의 경우 약간 수정할 부분이 있다.
그냥 연결하면 바로 연결이 안될것이다. (unreachable 오류 발생)

/etc/mongod.conf 내용중 bind_ip부분을 주석 처리 해주어야 한다.