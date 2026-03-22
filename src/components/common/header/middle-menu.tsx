import { Avatar, Badge } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { connect, ConnectedProps } from 'react-redux';
import {
  HomeIcon, MessageIcon, ModelIcon, PlusIcon
} from 'src/icons';
import {
  messageService
} from 'src/services';
import { Event } from 'src/socket';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import classNames from 'classnames';
import { IUser } from '@interfaces/user';
import style from './middle-menu.module.scss';

const Logo = dynamic(() => import('@components/common/base/logo'), { ssr: false });

const UserMenuDrawer = dynamic(() => import('./user-menu-drawer'));

const mapState = (state: any) => ({
  currentUser: { ...state.user.current }
});

type IProps = {
  currentUser: IUser;
}

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

export function MiddleMenu({ currentUser }: IProps & PropsFromRedux) {
  const router = useRouter();
  const [totalNotReadMessage, setTotalNotReadMessage] = useState(0);
  const [openProfile, setOpenProfile] = useState(false);

  const handleMessage = async (event) => {
    event && setTotalNotReadMessage(event.total);
  };

  const handleCountNotificationMessage = async () => {
    const data = await (await messageService.countTotalNotRead()).data;
    if (data) {
      setTotalNotReadMessage(data.total);
    }
  };

  const handleChangeRoute = () => {
    setOpenProfile(false);
  };

  useEffect(() => {
    router.events.on('routeChangeStart', handleChangeRoute);
    return () => {
      router.events.off('routeChangeStart', handleChangeRoute);
    };
  }, []);

  useEffect(() => {
    currentUser._id && handleCountNotificationMessage();
  }, [currentUser._id]);

  const navItems = currentUser._id ? [
    {
      key: 'home',
      href: '/home',
      label: 'Home',
      active: router.pathname === '/home',
      icon: <HomeIcon />
    },
    currentUser?.isPerformer ? {
      key: 'create',
      href: '/creator/my-post/create',
      label: 'Create',
      active: router.pathname === '/creator/my-post/create',
      icon: <PlusIcon />
    } : {
      key: 'discover',
      href: '/creator',
      label: 'Discover',
      active: router.pathname === '/creator',
      icon: <ModelIcon />
    },
    {
      key: 'messages',
      href: '/messages',
      label: 'Messages',
      active: router.pathname === '/messages',
      icon: (
        <>
          <MessageIcon />
          <Badge
            className={style.bagde}
            count={totalNotReadMessage}
            showZero
          />
        </>
      )
    }
  ] : [];

  return (
    <>
      <Event
        event="nofify_read_messages_in_conversation"
        handler={handleMessage}
      />
      <div className={classNames(style['nav-bar'])}>
        <ul className={style['nav-icons']}>
          {currentUser._id && navItems.map((item) => (
            <li key={item.key} className={classNames({ [style.active]: item.active })}>
              <Link href={item.href}>
                <span className={style['nav-icon']}>{item.icon}</span>
                <span className={style['nav-label']}>{item.label}</span>
              </Link>
            </li>
          ))}
          {!currentUser._id ? (
            <>
              <li key="logo" className={style['logo-nav']}>
                <Logo />
              </li>
              <div className={style['header-right-nologin']}>
                <li key="login" className={['/auth/login'].includes(router.pathname) ? 'active' : ''}>
                  <Link href="/">
                    Log In
                  </Link>
                </li>
                <li key="signup" className={router.pathname === '/auth/register' ? 'active' : ''}>
                  <Link href="/auth/register">
                    Sign Up
                  </Link>
                </li>
              </div>
            </>
          ) : (
            <li
              key="menu-profile"
              aria-hidden
              onClick={() => setOpenProfile(true)}
              className={style['menu-profile']}
            >
              <div className={style['profile-trigger']}>
                <Avatar
                  src={currentUser?.avatar || '/no-avatar.jpg'}
                  srcSet={currentUser?.avatar || '/no-avatar.jpg'}
                />
                <span className={style['nav-label']}>Profile</span>
              </div>
            </li>
          )}
          {openProfile && <UserMenuDrawer openProfile={openProfile} onCloseProfile={() => setOpenProfile(false)} />}
        </ul>
      </div>
    </>
  );
}

export default connector(MiddleMenu);
