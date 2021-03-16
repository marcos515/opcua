# opcua
Este servidor OPCUA trabalha em conjunto com o Kafka, onde ele recebe uma configuração de username, password, variaveis a serem criadas e atualizações de valores,
além de enviar mensagem no kafka quando recebe uma solicitação de escrita.

No arquivo kafka.json é onde o código espera receber uma nova configuração, definido manualmente.

No arquivo config.json é onde fica armazenado uma configuração recebida, um template de json de configuracao valido para ser enviado no kafka:
{"opcua":true,"deviceId":11,"config":{}}
