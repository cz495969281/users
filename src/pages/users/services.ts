import request, { extend } from 'umi-request';
// const url = "http://public-api-v1.aspirantzhang.com";
import {message} from 'antd'
import {FormValues} from './data'

const errorHandler = function(error: { response: { status: any; headers: any; }; data: {
    message: any;
    status: string | number; }; request: any; message: any; }) {
    if (error.response.status > 400) {
      // 请求已发送但服务端返回状态码非 2xx 的响应
      // console.log(error.response.status);
      message.error(error.data.message ? error.data.message : error.data)
    } else {
      // 请求初始化时出错或者没有响应返回的异常
      message.error("network error");
      return undefined
    }

  // throw error; // 如果throw. 错误将继续抛出.

  // 如果return, 则将值作为返回. 'return;' 相当于return undefined, 在处理结果时判断response是否有值即可.
  // return {some: 'data'};
};

const extendRequest = extend({ errorHandler });


export const getRemoteList = async ({page,per_page}:{page:number,per_page:number}) =>{
  // console.log(page,per_page);
 return extendRequest(`/api/users?page=${page}&per_page=${per_page}`	, {
    method: 'get',
  })
    .then(function(response) {
      return response
    })
    .catch(function(error) {
      return false
    });
}


export const EditHandle = async ({id,values}:{id:number,values:FormValues}) =>{
  return extendRequest(`/api/users/${id}`, {
    method: 'put',
    data:values
  })
    .then(function(response) {
      return true
    })
    .catch(function(error) {
      return false
    });
}


// @ts-ignore
export const DeleteHandle = async ({id}:{id:number}) =>{
  return extendRequest(`/api/users/${id}`, {
    method: 'DELETE',
  })
    .then(function(response) {
      return true
    })
    .catch(function(error) {
      return false
    });
}

// @ts-ignore
export const AddHandle = async ({values}) =>{
  return extendRequest(`/api/users`, {
    method: 'POST',
    data:values
  })
    .then(function(response) {
      return true
    })
    .catch(function(error) {
      return false
    });
}
