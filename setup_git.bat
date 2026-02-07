
@echo off
git init
git add .
git commit -m "Initial commit"
gh repo create PDF-Splitter --public --source=. --remote=origin --push
