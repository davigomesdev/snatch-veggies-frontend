import Cookies from 'js-cookie';

import { Navigate, Outlet } from 'react-router-dom';
import { PageUrlEnum } from './core/enums/page-url.enum';

export const Middleware = () => {
  const accessToken = Cookies.get('accessToken');
  const publicRoutes = ['/'];

  const isPublicRoute = (path: string) => {
    return publicRoutes.some((route) => path === route || path.startsWith(`${route}/`));
  };

  const currentPath = window.location.pathname;

  if (isPublicRoute(currentPath)) {
    return <Outlet />;
  }

  if (!accessToken) {
    return <Navigate to={PageUrlEnum.HOME} replace />;
  }

  return <Outlet />;
};
