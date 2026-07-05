# Grimmorium Frontend API

SPA em React para gerenciamento de personagens, grimorio e jogo do MVP.

## Pre-requisitos

1. Windows com PowerShell
2. Node.js 18 ou superior instalado
3. Backend rodando em http://127.0.0.1:5000

Para conferir se Node e npm estao instalados, rode:

```powershell
node --version
npm --version
```

## Passo a passo

1. Entrar na pasta do frontend

```powershell
cd .\grimmorium-react-main
```

2. Instalar dependencias

```powershell
npm install
```

3. Iniciar frontend

```powershell
npm run dev
```

## Como testar se esta funcionando

Com o frontend ligado, abra no navegador: http://localhost:5173

## Como parar o frontend

No terminal onde o frontend esta rodando, pressione `Ctrl + C`.

## Rotas principais

- /
- /personagens
- /grimorio
- /jogar
- /jogar/:id
- * (404)

## Dados e integracao

É possivel também usar o frontend com JSON local, caso necessário. Para isso, faca o seguinte:

1. No arquivo `.env`, altere a variável `api` para `local` em `VITE_CHARACTERS_DATA_MODE=api`.
2. Para voltar ao backend, use `VITE_CHARACTERS_DATA_MODE=api`.
3. Se precisar de outro backend, ajuste `VITE_API_BASE_URL`.
4. As magias continuam sendo buscadas em `/api/magias`.

## Comandos uteis

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## Creditos

- D&D 5e API: https://www.dnd5eapi.co