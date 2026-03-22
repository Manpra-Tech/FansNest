import { CameraOutlined, LoadingOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import getConfig from 'next/config';
import { useState } from 'react';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

interface IProps {
  onFileReaded?: Function;
}

export function ImageUploadModel({ onFileReaded }: IProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('/no-avatar.jpg');

  const beforeUpload = (file) => {
    if (!file.type.includes('image')) {
      message.error('Please select image file');
      return false;
    }
    const { publicRuntimeConfig: config } = getConfig();
    const isLt5M = file.size / 1024 / 1024 < (config.MAX_SIZE_IMAGE || 20);
    if (!isLt5M) {
      message.error(`Image is too large please provide an image ${config.MAX_SIZE_IMAGE || 20}MB or below`);
      return false;
    }
    getBase64(file, (url) => {
      setImageUrl(url);
    });
    onFileReaded && onFileReaded(file);
    return true;
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <CameraOutlined />}
    </div>
  );
  return (
    <Upload
      customRequest={() => false}
      accept="image/*"
      name="file"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={(file) => beforeUpload(file)}
    >
      <img
        src={imageUrl}
        alt="avatar"
        style={{
          width: '100%', height: '100%', maxWidth: 104, maxHeight: 104
        }}
      />
      {uploadButton}
    </Upload>
  );
}
