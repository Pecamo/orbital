import { Line } from "./Line";

const line1 = new Line(100, 0, 12);
const line2 = new Line(100, 9, 15);
const line3 = new Line(100, 40, 50);
const line4 = new Line(100, 90, 10);

const lineF = new Line(100, 0, 50);
const lineG = new Line(100, 50, 100);

const lineA = new Line(300, 22, 32);
const lineB = new Line(300, 12, 22);
const lineC = new Line(300, 32, 42);
const lineR = new Line(300, 12, 42);

test("Line includes some points", () => {
  expect(line1.includes(5)).toBe(true);
  expect(line1.includes(20)).toBe(false);
  expect(line4.includes(99)).toBe(true);
  expect(line4.includes(5)).toBe(true);
});

test("Lines overlap each others", () => {
  expect(line1.isOverlapping(line2)).toBe(true);
  expect(line2.isOverlapping(line1)).toBe(true);
  expect(line1.isOverlapping(line3)).toBe(false);
  expect(line1.isOverlapping(line4)).toBe(true);
  expect(line4.isOverlapping(line1)).toBe(true);
});

test("Lines merge together", () => {
  const merged1 = line1.merge(line2);
  expect(merged1.from).toBe(0);
  expect(merged1.to).toBe(15);

  const merged2 = line1.merge(line4);
  expect(merged2.from).toBe(90);
  expect(merged2.to).toBe(12);
});

test("simplifyArray works", () => {
  expect(Line.simplifyArray([]).length).toBe(0);
  expect(Line.simplifyArray([line1]).length).toBe(1);
  expect(Line.simplifyArray([line1, line3]).length).toBe(2);
  expect(Line.simplifyArray([line1, line2]).length).toBe(1);
  expect(Line.simplifyArray([line1, line3, line2]).length).toBe(2);
  expect(Line.simplifyArray([line4, line3, line2, line1]).length).toBe(2);

  const arr = Line.simplifyArray([lineA, lineB, lineC]);
  expect(arr.length).toBe(1);
  expect(arr[0].from).toBe(lineR.from);
  expect(arr[0].to).toBe(lineR.to);

  const arr2 = Line.simplifyArray([lineF, lineG]);
  expect(arr2.length).toBe(1);
  expect(arr2[0].from).toBe(0);
  expect(arr2[0].to).toBe(100);
});
