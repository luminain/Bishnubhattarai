import { Suspense, useLayoutEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Environment, Html, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ArrowRight, EyeOff, Phone, Rotate3D, Sparkles, Wifi } from "lucide-react";
import { HOME } from "@/constants/testIds";
import { Concierge } from "@/lib/api";

const CADILLAC_MODEL_PATH = "/models/cadillac_xt6.glb";

const Hotspot = ({ top, left, label, desc, icon: Icon, testId, delay = 0 }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute pointer-events-auto" style={{ top, left, transform: "translate(-50%, -50%)" }}>
      <button
        onClick={() => setOpen((value) => !value)}
        className="relative h-7 w-7 rounded-full border border-[#B08D57] bg-[#07080A]/70 backdrop-blur-sm flex items-center justify-center hotspot-dot"
        data-testid={testId}
        aria-label={label}
        style={{ animationDelay: delay + "s" }}
      >
        <span className="h-2 w-2 rounded-full bg-[#B08D57]" />
      </button>
      <div
        className={
          "absolute left-10 top-1/2 -translate-y-1/2 w-64 transition-all duration-300 z-20 " +
          (open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none")
        }
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

const CarLoadingSkeleton = () => (
  <group position={[0, -0.12, 0]}>
    <mesh position={[0, 0.38, 0]}>
      <boxGeometry args={[3.8, 0.62, 1.35]} />
      <meshStandardMaterial color="#11151d" wireframe transparent opacity={0.42} />
    </mesh>
    <mesh position={[-0.2, 0.9, 0]}>
      <boxGeometry args={[2.2, 0.52, 1.12]} />
      <meshStandardMaterial color="#1a2030" wireframe transparent opacity={0.32} />
    </mesh>
    {[
      [1.15, 0.02, 0.72],
      [1.15, 0.02, -0.72],
      [-1.15, 0.02, 0.72],
      [-1.15, 0.02, -0.72],
    ].map((position) => (
      <mesh key={position.join("-")} position={position} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.035, 12, 48]} />
        <meshStandardMaterial color="#B08D57" transparent opacity={0.55} />
      </mesh>
    ))}
    <Html center position={[0, 1.75, 0]} transform distanceFactor={7}>
      <div className="rounded-full border border-[#B08D57]/35 bg-[#07080A]/80 px-5 py-2 text-center backdrop-blur-md shadow-[0_0_40px_rgba(176,141,87,0.16)]">
        <div className="font-serif text-sm tracking-[0.16em] uppercase text-[#E7EBF2] whitespace-nowrap">
          Loading Cadillac XT6...
        </div>
      </div>
    </Html>
  </group>
);

const CadillacModel = () => {
  const { scene } = useGLTF(CADILLAC_MODEL_PATH);
  const model = useMemo(() => scene.clone(true), [scene]);

  useLayoutEffect(() => {
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    box.getSize(size);

    const longestSide = Math.max(size.x, size.y, size.z) || 1;
    const scale = 4.65 / longestSide;
    model.scale.setScalar(scale);

    const scaledBox = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    scaledBox.getCenter(center);
    model.position.sub(center);

    const groundedBox = new THREE.Box3().setFromObject(model);
    model.position.y -= groundedBox.min.y;
    model.rotation.y = -Math.PI / 8;

    const bodyBlack = new THREE.Color(0x050609);
    model.traverse((object) => {
      if (!object.isMesh) return;

      object.castShadow = true;
      object.receiveShadow = true;

      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        if (!material) return;

        if (material.color && !material.transparent) {
          const luminance = 0.299 * material.color.r + 0.587 * material.color.g + 0.114 * material.color.b;
          if (luminance > 0.48) {
            material.color = bodyBlack.clone();
            if ("metalness" in material) material.metalness = 0.92;
            if ("roughness" in material) material.roughness = 0.24;
            if ("clearcoat" in material) material.clearcoat = 1;
            if ("clearcoatRoughness" in material) material.clearcoatRoughness = 0.08;
          }
        }

        if ("envMapIntensity" in material) material.envMapIntensity = 1.75;
        material.needsUpdate = true;
      });
    });
  }, [model]);

  return <primitive object={model} />;
};

const StudioFloor = () => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <circleGeometry args={[5.8, 96]} />
      <meshStandardMaterial color="#08090c" roughness={0.72} metalness={0.18} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]}>
      <ringGeometry args={[2.2, 2.24, 128]} />
      <meshBasicMaterial color="#B08D57" transparent opacity={0.22} />
    </mesh>
  </group>
);

const CadillacShowcaseCanvas = () => {
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      camera={{ position: [4.6, 2.15, 6.2], fov: 34, near: 0.1, far: 80 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl, scene }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        scene.background = null;
      }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 7, 5]} intensity={1.7} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-5, 4, -4]} intensity={0.85} color="#b9c7e0" />
      <spotLight position={[-5, 5, -3]} angle={0.45} penumbra={0.65} intensity={2.2} color="#B08D57" />
      <pointLight position={[0, 3.5, 4]} intensity={0.65} color="#ffe7a8" />
      <Environment preset="city" />
      <StudioFloor />
      <Suspense fallback={<CarLoadingSkeleton />}>
        <CadillacModel />
      </Suspense>
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.06}
        autoRotate={autoRotate}
        autoRotateSpeed={0.5}
        enablePan={false}
        minDistance={4.4}
        maxDistance={8.8}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 2}
        target={[0, 0.72, 0]}
        onStart={() => setAutoRotate(false)}
      />
    </Canvas>
  );
};

useGLTF.preload(CADILLAC_MODEL_PATH);

export const HeroCadillac3D = () => {
  return (
    <section className="relative min-h-[100vh] hero-radial pt-[88px] pb-16 overflow-hidden">
      <div className="noise-overlay" />
      <div className="absolute inset-x-0 top-24 mx-auto h-[560px] max-w-7xl rounded-[48px] bg-[radial-gradient(circle_at_70%_45%,rgba(176,141,87,0.18),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_45%)] blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center min-h-[80vh]">
        <div className="lg:col-span-5 z-20">
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
              href={"tel:" + Concierge.phoneRaw}
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

        <div className="lg:col-span-7 relative z-10 h-[460px] sm:h-[560px] lg:h-[660px]">
          <div className="absolute inset-0 rounded-[34px] border border-white/10 bg-[#07080A]/35 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-sm overflow-hidden">
            <div className="absolute left-6 top-6 z-10 flex items-center gap-2 rounded-full border border-[#B08D57]/25 bg-[#07080A]/65 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[#D8C39A] backdrop-blur-md">
              <Rotate3D size={14} /> Drag to explore 360
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(176,141,87,0.18),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent_46%)]" />
            <div className="relative h-full w-full">
              <CadillacShowcaseCanvas />
            </div>
          </div>

          <div className="absolute inset-0 pointer-events-none">
            <Hotspot top="38%" left="32%" label="Hand-stitched leather" desc="Semi-aniline Sedona leather captain's chairs, heated & cooled." icon={Sparkles} testId="hero-hotspot-leather" delay={0.2} />
            <Hotspot top="30%" left="58%" label="In-car Wi-Fi & charging" desc="Onboard Wi-Fi hotspot, wireless & USB-C fast charging at every seat." icon={Wifi} testId="hero-hotspot-wifi" delay={0.7} />
            <Hotspot top="55%" left="76%" label="Privacy glass" desc="Limo-grade rear tint with full privacy partition on request." icon={EyeOff} testId="hero-hotspot-privacy" delay={1.2} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#07080A] pointer-events-none" />
    </section>
  );
};
