# Projeto de para envio de SMS com AWS SNS

O projeto pode testar o envio de SMS com a AWS SNS localmente utilizando o Localstack sem a necessidade de acessar a AWS.
  
## Running

Para rodar o projeto, é necessário ter o Docker e o Docker-compose instalados. Além disso, é necessário ter o Node.js v20 instalado.

### Pre reqs

- Install Docker & Docker-compose
- Install Node.js v20

### Running

- run `docker-compose up -d localstack`
- restore node.js dependencies `npm ci`
- run tests `npm t` or press `F5` on VSCode.
