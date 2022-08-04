import axios from "axios";
import qs from "qs";

export function addCost(data) {
    const { cash, name, remark } = data;
    var formData = qs.stringify({ cash, name, remark });
    var config = {
        method: 'post',
        url: 'http://localhost:3000/api/costs/',
        headers: {},
        data: formData,
    };
    return axios(config);
}

    // .then(function (response) {
    //     console.log(JSON.stringify(response.data));
    // })
    // .catch(function (error) {
    //     console.log(error);
    // });
