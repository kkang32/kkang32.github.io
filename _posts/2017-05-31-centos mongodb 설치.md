# centos mongodb 설치



아래 커맨드 차례대로 입력(압축파일 내려받아서 설치하려다가 그냥 yum으로 설치함..)

```shell
yum install mongodb mongodb-server
service mongod start
service mongod status
```

mongo(아래 > 부분 입력 확인)

```shell
MongoDB shell version: 2.6.12
connecting to: test
Server has startup warnings: 
2017-05-31T11:04:31.896+0900 [initandlisten] 
2017-05-31T11:04:31.896+0900 [initandlisten] ** WARNING: Readahead for /var/lib/mongodb is set to 4096KB
2017-05-31T11:04:31.896+0900 [initandlisten] **          We suggest setting it to 256KB (512 sectors) or less
2017-05-31T11:04:31.896+0900 [initandlisten] **          http://dochub.mongodb.org/core/readahead
> db
test
> use db
switched to db db
> exit
bye
```

