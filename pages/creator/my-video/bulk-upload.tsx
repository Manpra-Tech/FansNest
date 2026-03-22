import { UploadOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import VideoUploadList from '@components/file/video-upload-list';
import { videoService } from '@services/video.service';
import {
  Button, Form, message, Upload
} from 'antd';
import getConfig from 'next/config';
import Router from 'next/router';
import {
  useEffect, useReducer, useState
} from 'react';
import { connect } from 'react-redux';
import { IPerformer } from 'src/interfaces';
import { showError } from '@lib/utils';
import { validateMessages } from '@lib/message';
import style from './bulk-upload.module.scss';

interface IProps {
  user: IPerformer;
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
const { Dragger } = Upload;

function BulkUploadVideo({ user }: IProps) {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (!user || !user.verifiedDocument) {
      message.warning('Your ID documents are not verified yet! You could not post any content right now.');
      Router.back();
    }
  }, []);

  const onUploading = (file, resp: any) => {
    // eslint-disable-next-line no-param-reassign
    file.percent = resp.percentage;
    forceUpdate();
  };

  const beforeUpload = (file, listFile) => {
    const { publicRuntimeConfig: config } = getConfig();

    if (file.size / 1024 / 1024 > (config.MAX_SIZE_VIDEO || 2000)) {
      message.error(`${file.name} is over ${config.MAX_SIZE_VIDEO || 2000}MB`);
      return false;
    }

    setFileList([...fileList, ...listFile.filter((f) => f.size / 1024 / 1024 < (config.MAX_SIZE_VIDEO || 2000))]);
    return true;
  };

  const remove = (file) => {
    setFileList(fileList.filter((f) => f.uid !== file.uid));
  };

  const submit = async () => {
    const uploadFiles = fileList.filter((f) => !['uploading', 'done'].includes(f.status));
    if (!uploadFiles.length) {
      message.error('Please select videos');
      return;
    }
    try {
      setUploading(true);
      await uploadFiles.reduce(async (cb, file) => {
        await cb;
        try {
          // eslint-disable-next-line no-await-in-loop
          await videoService.uploadVideo(
            [
              {
                fieldname: 'video',
                file
              }
            ],
            {
              title: file.name,
              price: 0,
              description: '',
              tags: [],
              participantIds: [user._id],
              isSale: false,
              isSchedule: false,
              status: 'inactive'
            },
            (r) => onUploading(file, r)
          );
        } catch (e) {
          message.error(`File ${file.name} error!`);
        }
        return Promise.resolve();
      }, Promise.resolve());

      message.success('Videos have been uploaded!');
      Router.push('/creator/my-video');
    } catch (e) {
      showError(e);
    }
  };

  return (
    <>
      <SeoMetaHead pageTitle="Upload Videos" />
      <div className="main-container">
        <PageHeading title="Upload Videos" icon={<UploadOutlined />} />
        <div className={style['video-form']}>
          <Form
            {...layout}
            onFinish={submit}
            validateMessages={validateMessages}
            scrollToFirstError
          >
            <Form.Item>
              <Dragger
                accept="video/*"
                beforeUpload={beforeUpload}
                multiple
                showUploadList={false}
                disabled={uploading}
                listType="picture"
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">
                  Click here or drag & drop your VIDEO files to this area to upload
                </p>
              </Dragger>
            </Form.Item>
            <VideoUploadList
              files={fileList}
              remove={remove}
            />
            <Form.Item>
              <Button
                className="secondary"
                htmlType="submit"
                loading={uploading}
                disabled={uploading || !fileList.length}
              >
                UPLOAD ALL
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}

BulkUploadVideo.authenticate = true;
BulkUploadVideo.onlyPerformer = true;

const mapStates = (state: any) => ({
  user: state.user.current
});
export default connect(mapStates)(BulkUploadVideo);
