# opcua
Este servidor OPCUA trabalha em conjunto com o Kafka, onde ele recebe uma configuração de username, password, variaveis a serem criadas e atualizações de valores,
além de enviar mensagem no kafka quando recebe uma solicitação de escrita.

O arquivo index.js tem uma rotina de monitoramento do servidor, caso receba uma nova configuração ele escreve-a no arquivo config.json e reinicia o server (opcuaserver.js).

No arquivo kafka.json é onde o código espera receber uma nova configuração, definido manualmente.

No arquivo config.json é onde fica armazenado uma configuração recebida, um template de json de configuracao valido para ser enviado no kafka:
{"opcua":true,"deviceId":11,"config":{}}

Para a atualização de valores, o codigo verifica o nome das variaveis de seu config e as variavei enviadas no kafka seguindo o template a seguir, se os nomes forem iguais ele ataliza o valor.
{"ts":15151241215,"deviceId":11,"values":[{"name":"vazao", "value":100}]}
