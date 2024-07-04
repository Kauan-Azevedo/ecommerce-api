# E-commerce API 💹

### Como rodar a API via Docker 🐳

Copie o arquivo de referencia `.env-example` e crie seu proprio `.env`.

Requisitos:
 - DockerEngine
 - Node.js
 - NPM

Depois no seu terminal faça:

```zsh
npm install && npm run make-url -- docker && docker compose up --build
```

A URL da API deve aparecer no seu terminal quando a execução da aplicação acontecer

### Como rodar a API nativamente 💻

Copie o arquivo de referencia `.env-example` e crie seu proprio `.env`.

Requisitos:
 - PostgreSQL
 - Node.js
 - NPM

Primeiramente suba seu banco de dados, depois execute os seguintes comandos no seu terminal:

```zsh
npm install && npm run make-url -- native && npx prisma migrate dev && npx prisma generate && npm run start:dev 
```

A URL da API deve aparecer no seu terminal quando a execução da aplicação acontecer

### SEED no DB 🌱

```zsh
npm run seed
```

# Sobre 📚

Trabalho sobre API Rest que representará nossa avaliação N3.

## Cenário fictício 🤔

Vocês trabalham para um startup que irá implementar o backend, uma API Rest, para um sistema de e-commerce. O cliente passou os requisitos e você e sua equipe devem enviar ao cliente o projeto no github para que seja implantado no servidor do cliente.

## Divisão de tarefas ✏️📝

- **User, Permissions,Product** : - Kauan

 - **Order, Payment_method, Payment_status** - Gustavo

- **Endpoints de report, supervisão geral dos endpoints** - Gabriel

- **Testes unitarios** - Guilherme e Vinicius 

## Critérios de Avaliação 🛠️

- **Funcionalidade**: Todos endpoints devem estar funcionando.

- **Validação**: Todos endpoints devem ter controle de exceção para erros 400. Além disso, deve-se validar se os campos obrigatórios estão sendo preenchidos corretamente, senão deve-se lançar uma exceção.

- **Arquitetura**: O backend deve conter as camadas de Routers, Controllers, Services e Models. Utilize o Sequelize para persistência no banco de dados relacional.

- **Código**: O código deve estar bem organizado, otimizado e com comentários das principais funcionalidades.

## To-do 🚀'

### Definir conceitos iniciais
- [ ✅] Construção do diagrama de [Entidade Relacionamento](https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=api-ecommerce.drawio#R%3Cmxfile%3E%3Cdiagram%20id%3D%22R2lEEEUBdFMjLlhIrx00%22%20name%3D%22Page-1%22%3E7V3vc5s4E%2F5rMnP3IRkEBsPHy892mrZ5k%2FTavl8yipFtrhj5ADdO%2FvqTDAIbYQKObYi1M5kWZCHj1SM92pV298g4m8yvQjwdf6Yu8Y90zZ0fGedHuo4cy2H%2F8ZLnpMSx9KRgFHpuWikvuPNeSFqopaUzzyXRSsWYUj%2F2pquFAxoEZBCvlOEwpE%2Br1YbUX%2F3WKR4RqeBugH259LvnxuOk1Da1vPwD8UZj8c1ISz%2BZYFE5LYjG2KVPK0VkHl%2FSIE5f8YaEExyQIGaffMbhLxIemRfjOOa%2F9K8j%2FZL9DXntkxGlI5%2FgqRedDOiEFQ8iVuVyiCeez8W81NBp2hD7OuPiyDgLKY2Tq8n8jPi8r0Q3JO90uebTTA4hb7fGAz9%2FTsOvs69XP%2F%2FGk%2FMPHvr7n%2FnlMTKSZn5jf5YK%2BFuUvB4TUPwspM5kNeWXMX7kRadRjMM4BYehsQLW3TH2AvaocY4W976Pp5G3qJ6UjD3fvcbPdBaLhsTd6dCbE%2Fc2wQavy2ByzRrjt7xxLuW79GX4x9j3RgG7HrCfzr%2FxNCQRe5drHMVpjXE88dNLWU6p6H6TMCbzpaJUbleETkgcPrMq4lO9lwIkHTQ9MRqecghmI2S8BD%2FDSAtxiqlR1njeVewi7a0mPdeTeq6612451k%2FHNPReeF%2F5qWyXe3Jx%2F%2BRNfAbWDwS7haJTupg0Fj3i%2Bf4Z9Snv7oAGROpxXskN6fQehyMSpwVT6qWDyzxlf0w0Z9qJeWSydz1j9yi%2FZ3%2B8ehif0SCKQ4Ys3gZhHfxEeCefxnSaNuqToWg%2FTAXPrx9pHLOxuA4D1aPhdWSkQDDq4mBnMDAlGNx8WgsEJoHYw%2F4tm5hxMPKTblvM0zjvtpK%2BLZV2JuGi6IvDlTJ5Dv3FVDv2XJewoXv6NPZicjfFA17piVHVa4O2ehC83mFLPWQ07KC0sVxqjVvDPpunAhyzITQL3Ejq9ew93wAESwLCx3P%2B0IK%2Bvny95%2F9%2Bu75m%2F3378vF%2F3y5aBomYw5O6pxGDgheMrpMnrQKKzK6gaL522CN7q6iq1dweYNXrA83UohltlzRjtU0zPbsEBpbPRfTILkb84vKTKGJfkZW2PM0Q1xPt7ZaKsoECVNRzJLB47sOUKUFeFHk04CqjFzwvmKnbHNQJuCjHOQg4pwOc47TNOaiMc9QgEwRkkolCJpOhF0bxQ4AnZFEeDsY4%2FMPQ%2F1SXTRrgRTk2EbZdYJM22QTpbdNJZvZVj06yIQB0Ijp9CQU%2BltnE7CnMJg3goh6byBtmwCb7ZxOzdTZpsP12aGxSv7sOnk3k3TcywZ6%2FxCS62lRSHyvKUYnRYEEKVLIzKrHbphJDXpKqQiVG%2FaM4h04lhrywnI5Z5z0Es8kjP5GVMQoyFSaUBohRj1DgSFgHCEWvfTZwZ4Qir0qVIRQ4EJaJQj4QNsVR9ERD92GMozH76O7%2B9uOXK4XJBA5%2BrZdNg91XIJOdkUmvdTKR91%2BVIRO7dncdOpkIGC6hYBAS9pXuA%2Bbni112GXt8C0VZLqkPFuW4pAeWri5wSb9tLumpa%2BnqgaUrE4Vs6ZpNXeCSjcCiHpeAkasDXGJorXOJukauHhi5MlHIRi6X%2BAS4ZBOwKMcltqyX3GReSlE1rRQo5PCDIDhCfRDqRF0KcHZFAXYDdULppUCD6cKuj4uuhECwZX1CoRAI2SCAxYAtqwaLEAiZsymEQdgSktRbKTTQNpSmmgZaZ3OqaT0Mgi2rGy3PH3tTOrMRADxjy%2F7pRfchTeEjeg2QohyPOPIEcoOfJ0ygD4wa4hkonavIsEQQgCwoQdtKpwPBKbaudGaj4v0onY58PEohpdOB%2BBSZKOTzUaB07gRJyi0WstDFwDXb0zqbc03rWifS1A1dkY8BoBqkyRseoHhuhhUFyaRkmyRVPVnbY%2BpWU4tyqqcU9L1fNyLeznRPpMHhp60rn%2FnAeD%2FaJ9LUDvuuwQmoXBZrAr%2BDArp1LCm4aABr5%2FZP2zYnnA6ooAoH49XA2pnLQjZ3ggq6GVbUYxMxZS2vWkPqzgbrEwGoqXsaaFX11OsGqcp8%2FLbPAAicOLeve2Yj4h3pnki2Qqqke6L6o%2FngVwMl6SMh6dj2caTgSgEMndvXO5uTTft6Z0l%2By5bnkP3pnZDdckkWspWzoHciTWnFE5JYVgkHzJhdoJP2U4qpnFMMkootyUI2Y7okGoTeNE4SVN5f%2FLhXmU3AjLleOJBRrBNs0n5KMaRwTjEEScWWZCGbRJNLXXPpjHeHulQC2cSqhAPpxDpBJa3nE0MKJxRDkFFsSRaywTOK6eAXR8IE%2B%2F5ia0VdMoF8YhXCaRCdAshkd2TSekYxpDewdx4cmdR38Dt8MpHNnRC2f2O4KMgoDZJ%2FAKPsjFHaTymGRMtKMopTu8MOnlFKktZC8P6N4aIeo5SkOQVGaYFRWs8rhppkKz00RjHA4JXLQjZ4QQj%2FjeGiIKPIVq%2BvocszZlfRSoFCDt%2BlyBaHr4QfiYiW%2FSoDWLujADiWV28x0GiyeH%2FBFFFJslmVXIoMOJmXy2JNPMVHbwReRVuFknpLhZIstsA3b1U%2Bm%2FNN%2B15FpQlpLZ8L6ZFdjPjF5SdRxL4jK215qtmfipqNFeAkVJK3droSOu%2BBPb8UcanbbNQN0CjIPmD67AL7tO%2BEVJrCFtindKwA%2B6CSTLfTlZwhwD6NQaMe%2B1gQvqcL7NMBpyVLXs0C%2FawZLEA%2FyJKXrbOIhEA6jaGiHOnoRtlUA6Szd9Jp3b1JLz33A6RTOliAdPSSw0GUb%2Bo%2FeMGQJtQjNoRUZZ4meFGOeVAPfKE6wTzt%2B0L1FPaF6oEvVC4L%2BYwJhPzZDCsK0gk4QnWBTjrgCCVUKSXpBByhchzI9nR%2BUv0IDqw3A4p6XGJBbOtOcEn7LlCWwsGtLQhunctCNlZA%2BLjmOFGQSsCBphNU0m%2BfShQObG2B%2B0wuC9lQARF%2FNoaLeoxiNliSAqPsjFEMrXVGMRvsoB0ao2SjABgFmfIaEyL%2BbAwXBRmlwcoUGGV3jNK%2Bl7%2FZYBPt4BjFrt1hB88owv8XIv5sAy7KMYpex5WFuCMiQi4wWXvx8y3xMT%2FpcZF%2FkgRmSCgF6as9RQL3rzBcdO7FLYPPPf2Mg2fBQ%2FlHLySk9%2FTrAl8h%2F81EsBGZe%2FEP0Rq7%2FsnLT8z07ny%2BVO1c0BV71fD5x%2FLN0lP8Nn9scSeek3GVyiiis3BAqqAmHFJiQYDs9unq%2FBHHv158TX%2BJfvxz933mXB6nkOSSrTt%2FIa0EMllhuOiR32TlhStweUOTCCAp4k2xgZOFFShgMfnt6VM5DuWGjEJDTqGhRDRSQ9sDdI0dwb0BeoIDtwrOx9qJhqwVTFu2UY1qdnNDQjalL0JdrSId7Qvp2YHZd4d0u4B0u78h0m29gHSzHtIZOvDzUrV0fbz%2BhbXV7%2BmnC81179W3C%2FW1V%2BoXgplZxkp9dpG88XaHaX9NpLmHj8GQrl2sqBluziyGm6u7257x0Vv0j9JRDZbNreuh%2BZDoZLC5UhgoYdasHABKqaClkpBNmtOQurNBnLgWqeJX9EaUHLLmWbUuBAZplUH2GT6uFAZKmDErBwAwSBZyX3JQ5QSikG%2FqG3FyyBxSPuHZMnKARfbPIq2HgdNtdZOH54NAKSZZIwtdwsG%2FM7ww8XIwKJ%2F0tQlYDplOnkdfnLvH0dANtOG1OXQvrj7dHO99KyzZ79ps60Bc%2F1y6fmUfrLA7kN2u2R1Y3ElbDSXbDzL26m8jJBWXdxGqPao7s49gFc3yvQJg6%2B4j9AsNWcWGtrdjVop6ecbcMepzZL8F8q9s%2Fm6OSaT16oJSnFXrDCiRVtgqsDfdx0Wo0FK%2F2NKOYVkjwHNHYIlOtNVjCU71dFy1gbu3owpO%2F%2F2CXDcLIBdRfZuDHBVB7uwV5Hs%2Fq9Ac5Bsic5MDO5ujWSz7a6wjOgbmYioxC204YTuFhsxiQ9uD8v3%2Fx9N%2Fnf7oeE4nP6zj88f%2B917J4vluEVBbAjTs5a90U92gXsVzVJvYTko7rsb6D0xoawFQORY6uZFf%2Bsbyauswc8ZVjgCl7GelkpDXI4t8cVlkakgYtx0cHbJprVQ0cF7sLfs02yGZfe71l76xEqfFKuEPDCOfFgsw905iJeFgjMM%2FTO3PrjNKF3CiHIPUOCjUtqlEmKlPHMdeNQg6wgzSEZNg1fLldRuK1TkjSsGnwxFhSRobUYqbOjXtgY19Ogp2R%2BEltaHPBbsNKY2Xq7MZaPyZuoTX%2BA8%3D%3C%2Fdiagram%3E%3C%2Fmxfile%3E).
- [ ✅] Fazer o setup inicial da aplicação.
- [ ✅] Fazer a divisão das tarefas entre os integrantes.

### Docker
- [ ✅] Implementar o Docker para desenvolvimento

### User, Permissions, Product
- [ ✅] Implementar o modelo `User`.
- [✅ ] Implementar o modelo `Permissions`.
- [ ✅] Implementar o modelo `Product`.
- [ ✅] Criar endpoints para CRUD de `User`.
- [ ✅] Criar endpoints para CRUD de `Product`.
- [✅ ] Implementar controle de acesso baseado em `Permissions`.

### Order, Payment_method, Payment_status
- [✅ ] Implementar o modelo `Order`.
- [ ✅] Implementar o modelo `Payment_method`.
- [✅ ] Implementar o modelo `Payment_status`.
- [ ✅] Criar endpoints para CRUD de `Order`.

### Endpoints de report, supervisão geral dos endpoints
- [ ] Desenvolver endpoints de relatórios.
- [ ] Revisar todos os endpoints para garantir a consistência.
- [ ] Implementar supervisão e logging de atividades nos endpoints.

### Testes unitários
- [ ] Escrever testes unitários para o modelo `User`.
- [ ] Escrever testes unitários para o modelo `Product`.
- [ ] Escrever testes unitários para o modelo `Order`.
- [ ] Garantir cobertura de testes para todos os endpoints.
- [ ] Configurar ambiente de testes e integração contínua.
