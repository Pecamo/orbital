"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Line_1 = require("./Line");
var line1 = new Line_1.Line(100, 0, 12);
var line2 = new Line_1.Line(100, 9, 15);
var line3 = new Line_1.Line(100, 40, 50);
var line4 = new Line_1.Line(100, 90, 10);
var lineF = new Line_1.Line(100, 0, 50);
var lineG = new Line_1.Line(100, 50, 100);
var lineA = new Line_1.Line(300, 22, 32);
var lineB = new Line_1.Line(300, 12, 22);
var lineC = new Line_1.Line(300, 32, 42);
var lineR = new Line_1.Line(300, 12, 42);
test('Line includes some points', function () {
    expect(line1.includes(5)).toBe(true);
    expect(line1.includes(20)).toBe(false);
    expect(line4.includes(99)).toBe(true);
    expect(line4.includes(5)).toBe(true);
});
test('Lines overlap each others', function () {
    expect(line1.isOverlapping(line2)).toBe(true);
    expect(line2.isOverlapping(line1)).toBe(true);
    expect(line1.isOverlapping(line3)).toBe(false);
    expect(line1.isOverlapping(line4)).toBe(true);
    expect(line4.isOverlapping(line1)).toBe(true);
});
test('Lines merge together', function () {
    var merged1 = line1.merge(line2);
    expect(merged1.from).toBe(0);
    expect(merged1.to).toBe(15);
    var merged2 = line1.merge(line4);
    expect(merged2.from).toBe(90);
    expect(merged2.to).toBe(12);
});
test('simplifyArray works', function () {
    expect(Line_1.Line.simplifyArray([]).length).toBe(0);
    expect(Line_1.Line.simplifyArray([line1]).length).toBe(1);
    expect(Line_1.Line.simplifyArray([line1, line3]).length).toBe(2);
    expect(Line_1.Line.simplifyArray([line1, line2]).length).toBe(1);
    expect(Line_1.Line.simplifyArray([line1, line3, line2]).length).toBe(2);
    expect(Line_1.Line.simplifyArray([line4, line3, line2, line1]).length).toBe(2);
    var arr = Line_1.Line.simplifyArray([lineA, lineB, lineC]);
    expect(arr.length).toBe(1);
    expect(arr[0].from).toBe(lineR.from);
    expect(arr[0].to).toBe(lineR.to);
    var arr2 = Line_1.Line.simplifyArray([lineF, lineG]);
    expect(arr2.length).toBe(1);
    expect(arr2[0].from).toBe(0);
    expect(arr2[0].to).toBe(100);
});
