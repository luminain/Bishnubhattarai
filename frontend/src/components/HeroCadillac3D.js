/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { ArrowRight, Phone, Sparkles, Wifi, EyeOff } from "lucide-react";
import { HOME } from "@/constants/testIds";
import { Concierge } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

/* ---------- Build a stylized 2024 Cadillac XT6 (black luxury crossover) ---------- */
const buildLuxurySUV = () => {
  const car = new THREE.Group();
  const bodyColor = 0x06070a;       // Cadillac "Stellar Black Metallic"
  const chromeColor = 0xc6ccd6;     // bright chrome trim
  const glassColor = 0x0a0f15;
  const bronze = 0xb08d57;          // bronze grille accent

  const physicalMat = (color, extras = {}) =>
    new THREE.MeshPhysicalMaterial({
      color, metalness: 0.95, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08,
      envMapIntensity: 1.4, ...extras,
    });
  const stdMat = (color, opts = {}) =>
    new THREE.MeshStandardMaterial({ color, metalness: 0.6, roughness: 0.5, ...opts });

  const addMesh = (geo, mat, pos = [0, 0, 0], rot = [0, 0, 0], parent = car) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(...pos);
    m.rotation.set(...rot);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  };

  // ---- XT6 proportions: slightly shorter & lower than Escalade, crossover stance
  // Wheelbase ~ 4.0, ride height lower, sleeker greenhouse
  // Chassis / lower skirt
  addMesh(new THREE.BoxGeometry(4.1, 0.32, 1.66), stdMat(0x0f1216), [0, 0.22, 0]);
  // Main body (lower than Escalade)
  addMesh(new THREE.BoxGeometry(3.95, 0.7, 1.64), physicalMat(bodyColor), [0, 0.65, 0]);
  // Greenhouse — XT6 has a more sloped, sleeker roofline
  addMesh(new THREE.BoxGeometry(2.55, 0.45, 1.46), physicalMat(bodyColor), [-0.1, 1.13, 0]);
  // Front A-pillar slope (more raked than Escalade)
  addMesh(new THREE.BoxGeometry(0.65, 0.4, 1.46), physicalMat(bodyColor), [1.3, 1.0, 0], [0, 0, -0.55]);
  // Rear D-pillar (slight slope back)
  addMesh(new THREE.BoxGeometry(0.55, 0.4, 1.46), physicalMat(bodyColor), [-1.45, 1.0, 0], [0, 0, 0.42]);

  // Windshield (steeply raked)
  addMesh(
    new THREE.BoxGeometry(0.6, 0.46, 1.4),
    new THREE.MeshPhysicalMaterial({ color: glassColor, metalness: 0.4, roughness: 0.05, transmission: 0.55, thickness: 0.4, envMapIntensity: 1.8 }),
    [1.05, 1.08, 0], [0, 0, -0.55]
  );
  // Side glass panels (3-row windows)
  const sideGlassMat = new THREE.MeshPhysicalMaterial({ color: glassColor, metalness: 0.4, roughness: 0.05, transmission: 0.4, envMapIntensity: 1.6 });
  addMesh(new THREE.BoxGeometry(2.45, 0.4, 0.02), sideGlassMat, [-0.1, 1.15, 0.76]);
  addMesh(new THREE.BoxGeometry(2.45, 0.4, 0.02), sideGlassMat, [-0.1, 1.15, -0.76]);
  // Rear glass (steeper than Escalade)
  addMesh(
    new THREE.BoxGeometry(0.55, 0.45, 1.4),
    new THREE.MeshPhysicalMaterial({ color: glassColor, metalness: 0.4, roughness: 0.05, transmission: 0.45, envMapIntensity: 1.8 }),
    [-1.25, 1.08, 0], [0, 0, 0.45]
  );

  // ---- XT6 signature front: large vertical chrome grille with bronze accent
  // Main grille shell (chrome surround)
  addMesh(
    new THREE.BoxGeometry(0.04, 0.5, 1.1),
    new THREE.MeshStandardMaterial({ color: chromeColor, metalness: 1, roughness: 0.12 }),
    [2.0, 0.65, 0]
  );
  // Inner grille (bronze brand accent)
  addMesh(
    new THREE.BoxGeometry(0.05, 0.36, 0.95),
    new THREE.MeshStandardMaterial({ color: bronze, metalness: 1, roughness: 0.18, emissive: bronze, emissiveIntensity: 0.06 }),
    [2.01, 0.65, 0]
  );
  // Vertical grille slats (8 thin chrome ribs)
  const slatMat = new THREE.MeshStandardMaterial({ color: 0x222730, metalness: 0.9, roughness: 0.3 });
  for (let i = 0; i < 8; i++) {
    const z = -0.42 + i * 0.12;
    addMesh(new THREE.BoxGeometry(0.02, 0.32, 0.025), slatMat, [2.03, 0.65, z]);
  }
  // Cadillac crest plaque
  addMesh(
    new THREE.BoxGeometry(0.05, 0.12, 0.16),
    new THREE.MeshStandardMaterial({ color: chromeColor, metalness: 1, roughness: 0.1 }),
    [2.04, 0.95, 0]
  );

  // Bumpers
  const chromeMat = new THREE.MeshStandardMaterial({ color: chromeColor, metalness: 1, roughness: 0.18 });
  addMesh(new THREE.BoxGeometry(0.06, 0.18, 1.55), chromeMat, [2.04, 0.32, 0]);
  addMesh(new THREE.BoxGeometry(0.06, 0.18, 1.55), chromeMat, [-2.04, 0.32, 0]);

  // ---- XT6 signature vertical LED headlights (slim, tall)
  const headMat = new THREE.MeshStandardMaterial({ color: 0xfff6d6, emissive: 0xffe7a8, emissiveIntensity: 1.3 });
  // Upper horizontal lamp
  addMesh(new THREE.BoxGeometry(0.04, 0.1, 0.32), headMat, [2.02, 0.92, 0.55]);
  addMesh(new THREE.BoxGeometry(0.04, 0.1, 0.32), headMat, [2.02, 0.92, -0.55]);
  // Vertical signature DRL strip (XT6 hallmark)
  addMesh(new THREE.BoxGeometry(0.04, 0.45, 0.05), headMat, [2.02, 0.65, 0.66]);
  addMesh(new THREE.BoxGeometry(0.04, 0.45, 0.05), headMat, [2.02, 0.65, -0.66]);

  // ---- Vertical LED tail lights (XT6 signature)
  const tailMat = new THREE.MeshStandardMaterial({ color: 0x5a0a0a, emissive: 0xe03030, emissiveIntensity: 0.55 });
  addMesh(new THREE.BoxGeometry(0.04, 0.55, 0.06), tailMat, [-2.02, 0.7, 0.7]);
  addMesh(new THREE.BoxGeometry(0.04, 0.55, 0.06), tailMat, [-2.02, 0.7, -0.7]);
  // Small upper tail bar
  addMesh(new THREE.BoxGeometry(0.04, 0.06, 0.32), tailMat, [-2.02, 0.95, 0.55]);
  addMesh(new THREE.BoxGeometry(0.04, 0.06, 0.32), tailMat, [-2.02, 0.95, -0.55]);

  // Side chrome belt-line trim
  addMesh(new THREE.BoxGeometry(3.85, 0.035, 0.02), chromeMat, [0, 0.5, 0.82]);
  addMesh(new THREE.BoxGeometry(3.85, 0.035, 0.02), chromeMat, [0, 0.5, -0.82]);
  // Window chrome surround (top)
  addMesh(new THREE.BoxGeometry(2.55, 0.025, 0.02), chromeMat, [-0.1, 1.36, 0.77]);
  addMesh(new THREE.BoxGeometry(2.55, 0.025, 0.02), chromeMat, [-0.1, 1.36, -0.77]);

  // Roof rails (XT6 has subtle chrome rails)
  const railMat = new THREE.MeshStandardMaterial({ color: chromeColor, metalness: 0.95, roughness: 0.25 });
  addMesh(new THREE.BoxGeometry(2.5, 0.04, 0.05), railMat, [-0.1, 1.39, 0.72]);
  addMesh(new THREE.BoxGeometry(2.5, 0.04, 0.05), railMat, [-0.1, 1.39, -0.72]);

  // ---- Wheels — XT6 20" alloys
  const wheelPositions = [
    [1.32, 0.32, 0.84], [1.32, 0.32, -0.84], [-1.32, 0.32, 0.84], [-1.32, 0.32, -0.84],
  ];
  wheelPositions.forEach((p) => {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(...p);
    const tire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 0.26, 28),
      new THREE.MeshStandardMaterial({ color: 0x0a0b0e, metalness: 0.4, roughness: 0.7 })
    );
    tire.rotation.x = Math.PI / 2;
    tire.castShadow = true;
    const rim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.27, 0.27, 0.28, 28),
      new THREE.MeshStandardMaterial({ color: chromeColor, metalness: 1, roughness: 0.18 })
    );
    rim.rotation.x = Math.PI / 2;
    // 5-spoke detail
    for (let s = 0; s < 5; s++) {
      const spoke = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.32, 0.04),
        new THREE.MeshStandardMaterial({ color: 0x1a1f28, metalness: 0.8, roughness: 0.4 })
      );
      spoke.rotation.x = Math.PI / 2;
      spoke.rotation.y = (s / 5) * Math.PI * 2;
      wheelGroup.add(spoke);
    }
    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.3, 16),
      new THREE.MeshStandardMaterial({ color: bronze, metalness: 1, roughness: 0.2 })
    );
    hub.rotation.x = Math.PI / 2;
    wheelGroup.add(tire, rim, hub);
    car.add(wheelGroup);
  });

  car.position.y = -0.45;
  car.scale.setScalar(1.05);
  return car;
};

/* ---------- Hotspot overlay ---------- */
const Hotspot = ({ top, left, label, desc, icon: Icon, testId, delay = 0 }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="absolute pointer-events-auto" style={{ top, left, transform: "translate(-50%, -50%)" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative h-7 w-7 rounded-full border border-[#B08D57] bg-[#07080A]/70 backdrop-blur-sm flex items-center justify-center hotspot-dot"
        data-testid={testId}
        aria-label={label}
        style={{ animationDelay: `${delay}s` }}
      >
        <span className="h-2 w-2 rounded-full bg-[#B08D57]" />
      </button>
      <div
        className={`absolute left-10 top-1/2 -translate-y-1/2 w-64 transition-all duration-300 z-20 ${
          open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"
        }`}
      >
        <div className="card-lux p-4">
          <div className="flex items-center gap-2">
            <Icon size={16} className="text-[#B08D57]" />
            <div className="font-serif text-base text-[#E7EBF2]">{label}</div>
          </div>
          <div className="mt-1.5 text-xs text-[#C9D0DB] leading-relaxed">{desc}</div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Hero Component (vanilla three.js setup) ---------- */
export const HeroCadillac3D = () => {
  const heroRef = useRef(null);
  const mountRef = useRef(null);
  const copyRef = useRef(null);
  const subRef = useRef(null);
  const carRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const [supportsWebGL, setSupportsWebGL] = useState(true);

  // Init three.js
  useEffect(() => {
    if (!mountRef.current) return;
    let canvasOK = true;
    try {
      const t = document.createElement("canvas");
      canvasOK = !!(t.getContext("webgl2") || t.getContext("webgl"));
    } catch (e) { canvasOK = false; }
    setSupportsWebGL(canvasOK);
    if (!canvasOK) return;

    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(5.5, 2.1, 6.2);
    camera.lookAt(0, 0.6, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Environment map for PBR reflections (procedural room)
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTex = pmrem.fromScene(roomEnv, 0.04).texture;
    scene.environment = envTex;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xfff1d6, 1.6);
    key.position.set(6, 8, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 30;
    key.shadow.camera.left = -6; key.shadow.camera.right = 6;
    key.shadow.camera.top = 6; key.shadow.camera.bottom = -6;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xb9c7e0, 0.9);
    fill.position.set(-6, 5, -3);
    scene.add(fill);
    const rim = new THREE.SpotLight(0xb08d57, 2.2, 30, 0.5, 0.6);
    rim.position.set(-8, 6, -5);
    scene.add(rim);
    const point = new THREE.PointLight(0xffe7a8, 0.8, 20);
    point.position.set(0, 4, 5);
    scene.add(point);
    // Soft ground-bounce light
    const hemi = new THREE.HemisphereLight(0xe7c892, 0x0a0b0e, 0.35);
    scene.add(hemi);

    // Ground / contact shadow plane (soft dark)
    const groundGeo = new THREE.CircleGeometry(8, 64);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x0a0b0e, metalness: 0.2, roughness: 0.85 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);
    // Soft fade circle around car using transparent gradient sprite
    // (skipped to keep it simple)

    // Car
    const car = buildLuxurySUV();
    scene.add(car);
    carRef.current = car;

    // Render loop
    let raf;
    let lastTime = performance.now();
    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (!car.userData.scrubbing) {
        car.rotation.y += dt * 0.18;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Resize
    const onResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // GSAP scroll-driven scene only (no entrance fades on text - prevents hidden-state issues)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (!reduce) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "+=1600",
            scrub: 1.0,
          },
          onStart: () => { car.userData.scrubbing = true; },
          onComplete: () => { car.userData.scrubbing = false; },
          onReverseComplete: () => { car.userData.scrubbing = false; },
        });
        tl.to(car.rotation, { y: Math.PI * 1.5, ease: "none" }, 0);
        tl.to(camera.position, { x: -0.8, y: 1.7, z: 5.4, ease: "none" }, 0)
          .to(camera.position, { x: 3.2, y: 2.2, z: 6.0, ease: "none" }, 0.5);
      }
    }, heroRef);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      ctx.revert();
      // Cleanup three.js
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose?.();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose?.());
        }
      });
      pmrem.dispose?.();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[100vh] hero-radial pt-[88px] pb-16 overflow-hidden">
      <div className="noise-overlay" />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center min-h-[80vh]">
        {/* Editorial copy */}
        <div className="lg:col-span-5 z-10">
          <div className="lux-kicker">Bay Area · Private Chauffeur · Cadillac XT6</div>
          <h1 className="font-serif mt-4 text-4xl sm:text-5xl lg:text-[68px] leading-[1.02] tracking-[-0.02em] text-[#E7EBF2] animate-fade-up">
            The Cadillac XT6. <br />
            <span className="italic text-[#B08D57]">Quiet precision.</span> <br />
            On your schedule.
          </h1>
          <p className="mt-6 text-[15px] sm:text-base text-[#C9D0DB] max-w-xl leading-relaxed animate-fade-up-delay">
            A blacked-out 2024 Cadillac XT6 Premium Luxury — three rows, Super Cruise, AKG Studio audio.
            SFO · OAK · SJC airports, Napa & Sonoma wine country, executive transfers and white-glove
            events — with the discretion of a private driver.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/book"
              className="btn-lux-primary inline-flex items-center justify-center gap-2 h-12 px-7 rounded-md text-sm"
              data-testid={HOME.heroBookBtn}
            >
              Book a ride <ArrowRight size={16} />
            </Link>
            <a
              href={`tel:${Concierge.phoneRaw}`}
              className="btn-lux-secondary inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md text-sm"
              data-testid={HOME.heroConciergeBtn}
            >
              <Phone size={15} className="text-[#B08D57]" /> Concierge
            </a>
          </div>
          <div className="mt-10 flex items-center gap-6">
            <div>
              <div className="font-serif text-2xl text-[#E7EBF2]">12+ yrs</div>
              <div className="text-[11px] tracking-[0.22em] uppercase text-[#9AA3B2]">Bay Area roads</div>
            </div>
            <div className="h-10 w-px bg-[#232A36]" />
            <div>
              <div className="font-serif text-2xl text-[#E7EBF2]">5.0★</div>
              <div className="text-[11px] tracking-[0.22em] uppercase text-[#9AA3B2]">Avg. rating</div>
            </div>
            <div className="h-10 w-px bg-[#232A36]" />
            <div>
              <div className="font-serif text-2xl text-[#E7EBF2]">24/7</div>
              <div className="text-[11px] tracking-[0.22em] uppercase text-[#9AA3B2]">Concierge</div>
            </div>
          </div>
        </div>

        {/* 3D Canvas mount with hotspot overlays */}
        <div className="lg:col-span-7 relative h-[420px] sm:h-[520px] lg:h-[640px]">
          {supportsWebGL ? (
            <div ref={mountRef} className="absolute inset-0" />
          ) : (
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                backgroundImage: "url(https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0?auto=format&fit=crop&w=1600&q=85)",
                backgroundSize: "cover", backgroundPosition: "center",
              }}
            />
          )}
          {/* Hotspot overlays */}
          <div className="absolute inset-0 pointer-events-none">
            <Hotspot top="38%" left="32%" label="Hand-stitched leather" desc="Semi-aniline Sedona leather captain's chairs, heated & cooled." icon={Sparkles} testId="hero-hotspot-leather" delay={0.2} />
            <Hotspot top="30%" left="58%" label="In-car Wi-Fi & charging" desc="Onboard Wi-Fi hotspot, wireless & USB-C fast charging at every seat." icon={Wifi} testId="hero-hotspot-wifi" delay={0.7} />
            <Hotspot top="55%" left="76%" label="Privacy glass" desc="Limo-grade rear tint with full privacy partition on request." icon={EyeOff} testId="hero-hotspot-privacy" delay={1.2} />
          </div>
        </div>
      </div>

      {/* Section edge fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#07080A] pointer-events-none" />
    </section>
  );
};
