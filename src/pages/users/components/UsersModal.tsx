import React,{useEffect,FC} from 'react';
import {Modal,Button,Form,Input,message,DatePicker} from 'antd';
import ex from 'umi/dist';
import moment from 'moment';
import {SingleUserType,FormValues} from '../data'



interface UserModalProps {
  visible:boolean,
  closeHandle:()=>void, //closeHandle是一个函数没有返回值
  record:SingleUserType|undefined,
  onFinish:(values:FormValues)=>void
}

const UserModal:FC<UserModalProps> = (props:any)=>{
  const {visible,closeHandle,record,onFinish,confirmLoading} = props;
  const [form] = Form.useForm();

  useEffect(()=>{
    if (record === undefined){
      form.resetFields()
    }else{
      form.setFieldsValue({
        ...record,
        create_time:moment(record.create_time)
      })
    }

  },[visible])

  const onOk = () => {
    form.submit();
  };

  const onFinishFailed = (errorInfo:any) => {
    // console.log(errorInfo);
    message.error(errorInfo.errorFields[0].errors[0])
  };
  // @ts-ignore
  return(
    <>
      <Modal
        title={"显示内容"}
        visible={visible}
        onOk={onOk}
        onCancel={closeHandle}
        forceRender
        confirmLoading={confirmLoading}

      >
        <Form
          name="basic"
          // initialValues={record}
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="create_time"
            label="Create_time"
          >
            {/*<Input />*/}
            <DatePicker showTime />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default UserModal;
