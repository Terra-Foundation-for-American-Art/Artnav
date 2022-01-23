import {
    createApp
} from 'vue'
import mitt from 'mitt';
import VueClipboard from 'vue3-clipboard'

export const createAppInEl = (options, store, router, selector) => {
    const emitter = mitt();
    const mountEl = document.querySelector(selector);
    const app = createApp(options, {
        ...mountEl.dataset
    });
    app.config.globalProperties.emitter = emitter;
    if (store) {
        app.use(store);
    }
    if (router) {
        app.use(router);
    }
    app.use(VueClipboard, {
        autoSetContainer: true,
        appendToBody: true,
    })
    // additional configurations here
    app.mount(selector);
    return app;
}