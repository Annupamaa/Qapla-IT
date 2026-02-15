import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/* ADD — JWT TOKEN AUTO ATTACH */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)
//  END ADD 


// Vendors API
export const vendorsAPI = {
  getAll: () => api.get('/vendors'),
  getById: (id) => api.get(`/vendors/${id}`),
  create: (data) => api.post('/vendors', data),
  update: (id, data) => api.put(`/vendors/${id}`, data),
  delete: (id) => api.delete(`/vendors/${id}`),
}

// Vendor Users API
export const vendorUsersAPI = {
  getAll: (vendorId) => {
    const params = vendorId ? { vendor_id: vendorId } : {}
    return api.get('/vendor-users', { params })
  },
  getById: (id) => api.get(`/vendor-users/${id}`),
  create: (data) => api.post('/vendor-users', data),
  update: (id, data) => api.put(`/vendor-users/${id}`, data),
  delete: (id) => api.delete(`/vendor-users/${id}`),
}

// Societies API
export const societiesAPI = {
  getAll: () => api.get('/societies'),
  getById: (id) => api.get(`/societies/${id}`),
  create: (data) => api.post('/societies', data),
  update: (id, data) => api.put(`/societies/${id}`, data),
  delete: (id) => api.delete(`/societies/${id}`),
}

// Society Users API
export const societyUsersAPI = {
  getAll: (societyId) => {
    const params = societyId ? { society_id: societyId } : {}
    return api.get('/society-users', { params })
  },
  getById: (id) => api.get(`/society-users/${id}`),
  create: (data) => api.post('/society-users', data),
  update: (id, data) => api.put(`/society-users/${id}`, data),
  delete: (id) => api.delete(`/society-users/${id}`),
}

export default api
