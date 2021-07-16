import axios from "axios";

export const apiGit = axios.create({
    baseURL: 'https://api.github.com/'
})