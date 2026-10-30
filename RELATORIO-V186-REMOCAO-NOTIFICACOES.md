# Folha do Paiquerê v186 — Remoção do recurso de notificações

## Objetivo

Retirar os botões e a funcionalidade de notificações do site, tanto na área pública quanto na Área do Estudante, sem remover a instalação do PWA, o cache, o funcionamento offline ou os conteúdos editoriais que apareciam como origem dos antigos alertas.

Esta é uma candidata local derivada do pacote v185 disponível nesta conversa. Ela ainda não foi publicada nem comparada com o conteúdo remoto atual do GitHub Pages.

## O que foi removido

- Botões HTML de ativar/desativar notificações (`#notification-toggle`) das páginas públicas e das páginas editoriais onde estavam presentes.
- Sino, central de notificações e controle para pedir permissão de notificação inseridos pelo shell móvel público.
- Sino e modal da central de notificações do cabeçalho móvel da Área do Estudante.
- Controles de ativar/desativar alertas no painel compacto do estudante.
- Estado local e geração de alertas pessoais para novas matérias, conquistas, avisos escolares e solicitações de ajustes.
- Chamadas de `Notification.requestPermission()`, `showNotification()`, handlers de `push` e `notificationclick`.
- Arquivos executáveis/de configuração do sistema anterior: `notifications.js`, `onesignal-config.js` e `onesignal/OneSignalSDKWorker.js`.
- Guia de ativação do OneSignal que existia apenas para a integração planejada na v185.

## Migração de instalações antigas

O antigo arquivo `folha-notifications-sw.js` também era o service worker principal do PWA. Portanto, não foi simplesmente apagado. Seu componente de cache/offline foi preservado em `service-worker.js`, com a versão de cache elevada para `fp-paiquere-pwa-v186` e sem handlers de notificações.

`pwa.js` contém uma rotina de migração executada uma vez, com repetição se a limpeza falhar. Ela procura o worker separado do OneSignal e o registro antigo do aplicativo, tenta cancelar assinaturas push anteriores, remove os estados locais exclusivos do sistema antigo e registra o novo `service-worker.js` no mesmo escopo do aplicativo. O registro principal do PWA continua sendo usado para instalação, atualização e cache offline.

A limpeza de assinaturas não revoga a permissão geral de notificações que o navegador possa ter guardado nas configurações do site. O site deixa de pedir essa permissão e deixa de usá-la. Caso a pessoa deseje remover a permissão que já havia concedido, precisará fazê-lo nas configurações do navegador/dispositivo.

## O que foi preservado intencionalmente

- Instalação do PWA, botão/atalho “Baixar site”, evento `beforeinstallprompt` e instruções de instalação para plataformas sem prompt nativo.
- Manifesto, ícones, registro do service worker, atualização de arquivos, cache e fallback offline.
- Notícias, matérias, mural de conquistas, avisos escolares e seus fluxos de publicação/administração.
- Área de pautas, navegação editorial e indicador de pautas não lidas, que é um indicador específico da fila de trabalho e não a central de notificações removida.
- Configurações de tema, tamanho do texto, perfil anônimo, autenticação e navegação pública/privada.
- Dados existentes e regras do Firestore/Storage. Nenhuma regra do Firebase foi alterada e nenhum documento do banco foi removido ou regravado.

O texto de transparência em `sobre.html` foi ajustado para não anunciar suporte a notificações; agora descreve o papel do service worker na atualização dos arquivos e no suporte offline.

## Validações realizadas

- Sintaxe JavaScript: todos os 13 arquivos `.js` da raiz passaram por `node --check`.
- HTML: 14 arquivos analisados; zero referência local quebrada em `script src`, `link href` ou `img src` e zero ID duplicado na marcação estática.
- CSS: 49 folhas de estilo analisadas, incluindo regras aninhadas; zero erro de parse detectado.
- Manifesto: `manifest.webmanifest` parseado como JSON válido; `start_url` e `scope` mantidos.
- Busca de runtime: não restaram botões, chamadas de permissão, funções de exibição, handlers push nem carregamento dos scripts removidos. As referências restantes a OneSignal/Push em `pwa.js` são somente a rotina de migração/desinscrição de instalações antigas.
- ZIP: integridade do arquivo verificada após a geração.

## Validação que ainda não foi possível executar

Não foi possível executar testes E2E em navegador real, em Android/iPhone, nem uma nova execução TestSprite neste ambiente. Portanto, as verificações acima são estáticas/estruturais, não uma aprovação visual ou funcional em dispositivo. O site também não foi publicado no GitHub Pages nesta tarefa.

## Orientação de publicação

Ao aplicar a v186 ao repositório, use o pacote completo e mantenha também as exclusões de `notifications.js`, `onesignal-config.js`, `onesignal/OneSignalSDKWorker.js` e `folha-notifications-sw.js`; não basta apenas adicionar `service-worker.js`, pois os arquivos antigos não devem continuar sendo carregados pelo deploy. Depois de publicar, abra o site com conexão para que `pwa.js` execute a migração e o novo service worker seja instalado. Não é necessário apagar manualmente os dados do site antes dessa primeira visita, pois a rotina tenta remover a inscrição antiga.
