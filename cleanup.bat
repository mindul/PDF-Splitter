
@echo off
if not exist docs mkdir docs
move PRD.md docs\PRD.md
rmdir /s /q temp-init
