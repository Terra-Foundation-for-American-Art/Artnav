// import {
//     eventsNewPoints,
//     eventsSidebar
// } from './../../EventBuses'
import {axiosInstance} from '@/api/endpoints'
import {
    convertImgToDataURLviaCanvas
} from './../../utilities/ImgToB64'


const state = () => ({
    captures: {
        new: null,
        edit: null
    },
    modes: {
        editing: false,
        new: false
    },
    modals: {
        edit: false
    },
    local_data: {
        points: {
            new: {
                point_x: null,
                point_y: null,
                point_title: null,
                point_image: '',
                point_slug: null,
                point_content: null,
                point_lede: null,
                artwork_context: null,
                zoom_value: null,
                scale_value: null
            },
            edit: null,
            all: null,
            delete: null
        }
    },
    validation: {
        messages: {
            id: 'you need to add a point to the artwork by clicking on the image.',
            point_x: 'you need to add a point to the artwork by clicking on the image.',
            point_y: 'you need to add a point to the artwork by clicking on the image.',
            point_title: 'you need to give this point a title.',
            point_slug: 'you need to give this point a title.',
            point_content: 'you need to add a description to this point.',
            artwork_context: 'there is a problem with the current piece of art. Try reloading the page.'
        },
        submission: false,
        messages_alert: {
            show: false,
            message: ''
        },
        editor_alert: {
            show: false,
            message: ''
        },
        progress: false
    }
})

const mutations = {
    setPoints(state, payload) {
        payload.forEach((point) => {
            convertImgToDataURLviaCanvas(point.point_image, (b64Data) => {
                point.point_image = b64Data
            })
        })
        state.local_data.points.all = payload
    },
    setCapturedThumb(state, payload) {
        state.captures.new = payload
        state.local_data.points.new.point_image = String(payload.image.src)
        state.local_data.points.new.scale_value = payload.scale_value
    },
    setEditCandidate(state, payload) {
        state.local_data.points.edit = payload
    },
    setEditCaptureThumb(state, payload) {
        state.captures.edit = payload
        if (payload.image) {
            state.local_data.points.edit.point_image = payload.image.src
        }
        if (payload.size) {
            state.local_data.points.edit.scale_value = payload.size
        }
    },
    setNewPointCoords(state, payload) {
        state.local_data.points.new.point_x = payload.x
        state.local_data.points.new.point_y = payload.y
        state.local_data.points.new.zoom_value = payload.zoom_value
    },
    setEditPointCoords(state, payload) {
        state.local_data.points.edit.point_x = payload.x
        state.local_data.points.edit.point_y = payload.y
        state.local_data.points.edit.zoom_value = payload.zoom_value
    },
    setNewPointContent(state, payload) {
        state.local_data.points.new.artwork_context = payload.artwork
        state.local_data.points.new.point_content = payload.content
        // state.local_data.points.new.point_caption = payload.caption
    },
    setEditingPoint(state, payload) {
        state.modes.editing = payload
    },
    toggleShowNewPoint(state) {
        if (state.modes.new) {
            state.modes.new = false
            this.emitter.emit('cancelAnyNewPoint')
        } else {
            state.modes.new = true
            this.emitter.emit('showAddNewPoint')
        }
    },
    showEditPointModal(state) {
        state.modals.edit = true
        
        $('#editArtPoint').modal('show')
    },
    closeEditPointModal(state) {
        state.modals.edit = false
        
        $('#editArtPoint').modal('show')
    },
    closeNewPoint(state, payload) {
        state.modes.new = false
        state.captures.new = null
        payload.vm.emitter.emit('cancelAnyNewPoint')
    },
    showNewPoint(state, payload) {
        state.modes.new = true
        payload.vm.emitter.emit('showAddNewPoint')
    },
    setPointEditorAlert(state, payload) {
        state.validation.editor_alert = payload
    },
    setValidation(state, payload) {
        state.validation.submission = payload
    },
    resetNewPointData(state) {
        state.local_data.points.new = {
            point_x: null,
            point_y: null,
            point_title: null,
            point_image: '',
            point_slug: null,
            point_content: null,
            point_lede: null,
            artwork_context: null,
            zoom_value: null,
            scale_value: null
        }
    },
    addNewPointToList(state, payload) {
        if (state.local_data.points.all.length) {
            convertImgToDataURLviaCanvas(payload.point_image, (b64Data) => {
                payload.point_image = b64Data
                state.local_data.points.all.push(payload)
            })
        } else {
            convertImgToDataURLviaCanvas(payload.point_image, (b64Data) => {
                payload.point_image = b64Data
                state.local_data.points.all = []
                state.local_data.points.all.push(payload)
            })
        }
    },
    removePointFromList(state, payload) {
        var newPointArray = state.local_data.points.all.filter(point => {
            return point.id !== payload
        })
        state.local_data.points.all = newPointArray
    },
    setPointToBeDeleted(state, payload) {
        state.local_data.points.delete = payload
    },
    callSuccessAlert(state, payload) {
        var alertPayload = {
            show: true,
            message: payload.m
        }
        state.validation.messages_alert = alertPayload
        setTimeout(() => {
            state.validation.messages_alert.show = false
            state.validation.messages_alert.message = ''
        }, payload.hideDelay)
    },
    updatePointOrder(state, payload) {
        state.local_data.points.all = payload
    },
    setSavingMode(state, payload) {
        setTimeout(() => {
            state.validation.progress = payload.show
        }, payload.padding)
    }
}

const actions = {
    getPoints({
        commit
    }, payload) {
        axiosInstance.get(`points/?artwork=${window.art_id}`)
            .then(resp => {
                commit('setPoints', resp.data)
            }, err => {
                console.log(err)
            })
    },
    saveNewPoint({
        commit,
        dispatch,
        state
    }, payload) {
        commit('setSavingMode', {
            show: true,
            padding: 0
        })
        console.log(state.local_data.points.new)
        axiosInstance.post('points/', state.local_data.points.new, {
                headers: {
                    'X-CSRFToken': window.csrf
                }
            })
            .then(resp => {
                
                $('#newArtPoint').modal('hide')
                // empty out rich text editor inside of vue instance
                payload.rt.editor.setContents([])
                commit('addNewPointToList', resp.data)
                payload.emitter.emit('openSidebar')
                dispatch('updateCustomIndexes', {
                    vm: payload,
                    points: state.local_data.points.all
                })
                commit('closeNewPoint', {
                    vm: payload
                })
                commit('resetNewPointData')
                var successPayload = {
                    m: `${resp.data.point_title} was successfully Added.`,
                    hideDelay: 3500
                }
                commit('callSuccessAlert', successPayload)
                commit('setSavingMode', {
                    show: false,
                    padding: 500
                })
            }, err => {
                console.log(err)
                commit('setSavingMode', {
                    show: false,
                    padding: 0
                })
            })
    },
    savePointEdit({
        commit,
        dispatch
    }, payload) {
        commit('setSavingMode', {
            show: true,
            padding: 0
        })
        axiosInstance.put(`points/${payload.pointData.id}/`, payload.pointData, {
                headers: {
                    'X-CSRFToken': window.csrf
                }
            })
            .then(resp => {
                // cleanup view via local methods: payload.vm...
                payload.vm.postSaveCleanup()
                dispatch('getPoints', payload.vm)
                $('#editArtPoint').modal('hide')
                var successPayload = {
                    m: `${resp.data.point_title} was successfully updated.`,
                    hideDelay: 3500
                }
                commit('callSuccessAlert', successPayload)
                commit('setSavingMode', {
                    show: false,
                    padding: 500
                })
            }, err => {
                console.log(err)
                commit('setSavingMode', {
                    show: false,
                    padding: 0
                })
            })
    },
    deletePoint({
        commit,
        state
    }, payload) {
        commit('setSavingMode', {
            show: true,
            padding: 0
        })
        axiosInstance.delete(`points/${state.local_data.points.delete.id}`, {
                headers: {
                    'X-CSRFToken': window.csrf
                }
            })
            .then(resp => {
                commit('removePointFromList', state.local_data.points.delete.id)
                
                $('#deletePoint').modal('hide')
                var successPayload = {
                    m: `${state.local_data.points.delete.point_title} was successfully removed.`,
                    hideDelay: 3500
                }
                commit('callSuccessAlert', successPayload)
                commit('setSavingMode', {
                    show: false,
                    padding: 500
                })
            }, err => {
                console.log(err)
                commit('setSavingMode', {
                    show: false,
                    padding: 0
                })
            })
    },
    updatePointListOrder({
        commit,
        dispatch
    }, payload) {
        commit('updatePointOrder', payload.points)
        dispatch('updateCustomIndexes', payload)
    },
    updateCustomIndexes({
        commit,
        state
    }, payload) {
        commit('setSavingMode', {
            show: true,
            padding: 0
        })
        payload.points.forEach((point, i) => {
            point.custom_order_index = i
            axiosInstance.patch(`points/${point.id}/`, point, {
                    headers: {
                        'X-CSRFToken': window.csrf
                    }
                })
                .then(resp => {
                    commit('setSavingMode', {
                        show: false,
                        padding: 500
                    })
                }, err => {
                    console.log(err)
                    commit('setSavingMode', {
                        show: false,
                        padding: 0
                    })
                })
        })
    }
}

const point = {
    namespaced: true,
    state,
    mutations,
    actions
}

export default point;