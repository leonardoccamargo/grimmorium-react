# Grimmorium Frontend (MVP 2)

SPA em React para gestão de personagens e grimório de magias.

## Requisitos

- Node.js 18+
- npm 9+
- Backend ativo em http://127.0.0.1:5000

## Instalação

No terminal (a partir da raiz do projeto):

```bash
cd grimmorium-react-main
npm install
```

## Execução

No terminal (a partir da raiz do projeto):

```bash
cd grimmorium-react-main
npm run dev
```

Aplicação: http://localhost:5173

## Configuração da origem dos personagens

O frontend permite alternar a fonte dos personagens com uma única variável:

- `api` para usar o backend
- `local` para usar o JSON/localStorage do frontend

Crie um arquivo `.env` na pasta `grimmorium-react-main` com este conteúdo base:

```dotenv
VITE_CHARACTERS_DATA_MODE=api
VITE_API_BASE_URL=http://127.0.0.1:5000
```

Se quiser trabalhar sem backend para os personagens, troque apenas para:

```dotenv
VITE_CHARACTERS_DATA_MODE=local
```

## Comandos úteis

```bash
npm run build
npm run preview
npm run lint
```

## Rotas principais

- /
- /personagens
- /grimorio
- /jogar/:id
- * (404)

## Fontes de dados

- Personagens: backend ou local, conforme `VITE_CHARACTERS_DATA_MODE`
- Magias PT-BR: backend em `/api/magias` (padrão)
- JSON local em `public/`: usado quando os personagens estão em modo local

## Creditos e APIs externas

- [D&D 5e API](https://www.dnd5eapi.co) — API pública REST com dados do D&D 5ª edição.