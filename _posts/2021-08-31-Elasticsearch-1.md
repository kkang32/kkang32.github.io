---
layout: post
title: Elasticsearch - 1
categories: java elasticsearch kibana
tags: java elasticsearch kibana
---

# Elasticsearch - 1

- https://www.elastic.co/guide/en/elasticsearch/reference/current/getting-started.html

## 설치

- jdk는 내부에 있는 jdk를 사용하지만 JAVA_HOME에 설정된 jdk가 있으면 그걸 사용하게된다.
  - jdk 8이상 사용권장
  - 아래 커맨드로 목록에 나오는거 아무거나 설치하자
    - yum list java*
    - yum list java\*devel\*
- 설치

`/etc/yum.repos.d/` 로 이동

`elasticsearch.repo` 파일 생성 아래 내용입력

```shell
[elasticsearch]
name=Elasticsearch repository for 7.x packages
baseurl=https://artifacts.elastic.co/packages/7.x/yum
gpgcheck=1
gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
enabled=0
autorefresh=1
type=rpm-md
```

yum 으로 설치 진행

```sh
sudo yum install --enablerepo=elasticsearch elasticsearch
```

포트 변경이 필요할 경우

`/etc/elasticsearch/elasticsearch.yml`에서 `http.port` 항목을 수정한다.



시스템 부팅시마다 자동으로 elasticsearch실행하도록 설정

```sh
sudo chkconfig --add elasticsearch
```

서비스 시작/중지

```sh
sudo -i service elasticsearch start
sudo -i service elasticsearch stop
```

로그는 `/var/log/elasticsearch/`에서 확인

## API확인

```shell
[root@localhost bin]# curl -X GET http://localhost:9200
{
  "name" : "localhost.localdomain",
  "cluster_name" : "elasticsearch",
  "cluster_uuid" : "----------------",
  "version" : {
    "number" : "7.14.0",
    "build_flavor" : "default",
    "build_type" : "rpm",
    "build_hash" : "------------------",
    "build_date" : "2021-07-29T20:49:32.864135063Z",
    "build_snapshot" : false,
    "lucene_version" : "8.9.0",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

## Kibana설치

- https://www.elastic.co/guide/kr/kibana/current/install.html 에서 환경별로 확인

- 나는 RPM설치

- 공개키가져오기

  - ```sh
    rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch
    ```

- 리포지토리 설정

  - ```sh
    [kibana-7.x]
    name=Kibana repository for 5.x packages
    baseurl=https://artifacts.elastic.co/packages/7.x/yum
    gpgcheck=1
    gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
    enabled=1
    autorefresh=1
    type=rpm-md
    ```

- 인스톨

  - ```sh
    sudo yum install kibana
    ```

- 시스템 부팅시 키바나 자동 실행

  - ```sh
    chkconfig --add kibana
    ```

- 서비스 시작/종료

  - ```sh
    service kibana start
    service kibana stop
    ```

- 설정파일
  - /etc/kibana/kibana.yml
    - 기본포트는 5601

## Add data

-  샘플로 검색이 가능하도록 인덱스에 문서를 저장해본다.

```sh
curl -X POST "localhost:9200/logs-my_app-default/_doc?pretty" -H 'Content-Type: application/json' -d'
{
  "@timestamp": "2099-05-06T16:21:15.000Z",
  "event": {
    "original": "192.0.2.42 - - [06/May/2099:16:21:15 +0000] \"GET /images/bg.jpg HTTP/1.0\" 200 24736"
  }
}
'
```

then

```sh
{
  "_index" : ".ds-logs-my_app-default-2021.08.30-000001",
  "_type" : "_doc",
  "_id" : "XpGKl3sBGXH2dHc1symD",
  "_version" : 1,
  "result" : "created",
  "_shards" : {
    "total" : 2,
    "successful" : 1,
    "failed" : 0
  },
  "_seq_no" : 0,
  "_primary_term" : 1
}
```

