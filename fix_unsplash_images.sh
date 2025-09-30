#!/bin/bash

# Cria o diretório de imagens se não existir
mkdir -p assets/images

# Lista de imagens do Unsplash com suas URLs completas
# Formato: "URL_DA_IMAGEM" "NOME_DO_ARQUIVO"
images=(
  "https://images.unsplash.com/photo-1505459668311-KXW7vHADtwc?w=1920&q=80&auto=format&fit=crop" "coffee_beans_1.jpg"
  "https://images.unsplash.com/photo-1605374179215-TaFr0XnSFFs?w=1920&q=80&auto=format&fit=crop" "coffee_beans_2.jpg"
  "https://images.unsplash.com/photo-1620706857370-AZJrf0D6Vfo?w=1920&q=80&auto=format&fit=crop" "coffee_beans_3.jpg"
  "https://images.unsplash.com/photo-1659886251794-irAoAvAHRyI?w=1920&q=80&auto=format&fit=crop" "coffee_beans_4.jpg"
  "https://images.unsplash.com/photo-1734007902996-0czHAdon3js?w=1920&q=80&auto=format&fit=crop" "coffee_beans_5.jpg"
  "https://images.unsplash.com/photo-1659021076840-H80RH1Hhvu8?w=1920&q=80&auto=format&fit=crop" "coffee_beans_6.jpg"
  "https://images.unsplash.com/photo-1643575855427-H4P5QIZnOz0?w=1920&q=80&auto=format&fit=crop" "coffee_beans_7.jpg"
)

# Baixa cada imagem
for ((i=0; i<${#images[@]}; i+=2)); do
  url="${images[i]}"
  filename="${images[i+1]}"
  
  echo "Baixando $url..."
  
  # Usa curl com o cabeçalho User-Agent para evitar bloqueios
  curl -L -A 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' \
       -o "assets/images/$filename" "$url"
  
  # Verifica se o download foi bem-sucedido
  if [ $? -eq 0 ]; then
    echo "  -> Salvo como assets/images/$filename"
    
    # Verifica se o arquivo é uma imagem válida
    if file "assets/images/$filename" | grep -q 'image data'; then
      echo "  -> Imagem válida"
      
      # Atualiza as referências no arquivo HTML
      sed -i '' "s|$url|assets/images/$filename|g" index.html
      echo "  -> Referências atualizadas no arquivo HTML"
    else
      echo "  -> ERRO: O arquivo baixado não é uma imagem válida"
      file "assets/images/$filename"
    fi
  else
    echo "  -> Erro ao baixar $url"
  fi
  
  echo ""
done

echo "\nDownload de imagens do Unsplash concluído!"
