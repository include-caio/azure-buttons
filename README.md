# Azure Buttons

Essa extensão tem como propósito trazer à interface do Azure opções e/ou funcionalidades que atualmente não existem nela

<img src="https://i.imgur.com/9lxukB4.gif" width="550">

##### Vale ressaltar que a atual implementação não é das mais seguras, então utilize por sua conta e risco
<br />
Para o login é utilizado um Service Principal com as permissões adequadas no escopo dos recursos <br />
<img src="https://i.imgur.com/ejMQrwQ.png" width="450">

No intuito de conceder o mínimo de permissões, sugiro a criação de uma [*custom role*](https://github.com/include-caio/azure-start-stop-custom-role) apenas com as ações necessárias

Para realizar o login, foi criado um proxy simples em um Web App ([https://getazuremgmttoken.azurewebsites.net/](https://getazuremgmttoken.azurewebsites.net/)) que, basicamente, recebe as credenciais do Service Principal, realiza a requisição para o endpoint de login e retorna o token de acesso

A [API REST do Azure](https://learn.microsoft.com/en-us/rest/api/azure/) é utilizada para todas as interações com os recursos do portal

## Como usar?

Siga esses passos para utilizar a extensão:

- Edite o arquivo *contentScript.js* inserindo as credenciais do Service Principal <br />
<img src="https://i.imgur.com/d0fJcK0.png" width="450">

- Acesse o menu de [extensões do Chrome](chrome://extensions/) <br />
<img src="https://i.imgur.com/5XZaxql.gif" width="450">

- Habilite o **Modo do desenvolvedor** e faça o upload do repositório em **Carregar sem compactação** <br />
<img src="https://i.imgur.com/E5LbPTu.png" width="450">

- Voilà <br />
<img src="https://i.imgur.com/L0CgjSM.png" width="450">