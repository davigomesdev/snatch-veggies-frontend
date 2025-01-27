import Cookies from 'js-cookie';

import { PageUrlEnum } from '@/core/enums/page-url.enum';

import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const navigate = useNavigate();
  const [hasRefreshToken, setHasRefreshToken] = useState<boolean>(true);

  useEffect(() => {
    const checkRefreshToken = () => {
      const token = Cookies.get('refreshToken');
      setHasRefreshToken(!!token);
    };

    checkRefreshToken();
    const intervalId = setInterval(() => {
      checkRefreshToken();
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!hasRefreshToken) navigate(PageUrlEnum.HOME);
  }, [hasRefreshToken]);

  return {
    hasRefreshToken,
  };
};
