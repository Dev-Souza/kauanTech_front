const { default: axios } = require("axios");

const kauanTech = axios.create({
    baseURL: 'http://localhost:3000/'
})

export default kauanTech