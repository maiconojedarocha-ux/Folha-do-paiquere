# Relatório técnico — Folha do Paiquerê v185

## Escopo desta rodada

Base utilizada: pacote local **v184**. Esta entrega é uma candidata de correção local; não foi publicada no GitHub Pages, não foi aplicado deploy Firebase e não foram gravados dados de produção.

A regra de trabalho foi preservar funcionalidades não citadas e limitar alterações aos pontos solicitados. Não foram modificados `firestore.rules`, `storage.rules`, `firebase-config.js`, `firebase-client.js` ou `cloudinary-config.js`.

## 1. Cartões de perfil em Sobre

- A camada de imagem personalizada deixou de cobrir a altura inteira do cartão.
- O `span.fp-community-card-wallpaper` voltou a ser exibido como faixa superior e passou a ter altura responsiva limitada por `clamp(5.8rem, 10vw, 6.8rem)`, com limites explícitos de 5.8rem e 6.8rem.
- A imagem continua usando a posição/corte que o perfil já salvava (`desktopX`, `desktopY`, `mobileX`, `mobileY`).
- A imagem de fundo do cartão inteiro foi desativada quando há uma faixa de wallpaper, evitando a duplicação de duas camadas extensas.

## 2. Conquistas em Meu Perfil

- A lista de linhas/medalhas foi substituída por cartões que reutilizam as classes visuais do mural/perfil público (`fp-profile-carousel-item`, `fp-profile-achievement-card`, `fp-profile-achievement-image`, `fp-profile-achievement-body`).
- O botão “Ver conquista” abre o modal existente `#achievement-view-modal`, com título, nome da pessoa/equipe, categoria, data, imagem, resumo, detalhes e participantes quando esses dados existem.
- O fechamento reutiliza o comportamento de clique/fechar e Escape já associado ao modal. Os controles de administração/publicação de conquistas permanecem no mesmo formulário e não foram removidos.
- A lista continua limitada às três conquistas mais recentes vinculadas ao perfil, como no comportamento anterior.

## 3. Ano de cadastro nos cartões do diretório

- Removida a linha “Ano de cadastro” do HTML dos cartões de perfil na página Sobre.
- A data/ano de cadastro continua sendo calculada internamente para a opção de ordenação por ano, portanto a ordenação não foi removida.
- Nenhum ano foi inventado nem derivado de conquista ou matéria.

## 4. Atualização do PWA e aviso de aplicativo desatualizado

- O cache do service worker principal foi versionado de `fp-paiquere-pwa-v184` para `fp-paiquere-pwa-v185`.
- O precache inclui a nova folha CSS e o arquivo de configuração pública de OneSignal.
- O registro do service worker agora solicita `registration.update()` e usa `updateViaCache: 'none'` para evitar que o cache HTTP antigo atrase a verificação do script do worker.
- O manifesto já existente continua com escopo e start URL relativos (`./`), adequados à publicação em subdiretório, e seus ícones já referenciados devem continuar no mesmo caminho.
- **Não foram alteradas regras Firestore/Storage.** Essas regras controlam leitura/escrita de dados, não a política de atualização do service worker nem a confiança de instalação do navegador. Se o alerta específico persistir depois da publicação e atualização do PWA, é necessária uma captura/texto exato para identificar se vem do navegador, Firebase App Check ou outro componente. Não é seguro relaxar regras sem diagnóstico.

## 5. Notificações reais — OneSignal Web Push

- Preparado adaptador opcional do OneSignal Web SDK v16 (`onesignal-config.js`) e service worker próprio em `onesignal/OneSignalSDKWorker.js`, com escopo separado (`/onesignal/`) para coexistir com o service worker principal.
- O botão de notificação passa a distinguir push real dos alertas locais existentes. Com a integração desligada, o rótulo deixa claro que os alertas locais só funcionam enquanto a página está aberta.
- Quando o OneSignal estiver configurado, a assinatura/desinscrição é feita com `User.PushSubscription.optIn()` / `optOut()`. O `optIn()` é chamado diretamente no clique do usuário, antes do primeiro `await`, para respeitar o gesto exigido pelo navegador.
- `onesignal-config.js` permanece desativado (`enabled: false`, `appId: ''`) porque o App ID precisa ser criado no painel OneSignal pela administração do projeto. O App ID pode ficar no frontend; API Key/REST Key e qualquer segredo devem permanecer no servidor.
- O plano gratuito oficial anuncia Web Push até 10.000 assinantes por envio. O limite de 1.000 MAU aplica-se a Mobile Push/In-App, não ao canal Web Push. Verificação: página oficial de preços da OneSignal, consultada em 30/10/2026.
- Em iPhone/iPad, o Web Push exige iOS/iPadOS 16.4 ou posterior e que o site esteja adicionado à Tela de Início como web app. Verificação: documentação oficial da Apple/WebKit.
- O pacote permite a configuração e assinatura por dispositivo, mas **não ativa push ainda**, pois falta o App ID. Envio manual pelo painel OneSignal poderá ser testado após configurar a aplicação. Disparos automáticos no momento em que matérias/conquistas/avisos são publicados exigem integração de servidor segura; não foram implementados no frontend para não expor API Key. A possibilidade de backend compatível com o Firebase Spark deverá ser avaliada separadamente.
- Push não é entrega offline ilimitada: o aparelho precisa reconectar e a mensagem precisa continuar dentro do prazo de validade/TTL do serviço.

## 6. Bloco de texto do editor

- O Google Fonts do editor v184 já listava as famílias web disponíveis do seletor (Inter, Lato, Merriweather, Montserrat, Nunito, Open Sans, Oswald, Playfair Display, Raleway, Roboto e Source Sans 3). Essa configuração foi preservada, sem duplicar imports. Fontes de sistema como Arial, Georgia, Tahoma e Times New Roman continuam disponíveis como fallback local.
- A inserção de links deixou de depender de `document.execCommand('createLink')`: o código usa Range/DOM para envolver o trecho selecionado em um `<a>` com URL validada HTTP/HTTPS, `target="_blank"` e `rel="noopener noreferrer"`.
- Antes de inserir um novo link, a rotina rejeita sobreposição com links existentes, evitando âncoras aninhadas. A ferramenta de remover link continua preservada e a sincronização para `dataLinks`, canvas e prévia continua passando por `syncRichEditorToObject()`.
- Mantido o comportamento intencional de colagem como texto simples. Isso evita importar CSS/HTML de Word, Google Docs ou outros sites. O texto colado recebe a família/tamanho/peso do estilo atual do bloco ou do estilo pendente, e quebras de linha são normalizadas.
- Foram adicionados ajustes de foco visível, altura mínima de edição, quebra de palavras longas e tamanho de alvos de toque no editor móvel. Comandos de negrito, itálico, sublinhado, listas, alinhamento e estilo/família existentes foram preservados.

## 7. Arquivos

Arquivos alterados: `app.js`, `editor.js`, `folha-notifications-sw.js`, `notifications.js`, `pwa.js`, `portal.js`, `editor.html`, `sobre.html`, `painel.html`, `index.html`, `login.html`, `participar.html`, `noticias.html`, `noticia-single.html`, `conquistas.html`, `perfil.html` e `fp-v184-role-navigation-fix.css`.

Arquivos adicionados: `fp-v185-focused-fixes.css`, `onesignal-config.js`, `onesignal/OneSignalSDKWorker.js` e este relatório, além do guia de configuração do OneSignal.

Nenhum arquivo foi removido.

## 8. Validação e limitações

Verificações que devem ser executadas localmente antes de publicação:

1. `node --check` nos scripts JavaScript alterados e no service worker.
2. Validar `manifest.webmanifest` como JSON.
3. Confirmar se cada HTML alterado referencia arquivos locais existentes.
4. `unzip -t` no pacote final.
5. Teste visual real em desktop e celular: cartão Sobre, três conquistas privadas, modal “Ver conquista”, estilos/fontes/links/colagem no bloco de texto.
6. Após App ID: verificar assinatura Web Push em Android/Chrome e iOS/iPadOS instalado; enviar uma notificação de teste pelo painel OneSignal.
7. Após publicação: abrir o PWA instalado, conferir o novo controller/service worker e observar se o aviso antigo desaparece.

O ambiente desta sessão não disponibilizou navegação real no Chromium (a tentativa anterior foi bloqueada por `ERR_BLOCKED_BY_ADMINISTRATOR`). Portanto, não se afirma que testes E2E, testes reais em celular, assinatura OneSignal ou instalação PWA tenham sido executados. A verificação estática e estrutural será registrada separadamente no pacote.

## 9. Fontes oficiais consultadas para a decisão Web Push

- OneSignal pricing: https://onesignal.com/pricing
- OneSignal Web SDK migration guide: https://github.com/OneSignal/OneSignal-Website-SDK/blob/main/MIGRATION_GUIDE.md
- OneSignal worker/custom scope guidance: https://documentation.onesignal.com/docs/en/vue-js-setup
- Apple Web Push for web apps: https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers
- WebKit iOS/iPadOS Web Push: https://webkit.org/blog/13878/
