@echo off
echo Creating Sofrim Android Keystore
echo ==================================
echo.
echo This will create a keystore for signing your Sofrim APK
echo You will need to remember the passwords you enter!
echo.
echo Recommended values:
echo - Alias: sofrim
echo - Organization: Sofrim
echo - Name: Elad Elram
echo - Country: IL
echo.
pause

keytool -genkey -v -keystore sofrim-release.keystore -alias sofrim -keyalg RSA -keysize 2048 -validity 10000

echo.
echo ============================================
echo IMPORTANT: Save these values for GitHub Secrets:
echo ============================================
echo KEYSTORE_PASSWORD: [The password you just entered]
echo KEY_ALIAS: sofrim
echo KEY_PASSWORD: [The key password you just entered]
echo.
echo Also run this command to get the base64 keystore:
echo certutil -encode sofrim-release.keystore keystore-base64.txt
echo.
pause
