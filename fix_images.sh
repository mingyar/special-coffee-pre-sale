#!/bin/bash

# Lista de imagens pequenas para corrigir
images=(
  "https://images.unsplash.com/photo-1505459668311-KXW7vHADtwc?w=1920&q=80"
  "https://images.unsplash.com/photo-1505459668311-KXW7vHADtwc?w=1920&q=80"
  "https://images.unsplash.com/photo-1659021076840-H80RH1Hhvu8?w=1920&q=80"
  "https://images.unsplash.com/photo-1643575855427-H4P5QIZnOz0?w=1920&q=80"
  "https://images.unsplash.com/photo-1605374179215-TaFr0XnSFFs?w=1920&q=80"
  "https://images.unsplash.com/photo-1620706857370-AZJrf0D6Vfo?w=1920&q=80"
  "https://images.unsplash.com/photo-1643575855427-H4P5QIZnOz0?w=1920&q=80"
  "https://images.unsplash.com/photo-1659886251794-irAoAvAHRyI?w=1920&q=80"
  "https://images.unsplash.com/photo-1734007902996-0czHAdon3js?w=1920&q=80"
)

# Baixa cada imagem
for url in "${images[@]}"; do
  # Extrai o nome do arquivo da URL
  filename=$(basename "$url" | cut -d'?' -f1)
  
  # Se o nome do arquivo não tiver extensão, adiciona .jpg
  if [[ ! "$filename" =~ \.(jpg|jpeg|png|gif|svg|webp)$ ]]; then
    filename="${filename}.jpg"
  fi
  
  # Baixa a imagem com curl para seguir redirecionamentos
  echo "Baixando $url..."
  curl -L -o "assets/images/$filename" "$url"
  
  # Verifica se o download foi bem-sucedido
  if [ $? -eq 0 ]; then
    echo "  -> Salvo como assets/images/$filename"
  else
    echo "  -> Erro ao baixar $url"
  fi
done

echo "\nCorreção de imagens concluída!"
