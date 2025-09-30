import os
import requests
import re
from urllib.parse import urlparse
from pathlib import Path

# Diretório base para salvar os assets
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(BASE_DIR, 'assets')
IMAGES_DIR = os.path.join(ASSETS_DIR, 'images')

# Garante que os diretórios existam
os.makedirs(IMAGES_DIR, exist_ok=True)

def download_file(url, filepath):
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        return True
    except Exception as e:
        print(f"Erro ao baixar {url}: {e}")
        return False

def get_filename_from_url(url):
    # Extrai o nome do arquivo da URL
    parsed = urlparse(url)
    path = parsed.path
    filename = os.path.basename(path)
    
    # Se não tiver extensão, adiciona .jpg como padrão
    if '.' not in filename:
        filename += '.jpg'
    
    # Remove parâmetros de query
    if '?' in filename:
        filename = filename.split('?')[0]
    
    return filename

def update_html_references():
    html_file = os.path.join(BASE_DIR, 'index.html')
    
    # Lê o conteúdo do arquivo HTML
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Atualiza referências para as imagens
    updated_content = content
    
    # Encontra todas as URLs de imagens no conteúdo
    url_patterns = [
        r'(https?://[^\s"\'<>]+?\.(?:jpg|jpeg|png|gif|svg|webp)(?:\?[^\s"\'<>]*)?)',
        r'url\([\"\']?(https?://[^\s"\'<>]+?\.(?:jpg|jpeg|png|gif|svg|webp)(?:\?[^\s"\'<>]*)?)[\"\']?\)',
    ]
    
    # Dicionário para rastrear URLs já processadas
    processed_urls = {}
    
    for pattern in url_patterns:
        for match in re.finditer(pattern, content, re.IGNORECASE):
            url = match.group(1) if match.groups() else match.group(0)
            
            # Remove parênteses ou aspas da URL
            url = url.strip("'\"()")
            
            # Pula URLs já processadas ou que não são imagens
            if (url in processed_urls or 
                any(skip in url.lower() for skip in [
                    'fonts.googleapis.com', 
                    'cdnjs.cloudflare.com', 
                    'fontawesome.com',
                    'data:image',
                    'base64',
                    'unsplash.com/photo-',  # Já baixamos essas
                    'picsum.photos'        # Já baixamos essas
                ])):
                continue
            
            print(f"Processando URL: {url}")
            
            try:
                filename = get_filename_from_url(url)
                local_path = f'assets/images/{filename}'
                
                # Baixa o arquivo se ainda não existir
                local_filepath = os.path.join(BASE_DIR, local_path)
                if not os.path.exists(local_filepath):
                    print(f"Baixando {url}...")
                    if download_file(url, local_filepath):
                        print(f"Arquivo salvo como {local_path}")
                    else:
                        print(f"Erro ao baixar {url}")
                        continue
                
                # Atualiza a referência no HTML
                updated_content = updated_content.replace(f'"{url}"', f'"{local_path}"')
                updated_content = updated_content.replace(f"'{url}'", f"'{local_path}'")  # Para aspas simples
                updated_content = updated_content.replace(f'url({url})', f'url({local_path})')
                updated_content = updated_content.replace(f'url("{url}")', f'url("{local_path}")')
                updated_content = updated_content.replace(f'url(\'{url}\')', f'url(\'{local_path}\')')
                
                # Marca a URL como processada
                processed_urls[url] = local_path
                
            except Exception as e:
                print(f"Erro ao processar {url}: {e}")
    
    # Salva o arquivo HTML atualizado
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(updated_content)
    
    print(f"\nResumo de downloads:")
    for url, path in processed_urls.items():
        print(f"{url} -> {path}")
    print(f"\nTotal de {len(processed_urls)} imagens processadas.")

def main():
    print("Iniciando download de assets...")
    update_html_references()
    print("Concluído!")
if __name__ == "__main__":
    main()
