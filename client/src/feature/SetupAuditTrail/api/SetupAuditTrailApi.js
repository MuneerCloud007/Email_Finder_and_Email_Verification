// Axios({
//     url: "/api/auth/requirement",
//     method: "post",
//     data: {
//         instance_url: `${localStorage.getItem("instance_url")}`,
//         access_token: `${JSON.parse(localStorage.getItem("user")).token}`

//     }

import Axios from "axios";


export const Api1 = (url, method) => {
    return new Promise(async (resolve, reject) => {
        try {



            const api1 = await Axios({

                url: url,
                method: method,
                data: {
                    instance_url: `${localStorage.getItem("instance_url")}`,
                    access_token: `${JSON.parse(localStorage.getItem("user")).token}`

                }

            })


            if (api1.status == 200) {
                return resolve(api1);
            }
            throw new Error(api1);



        }

        catch (e) {
            if (e?.response?.data?.message == "Request failed with status code 401") {
                localStorage.clear();
            }
            return reject(e);
        }
    })

}

export const Api2 = (url, method) => {
    return new Promise(async (resolve, reject) => {
        try {



            const api2 = await Axios({

                url: url,
                method: method,


            })


            if (api2.status == 200) {
                return resolve(api2);
            }
            throw new Error(api2);



        }

        catch (e) {
            if (e?.response?.data?.message == "Request failed with status code 401") {
                localStorage.clear();

            }
            console.log(e);
            return reject(e);
        }
    })
}