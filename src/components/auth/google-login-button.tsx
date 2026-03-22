import { GoogleOutlined } from '@ant-design/icons';
import { loginSocial } from '@redux/auth/actions';
import { authService } from '@services/auth.service';
import { Button, message, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import useGoogleLogin from 'src/hooks/use-google-login';
import useSettings from 'src/hooks/use-settings';

import style from './google-login-button.module.scss';

const { Text } = Typography;

function GoogleLoginButton() {
  const { loading, data: settings } = useSettings(['googleLoginEnabled', 'googleLoginClientId']);

  const dipatch = useDispatch();

  const [clickedOnGoogleLoginButton, setClicked] = useState(false);

  const onGoogleLogin = async (resp: any) => {
    if (!resp?.credential) {
      return;
    }
    const payload = { tokenId: resp.credential, role: 'user' };
    try {
      const response = await authService.loginGoogle(payload);
      dipatch(loginSocial({ token: response.data.token }));
    } catch (e) {
      const error = await e;
      message.error(error?.message || 'Google authentication login fail');
    }
  };

  const { signIn, loaded, renderButtonSignIn } = useGoogleLogin({
    clientId: settings.googleLoginClientId,
    onSuccess: onGoogleLogin,
    onFailure: () => {
      message.error('Google authentication login fail');
    },
    // eslint-disable-next-line no-console
    onScriptLoadFailure: () => { console.log('Google login script loaded error'); }
  });

  const loginWithGoogle = () => {
    setClicked(true);
    signIn();
  };

  useEffect(() => {
    if (clickedOnGoogleLoginButton) {
      renderButtonSignIn();
    }
  }, [clickedOnGoogleLoginButton]);

  if (loading || !settings.googleLoginEnabled || !settings.googleLoginClientId) return null;

  return (
    <>
      <Button disabled={!loaded} onClick={() => loginWithGoogle()} className={`${style['google-button']} ${style['btn-login']}`}>
        <GoogleOutlined />
        {' '}
        LOG IN / SIGN UP WITH GOOGLE
      </Button>
      {clickedOnGoogleLoginButton && (
        <div className={style['btn-google-login-box']}>
          <Text type="secondary">
            If no prompt appears just click the button bellow to start the authentication flow:
          </Text>
          <div id="btnLoginWithGoogle" className={style['btn-google-login']} />
        </div>
      )}
    </>
  );
}

export default GoogleLoginButton;
