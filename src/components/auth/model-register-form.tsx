import { ImageUploadModel } from '@components/file';
import { showError } from '@lib/utils';
import { authService } from '@services/auth.service';
import {
  Alert, Button, Col, DatePicker, Form, Input, message,
  Row, Select, Steps
} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { COUNTRIES } from 'src/constants/countries';
import dayjs from 'dayjs';

import { IPerformerCategory } from '@interfaces/performer-category';
import classNames from 'classnames';
import style from './model-register-form.module.scss';

const { Option } = Select;

const creatorOnboardingSteps = [
  {
    title: 'Profile',
    description: 'Identity and public creator details'
  },
  {
    title: 'Security',
    description: 'Email and password setup'
  },
  {
    title: 'Verification',
    description: 'Upload ID and holding photo'
  }
];

const mapStatesToProps = (state: any) => ({
  siteName: state.settings.siteName
});

const connector = connect(mapStatesToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface P extends PropsFromRedux {
  categories: IPerformerCategory[]
}

function ModelRegisterForm({
  siteName,
  categories
}: P) {
  const router = useRouter();
  const idFile = useRef(null);
  const documentFile = useRef(null);
  const [loading, setLoading] = useState(false);

  const onFileReaded = (file: File, type: string) => {
    if (file && type === 'idFile') {
      // this.idVerificationFile = file;
      idFile.current = file;
    }
    if (file && type === 'documentFile') {
      // this.documentVerificationFile = file;
      documentFile.current = file;
    }
  };

  const register = async (values: any) => {
    try {
      const data = values;
      if (!idFile.current || !documentFile.current) {
        message.error('ID documents are required!');
        return;
      }
      const verificationFiles = [{
        fieldname: 'idVerification',
        file: idFile.current
      }, {
        fieldname: 'documentVerification',
        file: documentFile.current
      }];
      setLoading(true);
      const resp = await authService.registerPerformer(verificationFiles, data, () => { });
      const { data: respData } = resp as any;

      message.success(
        <div className="text-center">
          <h4>{`Thank you for applying to be a ${siteName || 'Fanso'} creator!`}</h4>
          <p>
            {respData?.message
              || 'Your application will be processed within 24 to 48 hours, most times sooner. You will get an email notification sent to your email address with the status update.'}
          </p>
        </div>,
        15
      );
      router.push({
        pathname: '/auth/login',
        href: '/'
      });
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className={classNames(style['register-box'])}>
        <h1 className={style.title}>Creator Sign Up</h1>
        <p className="text-center">
          <small>Sign up to make money and interact with your fans!</small>
        </p>
        <div className={style['onboarding-intro']}>
          <Alert
            type="info"
            showIcon
            message="Creator onboarding"
            description="Complete your profile, secure your account, and upload your verification photos. Most applications are reviewed within 24 to 48 hours."
          />
          <Steps
            className={style.steps}
            responsive
            size="small"
            items={creatorOnboardingSteps}
          />
        </div>
        <Form
          name="creator_register"
          initialValues={{
            gender: 'female',
            country: 'US',
            dateOfBirth: ''
          }}
          onFinish={register}
          scrollToFirstError
        >
          <Row>
            <Col xs={24} sm={24} md={14} lg={14}>
              <Row>
                <Col span={12}>
                  <div className={style['section-title']}>Profile basics</div>
                  <Form.Item
                    name="firstName"
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      { required: true, message: 'Please input your name!' },
                      {

                        pattern: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
                        message: 'First name can not contain number and special character'
                      }
                    ]}
                  >
                    <Input placeholder="First name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="lastName"
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      { required: true, message: 'Please input your name!' },
                      {

                        pattern: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
                        message: 'Last name can not contain number and special character'
                      }
                    ]}
                  >
                    <Input placeholder="Last name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      { required: true, message: 'Please input your display name!' },
                      {

                        pattern: /^(?=.*\S).+$/g,
                        message: 'Display name can not contain only whitespace'
                      },
                      {
                        min: 3,
                        message: 'Display name must containt at least 3 characters'
                      }
                    ]}
                  >
                    <Input placeholder="Display name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="username"
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      { required: true, message: 'Please input your username!' },
                      {

                        pattern: /^[a-z0-9]+$/g,
                        message: 'Username must contain only lowercase alphanumerics only!'
                      },
                      { min: 3, message: 'username must containt at least 3 characters' }
                    ]}
                  >
                    <Input placeholder="Username" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      {
                        type: 'email',
                        message: 'The input is not valid E-mail!'
                      },
                      {
                        required: true,
                        message: 'Please input your E-mail!'
                      }
                    ]}
                  >
                    <Input className={style['register-input']} placeholder="Email address" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="dateOfBirth"
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      {
                        required: true,
                        message: 'Select your date of birth'
                      }
                    ]}
                  >
                    <DatePicker
                      placeholder="Date of Birth (DD/MM/YYYY)"
                      format="DD/MM/YYYY"
                      disabledDate={(currentDate) => currentDate > dayjs().subtract(18, 'year').startOf('day') && currentDate < dayjs().subtract(100, 'year').startOf('day')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="country" rules={[{ required: true }]}>
                    <Select showSearch optionFilterProp="label">
                      {COUNTRIES.map((c) => (
                        <Option value={c.code} key={c.code} label={c.name}>
                          <img alt="country_flag" src={c.flag} width="25px" />
                          {' '}
                          {c.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="gender"
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[{ required: true, message: 'Please select your gender' }]}
                  >
                    <Select>
                      <Option value="male" key="male">
                        Male
                      </Option>
                      <Option value="female" key="female">
                        Female
                      </Option>
                      <Option value="transgender" key="trans">
                        Trans
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
                {categories.length > 0 && (
                  <Col span={24}>
                    <Form.Item
                      name="categoryIds"
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[{ required: true, message: 'Please select your categories' }]}
                    >
                      <Select showSearch mode="multiple" placeholder="Select your categories">
                        {categories.map((s) => (
                          <Select.Option key={s._id} value={s._id}>
                            {s.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                )}
                <Col span={12}>
                  <div className={style['section-title']}>Security</div>
                  <Form.Item
                    name="password"
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      {

                        pattern: /^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^\w\d]).*$/g,
                        message:
                          'Password must have minimum 8 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character'
                      },
                      { required: true, message: 'Please input your password!' }
                    ]}
                  >
                    <Input.Password placeholder="Password" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="confirm"
                    dependencies={['password']}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter confirm password!'
                      },
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Passwords do not match together!'));
                        }
                      })
                    ]}
                  >
                    <Input.Password placeholder="Confirm password" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={10} lg={10}>
              <div className={style['upload-grp']}>
                <div className={style['section-title']}>Verification documents</div>
                <p className={style['verification-copy']}>
                  Upload a government-issued ID plus a holding photo so the review team can approve your creator account.
                </p>
                <Form.Item
                  labelCol={{ span: 24 }}
                  className={style['model-photo-verification']}
                  help="Your government issued ID card, National ID card, Passport or Driving license"
                >
                  <div className={style['id-block']}>
                    <ImageUploadModel onFileReaded={(f) => onFileReaded(f, 'idFile')} />
                    <img alt="id-img" className={style['img-id']} src="/front-id.png" />
                  </div>
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 24 }}
                  className={style['model-photo-verification']}
                  help="Your selfie with your ID and handwritten note"
                >
                  <div className={style['id-block']}>
                    <ImageUploadModel onFileReaded={(f) => onFileReaded(f, 'documentFile')} />
                    <img alt="holdinh-img" className={style['img-id']} src="/holding-id.jpg" />
                  </div>
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Form.Item style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={loading}
              loading={loading}
              className={style['form-button']}
            >
              CREATE YOUR ACCOUNT
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center">
          <p>
            By signing up you agree to our
            {' '}
            <Link href="/page/terms-of-service" target="_blank">
              Terms of Service
            </Link>
            {' '}
            and
            {' '}
            <Link href="/page/privacy-policy" target="_blank">
              Privacy Policy
            </Link>
            , and confirm that you are at least 18 years old.
          </p>
          <p>
            Have an account already?
            &nbsp;
            <Link href="/auth/login">
              Log in here.
            </Link>
          </p>
          <p>
            Are you a fan?
            &nbsp;
            <Link href="/auth/fan-register">
              Sign up here.
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default connector(ModelRegisterForm);
