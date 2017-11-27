/*
 * Copyright © HatioLab Inc. All rights reserved.
 */

import Mesh from './mesh'

const STOCK_COLOR = '#ccaa76'
// const STATUS_COLORS = {
//   A: 'black',
//   B: '#ccaa76',
//   C: '#ff1100',
//   D: '#252525',
//   E: '#6ac428'
// }

export default class Stock extends Mesh {

  constructor(model, visualizer) {

    super(model);

    this._visualizer = visualizer;
    this._hideEmptyStock = visualizer && visualizer._stockStatus && visualizer._stockStatus.hideEmptyStock

    this.createObject();

  }

  dispose() {
    super.dispose();

    delete this._visualizer
  }

  getMaterial(index) {
    if (!this.stockMaterials[index]) {
      if (!(this._visualizer && this._visualizer._stockStatus))
        return this.userDefineDefaultMaterial;

      var stockStatus = this._visualizer._stockStatus;
      var range = stockStatus.ranges[index];

      if (!(range && range.color))
        this.stockMaterials[index] = this.userDefineDefaultMaterial;

      this.stockMaterials[index] = new THREE.MeshLambertMaterial({
        color: range.color,
        side: THREE.FrontSide
      })
    }

    return this.stockMaterials[index];
  }

  get stockMaterials() {
    if (!this._visualizer._stock_materials)
      this._visualizer._stock_materials = [];

    return this._visualizer._stock_materials
  }

  get userDefineDefaultMaterial() {
    if (!this._visualizer._default_material) {
      if (!(this._visualizer && this._visualizer._stockStatus))
        return Stock.defaultMaterial;

      var stockStatus = this._visualizer._stockStatus;
      var defaultColor = stockStatus.defaultColor;

      if (!defaultColor)
        return Stock.defaultMaterial;

      this._visualizer._default_material = new THREE.MeshLambertMaterial({
        color: defaultColor,
        side: THREE.FrontSide
      })
    }

    return this._visualizer._default_material
  }

  get emptyMaterial() {
    if (!this._visualizer._empty_material) {
      this._visualizer._empty_material = new THREE.MeshBasicMaterial();
      this._visualizer._empty_material.opacity = 0.25;
      this._visualizer._empty_material.transparent = true;
    }

    return this._visualizer._empty_material
  }

  static get defaultMaterial() {
    if (!Stock._material_default)
      Stock._material_default = new THREE.MeshLambertMaterial({
        color: STOCK_COLOR,
        side: THREE.FrontSide
      })

    return Stock._material_default
  }

  createObject() {
    var {
      width,
      height,
      depth
    } = this.model;

    this.createStock(width, height, depth)
  }

  createStock(w, h, d) {

    this.geometry = new THREE.BoxBufferGeometry(w, d, h);
    this.material = this._hideEmptyStock ? this.emptyMaterial : this.userDefineDefaultMaterial;
    this.type = 'stock'

    // this.visible = !this._hideEmptyStock;

    // this.castShadow = true

  }

  onUserDataChanged() {
    super.onUserDataChanged();

    if (!(this._visualizer && this._visualizer._stockStatus))
      return

    var stockStatus = this._visualizer._stockStatus;
    var statusField = stockStatus.field;
    var ranges = stockStatus.ranges

    if (!(statusField && ranges))
      return


    var status = this.userData[statusField];

    if (status == undefined) {
      // this.visible = !this._hideEmptyStock;
      this.material = this._hideEmptyStock ? this.emptyMaterial : this.userDefineDefaultMaterial;
      return
    }


    ranges.some((range, index) => {
      let {
        min,
        max
      } = range

      if (max > status) {
        if (min !== undefined) {
          if (min <= status) {
            this.material = this.getMaterial(index)
          }
        } else
          this.material = this.getMaterial(index)

        // this.visible = true;
        return true;
      }
    })
  }

  // onmousemove(e, visualizer) {

  //   var tooltip = visualizer.tooltip || visualizer._scene2d.getObjectByName("tooltip")

  //   if (tooltip) {
  //     visualizer._scene2d.remove(tooltip)
  //     visualizer.tooltip = null
  //     visualizer.render_threed()
  //   }

  //   if (!this.visible)
  //     return;

  //   if (!this.userData)
  //     this.userData = {};

  //   var tooltipText = '';

  //   for (let key in this.userData) {
  //     // exclude private data
  //     if (/^__/.test(key))
  //       continue;

  //     if (this.userData[key] && typeof this.userData[key] != 'object') {
  //       tooltipText += key + ": " + this.userData[key] + "\n"
  //     }
  //   }

  //   // tooltipText = 'loc : ' + loc

  //   if (tooltipText.length > 0) {
  //     tooltip = visualizer.tooltip = visualizer.makeTextSprite(tooltipText)

  //     var vector = new THREE.Vector3()
  //     var vector2 = new THREE.Vector3()

  //     vector.set(visualizer._mouse.x, visualizer._mouse.y, 0.5)
  //     vector2.set(tooltip.scale.x / 2, - tooltip.scale.y / 2, 0)
  //     //
  //     // vector2.normalize()
  //     //
  //     // vector2.subScalar(0.5)
  //     //
  //     // vector2.y = -vector2.y
  //     // vector2.z = 0

  //     // vector.add(vector2)

  //     vector.unproject(visualizer._2dCamera)
  //     vector.add(vector2)
  //     tooltip.position.set(vector.x, vector.y, vector.z)
  //     tooltip.name = "tooltip"

  //     visualizer._scene2d.add(tooltip)
  //     visualizer._renderer && visualizer._renderer.render(visualizer._scene2d, visualizer._2dCamera)
  //     visualizer.invalidate()
  //   }

  // }

  onBeforeRender() {
    if (this._focused)
      this.rotation.y += 0.5
    else
      this.rotation.y = 0
  }

  onclick(e, visualizer, callback) {


    // var tooltip = visualizer.tooltip || visualizer._scene2d.getObjectByName("tooltip")

    // if (tooltip) {
    //   visualizer._scene2d.remove(tooltip)
    //   visualizer.tooltip = null
    //   visualizer.render_threed()
    // }

    if (!this.visible)
      return;

    if (!this.userData || Object.keys(this.userData).length === 0)
      this.userData = {
        loc: this.name
      };

    if (callback && typeof callback == 'function') {
      callback.call(this, {
        data: this.userData
      })
    }

    // var tooltipText = '';

    // for (let key in this.userData) {
    //   // exclude private data
    //   if (/^__/.test(key))
    //     continue;

    //   if (this.userData[key] && typeof this.userData[key] != 'object') {
    //     tooltipText += key + ": " + this.userData[key] + "\n"
    //   }
    // }

    // // tooltipText = 'loc : ' + loc

    // if (tooltipText.length > 0) {
    //   tooltip = visualizer.tooltip = visualizer.makeTextSprite(tooltipText)

    //   var vector = new THREE.Vector3()
    //   var vector2 = new THREE.Vector3()

    //   vector.set(visualizer._mouse.x, visualizer._mouse.y, 0.5)
    //   vector2.set(tooltip.scale.x / 2, - tooltip.scale.y / 2, 0)
    //   //
    //   // vector2.normalize()
    //   //
    //   // vector2.subScalar(0.5)
    //   //
    //   // vector2.y = -vector2.y
    //   // vector2.z = 0

    //   // vector.add(vector2)

    //   vector.unproject(visualizer._2dCamera)
    //   vector.add(vector2)
    //   tooltip.position.set(vector.x, vector.y, vector.z)
    //   tooltip.name = "tooltip"

    //   visualizer._scene2d.add(tooltip)
    //   visualizer._renderer && visualizer._renderer.render(visualizer._scene2d, visualizer._2dCamera)
    //   visualizer.invalidate()
    // }


  }
}

