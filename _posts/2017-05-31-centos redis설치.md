# centos redis설치



```shell
rpm -Uvh https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
yum –enablerepo=epel,remi install redis
systemctl restart redis.service
systemctl enable redis.service
```



