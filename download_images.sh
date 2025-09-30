#!/bin/bash

# Cria o diretório de imagens se não existir
mkdir -p assets/images

# Lista de URLs de imagens para baixar
images=(
  "https://picsum.photos/1920/1080?random=1"
  "https://images.unsplash.com/photo-1605374179215-TaFr0XnSFFs?w=1920&q=80"
  "https://images.unsplash.com/photo-1620706857370-AZJrf0D6Vfo?w=1920&q=80"
  "https://images.unsplash.com/photo-1659886251794-irAoAvAHRyI?w=1920&q=80"
  "https://images.unsplash.com/photo-1734007902996-0czHAdon3js?w=1920&q=80"
  "https://images.unsplash.com/photo-1505459668311-KXW7vHADtwc?w=1920&q=80"
  "https://images.unsplash.com/photo-1659021076840-H80RH1Hhvu8?w=1920&q=80"
  "https://images.unsplash.com/photo-1643575855427-H4P5QIZnOz0?w=1920&q=80"
  "https://picsum.photos/id/1060/1920/1080"
  "https://images.unsplash.com/photo-1459755486867-b55449bb39ff?w=1920&q=80"
  "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1920&q=80"
  "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1920&q=80"
  "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1920&q=80"
  "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=1920&q=80"
  "https://images.pexels.com/photos/416676/pexels-photo-416676.jpeg?auto=compress&cs=tinysrgb&w=1920"
  "https://images.pexels.com/photos/9716777/pexels-photo-9716777.jpeg?auto=compress&cs=tinysrgb&w=1920"
  "https://images.pexels.com/photos/561463/pexels-photo-561463.jpeg?auto=compress&cs=tinysrgb&w=1920"
)

# Baixa cada imagem
for url in "${images[@]}"; do
  # Extrai o nome do arquivo da URL
  filename=$(basename "$url" | cut -d'?' -f1)
  
  # Se o nome do arquivo não tiver extensão, adiciona .jpg
  if [[ ! "$filename" =~ \.(jpg|jpeg|png|gif|svg|webp)$ ]]; then
    filename="${filename}.jpg"
  fi
  
  # Baixa a imagem
  echo "Baixando $url..."
  curl -L "$url" -o "assets/images/$filename" --connect-timeout 30
  
  # Verifica se o download foi bem-sucedido
  if [ $? -eq 0 ]; then
    echo "  -> Salvo como assets/images/$filename"
    
    # Atualiza as referências no arquivo HTML
    sed -i '' "s|$url|assets/images/$filename|g" index.html
  else
    echo "  -> Erro ao baixar $url"
  fi
done

echo "\nDownload de imagens concluído!"
