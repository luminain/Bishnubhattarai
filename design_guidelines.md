{
  "brand": {
    "name": "Bishnu Bhattarai — Private Chauffeur",
    "voice": [
      "cinematic",
      "restrained luxury",
      "quiet confidence",
      "executive-grade",
      "Bay Area premium"
    ],
    "positioning_notes": "Feels like a private driver for Aman / Mandarin Oriental clientele — not rideshare. Dark-only UI, editorial typography, chrome + muted bronze accents, high whitespace, precise motion."
  },
  "design_tokens": {
    "color_system": {
      "mode": "dark-only",
      "hex": {
        "obsidian": {
          "bg": "#07080A",
          "bg2": "#0B0D10",
          "surface": "#0F1216",
          "surface2": "#141922",
          "surface3": "#1A2230"
        },
        "chrome": {
          "text": "#E7EBF2",
          "text2": "#C9D0DB",
          "muted": "#9AA3B2",
          "hairline": "#232A36",
          "border": "#2A3342"
        },
        "bronze": {
          "accent": "#B08D57",
          "accent2": "#8F6E3E",
          "accentSoft": "#2A2216"
        },
        "status": {
          "success": "#2FBF8F",
          "warning": "#D6A24A",
          "danger": "#E05D5D",
          "info": "#6AA7FF"
        },
        "focus_ring": "#B08D57",
        "shadow": {
          "ambient": "rgba(0,0,0,0.55)",
          "lift": "rgba(0,0,0,0.75)"
        }
      },
      "hsl_for_shadcn_root": {
        "background": "220 20% 3%",
        "foreground": "220 18% 96%",
        "card": "220 18% 6%",
        "card-foreground": "220 18% 96%",
        "popover": "220 18% 6%",
        "popover-foreground": "220 18% 96%",
        "primary": "38 38% 52%",
        "primary-foreground": "220 20% 6%",
        "secondary": "220 16% 10%",
        "secondary-foreground": "220 18% 96%",
        "muted": "220 14% 12%",
        "muted-foreground": "220 10% 70%",
        "accent": "220 14% 12%",
        "accent-foreground": "220 18% 96%",
        "destructive": "0 70% 52%",
        "destructive-foreground": "220 18% 96%",
        "border": "220 18% 16%",
        "input": "220 18% 16%",
        "ring": "38 38% 52%",
        "radius": "0.75rem"
      },
      "gradients": {
        "allowed_usage": "Decorative overlays + hero background only (<=20% viewport). Never on text-heavy surfaces/cards.",
        "hero_backdrop": "radial-gradient(1200px 600px at 70% 20%, rgba(176,141,87,0.14), rgba(7,8,10,0) 55%), radial-gradient(900px 500px at 20% 10%, rgba(231,235,242,0.08), rgba(7,8,10,0) 60%)",
        "section_edge_fade": "linear-gradient(180deg, rgba(7,8,10,0) 0%, rgba(7,8,10,1) 70%)"
      },
      "texture": {
        "noise_overlay_css": "background-image: url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22160%22 height=%22160%22 filter=%22url(%23n)%22 opacity=%220.12%22/%3E%3C/svg%3E');",
        "usage": "Apply as a subtle overlay on hero + footer only (opacity 0.06–0.12)."
      }
    },
    "typography": {
      "google_fonts": {
        "heading_serif": {
          "name": "Cormorant Garamond",
          "weights": [400, 500, 600]
        },
        "body_sans": {
          "name": "Manrope",
          "weights": [400, 500, 600, 700]
        },
        "optional_mono": {
          "name": "IBM Plex Mono",
          "weights": [400, 500]
        }
      },
      "usage_rules": {
        "headings": "Cormorant Garamond for H1/H2/H3 only. Tight tracking, high contrast, editorial.",
        "body": "Manrope for all UI, forms, tables, helper text.",
        "numbers": "Use Manrope tabular numbers if available; otherwise use IBM Plex Mono for rate breakdown + admin stats."
      },
      "tailwind_scale": {
        "h1": "text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.02em]",
        "h2": "text-2xl sm:text-3xl font-semibold tracking-[-0.015em]",
        "h3": "text-xl sm:text-2xl font-semibold",
        "subheading": "text-base md:text-lg text-[color:var(--muted-foreground)]",
        "body": "text-sm sm:text-base leading-relaxed",
        "small": "text-xs sm:text-sm text-[color:var(--muted-foreground)]"
      }
    },
    "spacing_and_grid": {
      "rhythm": "8px base; use 24/32/40/56/72 for section spacing.",
      "container": "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
      "home_sections": "py-16 sm:py-20 lg:py-24",
      "bento_grid": "grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8",
      "cards": "p-5 sm:p-6 lg:p-7"
    },
    "radius_and_shadow": {
      "radius": {
        "sm": "rounded-md",
        "md": "rounded-xl",
        "lg": "rounded-2xl"
      },
      "shadow": {
        "card": "shadow-[0_18px_60px_rgba(0,0,0,0.55)]",
        "hover": "hover:shadow-[0_26px_80px_rgba(0,0,0,0.75)]"
      },
      "borders": "border border-[color:var(--border)]"
    }
  },
  "component_path": {
    "shadcn_primary": {
      "button": "/app/frontend/src/components/ui/button.jsx",
      "card": "/app/frontend/src/components/ui/card.jsx",
      "input": "/app/frontend/src/components/ui/input.jsx",
      "textarea": "/app/frontend/src/components/ui/textarea.jsx",
      "select": "/app/frontend/src/components/ui/select.jsx",
      "calendar": "/app/frontend/src/components/ui/calendar.jsx",
      "dialog": "/app/frontend/src/components/ui/dialog.jsx",
      "sheet": "/app/frontend/src/components/ui/sheet.jsx",
      "tabs": "/app/frontend/src/components/ui/tabs.jsx",
      "progress": "/app/frontend/src/components/ui/progress.jsx",
      "tooltip": "/app/frontend/src/components/ui/tooltip.jsx",
      "badge": "/app/frontend/src/components/ui/badge.jsx",
      "table": "/app/frontend/src/components/ui/table.jsx",
      "carousel": "/app/frontend/src/components/ui/carousel.jsx",
      "sonner_toast": "/app/frontend/src/components/ui/sonner.jsx"
    },
    "recommended_new_components_to_create": {
      "luxury_navbar": "/app/frontend/src/components/LuxNavbar.js",
      "hero_r3f": "/app/frontend/src/components/HeroCadillac3D.js",
      "hotspot": "/app/frontend/src/components/HeroHotspot.js",
      "services_bento": "/app/frontend/src/components/ServicesBento.js",
      "fleet_cards": "/app/frontend/src/components/FleetCards.js",
      "booking_stepper": "/app/frontend/src/components/BookingStepper.js",
      "rate_calculator": "/app/frontend/src/components/RateCalculator.js",
      "trust_strip": "/app/frontend/src/components/TrustStrip.js",
      "testimonial_wall": "/app/frontend/src/components/TestimonialWall.js",
      "concierge_cta": "/app/frontend/src/components/ConciergeCTA.js",
      "admin_layout": "/app/frontend/src/components/admin/AdminLayout.js",
      "admin_kpis": "/app/frontend/src/components/admin/AdminKpis.js"
    }
  },
  "ui_patterns": {
    "buttons": {
      "style": "Luxury / Elegant",
      "tokens": {
        "--btn-radius": "12px",
        "--btn-height": "44px",
        "--btn-padding-x": "18px",
        "--btn-shadow": "0 18px 60px rgba(0,0,0,0.55)",
        "--btn-shadow-hover": "0 26px 80px rgba(0,0,0,0.75)"
      },
      "variants": {
        "primary": {
          "description": "Muted bronze fill, obsidian text, subtle chrome highlight line.",
          "tailwind": "bg-[#B08D57] text-[#07080A] hover:bg-[#C19A60] focus-visible:ring-2 focus-visible:ring-[#B08D57] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080A]",
          "micro_interaction": "hover: translateY(-1px) + subtle specular sheen via pseudo-element"
        },
        "secondary": {
          "description": "Obsidian surface with chrome border; becomes slightly brighter on hover.",
          "tailwind": "bg-[#0F1216] text-[#E7EBF2] border border-[#2A3342] hover:bg-[#141922] hover:border-[#3A465B]",
          "micro_interaction": "hover: border brightens + shadow lift"
        },
        "ghost": {
          "description": "Text-only chrome with underline reveal.",
          "tailwind": "bg-transparent text-[#E7EBF2] hover:bg-white/5",
          "micro_interaction": "underline grows from left (scaleX)"
        }
      },
      "data_testid_examples": [
        "data-testid=\"hero-book-now-button\"",
        "data-testid=\"nav-concierge-button\"",
        "data-testid=\"booking-next-step-button\""
      ]
    },
    "cards": {
      "base": "bg-[#0F1216] border border-[#232A36] rounded-2xl",
      "hover": "hover:border-[#3A465B] hover:bg-[#141922]",
      "chrome_top_rule": "Add a 1px top highlight line: before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/10",
      "use_cases": [
        "service bento tiles",
        "fleet cards",
        "rate breakdown",
        "admin KPI tiles"
      ]
    },
    "forms": {
      "inputs": {
        "style": "Dark surface, chrome border, strong focus ring bronze.",
        "tailwind": "bg-[#0B0D10] border-[#2A3342] text-[#E7EBF2] placeholder:text-[#9AA3B2] focus-visible:ring-2 focus-visible:ring-[#B08D57] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080A]",
        "data_testid_examples": [
          "data-testid=\"booking-pickup-input\"",
          "data-testid=\"booking-dropoff-input\"",
          "data-testid=\"booking-flight-number-input\""
        ]
      },
      "stepper": {
        "pattern": "5-step wizard with progress + sticky summary on desktop.",
        "components": ["tabs", "progress", "card", "button"],
        "mobile": "Single-column; sticky bottom CTA bar with total + Next.",
        "desktop": "Two-column: left form, right summary card (position: sticky top-24)."
      }
    },
    "tables_admin": {
      "pattern": "Dense but breathable table with status pills + row actions.",
      "components": ["table", "badge", "dropdown-menu", "dialog"],
      "row_hover": "hover:bg-white/3",
      "status_badges": {
        "new": "bg-[#2A2216] text-[#D6A24A] border border-[#8F6E3E]",
        "confirmed": "bg-[#0E1F18] text-[#2FBF8F] border border-[#1E6B52]",
        "completed": "bg-white/5 text-[#C9D0DB] border border-[#2A3342]",
        "cancelled": "bg-[#241214] text-[#E05D5D] border border-[#7A2E35]"
      },
      "data_testid_examples": [
        "data-testid=\"admin-bookings-table\"",
        "data-testid=\"admin-booking-status-select\"",
        "data-testid=\"admin-revenue-kpi\""
      ]
    }
  },
  "motion_system": {
    "principles": [
      "Cinematic, slow-in/slow-out",
      "Motion reveals hierarchy (never decorative-only)",
      "Prefer opacity + translateY; avoid large rotations in UI",
      "Respect prefers-reduced-motion"
    ],
    "durations": {
      "micro": "120–180ms",
      "ui": "220–360ms",
      "section": "600–900ms"
    },
    "easing": {
      "standard": "cubic-bezier(0.2, 0.8, 0.2, 1)",
      "cinematic": "cubic-bezier(0.16, 1, 0.3, 1)"
    },
    "framer_patterns": {
      "reveal": "initial {opacity:0,y:14} animate {opacity:1,y:0} transition 0.7s cinematic",
      "stagger": "children stagger 0.06–0.1s"
    },
    "gsap_r3f_patterns": {
      "libraries": ["three", "@react-three/fiber", "@react-three/drei", "gsap", "@gsap/react", "gsap/ScrollTrigger"],
      "install": "npm i three @react-three/fiber @react-three/drei gsap @gsap/react",
      "scroll_sequence": [
        "0–15%: car fades in from darkness, subtle dolly-in",
        "15–45%: slow rotation to 3/4 front, hotspot 1 appears (Leather Interior)",
        "45–70%: camera slides to side profile, hotspot 2 (Wi‑Fi + Charging)",
        "70–100%: rear 3/4, hotspot 3 (Privacy Glass), CTA pulses once"
      ],
      "timeline_scaffold_js": "// inside HeroCadillac3D.js\n// gsap.registerPlugin(ScrollTrigger);\n// const tl = gsap.timeline({\n//   scrollTrigger: {\n//     trigger: heroRef.current,\n//     start: 'top top',\n//     end: '+=1800',\n//     scrub: 1,\n//     pin: true\n//   }\n// });\n// tl.to(car.rotation, { y: Math.PI * 0.65, ease: 'none' }, 0)\n//   .to(camera.position, { z: 5.2, x: 0.6, y: 1.2, ease: 'none' }, 0)\n//   .to(hotspot1Ref.current, { autoAlpha: 1, duration: 0.2 }, 0.25)\n//   .to(camera.position, { x: -0.8, z: 5.6, ease: 'none' }, 0.55)\n//   .to(hotspot2Ref.current, { autoAlpha: 1, duration: 0.2 }, 0.6)\n//   .to(car.rotation, { y: Math.PI * 1.05, ease: 'none' }, 0.75)\n//   .to(hotspot3Ref.current, { autoAlpha: 1, duration: 0.2 }, 0.8);"
    },
    "hover_micro_interactions": {
      "buttons": "hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.99]",
      "cards": "hover:-translate-y-[2px] hover:shadow-lift",
      "links": "underline reveal via background-size animation"
    }
  },
  "3d_hero_direction": {
    "scene": {
      "composition": "Car centered slightly right on desktop (to leave editorial copy left). On mobile, car centered with copy below.",
      "camera": "PerspectiveCamera fov 35–45; start z ~6.2; subtle dolly-in during first scroll segment.",
      "lighting": [
        "Key: RectAreaLight warm-neutral (bronze-tinted) from front-left",
        "Fill: soft cool light from right to bring chrome edges",
        "Rim: narrow bright strip behind to outline silhouette",
        "Environment: HDRI studio/garage for reflections"
      ],
      "materials": "PBR with clearcoat for paint; emphasize chrome reflections; keep roughness slightly higher to avoid toy-like shine.",
      "postprocessing": "Optional: mild bloom (threshold high), subtle vignette, very light DOF on desktop only.",
      "performance_fallback": {
        "device_detection": "If prefers-reduced-motion OR low-end (navigator.hardwareConcurrency <= 4) OR saveData, render static hero image + subtle parallax.",
        "fallback_asset": "Use a high-quality still (see image_urls.hero_fallback)"
      }
    },
    "hotspots": {
      "ui": "Hotspots are small chrome rings with bronze dot center; tooltip card appears on hover/tap.",
      "component": "Use shadcn Tooltip + custom hotspot button.",
      "touch": "Tap toggles tooltip; second tap closes.",
      "data_testid_examples": [
        "data-testid=\"hero-hotspot-leather\"",
        "data-testid=\"hero-hotspot-wifi\"",
        "data-testid=\"hero-hotspot-privacy\""
      ]
    }
  },
  "home_page_blueprint": {
    "layout": [
      {
        "section": "Nav",
        "goal": "Immediate trust + fast booking + concierge.",
        "structure": "Left: wordmark. Center (desktop): Services/Fleet/About. Right: Book Now + Concierge.",
        "notes": "Use Sheet for mobile menu. Keep nav background solid obsidian with 1px chrome hairline."
      },
      {
        "section": "Hero (3D pinned)",
        "goal": "Cinematic first impression + primary conversion.",
        "structure": "Two-column on desktop: editorial copy left, R3F canvas right. Pinned scroll scene with hotspots.",
        "copy": {
          "h1": "Private Chauffeur. Cadillac Luxury. Bay Area Precision.",
          "sub": "SFO / OAK / SJC • Napa & Sonoma • Corporate & Events. Discreet, punctual, impeccably maintained.",
          "ctas": ["Book a Ride", "Concierge"]
        },
        "conversion": "Primary CTA routes to /book; secondary opens WhatsApp/SMS/call sheet."
      },
      {
        "section": "Trust Strip",
        "goal": "Reduce anxiety fast.",
        "structure": "4 items: On-time guarantee, Flight tracking, Premium fleet, Discreet service.",
        "visual": "Inline icons (lucide-react) + chrome text; bronze separators."
      },
      {
        "section": "Services Bento",
        "goal": "Show breadth without clutter.",
        "structure": "Bento grid: Airport (large), Winery Tours (large), Corporate, Events, Hourly.",
        "interaction": "Hover reveals secondary line + subtle image zoom (if using background images)."
      },
      {
        "section": "Fleet Preview",
        "goal": "Sell the vehicles.",
        "structure": "Two premium cards (Escalade, CT6) with spec bullets + ‘View details’.",
        "notes": "Use AspectRatio for imagery; keep copy minimal and confident."
      },
      {
        "section": "How It Works",
        "goal": "Explain booking in 3 steps.",
        "structure": "3 cards: Request → Confirm → Ride. Add subtle timeline line."
      },
      {
        "section": "Testimonials Wall",
        "goal": "Social proof.",
        "structure": "Carousel on mobile; masonry-ish 2–3 columns on desktop.",
        "notes": "Use muted chrome text; highlight key phrases with bronze underline."
      },
      {
        "section": "Concierge CTA",
        "goal": "High-intent contact.",
        "structure": "Card with Call/SMS/WhatsApp buttons + service area chips.",
        "notes": "Use Dialog/Sheet for contact options; one-tap links."
      },
      {
        "section": "Footer",
        "goal": "Legitimacy + quick links.",
        "structure": "Columns: Services, Airports, Contact, Legal. Add subtle noise overlay."
      }
    ]
  },
  "booking_wizard_blueprint": {
    "steps": [
      {
        "name": "Service",
        "fields": ["service_type", "vehicle_preference"],
        "ui": "Cards as radio options; show starting-from price hint.",
        "data_testid": ["booking-service-option-airport", "booking-vehicle-option-escalade"]
      },
      {
        "name": "Locations",
        "fields": ["pickup", "dropoff"],
        "ui": "Two inputs + quick chips (SFO/OAK/SJC, Downtown SF, Palo Alto, Napa).",
        "data_testid": ["booking-pickup-input", "booking-dropoff-input"]
      },
      {
        "name": "Date/Time",
        "fields": ["date", "time"],
        "ui": "Use shadcn Calendar in Popover + time Select.",
        "data_testid": ["booking-date-picker", "booking-time-select"]
      },
      {
        "name": "Details",
        "fields": ["flight_number", "passengers", "luggage", "notes"],
        "ui": "Compact grid; helper text for flight tracking.",
        "data_testid": ["booking-flight-number-input", "booking-passengers-select", "booking-luggage-select", "booking-notes-textarea"]
      },
      {
        "name": "Review",
        "fields": ["summary", "contact", "payment_intent"],
        "ui": "Sticky summary card + confirm button; show cancellation policy.",
        "data_testid": ["booking-review-summary", "booking-confirm-button"]
      }
    ],
    "rate_calculator": {
      "pattern": "Live breakdown card updates as fields change.",
      "line_items": ["base", "distance/time", "airport fee", "wait time", "gratuity toggle"],
      "visual": "Use IBM Plex Mono for numbers; bronze highlight for total.",
      "data_testid": ["rate-breakdown-card", "rate-total-amount"]
    }
  },
  "admin_dashboard_blueprint": {
    "layout": "Left rail (desktop) / Sheet (mobile) + top bar with date range.",
    "kpis": ["Revenue", "Bookings", "Avg. fare", "Upcoming pickups"],
    "charts": {
      "library": "recharts",
      "install": "npm i recharts",
      "usage": "AreaChart for revenue (muted chrome stroke, bronze gradient fill at <=15% opacity).",
      "data_testid": ["admin-revenue-chart"]
    },
    "bookings_table": {
      "columns": ["Date", "Client", "Route", "Vehicle", "Status", "Total", "Actions"],
      "actions": ["View", "Update status", "Mark paid"],
      "data_testid": ["admin-bookings-table", "admin-booking-row-actions"]
    }
  },
  "image_urls": {
    "hero_fallback": [
      {
        "url": "https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
        "description": "Cinematic front silhouette of luxury car in dark garage (fallback when 3D disabled).",
        "category": "hero"
      }
    ],
    "fleet_and_mood": [
      {
        "url": "https://images.unsplash.com/photo-1632239524459-5c3137fcdae9?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
        "description": "Dark parking garage luxury car mood (fleet section background / overlay).",
        "category": "fleet"
      },
      {
        "url": "https://images.pexels.com/photos/31727916/pexels-photo-31727916.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "description": "Luxury interior leather + ambient lighting (hotspot tooltip imagery / fleet detail).",
        "category": "interior"
      }
    ],
    "bay_area_context": [
      {
        "url": "https://images.unsplash.com/photo-1633130664306-2e6acb58d308?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
        "description": "SF night skyline (about page header / subtle section background).",
        "category": "location"
      }
    ]
  },
  "implementation_notes": {
    "global_css": {
      "index_css_changes": [
        "Set :root tokens to the provided hsl_for_shadcn_root and force dark-only by applying className='dark' on <html> or <body>.",
        "Replace default system font stack with Manrope; set headings via utility classes or a .font-serif class.",
        "Add selection styles: ::selection { background: rgba(176,141,87,0.35); color: #E7EBF2; }",
        "Add focus-visible outline consistency; do not use transition: all."
      ]
    },
    "tailwind_utilities_to_standardize": {
      "section": "relative py-16 sm:py-20 lg:py-24",
      "section_title": "font-[Cormorant_Garamond] text-2xl sm:text-3xl font-semibold",
      "section_kicker": "text-xs tracking-[0.22em] uppercase text-[#9AA3B2]",
      "divider": "h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
    },
    "data_testid_policy": "Every button, link, input, select, step navigation, table, KPI, and error banner must include data-testid in kebab-case describing role (not appearance).",
    "no_transparent_backgrounds": "Use solid obsidian surfaces for all cards and overlays; if using glass effect, simulate with solid + subtle border + noise, not transparency.",
    "performance": [
      "Lazy-load 3D model and postprocessing; show Skeleton placeholder.",
      "Use <Canvas frameloop='demand'> when idle; enable on scroll/interaction.",
      "Provide static hero image fallback for low-end devices."
    ]
  },
  "instructions_to_main_agent": [
    "Update /app/frontend/src/index.css :root tokens to match design_tokens.color_system.hsl_for_shadcn_root and enforce dark-only (apply .dark at root).",
    "Use Cormorant Garamond for headings and Manrope for body via Google Fonts import in index.html (or CSS @import).",
    "Build Home page with a pinned R3F hero (HeroCadillac3D.js) using GSAP ScrollTrigger; include hotspots using Tooltip and data-testid attributes.",
    "Implement Booking Wizard (/book) as 5-step flow with Progress + sticky summary; all fields must have data-testid.",
    "Admin dashboard uses shadcn Table + Badge + Dialog; add Recharts for revenue chart; keep gradients minimal (<=15% opacity fill).",
    "Follow gradient restriction rules strictly; no purple/pink gradients; keep gradients decorative only."
  ],
  "general_ui_ux_design_guidelines": "<General UI UX Design Guidelines>  \n    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms\n    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text\n   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json\n\n **GRADIENT RESTRICTION RULE**\nNEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc\nNEVER use dark gradients for logo, testimonial, footer etc\nNEVER let gradients cover more than 20% of the viewport.\nNEVER apply gradients to text-heavy content or reading areas.\nNEVER use gradients on small UI elements (<100px width).\nNEVER stack multiple gradient layers in the same viewport.\n\n**ENFORCEMENT RULE:**\n    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors\n\n**How and where to use:**\n   • Section backgrounds (not content backgrounds)\n   • Hero section header content. Eg: dark to light to dark color\n   • Decorative overlays and accent elements only\n   • Hero section with 2-3 mild color\n   • Gradients creation can be done for any angle say horizontal, vertical or diagonal\n\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**\n\n</Font Guidelines>\n\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. \n   \n- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.\n\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   \n- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.\n</General UI UX Design Guidelines>"
}
