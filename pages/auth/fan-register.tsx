import dynamic from 'next/dynamic';
import SeoMetaHead from '@components/common/seo-meta-head';
import { NextPageContext } from 'next/types';
import { settingService } from '@services/setting.service';

const FanRegisterForm = dynamic(() => import('@components/auth/fan-register-form'));

type P = {
  loginPlaceholderImage: string;
}

function FanRegister({ loginPlaceholderImage }: P) {
  return (
    <>
      <SeoMetaHead pageTitle="Fans Sign Up" />
      <FanRegisterForm loginPlaceholderImage={loginPlaceholderImage} />
    </>
  );
}

FanRegister.authenticate = false;
FanRegister.layout = 'public';

export const getServerSideProps = async (ctx: NextPageContext) => {
  const meta = await settingService.valueByKeys([
    'loginPlaceholderImage'
  ]);

  return {
    props: {
      loginPlaceholderImage: meta?.loginPlaceholderImage || ''
    }
  };
};

export default FanRegister;
