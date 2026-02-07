
@echo off
echo [1/4] Checking git status...
if not exist .git (
    echo Initializing new git repository...
    git init
) else (
    echo Git repository already initialized.
)

echo [2/4] Adding files...
git add .

echo [3/4] Committing changes...
git commit -m "Initial commit"

echo [4/4] Creating and pushing to GitHub...
echo Note: If this step fails, you may need to run 'gh auth login' first.
gh repo create PDF-Splitter --public --source=. --remote=origin --push

echo.
echo Process completed. Please check for any errors above.
pause
