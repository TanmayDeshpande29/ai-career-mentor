import axios from "axios";

const api = axios.create({
    basseURL :"http://localhost:8000",
    header :{
        "Content-Type" : "applicaton/json",
    }
});

export default api;
