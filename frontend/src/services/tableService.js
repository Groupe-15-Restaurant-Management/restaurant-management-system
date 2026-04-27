import api from './api'

const tableService = {
  async getTables() {
    const response = await api.get('/tables/')
    return response.data
  },

  async getTable(id) {
    const response = await api.get(`/tables/${id}`)
    return response.data
  },

  async createTable(tableData) {
    const response = await api.post('/tables/', tableData)
    return response.data
  },

  async updateTable(id, tableData) {
    const response = await api.put(`/tables/${id}`, tableData)
    return response.data
  },

  async deleteTable(id) {
    const response = await api.delete(`/tables/${id}`)
    return response.data
  }
}

export default tableService