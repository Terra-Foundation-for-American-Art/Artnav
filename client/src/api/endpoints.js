import axios from 'axios'

let BASE_URL = 'http://127.0.0.1:8000/'
if (process.env.NODE_ENV !== 'development') {
    BASE_URL = 'https://artnav.terraamericanart.org/'
}

export const axiosInstance = axios.create({
    baseURL: `${BASE_URL}api/`
});

