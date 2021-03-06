import React, { useEffect, useState,FC,useRef,forwardRef} from 'react';
import {Table,Popconfirm,Button,Pagination,message} from 'antd';
import { connect,Dispatch,Loading,UserState } from 'umi';
import {SingleUserType,FormValues} from './data'
import ProTable from '@ant-design/pro-table';
import {getRemoteList,EditHandle,AddHandle} from './services';
import UserModal from './components/UsersModal'
import { OptionsType } from '@ant-design/pro-table/lib/component/toolBar';
import { ProColumns } from '@ant-design/pro-table/lib/Table';

interface UserPorps {
  users:UserState,
  dispatch:Dispatch,
  userListLoading:boolean
}

interface ActionType {
  reload: () => void;
  fetchMore: () => void;
  reset: () => void;
}

const users: FC<UserPorps> = ({users,dispatch,userListLoading}) => {
  const [modalVisible,setModalVisible] = useState(false);
  const [record,setRecord] = useState<SingleUserType|undefined>(undefined);
  const [confirmLoading,setConfirmLoading] = useState(false)
  // const ref = useRef<ActionType>();

  const columns:ProColumns<SingleUserType>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType:'digit',
      key: 'id'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      valueType:'text',
      key: 'name',
      render: (text:any) =>[<a key="name">{text}</a>]
    },
    {
      title: 'Create_time',
      dataIndex: 'create_time',
      valueType:'dateTime',
      key: 'create_time',
    },
    {
      title: 'Action',
      key: 'action',
      valueType:'option',
      render: (text: any, record: SingleUserType) => (
        <span>
          <a key="edit" onClick={()=>{editHandle(record)}}>
            编辑
          </a>&nbsp;&nbsp;&nbsp;&nbsp;
          <Popconfirm
            title={"确定要删除吗"}
            onConfirm={()=>{confirm(record.id)}}
            // onCancel={cancel}
            okText="yes"
            cancelText="no"
          >
            <a key="delete">删除</a>
          </Popconfirm>
        </span>
      )
    },
  ];
  const confirm = (id:number)=>{
    // const id = record.id
    console.log(id);
    dispatch({
      type:'users/delete',
      payload:{
        id
      }
    })
  }

  const editHandle = (record: SingleUserType) => {
    // console.log(record);
    setModalVisible(true)
    setRecord(record)
  }

  const closeHandle = () => {
    setModalVisible(false)
  }

  const onFinish = async (values: FormValues) => {
    // console.log('Success:', values);
    setConfirmLoading(true)

    let id = 0;

    if (record){
      id = record.id
    }

    let servicesFun;
    if (id){
      servicesFun = EditHandle
    }else {
      servicesFun = AddHandle
    }

    const result = await servicesFun({id,values});
    console.log(id,values);
    if(result){
      setModalVisible(false);
      onReset()
      setConfirmLoading(false)
      message.success(`${id===0 ? 'Add' : 'Edit'} Success` )

    }else{
      setConfirmLoading(false)
      message.error(`${id===0 ? 'Add' : 'Edit'} failed` )
    }


  };
  const onclick = ()=>{
    setModalVisible(true)
    setRecord(undefined)
  }
  const requestHandle = async ({pageSize,current}:{pageSize:number,current:number})=>{
    // console.log(current,pageSize);
    const users = await getRemoteList({
      page:current,
      per_page:pageSize
    })
    return {
      data:users.data,
      success:true,
      total:users.meta.total
    }
  }
  // @ts-ignore

  //这个方法是基于 ProTable组件中的request方法来做的
  const onreload = ()=>{
    // ref.current.reload();
  }

  const paginationHandle = (page:number, pageSize?:number)=>{
    console.log(page,pageSize);
    dispatch({
      type:"users/getRomote",
      payload:{
        page:page,
        per_page:pageSize
      }
    })
  }
  const onShowSizeChange = (current:number,size:number)=>{
    console.log(current,size);
    dispatch({
      type:"users/getRomote",
      payload:{
        page:current,
        per_page:size
      }
    })
  }

  const onReset = ()=>{
    dispatch({
      type:"users/getRomote",
      payload:{
        page:users.meta.page,
        per_page:users.meta.per_page
      }
    })
  }
  return(
    <div className="list-table">
      <ProTable
        columns={columns}
        // request={requestHandle}
        dataSource={users.data}
        // actionRef={ref}
        search={false}
        rowKey="id"
        loading={userListLoading}
        pagination={false}
        options={{
          density: true,
          fullScreen: true,
          reload: (()=>{
            onReset()
          }),
          setting:true
        }}
        headerTitle="User List"
        toolBarRender={()=>[
          <Button key="add" type="primary" onClick={onclick}>添加</Button>,
          <Button key="reload" onClick={onReset}>reload</Button>
        ]}
      />

      {/*分页*/}
        <Pagination
          className="list-page"
          total={users.meta.total}
          onChange={paginationHandle}
          onShowSizeChange={onShowSizeChange}
          current={users.meta.page}
          pageSize={users.meta.per_page}
          showSizeChanger
          showQuickJumper
          showTotal={total => `Total ${total} items`}
        />

      <UserModal
        visible={modalVisible}
        closeHandle={closeHandle}
        record={record}
        onFinish={onFinish}
        confirmLoading={confirmLoading}

      />
    </div>
  )
}


/*
* state是一个对象，
*   第一个参数为model.ts文件中的 namespace
* */
// @ts-ignore
const mapStateToprops = ({users,loading}:{user:UserState,loading:Loading})=> {
  return {
    users,
    userListLoading:loading.models.users
  }
}


export default connect(mapStateToprops)(users);
