let Name: number = 1;
console.log(Name);

interface User {
  name: string;
  id: number;
}

const user: User = {
  name: "1",
  id: 5,
};

interface Point {
  a: number;
  b: number;
}

function logPoint(p: Point) {
  console.log(p.a, p.b);
}

const point = { a: 1, b: 2 };

logPoint(point);
