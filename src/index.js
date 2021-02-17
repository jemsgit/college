import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/app/app";

//здесь стартует React приложение
ReactDOM.render( React.createElement(App), document.querySelector("#root"));

//если у браузера есть возможность исполнени сервис воркеров, то подключаем sw.js (для работы офлайн и работы Progressive Web App)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => { //после загрузки регистрируем сервис воркер sw.js
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });

        navigator.serviceWorker.ready.then(function() {
            console.log('Service Worker Ready')
            return;
        }).then(function() {
            console.log('sync event registered')
        }).catch(function() {
            // system was unable to register for a sync,
            // this could be an OS-level restriction
            console.log('sync registration failed')
        });
    });
}