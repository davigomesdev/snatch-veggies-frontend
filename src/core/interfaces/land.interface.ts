export interface ILand {
  id: string;
  userId: string;
  tokenId: number;
  name: string;
  exp: number;
  lastTheftDate: Date;
  lastStolenDate: Date;
  theftCount: number;
  stolenCount: number;
}
