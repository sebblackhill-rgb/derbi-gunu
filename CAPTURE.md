# Payload capture / Olay kaydı

English first, Turkish below. This mode records every raw live-provider event, mapped event, handle result, connection-state change and reconnect so a short private test stream can be shared for analysis. It is **not** a real TikTok capture by itself — you have to run a stream and then send the file.

## English — how to record a test stream

1. Open this exact link on the computer or phone that will stay on the live page during the test (leave the tab open the whole time):

   https://sebblackhill-rgb.github.io/derbi-gunu/?live=1&capture=1

2. Confirm the blue **Payload capture** panel is visible in the corner, with **Download capture (JSON)** and **Copy to clipboard**.
3. Start a short **private** TikTok LIVE (a few minutes is enough). Keep this tab in the foreground if you can.
4. Do a little of everything so the file is useful:
   - Join each team with the keywords (`BJK` / `Beşiktaş` / `Kartal` / ⚫⚪ and `FB` / `Fener` / `Fenerbahçe` / 💛💙)
   - Send a like
   - Send a small repeating gift (a Rose combo that ticks 1, then 2, then 5 is ideal)
   - Send one larger gift if you can
   - If the connection drops, let it retry, or use **Reconnect**
5. When you stop the live, check the panel still lists events. Tap **Download capture (JSON)** (or **Copy to clipboard** if the download is blocked).
6. Send the `.json` file back so we can replay it through the test harness.

The file includes full event JSON, timestamps, connection state and reconnect attempts. It may contain usernames and public profile photos from the live — treat it as private.

If the status pill says **Disconnected** the whole time and the event count stays at 0 or only shows status rows, the connector never saw the stream. Note that in your message, and still send the file.

## Türkçe — test yayını nasıl kaydedilir

1. Test sırasında açık kalacak telefon veya bilgisayarda şu bağlantıyı açın (sekme açık kalsın):

   https://sebblackhill-rgb.github.io/derbi-gunu/?live=1&capture=1

2. Köşede mavi **Olay kaydı** panelini, **Kaydı indir (JSON)** ve **Panoya kopyala** düğmelerini görün.
3. Kısa bir **gizli** TikTok CANLI yayını başlatın (birkaç dakika yeter). Mümkünse bu sekmeyi önde tutun.
4. Kaydın işe yaraması için biraz her şeyden yapın:
   - Anahtar kelimelerle iki takıma da katılın (`BJK` / `Beşiktaş` / `Kartal` / ⚫⚪ ve `FB` / `Fener` / `Fenerbahçe` / 💛💙)
   - Bir beğeni gönderin
   - Tekrarlayan küçük bir hediye gönderin (1, sonra 2, sonra 5 sayan bir Gül ideal)
   - Mümkünse bir büyük hediye gönderin
   - Bağlantı koparsa yeniden denemesini bekleyin veya **Yeniden bağlan** kullanın
5. Yayını bitirdikten sonra panelde olayların listelendiğini kontrol edin. **Kaydı indir (JSON)** düğmesine basın (indirme engellenirse **Panoya kopyala**).
6. `.json` dosyasını bize gönderin; test setinde yeniden oynatacağız.

Dosyada ham olay JSON’u, zaman damgaları, bağlantı durumu ve yeniden bağlanma denemeleri vardır. Yayındaki kullanıcı adları ve profil fotoğrafları da bulunabilir — özel tutun.

Durum rozeti baştan sona **Bağlantı yok** kalır ve olay sayısı 0’da (veya yalnızca durum satırlarında) kalırsa bağlayıcı yayını hiç görmemiş demektir. Bunu mesajınızda belirtin; dosyayı yine de gönderin.

## Replay (developers)

A synthetic sample lives at `tests/fixtures/sample-capture.json` (clearly marked as not a real capture). The harness feeds it through `window.__replayCapture` and asserts exactly-once credit, including the no-`repeatEnd` 1+2+5 case (total **5**, not 8).
