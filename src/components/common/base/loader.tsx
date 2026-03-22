import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { Skeleton } from 'antd';
import style from './loader.module.scss';

const Logo = dynamic(() => import('./logo'), { ssr: false, loading: () => <Skeleton.Button /> });

interface IProps {
  active: boolean;
  customText?: string;
}

function Loader({ customText, active }: IProps) {
  return (
    <div className={classNames(
      style['loading-screen'],
      {
        [style.active]: active
      }
    )}
    >
      <div style={{ textAlign: 'center' }}>
        <Logo />
        {customText && <p className="highlight-color">{customText}</p>}
      </div>
    </div>
  );
}

Loader.defaultProps = {
  customText: ''
};

export default Loader;
