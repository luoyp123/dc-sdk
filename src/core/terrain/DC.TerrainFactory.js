/*
 * @Author: Caven
 * @Date: 2020-01-21 15:54:56
 * @Last Modified by: Caven
 * @Last Modified time: 2020-03-02 15:30:47
 */
import Cesium from '@/namespace'

DC.TerrainFactory = class {
  /**
   * create ellipsoid terrain
   */
  static createEllipsoidTerrain(options) {
    return new Cesium.EllipsoidTerrainProvider(options)
  }

  /**
   * create url terrain
   */
  static createUrlTerrain(options) {
    return new Cesium.CesiumTerrainProvider(options)
  }

  /**
   *  create google terrain
   */
  static createGoogleTerrain(options) {
    return new Cesium.GoogleEarthEnterpriseTerrainProvider(options)
  }

  /**
   *  create arcgis terrain
   */
  static createArcgisTerrain(options) {
    return new Cesium.ArcGISTiledElevationTerrainProvider(options)
  }

  /**
   *  create vr terrain
   */
  static createVRTerrain(options) {
    return new Cesium.VRTheWorldTerrainProvider(options)
  }
}
