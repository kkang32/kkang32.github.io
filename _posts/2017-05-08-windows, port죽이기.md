# windows, port죽이기



이클립스에서 tomcat띄워놓고 디버깅하다가 가끔 말을 안들어서 강제종료시켰을경우 쓰던 포트를 못쓰는 상태가 될때가 있다.

아래의 절차로 죽여보자

C:\Users\kkangsk>**netstat -nao | findstr 8080**
TCP 0.0.0.0:8080 0.0.0.0:0 LISTENING **12364**
TCP [::]:8080 [::]:0 LISTENING 12364
TCP [::1]:8080 [::1]:50662 TIME_WAIT 0

C:\Users\kkangsk>**tasklist | findstr 12364**
javaw.exe 12364 Console 1 636,224 K

C:\Users\kkangsk>**taskkill /f /pid 12364**
성공: 프로세스(PID 12364)가 종료되었습니다.