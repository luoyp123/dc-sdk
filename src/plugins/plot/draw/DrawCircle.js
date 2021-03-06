/*
 * @Author: Caven
 * @Date: 2020-01-31 19:44:41
 * @Last Modified by: Caven
 * @Last Modified time: 2020-03-17 23:00:02
 */
import Cesium from '@/namespace'
import Draw from './Draw'

const DEF_STYLE = {
  width: 3,
  material: Cesium.Color.BLUE.withAlpha(0.6)
}

class DrawClicle extends Draw {
  constructor(plotInfo, style) {
    super(plotInfo)
    this._center = Cesium.Cartesian3.ZERO
    this._radius = 0
    this._style = {
      ...DEF_STYLE,
      ...style
    }
  }

  _mouseClickHandler(e) {
    let position = e.surfacePosition
    if (position && this._center === Cesium.Cartesian3.ZERO) {
      this._center = position
    } else {
      this._computeRadius(this._center, position)
      this._unbindEnvet()
      this._plotEvent.raiseEvent({
        type: DC.OverlayType.CIRCLE,
        points: [DC.T.transformCartesianToWSG84(this._center)],
        radius: this._radius
      })
    }
  }

  _mouseMoveHandler(e) {
    this._viewer.tooltip.setContent('单击选择点位')
    let position = e.surfacePosition
    this._viewer.tooltip.setPosition(position)
    if (position && this._center !== Cesium.Cartesian3.ZERO) {
      this._computeRadius(this._center, position)
    }
  }

  _computeRadius(src, dest) {
    let srcCartographic = Cesium.Cartographic.fromCartesian(src)
    let destCartographic = Cesium.Cartographic.fromCartesian(dest)
    let geodesic = new Cesium.EllipsoidGeodesic()
    geodesic.setEndPoints(srcCartographic, destCartographic)
    let s = geodesic.surfaceDistance
    this._radius = Math.sqrt(
      Math.pow(s, 2) +
        Math.pow(destCartographic.height - srcCartographic.height, 2)
    )
  }

  _prepareDelegate() {
    this._delegate.position = new Cesium.CallbackProperty(time => {
      return this._center
    })
    this._delegate.ellipse = {
      semiMajorAxis: new Cesium.CallbackProperty(time => {
        return this._radius
      }),
      semiMinorAxis: new Cesium.CallbackProperty(time => {
        return this._radius
      }),
      ...this._style
    }
    this._delegate.point = {
      pixelSize: 10,
      outlineColor: Cesium.Color.RED,
      outlineWidth: 3
    }

    this._layer.entities.add(this._delegate)
  }
}

export default DrawClicle
