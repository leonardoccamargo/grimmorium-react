# 🛡️ Grimmorium Frontend

Uma SPA (Single Page Application) em React para gerenciamento de personagens em tempo real.

Este repositório contém a **interface visual** do ecossistema Grimmorium. Ele se conecta diretamente ao nosso ecossistema de backend para fornecer uma experiência fluida e dinâmica de gerenciamento de fichas, magias e inventários.

> 🌐 **Repositório Backend:** Para o funcionamento completo com persistência de dados, certifique-se de que o backend está ativo. Você encontra as instruções no [repositório do backend](https://github.com/leonardoccamargo/grimmorium-react-backend).

---

## 🛠️ Pré-requisitos

1. **Sistema Operacional:** Windows com PowerShell.
2. **Ambiente:** Node.js 18+ instalado ([Download aqui](https://nodejs.org/)).
3. **Dependência:** Backend rodando em `[http://127.0.0.1:5000](http://127.0.0.1:5000)` (ou configurado em modo local, como explicado abaixo em Dados e Integração).

---

## 🚀 Passo a Passo para Execução

Siga a ordem dos comandos abaixo no seu PowerShell:

### 1. Entrar na pasta do frontend

```powershell
cd .\grimmorium-react-main

```

### 2. Instalar dependências

```powershell
npm install

```

### 3. Iniciar frontend

```powershell
npm run dev

```

👋 **Como parar o frontend:** No terminal onde o servidor está rodando, pressione `Ctrl + C`.

---

## 🧪 Como testar se está funcionando

Com o servidor de desenvolvimento ligado, abra o endereço abaixo no seu navegador:

* **URL Local:** [http://localhost:5173](http://localhost:5173)

---

## 📍 Rotas Principais

A aplicação utiliza roteamento interno para as seguintes telas:

* `/` — Página inicial / Dashboard.
* `/personagens` — Listagem e gerenciamento de personagens.
* `/grimorio` — Consulta e gerenciamento de magias.
* `/jogar` — Área de jogo/sessão.
* `/jogar/:id` — Tela de jogo focada em um personagem específico.
* `*` — Tela de erro (404) para rotas não encontradas.

---

## 🔄 Dados e Integração (Modos de Funcionamento)

A aplicação suporta funcionamento híbrido. Caso precise usar o frontend de forma isolada sem o backend ativo, você pode consumir dados de um arquivo **JSON local**:

1. **Ativar Modo Local:** No seu arquivo `.env`, altere o valor da variável:
```env
VITE_CHARACTERS_DATA_MODE=local

```


2. **Voltar para a API (Backend):** Altere a mesma variável de volta para:
```env
VITE_CHARACTERS_DATA_MODE=api

```


3. **Mudar endereço da API:** Se o seu backend estiver rodando em outra porta ou servidor, ajuste a variável:
```env
VITE_API_BASE_URL=[URL_DO_SEU_NOVO_BACKEND]

```



> ⚠️ **Nota sobre Magias:** Mesmo em modo local, as magias continuam sendo buscadas no endpoint `/api/magias`.

---

## 🧰 Comandos Úteis

No diretório do projeto, você pode executar os seguintes scripts:

* `npm run dev` — Inicia o servidor de desenvolvimento local.
* `npm run build` — Compila a aplicação para produção (gera os arquivos otimizados na pasta `dist`).
* `npm run preview` — Visualiza localmente o build de produção gerado.
* `npm run lint` — Executa o linter para buscar e corrigir problemas no código estrutural.

---

## 🎖️ Créditos

* **Base de dados externa:** [D&D 5e API](https://www.dnd5eapi.co)