import * as Hammer from 'hammerjs';

import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';

/**
 * @hidden
 * This class overrides the default Angular gesture config.
 */
@Injectable()
export class IonicGestureConfig extends HammerGestureConfig {
	buildHammer(element: HTMLElement) {
		const mc = new (window as any).Hammer(element);

		this.overrides = ( {
			swipe: {
				direction: Hammer.DIRECTION_ALL,
				threshold: 20
			},

			press: {
				threshold: 19
			}

		} as any);

		for (const eventName in this.overrides) {
			if (eventName) {
				mc.get(eventName).set(this.overrides[eventName]);
			}
		}

		return mc;
	}
}
