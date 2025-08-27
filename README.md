# Mini FitScore - Desafio Full-Stack

Solução completa para um desafio técnico, construindo uma aplicação com front-end, banco de dados na nuvem e automações de back-end.

**[Link para o Deploy Público]**

Para o Formulário:
https://mini-fitscore-desafio-r9xkso7gw-alvaro-souzas-projects.vercel.app/formulario/

Para o Dashboard:
https://mini-fitscore-desafio-r9xkso7gw-alvaro-souzas-projects.vercel.app/dashboard/dashboard.html

---

## 🛠️ Tecnologias Utilizadas

- **Front-end:** HTML5, CSS3, JavaScript (ES6+)
- **Banco de Dados:** Supabase (PostgreSQL)
- **Automação (Back-end):** n8n.io

---

## ⚙️ Como Rodar o Projeto Localmente

1.  Clone este repositório.
2.  Use a extensão "Live Server" do VS Code para iniciar o arquivo `formulario/index.html`.
3.  As chaves de API do Supabase precisam ser inseridas nos arquivos `formulario/script.js` e `dashboard/dashboard.js`.

---

## 🧠 Decisões e Arquitetura

### Fórmula do FitScore

O FitScore é calculado pela soma simples dos pontos (`data-score`) de cada uma das 10 perguntas. A classificação segue as seguintes regras:

- **Fit Altíssimo:** >= 80
- **Fit Aprovado:** 60-79
- **Fit Questionável:** 40-59
- **Fora do Perfil:** < 40

### Decisões Técnicas

- **JavaScript Puro (Vanilla JS):** Optei por não usar frameworks para demonstrar um forte domínio dos fundamentos da web (manipulação do DOM, eventos, requisições `fetch`), que são a base para qualquer tecnologia front-end moderna.
- **Supabase:** Escolhido como BaaS (Backend as a Service) pela sua simplicidade, plano gratuito generoso e facilidade de integração para persistência de dados.
- **n8n:** Selecionado para as automações assíncronas devido à sua interface visual intuitiva, que permite modelar lógicas de negócio complexas de forma clara e rápida.

---

### ⛓️ Arquitetura da Solução Assíncrona (n8n)

A lógica de negócio assíncrona foi implementada utilizando dois workflows independentes no n8n:

#### Lógica 1: Notificação de Resultado em Tempo Real

- **Gatilho:** `Webhook`
- **Fluxo:** O formulário, após salvar os dados no Supabase, envia uma requisição `POST` para a URL do Webhook no n8n.
- **Ação:** O n8n recebe os dados do candidato e utiliza `Send Email` para enviar uma notificação imediata e personalizada com o resultado.

#### Lógica 2: Relatório Agendado para Gestores

- **Gatilho:** `Schedule`
- **Fluxo:** Este workflow é iniciado automaticamente em um intervalo de tempo pré-definido.
- **Ações:**
  1.  O n8n se conecta ao **Supabase** e executa uma consulta para buscar todos os candidatos com `score >= 80`.
  2.  Com a lista de aprovados,`Send Email` formata e envia um relatório resumido para o e-mail de um gestor.
