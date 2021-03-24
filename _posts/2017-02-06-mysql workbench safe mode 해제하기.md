# mysql workbench safe mode 해제하기



워크벤치를 매번 깔때마다 발생하는 문제여서 매번 찾기도 귀찮고..
이것은 mysql workbench에서 쿼리로 update나 delete가 한방에 안되는 경우에 할 설정이다.

workbench 6.3 기준

Edit -> Preferences ->SQL Editor -> 맨 아래 “Safe Updates”. Forbid UPDATEs and DELETEs with…….어쩌구 하는 부분 체크 해제.
그다음 워크벤치 끄고 다시 접속.