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

## Variáveis de ambiente (opcional)

Crie um arquivo `.env` na pasta `grimmorium-react-main`:

```bash
VITE_CHARACTERS_DATA_MODE=api
VITE_API_BASE_URL=http://127.0.0.1:5000
VITE_ENABLE_LOCAL_JSON_FALLBACK=false
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

- Personagens: backend (padrão)
- Magias PT-BR: backend em `/api/magias` (padrão)
- JSON local em `public/`: opcional, usado apenas como contingência quando `VITE_ENABLE_LOCAL_JSON_FALLBACK=true`

## Creditos e APIs externas

- [D&D 5e API](https://www.dnd5eapi.co) — API pública REST com dados do D&D 5ª edição.

## Aderência ao MVP (resumo)

- 3+ paginas e componentizacao reutilizavel
- React Router com `useNavigate`, `useParams`, `useLocation`
- Rota 404
- Feedback de loading/sucesso/erro, tooltips e mensagens condicionais
- Layout responsivo (desktop/tablet/mobile)
- README com instalação e execução
