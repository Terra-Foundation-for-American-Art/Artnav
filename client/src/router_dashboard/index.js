import {
    createRouter,
    createWebHashHistory
} from 'vue-router'
import RecentActivityList from './../components/dashboard/RecentActivityList'
import AllArtworkList from './../components/dashboard/AllArtworkList'
import AllCollectionsList from './../components/dashboard/AllCollectionsList'
import CollectionDetail from './../components/dashboard/CollectionDetail'
import ArtistList from './../components/dashboard/ArtistList'


const routes = [{
        path: '/',
        name: 'recent',
        component: RecentActivityList
    },
    {
        path: '/art',
        name: 'art',
        component: AllArtworkList
    },
    {
        path: '/collections',
        name: 'collections',
        component: AllCollectionsList
    },
    {
        path: '/collections/:collectionId',
        name: 'collection-detail',
        component: CollectionDetail
    },
    {
        path: '/artists',
        name: 'artists',
        component: ArtistList
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router