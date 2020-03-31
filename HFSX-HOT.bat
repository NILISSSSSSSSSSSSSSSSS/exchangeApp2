@echo HFSX-APP
@echo 自动化生产apk脚本
::path1为项目绝对路径
set path1="C:\Users\RookieZz\Desktop\Company-project\hengan\react\exchangeApp"
::path2为对应cordova项目绝对路径
set path2="C:\Users\RookieZz\Desktop\Company-project\hengan\cordova\HFSX"
::path3为jdk安装目录
set path3="C:\Program Files\Java\jdk1.8.0_151\bin"

@echo 源项目打包开始
call cd %path1%
call npm run build:hfsx
@echo 复制打包好的文件到cordova中
call xcopy %path1%\build %path2%\www /s /y
@echo 热更新build
call cd %path2%
cordova-hcp build
