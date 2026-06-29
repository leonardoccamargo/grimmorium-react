# Grimmorium React (2° MVP)

Aplicação SPA para gerenciamento de personagens e consulta de magias de RPG, com navegação entre páginas, componentização e simulação de requisições a servidor via leitura de arquivos JSON.

## Funcionalidades principais

- Navegação entre páginas: Home, Personagens, Grimório, Jogar e rota 404.
- Cadastro, edição e remoção de personagens.
- Busca e listagem em cards.
- Consulta de magias com filtro por nível, paginação e painel de detalhes.
- Alternância de idioma (PT-BR/EN) e tema (claro/escuro).
- Feedback visual de carregamento, sucesso, aviso e erro.

## Tecnologias

- React
- React Router DOM
- Vite
- CSS

## Instalação e execução local

### Pré-requisitos

- Node.js 18+
- npm 9+

### Passo a passo

```bash
npm install
npm run dev
```

Aplicação disponível em: http://localhost:5173

## Como utilizar

1. Abra a página inicial para acessar a visão geral do sistema.
2. Acesse Personagens para buscar, cadastrar, editar e remover fichas.
3. Entre em Grimório para filtrar magias por nível e visualizar detalhes.
4. Abra a rota Jogar para atualizar valores da ficha durante a sessão.
5. Use os botões do cabeçalho para alternar idioma e tema.

### Outros comandos

```bash
npm run build
npm run preview
npm run lint
```

## Estrutura de pastas

```text
grimmorium-react/
	public/
		personagens.json
		magias.json
	src/
		components/
		context/
		pages/
		App.jsx
		main.jsx
```

## Rotas da aplicação

- / -> Home
- /personagens -> Lista, busca e gestão de personagens
- /grimorio -> Lista e detalhes de magias
- /jogar/:id -> Ficha do personagem (visualização/edição)
- * -> 404 Not Found

## Observação sobre dados simulados

Conforme a regra do MVP, os dados principais são carregados por leitura de JSON local para simular chamadas ao servidor.
