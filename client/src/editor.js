import {createAppInEl} from './utilities/createApp'
import routerArtmap from './router_artmap'
import Artmapper from './components/editor/ArtMapper.vue'
import {storeArtmapper} from './store'

createAppInEl(Artmapper, storeArtmapper, routerArtmap, "#editor");