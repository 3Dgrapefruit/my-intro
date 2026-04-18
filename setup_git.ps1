Set-Location $PSScriptRoot
$git = "C:\Program Files\Git\bin\git.exe"
& $git init
& $git add .
& $git commit -m "Initial commit"
& $git branch -M main
& $git remote add origin https://github.com/3Dgrapefruit/my-intro.git
