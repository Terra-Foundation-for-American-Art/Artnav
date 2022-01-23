import {
    createRouter,
    createWebHashHistory
} from 'vue-router'
import Artmap from './../components/artmap/Artmap.vue'

const routes = [
    {
        path: '/:pointSlug',
        name: 'point',
        component: Artmap
    },
    {
        path: '/',
        name: 'base',
        component: Artmap
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router