# 💡 Plataforma de Ideias para Inovação (Instituto J&F Tech) 🎯

## 📄 Descrição do Projeto

A **Plataforma de Ideias** é um Produto Mínimo Viável (MVP) desenvolvido para o Grupo J&F. O sistema permite que os colaboradores enviem, votem e gerenciem propostas de inovação.

O projeto utiliza Node.js, Express, Handlebars, e Sequelize/MySQL, seguindo a arquitetura MVC com foco em segurança (`bcrypt`, `dotenv`) e integridade de dados (voto único via índice composto no DB).

---

## 🛠️ Tecnologias Principais

- **Backend:** Node.js, Express.js
- **Banco de Dados:** MySQL (via Sequelize)
- **Views:** Handlebars
- **Segurança:** `bcrypt`, `express-session`, `dotenv`

---

## 🚀 Como Rodar o Projeto

### 1. Clonar e Instalar Dependências

```bash
git clone ["COLE A URL DO GIT AQUI - ssh ou http"]
cd projeto-jef
npm install
```

## Crie a .env com base na examplo (enviada via teams)

## Iniciar a aplicação

```bash
npm start
```

Acesse a aplicação em: http://localhost:3000/

## 🎯 Tabela de Endpoints

### Esta tabela detalha as principais rotas da lógica de negócio e as restrições de acesso implementadas:

Funcionalidade,Método,Endpoint,Restrição
Dashboard,GET,/dashboard,Login
Ideias (CRUD),,,
Criar Ideia,POST,/ideias/nova,Login
Editar Ideia,POST,/ideias/editar/:id,Autor
Deletar Ideia,POST,/ideias/deletar/:id,Autor
Votação,POST,/ideias/votar,Login
