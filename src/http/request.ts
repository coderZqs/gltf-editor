import axios, { AxiosRequestConfig } from "axios";
import { message } from "ant-design-vue";

const service = axios.create({
  baseURL: "/life_photo",
  timeout: 5000,
  withCredentials: true,
});

// Request interceptors
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

/**
 * 请求
 * @param params 参数
 */
export function request(config: AxiosRequestConfig): Promise<any> {
  const args = Object.assign({}, config);
  return new Promise(function (resolve, reject) {
    service
      .request(config)
      .then((res) => {
        const {
          status,
          statusText,
          data: { code, msg, data, success },
        } = res;

        if (status === 200) {
          if (success) {
            return resolve(data);
          } else {
            console.log(code, msg);
            message.error('msg || "网络异常"');
            return reject(new Error(msg || "服务器端错误"));
          }
        }
      })
      .catch((err) => {
        if (!err.response) {
          return reject(new Error("网络错误:" + err.message));
        }

        const {
          status,
          statusText,
          data: { code, msg, data, success },
        } = err.response;
        if (status === 401) {
        } else if (status === 403) {
          message.error({
            content: msg || "没有授权",
            type: "error",
            duration: 5 * 1000,
          });
          return reject(msg);
        } else if (status === 500) {
          message.error({
            content: msg || "网络异常, 请稍后再试",
            type: "error",
            duration: 5 * 1000,
          });
          return reject(msg);
        } else if (status === 502) {
          message.error({
            content: "服务器故障, 请稍后再试",
            type: "error",
            duration: 5 * 1000,
          });
          return reject("服务器故障, 请稍后再试");
        } else {
          message.error({
            content: statusText || "网络异常",
            type: "error",
            duration: 5 * 1000,
          });
          return reject(new Error(statusText || "网络异常"));
        }
      });
  });
}