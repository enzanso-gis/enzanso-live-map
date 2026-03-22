@echo off
:: QGISの専用環境を読み込む（迷子防止）
call "C:\Program Files\QGIS 3.44.8\bin\o4w_env.bat"

:: マップのフォルダに移動
cd /d "E:\GIS\workspace\mountain-hut-gis\enzanso-live-map"

echo ===================================================
echo 🌍 ローカルテスト用サーバーを起動しました！
echo.
echo ブラウザを開き、以下のURLにアクセスしてください：
echo 👉 http://localhost:8080/
echo.
echo ※サーバーを停止するには、この黒い画面を閉じてください。
echo ===================================================

:: サーバー起動
python -m http.server 8080