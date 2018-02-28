/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
export default class Mesh extends THREE.Mesh {
  constructor(model) {
    super();

    this._model = model;
  }

  dispose() {
    this.children.slice().forEach(child => {
      if (child.dispose)
        child.dispose();
      if (child.geometry && child.geometry.dispose)
        child.geometry.dispose();
      if (child.material && child.material.dispose)
        child.material.dispose();
      if (child.texture && child.texture.dispose)
        child.texture.dispose();
      this.remove(child)
    })
  }

  get model() {
    return this._model
  }
}
