type Point = [number, number];
type Color = [number, number, number];

type Line = {
  p0: Point;
  p1: Point;
  color: Color;
};

type Square = {
  p: Point;
  size: number;
  color: Color;
};

type Polygon = {
  points: Point[];
  color: Color;
};

type ShapeInstance =
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
  shapes: ShapeInstance[];
};

type MouseState = {
  pos: Point;
  pressed: {
    pos: Point | null;
  };
};
