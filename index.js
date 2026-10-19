'use strict';

class MusicPlatform {
  constructor(root = document.getElementById('app')) {
    this.root = root;
  }

  initialize() {
    if (!this.root) throw new Error('Music Platform root element not found.');
    console.info('Music Platform initialized.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MusicPlatform().initialize();
});
