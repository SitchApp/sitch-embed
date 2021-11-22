let _sitch_initializeButtons: null | (() => void) = null;

interface SitchOptions {
  baseZIndex: number;
  preloadHash: string;
  backgroundColor: string;
  testingMode: 'prod' | 'staging' | 'local';
  onSitchActivationCallback: (hash: string, url: string) => void;
}

const baseOptions: SitchOptions = {
  baseZIndex: 999999,
  preloadHash: '',
  backgroundColor: 'none',
  testingMode: 'prod',
  onSitchActivationCallback: () => undefined,
};

export default (options: Partial<SitchOptions> | undefined = undefined) => {
  const mergedOptions = Object.assign(baseOptions, options);
  if (_sitch_initializeButtons) {
    // In this case Sitch has already been initialized and we just have to initialize any new buttons.
    _sitch_initializeButtons();
  } else {
    let initialHashLoadHappened = false;
    const sessionId = Date.now();
    const globalScope: any = window;
    let baseUrl = '';
    const initSitchWidget = () => {
      document.documentElement.style.setProperty('--_sitch_max-content-width', `100vw`);
      document.documentElement.style.setProperty('--_sitch_negative-max-content-width', `-100vw`);
      switch (mergedOptions.testingMode) {
        case 'prod':
          baseUrl = 'https://sitch.app';
          break;
        case 'staging':
          baseUrl = 'https://sitch-client-test.web.app';
          break;
        case 'local':
          baseUrl = 'http://localhost:8081';
          break;
      }

      // Adding the html
      const sitchEmbedContainer = document.createElement('div');
      sitchEmbedContainer.id = '_sitch_embed';
      sitchEmbedContainer.innerHTML = /*html*/ `
        <div id="_sitch_full-screen-dimmer"></div>
        <div id="_sitch_iframe-container">
          <div id="_sitch_loading-spinner-container">
            <div id="_sitch_loader">Loading...</div>
          </div>
          <iframe id="_sitch_iframe" src="${baseUrl}/?e=true&v=${sessionId}" allow="payment *"></iframe>
        </div>
      `;
      document.body.appendChild(sitchEmbedContainer);

      // Adding the google fonts.
      const docHead = document.head;

      // Adding the styles.
      const styleSheet = document.createElement('style');
      styleSheet.innerText = /*css*/ `
          body._sitch_show {
            height: 100vh !important;
            overflow-y: hidden !important;
            padding-right: 15px;
          }
          #_sitch_full-screen-dimmer {
            position: absolute;
            z-index: ${mergedOptions.baseZIndex - 1};
            width: 100vw;
            height: 100vh;
            top: 0;
            left: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: none;
          }
          #_sitch_embed._sitch_show #_sitch_full-screen-dimmer {
            display: block;
            position: fixed;
          }
          #_sitch_iframe-container {
            background-color: #ededf7;
            transition: all 200ms ease-in;
            z-index: ${mergedOptions.baseZIndex};
            position: fixed;
            top: 0;
            right: var(--_sitch_negative-max-content-width);
            width: var(--_sitch_max-content-width);
            height: 100%;
            will-change: right, width;
          }
          #_sitch_embed._sitch_show #_sitch_iframe-container {
            right: 0;
          }
          #_sitch_iframe {
            height: 100%;
            width: 100%;
            border: none;
          }
          #_sitch_loading-spinner-container {
            background-color: rgba(0, 0, 0, 0.5);
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: ${mergedOptions.baseZIndex + 1};
            top: 0;
            left: 0;
            display: none;
            justify-conent: center;
            align-items: center;
          }
          #_sitch_embed._sitch_loading #_sitch_loading-spinner-container {
            display: flex;
          }
          #_sitch_loader,
          #_sitch_loader:after {
            border-radius: 50%;
            width: 10em;
            height: 10em;
          }
          #_sitch_loader {
            margin: 60px auto;
            font-size: 10px;
            position: relative;
            text-indent: -9999em;
            border-top: 1.1em solid rgba(255, 255, 255, 0.2);
            border-right: 1.1em solid rgba(255, 255, 255, 0.2);
            border-bottom: 1.1em solid rgba(255, 255, 255, 0.2);
            border-left: 1.1em solid #fff;
            -webkit-transform: translateZ(0);
            -ms-transform: translateZ(0);
            transform: translateZ(0);
            -webkit-animation: _sitch_load8 1.1s infinite linear;
            animation: _sitch_load8 1.1s infinite linear;
          }
          @-webkit-keyframes _sitch_load8 {
            0% {
              -webkit-transform: rotate(0deg);
              transform: rotate(0deg);
            }
            100% {
              -webkit-transform: rotate(360deg);
              transform: rotate(360deg);
            }
          }
          @keyframes _sitch_load8 {
            0% {
              -webkit-transform: rotate(0deg);
              transform: rotate(0deg);
            }
            100% {
              -webkit-transform: rotate(360deg);
              transform: rotate(360deg);
            }
          }
          `;
      docHead.appendChild(styleSheet);

      const container = document.getElementById('_sitch_embed');
      const dimmer = document.getElementById('_sitch_full-screen-dimmer');
      const iframe = document.getElementById('_sitch_iframe') as HTMLIFrameElement | null;
      const sitchHashes: string[] = [];

      if (!container || !dimmer || !iframe?.contentWindow) {
        return;
      }

      if (mergedOptions.backgroundColor) {
        iframe.contentWindow.document.body.style.backgroundColor = mergedOptions.backgroundColor;
      }

      const hideSitch = () => {
        setWidth();
        document.body.classList.remove('_sitch_show');
        container.classList.remove('_sitch_show');
        if (sitchHashes.includes(window.location.hash)) {
          if (doNotNavigateBackOnClose) {
            doNotNavigateBackOnClose = false;
          } else {
            window.history.back();
          }
        }
      };

      dimmer.onclick = hideSitch;

      const startLoading = () => {
        container.classList.add('_sitch_loading');
      };

      const endLoading = () => {
        container.classList.remove('_sitch_loading');
      };

      let sitchLink: string;
      let maxWidth: number;
      let oldSitchUrl: string;
      let doNotNavigateBackOnClose = false;

      const setWidth = () => {
        const maxWidthExistAndIsLessThanViewportWidth = Boolean(maxWidth && maxWidth < (globalScope.innerWidth > 0 ? globalScope.innerWidth : screen.width));
        document.documentElement.style.setProperty('--_sitch_max-content-width', `${maxWidthExistAndIsLessThanViewportWidth ? maxWidth + 'px' : '100vw'}`);
        document.documentElement.style.setProperty('--_sitch_negative-max-content-width', `${maxWidthExistAndIsLessThanViewportWidth ? -1 * maxWidth + 'px' : '-100vw'}`);
      };

      const onPopState = (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        hideSitch();
      };

      const onAppResize = () => {
        const width = globalScope.innerWidth > 0 ? globalScope.innerWidth : screen.width;
        if (maxWidth > width) {
          maxWidth = 0;
        }
      };
      onAppResize();

      globalScope.addEventListener('popstate', onPopState);
      globalScope.addEventListener('resize', onAppResize);
      globalScope.addEventListener(
        'message',
        (event: MessageEvent) => {
          if (!['https://sitch.app', 'https://sitch-client-test.web.app/', 'http://localhost:8081'].includes(event.origin)) {
            endLoading();
            return;
          }
          switch (event.data) {
            case '_sitch_fullscreen':
              document.documentElement.style.setProperty('--_sitch_max-content-width', '100vw');
              document.documentElement.style.setProperty('--_sitch_negative-max-content-width', '100vw');
              break;
            case '_sitch_shrink':
              setWidth();
              break;
            case '_sitch_close':
              hideSitch();
              break;
            case '_sitch_loaded':
              endLoading();
              break;
          }
        },
        false
      );

      _sitch_initializeButtons = () => {
        const sitchActivationButtons = document.querySelectorAll(`.sitch-activation-button`);
        sitchActivationButtons.forEach((button: any) => {
          if (button._sitch_initialized) {
            // Don't bother initializing buttons that have already been initialized.
            return;
          }
          button._sitch_initialized = true;
          button.style.cursor = 'pointer';
          const hashLabel = `#${button.dataset.sitchHash || 'sitch_embed'}`;
          if (!sitchHashes.includes(hashLabel)) {
            sitchHashes.push(hashLabel);
          }

          const showSitch = () => {
            prepareSitch(); // We need this since mouseover/focus may not always trigger before a click on mobile.
            document.body.classList.add('_sitch_show');
            container.classList.add('_sitch_show');
            iframe?.contentWindow?.focus();
            mergedOptions.onSitchActivationCallback(hashLabel, iframe?.src || '');
            if (window.location.hash !== hashLabel) {
              window.history.pushState('forward', '', `./${hashLabel}`);
            }
          };

          const prepareSitch = () => {
            sitchLink = button.dataset.sitchLink;
            maxWidth = Number(button.dataset.sitchMaxWidth) || 0;
            setWidth();
            if (iframe.contentWindow && sitchLink) {
              let newSitchUrl = '';
              const restOfQueryString = `&ew=${maxWidth}&bgc=${mergedOptions.backgroundColor}`;

              if (sitchLink.includes('?')) {
                newSitchUrl = `${sitchLink}&e=true${restOfQueryString}`;
              } else {
                newSitchUrl = `${sitchLink}/?e=true${restOfQueryString}`;
              }
              if (oldSitchUrl !== newSitchUrl) {
                oldSitchUrl = newSitchUrl;
                iframe.contentWindow.postMessage(
                  {
                    _sitch_messageType: '_sitch_newSitchUrl',
                    value: newSitchUrl,
                  },
                  '*'
                );
              }
            } else {
              alert('This button does not have the required Sitch fields.');
            }
          };

          button.onclick = showSitch;
          button.onmouseover = prepareSitch;
          button.onfocus = prepareSitch;

          // If when Sitch was initialized the url contained a sitch-hash, open up that Sitch.
          // If none of the Sitches have a given hash, opening the page with the hash "sitch_embed" will just open up the first Sitch found in a Sitch button.
          if (!initialHashLoadHappened) {
            if (hashLabel && (window.location.hash === hashLabel || mergedOptions.preloadHash === hashLabel)) {
              prepareSitch();
              if (window.location.hash === hashLabel) {
                doNotNavigateBackOnClose = true;
                showSitch();
              }
              initialHashLoadHappened = true;
            }
          }
        });
      };
      startLoading(); // Start loading for the initial load of the prepped Sitch app.
      _sitch_initializeButtons();
    };

    if (document.readyState !== 'loading') {
      initSitchWidget();
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        initSitchWidget();
      });
    }
  }
};
