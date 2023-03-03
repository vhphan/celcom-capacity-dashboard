import {createRouter, createWebHistory} from 'vue-router';

import Page1 from "@/pages/Page1.vue";
import Page2 from "@/pages/Page2.vue";
import {basePath} from "@/constants.js";
import Page3 from "@/pages/Page3.vue";

const routes = [
    {
        path: "/:catchAll(.*)",
        redirect: {name: 'Page2'},
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

    // {
    //     path: basePath + 'page3',
    //     name: 'Page3',
    //     component: Page3,
    // },


];
const router = createRouter({
    base: basePath,
    history: createWebHistory(),
    mode: 'history',
    routes,
});


export default router;