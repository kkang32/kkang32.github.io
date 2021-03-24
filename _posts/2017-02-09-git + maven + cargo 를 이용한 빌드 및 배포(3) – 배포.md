---
layout: post
title: git + maven + cargo 를 이용한 빌드 및 배포(3) – 배포
categories: git maven
tags: git maven
--

# git + maven + cargo 를 이용한 빌드 및 배포(3) – 배포



프로젝트가 있는 곳으로 가서

빌드수행
**mvn -Dmaven.test.skip=true install**

배포 수행
**mvn cargo:redeploy**

완료.

이제 각 사용자들이 자신의 코드를 수정하고 commit하고 push하고 그러한 것들을 모아서 서버에서 빌드를 수행한 후 배포하면 된다.
이러한 작업들을 스크립트를 작성하여 좀더 단순화해보자.

사용자들이 commit/push하는거야 각자 알아서 하게 두면 될것이고, 서버에서 git에 있는 소스를 꺼내어 빌드를 수행하고 배포하는것을 스크립트로 작성하겠다.
전문가는 아니기에 내가 편하게 작성하였다.

지금 나의 환경은 메이븐과 git이 한개의 서버에 있고 tomcat이 원격지에 있는 상태이다.

빌드용 디렉토리를 하나 만든다.
**mkdir /home/build**

빌드 스크립트를 만든다.
**cd /home**
**vi build.sh**

```shell
#디렉토리 비워주기
rm -rf /home/build/*
#빌드하려고 하는 프로젝트의 git디렉토리로 이동
cd /home/project.git
#소스들을 꺼내어 빌드용 디렉토리로 이동시킨다.
git archive master | tar -x -C /home/build
#잘 옮겨졌나?
ls -al /home/build/project
#옮겨진 디렉토리로 이동한다.
cd /home/build/project
#빌드를 수행한다. 추가옵션으로는 테스트를 수행하지 않는것으로 하였다.
mvn -Dmaven.test.skip=true install
#메이븐의 deploy기능을 써보려다가 안되서 포기한 흔적. mvn deploy -DrepositoryId=internal.repo
#디플로이 수행
mvn cargo:redeploy
```

아마 sh파일이 권한이 없을것이다.
**chmod 755 build.sh**

 