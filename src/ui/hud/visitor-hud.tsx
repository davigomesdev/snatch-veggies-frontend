import event from '@/scripts/systems/event';

import { EventEnum } from '@/core/enums/event.enum';

import { useAuth } from '@/hooks/use-auth';
import { useHotbar } from '../common/hotbar';
import { useEffect } from 'react';

import { initializeSocket } from '@/scripts/services/socket/socket.config';

import Motion from '../common/motion';

import MoveButton from '../buttons/move-button';
import MouseButton from '../buttons/mouse-button';
import HouseButton from '../buttons/house-button';
import LandsButton from '../buttons/lands-button';
import ZoomPlusButton from '../buttons/zoom-plus-button';
import ZoomMinusButton from '../buttons/zoom-minus-button';
import InventoryButton from '../buttons/inventory-button';

import PlantationHotbar from '../hotbars/plantation-hotbar';

import TheftHotbar from '../hotbars/theft-hotbar';
import StatusTheft from '../partials/status-theft';

const VisitorHUD: React.FC = () => {
  useAuth();

  const { openHotbar, closeHotbar } = useHotbar();

  useEffect(() => {
    initializeSocket();

    event
      .on(EventEnum.ON_CLICK_BLOCK_SELECT, (block) => {
        const plant = block.getPlant();

        const hotbar = block.scene.isVisitor ? (
          <TheftHotbar plant={plant} />
        ) : (
          <PlantationHotbar plant={plant} />
        );

        openHotbar(hotbar, true);
      })
      .on(EventEnum.DESELECT_ALL, () => {
        closeHotbar();
      });

    return () => {
      closeHotbar();
    };
  }, []);

  return (
    <>
      <Motion className="fixed left-0 top-0 flex items-center gap-5 p-2 transition-all sm:gap-10 md:p-5">
        <StatusTheft />
      </Motion>
      <Motion className="fixed bottom-0 left-0 flex flex-col items-start gap-2 p-2 transition-all md:gap-4 md:p-5">
        <HouseButton />
        <LandsButton />
      </Motion>
      <Motion className="fixed right-0 flex h-full flex-col items-end justify-between gap-2 p-2 transition-all md:gap-4 md:p-5">
        <div className="flex flex-col gap-1 sm:gap-2">
          <ZoomPlusButton />
          <ZoomMinusButton />
        </div>
        <div className="flex flex-col gap-1 sm:gap-2">
          <MouseButton />
          <MoveButton />
        </div>
        <div className="flex flex-col items-end gap-2 md:gap-4">
          <InventoryButton />
        </div>
      </Motion>
    </>
  );
};

export default VisitorHUD;
