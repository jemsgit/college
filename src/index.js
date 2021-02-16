import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/app/app";

ReactDOM.render( React.createElement(App), document.querySelector("#root"));

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });

        navigator.serviceWorker.ready.then(function(registration) {
            subscribe(registration);
            window.addEventListener('online', () => {
                registration.sync.register('hasConnection')
            });
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

function subscribe(sw) {
    sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BCc7N6Qoqse7bvzDyjtEUgesACmMqyckaTUFewgD8sK4DtzJkf56H17v9OF64ludMNZTWAqnd_zaCjImEh8t3CY'
    }).then((res) => {
        console.log(JSON.stringify(res))
    })
}