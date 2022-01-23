import {createAppInEl} from './utilities/createApp'
import routerDashboard from './router_dashboard'
import Dashboard from './components/dashboard/Dashboard.vue'

createAppInEl(Dashboard, null, routerDashboard, "#dashboard");