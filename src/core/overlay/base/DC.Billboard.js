/*
 * @Author: Caven
 * @Date: 2020-01-19 10:18:23
 * @Last Modified by: Caven
 * @Last Modified time: 2020-03-14 14:03:54
 */

import Cesium from '@/namespace'
import Overlay from '../Overlay'

DC.Billboard = class extends Overlay {
  constructor(position, icon) {
    if (!position || !(position instanceof DC.Position)) {
      throw new Error('the position invalid')
    }
    super()
    this._position = position
    this._icon = icon
    this._size = [32, 32]
    this._delegate = new Cesium.Entity()
    this._state = DC.OverlayState.INITIALIZED
    this.type = DC.OverlayType.BILLBOARD
  }

  set position(position) {
    if (!position || !(position instanceof DC.Position)) {
      throw new Error('the position invalid')
    }
    this._position = position
  }

  get position() {
    return this._position
  }

  set icon(icon) {
    this._icon = icon
  }

  get icon() {
    return this._icon
  }

  set size(size) {
    this._size = size
  }

  get size() {
    return this._size
  }

  /**
   * prepare entity
   */
  _prepareDelegate() {
    /**
     * set the location
     */
    this._delegate.position = new Cesium.CallbackProperty(time => {
      return DC.T.transformWSG84ToCartesian(this._position)
    })
    /**
     * set the orientation
     */
    this._delegate.orientation = new Cesium.CallbackProperty(time => {
      return Cesium.Transforms.headingPitchRollQuaternion(
        DC.T.transformWSG84ToCartesian(this._position),
        new Cesium.HeadingPitchRoll(
          Cesium.Math.toRadians(this._position.heading),
          Cesium.Math.toRadians(this._position.pitch),
          Cesium.Math.toRadians(this._position.roll)
        )
      )
    })
    /**
     *  initialize the Overlay parameter
     */
    this._delegate.billboard = {
      ...this._style,
      image: new Cesium.CallbackProperty(time => {
        return this._icon
      }),
      width: new Cesium.CallbackProperty(time => {
        return this._size[0] || 32
      }),
      height: new Cesium.CallbackProperty(time => {
        return this._size[1] || 32
      })
    }
    this._delegate.layer = this._layer
    this._delegate.overlayId = this._id
  }

  /**
   *
   * @param {*} text
   * @param {*} textStyle
   */
  setLabel(text, textStyle) {
    this._delegate.label = {
      ...textStyle,
      text: text
    }
    return this
  }

  /**
   *
   * @param {*} style
   */
  setStyle(style) {
    if (Object.keys(style).length === 0) {
      return this
    }
    this._style = style
    this._delegate.billboard &&
      DC.Util.merge(this._delegate.billboard, this._style)
    return this
  }

  /**
   *
   * @param {*} entity
   */
  static fromEntity(entity) {
    let position = DC.T.transformCartesianToWSG84(entity.position._value)
    let billboard = undefined
    if (entity.billboard) {
      billboard = new DC.Billboard(position, entity.billboard.image)
      billboard.attr = {
        ...entity.properties
      }
    }
    return billboard
  }
}

DC.OverlayType.BILLBOARD = 'billboard'
