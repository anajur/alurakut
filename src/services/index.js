import axios from "axios";

const { BASIC_TOKEN } = process.env

export const apiGit = axios.create({
    baseURL: 'https://api.github.com/'
})

export const apiGraphql = axios.create({
    baseURL: 'https://graphql.datocms.com',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': BASIC_TOKEN,
    }
})

export const api = axios.create({
    baseURL: '/api/comunidades',
    headers: {
        'Content-Type': 'application/json'
    }
})

export const apiAlura = axios.create({
    baseURL: 'https://alurakut.vercel.app',
    headers: {
        'Content-Type': 'application/json'
    }
})