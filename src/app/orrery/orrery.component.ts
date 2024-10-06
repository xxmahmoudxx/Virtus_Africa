// orrery.component.ts
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ClickableMesh } from './ClickableMesh';
import { ApiService } from '../api.service';
import { Chart } from 'chart.js';



@Component({
  selector: 'app-orrery',
  templateUrl: './orrery.component.html',
  styleUrls: ['./orrery.component.scss']
})
export class OrreryComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('rendererContainer') rendererContainer!: ElementRef;
  @ViewChild('backgroundMusic') backgroundMusic!: ElementRef<HTMLAudioElement>; // Optionnel pour les sons

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private animationId!: number;

  // Tableau pour stocker les corps célestes (planètes)
  private celestialBodies: { planet: ClickableMesh; orbit: THREE.Object3D; data: any }[] = [];
  isPaused: boolean = false;
  animationSpeed: number = 1; // Vitesse d'animation contrôlée par le slider

  // Variables pour la gestion du modal
  modalVisible: boolean = false;
  selectedPlanet: any = null;
  selectedPlanetInfo: string = '';

  // Variable pour le sélecteur de planète
  selectedPlanetName: string = '';

  planets = [
    {
      name: 'Mercury',
      size: 1,
      distance: 5,
      texture: 'assets/textures/mercury.jpg',
      lambda: 15,
      phi: 1,
      rho: 1,
      diameter: '4,880 km',
      distanceFromSun: '57.91 million km',
      orbitalPeriod: '88 days',
      atmosphere: 'Très mince',
      temperature: '430°C',
      moons: '0',
      accuracy: {
        nominalErrors: {
          period: '1800 AD — 2050 AD',
          lambda: '15 arcsec',
          phi: '1 arcsec',
          rho: '1,000 km'
        },
        historicErrors: {
          period: '3000 BC — 3000 AD',
          lambda: '20 arcsec',
          phi: '15 arcsec',
          rho: '1,000 km'
        }
      }
    },
    {
      name: 'Venus',
      size: 1.25,
      distance: 10,
      texture: 'assets/textures/venus.jpg',
      lambda: 25,
      phi: 2,
      rho: 1,
      diameter: '12,104 km',
      distanceFromSun: '108.2 million km',
      orbitalPeriod: '225 days',
      atmosphere: 'Dense CO2',
      temperature: '467°C',
      moons: '0',
      accuracy: {
        nominalErrors: {
          period: '1800 AD — 2050 AD',
          lambda: '10 arcsec',
          phi: '1 arcsec',
          rho: '1,000 km'
        },
        historicErrors: {
          period: '3000 BC — 3000 AD',
          lambda: '15 arcsec',
          phi: '10 arcsec',
          rho: '1,000 km'
        }
      }
    },
    {
      name: 'Earth',
      size: 1.6,
      distance: 15,
      texture: 'assets/textures/earth.jpg',
      lambda: 0,
      phi: 0,
      rho: 1,
      diameter: '12,742 km',
      distanceFromSun: '149.6 million km',
      orbitalPeriod: '365 days',
      atmosphere: 'Nitrogen-Oxygen',
      temperature: '15°C',
      moons: '1',
      accuracy: {
        nominalErrors: {
          period: '1800 AD — 2050 AD',
          lambda: '1 arcsec',
          phi: '0.5 arcsec',
          rho: '100 km'
        },
        historicErrors: {
          period: '3000 BC — 3000 AD',
          lambda: '1 arcsec',
          phi: '1 arcsec',
          rho: '100 km'
        }
      }
    },
    {
      name: 'Mars',
      size: 1.53,
      distance: 20,
      texture: 'assets/textures/mars.jpg',
      lambda: 30,
      phi: 3,
      rho: 1,
      diameter: '6,779 km',
      distanceFromSun: '227.9 million km',
      orbitalPeriod: '687 days',
      atmosphere: 'Thin CO2',
      temperature: '-63°C',
      moons: '2',
      accuracy: {
        nominalErrors: {
          period: '1800 AD — 2050 AD',
          lambda: '20 arcsec',
          phi: '5 arcsec',
          rho: '1,000 km'
        },
        historicErrors: {
          period: '3000 BC — 3000 AD',
          lambda: '30 arcsec',
          phi: '15 arcsec',
          rho: '1,000 km'
        }
      }
    },
    {
      name: 'Jupiter',
      size: 3.2,
      distance: 100,
      texture: 'assets/textures/jupiter.jpg',
      lambda: 45,
      phi: 5,
      rho: 1,
      diameter: '139,820 km',
      distanceFromSun: '778.5 million km',
      orbitalPeriod: '11.86 years',
      atmosphere: 'Hydrogen-Helium',
      temperature: '-145°C',
      moons: '79',
      accuracy: {
        nominalErrors: {
          period: '1800 AD — 2050 AD',
          lambda: '30 arcsec',
          phi: '5 arcsec',
          rho: '10,000 km'
        },
        historicErrors: {
          period: '3000 BC — 3000 AD',
          lambda: '60 arcsec',
          phi: '30 arcsec',
          rho: '10,000 km'
        }
      }
    },
    {
      name: 'Saturn',
      size: 2.4,
      distance: 90,
      texture: 'assets/textures/saturn.jpg',
      lambda: 50,
      phi: 7,
      rho: 1,
      diameter: '116,460 km',
      distanceFromSun: '1.434 billion km',
      orbitalPeriod: '29.46 years',
      atmosphere: 'Hydrogen-Helium',
      temperature: '-178°C',
      moons: '83',
      accuracy: {
        nominalErrors: {
          period: '1800 AD — 2050 AD',
          lambda: '40 arcsec',
          phi: '10 arcsec',
          rho: '10,000 km'
        },
        historicErrors: {
          period: '3000 BC — 3000 AD',
          lambda: '70 arcsec',
          phi: '30 arcsec',
          rho: '10,000 km'
        }
      }
    },
    {
      name: 'Uranus',
      size: 2,
      distance: 75,
      texture: 'assets/textures/uranus.jpg',
      lambda: 55,
      phi: 9,
      rho: 1,
      diameter: '50,724 km',
      distanceFromSun: '2.871 billion km',
      orbitalPeriod: '84 years',
      atmosphere: 'Hydrogen-Helium-Methane',
      temperature: '-197°C',
      moons: '27',
      accuracy: {
        nominalErrors: {
          period: '1800 AD — 2050 AD',
          lambda: '50 arcsec',
          phi: '10 arcsec',
          rho: '10,000 km'
        },
        historicErrors: {
          period: '3000 BC — 3000 AD',
          lambda: '100 arcsec',
          phi: '50 arcsec',
          rho: '10,000 km'
        }
      }
    },
    {
      name: 'Neptune',
      size: 1.8,
      distance: 85,
      texture: 'assets/textures/neptune.jpg',
      lambda: 60,
      phi: 10,
      rho: 1,
      diameter: '49,244 km',
      distanceFromSun: '4.495 billion km',
      orbitalPeriod: '164.8 years',
      atmosphere: 'Hydrogen-Helium-Methane',
      temperature: '-201°C',
      moons: '14',
      accuracy: {
        nominalErrors: {
          period: '1800 AD — 2050 AD',
          lambda: '50 arcsec',
          phi: '10 arcsec',
          rho: '10,000 km'
        },
        historicErrors: {
          period: '3000 BC — 3000 AD',
          lambda: '100 arcsec',
          phi: '50 arcsec',
          rho: '10,000 km'
        }
      }
    }
  ];

  chartData: any;

  nearEarthComets: any[] = []; // Propriété pour stocker les comètes

  constructor(private apiService: ApiService) { } // Injectez le service ici

  ngOnInit(): void {
    // Chargez les comètes dans ngOnInit
    this.loadNearEarthComets();
    this.initializeChartData();
    this.loadScript('https://cdn.botpress.cloud/webchat/v2.2/inject.js');
    this.loadScript('https://files.bpcontent.cloud/2024/10/06/14/20241006141357-SQ1DZ7SM.js');

  }

  loadScript(url: string) {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    document.body.appendChild(script);
  }
  ngAfterViewInit(): void {
    this.initThree();
    this.createChart();

    this.playBackgroundMusic(); // Optionnel pour les sons
    this.animate();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.renderer.dispose();
  }

  /**
   * Initialisation de la scène Three.js
   */
  private initThree(): void {
    // Création de la scène
    this.scene = new THREE.Scene();

    // Chargement et application de la texture de fond
    const backgroundTextureLoader = new THREE.TextureLoader();
    const backgroundTexture = backgroundTextureLoader.load('assets/textures/space.jpg');
    this.scene.background = backgroundTexture;

    // Configuration de la caméra
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(15, 15, 30);

    // Configuration du renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    // Configuration des contrôles d'orbite
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableZoom = true;
    this.controls.enablePan = true;
    this.controls.enableRotate = true;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 100;

    // Création du Soleil
    const textureLoader = new THREE.TextureLoader();
    const sunGeometry = new THREE.SphereGeometry(8, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      map: textureLoader.load('assets/textures/sun.jpg'),
      side: THREE.DoubleSide
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    this.scene.add(sun);

    // Ajout de la lumière
    const light = new THREE.PointLight(0xffffff, 1.5, 100);
    light.position.set(0, 0, 0);
    this.scene.add(light);
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    // Création des planètes
    this.planets.forEach(p => this.createPlanet(p));

    // Gestion du redimensionnement de la fenêtre
    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    // Gestion des clics pour détecter les planètes
    window.addEventListener('click', this.onClick.bind(this), false);
  }

  /**
   * Création d'une planète avec ses caractéristiques
   * @param data Données de la planète
   */
  private createPlanet(data: any): void {
    // Create the geometry and material
    const geometry = new THREE.SphereGeometry(data.size, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(data.texture),
      side: THREE.DoubleSide
    });

    // Create an instance of ClickableMesh
    const planet = new ClickableMesh(geometry, material, () => {
      this.showModal(planet.userData);
      this.moveCameraToPlanet(planet);
    });

    // Create the orbit
    const orbit = new THREE.Object3D();
    orbit.add(planet);
    planet.position.set(data.distance, 0, 0);
    this.scene.add(orbit);
    this.createOrbit(data.distance, this.getOrbitColor(data.name));

    // Add user data to the planet
    planet.userData = {
      name: data.name,
      lambda: data.lambda,
      phi: data.phi,
      rho: data.rho,
      diameter: data.diameter,
      distanceFromSun: data.distanceFromSun,
      orbitalPeriod: data.orbitalPeriod,
      atmosphere: data.atmosphere,
      temperature: data.temperature,
      moons: data.moons
    };

    // Add the planet to the celestial bodies array
    this.celestialBodies.push({ planet, orbit, data });
  }


  /**
   * Création de l'orbite d'une planète
   * @param distance Distance de la planète au soleil
   * @param color Couleur de l'orbite
   */
  private createOrbit(distance: number, color: number): void {
    const orbitGeometry = new THREE.CircleGeometry(distance, 64);
    const orbitMaterial = new THREE.LineBasicMaterial({ color: color, opacity: 0.5, transparent: true });
    const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    this.scene.add(orbit);
  }

  /**
   * Obtient la couleur de l'orbite en fonction du nom de la planète
   * @param planetName Nom de la planète
   * @returns Code couleur hexadécimal
   */
  private getOrbitColor(planetName: string): number {
    const colors: { [key: string]: number } = {
      'Mercury': 0xaaaaaa,
      'Venus': 0xffa500,
      'Earth': 0x0000ff,
      'Mars': 0xff0000,
      'Jupiter': 0xffd700
    };
    return colors[planetName] || 0xffffff;
  }

  /**
   * Gestion du redimensionnement de la fenêtre
   */
  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * Gestion des clics pour détecter les planètes cliquées
   * @param event Événement de clic
   */
  private onClick(event: MouseEvent): void {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, this.camera);
    const intersects = raycaster.intersectObjects(this.celestialBodies.map(body => body.planet));

    if (intersects.length > 0) {
      const clickedPlanet = intersects[0].object as ClickableMesh;
      if (clickedPlanet.callback) {
        clickedPlanet.callback(); // Appelle la fonction callback de la planète
      }
    }
  }

  /**
   * Déplacement de la caméra vers une planète spécifique
   * @param planet Mesh de la planète
   */
  private moveCameraToPlanet(planet: THREE.Mesh): void {
    const targetPosition = planet.position.clone().add(new THREE.Vector3(0, 0, 5)); // Ajuster la distance si nécessaire
    this.camera.position.copy(targetPosition);
    this.camera.lookAt(planet.position); // La caméra regarde la planète
    this.controls.enabled = false; // Désactiver les contrôles d'orbite pendant que la caméra est fixée
  }

  /**
   * Affichage du modal avec les informations de la planète sélectionnée
   * @param data Données de la planète
   */
  private showModal(data: any): void {
    this.selectedPlanet = data;
    this.selectedPlanetInfo = `
      <strong>λ (arcsec):</strong> ${data.lambda}<br>
      <strong>ϕ (arcsec):</strong> ${data.phi}<br>
      <strong>ρ (1000 km):</strong> ${data.rho}<br>
      <strong>Diameter:</strong> ${data.diameter}<br>
      <strong>Distance from Sun:</strong> ${data.distanceFromSun}<br>
      <strong>Orbital Period:</strong> ${data.orbitalPeriod}<br>
      <strong>Atmosphere:</strong> ${data.atmosphere}<br>
      <strong>Temperature:</strong> ${data.temperature}<br>
      <strong>Moons:</strong> ${data.moons}<br><br>
      <strong>Accuracy:</strong><br>
      <strong>Period:</strong> ${data.accuracy.nominalErrors.period}<br>
      <strong>λ (arcsec):</strong> ${data.accuracy.nominalErrors.lambda}<br>
      <strong>ϕ (arcsec):</strong> ${data.accuracy.nominalErrors.phi}<br>
      <strong>ρ (1000 km):</strong> ${data.accuracy.nominalErrors.rho}<br>
      <strong>Historic Errors:</strong><br>
      <strong>Period:</strong> ${data.accuracy.historicErrors.period}<br>
      <strong>λ (arcsec):</strong> ${data.accuracy.historicErrors.lambda}<br>
      <strong>ϕ (arcsec):</strong> ${data.accuracy.historicErrors.phi}<br>
      <strong>ρ (1000 km):</strong> ${data.accuracy.historicErrors.rho}
    `;
    this.modalVisible = true;
  }


  /**
   * Fermeture du modal
   */
  closeModal(): void {
    this.modalVisible = false;
    this.controls.enabled = true; // Réactiver les contrôles d'orbite après la fermeture du modal
  }

  /**
   * Toggle de l'animation (pause/démarrage)
   */
  toggleAnimation(): void {
    this.isPaused = !this.isPaused;
  }

  /**
   * Mise à jour de la vitesse d'animation
   */
  updateSpeed(): void {
    // La vitesse d'animation est déjà prise en compte dans la méthode animate()
  }

  /**
   * Animation de la scène
   */
  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());

    if (!this.isPaused) {
      // Mise à jour des rotations des orbites des planètes
      this.celestialBodies.forEach(body => {
        body.orbit.rotation.y += (body.data.lambda / 100000) * this.animationSpeed;
        body.orbit.rotation.x = (body.data.phi / 10000) * this.animationSpeed;
      });

      // Rotation du Soleil
      const sun = this.scene.children.find(child =>
        child instanceof THREE.Mesh &&
        (child as THREE.Mesh).geometry instanceof THREE.SphereGeometry &&
        ((child as THREE.Mesh).geometry as THREE.SphereGeometry).parameters.radius === 3
      ) as THREE.Mesh;
      if (sun) {
        sun.rotation.y += 0.005 * this.animationSpeed;
      }

      // Mise à jour des contrôles et rendu
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }
  }

  /**
   * Centrer la caméra sur une planète sélectionnée depuis le sélecteur
   */
  focusOnPlanet(): void {
    if (this.selectedPlanetName) {
      const body = this.celestialBodies.find(b => b.data.name === this.selectedPlanetName);
      if (body) {
        this.moveCameraToPlanet(body.planet);
      }
    }
  }

  /**
   * Lecture de la musique de fond (Optionnel)
   */
  private playBackgroundMusic(): void {
    if (this.backgroundMusic && this.backgroundMusic.nativeElement) {
      this.backgroundMusic.nativeElement.volume = 0.5; // Régler le volume selon vos préférences
      this.backgroundMusic.nativeElement.play().catch(error => {
        console.error('Erreur lors de la lecture de la musique de fond:', error);
      });
    }
  }
  loadNearEarthComets(): void {
    this.apiService.getNearEarthComets().subscribe({
      next: (data) => {
        this.nearEarthComets = data;
        console.log(this.nearEarthComets); // Vérifiez que vous obtenez des données ici
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des comètes:', error);
        alert(`Erreur: ${error.message || 'Une erreur inconnue s\'est produite.'}`);
      }
    });
  }
  // Variables for the comet modal
cometModalVisible: boolean = false;
selectedComet: any = null;

showCometModal(comet: any): void {
  this.selectedComet = comet;
  this.cometModalVisible = true;
}

closeCometModal(): void {
  this.cometModalVisible = false;
}
// Initialize chart data
private initializeChartData(): void {
  this.chartData = {
    labels: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter'],
    datasets: [
      {
        label: 'Distance from Sun (Million km)',
        data: [57.91, 108.2, 149.6, 227.9, 778.5],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };
}

// Create the chart
private createChart(): void {
  const ctx = document.getElementById('myChart') as HTMLCanvasElement;
  new Chart(ctx, {
    type: 'bar', // Can be 'bar', 'line', 'pie', etc.
    data: this.chartData,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}




}

