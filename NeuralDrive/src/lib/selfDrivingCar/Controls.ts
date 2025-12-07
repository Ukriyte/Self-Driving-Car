export type ControlType = "KEYS" | "DUMMY" | "AI";

export class Controls {
  forward: boolean;
  left: boolean;
  right: boolean;
  reverse: boolean;
  private boundKeyDown: ((event: KeyboardEvent) => void) | null = null;
  private boundKeyUp: ((event: KeyboardEvent) => void) | null = null;

  constructor(type: ControlType) {
    this.forward = false;
    this.left = false;
    this.right = false;
    this.reverse = false;

    switch (type) {
      case "KEYS":
        this.addKeyboardListeners();
        break;
      case "DUMMY":
        this.forward = true;
        break;
    }
  }

  private addKeyboardListeners(): void {
    this.boundKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          this.left = true;
          break;
        case "ArrowRight":
          this.right = true;
          break;
        case "ArrowUp":
          this.forward = true;
          break;
        case "ArrowDown":
          this.reverse = true;
          break;
      }
    };

    this.boundKeyUp = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          this.left = false;
          break;
        case "ArrowRight":
          this.right = false;
          break;
        case "ArrowUp":
          this.forward = false;
          break;
        case "ArrowDown":
          this.reverse = false;
          break;
      }
    };

    document.addEventListener("keydown", this.boundKeyDown);
    document.addEventListener("keyup", this.boundKeyUp);
  }

  destroy(): void {
    if (this.boundKeyDown) {
      document.removeEventListener("keydown", this.boundKeyDown);
    }
    if (this.boundKeyUp) {
      document.removeEventListener("keyup", this.boundKeyUp);
    }
  }
}
