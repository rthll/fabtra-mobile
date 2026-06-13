# ValidadorPasses

Aplicativo do motorista para validação de passes com autenticação, cache local e fila offline.

## Perfil do motorista

- O login usa Firebase Authentication.
- Cada motorista precisa de um documento em `users/{uid}`.
- Campos esperados:
  - `role: 'driver'`
  - `active: true`
  - `name`
  - `line`
  - `driverId` opcional

## Modo offline

- Passageiros e validações do dia ficam em cache local.
- Se a escrita falhar, a validação entra em fila local.
- A fila é reenviada automaticamente quando a conexão volta.

## Scripts

```bash
npm install
npm start
npm run lint
```
