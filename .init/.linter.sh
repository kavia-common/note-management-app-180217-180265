#!/bin/bash
cd /home/kavia/workspace/code-generation/note-management-app-180217-180265/notes_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

