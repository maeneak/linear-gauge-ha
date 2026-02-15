import { noChange } from 'lit';
import { AttributePart, directive, Directive } from 'lit/directive.js';

export interface ActionHandlerOptions {
  hasHold?: boolean;
  hasDoubleClick?: boolean;
}

class ActionHandlerDirective extends Directive {
  private _element?: HTMLElement;
  private _options?: ActionHandlerOptions;
  private _holdTimer?: ReturnType<typeof setTimeout>;
  private _holdTriggered = false;
  private _dblClickTimer?: ReturnType<typeof setTimeout>;

  update(part: AttributePart, [options]: [ActionHandlerOptions]) {
    const element = part.element as HTMLElement;
    if (this._element !== element) {
      this._element = element;
      this._options = options;
      this._attach(element);
    } else {
      this._options = options;
    }
    return noChange;
  }

  render(_options: ActionHandlerOptions) {
    return noChange;
  }

  private _attach(element: HTMLElement) {
    const HOLD_DURATION = 500;

    element.addEventListener('pointerdown', () => {
      this._holdTriggered = false;
      if (this._options?.hasHold) {
        this._holdTimer = setTimeout(() => {
          this._holdTriggered = true;
          element.dispatchEvent(
            new CustomEvent('action', { detail: { action: 'hold' }, bubbles: true, composed: true }),
          );
        }, HOLD_DURATION);
      }
    });

    element.addEventListener('pointerup', () => {
      if (this._holdTimer) {
        clearTimeout(this._holdTimer);
        this._holdTimer = undefined;
      }
    });

    element.addEventListener('pointercancel', () => {
      if (this._holdTimer) {
        clearTimeout(this._holdTimer);
        this._holdTimer = undefined;
      }
    });

    element.addEventListener('click', () => {
      if (this._holdTriggered) return;

      if (this._options?.hasDoubleClick) {
        if (this._dblClickTimer) {
          clearTimeout(this._dblClickTimer);
          this._dblClickTimer = undefined;
          element.dispatchEvent(
            new CustomEvent('action', {
              detail: { action: 'double_tap' },
              bubbles: true,
              composed: true,
            }),
          );
        } else {
          this._dblClickTimer = setTimeout(() => {
            this._dblClickTimer = undefined;
            element.dispatchEvent(
              new CustomEvent('action', {
                detail: { action: 'tap' },
                bubbles: true,
                composed: true,
              }),
            );
          }, 250);
        }
      } else {
        element.dispatchEvent(
          new CustomEvent('action', { detail: { action: 'tap' }, bubbles: true, composed: true }),
        );
      }
    });
  }
}

export const actionHandler = directive(ActionHandlerDirective);
