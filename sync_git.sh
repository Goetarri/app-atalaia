#!/bin/bash

# 1. Capturar el primer argumento enviado al script
commit_message=$1

# 2. Verificar si estamos en un repositorio de Git
if [ ! -d .git ]; then
    echo "❌ Error: No se detectó un repositorio de Git aquí."
    exit 1
fi

# 3. Validar si el mensaje se pasó por argumento o pedirlo si no
if [ -z "$commit_message" ]; then
    echo "⚠️ No se detectó mensaje de commit en el comando."
    while [ -z "$commit_message" ]; do
        read -p "Introduce el mensaje del commit (obligatorio): " commit_message
        if [ -z "$commit_message" ]; then
            echo "El mensaje no puede estar vacío."
        fi
    done
fi

# 4. Proceso de Git
echo "📦 Preparando cambios..."
git add .

echo "💾 Realizando commit: \"$commit_message\""
git commit -m "$commit_message"

# Detectar rama actual
current_branch=$(git branch --show-current)

echo "🔄 Sincronizando con rama '$current_branch' en GitHub..."
# Pull con rebase para mantener historial limpio
git pull origin "$current_branch" --rebase

# Push final
if git push origin "$current_branch"; then
    echo "---------------------------------------"
    echo "✅ ¡Todo listo! Cambios subidos correctamente."
else
    echo "❌ Hubo un error al subir los cambios."
    exit 1
fi
