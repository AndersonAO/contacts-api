
# Contacts API

## Configuração

- Para iniciar o projeto você precisa ter o node e o postgres instalado na máquina.

- Crie um arquivo .env na raiz do projeto e defina com suas configurações.
```js
APP_PORT=3333
DATABASE_URL="postgresql://USER:SENHA@localhost:5432/DBNAME?schema=public"
```

- Rode o comando para instalar as dependências do projeto.
```bash
  npm install
```
- Para rodar as migrações do banco de dados execute o comando.
```bash
  npx prisma db push
```
- Por fim, inicie o projeto com o comando.
```bash
  npm run dev
```
    
## Documentação

[Documentação](https://documenter.getpostman.com/view/15834426/UVeGpjwn)
