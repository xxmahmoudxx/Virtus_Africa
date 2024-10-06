// ClickableMesh.ts
import * as THREE from 'three';

/**
 * Classe ClickableMesh étendant THREE.Mesh pour inclure une propriété callback.
 */
export class ClickableMesh extends THREE.Mesh {
  callback: () => void;

  /**
   * Constructeur de ClickableMesh.
   * @param geometry - La géométrie du mesh (BufferGeometry).
   * @param material - Le matériau du mesh.
   * @param callback - La fonction à appeler lors du clic sur le mesh.
   */
  constructor(
    geometry: THREE.BufferGeometry,
    material: THREE.Material | THREE.Material[],
    callback: () => void
  ) {
    super(geometry, material);
    this.callback = callback;
  }
}
