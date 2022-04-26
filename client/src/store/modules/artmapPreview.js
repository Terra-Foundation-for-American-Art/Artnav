import OpenSeadragon from 'openseadragon'
import { axiosInstance } from '@/api/endpoints'

const state = () => ({
    viewer: null,
    canvas: null,
    canvas_mask: null,
    osd: {
        defaultZoomLevel: 0,
        minZoomLevel: 0,
        maxZoomLevel: 10,
    },
    local_data: {
        art: null,
        artist: null,
        points: null,
        current_point: null,
        collections: window.collections,
        iiif_item: null
    },
    toggles: {
        info_tray: false,
        main_menu: false
    },
    loaded: false
})

const mutations = {
    initCanvas(state, payload) {
        var nonCachedArtImg = `${window.art_image}?d=${Date.now()}`
        state.viewer = OpenSeadragon({
            id: 'artmappreviewcanvas',
            visibilityRatio: 1.0,
            constrainDuringPan: true,
            defaultZoomLevel: state.osd.defaultZoomLevel,
            minZoomLevel: state.osd.minZoomLevel,
            maxZoomLevel: state.osd.maxZoomLevel,
            homeFillsViewer: false,
            preserveImageSizeOnResize: false,
            animationTime: 1.6,
            zoomInButton: 'zoom-in',
            zoomOutButton: 'zoom-out',
            gestureSettingsMouse: {
                scrollToZoom: true
            },
            homeButton: 'reset',
            showNavigator: true,
            navigatorId: 'artmap-viewfinder',
            springStiffness: 6,
            minPixelRatio: 0.2,
            showNavigationControl: false,
            tileSources: state.local_data.iiif_item,
            crossOriginPolicy: "Anonymous",
            overlays: state.local_data.points
        })
        state.canvas = $('#artmappreviewcanvas').find('canvas')
        var newEl = document.createElement('canvas')
        newEl.id = 'canvas-mask'

        newEl.width = window.innerWidth
        newEl.height = window.innerHeight

        var ref = state.canvas[0]
        ref.parentNode.insertBefore(newEl, ref.nextSibling)
        state.canvas_mask = $('#artmappreviewcanvas').find('#canvas-mask')

    },
    setArtData(state, payload) {
        state.local_data.art = payload
    },
    setArtistData(state, payload) {
        state.local_data.artist = payload
    },
    setPointData(state, payload) {
        state.local_data.points = payload
    },
    setIIIF(state, payload) {
        state.local_data.iiif_item = payload
    },
    convertAndSetPoints(state) {
        if (state.local_data.points.length > 0) {
            state.local_data.points.forEach((point) => {
                point['x'] = Number(point.point_x)
                point['id'] = String(point.id)
                point['y'] = Number(point.point_y)
                point['placement'] = 'CENTER'
                point['checkResize'] = false
            })
        }
    },
    artmapHasLoaded(state, vm) {
        state.loaded = true
        vm.emitter.emit('artmapHasLoaded')
    },
    setCurrentPoint(state, payload) {
        state.local_data.current_point = payload
    },
    setInfoTrayClose(state) {
        state.toggles.info_tray = false
        state.local_data.current_point = null
    },
    setInfoTrayOpen(state) {
        state.toggles.info_tray = true
    },
    toggleMainMenu(state) {
        state.toggles.main_menu = !state.toggles.main_menu
    }
}

const actions = {
    preloadArtCanvas({
        dispatch,
        commit,
        state
    }, vm) {
        var loadCheck = setInterval(function () {
            // Preload is based on first tiled view of artwork being fully loaded and rendered to <canvas>:
            if (state.viewer) {
                var firstLoadItem = state.viewer.world.getItemAt(0)
                if (firstLoadItem) {
                    var firstLoad = firstLoadItem.getFullyLoaded()
                }
                if (firstLoad === true) {
                    commit('artmapHasLoaded', vm)
                    clearInterval(loadCheck)
                }
            }
        }, 500)
    },
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
                console.log(err)
                reject(err)
            })
        })
    },
    getPoints({
        commit
    }) {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`points/?artwork=${window.art_id}`)
                .then(resp => {
                    commit('setPointData', resp.data)
                    commit('convertAndSetPoints')
                    resolve(resp)
                }, err => {
                    console.log(err)
                    reject(err)
                }) 
        })
    },
    getArtData({
        commit,
        dispatch
    }) {
        return new Promise((resolve, reject) => {
            axiosInstance
                .get(`art/${window.art_id}/`)
                .then(resp => {
                    commit('setArtData', resp.data)
                    resolve(resp)
                })
                .catch(err => {
                    console.log(err);
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
                    console.log(err)
                    reject(err)
                })
        })
    }
}

const artmapPreview = {
    namespaced: true,
    state,
    mutations,
    actions
}

export default artmapPreview;