@echo ARW-APP
@echo �Զ�������apk�ű�
::path1Ϊ��Ŀ����·��
set path1="C:\Users\RookieZz\Desktop\Company-project\hengan\react\exchangeApp"
::path2Ϊ��Ӧcordova��Ŀ����·��
set path2="C:\Users\RookieZz\Desktop\Company-project\hengan\cordova\ARW.EX"
::path3Ϊjdk��װĿ¼
set path3="C:\Program Files\Java\jdk1.8.0_151\bin"

@echo Դ��Ŀ�����ʼ
call cd %path1%
call npm run build:arworld
@echo ���ƴ���õ��ļ���cordova��
call xcopy %path1%\build %path2%\www /s /y
@echo ��ʼ���APK
call cd %path2%
call cordova build --release android
@echo �ƶ�apk�ļ��ص�Դ��Ŀ��
call xcopy %path2%\platforms\android\build\outputs\apk\android-release-unsigned.apk %path2% /y
@echo �ƶ���sdk�½��д��
call xcopy %path2%\android-release-unsigned.apk %path3% /y
call cd %path3%
@echo ɾ��֮ǰ��name.apk
call del name_unsigned.apk name.apk
@echo ������
call ren android-release-unsigned.apk name_unsigned.apk
@echo ǩ��
call jarsigner -verbose -keystore name.keystore -signedjar name.apk name_unsigned.apk name.keystore
@echo �ƻ�Դ��ĿĿ¼
call xcopy %path3%\name.apk %path1% /y








