import { ISettings } from '@interfaces/setting';
import {
  Elements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FloatButton } from 'antd';
import {
  MessageOutlined,
  PlayCircleOutlined,
  ThunderboltOutlined,
  WalletOutlined
} from '@ant-design/icons';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import style from './primary-layout.module.scss';

const Header = dynamic(() => import('@components/common/header/header'), { ssr: false });
const ConfirmSubscriptionPerformerForm = dynamic(() => import('@components/performer/common/confirm-subscription'), { ssr: false });

interface DefaultProps {
  children: any;
}

function HomeLayout({
  children
}: DefaultProps) {
  const { stripePublishableKey, paymentGateway }: ISettings = useSelector((state: any) => state.settings);
  const currentUser = useSelector((state: any) => state.user.current);
  const quickSwitches = currentUser?._id ? (
    currentUser?.isPerformer ? [
      { href: '/creator/my-post/create', tooltip: 'Drop a post', icon: <ThunderboltOutlined /> },
      { href: '/creator/live', tooltip: 'Go live', icon: <PlayCircleOutlined /> },
      { href: '/creator/earning', tooltip: 'Earnings', icon: <WalletOutlined /> }
    ] : [
      { href: '/creator', tooltip: 'Discover', icon: <ThunderboltOutlined /> },
      { href: '/messages', tooltip: 'Messages', icon: <MessageOutlined /> },
      { href: '/wallet', tooltip: 'Wallet', icon: <WalletOutlined /> }
    ]
  ) : [];

  const MainLayout = (
    <div id="primaryLayout" className="main-layout">
      <Header />
      <div className="main-content">
        {children}
      </div>
      <ConfirmSubscriptionPerformerForm />
      {quickSwitches.length > 0 && (
        <FloatButton.Group
          trigger="click"
          className={style.quickSwitch}
          icon={<ThunderboltOutlined />}
        >
          {quickSwitches.map((item) => (
            <FloatButton
              key={item.href}
              href={item.href}
              tooltip={item.tooltip}
              icon={item.icon}
            />
          ))}
        </FloatButton.Group>
      )}
      <FloatButton.BackTop className={style.backTop} />
    </div>
  );

  if (paymentGateway === 'stripe' && stripePublishableKey) {
    const stripe = loadStripe(stripePublishableKey);
    return (
      <Elements stripe={stripe}>
        {MainLayout}
      </Elements>
    );
  }

  return MainLayout;
}

export default HomeLayout;
