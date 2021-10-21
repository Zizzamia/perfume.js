<a href="http://www.perfumejs.com/">
  <img src="https://github.com/Zizzamia/perfume.js/blob/master/docs/src/assets/perfume-logo-v5-0-0.png"
  align="left" width="200" alt="Perfume.js logo" />
</a>

# [Perfume.js v6.3.0](http://perfumejs.com)

[![Current version](https://img.shields.io/github/tag/zizzamia/perfume.js?color=3498DB&label=version)](https://www.npmjs.org/package/perfume.js) [![Test Coverage](https://api.codeclimate.com/v1/badges/f813d2f45b274d93b8c5/test_coverage)](https://codeclimate.com/github/Zizzamia/perfume.js/test_coverage) <img alt="No dependencies" src="https://img.shields.io/badge/dependencies-none-27ae60.svg"> [![Build Status](https://travis-ci.org/Zizzamia/perfume.js.svg?branch=master)](https://travis-ci.org/Zizzamia/perfume.js) [![NPM Downloads](http://img.shields.io/npm/dm/perfume.js.svg)](https://www.npmjs.org/package/perfume.js) [![gzip size](https://img.badgesize.io/https://unpkg.com/perfume.js?compression=gzip&label=JS+gzip+size)](https://unpkg.com/perfume.js) [![brotli size](https://img.badgesize.io/https://unpkg.com/perfume.js?compression=brotli&label=JS+brotli+size)](https://unpkg.com/perfume.js)

<!-- > <b>Page Speed</b> is a feature, and to deliver it we need to understand the many factors and fundamental limitations that are at play. If we can measure it, we can improve it. -->

<b>Page Speed</b> è una feature, e per realizzarla dobbiamo comprendere molti fattori e le limitazioni fondamentali che sono in gioco. Se possiamo misurarlo, possiamo migliorarlo.

<br />
<br />
<br />
<br />

[English](./README.md) | [简体中文](./README-zh_CN.md) | Italian | [한국어](./README-ko.md)

## Perchè Perfume.js?

<!-- Perfume is a tiny, web performance monitoring library that reports field data back to your favorite analytics tool. -->

Perfume è una piccola libreria che monitora le prestazioni web e che riporta i dati al tuo analytics tool preferito.

- ⏰ Supporta le più recenti Performance API per metriche precise
- 🚀 Arricchimento dei dati del device
- 🔨 Testato su più browser
- 🚿 Filtra i risultati falsi positivi / negativi
- 🤙 Solo 2Kb gzip
- 🏅 Web Vitals Score
- 🛰 Analytics tool flessibile
- ⚡️ Nessun spreco di ms con la strategia [requestIdleCallback](https://developers.google.com/web/updates/2015/08/using-requestidlecallback) incorporata
  <br />

## Le ultime novità in metriche & Real User Measurement

<!--
**Perfume** leverages the latest Performance APIs to collect **field data** that allows us to understand what real-world users are actually experiencing. -->

**Perfume** sfrutta le più recenti Performance API per raccogliere **dati** che ci consente di capire cosa stanno effettivamente sperimentando gli utenti del mondo reale.

- Navigation Timing
- Navigator Interface
- Resource Timing
- Element Timing
- Service Worker Status
- StorageManager interface
- First Paint ([FP](https://medium.com/@zizzamia/first-contentful-paint-with-a-touch-of-perfume-js-cd11dfd2e18f))
- First Contentful Paint ([FCP](https://web.dev/first-contentful-paint/))
- Largest Contentful Paint ([LCP](https://web.dev/lcp/))
- First Input Delay ([FID](https://web.dev/fid/))
- Cumulative Layout Shift ([CLS](https://web.dev/cls/))
- Total Blocking Time ([TBT](https://web.dev/tbt/))
- [Web Vitals Score](https://web.dev/vitals/)

<br />
<!-- With Perfume.js, you can collect these metrics to develop a deeper understanding of how customers around the world perceive web performance for your application.  -->
Con Perfume.js, puoi raccogliere queste metriche per sviluppare una comprensione più approfondita di come i client di tutto il mondo percepiscono le prestazioni web per la tua applicazione.
<br />
<!-- Use your favorite analytics tool to visualize the data from country to country.  -->
Usa il tuo analytics tool preferito per visualizzare i dati di paese in paese.
<!-- Take a look at this example comparing <b>FCP</b> for www.coinbase.com in the United States, Italy, Indonesia, and Nigeria. -->
Dai un'occhiata a questo esempio di confronto <b>FCP</b> da www.coinbase.com negli Stati Uniti, in Italia, Indonesia e Nigeria.
<br />

![First Contentful Paint](https://github.com/Zizzamia/perfume.js/blob/master/docs/src/assets/first-contentful-paint-desktop.png)

## Installazione

npm (https://www.npmjs.com/package/perfume.js):

    npm install perfume.js --save

### Importazione della libreria

<!-- You can import the generated bundle to use the whole library generated: -->

Puoi importare il bundle generato per utilizzare l'intera libreria generata:

```javascript
import Perfume from 'perfume.js';
```

Definizione del modulo universale:

```javascript
import Perfume from 'node_modules/perfume.js/dist/perfume.umd.min.js';
```

<br />

## Avvio rapido

<!-- Metrics like **Navigation Timing**, **Network Information**, **FP**, **FCP**, **FID**, **LCP**, **CLS** and **TBT** are default reported with Perfume; All results will be reported to the `analyticsTracker` callback, and the code below is just one way for you to organize your tracking, feel free to tweak it suit your needs. -->

Metriche come **Navigation Timing**, **Network Information**, **FP**, **FCP**, **FID**, **LCP**, **CLS** and **TBT** sono segnalati di default con Perfume; Tutti i risultati verranno riportati al callback `analyticsTracker`, e il codice seguente è solo un modo per organizzare il monitoraggio, sentiti libero di modificarlo in base alle tue esigenze.

<!-- 🚀 Visit [perfumejs.com](http://perfumejs.com/) for a live demo on how the metrics work. 🌕 -->

🚀 Visita [perfumejs.com](http://perfumejs.com/) per una demo dal vivo su come funzionano le metriche. 🌕

```javascript
const perfume = new Perfume({
  analyticsTracker: options => {
    const {
      metricName,
      data,
      eventProperties,
      navigatorInformation,
      vitalsScore,
    } = options;
    switch (metricName) {
      case 'navigationTiming':
        if (data && data.timeToFirstByte) {
          myAnalyticsTool.track('navigationTiming', data);
        }
        break;
      case 'networkInformation':
        if (data && data.effectiveType) {
          myAnalyticsTool.track('networkInformation', data);
        }
        break;
      case 'storageEstimate':
        myAnalyticsTool.track('storageEstimate', data);
        break;
      case 'fp':
        myAnalyticsTool.track('firstPaint', { duration: data });
        break;
      case 'fcp':
        myAnalyticsTool.track('firstContentfulPaint', { duration: data });
        break;
      case 'fid':
        myAnalyticsTool.track('firstInputDelay', { duration: data });
        break;
      case 'lcp':
        myAnalyticsTool.track('largestContentfulPaint', { duration: data });
        break;
      case 'lcpFinal':
        myAnalyticsTool.track('largestContentfulPaintFinal', {
          duration: data,
        });
        break;
      case 'cls':
        myAnalyticsTool.track('cumulativeLayoutShift', { value: data });
        break;
      case 'clsFinal':
        myAnalyticsTool.track('cumulativeLayoutShiftFinal', { value: data });
        break;
      case 'tbt':
        myAnalyticsTool.track('totalBlockingTime', { duration: data });
        break;
      case 'tbt5S':
        myAnalyticsTool.track('totalBlockingTime5S', { duration: data });
        break;
      case 'tbt10S':
        myAnalyticsTool.track('totalBlockingTime10S', { duration: data });
        break;
      case 'tbtFinal':
        myAnalyticsTool.track('totalBlockingTimeFinal', { duration: data });
        break;
      case 'elPageTitle':
        myAnalyticsTool.track('elementTimingPageTitle', { duration: data });
        break;
      default:
        myAnalyticsTool.track(metricName, { duration: data });
        break;
    }
  },
});
```

<!-- In a world with widely varying device capabilities, a one-size-fits-all event doesn’t always work. Perfume adds **data enrichment** to all events so we can better understand the real world experiences: -->

In un mondo dove le capacità dei device è ampiamente variabile, un evento valido per tutti non funziona sempre. Perfume aggiunge un **arricchimento dei dati** a tutti gli eventi in modo da poter comprendere meglio le esperienze del mondo reale:

- **deviceMemory**: la memoria del dispositivo dell'utente (RAM).
- **hardwareConcurrency**: il numero di core del processore della CPU logica sul dispositivo dell'utente.
- **serviceWorkerStatus**: status del service worker tra controllato, supportato e non supportato.

<!-- Based on the Navigator APIs the library can help us differentiate between a low-end and a high-end device/experience: -->

Sulla base delle Navigator API, la libreria può aiutarci a distinguere tra un low-end e un high-end device/experience:

- **isLowEndDevice**: combinazione del punteggio di RAM e CPU.
- **isLowEndExperience**: combinazione del punteggio di RAM, CPU, NetworkStatus e SaveData.

## Performance audits

Coo coo coo [cool](https://www.youtube.com/watch?v=zDcbpFimUc8), impariamo qualcosa di nuovo.

### Navigation Timing

<!-- Navigation Timing collects performance metrics for the life and timings of a network request. -->

Navigation Timing raccoglie le metriche delle prestazioni per la durata e i tempi di network request.

<!-- Perfume helps expose some of the key metrics you might need. -->

Perfume aiuta a esporre alcune delle metriche chiave di cui potresti aver bisogno.

<ul>
  <li><b>Redirect time</b>: Page redirects aren't totally inconsequential, but they might not be something you run into very often. Still, redirects add latency to requests, so measuring them may be worth the effort.</li>
  <li><b>DNS lookup</b>: Quando un utente richiede un URL, viene richiesto al Domain Name System (DNS) di tradurre un dominio in un indirizzo IP.</li>
  <li><b>Header size</b>: La dimensione del HTTP header</li>
  <li><b>Tempo di Fetch</b>: Ricerca cache più tempo di risposta</li>
  <li><b>Tempo del Worker</b>: Tempo del Service worker più tempo di risposta</li>
  <li><b>Tempo totale</b>: Request più tempo di risposta (solo network)</li>
  <li><b>Tempo di Download</b>: Solo tempo di risposta (download)</li>
  <li><b>Tempo per il Primo Byte</b>: La quantità di tempo necessaria dopo che il client invia una richiesta HTTP GET per ricevere il primo byte della risorsa richiesta dal server.
    È il più grande componente del tempo di caricamento della pagina Web che richiede dal 40 al 60% della latenza totale della pagina Web.</li>
</ul>

```javascript
// Perfume.js: navigationTiming { ... timeToFirstByte: 192.65 }
```

### First Paint ([FP](https://medium.com/@zizzamia/first-contentful-paint-with-a-touch-of-perfume-js-cd11dfd2e18f))

<!-- **FP** is the exact time taken for the browser to render anything as visually different from what was on the screen before navigation, e.g. a background change after a long blank white screen time. -->

**FP** è il tempo esatto impiegato dal browser per rendere visivamente qualsiasi cosa diversa da ciò che era sullo schermo prima della navigazione, ad es. un cambio di background dopo un lungo periodo di tempo sullo schermo bianco vuoto.

```javascript
// Perfume.js: fp 1482.00 ms
```

### First Contentful Paint ([FCP](https://medium.com/@zizzamia/first-contentful-paint-with-a-touch-of-perfume-js-cd11dfd2e18f))

<!-- **FCP** is the exact time taken for the browser to render the first bit of content from the DOM, which can be anything from an important image, text, or even the small SVG at the bottom of the page. -->

**FCP** è il tempo esatto impiegato dal browser per eseguire il rendering del primo bit di contenuto dal DOM, che può essere qualsiasi cosa, da un'immagine importante, testo o anche il piccolo SVG nella parte inferiore della pagina.

```javascript
// Perfume.js: fcp 2029.00 ms
```

### Largest Contentful Paint (LCP)

<!-- **LCP** is an important, user-centric metric for measuring perceived load speed because it marks the point in the page load timeline when the page's main content has likely loaded—a fast LCP helps reassure the user that the page is useful. -->

**LCP** è un'importante metrica incentrata sull'utente per misurare la velocità di caricamento percepita perché segna il punto nella sequenza temporale di caricamento della pagina in cui è probabile che il contenuto principale della pagina sia stato caricato: un LCP veloce aiuta a rassicurare l'utente sull'utilità della pagina.

<!-- We end the Largest Contentful Paint measure at two points: when First Input Delay happen and when the page's lifecycle state changes to hidden. -->

Terminiamo la misura Largest Contentful Paint in due punti: quando si verifica il First Input Delay e quando lo stato del ciclo di vita della pagina cambia in hidden.

```javascript
// Perfume.js: lcp 2429.00 ms
// Perfume.js: lcpFinal 2642.00 ms
```

### First Input Delay (FID)

<!-- **FID** measures the time from when a user first interacts with your site (i.e. when they click a link, tap on a button) to the time when the browser is actually able to respond to that interaction. -->

**FID** misura il tempo da quando un utente interagisce per la prima volta con il tuo sito (cioè quando fa clic su un collegamento, tocca un pulsante) al momento in cui il browser è effettivamente in grado di rispondere a tale interazione.

```javascript
// Perfume.js: fid 3.20 ms
```

### Cumulative Layout Shift (CLS)

<!-- **CLS** is an important, user-centric metric for measuring visual stability because it helps quantify how often users experience unexpected layout shifts—a low CLS helps ensure that the page is delightful. -->

**CLS** è una metrica importante e incentrata sull'utente per misurare la stabilità visiva perché aiuta a quantificare la frequenza con cui gli utenti riscontrano cambiamenti di layout imprevisti: un CLS basso aiuta a garantire che la pagina sia piacevole.

<!-- We end the Cumulative Layout Shift measure at two points: when First Input Delay happen and when the page's lifecycle state changes to hidden. -->

Terminiamo la misura Cumulative Layout Shift in due punti: quando si verifica il First Input Delay e quando lo stato del ciclo di vita della pagina cambia in hidden.

```javascript
// Perfume.js: cls 0.13
// Perfume.js: clsFinal 0.13
```

### Total Blocking Time (TBT)

<!-- **TBT** is an important, user-centric metric for measuring load responsiveness because it helps quantify the severity of how non-interactive a page is prior to it becoming reliably interactive—a low TBT helps ensure that the page is usable. -->

**TBT** è una metrica importante e incentrata sull'utente per misurare la capacità di risposta al carico perché aiuta a quantificare la gravità di quanto una pagina non sia interattiva prima che diventi interattiva in modo affidabile: un TBT basso aiuta a garantire che la pagina sia utilizzabile.

<!-- We end the Total Blocking Time measure at four points: when First Input Delay happen, 5 seconds after FID, 10 seconds after FID and when the page's lifecycle state changes to hidden. -->

Terminiamo la misura Total Blocking Time in quattro punti: quando si verifica il First Input Delay, 5 secondi dopo FID, 10 secondi dopo FID e quando lo stato del ciclo di vita della pagina cambia in hidden.

```javascript
// Perfume.js: tbt 347.07 ms
// Perfume.js: tbt5S 427.14 ms
// Perfume.js: tbt10S 427.14 ms
// Perfume.js: tbtFinal 526.08 ms
```

### Resource Timing

<!-- Resource Timing collects performance metrics for document-dependent resources. Stuff like style sheets, scripts, images, et cetera. -->

Resource Timing raccoglie le metriche delle prestazioni per le risorse dipendenti dal documento. Cose come fogli di stile, script, immagini, eccetera.

<!-- Perfume helps expose all PerformanceResourceTiming entries and groups data data consumption by Kb used. -->

Perfume aiuta a esporre tutte le voci PerformanceResourceTiming e raggruppa il consumo dei dati per Kb utilizzati.

```javascript
const perfume = new Perfume({
  resourceTiming: true,
  analyticsTracker: ({ metricName, data }) => {
    myAnalyticsTool.track(metricName, data);
  })
});
// Perfume.js: dataConsumption { "css": 185.95, "fetch": 0, "img": 377.93, ... , "script": 8344.95 }
```

<!-- ### Annotate metrics in the DevTools -->

### Annota le metriche in DevTools

<!-- **Performance.mark** ([User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API)) is used to create an application-defined peformance entry in the browser's performance entry buffer. -->

**Performance.mark** ([User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API)) viene utilizzato per creare un ingresso delle prestazioni definita dall'applicazione nel buffer di ingresso delle prestazioni del browser.

```javascript
const perfume = new Perfume({
  analyticsTracker: ({ metricName, data }) => {
    myAnalyticsTool.track(metricName, data);
  })
});
perfume.start('fibonacci');
fibonacci(400);
perfume.end('fibonacci');
// Perfume.js: fibonacci 0.14 ms
```

![Performance Mark](https://github.com/Zizzamia/perfume.js/blob/master/docs/src/assets/performance-mark.png)

### Component First Paint

<!-- This metric mark the point, immediately after creating a **new component**, when the browser renders pixels to the screen. -->

Questa metrica segna il punto, immediatamente dopo la creazione di un **new component**, in cui il browser esegue il rendering dei pixel sullo schermo.

```javascript
const perfume = new Perfume({
  analyticsTracker: ({ metricName, data }) => {
    myAnalyticsTool.track(metricName, data);
  })
});
perfume.start('togglePopover');
$(element).popover('toggle');
perfume.endPaint('togglePopover');
// Perfume.js: togglePopover 10.54 ms
```

![Performance](https://github.com/Zizzamia/perfume.js/blob/master/docs/src/assets/performance-cfp.png)

### Element Timing

<!-- Track when image elements and text nodes are displayed on screen using the [emerging](https://chromestatus.com/features#elementtiming) [Element Timing API](https://wicg.github.io/element-timing/) specification by simply adding the `elementtiming` attribute with a descriptive value of your choice to HTML elements you would like to measure: -->

Traccia quando gli elementi dell'immagine e i nodi di testo vengono visualizzati sullo schermo utilizzando la specifica [emerging](https://chromestatus.com/features#elementtiming) [Element Timing API](https://wicg.github.io/element-timing/) aggiungendo semplicemente l'attributo `elementtiming` con un valore descrittivo a tua scelta agli elementi HTML che desideri misurare:

```html
<h1 elementtiming="elPageTitle" class="title">Perfume.js</h1>
<img
  elementtiming="elHeroLogo"
  alt="Perfume.js logo"
  src="https://zizzamia.github.io/perfume/assets/perfume-logo-v5-0-0.png"
/>
```

```javascript
const perfume = new Perfume({
  elementTiming: true,
  analyticsTracker: ({ metricName, data }) => {
    myAnalyticsTool.track(metricName, data);
  })
});

// Perfume.js: elPageTitle 256.00 ms
// Perfume.js: elHeroLogo 1234.00 ms
```

## Web Vitals Score

<!-- Perfume will expose for all major metrics the vitals score, those can be used to improve your [SEO and Google page rank](https://webmasters.googleblog.com/2020/05/evaluating-page-experience.html). -->

Perfume esporrà per tutte le principali metriche il punteggio dei valori vitali, che possono essere utilizzati per migliorare il tuo [SEO e Google page rank](https://webmasters.googleblog.com/2020/05/evaluating-page-experience.html).

| Web Vitals                                |   Good | Needs Improvement |      Poor |
| ----------------------------------------- | -----: | ----------------: | --------: |
| Fist Paint (fp)                           | 0-1000 |         1001-2500 | Over 2500 |
| First Contentful Paint (fcp)              | 0-1000 |         1001-2500 | Over 2500 |
| Largest Contentful Paint (lcp)            | 0-2500 |         2501-4000 | Over 4000 |
| Largest Contentful Paint Final (lcpFinal) | 0-2500 |         2501-4000 | Over 4000 |
| First Input Delay (fid)                   |  0-100 |           101-300 |  Over 300 |
| Cumulative Layout Shift (cls)             |  0-0.1 |         0.11-0.25 | Over 0.25 |
| Cumulative Layout Shift Final (clsFinal)  | 0-2500 |         2501-4000 | Over 4000 |
| Total Blocking Time (tbt)                 |  0-300 |           301-600 |  Over 600 |
| Total Blocking Time 5S (tbt5S)            |  0-300 |           301-600 |  Over 600 |
| Total Blocking Time 10S (tbt10S)          |  0-300 |           301-600 |  Over 600 |
| Total Blocking Time Final (tbtFinal)      |  0-300 |           301-600 |  Over 600 |

## Opzioni personalizzate di Perfume

<!-- Default options provided to Perfume.js constructor. -->

Opzioni predefinite fornite al costruttore Perfume.js.

```javascript
const options = {
  resourceTiming: false,
  elementTiming: false,
  analyticsTracker: options => {},
  maxMeasureTime: 15000,
};
```

## Utilizza Google Analytics

<!-- A quick way to see your page speed results on your web app is by using Google Analytics. Those GA events will show on Behavior > Site Speed > User Timings. For testing you might want to see them coming live on Realtime > Events. -->

Un modo rapido per visualizzare i risultati sulla velocità della pagina sulla tua app web è utilizzare Google Analytics. Questi eventi GA verranno visualizzati in Behavior > Site Speed > User Timings. Per i test potresti vederli in diretta su Realtime > Events.

Divertiti ✨

```javascript
const metricNames = ['fp', 'fcp', 'lcp', 'lcpFinal', 'fid', 'cls', 'clsFinal', 'tbt', 'tbt10S', 'tbtFinal'];
new Perfume({
  analyticsTracker: ({ metricName, data, navigatorInformation }) => {
    if (metricNames.includes(metricName)) {
      ga('send', 'event', {
        eventCategory: 'Perfume.js',
        eventAction: metricName,
        // Google Analytics metrics must be integers, so the value is rounded
        eventValue: metricName === 'cls' ? data * 1000 : data,
        eventLabel: navigatorInformation.isLowEndExperience ? 'lowEndExperience' : 'highEndExperience',
        // Use a non-interaction event to avoid affecting bounce rate
        nonInteraction: true,
      });
    }
  })
});
```

<!-- To connect with additional analytics providers, checkout the [analytics plugin for Perfume.js](https://getanalytics.io/plugins/perfumejs/). -->

Per connetterti con altri analytics providers, controlla il [analytics plugin for Perfume.js](https://getanalytics.io/plugins/perfumejs/).

<br />

## Develop

- `npm run test`: Run test suite
- `npm run build`: Genera bundle e typings
- `npm run lint`: Lints code
  <br />

## Plugins

- [Perfume.js plugin for GatsbyJS](https://github.com/NoriSte/gatsby-plugin-perfume.js)
- [Perfume.js plugin for Analytics](https://github.com/DavidWells/analytics/tree/master/packages/analytics-plugin-perfumejs)
  <br />

## Perfume è utilizzato da

- [Conio](https://business.conio.com/)
- [Coinbase](https://www.coinbase.com)
- [Coinbase Pro](https://pro.coinbase.com)
- [Coinbase Custody](https://custody.coinbase.com)
- [Financial-Times](https://github.com/Financial-Times/n-tracking)
- [Hearst](https://www.cosmopolitan.com/)
- [Plan](https://getplan.co)
- Aggiungi il nome della tua azienda :)
  <br />

## Crediti e Specifiche

Fatto con ☕️ da [@zizzamia](https://twitter.com/zizzamia) e
Voglio ringraziare alcuni amici e progetti per il lavoro che hanno svolto:

<!-- - [Leraging the Performance Metrics that Most Affect User Experience](https://developers.google.com/web/updates/2017/06/user-centric-performance-metrics) for documenting this new User-centric performance metrics;ev -->

- [Leraging the Performance Metrics that Most Affect User Experience](https://developers.google.com/web/updates/2017/06/user-centric-performance-metrics) per documentare questa nuova metrica delle prestazioni incentrata sull'utente;ev
  <!-- - [Performance Timeline Level 2](https://w3c.github.io/performance-timeline/) the definition of _PerformanceObserver_ in that specification; -->
- [Performance Timeline Level 2](https://w3c.github.io/performance-timeline/) la definizione di _PerformanceObserver_ in quella specifica;
  <!-- - [The Contributors](https://github.com/Zizzamia/perfume.js/graphs/contributors) for their much appreciated Pull Requests and bug reports; -->
- [I Contributori](https://github.com/Zizzamia/perfume.js/graphs/contributors) per le loro apprezzate richieste di pull e segnalazioni di bugs;
- **Tu** per la stella che darai a questo progetto 😉 and per avermi supportato nel provare il mio progetto 😄

### Contributori

Questo progetto esiste grazie a tutte le persone che contribuiscono.
<img src="https://opencollective.com/perfumejs/contributors.svg?width=890&button=false" />

### I sostenitori

Grazie a tutti i nostri sostenitori! 🙏 [[Diventa un sostenitore](https://opencollective.com/perfumejs#backer)]

<a href="https://opencollective.com/perfumejs#backers" target="_blank"><img src="https://opencollective.com/perfumejs/backers.svg?width=890"></a>

<br />

## Copyright and license

Code and documentation copyright 2020 [Leonardo Zizzamia](https://twitter.com/Zizzamia). Code released under the [MIT license](LICENSE). Docs released under Creative Commons.

## Team

<table>
  <tbody>
    <tr>
      <td align="center" valign="top">
        <a href="https://twitter.com/Zizzamia">
          <img width="100" height="100" src="https://github.com/zizzamia.png?s=150">
        </a>
        <br />
        <a href="https://twitter.com/Zizzamia">Leonardo Zizzamia</a>
      </td>
     </tr>
  </tbody>
</table>
