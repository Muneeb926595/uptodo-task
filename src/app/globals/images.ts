class _Images {
  readonly DefaultTodo = require('../assets/images/DefaultTodo.png');
  readonly Avatar = require('../assets/images/Avatar.png');
  readonly HomeGraphics = require('../assets/images/HomeGraphics.webp');
  // Onboarding images - add actual images to src/app/assets/images/
  readonly WelcomeCarousel1 = require('../assets/images/WelcomeCarousel1.png'); // Placeholder
  readonly WelcomeCarousel2 = require('../assets/images/WelcomeCarousel2.png'); // Placeholder
  readonly WelcomeCarousel3 = require('../assets/images/WelcomeCarousel3.png'); // Placeholder
}

/**
 * Animations like lottie, gif, AnimationObjects
 */
class _Animation {
  readonly dot = require('../assets/lottie/icon-dot.json');
}
export const Images = new _Images();
export const Animation = new _Animation();
