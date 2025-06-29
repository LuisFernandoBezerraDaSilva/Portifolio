@echo off
echo ===============================================
echo    COMPILADOR DO LEITOR FOLHA DE PONTO
echo ===============================================

echo 1. Verificando dependencias...
pip install pyinstaller google-cloud-documentai python-dotenv

echo.
echo 2. Limpando builds anteriores...
if exist build rmdir /s /q build
if exist dist rmdir /s /q dist

echo.
echo 3. Compilando projeto...
pyinstaller ^
    --onefile ^
    --windowed ^
    --name "LeitorFolhaPonto" ^
    --add-data "configs;configs" ^
    --distpath "." ^
    leitorPonto.py

echo.
echo 4. Verificando resultado...
if exist LeitorFolhaPonto.exe (
    echo ✅ SUCESSO! Executavel criado: LeitorFolhaPonto.exe
    dir LeitorFolhaPonto.exe
) else (
    echo ❌ ERRO: Falha na compilacao
)

echo.
echo Pressione qualquer tecla para continuar...
pause
