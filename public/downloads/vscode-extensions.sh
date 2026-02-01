#!/bin/bash

# VS Code Extensions Pack - Oles Didukh
# https://olesdidukh.dev/uses
#
# Run this script to install all recommended extensions:
#   chmod +x vscode-extensions.sh && ./vscode-extensions.sh

echo "Installing VS Code Extensions Pack..."
echo "======================================"

# Core Development
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension yoavbls.pretty-ts-errors

# AI Assistance
code --install-extension github.copilot
code --install-extension github.copilot-chat

# Git & GitHub
code --install-extension waderyan.gitblame
code --install-extension github.vscode-pull-request-github
code --install-extension github.vscode-github-actions

# Database & ORM
code --install-extension prisma.prisma

# Testing
code --install-extension ms-playwright.playwright

# Editor Enhancement
code --install-extension vscodevim.vim
code --install-extension streetsidesoftware.code-spell-checker
code --install-extension nhoizey.gremlins

# Visual & Theme
code --install-extension eliverlara.andromeda
code --install-extension pkief.material-icon-theme
code --install-extension johnpapa.vscode-peacock
code --install-extension oderwat.indent-rainbow
code --install-extension naumovs.color-highlight

# API & Tools
code --install-extension rangav.vscode-thunder-client
code --install-extension mikestead.dotenv
code --install-extension shd101wyy.markdown-preview-enhanced

# File Type Support
code --install-extension jock.svg
code --install-extension mechatroner.rainbow-csv
code --install-extension redhat.vscode-xml

echo ""
echo "======================================"
echo "Installation complete!"
echo "Restart VS Code to activate all extensions."
