import { createStore } from 'vuex'

// ARTMAPPER:
import point from './modules/point'
import art from './modules/art'
import sidebar from './modules/sidebar'

// ARTMAP:
import artmap from './modules/artmap'
import artmapPreview from './modules/artmapPreview'

export const storeArtmapper = createStore({
  modules: {
    point,
    art,
    sidebar,
    artmapPreview
  }
})

export const storeArtmap = createStore({
  modules: {
    artmap,
    point
  }
})