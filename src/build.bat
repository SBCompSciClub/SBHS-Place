@ECHO OFF
echo Copying bootstrap
rmdir ".\public\bootstrap\css" /s /q
rmdir ".\public\bootstrap\js" /s /q
xcopy ".\src\bootstrap-4.0.0\dist\css\*" ".\public\bootstrap\css\*"
xcopy ".\src\bootstrap-4.0.0\dist\js\*" ".\public\bootstrap\js\*"