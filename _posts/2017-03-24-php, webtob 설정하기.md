# php, webtob 설정하기



php서버 셋팅할일이 생겨서 고군분투끝에 성공하여 기록을 남김

환경 :
– php5.x
– webtob 4.1
– windows

1. webtob 4.1설치
   a. https://technet.tmaxsoft.com/ko/front/download/findDownloadList.do?cmProductCode=0102 접속(로그인필요)
   b. 제일 상단에 있는 최신 버전을 설치(4.1)
   c. 설정변경없이 기본설정으로 설치 진행
   d. 그리고 사이트에서 데모용 인증서를 받는다. 다운받는 사이트 LNB쪽에 보면 보라색버튼으로 “데모라이선스 신청” 이라고 있다. 여기서 신청하면 메일로 라이선스 파일이 오는데 해당 파일을 C:\TmaxSoft\WebtoB4.1\license 에 복붙한다. 호스트네임은 명령창에 host라고 치면 나오는것을 적어준다.
   e. 환경변수 WEBTPBDIR을 만들고 C:\TmaxSoft\WebtoB4.1 으로 설정후 path에 추가해준다.(%WEBTPBDIR%\bin)

2. webtob 환경설정

   a.기본설치경로인 C:\TmaxSoft\WebtoB4.1내의 config폴더의 http.m 편집

   b.기본설정에서 아래 붉은색 부분을 추가/변경함.

   c.f : VHOST의 경우 포트를 변경하여 추가적으로 사이트를 운영하고자 하는경우 설정한다.

   

   ```
   *DOMAIN
   webtob1
   
   *NODE
   test-PC WEBTOBDIR="C:/TmaxSoft/WebtoB4.1", 
    SHMKEY = 54000,
    DOCROOT="C:/TmaxSoft/WebtoB4.1/docs",
    PORT = "8080", 
    HTH = 1,
    NODENAME = "$(NODENAME)",
    ERRORDOCUMENT = "503",
    #Options="IgnoreExpect100Continue",
    #JSVPORT = 9900,
    LOGGING = "log1",
    ERRORLOG = "log2",
    SYSLOG = "syslog"
   ```

   *VHOSTvhost1 DOCROOT=”새로운 프로젝트 경로”, PORT = “8081”, ERRORDOCUMENT = “503”, HostName=”localhost”, #Options=”IgnoreExpect100Continue”, #JSVPORT = 9900, LOGGING = “log1_1”, ERRORLOG = “log2_1”, IndexName=”index.php”

   ```
   *SVRGROUP
   htmlg NODENAME = "test-PC", SVRTYPE = HTML
   cgig NODENAME = "test-PC", SVRTYPE = CGI
   ssig NODENAME = "test-PC", SVRTYPE = SSI
   ```

   phpg NODENAME = “test-PC”, SVRTYPE = PHP, ScriptLoc = “PHP55/php-cgi.exe”phpg2 NODENAME = “test-PC”, SVRTYPE = PHP, ScriptLoc = “PHP55/php-cgi.exe”, VhostName = vhost1

   ```
   *SERVER
   html SVGNAME = htmlg, MinProc = 2, MaxProc = 10, ASQCount = 1 
   cgi SVGNAME = cgig, MinProc = 2, MaxProc = 10, ASQCount = 1 
   ssi SVGNAME = ssig, MinProc = 2, MaxProc = 10, ASQCount = 1 
   ```

   php SVGNAME = phpg, MinProc = 3, MaxProc = 10php2 SVGNAME = phpg2, MinProc = 3, MaxProc = 10

   ```
   *URI
   uri1 Uri = "/cgi-bin/", Svrtype = CGI
   
   *ALIAS
   alias1 URI = "/cgi-bin/", RealPath = "C:/TmaxSoft/WebtoB4.1/cgi-bin/"
   
   *LOGGING
   syslog Format = "SYSLOG", FileName = "C:/TmaxSoft/WebtoB4.1/log/system.log_%M%%D%%Y%",
    Option = "sync"
   log1 Format = "DEFAULT", FileName = "C:/TmaxSoft/WebtoB4.1/log/access.log_%M%%D%%Y%", 
    Option = "sync"
   log2 Format = "ERROR", FileName = "C:/TmaxSoft/WebtoB4.1/log/error.log_%M%%D%%Y%", 
    Option = "sync"
   ```

   syslog2 Format = “SYSLOG”, FileName = “C:/TmaxSoft/WebtoB4.1/log/system.log_%M%%D%%Y%”, Option = “sync”log1_1 Format = “DEFAULT”, FileName = “C:/TmaxSoft/WebtoB4.1/log/access.log_%M%%D%%Y%”, Option = “sync”log2_1 Format = “ERROR”, FileName = “C:/TmaxSoft/WebtoB4.1/log/error.log_%M%%D%%Y%”, Option = “sync”

   ```
   *ERRORDOCUMENT
   503 status = 503,
    url = "/503.html"
   
   *EXT
   htm MimeType = "text/html", SvrType = HTML
   ```

   php MimeType = “application/x-httpd-php”, SvrType = PHPphp3 MimeType = “application/x-httpd-php3”, SvrType = PHPhtml MimeType = “text/html”, SvrType = HTMLhwp MimeType = “application/x-hwp”, SvrType = HTMLpdf MimeType = “application/x-pdf”, SVRTYPE = HTMLcss MimeType = “text/css”, SvrType = HTMLjs MimeType = “application/x-javascript”, SvrType = HTMLgul MimeType = “application/gul”, SvrType = HTMLgif MimeType = “image/gif”, SvrType=HTMLpng MimeType = “image/png”, SvrType=HTMLjpeg MimeType = “image/jpeg”, SvrType=HTMLjpg MimeType = “image/jpg”, SvrType=HTMLzip MimeType = “application/zip”, SvrType=HTMLjar MimeType = “application/x-java-archive”, SvrType=HTMLexe MimeType = “application/octet-stream”, SvrType=HTMLwml MimeType = “application/vnd.wap.wml”, SvrType=HTMLwmls MimeType = “application/vnd.wap.wmlscript”, SvrType=HTMLwmlc MimeType = “application/vnd.wap.wmlc”, SvrType=HTMLwmlsc MimeType = “application/vnd.wap.wmlscript”, SvrType=HTMLwbmp MimeType = “application/vnd.wap.wbmp”, SvrType=HTMLswf MimeType = “application/x-shockwave-flash”, SvrType=HTMLcsv MimeType = “application/octet-stream”, SvrType=HTMLxml MimeType = “text/html”, SvrType = HTMLasd MimeType = “application/astound”,SvrType=HTMLasn MimeType = “application/astound”,SvrType=HTMLdoc MimeType = “application/msword”,SvrType=HTMLwiz MimeType = “application/msword”,SvrType=HTMLrtf MimeType = “application/msword”,SvrType=HTMLxls MimeType = “application/vnd.ms-excel”,SvrType=HTMLxlw MimeType = “application/vnd.ms-excel”,SvrType=HTMLxla MimeType = “application/vnd.ms-excel”,SvrType=HTMLxlc MimeType = “application/vnd.ms-excel”,SvrType=HTMLxlm MimeType = “application/vnd.ms-excel”,SvrType=HTMLxlt MimeType = “application/vnd.ms-excel”,SvrType=HTMLppt MimeType = “application/vnd.ms-powerpoint”,SvrType=HTMLpps MimeType = “application/vnd.ms-powerpoint”,SvrType=HTMLpot MimeType = “application/vnd.ms-powerpoint”,SvrType=HTMLm13 MimeType = “application/x-msmediaview”,SvrType=HTMLm14 MimeType = “application/x-msmediaview”,SvrType=HTMLwmf MimeType = “application/x-msmetafile”,SvrType=HTMLmidi MimeType = “audio/midi”,SvrType=HTMLmid MimeType = “audio/midi”,SvrType=HTMLaif MimeType = “audio/x-aiff”,SvrType=HTMLaiff MimeType = “audio/x-aiff”,SvrType=HTMLaifc MimeType = “audio/x-aiff”,SvrType=HTMLwav MimeType = “audio/x-wav”,SvrType=HTMLcab MimeType = “x-application/octet-stream”, SvrType = HTMLfla MimeType = “application/x-fla”, SvrType=HTML

3. PHP설정

   a. 

   http://windows.php.net/download

   에서 다운받는다. 17년 3월말 기준으로 5.6까지 있는데 이전 버전을 받고 싶으면 

   http://windows.php.net/downloads/releases/archives/

    

   에서 내려 받자.

   b. 압축파일을 내려받고 압축 해제후 압축해제된 폴더를 webtob하위로 옮겨놓는다.

   (C:\TmaxSoft\WebtoB4.1\PHP55)

   c. 이제 폴더내의 php.ini를 수정해야 하는데, 이파일이 없다. 잘보면 php.ini-development, php.ini-production 으로 나뉘어져 있는데 이중에 development파일의 이름을 php.ini로 변경한다. 그리고 아래부분을 찾아서 변경한다

   *PHP시작태그 간소화(<?으로 시작할수 있게함)*

   

   ```
   short_open_tag = Off  ->  short_open_tag = On
   ```

   *에러로그가 화면에 보이는것을 막아줌*

   ```
   error_reporting = E_ALL   ->  error_reporting = E_ALL & ~E_NOTICE & ~E_STRICT & ~E_DEPRECATED
   ```

   *php에서 사용하는 라이브러리들 위치를 지정해줌.*

   ```
   ; extension_dir = "ext"   ->  extension_dir = "C:/TmaxSoft/WebtoB4.1/PHP55/ext"
   ```

   *아래 세미콜론 삭제(mysql 에 접속하기위함임)*

   ```
   ;extension=php_mbstring.dll
   ;extension=php_exif.dll ; Must be after mbstring as it depends on it
   ;extension=php_mysql.dll
   ;extension=php_mysqli.dll
   ;extension=php_pdo_mysql.dll
   ```

   d. 이후 php.ini를 c:\windows안으로 복사해준다. phpinfo()를 찍어보면 php.ini 경로가 windows안쪽으로 설정이 되어있다.
   e. 파일을 옮기기 싫으면… 레지스트리를 건드려본다.(안해도 된다. d까지만 해도 된다)
   win+r -> regedit -> HKEY_LOCAL_MACHINE ->PHP
   iniFilePath값을 C:\TmaxSoft\WebtoB4.1\PHP55 으로 설정

4. 서버 구동
   a. 앞서 설정했던 http.m을 컴파일(?)해준다.(해당 파일 수정이 발생했을경우 항상 실행해준다.그리고 항상 관리자 권한으로 콘솔창을 열어야 한다. 안그러면 CFL0004 오류가 발생한다.)
   wscfl -i http.m
   b. wsboot으로 웹서버를 구동한다.(종료 : wsdown)
   c. localhost:8080으로 접속해서 확인한다.