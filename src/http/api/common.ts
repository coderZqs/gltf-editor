import { request } from "../request";

export function uploadFile(data) {
  return request({
    url: "/common/upload",
    method: "post",
    data,
  });
}
