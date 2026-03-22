import { utilsService } from '@services/utils.service';
import { useEffect, useRef, useState } from 'react';

const useBobyInfo = () => {
  const bodyInfoRef = useRef(null);
  const [state, setState] = useState([]);

  const loadBodyInfo = async () => {
    const res = await utilsService.bodyInfo();
    bodyInfoRef.current = res;
    setState(res);
  };

  useEffect(() => {
    loadBodyInfo();
  }, []);

  return bodyInfoRef.current || state;
};

export default useBobyInfo;
