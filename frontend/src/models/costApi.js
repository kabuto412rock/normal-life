import axios from "axios";
import qs from "qs";
import { integerCheckFormater } from "../utils/checker";

// 新增一筆日常花費API
export function addCost({ cash, name, remark }) {
    const formData = qs.stringify({ cash, name, remark });
    const config = {
        method: 'post',
        url: 'http://localhost:3000/api/costs/',
        headers: {},
        data: formData,
    };
    return axios(config);
}
// 取得所有日常花費API
export function getCosts({ limit, offset }) {
    limit = integerCheckFormater(limit, 1, undefined);
    offset = integerCheckFormater(offset, 0, undefined);

    const config = {
        method: 'get',
        url: `http://localhost:3000/api/costs/?limit=${limit}&offset=${offset}`,
        headers: {}
    };
    return axios(config);

}

// 刪除一筆日常花費API
export function deleteCost(id) {
    id = integerCheckFormater(id, 0, undefined);
    var config = {
        method: 'delete',
        url: `http://localhost:3000/api/costs/${id}`,
        headers: {}
    };
    return axios(config)
}
    // .then(function (response) {
    //     console.log(JSON.stringify(response.data));
    // })
    // .catch(function (error) {
    //     console.log(error);
    // });
