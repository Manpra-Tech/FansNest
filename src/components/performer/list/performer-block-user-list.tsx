import UsersBlockList from '@components/user/users-block-list';
import {
  Button, Form, Input,
  message, Modal
} from 'antd';
import React, { useEffect, useState } from 'react';
import { blockService, userService } from 'src/services';
import { showError } from '@lib/utils';
import { SelectUserDropdown } from '@components/user';
import style from './performer-block-user.module.scss';

function PerformerBlockList() {
  const limit = 10;
  const [loading, setLoading] = useState(false);
  const [submiting, setsubmiting] = useState(false);
  const [offset, setOffset] = useState(0);
  const [userBlockedList, setUserBlockedList] = useState([]);
  const [totalBlockedUsers, setTotalBlockedUsers] = useState(0);
  const [openBlockModal, setOpenBlockModal] = useState(false);
  const [formRef] = Form.useForm();

  const getBlockList = async () => {
    try {
      setLoading(true);
      const resp = await blockService.getBlockListUsers({
        limit,
        offset: offset * limit
      });
      setUserBlockedList(resp.data.data);
      setTotalBlockedUsers(resp.data.total);
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (data) => {
    setOffset(data.current - 1);
  };

  const handleUnblockUser = async (userId: string) => {
    if (!window.confirm('Are you sure to unblock this user?')) return;
    try {
      setsubmiting(true);
      blockService.unBlockUser(userId);
      message.success('Unblocked successfully');
      setUserBlockedList(userBlockedList.filter((u) => u.targetId !== userId));
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'An error occurred. Please try again later');
    } finally {
      setsubmiting(false);
    }
  };

  const handleBlockUser = async (data) => {
    const { reason, targetId } = data;
    try {
      setsubmiting(true);
      await blockService.blockUser({ targetId, target: 'user', reason });
      message.success('User profile is blocked successfully');
      getBlockList();
    } catch (e) {
      const error = await Promise.resolve(e);
      message.error(error?.message || 'An error occurred, please try again later');
    } finally {
      setsubmiting(false);
      setOpenBlockModal(false);
    }
  };

  useEffect(() => {
    getBlockList();
  }, [offset]);

  return (
    <>
      <div className={style['block-user']}>
        <Button className="" type="primary" onClick={() => setOpenBlockModal(true)}>
          Want to block someone, click here!
        </Button>
      </div>
      <div className="users-blocked-list">
        <UsersBlockList
          items={userBlockedList}
          searching={loading}
          total={totalBlockedUsers}
          onPaginationChange={(data) => handleTabChange(data)}
          pageSize={limit}
          submiting={submiting}
          unblockUser={(userId) => handleUnblockUser(userId)}
        />
      </div>
      {openBlockModal && (
      <Modal
        centered
        title="Block user"
        open={openBlockModal}
        onCancel={() => setOpenBlockModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={formRef}
          name="blockForm"
          onFinish={(data) => handleBlockUser(data)}
          initialValues={{ reason: '' }}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          className="account-form"
        >
          <Form.Item name="targetId" label="Please enter the username you want to block">
            <SelectUserDropdown
              onSelect={(id) => formRef.setFieldValue('targetId', id)}
            />
          </Form.Item>
          <Form.Item
            name="reason"
            label="Reason"
            rules={[{ required: true, message: 'Tell us your reason' }]}
          >
            <Input.TextArea
              placeholder="Enter your reason"
            />
          </Form.Item>
          <Form.Item>
            <Button
              className="primary"
              htmlType="submit"
              loading={submiting}
              disabled={submiting}
              style={{ marginRight: '20px' }}
            >
              Submit
            </Button>
            <Button
              className="secondary"
              onClick={() => setOpenBlockModal(false)}
            >
              Close
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      )}
    </>
  );
}

export default PerformerBlockList;
