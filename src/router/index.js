import {createRouter, createWebHistory} from 'vue-router';

import Page1 from "../components/Page1.vue";
import Page2 from "../components/Page2.vue";
import {basePath} from "../constants.js";

const routes = [
    {
        path: "/:catchAll(.*)",
        redirect: {name: 'Page1'},
        name: 'Others',
    },
    {
        path: basePath + 'page1',
        name: 'Page1',
        component: Page1,
        meta: {label: 'Home'}
    },
    {
        path: basePath + 'page2',
        name: 'Page2',
        component: Page2,
    },


];
const router = createRouter({
    base: basePath,
    history: createWebHistory(),
    mode: 'history',
    routes,
});


export default router;