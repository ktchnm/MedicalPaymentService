import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import App from "./app.vue";
import Top from "./top.vue";
import Detail from "./detail.vue";
import Confirmation from "./confirmation.vue";

// CSSリセット
import "../node_modules/reset.css";

import KeenUI from "keen-ui";
import "keen-ui/dist/keen-ui.css";
Vue.use(KeenUI);

import VueQrcodeReader from "vue-qrcode-reader";
Vue.use(VueQrcodeReader);

import "./style.css";

const router = new VueRouter({
    mode: "history",
    // base: "MedicalPaymentService/hospital-client/dist/",
    routes: [
        { path: "/", component: Top },
        { path: "/detail", name: "detail", component: Detail },
        { path: "/confirmation", name: "confirmation", component: Confirmation }
    ]
});

// アカウントがない場合は管理画面を開く
if (!localStorage.getItem("privateKey")) {
    // TODO:管理画面を開く
    // テスト用に既定値をセット
    localStorage.setItem(
        "hospitalPrivateKey",
        "0x0D274BD5D6DC605137D958AC2DB9C9BD189FF86338150A04C7DB4B3E942FAC0C"
    );
    localStorage.setItem(
        "hospitalPassPhrase",
        "0x5f5278ef122e68c6a0d4e037289317178a0555aad18e5cd1366df39683483b1785bc632ac5c7981a9a98e5660ec35e"
    );
}

// アカウント読み込み TODO:localstorageに保存して大丈夫か
let privateKey = localStorage.getItem("hospitalPrivateKey");
let passPhrase = localStorage.getItem("hospitalPassPhrase");

import Management from "./management.js";
Vue.prototype.$management = new Management(privateKey, passPhrase, true);

new Vue({
    el: "#app",
    router,
    render: h => h(App)
});
