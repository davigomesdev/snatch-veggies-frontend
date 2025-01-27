import './scripts/services/ethers/ethers.service';

import { PageUrlEnum } from './core/enums/page-url.enum';

import { Middleware } from './middleware';

import { setupNavigate } from './scripts/utils/navigation.util';

import { useEffect } from 'react';

import { ModalProvider } from './providers/modal-provider';
import { HotbarProvider } from './ui/common/hotbar';

import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';

import Home from './ui/canvas/home';
import Game from './ui/canvas/game';

const AppRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setupNavigate(navigate);
  }, [navigate]);

  return (
    <Routes>
      <Route path={PageUrlEnum.DEFAULT} element={<Home />} />
      <Route path={PageUrlEnum.HOME} element={<Home />} />
      <Route element={<Middleware />}>
        <Route
          path={PageUrlEnum.GAME}
          element={
            <ModalProvider>
              <HotbarProvider>
                <Game />
              </HotbarProvider>
            </ModalProvider>
          }
        />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
