/**
 * Single source of truth for Karthik S's portfolio content.
 * Edit values here without modifying any React components.
 */
export const portfolioData = {
  profile: {
    name: "Karthik S",
    role: "Computer Science Undergraduate · Backend & LLM Engineering",
    heroPitch:
      "Building reliable backend platforms with Python, Django, and FastAPI—while fine-tuning vision-language models with QLoRA and exploring RAG pipelines.",
    location: "Madurai & Coimbatore, Tamil Nadu",
    // From Karthik_portfolio.pdf — verify or update if needed.
    email: "karthisundarakumar@email.com",
    phone: "+91 9080553227",
    // Place Karthik_portfolio.pdf inside frontend/public/ to enable resume downloads.
    resumeUrl: "/Karthik_portfolio.pdf",
  },

  socials: {
    // TODO: Replace placeholder URLs with your actual profiles.
    github: {
      label: "GitHub",
      url: "https://github.com/Karthik06-ui",
      isPlaceholder: true,
    },
    linkedin: {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/karthik-s-5b9775327/",
      isPlaceholder: true,
    },
  },

  about: {
    summary:
      "Backend-focused Computer Science undergraduate (Python, Django, FastAPI) with 18+ months of experience building and deploying software for the KCT community. Experienced in fine-tuning vision-language models with QLoRA, and currently exploring retrieval-augmented generation (RAG) pipelines. Known for an architecture-first approach and for picking up new tools quickly from documentation. Seeking a Backend / LLM Engineering internship to build and scale retrieval-driven AI applications.",
    education: [
      {
        institution: "Kumaraguru College Of Technology, Coimbatore",
        degree: "BE, Computer Science and Engineering",
        period: "August 2024 – Present",
      },
      {
        institution: "Thaai Matriculation Higher Secondary School, Madurai",
        degree: "High Schooling",
        period: "",
      },
    ],
  },

  skillGroups: [
    {
      category: "Languages",
      items: [
        { name: "Python", level: "Proficient" },
        { name: "C++", level: "Proficient" },
        { name: "HTML / CSS / JS", level: "Intermediate" },
        { name: "React.js", level: "Intermediate" },
        { name: "Node.js", level: "Intermediate" },
        { name: "SQL", level: "Intermediate" },
        { name: "Java", level: "Beginner" },
        { name: "C", level: "Beginner" },
      ],
    },
    {
      category: "Domain Skills",
      items: [
        { name: "Django", level: "Proficient" },
        { name: "REST APIs", level: "Proficient" },
        {
          name: "Machine Learning (TensorFlow, OpenCV, NumPy, Pandas)",
          level: "Intermediate",
        },
        { name: "RAG Pipelines", level: "Exploring" },
        { name: "LLM Prompting", level: "Learning" },
      ],
    },
    {
      category: "Cloud & DevOps",
      items: [
        { name: "Git / GitHub", level: "Proficient" },
        { name: "Render", level: "Proficient" },
        { name: "Vercel", level: "Proficient" },
        { name: "Docker", level: "Intermediate" },
        { name: "Hugging Face", level: "Beginner" },
      ],
    },
  ],

  experience: [
    {
      role: "Software Team Lead",
      organization: "Ré - Research and Exploration Forum - Software Team",
      period: "September 2026 – Present",
      location: "Coimbatore, Tamil Nadu",
      award: 'Received the "Best Idea Curator" award for elevating the quality of project outcomes.',
      highlights: [
        "Delivered end-to-end innovation events — managed scheduling, coordinated cross-functional student teams, and executed 2 hackathons and 1 ideathon.",
      ],
    },
    {
      role: "Research Intern",
      organization: "Ré - Research and Exploration Forum - Software Team",
      period: "January 2025 – August 2026",
      location: "Coimbatore, Tamil Nadu",
      award: "",
      highlights: [
        "Spearheaded the end-to-end development of re-ems using Django and engineered REST API integrations for the MERN-based Research Cell website.",
        "Collaborated with cross-functional teams to translate academic requirements into interconnected digital platforms.",
      ],
    },
  ],

  projects: [
    {
      id: "re-ems",
      title: "Re-EMS",
      subtitle: "Event Management System",
      stack: ["Django", "Python", "REST API", "PostgreSQL"],
      description:
        "Designed a centralized event management system with a REST API backend: user registration, event scheduling, and cross-functional coordination modules. Replaced manual tracking, cutting administrative turnaround time for organizing campus technical events.",
      metrics: [
        "Centralized REST API backend",
        "Replaced manual campus event tracking",
      ],
      // Add URLs when ready; empty strings stay hidden in the UI.
      githubUrl: "",
      liveUrl: "",
    },
    {
      id: "satsaathi",
      title: "SatSaathi",
      subtitle: "Multimodal Remote Sensing",
      stack: ["FastAPI", "Next.js", "VLM", "QLoRA"],
      description:
        "Delivered a deterministic routing architecture for satellite imagery QA: integrated a frozen Qwen3-VL-2B base model with task-specific QLoRA adapters for millisecond swapping. Enhanced visual question answering (VQA) accuracy from 18% to 60% and change-flag accuracy to 91.7%.",
      metrics: [
        "VQA accuracy: 18% → 60%",
        "Change-flag accuracy: 91.7%",
        "Millisecond QLoRA adapter swapping",
      ],
      githubUrl: "",
      liveUrl: "",
    },
    {
      id: "smartpothole",
      title: "SmartPothole",
      subtitle: "Computer Vision & Road Infrastructure",
      stack: ["Django REST", "React", "YOLOv8", "PyTorch"],
      description:
        "Drove a real-time computer vision pipeline for road hazard assessment: integrated a fine-tuned YOLOv8 model with Django REST Framework for sub-100ms inference and automated bounding-box localization. Enhanced detection accuracy to 94.7% with automated multi-tier severity classification (Low/Medium/High) and live GIS geo-tagging across interactive Leaflet maps.",
      metrics: [
        "Detection accuracy: 94.7%",
        "Sub-100ms inference",
        "Automated Low/Medium/High severity + GIS Leaflet maps",
      ],
      githubUrl: "",
      liveUrl: "",
    },
  ],
};
