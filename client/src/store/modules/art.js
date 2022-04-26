import OpenSeadragon from 'openseadragon'
import {axiosInstance} from '@/api/endpoints'

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
  initCanvas(state) {
    // FIX CORS CACHING BUG WITH IMAGE REQUESTS TO S3:
    setTimeout(() => {
      state.viewer = OpenSeadragon({
        id: 'artcanvas',
        visibilityRatio: 1.0,
        constrainDuringPan: true,
        defaultZoomLevel: state.osd.defaultZoomLevel,
        minZoomLevel: state.osd.minZoomLevel,
        maxZoomLevel: state.osd.maxZoomLevel,
        homeFillsViewer: false,
        preserveImageSizeOnResize: false,
        animationTime: 1.6,
        gestureSettingsMouse: {
          scrollToZoom: true
        },
        homeButton: 'reset',
        springStiffness: 6,
        minPixelRatio: 0.2,
        showNavigationControl: false,
        tileSources: state.art_data.iiif_item,
        crossOriginPolicy: "Anonymous"
      })
      state.canvas = $('#artcanvas').find('canvas')
    }, 0)
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
  setIIIF(state, payload) {
    state.art_data.iiif_item = payload
  },
  artmapHasLoaded(state, vm) {
    state.loaded = true
    vm.emitter.emit('artmapHasLoaded')
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
  getIIIFAsset({
    commit,
    state,
    dispatch
  }, iiif_uuid) {
    return new Promise((resolve, reject) => {
      axiosInstance.get(`https://dlc.services/iiif-img/3/2/${iiif_uuid}/info.json`)
        .then(resp => {
            commit('setIIIF', resp.data)
            resolve(resp)
        }, err => {
            reject(err)
        })
    })
  },
  getArtData({
    commit,
    dispatch
  }, payload) {
    return new Promise((resolve, reject) => {
      axiosInstance.get(`art/${window.art_id}/`)
          .then(resp => {
              commit('setArtData', resp.data)
              resolve(resp)                    
          }, err => {
              reject(err)
          })
    })
  },
  getArtistData({
    commit
  }, artist) {
    return new Promise((resolve, reject) => {
        axiosInstance.get(`artists/${artist}/`)
          .then(resp => {
              commit('setArtistData', resp.data)
              resolve(resp)
          }, err => {
              reject(err)
          })
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