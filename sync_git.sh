!/bin/bash

# 1. Verificar si estamos en un repositorio de Git
if [ ! -d .git ]; then
    echo "Error: No se detectó un repositorio de Git en este directorio."
    exit 1
fi

# 2. Mostrar el estado actual (opcional, ayuda al usuario a ver qué va a subir)
echo "Estado actual del repositorio:"
git status -s

# 3. Añadir todos los cambios al área de preparación (staging)
git add .

# 4. Solicitar el comentario del commit de forma obligatoria
commit_message=""
while [ -z "$commit_message" ]; do
    read -p "Introduce el mensaje del commit (obligatorio): " commit_message
    
    if [ -z "$commit_message" ]; then
        echo "El mensaje no puede estar vacío. Por favor, escribe algo."
    fi
done

# 5. Realizar el commit
git commit -m "$commit_message"

# 6. Sincronizar con el servidor remoto (GitHub)
# Primero intentamos bajar cambios para evitar conflictos (pull)
echo "Sincronizando con GitHub..."
git pull origin $(git branch --show-current) --rebase

# Finalmente subimos los cambios (push)
git push origin $(git branch --show-current)

echo "---------------------------------------"
echo "✅ ¡Sincronización completada con éxito!"
