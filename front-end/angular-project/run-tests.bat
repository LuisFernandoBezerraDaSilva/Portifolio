@echo off
echo Running Angular tests...
timeout /t 30 /nobreak > nul
npm test -- --no-watch --browsers=ChromeHeadless > test-output.txt 2>&1
echo Test execution completed. Check test-output.txt for results.
