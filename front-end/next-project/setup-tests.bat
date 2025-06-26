@echo off
echo ========================================
echo  Configurando Testes do Projeto React
echo ========================================

echo.
echo 1. Instalando dependencias de teste...
npm install

echo.
echo 2. Verificando configuracao do Jest...
if exist "jest.config.js" (
    echo ✓ jest.config.js encontrado
) else (
    echo ✗ jest.config.js não encontrado
)

if exist "jest.setup.js" (
    echo ✓ jest.setup.js encontrado
) else (
    echo ✗ jest.setup.js não encontrado
)

echo.
echo 3. Executando testes...
npm test

echo.
echo 4. Gerando relatorio de cobertura...
npm run test:coverage

echo.
echo ========================================
echo  Setup completo!
echo ========================================
echo.
echo Comandos disponiveis:
echo   npm test                 - Executa todos os testes
echo   npm run test:watch       - Executa testes em modo watch
echo   npm run test:coverage    - Gera relatorio de cobertura
echo.
echo Relatorio de cobertura em: coverage/lcov-report/index.html
echo.

pause
