let _sitch_reinitializeButtons: null | (() => void) = null;

interface SitchOptions {
  baseZIndex: number;
}

function initialize(options: SitchOptions) {
  const version = 5;
  const globalScope: any = window;
  const initSitchWidget = () => {
    document.documentElement.style.setProperty(
      "--_sitch_max-content-width",
      `100vw`
    );
    document.documentElement.style.setProperty(
      "--_sitch_negative-max-content-width",
      `-100vw`
    );

    // Adding the html
    const sitchEmbedContainer = document.createElement("div");
    sitchEmbedContainer.id = "_sitch_embed";
    sitchEmbedContainer.innerHTML = /*html*/ `
      <div id="_sitch_full-screen-dimmer"></div>                                 
      <div id="_sitch_iframe-container">
        <div id="_sitch_loading-spinner-container">
          <div id="_sitch_loader">Loading...</div>
        </div>
        <iframe id="_sitch_iframe" src=""></iframe>                                      
      </div>        
    `;
    document.body.appendChild(sitchEmbedContainer);

    // Adding the google fonts.
    const docHead = document.head;

    // Adding the styles.
    const styleSheet = document.createElement("style");
    styleSheet.innerText = /*css*/ `
        body._sitch_show {
          height: 100vh !important;
          overflow-y: hidden !important;
          padding-right: 15px;
        }
        #_sitch_full-screen-dimmer {
          position: absolute;
          z-index: ${options.baseZIndex - 1};
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
          z-index: ${options.baseZIndex};
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
          z-index: ${options.baseZIndex + 1};
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

    const container = document.getElementById("_sitch_embed");
    const dimmer = document.getElementById("_sitch_full-screen-dimmer");
    const iframe = document.getElementById(
      "_sitch_iframe"
    ) as HTMLIFrameElement | null;

    if (!container || !dimmer) {
      return;
    }

    const toggleFunction = () => {
      document.body.classList.toggle("_sitch_show");
      container.classList.toggle("_sitch_show");
    };

    const hideFunction = () => {
      document.body.classList.remove("_sitch_show");
      container.classList.remove("_sitch_show");
    };

    const startLoading = () => {
      container.classList.add("_sitch_loading");
    };

    const endLoading = () => {
      container.classList.remove("_sitch_loading");
    };

    let sitchId: string;
    let customId: string;
    let maxWidth: number;

    const setWidth = () => {
      const maxWidthExistAndIsLessThanViewportWidth = Boolean(
        maxWidth &&
          maxWidth <
            (globalScope.innerWidth > 0 ? globalScope.innerWidth : screen.width)
      );
      document.documentElement.style.setProperty(
        "--_sitch_max-content-width",
        `${maxWidthExistAndIsLessThanViewportWidth ? maxWidth + "px" : "100vw"}`
      );
      document.documentElement.style.setProperty(
        "--_sitch_negative-max-content-width",
        `${
          maxWidthExistAndIsLessThanViewportWidth
            ? -1 * maxWidth + "px"
            : "-100vw"
        }`
      );
    };

    dimmer.onclick = toggleFunction;

    const appSize = () => {
      const width =
        globalScope.innerWidth > 0 ? globalScope.innerWidth : screen.width;
      if (maxWidth > width) {
        maxWidth = 0;
      }
    };

    globalScope.addEventListener("resize", appSize);
    globalScope.addEventListener(
      "message",
      (event: MessageEvent) => {
        if (
          !["https://sitch.app", "https://sitch-client-test.web.app/"].includes(
            event.origin
          )
        ) {
          return;
        }
        switch (event.data) {
          case "_sitch_fullscreen":
            document.documentElement.style.setProperty(
              "--_sitch_max-content-width",
              "100vw"
            );
            document.documentElement.style.setProperty(
              "--_sitch_negative-max-content-width",
              "100vw"
            );
            break;
          case "_sitch_shrink":
            setWidth();
            break;
          case "_sitch_close":
            setWidth();
            hideFunction();
            break;
          case "_sitch_loaded":
            endLoading();
            break;
        }
      },
      false
    );
    appSize();

    _sitch_reinitializeButtons = () => {
      const sitchActivationButtons = document.querySelectorAll(
        `.sitch-activation-button`
      );
      sitchActivationButtons.forEach((button: any) => {
        // Replacing the buttons to scrub any listensers.
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        newButton.style.cursor = "pointer";
        const prepareContent = () => {
          sitchId = newButton.dataset.sitchId;
          customId = newButton.dataset.sitchCustomId;
          maxWidth = Number(newButton.dataset.sitchMaxWidth) || 0;
          setWidth();
          if (iframe && (sitchId || customId)) {
            const newUrl = customId
              ? `https://sitch.app/${customId}/?e=true&ew=${maxWidth}&v=${version}`
              : `https://sitch.app/s/${sitchId}/?e=true&ew=${maxWidth}&v=${version}`;
            if (iframe.src !== newUrl) {
              startLoading();
              iframe.src = newUrl;
            }
          } else {
            alert("This button does not have the required Sitch fields.");
          }
        };
        newButton.onclick = toggleFunction;
        newButton.onmouseover = prepareContent;
        newButton.onfocus = prepareContent;
      });
    };
    _sitch_reinitializeButtons();
  };

  if (document.readyState !== "loading") {
    initSitchWidget();
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      initSitchWidget();
    });
  }
}

export default (
  options: SitchOptions = {
    baseZIndex: 999999,
  }
) => {
  if (_sitch_reinitializeButtons) {
    // In this case Sitch has already been initialized and we just have to initialize any new buttons.
    _sitch_reinitializeButtons();
  } else {
    initialize(options);
  }
};
