// @ts-ignore
import {Effect,Reducer,Subscription} from 'umi'
import {getRemoteList,EditHandle,DeleteHandle,AddHandle} from './services'
import {message} from 'antd'
import {SingleUserType} from './data'


export interface UserState {
  data:SingleUserType[],
  meta:{
    "total": number,
    "per_page": number,
    "page": number
  }
}


export interface UsersModelType {
  namespace:'users',
  state:UserState,
  reducers:{
    getList:Reducer<UserState>
  },
  effects:{
    getRomote:Effect,
    edit:Effect,
    delete:Effect,
    add:Effect
 },
  subscriptions:{
    setup:Subscription
  }
}
// @ts-ignore
const userModel:UsersModelType = {
  namespace:'users',
  state:{
    data:[],
    meta:{
      "total": 0,
      "per_page": 20,
      "page": 1
    }
  },
  reducers:{
    getList(state,action){
      return action.payload
    }
  },
  effects:{
    // 参数：action,effects   action-> type、payload   effects-> put,call,select
    *getRomote({payload:{page,per_page}},{put,call,select}){
      const data = yield call(getRemoteList,{page,per_page});
      // console.log(data);
      if (data){
        yield put({
          type:'getList',
          payload:data
        })
        // message.success("获取数据成功")
      }
    },
    *edit({ payload:{id,values}},{put,call,select}){
      const data = yield call(EditHandle,{id,values});
      if (data){
        const {page,per_page} = yield select((state)=>{return state.users.meta})
        yield put({
          type: 'getRomote',
          payload: {
            page,
            per_page
          }
        })
        message.success("修改成功")
      }else {
        message.error("修改失败")
      }
    },

    *delete({ payload:{id}},{put,call,select}){
      const data = yield call(DeleteHandle,{id});
      if (data){
        const {page,per_page} = yield select((state)=>{return state.users.meta})
        // console.log(page,per_page);
        yield put({
          type:'getRomote',
          payload:{
            page,
            per_page
          }
        })
        message.success("删除成功")
      }else {
        message.error("删除失败")
      }
    },

    *add({ payload:{values}},{put,call,select}){
      const data = yield call(AddHandle,{values})
      if(data){
        const {page,per_page} = yield select((state)=>{return state.users.meta})
        // console.log(page,per_page);
        yield put({
          type:'getRomote',
          payload:{
            page,
            per_page
          }
        })
        message.success("添加成功")
      }else{
        message.error("添加失败")
      }

    }
  },
  subscriptions:{
    // @ts-ignore
    setup({ dispatch, history}) {
      // @ts-ignore
      history.listen(({ pathname }) => {
        if (pathname === '/users') {
          dispatch({
            type: 'getRomote',
            payload:{
              page:1,
              per_page:5
            }
          });
        }
      });
    },
  }

}
export default userModel;
