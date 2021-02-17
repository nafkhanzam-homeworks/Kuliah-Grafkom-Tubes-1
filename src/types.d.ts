type Point = [number, number];

type Line = {
  p0: Point;
  p1: Point;
};

type Square = {
  p: Point;
  size: number;
};

type Polygon = Point[];

type Shape =
  | {
      type: "line";
      object: Line;
    }
  | {
      type: "square";
      object: Square;
    }
  | {
      type: "polygon";
      object: Polygon;
    };

type AppInstance = {
  shapes: Shape[];
};
