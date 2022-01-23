import {createAppInEl} from './utilities/createApp'
import routerArtmap from './router_artmap'
import Artmap from './components/artmap/Artmap.vue'
import {storeArtmap} from './store'

createAppInEl(Artmap, storeArtmap, routerArtmap, "#artmap");