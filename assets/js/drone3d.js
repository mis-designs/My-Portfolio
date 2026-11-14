// Realistic 3D drone that hovers over the animated map (generic design, no brand).
import * as THREE from "three";
import { RoomEnvironment } from "/assets/vendor/three/addons/RoomEnvironment.js";
import { RoundedBoxGeometry } from "/assets/vendor/three/addons/RoundedBoxGeometry.js";

const frame = document.querySelector(".map-frame");
const anchor = document.getElementById("map-drone");
const canvas = document.getElementById("drone3d");
if (frame && anchor && canvas) init();

function init() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.92;
  renderer.shadowMap.enabled = false;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 4.6, 5.4).setLength(10.2); // far enough that the full drone always fits, at any heading
  camera.lookAt(0, 0, 0);

  const key = new THREE.DirectionalLight(0xffffff, 1.8);
  key.position.set(3, 6, 4);
  scene.add(key, new THREE.HemisphereLight(0xdfe8ff, 0x3a3f47, 0.9));

  // ---------- materials ----------
  const shell = new THREE.MeshPhysicalMaterial({ color: 0x9aa1aa, metalness: 0.35, roughness: 0.32, clearcoat: 0.8, clearcoatRoughness: 0.18 });
  const shellLight = new THREE.MeshPhysicalMaterial({ color: 0xb4bac2, metalness: 0.3, roughness: 0.3, clearcoat: 0.7, clearcoatRoughness: 0.2 });
  const graphite = new THREE.MeshStandardMaterial({ color: 0x2a2e35, metalness: 0.5, roughness: 0.4 });
  const black = new THREE.MeshStandardMaterial({ color: 0x0f1115, metalness: 0.3, roughness: 0.3 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x04060a, metalness: 0.95, roughness: 0.04, clearcoat: 1 });
  const lensTint = new THREE.MeshStandardMaterial({ color: 0x3b5bff, emissive: 0x2440cc, emissiveIntensity: 0.9, metalness: 0.8, roughness: 0.2 });
  const led = new THREE.MeshStandardMaterial({ color: 0x7fe3c6, emissive: 0x7fe3c6, emissiveIntensity: 3 });
  const bladeMat = new THREE.MeshStandardMaterial({ color: 0x15181d, roughness: 0.35, transparent: true, opacity: 0.55 });

  // Motion-blur texture for spinning propellers
  const bc = document.createElement("canvas"); bc.width = bc.height = 256;
  const g = bc.getContext("2d");
  const grd = g.createRadialGradient(128, 128, 10, 128, 128, 126);
  grd.addColorStop(0, "rgba(30,34,40,0)"); grd.addColorStop(0.18, "rgba(30,34,40,.35)");
  grd.addColorStop(0.8, "rgba(30,34,40,.22)"); grd.addColorStop(0.93, "rgba(107,139,255,.35)"); grd.addColorStop(1, "rgba(30,34,40,0)");
  g.fillStyle = grd; g.beginPath(); g.arc(128, 128, 126, 0, Math.PI * 2); g.fill();
  const blurTex = new THREE.CanvasTexture(bc); blurTex.colorSpace = THREE.SRGBColorSpace;
  const blur = new THREE.MeshBasicMaterial({ map: blurTex, transparent: true, depthWrite: false, side: THREE.DoubleSide });

  const drone = new THREE.Group();
  scene.add(drone);

  // Aerodynamic fuselage (capsules)
  const fus = new THREE.Mesh(new THREE.CapsuleGeometry(0.36, 0.9, 12, 32), shell);
  fus.rotation.x = Math.PI / 2; fus.scale.set(1.15, 1, 0.62);
  const cover = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.7, 10, 32), shellLight);
  cover.rotation.x = Math.PI / 2; cover.scale.set(1.05, 1, 0.5); cover.position.set(0, 0.1, -0.05);
  drone.add(fus, cover);
  for (let i = 0; i < 4; i++) {
    const slat = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.03, 0.035, 2, 0.012), graphite);
    slat.position.set(0, 0.255, 0.05 - i * 0.075);
    drone.add(slat);
  }
  const nose = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.16, 0.14, 4, 0.06), graphite);
  nose.position.set(0, 0.0, 0.66);
  drone.add(nose);
  [-0.15, 0.15].forEach((x) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.055, 24, 16), glass);
    eye.position.set(x, 0.02, 0.73);
    drone.add(eye);
  });

  // Gimbal + camera under the nose
  const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.12, 20), black);
  mount.position.set(0, -0.2, 0.55);
  const cam = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.26, 0.28, 5, 0.09), graphite);
  cam.position.set(0, -0.32, 0.6);
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 0.07, 32), glass);
  lens.rotation.x = Math.PI / 2; lens.position.set(0, -0.32, 0.75);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.012, 12, 40), lensTint);
  ring.position.set(0, -0.32, 0.785);
  drone.add(mount, cam, lens, ring);

  // Folding arms (front high, rear low), motors and spinning props
  const props = [];
  const armDefs = [
    { s: [0.32, 0.04, 0.42], e: [1.0, 0.1, 0.78] }, { s: [-0.32, 0.04, 0.42], e: [-1.0, 0.1, 0.78] },
    { s: [0.3, -0.06, -0.42], e: [1.02, -0.02, -0.86] }, { s: [-0.3, -0.06, -0.42], e: [-1.02, -0.02, -0.86] },
  ];
  armDefs.forEach((d, i) => {
    const start = new THREE.Vector3(...d.s), end = new THREE.Vector3(...d.e);
    const arm = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.07, start.distanceTo(end), 3, 0.03), shell);
    arm.position.copy(start).lerp(end, 0.5); arm.lookAt(end);
    const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.17, 32), graphite);
    motor.position.set(d.e[0], d.e[1] + 0.05, d.e[2]);
    const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.11, 0.05, 32), shellLight);
    bell.position.set(d.e[0], d.e[1] + 0.155, d.e[2]);
    const foot = new THREE.Mesh(new RoundedBoxGeometry(0.06, 0.2, 0.09, 2, 0.025), graphite);
    foot.position.set(d.e[0], d.e[1] - 0.12, d.e[2]);
    drone.add(arm, motor, bell, foot);

    const prop = new THREE.Group();
    prop.position.set(d.e[0], d.e[1] + 0.2, d.e[2]);
    for (let b = 0; b < 2; b++) {
      const blade = new THREE.Mesh(new RoundedBoxGeometry(0.44, 0.012, 0.07, 2, 0.006), bladeMat);
      blade.position.x = 0.23; blade.rotation.x = 0.14;
      const holder = new THREE.Group(); holder.rotation.y = b * Math.PI; holder.add(blade);
      prop.add(holder);
    }
    const disc = new THREE.Mesh(new THREE.CircleGeometry(0.48, 64), blur);
    disc.rotation.x = -Math.PI / 2;
    prop.add(disc);
    prop.userData.dir = i % 3 === 0 ? 1 : -1;
    drone.add(prop);
    props.push(prop);
  });

  const tail = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 16), led);
  tail.position.set(0, 0.05, -0.75);
  drone.add(tail);
  drone.scale.setScalar(1.15);

  // ---------- sizing & placement ----------
  let size = 0;
  function resize() {
    const s = Math.round(Math.max(190, Math.min(460, frame.clientWidth * 0.52)));
    if (s === size) return;
    size = s;
    canvas.style.width = canvas.style.height = s + "px";
    renderer.setSize(s, s, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  let last = null, yaw = 0, targetYaw = 0, bank = 0, visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(frame);
  const clock = new THREE.Clock();

  function tick() {
    requestAnimationFrame(tick);
    if (!visible) return;
    const t = clock.getElapsedTime();
    const fr = frame.getBoundingClientRect();
    const ar = anchor.getBoundingClientRect();
    const x = ar.left + ar.width / 2 - fr.left;
    const y = ar.top + ar.height / 2 - fr.top;
    if (last) {
      const dx = x - last.x, dy = y - last.y;
      if (Math.hypot(dx, dy) > 0.6) targetYaw = Math.atan2(dx, dy);
    }
    last = { x, y };
    let diff = targetYaw - yaw;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    yaw += diff * 0.12;
    bank += (Math.max(-0.35, Math.min(0.35, diff * 1.4)) - bank) * 0.1;
    const lift = reduce ? 0 : Math.sin(t * 2.1) * 6;
    // keep the whole drone on screen (small phones): clamp its visible extent to the viewport
    const half = size * 0.4, pad = 6;
    const minX = pad + half - fr.left, maxX = window.innerWidth - pad - half - fr.left;
    const cx = minX < maxX ? Math.min(maxX, Math.max(minX, x)) : x;
    canvas.style.transform = "translate(" + (cx - size / 2).toFixed(1) + "px," + (y - size * 0.68 + lift).toFixed(1) + "px)";
    drone.rotation.set(0.08, yaw, bank);
    if (!reduce) props.forEach((p) => { p.rotation.y += 0.9 * p.userData.dir; });
    renderer.render(scene, camera);
  }
  frame.classList.add("has-3d");
  tick();
}
