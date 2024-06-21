#!/bin/sh

# O shell irá encerrar a execução do script quando um comando falhar
set -e

# Executa o comando npm run dev
sh ./scripts/wait_db.sh
sh ./scripts/npm_prisma_migrate.sh
sh ./scripts/npm_run.sh