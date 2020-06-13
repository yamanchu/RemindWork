export interface IGeometoryFactor {
  x: number;
  y: number;
  z: number;
}

export interface IVector extends IGeometoryFactor {
  isUnit(): boolean;
}
