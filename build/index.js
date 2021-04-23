"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSitchButtons = void 0;
var _sitch_reinitializeButtons = null;
var initializeSitchButtons = function (baseZIndex) {
    if (baseZIndex === void 0) { baseZIndex = 999999; }
    if (_sitch_reinitializeButtons) {
        // In this case Sitch has already been initialized and we just have to initialize any new buttons.    
        _sitch_reinitializeButtons();
    }
    else {
        var version_1 = 5;
        var globalScope_1 = window;
        var initSitchWidget_1 = function () {
            document.documentElement.style.setProperty('--_sitch_max-content-width', "100vw");
            document.documentElement.style.setProperty('--_sitch_negative-max-content-width', "-100vw");
            // Adding the html
            var sitchEmbedContainer = document.createElement('div');
            sitchEmbedContainer.id = '_sitch_embed';
            sitchEmbedContainer.innerHTML = /*html*/ "\n        <div id=\"_sitch_full-screen-dimmer\"></div>                                 \n        <div id=\"_sitch_iframe-container\">\n          <div id=\"_sitch_loading-spinner-container\">\n            <div id=\"_sitch_loader\">Loading...</div>\n          </div>\n          <iframe id=\"_sitch_iframe\" src=\"\"></iframe>                                      \n        </div>        \n      ";
            document.body.appendChild(sitchEmbedContainer);
            // Adding the google fonts.
            var docHead = document.head;
            // Adding the styles.
            var styleSheet = document.createElement('style');
            styleSheet.innerText = /*css*/ "\n          body._sitch_show {\n            height: 100vh !important;\n            overflow-y: hidden !important;\n            padding-right: 15px;\n          }\n          #_sitch_full-screen-dimmer {\n            position: absolute;\n            z-index: " + (baseZIndex - 1) + ";\n            width: 100vw;\n            height: 100vh;\n            top: 0;\n            left: 0;\n            background-color: rgba(0, 0, 0, 0.5);\n            display: none;\n          }\n          #_sitch_embed._sitch_show #_sitch_full-screen-dimmer {\n            display: block;\n            position: fixed;\n          }          \n          #_sitch_iframe-container {    \n            background-color: #ededf7;        \n            transition: all 200ms ease-in;                                             \n            z-index: " + baseZIndex + ";\n            position: fixed;\n            top: 0;            \n            right: var(--_sitch_negative-max-content-width);\n            width: var(--_sitch_max-content-width);\n            height: 100%; \n            will-change: right;                       \n          }\n          #_sitch_embed._sitch_show #_sitch_iframe-container {                        \n            right: 0;\n          }     \n          #_sitch_iframe {            \n            height: 100%;\n            width: 100%;                                \n            border: none;                      \n          }    \n          #_sitch_loading-spinner-container {            \n            background-color: rgba(0, 0, 0, 0.5);\n            position: absolute;\n            width: 100%;\n            height: 100%;\n            z-index: " + (baseZIndex + 1) + ";\n            top: 0;\n            left: 0;\n            display: none;\n            justify-conent: center;\n            align-items: center;\n          }    \n          #_sitch_embed._sitch_loading #_sitch_loading-spinner-container {\n            display: flex;            \n          }                        \n          #_sitch_loader,\n          #_sitch_loader:after {\n            border-radius: 50%;\n            width: 10em;\n            height: 10em;\n          }\n          #_sitch_loader {\n            margin: 60px auto;\n            font-size: 10px;\n            position: relative;\n            text-indent: -9999em;\n            border-top: 1.1em solid rgba(255, 255, 255, 0.2);\n            border-right: 1.1em solid rgba(255, 255, 255, 0.2);\n            border-bottom: 1.1em solid rgba(255, 255, 255, 0.2);\n            border-left: 1.1em solid #fff;\n            -webkit-transform: translateZ(0);\n            -ms-transform: translateZ(0);\n            transform: translateZ(0);\n            -webkit-animation: _sitch_load8 1.1s infinite linear;\n            animation: _sitch_load8 1.1s infinite linear;\n          }\n          @-webkit-keyframes _sitch_load8 {\n            0% {\n              -webkit-transform: rotate(0deg);\n              transform: rotate(0deg);\n            }\n            100% {\n              -webkit-transform: rotate(360deg);\n              transform: rotate(360deg);\n            }\n          }\n          @keyframes _sitch_load8 {\n            0% {\n              -webkit-transform: rotate(0deg);\n              transform: rotate(0deg);\n            }\n            100% {\n              -webkit-transform: rotate(360deg);\n              transform: rotate(360deg);\n            }\n          }          \n          ";
            docHead.appendChild(styleSheet);
            var container = document.getElementById('_sitch_embed');
            var dimmer = document.getElementById('_sitch_full-screen-dimmer');
            var iframe = document.getElementById('_sitch_iframe');
            if (!container || !dimmer) {
                return;
            }
            var toggleFunction = function () {
                document.body.classList.toggle('_sitch_show');
                container.classList.toggle('_sitch_show');
            };
            var hideFunction = function () {
                document.body.classList.remove('_sitch_show');
                container.classList.remove('_sitch_show');
            };
            var startLoading = function () {
                container.classList.add('_sitch_loading');
            };
            var endLoading = function () {
                container.classList.remove('_sitch_loading');
            };
            var sitchId;
            var customId;
            var maxWidth;
            var setWidth = function () {
                var maxWidthExistAndIsLessThanViewportWidth = Boolean(maxWidth && maxWidth < (globalScope_1.innerWidth > 0 ? globalScope_1.innerWidth : screen.width));
                document.documentElement.style.setProperty('--_sitch_max-content-width', "" + (maxWidthExistAndIsLessThanViewportWidth ? maxWidth + 'px' : '100vw'));
                document.documentElement.style.setProperty('--_sitch_negative-max-content-width', "" + (maxWidthExistAndIsLessThanViewportWidth ? -1 * maxWidth + 'px' : '-100vw'));
            };
            dimmer.onclick = toggleFunction;
            var appSize = function () {
                var width = globalScope_1.innerWidth > 0 ? globalScope_1.innerWidth : screen.width;
                if (maxWidth > width) {
                    maxWidth = 0;
                }
            };
            globalScope_1.addEventListener('resize', appSize);
            globalScope_1.addEventListener('message', function (event) {
                // Do we trust the sender of this message?  (might be different from what we originally opened, for example).
                if (!['https://sitch.app', 'https://sitch-client-test.web.app/', 'http://localhost:8081'].includes(event.origin)) {
                    return;
                }
                switch (event.data) {
                    case '_sitch_fullscreen':
                        document.documentElement.style.setProperty('--_sitch_max-content-width', '100vw');
                        document.documentElement.style.setProperty('--_sitch_negative-max-content-width', '100vw');
                        return;
                    case '_sitch_shrink':
                        setWidth();
                        return;
                    case '_sitch_close':
                        setWidth();
                        hideFunction();
                        return;
                    case '_sitch_loaded':
                        endLoading();
                        return;
                }
            }, false);
            appSize();
            _sitch_reinitializeButtons = function () {
                var sitchActivationButtons = document.querySelectorAll(".sitch-activation-button");
                sitchActivationButtons.forEach(function (button) {
                    var newButton = button.cloneNode(true);
                    button.parentNode.replaceChild(newButton, button);
                    // Replacing the buttons to scrub any listensers.
                    newButton.style.cursor = 'pointer';
                    var prepareContent = function () {
                        sitchId = newButton.dataset.sitchId;
                        customId = newButton.dataset.sitchCustomId;
                        maxWidth = Number(newButton.dataset.sitchMaxWidth) || 0;
                        setWidth();
                        if (iframe && (sitchId || customId)) {
                            var newUrl = customId ? "https://sitch.app/" + customId + "/?e=true&ew=" + maxWidth + "&v=" + version_1 : "https://sitch.app/s/" + sitchId + "/?e=true&ew=" + maxWidth + "&v=" + version_1;
                            // const newUrl = customId ? `http://localhost:8081/${customId}/?e=true&ew=${maxWidth}&v=${version}` : `http://localhost:8081/s/${sitchId}/?e=true&ew=${maxWidth}&v=${version}`;
                            if (iframe.src !== newUrl) {
                                startLoading();
                                iframe.src = newUrl;
                            }
                        }
                        else {
                            alert('This button does not have the required Sitch fields.');
                        }
                    };
                    newButton.onclick = toggleFunction;
                    newButton.onmouseover = prepareContent;
                    newButton.onfocus = prepareContent;
                });
            };
            _sitch_reinitializeButtons();
        };
        if (document.readyState !== 'loading') {
            initSitchWidget_1();
        }
        else {
            document.addEventListener('DOMContentLoaded', function () {
                initSitchWidget_1();
            });
        }
    }
};
exports.initializeSitchButtons = initializeSitchButtons;
