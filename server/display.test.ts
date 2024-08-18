import {Display} from "./display";
import {HtmlColors} from "./htmlColors";

const DISPLAY_SIZE = 100;

function generateTestDisplay() {
  return new Display(DISPLAY_SIZE, "", 13335, false);
}

const FULL_BLACK = Array(DISPLAY_SIZE).fill(HtmlColors.black);

describe('Display', () => {
  test("is fully black at creation", () => {
    const display = generateTestDisplay();
    expect(display.screenshot()).toStrictEqual(FULL_BLACK);
  });
})
