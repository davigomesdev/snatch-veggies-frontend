import event from '@/scripts/systems/event';

import { EventEnum } from '@/core/enums/event.enum';

import { useModal } from '@/providers/modal-provider';
import { useHotbar } from '../common/hotbar';
import { useEffect } from 'react';

import { cn } from '@/scripts/utils/cn.util';
import { initializeSocket } from '@/scripts/services/socket/socket.config';

import Motion from '../common/motion';

import ShopButton from '../buttons/shop-button';
import MoveButton from '../buttons/move-button';
import MouseButton from '../buttons/mouse-button';
import LandsButton from '../buttons/lands-button';
import BuilderButton from '../buttons/builder-button';
import ZoomPlusButton from '../buttons/zoom-plus-button';
import ZoomMinusButton from '../buttons/zoom-minus-button';
import InventoryButton from '../buttons/inventory-button';

import FishHotbar from '../hotbars/fish-hotbar';
import PlantationHotbar from '../hotbars/plantation-hotbar';
import MintStructHotbar from '../hotbars/mint-struct-hotbar';
import PlantSeedsHotbar from '../hotbars/plant-seeds-hotbar';

import FishModal from '../modals/fish-modal';
import StatusCoin from '../partials/status-coin';
import StatusLevel from '../partials/status-level';
import StatusTheft from '../partials/status-theft';
import FriendsButton from '../buttons/friends-button';

const MainHUD: React.FC = () => {
  const { toggleModal, closeModal } = useModal();
  const { isOpen, openHotbar, closeHotbar } = useHotbar();

  useEffect(() => {
    initializeSocket();

    event
      .on(EventEnum.ON_CLICK_BLOCK_SELECT, (block) => {
        const plant = block.getPlant();

        const hotbar = plant ? (
          <PlantationHotbar plant={plant} />
        ) : (
          <PlantSeedsHotbar block={block} />
        );

        openHotbar(hotbar, true);
      })
      .on(EventEnum.ON_CLICK_STRUCT_SELECT, (struct) => {
        openHotbar(<MintStructHotbar struct={struct} />, true);
      })
      .on(EventEnum.ON_CLICK_BOAT_SELECT, () => {
        openHotbar(<FishHotbar />, true);
      })
      .on(EventEnum.FISH, (fish) => {
        toggleModal(
          <FishModal fishInventory={fish} onClose={closeModal} />,
          'FISHING',
          'max-w-[400px]',
        );
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
      <Motion className="fixed left-0 top-0 flex flex-wrap items-center gap-5 p-2 pr-24 transition-all sm:gap-10 md:p-5">
        <StatusLevel />
        <StatusCoin />
        <StatusTheft />
      </Motion>
      <Motion
        className={cn(
          'fixed bottom-0 left-0 flex flex-col items-start gap-2 px-2 pt-2 transition-all md:gap-4 md:px-5 md:pt-5',
          isOpen ? 'pb-24 md:pb-5' : 'pb-5',
        )}
      >
        <FriendsButton />
        <LandsButton />
      </Motion>
      <Motion
        className={cn(
          'fixed right-0 flex h-full flex-col items-end justify-between gap-2 px-2 pt-2 transition-all md:gap-4 md:px-5 md:pt-5',
          isOpen ? 'pb-24 md:pb-5' : 'pb-5',
        )}
      >
        <div className="flex flex-col gap-1 sm:gap-2">
          <ZoomPlusButton />
          <ZoomMinusButton />
        </div>
        <div className="flex flex-col gap-1 sm:gap-2">
          <MouseButton />
          <MoveButton />
          <BuilderButton />
        </div>
        <div className="flex flex-col items-end gap-2 md:gap-4">
          <InventoryButton />
          <ShopButton />
        </div>
      </Motion>
    </>
  );
};

export default MainHUD;
