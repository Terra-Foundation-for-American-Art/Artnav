
import OpenSeadragon from 'openseadragon'
import {axiosInstance} from '@/api/endpoints'
// import {
//   eventsArtCanvas
// } from './../../EventBuses'
import {
  CATALOG_URL
} from './../../api/endpoints'

const state = () => ({
  viewer: null,
  canvas: null,
  container_width: null,
  osd: {
    defaultZoomLevel: 0,
    minZoomLevel: 0,
    maxZoomLevel: 10,
  },
  art_data_revertable: {
    art: null,
    artist: null,
    collections: null
  },
  art_data: {
    art: null,
    artist: null,
    collections: null,
    catalog_item: null,
    iiif_item: null
  },
  loaded: false,
  art_validation: {
    messages_alert: {
      show: false,
      message: ''
    }
  }
})

const mutations = {

  initCanvas(state, payload) {
    // FIX CORS CACHING BUG WITH IMAGE REQUESTS TO S3:
    // var nonCachedArtImg = `${window.art_image}?d=${Date.now()}`

    state.viewer = OpenSeadragon({
      // id: 'artcanvas',
      // visibilityRatio: 1.0,
      // constrainDuringPan: true,
      // defaultZoomLevel: state.osd.defaultZoomLevel,
      // minZoomLevel: state.osd.minZoomLevel,
      // maxZoomLevel: state.osd.maxZoomLevel,
      // preserveImageSizeOnResize: false,
      // animationTime: 1.6,
      // gestureSettingsMouse: {
      //   scrollToZoom: true
      // },
      // homeButton: 'reset',
      // showNavigator: false,
      // springStiffness: 6,
      // minPixelRatio: 0.2,
      // showNavigationControl: false,
      // tileSources: state.art_data.iiif_item,
      // crossOriginPolicy: "Anonymous"
      id: 'artcanvas',
      visibilityRatio: 1.0,
      constrainDuringPan: true,
      defaultZoomLevel: state.osd.defaultZoomLevel,
      minZoomLevel: state.osd.minZoomLevel,
      maxZoomLevel: state.osd.maxZoomLevel,
      homeFillsViewer: false,
      preserveImageSizeOnResize: false,
      animationTime: 1.6,
      // zoomInButton: 'zoom-in',
      // zoomOutButton: 'zoom-out',
      gestureSettingsMouse: {
        scrollToZoom: true
      },
      homeButton: 'reset',
      // showNavigator: true,
      // navigatorId: 'artmap-viewfinder',
      springStiffness: 6,
      minPixelRatio: 0.2,
      showNavigationControl: false,
      tileSources: state.art_data.iiif_item,
      crossOriginPolicy: "Anonymous"
      // overlays: state.local_data.points
    })
    state.canvas = $('#artcanvas').find('canvas')
  },
  setContainerWidth(state) {
    var artcontainer = document.getElementById('art_container')
  },
  setCanvas(state) {
    state.canvas = $('#artcanvas').find('canvas')
  },
  setArtData(state, payload) {
    state.art_data.art = payload
    let artClone = Object.assign({}, state.art_data.art)
    state.art_data_revertable.art = artClone
  },
  setArtDescription(state, payload) {
    console.log(payload)
    state.art_data.art.about = payload
  },
  setArtsArtistId(state, payload) {
    state.art_data.art.artist = payload
  },
  setArtsPublishState(state, payload) {
    state.art_data.art.published = payload
  },
  revert(state) {
    let artClone = Object.assign({}, state.art_data_revertable.art)
    let artistClone = Object.assign({}, state.art_data_revertable.artist)
    state.art_data.art = artClone
    state.art_data.artist = artistClone
  },
  setArtistData(state, payload) {
    state.art_data.artist = payload
    let artistClone = Object.assign({}, state.art_data.artist)
    state.art_data_revertable.artist = artistClone
  },
  setCatalogData(state, payload) {
    state.art_data.catalog_item = payload
  },
  setIIIF(state, payload) {
    state.art_data.iiif_item = payload
  },
  artworkHasLoaded(state, payload) {
    state.loaded = true
    payload.vm.emitter.emit('artworkHasLoaded')
  },
  callDeleteSuccessAlert(state, payload) {
    var alertPayload = {
      show: true,
      message: payload.m
    }
    state.art_validation.messages_alert = alertPayload
    setTimeout(() => {
      state.art_validation.messages_alert.show = false
      state.art_validation.messages_alert.message = ''
      window.location.href = '/'
    }, payload.hideDelay)
  },
  callSuccessAlert(state, payload) {
    var alertPayload = {
      show: true,
      message: payload.m
    }
    state.art_validation.messages_alert = alertPayload
    setTimeout(() => {
      state.art_validation.messages_alert.show = false
      state.art_validation.messages_alert.message = ''
    }, payload.hideDelay)
  }
}

const actions = {
  preloadArtCanvas({
    commit,
    state
  }, payload) {
    var loadCheck = setInterval(function () {
      // Preload is based on first tiled view of artwork being fully loaded and rendered to <canvas>:
      var firstLoadItem = state.viewer.world.getItemAt(0)
      if (firstLoadItem) {
        var firstLoad = firstLoadItem.getFullyLoaded()
      }

      if (firstLoad === true) {
        commit('artworkHasLoaded', payload)
        clearInterval(loadCheck)
      }
    }, 500)
  },
  getIIIFAsset({
    commit,
    state,
    dispatch
  }, payload) {
    axiosInstance.get(`https://dlc.services/iiif-img/3/2/${payload.iiif}/info.json`)
      .then(resp => {
        console.log('returned iiif')
        console.log(resp.data)
        commit('setIIIF', resp.data)
        commit('initCanvas')
        dispatch('preloadArtCanvas', payload)
      }, err => {
        console.log(err)
      })
  },
  getCatalogData({
    commit,
    dispatch
  }, payload) {
    // FAKE API CALL FOR PRE-API DEV:
    // getObject(payload.catalog_id, (resp) => {
    //   commit('setCatalogData', resp)
    //   var payloadTwo = {
    //     vm: payload.vm,
    //     iiif: resp['IIIF-UUID']
    //   }
    //   dispatch('getIIIFAsset', payloadTwo)
    // })
    // var proxy = 'https://cors-anywhere.herokuapp.com'
    // var terra100URL = 'https://terra-100-staging.herokuapp.com/api/v1/artworks/'
    axiosInstance.get(`${CATALOG_URL}${payload.accession_number}/`)
      .then(resp => {
        console.log(resp.data)
        commit('setCatalogData', resp.data)
        var payloadTwo = {
          vm: payload.vm,
          iiif: resp.data.iiif_uuid
        }
        dispatch('getIIIFAsset', payloadTwo)
      }, err => {
        console.log(err)
      })
  },
  getArtData({
    commit,
    dispatch
  }, payload) {
    axiosInstance.get(`art/${window.art_id}/`)
      .then(resp => {
        commit('setArtData', resp.data)
        var payloadTwo = {
          vm: payload,
          artist: resp.data.artist
        }
        dispatch('getArtistData', payloadTwo)
        var payloadThree = {
          vm: payload,
          accession_number: resp.data.accession_number
        }
        dispatch('getCatalogData', payloadThree)
      }, err => {
        console.log(err)
      })
  },
  getArtistData({
    commit
  }, payload) {
    axiosInstance.get(`artists/${payload.artist}/`)
      .then(resp => {
        commit('setArtistData', resp.data)
      }, err => {
        console.log(err)
      })
  },
  deleteArt({
    commit,
    state
  }, payload) {
    axiosInstance.delete(`art/${payload.id}`, {
        headers: {
          'X-CSRFToken': window.csrf
        }
      })
      .then(resp => {
        $('#publishModal').modal('hide')
        $('#deleteArtwork').modal('hide')
        var successPayload = {
          m: `${state.art_data.art.artwork_title} was successfully deleted.`,
          hideDelay: 3500
        }
        commit('callDeleteSuccessAlert', successPayload)
      }, err => {
        console.log(err)
      })
  }
}

const art = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default art;