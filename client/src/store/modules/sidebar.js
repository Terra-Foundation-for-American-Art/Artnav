const state = () => ({
    open: false
})

const mutations = {
    setSidebarOpen(state) {
        state.open = true
    },
    setSidebarClose(state) {
        state.open = false
    },
    toggleSidebar(state) {
        state.open ? state.open = false : state.open = true
    }
}

const actions = {}

const sidebar = {
    namespaced: true,
    state,
    mutations,
    actions
}

export default sidebar;