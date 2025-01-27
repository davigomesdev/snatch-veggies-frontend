import Phaser from 'phaser';

import { GameModeEnum } from '@/core/enums/game-mode.enum';

import { ILand } from '@/core/interfaces/land.interface';
import { TBlockSetter } from '@/core/types/block-setter';

import { Boat } from './boat';
import { World } from './world';
import { Hotbar } from '../systems/hotbar';

import { Mouse } from '../systems/mouse';
import { Camera } from '../systems/camera';
import event from '../systems/event';
import { EventEnum } from '@/core/enums/event.enum';

export class VoxelScene extends Phaser.Scene {
  public map!: TBlockSetter[][];

  public land!: ILand;
  public visitorland!: ILand;

  public mouse!: Mouse;
  public camera!: Camera;

  public boat!: Boat;
  public world!: World;
  public hotbar!: Hotbar;

  private w: number = 0;
  private h: number = 0;

  private cx: number = 0;
  private cy: number = 0;

  public isVisitor: boolean = false;
  public mouseOverHTMLElement: boolean = false;

  public gameMode: GameModeEnum = GameModeEnum.MOUSE;

  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super(config);
    this.setupMouseListeners();
  }

  public create(): void {
    this.w = this.cameras.main.displayWidth;
    this.h = this.cameras.main.displayHeight;

    this.cx = this.cameras.main.centerX;
    this.cy = this.cameras.main.centerY;

    this.mouse = new Mouse(this);
    this.camera = new Camera(this);

    this.hotbar = new Hotbar(this);
    this.world = new World(this);
    this.boat = new Boat(this);
  }

  public get W(): number {
    return this.w;
  }

  public get H(): number {
    return this.h;
  }

  public get CX(): number {
    return this.cx;
  }

  public get CY(): number {
    return this.cy;
  }

  public fade(fadeOut: boolean, time: number, hexColor: number): void {
    const c = Phaser.Display.Color.ColorToRGBA(hexColor);
    this.cameras.main.fadeEffect.start(fadeOut, time, c.r, c.g, c.b);
  }

  public addEvent(
    delay: number,
    callback: () => void,
    callbackScope: any = this,
  ): Phaser.Time.TimerEvent {
    return this.time.addEvent({ delay, callback, callbackScope });
  }

  public isMouseOverHTMLElement(): boolean {
    return this.mouseOverHTMLElement;
  }

  public setupMouseListeners(): void {
    const handleInteraction = (x: number, y: number) => {
      const element = document.elementFromPoint(x, y);
      this.mouseOverHTMLElement = !!element && element.tagName !== 'CANVAS';
    };

    window.addEventListener('mousemove', (event) => {
      handleInteraction(event.clientX, event.clientY);
    });

    window.addEventListener('touchstart', (event) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        handleInteraction(touch.clientX, touch.clientY);
      }
    });

    window.addEventListener('touchmove', (event) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        handleInteraction(touch.clientX, touch.clientY);
      }
    });
  }

  public onPointerDownGlobal(
    pointer: Phaser.Input.Pointer,
    gameObjects: Phaser.GameObjects.GameObject[],
  ): void {
    if (pointer.button !== 0) return;
    if (
      gameObjects.length === 0 ||
      !gameObjects.some((obj) => obj instanceof Phaser.GameObjects.Sprite)
    ) {
      if (this.world.selectedBlocks.length > 0) {
        this.world.selectedBlocks.map((block) => block.setSelect(false));
        this.world.selectedBlocks = [];
      }

      event.emit(EventEnum.DESELECT_ALL);
    }
  }

  public onEvents(): void {
    this.input.on('pointerdown', this.onPointerDownGlobal.bind(this));

    event.on(EventEnum.SET_GAME_MODE, (mode) => {
      if (mode === GameModeEnum.MOVE) this.input.setDefaultCursor('move');
      else this.input.setDefaultCursor('default');

      this.gameMode = mode;
    });

    this.world.onEvents();
    this.hotbar.onEvents();

    event.emit(EventEnum.MAP_LOADED);
  }

  public destroy(): void {
    this.boat.destroy();
    this.world.destroy();
    event.clear();
  }
}
