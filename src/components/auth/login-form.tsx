import { login } from '@redux/auth/actions';
import {
  Button, Divider, Form, Input
} from 'antd';
import Link from 'next/link';
import { connect, ConnectedProps } from 'react-redux';

import style from './login-form.module.scss';

const mapStatesToProps = (state: any) => ({
  loginAuth: { ...state.auth.loginAuth },
  siteName: state.ui.siteName
});

const mapDispatchToProps = {
  handleLogin: login
};

const connector = connect(mapStatesToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

// TODO - refactor me

function LoginForm({
  loginAuth,
  siteName,
  handleLogin
}: PropsFromRedux) {
  const demoAccounts = [
    {
      label: 'Fan demo',
      username: 'user',
      password: 'useruser'
    },
    {
      label: 'Creator demo',
      username: 'creator1',
      password: 'creatorcreator'
    }
  ];

  return (
    <div className={style['login-form']}>
      <div className={style['demo-box']}>
        <div className={style['demo-title']}>Quick demo access</div>
        <div className={style['demo-grid']}>
          {demoAccounts.map((account) => (
            <div className={style['demo-item']} key={account.label}>
              <strong>{account.label}</strong>
              <span>{account.username}</span>
              <span>{account.password}</span>
            </div>
          ))}
        </div>
        <small>Management console uses `admin / adminadmin` on `http://localhost:4611/auth/login`.</small>
      </div>
      <Form
        name="normal_login"
        initialValues={{ remember: true }}
        onFinish={handleLogin}
      >
        <Form.Item
          name="username"
          validateTrigger={['onChange', 'onBlur']}
          rules={[{ required: true, message: 'Email/Username is missing' }]}
        >
          <Input className={style['login-input']} disabled={loginAuth.requesting} placeholder="Email or Username" />
        </Form.Item>
        <Form.Item
          name="password"
          validateTrigger={['onChange', 'onBlur']}
          rules={[{ required: true, message: 'Please enter your password!' }]}
        >
          <Input.Password className={style['login-input']} disabled={loginAuth.requesting} placeholder="Password" />
        </Form.Item>
        <p style={{ padding: '0 20px' }}>
          <Link
            href={{
              pathname: '/auth/forgot-password'
            }}
            className={style['sub-text']}
          >
            Forgot password?
          </Link>
        </p>
        <Button
          disabled={loginAuth.requesting}
          loading={loginAuth.requesting}
          type="primary"
          htmlType="submit"
          className={style['form-button']}
        >
          LOG IN
        </Button>
      </Form>
      <div className="text-center">
        <p style={{ fontSize: 11 }}>
          Visit
          {' '}
          <Link href="/page/help">Help Center</Link>
          {' '}
          for any help if you are not able to login with your existing
          {' '}
          {siteName || 'Fanso'}
          {' '}
          account
        </p>
        <Divider style={{ margin: '15px 0' }} />
        <p style={{ marginBottom: 5 }}>Don&apos;t have an account yet?</p>
        <p>
          <Link href="/auth/register">
            {`Sign up for ${siteName}`}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default connector(LoginForm);
