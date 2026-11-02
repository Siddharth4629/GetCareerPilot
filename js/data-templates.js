// data-templates.js - Predefined Roadmap Templates, Projects, and Interview Prep for Offline Fallback

const CAREER_TEMPLATES = {
  "frontend-developer": {
    title: "Frontend Developer",
    skills: ["HTML5", "CSS3", "JavaScript", "React", "Vue", "Angular", "TypeScript", "Next.js", "Tailwind CSS", "Git", "Webpack", "Vite", "RESTful APIs", "GraphQL", "Redux", "Testing (Jest/Cypress)", "Responsive Design", "Web Performance"],
    description: "Builds the user-facing part of web applications, focusing on user experience, responsive layout, and interactive interfaces.",
    salary: "$75,000 - $130,000",
    roadmap: {
      beginner: {
        weeks: [
          {
            title: "HTML5, CSS3 & Responsive Web Design",
            topics: ["Semantic HTML", "CSS Flexbox & Grid layouts", "Media Queries & Mobile-first design", "CSS variables and modern layout techniques"],
            tasks: ["Create a semantic multi-page portfolio website", "Build a responsive grid-based gallery layout", "Practice flexbox layouts with interactive landing pages"],
            hoursRequired: 10
          },
          {
            title: "JavaScript Programming Foundations",
            topics: ["Variables, Data Types, & Operators", "DOM Manipulation & Events", "Control Flow & Functions", "Arrays, Objects & ES6+ features (map, filter, reduce)"],
            tasks: ["Build an interactive To-Do list with local storage", "Create a digital clock and stopwatch", "Develop a simple calculator with keyboard support"],
            hoursRequired: 15
          },
          {
            title: "Asynchronous JS & API Integration",
            topics: ["Promises & Async/Await", "Fetch API & Fetching JSON data", "Error handling in network requests", "Working with third-party web APIs"],
            tasks: ["Build a weather dashboard retrieving real-time data", "Create a random quote generator with sharing features", "Develop a currency converter using a free exchange rate API"],
            hoursRequired: 15
          },
          {
            title: "Git, Version Control & Deployment",
            topics: ["Git basic commands (clone, add, commit, push)", "Branching and merging workflows", "GitHub hosting and Netlify/Vercel deployment", "Clean code habits & debugging techniques"],
            tasks: ["Create a GitHub repository and commit project progress", "Merge feature branches resolve simple conflicts", "Deploy all previous projects live to Vercel/Netlify"],
            hoursRequired: 10
          }
        ]
      },
      intermediate: {
        weeks: [
          {
            title: "Modern React.js Basics",
            topics: ["JSX & Component-based Architecture", "State & Props management", "React Hooks (useState, useEffect)", "Handling events and forms in React"],
            tasks: ["Convert HTML portfolio to React components", "Build a functional search filter interface", "Create an interactive feedback rating app"],
            hoursRequired: 15
          },
          {
            title: "Routing & State Management",
            topics: ["React Router (SPA Navigation)", "Context API for global state", "Local storage syncing in React", "Advanced Hook patterns (useRef, useMemo)"],
            tasks: ["Build a multi-page e-commerce storefront mockup", "Create a theme-switching context provider (Light/Dark)", "Develop a persistent user settings dashboard"],
            hoursRequired: 18
          },
          {
            title: "TypeScript & Tooling (Vite)",
            topics: ["Vite vs CRA configurations", "TypeScript basics: Types, Interfaces & Generics", "React with TypeScript integration", "CSS Preprocessors & Tailwind CSS setup"],
            tasks: ["Refactor existing React projects to TypeScript", "Install Tailwind CSS and build a sleek glassmorphic dashboard", "Configure custom Vite plugins for performance optimization"],
            hoursRequired: 20
          },
          {
            title: "API Optimization & Build Systems",
            topics: ["REST vs GraphQL principles", "Handling state with Axios & TanStack Query (React Query)", "Optimizing bundle sizes (Code Splitting, Lazy Loading)", "Basic React component testing with Jest/Vitest"],
            tasks: ["Build a movie database web app with search, pagination, and caching", "Implement lazy loading on images and routes", "Write unit tests for core helper components"],
            hoursRequired: 15
          }
        ]
      },
      advanced: {
        weeks: [
          {
            title: "Next.js Framework & SSR/SSG",
            topics: ["Next.js App Router & File-system Routing", "Server Components vs Client Components", "Static Site Generation (SSG) vs Server-Side Rendering (SSR)", "API Routes & Server Actions"],
            tasks: ["Build a full Next.js dynamic blog app", "Create optimized image galleries using next/image", "Set up dynamic route meta tags for SEO compatibility"],
            hoursRequired: 20
          },
          {
            title: "Global State Management & Advanced React Patterns",
            topics: ["Redux Toolkit or Zustand implementation", "Performance profiling with React DevTools", "Custom hooks creation for heavy state computations", "Virtualization for long lists"],
            tasks: ["Implement Zustand state management in a complex cart checkout workflow", "Optimize re-renders of a high-frequency real-time dashboard", "Create custom hook libraries for media queries and form validation"],
            hoursRequired: 20
          },
          {
            title: "End-to-End Testing & Build pipelines",
            topics: ["Cypress & Playwright for E2E testing", "GitHub Actions for CI/CD pipelines", "Webpack custom config basics", "Web Accessibility (WCAG 2.1, ARIA attributes)"],
            tasks: ["Write 3 comprehensive Cypress integration test suites", "Configure a CI pipeline that runs tests on pull request", "Audit a project using Lighthouse and fix accessibility/SEO issues"],
            hoursRequired: 20
          },
          {
            title: "Advanced Web Performance & Security",
            topics: ["Critical Rendering Path optimization", "Content Security Policies (CSP) & CORS issues", "Edge functions & ISR (Incremental Static Regeneration)", "Web Workers for heavy background tasks"],
            tasks: ["Optimize a Next.js site to score 100/100 on Lighthouse core web vitals", "Deploy edge handlers for user location redirection", "Build an offline-capable PWA with custom service worker configurations"],
            hoursRequired: 22
          }
        ]
      }
    },
    projects: [
      {
        name: "EcoShop E-Commerce Mockup",
        difficulty: "Beginner",
        tech: ["HTML5", "CSS3", "JavaScript"],
        description: "A responsive mock e-commerce storefront featuring categorization, dynamically rendering items, search, and a persistent cart mechanism stored in LocalStorage.",
        features: ["Responsive Grid design", "Interactive Product filters", "Persistent Cart items", "Sleek modal animations"]
      },
      {
        name: "DevSync - Interactive Developer Dashboard",
        difficulty: "Intermediate",
        tech: ["React.js", "Tailwind CSS", "Vite", "GitHub REST API"],
        description: "A rich developer productivity application displaying live repository metrics, open issues, user stats, customizable widgets, and task tracking boards.",
        features: ["OAuth integration mockup", "Drag & Drop interactive list", "Live API data polling", "Theme Engine (Dark/Cyberpunk/Solarized)"]
      },
      {
        name: "CollabSphere - Next-Gen Workspace Planner",
        difficulty: "Advanced",
        tech: ["Next.js", "TypeScript", "Zustand", "Framer Motion", "Chart.js"],
        description: "A highly complex workspace management application with real-time graphs, advanced task timelines, rich document creation canvas, and complex filtering algorithms.",
        features: ["Server-Side rendered dashboards", "Interactive drag-resizable widgets", "Rich analytical data visualizations", "Optimized state management for fast interactions"]
      }
    ],
    interviewPrep: {
      topics: ["Core JavaScript (Scope, Closures, Event Loop, Prototypes)", "React Lifecycle & Hooks optimization", "Web Performance & Core Web Vitals", "CSS layouts & responsive design strategies", "REST vs GraphQL & browser caching"],
      questions: [
        {
          q: "What is the difference between client-side rendering (CSR) and server-side rendering (SSR)?",
          a: "CSR loads a minimal HTML template and dynamically renders content in the browser via JavaScript. It is fast after initial load but can suffer from slow initial load and SEO issues. SSR renders HTML on the server on each request. It improves SEO and First Contentful Paint, but increases server load and response times."
        },
        {
          q: "Explain closures in JavaScript and provide a common use case.",
          a: "A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment). In other words, a closure gives an inner function access to the outer function's scope even after the outer function has returned. Common use cases include data privacy (private variables) and factory functions."
        },
        {
          q: "How does the React Virtual DOM work?",
          a: "React creates an in-memory lightweight representation of the real DOM called the Virtual DOM. When state changes, a new Virtual DOM tree is created. React then compares (diffs) this new tree with the previous one. Once it identifies the exact changes, it updates only those specific nodes in the real DOM (reconciliation), minimizing layout thrashing and maximizing speed."
        },
        {
          q: "What are Core Web Vitals and how do you optimize them?",
          a: "Core Web Vitals are three user-centered performance metrics established by Google: LCP (Largest Contentful Paint - loading speed), FID/INP (First Input Delay/Interaction to Next Paint - responsiveness), and CLS (Cumulative Layout Shift - visual stability). You optimize them by compression, lazy loading, setting explicit dimensions on media, deferring non-critical JS, and using modern image formats."
        },
        {
          q: "What is the Event Loop in JavaScript?",
          a: "The Event Loop is the mechanism that allows JavaScript to perform non-blocking, asynchronous operations despite being single-threaded. It constantly monitors the Call Stack and the Callback Queue. If the Call Stack is empty, it takes the first task from the queue (or microtask queue, which has higher priority like promises) and pushes it to the stack to be executed."
        }
      ]
    }
  },
  "backend-developer": {
    title: "Backend Developer",
    skills: ["Node.js", "Express.js", "Python", "Django", "FastAPI", "PostgreSQL", "MongoDB", "SQL", "REST APIs", "GraphQL", "Docker", "Git", "Redis", "JWT", "System Design", "Microservices", "AWS", "Nginx"],
    description: "Architects servers, databases, and APIs. Solves data structure issues, caching, scalability, security protocols, and integration points.",
    salary: "$80,000 - $140,000",
    roadmap: {
      beginner: {
        weeks: [
          {
            title: "Backend Foundations & JavaScript/Python basics",
            topics: ["CLI scripting", "Node.js core modules (fs, path, HTTP)", "Python file I/O & data parsing", "Basic terminal and bash workflows"],
            tasks: ["Create a CLI app that parses JSON files", "Build a script to organize chaotic folders", "Write a basic HTTP server without frameworks"],
            hoursRequired: 12
          },
          {
            title: "REST APIs with Express.js or FastAPI",
            topics: ["MVC architectural pattern", "Routing & URL parameters", "Handling request bodies & headers", "Status codes & error handling"],
            tasks: ["Build a standard CRUD API for a book collection", "Create a task tracker API with customized status codes", "Set up middleware for logging and timing requests"],
            hoursRequired: 15
          },
          {
            title: "Database Fundamentals (SQL)",
            topics: ["Relational Database design", "Basic SQL operations (SELECT, INSERT, UPDATE, JOIN)", "PostgreSQL/MySQL local setup", "Simple schema migrations"],
            tasks: ["Create database tables for a school tracking system", "Write complex multi-table queries", "Connect your REST API to query database results"],
            hoursRequired: 15
          },
          {
            title: "Authentication & Security Basics",
            topics: ["Password hashing using bcrypt", "Session vs Token (JWT) auth", "Secure cookie storage", "Environment variables configuration"],
            tasks: ["Build a complete user register & login backend endpoint", "Implement secure route authorization middlewares", "Deploy the backend API to Render or Heroku"],
            hoursRequired: 12
          }
        ]
      },
      intermediate: {
        weeks: [
          {
            title: "Advanced Databases (SQL & NoSQL)",
            topics: ["Database indexing & optimization", "NoSQL concepts (MongoDB/Mongoose)", "Transactions and Acid properties", "ORM/ODM tools (Prisma, Sequelize, SQLAlchemy)"],
            tasks: ["Design an optimized schema for a e-commerce app", "Run indexing audits on slow SQL queries", "Write transactional queries to prevent race conditions"],
            hoursRequired: 18
          },
          {
            title: "Caching & Message Queues",
            topics: ["In-memory stores (Redis) basics", "API response caching strategies", "Rate limiting endpoints", "Background workers concepts"],
            tasks: ["Implement Redis caching on a slow third-party API fetch", "Set up API rate-limiters using Redis", "Create a basic queue for email delivery triggers"],
            hoursRequired: 20
          },
          {
            title: "Testing & API Documentation",
            topics: ["Unit testing backends (Supertest, Mocha/Jest, PyTest)", "Mocking database connections", "Swagger/OpenAPI documentation templates", "Validation libraries (Joi, Zod, Pydantic)"],
            tasks: ["Write 85% test coverage for user authorization logic", "Build API endpoints using Zod schema validations", "Generate interactive Swagger docs for public endpoints"],
            hoursRequired: 16
          },
          {
            title: "Docker Containerization",
            topics: ["Dockerfiles and basic commands", "Multi-container setup with Docker Compose", "Persistent volumes in containers", "Debugging container environments"],
            tasks: ["Dockerize a Node.js/Python server with PostgreSQL", "Set up Docker compose file for local development", "Build automated container startup configurations"],
            hoursRequired: 15
          }
        ]
      },
      advanced: {
        weeks: [
          {
            title: "System Design & Scalability",
            topics: ["Horizontal vs Vertical scaling", "Load balancing strategies (Nginx/HAProxy)", "Database partitioning & sharding", "System failure design (Circuit breakers)"],
            tasks: ["Design a system architecture diagram for a Twitter clone", "Configure local Nginx as a reverse proxy/load balancer", "Simulate server scaling bottlenecks and benchmark limits"],
            hoursRequired: 20
          },
          {
            title: "Microservices & Event-Driven Architecture",
            topics: ["Monolith vs Microservices tradeoffs", "Message brokers (RabbitMQ/Kafka)", "gRPC protocol vs REST API", "Distributed consensus & tracing"],
            tasks: ["Deconstruct a monolith into 2 microservices", "Communicate between services using RabbitMQ pub-sub", "Implement tracing using OpenTelemetry on distributed systems"],
            hoursRequired: 22
          },
          {
            title: "Cloud Architectures (AWS/GCP)",
            topics: ["AWS EC2, S3, RDS configurations", "Serverless computing (AWS Lambda / Cloud Functions)", "Infrastructure as Code (Terraform) basics", "Cloud monitoring and alert systems"],
            tasks: ["Deploy a scalable API using AWS EC2 and RDS postgres", "Write a terraform file initializing AWS bucket assets", "Implement file uploads saved directly to S3 with pre-signed URLs"],
            hoursRequired: 22
          },
          {
            title: "Advanced Security & DevOps pipelines",
            topics: ["OAuth2 authorization flow implementation", "HTTPS setup & SSL configurations", "SQL Injection / XSS mitigations in middleware", "CI/CD automated deployment pipelines"],
            tasks: ["Implement OAuth integration with GitHub/Google", "Run automated vulnerability scanner tools", "Build a GitHub Action script auto-deploying to AWS on commits"],
            hoursRequired: 20
          }
        ]
      }
    },
    projects: [
      {
        name: "TaskHQ Core API",
        difficulty: "Beginner",
        tech: ["Node.js", "Express.js", "SQLite"],
        description: "A fast, fully documented task management API with authorization, task filtering, subtask nesting, and CSV reports generation.",
        features: ["Token authentication", "SQLite database relations", "CSV export", "Robust error handler middlewares"]
      },
      {
        name: "StoreLink - Distributed Inventory Backend",
        difficulty: "Intermediate",
        tech: ["FastAPI", "PostgreSQL", "Redis", "Docker"],
        description: "An inventory backend system utilizing Redis caching, query indexing, structured schemas, background alerts for low items, and running inside multi-container Docker compose setups.",
        features: ["Caching layer with TTL", "Containerized developer environments", "Database optimization scripts", "Pydantic validation schemas"]
      },
      {
        name: "EventPulse - High-Throughput Notification Service",
        difficulty: "Advanced",
        tech: ["Node.js", "Kafka", "PostgreSQL", "Redis", "AWS S3"],
        description: "An enterprise-grade event pipeline handling millions of notification dispatches. Uses Kafka queues, Redis caching, gRPC, and structured logging workflows.",
        features: ["Kafka event queuing system", "Transactional outbox pattern", "S3 dynamic storage uploads", "Benchmarked load tests (10k req/sec)"]
      }
    ],
    interviewPrep: {
      topics: ["Database Indexes (B-Trees vs Hash Indexes)", "SQL vs NoSQL scaling constraints", "JWT vulnerability patterns", "System Design patterns (CDN, Load Balancers, Sharding)", "Process models: Node.js single-thread vs Python multi-thread"],
      questions: [
        {
          q: "What is database indexing and how does it speed up queries?",
          a: "Database indexing is a data structure (commonly B-Trees) that the database engine uses to locate records without scanning every row in the table (sequential scan). It maps key values to the physical storage locations of rows, making searches O(log N) instead of O(N). While indexes accelerate reads, they slow down write operations (INSERT, UPDATE, DELETE) because the index tree must be updated."
        },
        {
          q: "Explain SQL injection and how you prevent it.",
          a: "SQL Injection is a vulnerability where malicious SQL commands are injected into data inputs, tricking the database into executing unauthorized code. You prevent it by using parameterized queries (prepared statements), escaping input strings, using ORMs, and enforcing least-privilege database user permissions."
        },
        {
          q: "How does Redis work and what are common caching strategies?",
          a: "Redis is an open-source, in-memory key-value data structure store, used as a database, cache, and message broker. Strategies include: Cache-Aside (Lazy Loading - app checks cache, fetches from DB on miss, writes to cache), Write-Through (writes update cache and DB simultaneously), and Eviction Policies (LRU, LFU, TTL) to manage memory size."
        },
        {
          q: "What is JWT and how do you securely store/verify it?",
          a: "JSON Web Token is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. Secure implementations verify signatures on the server using strong cryptographic keys, store tokens in HttpOnly, Secure, and SameSite cookies, and use short expiration times combined with sliding refresh tokens."
        },
        {
          q: "What is horizontal scaling vs vertical scaling?",
          a: "Vertical scaling (scaling up) means adding more power (CPU, RAM) to an existing server, which has a physical ceiling and causes single points of failure. Horizontal scaling (scaling out) means adding more machines/nodes to the pool, distributing traffic through a load balancer. It offers high availability and elastic expansion but increases architecture complexity."
        }
      ]
    }
  },
  "fullstack-developer": {
    title: "Full Stack Developer",
    skills: ["HTML5", "CSS3", "JavaScript", "React", "Node.js", "Express.js", "SQL", "PostgreSQL", "Git", "REST APIs", "TypeScript", "Vite", "Docker", "Authentication", "Tailwind CSS", "Vercel", "Render"],
    description: "Combines front-end UI expertise with back-end servers, databases, and APIs. Capable of building and deploying end-to-end features.",
    salary: "$80,000 - $135,000",
    roadmap: {
      beginner: {
        weeks: [
          {
            title: "Web Basics (HTML, CSS, JS)",
            topics: ["HTML5 semantics", "CSS layout models", "DOM Manipulation", "Modern JavaScript (ES6)"],
            tasks: ["Build a static resume landing page", "Create a JavaScript task manager", "Publish your portfolio online using GitHub Pages"],
            hoursRequired: 12
          },
          {
            title: "Backend Foundations & SQL",
            topics: ["Node.js execution", "Basic Express routing", "Relational database basics", "SQL CRUD queries"],
            tasks: ["Create a server script reading raw local JSON files", "Build a database table storing contacts", "Write custom SQL queries resolving filtering"],
            hoursRequired: 15
          },
          {
            title: "API Development & Database Connection",
            topics: ["REST API designs", "Connecting Express to PostgreSQL", "Handling forms & JSON payloads", "CORS configurations"],
            tasks: ["Build a REST API managing store products", "Create backend data validation", "Test endpoints using Postman or Bruno"],
            hoursRequired: 15
          },
          {
            title: "E2E Integration & Deployment",
            topics: ["Fetching APIs from Frontend JS", "Dynamic page rendering", "Deploying Node.js servers to Render", "Configuring environmental secrets"],
            tasks: ["Build a complete frontend dashboard querying your product API", "Implement dynamic lists and deletions", "Deploy the integrated application live"],
            hoursRequired: 15
          }
        ]
      },
      intermediate: {
        weeks: [
          {
            title: "Frontend Framework (React)",
            topics: ["React JSX, state and props", "Conditional rendering & mapping lists", "React functional components lifecycle", "Styling React with CSS modules"],
            tasks: ["Convert simple portfolio JS into a React SPA", "Build a dynamic form component with validations", "Create an interactive product slider component"],
            hoursRequired: 16
          },
          {
            title: "React Routing & State Management",
            topics: ["React Router configuration", "Global state with Context API", "API calls in React hooks", "Error boundaries"],
            tasks: ["Build an interactive catalog with routing", "Manage shopping cart items globally using Context", "Implement smooth page loaders"],
            hoursRequired: 18
          },
          {
            title: "Fullstack User Authentication",
            topics: ["Password hashing", "JWT generation and cookies", "Protected routes in React", "User session verification"],
            tasks: ["Create login pages in React linked to secure Express routes", "Store tokens securely in cookies", "Protect dashboard access from anonymous users"],
            hoursRequired: 20
          },
          {
            title: "Database Relational Models & ORMs",
            topics: ["One-to-many & Many-to-many database designs", "ORM (Prisma or Sequelize)", "Data migrations", "Transaction query flows"],
            tasks: ["Set up database relationship mapping users to notes", "Create ORM query scripts replacing raw SQL queries", "Write secure database transactions for critical steps"],
            hoursRequired: 18
          }
        ]
      },
      advanced: {
        weeks: [
          {
            title: "Advanced TypeScript Implementation",
            topics: ["TypeScript structures and types", "React + TypeScript typing conventions", "TypeScript integration in Node/Express", "Shared typings between client & server"],
            tasks: ["Convert Node/Express backend folder to TypeScript", "Define shared interfaces for API request/response objects", "Enforce strict type-checking on state management"],
            hoursRequired: 18
          },
          {
            title: "Robust Performance & Optimizations",
            topics: ["Database connection pooling", "Redis caching on the backend API", "React component rendering optimization", "File compression and static delivery"],
            tasks: ["Set up Redis caching to store frequent product lookups", "Configure React lazy loading and dynamic routing", "Perform audit using Lighthouse and optimize assets"],
            hoursRequired: 20
          },
          {
            title: "Monorepo structures & Modern Deployments",
            topics: ["Monorepo configurations (Turborepo/Lerna)", "Dockerizing complex fullstack builds", "CI/CD automated pipelines (GitHub Actions)", "Cloud object storage (AWS S3) integrations"],
            tasks: ["Build a Dockerfile bundle for client and server", "Deploy fullstack application using automated pipelines", "Integrate file upload inputs directly forwarding files to cloud storage"],
            hoursRequired: 22
          },
          {
            title: "Advanced Features (WebSockets / real-time)",
            topics: ["Real-time communication with Socket.io", "Handling system updates instantly", "Security audits & CORS reviews", "Testing integrations (Jest/Playwright)"],
            tasks: ["Build a live chat widget using WebSockets", "Run security audit scanners detecting dependencies issues", "Write complete integration test pipelines covering login-to-purchase"],
            hoursRequired: 22
          }
        ]
      }
    },
    projects: [
      {
        name: "SecureNotes Portal",
        difficulty: "Beginner",
        tech: ["HTML5", "CSS3", "Express.js", "SQLite"],
        description: "A secure, simple notes-taking web app where users can create accounts, format notes using markdown, search contents, and export records.",
        features: ["Plain text CRUD database integration", "Session-based authorization checks", "Responsive workspace template", "Simple Markdown parser"]
      },
      {
        name: "DevHub - Professional Network Platform",
        difficulty: "Intermediate",
        tech: ["React.js", "Tailwind CSS", "Express.js", "PostgreSQL", "Prisma"],
        description: "A structured network tool where developers write bio cards, highlight project tags, post comments, join groups, and search for mentors.",
        features: ["Fully integrated User Auth", "Rich relational database setups", "Advanced multi-attribute search", "Image asset hosting configurations"]
      },
      {
        name: "TaskFlow - Realtime Project Management Board",
        difficulty: "Advanced",
        tech: ["Next.js", "TypeScript", "Socket.io", "PostgreSQL", "Docker", "Tailwind CSS"],
        description: "A high-fidelity project management app similar to Trello. Features real-time drag-and-drop boards, instant updates for team members via WebSockets, and rich progress dashboards.",
        features: ["Drag and Drop lists mapping DB updates", "Instant updates across tabs using WebSockets", "Strict type-checking across frontend and backend API layers", "Production Docker configurations"]
      }
    ],
    interviewPrep: {
      topics: ["State synchronization concepts", "Optimizing data payload sizes", "Common JWT attack vectors (XSS/CSRF)", "Fullstack scaling challenges (N+1 database queries)", "Caching layers layout (HTTP headers, Redis)"],
      questions: [
        {
          q: "What is the N+1 query problem and how do you resolve it?",
          a: "The N+1 query problem occurs when an application executes 1 database query to fetch a list of parent records, and then executes N additional queries (one for each parent) to fetch related child records. This degrades performance. It is resolved by using 'Eager Loading' (fetching all data in a single SQL JOIN query) or batching queries using tools like DataLoader in GraphQL."
        },
        {
          q: "How do you protect your site against CSRF (Cross-Site Request Forgery)?",
          a: "CSRF is prevented by using anti-CSRF tokens (unique, unpredictable tokens validated on the server for modifying actions), utilizing SameSite cookies (Lax or Strict) to prevent browsers from attaching credentials on cross-site requests, and verifying Referer/Origin request headers on the server."
        },
        {
          q: "Explain cross-origin resource sharing (CORS).",
          a: "CORS is a browser security mechanism that restricts web applications from making requests to a domain different from the one that served the page. The server must respond with specific headers (like Access-Control-Allow-Origin) to explicitly permit the browser to access resources on that server."
        },
        {
          q: "What is the difference between LocalStorage, SessionStorage, and Cookies?",
          a: "LocalStorage persists data indefinitely with a 5MB limit, and data is only accessible via client-side scripts. SessionStorage is similar but gets cleared when the browser tab is closed. Cookies are smaller (4KB limit), sent to the server on every request, and can be secured with flags like HttpOnly to prevent script access."
        },
        {
          q: "Describe standard security practices for managing environment variables.",
          a: "Environment variables should never be committed to source control (add .env to .gitignore). In production, inject them securely via your cloud provider (AWS Secret Manager, Render env settings). Use library checks (like dotenv-safe or zod) to validate that all required configuration keys are present at startup."
        }
      ]
    }
  },
  "ai-ml-engineer": {
    title: "AI / ML Engineer",
    skills: ["Python", "PyTorch", "TensorFlow", "Scikit-Learn", "NumPy", "Pandas", "LLMs", "LangChain", "Hugging Face", "SQL", "Git", "API Integration", "Model Deployment", "Vector Databases", "Deep Learning", "Data Pipelines"],
    description: "Builds, trains, fine-tunes, and deploys machine learning models. Works with natural language processing, neural networks, vector databases, and agentic workflows.",
    salary: "$90,000 - $160,000",
    roadmap: {
      beginner: {
        weeks: [
          {
            title: "Mathematical Foundations & Python",
            topics: ["Linear Algebra & Calculus concepts", "NumPy for matrix operations", "Pandas for data cleaning and exploration", "Matplotlib/Seaborn for data visualization"],
            tasks: ["Clean a messy real-world CSV dataset", "Perform exploratory data analysis on a housing prices dataset", "Implement linear regression from scratch using NumPy"],
            hoursRequired: 15
          },
          {
            title: "Classical Machine Learning (Scikit-Learn)",
            topics: ["Supervised learning (Regression & Classification)", "Unsupervised learning (K-Means, PCA)", "Feature engineering and data scaling", "Model evaluation (Precision, Recall, ROC-AUC)"],
            tasks: ["Build a customer churn prediction model", "Cluster customer segments based on buying behavior", "Write a pipeline validating models using cross-validation"],
            hoursRequired: 18
          },
          {
            title: "Introduction to Deep Learning",
            topics: ["Neural Network architectures", "Backpropagation and optimization algorithms", "PyTorch basics (Tensors, Autograd)", "Building simple PyTorch Feedforward Networks"],
            tasks: ["Train a simple neural network on MNIST handwritten digits", "Implement custom Loss functions", "Visualize training loss curves in real-time"],
            hoursRequired: 20
          },
          {
            title: "Model Deployment Foundations",
            topics: ["Wrapping models with FastAPI", "Creating basic inference endpoints", "Dockerizing Python ML code", "Deploying models to Hugging Face Spaces"],
            tasks: ["Create an API for your housing price predictor", "Containerize the model API using Docker", "Deploy your first ML app live on Hugging Face Spaces"],
            hoursRequired: 15
          }
        ]
      },
      intermediate: {
        weeks: [
          {
            title: "Natural Language Processing (NLP)",
            topics: ["Text preprocessing (Tokenization, Lemmatization)", "Word Embeddings (Word2Vec, TF-IDF)", "Recurrent Neural Networks (RNNs) & LSTMs", "Hugging Face Transformers library"],
            tasks: ["Build a sentiment analysis classifier on movie reviews", "Fine-tune a classification model using Hugging Face transformers", "Implement a simple text summarizer"],
            hoursRequired: 20
          },
          {
            title: "Computer Vision Foundations",
            topics: ["Image processing with OpenCV", "Convolutional Neural Networks (CNNs)", "Transfer Learning (ResNet, MobileNet)", "Object Detection basics"],
            tasks: ["Build a custom CNN classifying fashion items", "Use transfer learning to identify dog breeds with >90% accuracy", "Implement real-time face detection scripts"],
            hoursRequired: 20
          },
          {
            title: "LLM Orchestration & RAG Pipelines",
            topics: ["Large Language Models API integrations", "Prompt Engineering techniques", "LangChain/LlamaIndex frameworks", "Vector Databases (ChromaDB, Pinecone, FAISS)"],
            tasks: ["Build a question-answering bot over a custom PDF document", "Implement semantic search over catalog descriptions", "Build a prompt-chaining workflow generating marketing copy"],
            hoursRequired: 22
          },
          {
            title: "MLOps & Experiment Tracking",
            topics: ["MLflow or Weights & Biases for tracking experiments", "Hyperparameter tuning techniques (Optuna)", "Data Version Control (DVC)", "Data validation in pipelines (Great Expectations)"],
            tasks: ["Track experiments of a deep learning model using MLflow", "Perform hyperparameter search optimizing model accuracy", "Set up DVC tracking on dataset files"],
            hoursRequired: 18
          }
        ]
      },
      advanced: {
        weeks: [
          {
            title: "Advanced LLM Fine-Tuning & Quantization",
            topics: ["Parameter Efficient Fine-Tuning (PEFT, LoRA)", "Instruction fine-tuning open-source LLMs (Llama, Mistral)", "Dataset preparation and formatting", "Model quantization formats (GGUF, AWQ)"],
            tasks: ["Fine-tune a small LLM (e.g., Llama-3-8B) on a specific domain dataset", "Quantize the model for local CPU inference", "Evaluate model before/after fine-tuning"],
            hoursRequired: 24
          },
          {
            title: "Agentic AI Architectures",
            topics: ["AI Agent loops (ReAct pattern)", "Tool calling and execution sandboxes", "Multi-agent frameworks (Autogen, CrewAI, LangGraph)", "State management in complex agent flows"],
            tasks: ["Build a researcher agent that searches the web and writes reports", "Develop a multi-agent coder and tester workflow", "Implement memory persistence for conversation agents"],
            hoursRequired: 24
          },
          {
            title: "Scalable Model Serving",
            topics: ["Serving with Triton Inference Server or vLLM", "Model compilation (TensorRT, ONNX)", "Horizontal autoscaling of ML containers", "Monitoring drift and latency"],
            tasks: ["Deploy a quantized LLM using vLLM for high-throughput serving", "Convert a PyTorch model to ONNX for 3x latency speedups", "Build a dashboard monitoring live inference latency"],
            hoursRequired: 22
          },
          {
            title: "Distributed Training & Big Data",
            topics: ["Distributed PyTorch training (DDP)", "Training on multi-GPU systems", "Data engineering at scale (Spark, Ray)", "Efficient dataset loading"],
            tasks: ["Write a distributed training script using PyTorch DDP", "Use Ray to run parallel hyperparameter search", "Optimize data loading pipeline preventing GPU starvation"],
            hoursRequired: 25
          }
        ]
      }
    },
    projects: [
      {
        name: "SentimentSentry API",
        difficulty: "Beginner",
        tech: ["Python", "Scikit-Learn", "FastAPI"],
        description: "A fast sentiment classification API trained on structured text data, fully documented with swagger UI, featuring custom request validation.",
        features: ["Dataset preprocessing pipeline", "TF-IDF text classification model", "FastAPI endpoint with Swagger docs", "Benchmark performance scripts"]
      },
      {
        name: "DocuBrain - Semantic PDF Search Assistant",
        difficulty: "Intermediate",
        tech: ["Python", "LangChain", "ChromaDB", "Gemini API", "Streamlit"],
        description: "An interactive Streamlit interface allowing users to upload documents, index them into a vector store, and chat with the document contents using RAG.",
        features: ["PDF document chunking algorithms", "ChromaDB local vector embedding storage", "Conversational retrieval chain with memory", "Streamlit UI"]
      },
      {
        name: "AutoAgent-Research Analyst",
        difficulty: "Advanced",
        tech: ["Python", "LangGraph", "PyTorch", "vLLM", "Docker"],
        description: "A multi-agent system utilizing graph states. One agent compiles search topics, the second searches the web, the third writes a structured research report, and a final agent audits references.",
        features: ["LangGraph state-machine architecture", "Dynamic tool calling integrations", "Automated markdown report compiling", "Dockerized agent deployments"]
      }
    ],
    interviewPrep: {
      topics: ["Vanishing/Exploding gradients mitigation", "LLM Attention mechanism (Self-Attention, KV Cache)", "RAG optimization strategies", "Bias-Variance tradeoff & overfitting cures", "Model quantization vs fine-tuning tradeoffs"],
      questions: [
        {
          q: "Explain the self-attention mechanism in Transformers.",
          a: "Self-attention allows a model to associate each word in a sequence with all other words, calculating a weight representing their relationship. It works by computing three vectors for each token: Query (Q), Key (K), and Value (V). The attention score is calculated by taking the dot product of Q and K, dividing by the square root of the dimension size (scaling), applying softmax to get weights, and multiplying by V."
        },
        {
          q: "What is overfitting and how do you prevent it in neural networks?",
          a: "Overfitting occurs when a model learns noise and details in the training data to the extent that it negatively impacts its performance on new data. You prevent it in neural networks using: L1/L2 regularization (weight decay), Dropout (randomly deactivating nodes during training), Early Stopping (stopping training when validation loss rises), Data Augmentation, and reducing model complexity."
        },
        {
          q: "What is RAG (Retrieval-Augmented Generation) and how does it improve LLMs?",
          a: "RAG optimizes the output of an LLM by referencing an authoritative knowledge base outside of its training data sources before generating a response. It converts documents to vector embeddings, stores them in a Vector DB, and on user query, retrieves semantically similar document chunks. These chunks are appended to the LLM prompt, providing real-time context, reducing hallucinations, and allowing dynamic data access."
        },
        {
          q: "What is the difference between Fine-Tuning and Prompt Engineering?",
          a: "Prompt engineering is a client-side strategy that structures instructions to guide the behavior of a pre-trained model without changing its weights. Fine-tuning is a server-side training strategy that updates a model's weights on a specific dataset to adapt its internal knowledge, style, or task execution parameters."
        },
        {
          q: "Explain bias-variance tradeoff.",
          a: "Bias is the error introduced by approximating a real-world problem with a simplified model (leads to underfitting). Variance is the model's sensitivity to small fluctuations in the training set (leads to overfitting). The tradeoff dictates that as you decrease bias (increase model complexity), variance increases, and vice-versa. The goal is to find the sweet spot minimizing overall error."
        }
      ]
    }
  },
"data-scientist": {
    title: "Data Scientist & AI Analyst",
    skills: ["Python", "SQL", "Pandas", "NumPy", "Scikit-Learn", "Statistics & Probability", "Data Visualization", "Tableau", "Power BI", "Exploratory Data Analysis", "Hypothesis Testing", "Machine Learning Algorithms", "Feature Engineering", "Jupyter Notebooks", "A/B Testing", "Big Data Basics"],
    description: "Extracts actionable insights from structured and unstructured data, developing predictive machine learning models and executive intelligence dashboards.",
    salary: "$85,000 - $145,000",
    roadmap: {
      beginner: {
        weeks: [
          {
            title: "Data Analysis with Python & Pandas",
            topics: ["Python data structures & NumPy arrays", "Pandas DataFrames, filtering, and aggregation", "Data cleaning, missing value imputation, and formatting", "Data visualization with Matplotlib and Seaborn"],
            tasks: ["Clean and analyze a real-world messy CSV dataset", "Build exploratory visualizations revealing hidden trends", "Calculate summary statistics and correlation matrices"],
            hoursRequired: 12
          },
          {
            title: "Relational Databases & Advanced SQL",
            topics: ["SQL fundamentals (SELECT, WHERE, ORDER BY)", "Complex JOINs, GROUP BY, and aggregations", "Window functions (ROW_NUMBER, RANK, LAG/LEAD)", "Common Table Expressions (CTEs) and Subqueries"],
            tasks: ["Write 15 complex analytical SQL queries on an e-commerce database", "Compute month-over-month customer retention and revenue metrics", "Optimize query performance using indexes"],
            hoursRequired: 14
          },
          {
            title: "Applied Statistics & Hypothesis Testing",
            topics: ["Descriptive vs inferential statistics", "Probability distributions (Normal, Binomial, Poisson)", "Z-tests, T-tests, ANOVA, and Chi-Square tests", "p-values, Confidence Intervals, and Type I/II errors"],
            tasks: ["Design and evaluate an A/B test for a marketing landing page", "Perform two-sample hypothesis testing on medical survey data", "Calculate statistical significance and power analysis"],
            hoursRequired: 15
          },
          {
            title: "Business Intelligence & Interactive Dashboards",
            topics: ["Tableau or Power BI workspace fundamentals", "Connecting data sources and relationship modeling", "Calculated fields and DAX basics", "Designing user-centric executive KPI dashboards"],
            tasks: ["Build a live interactive sales performance dashboard in Tableau/Power BI", "Publish dashboard with drill-down filters and tooltips", "Present key findings in an executive summary slide deck"],
            hoursRequired: 12
          }
        ]
      },
      intermediate: {
        weeks: [
          {
            title: "Supervised Machine Learning (Regression & Classification)",
            topics: ["Linear and Logistic Regression math & intuition", "Decision Trees, Random Forests & Gradient Boosting (XGBoost)", "Cross-validation and hyperparameter tuning (GridSearchCV)", "Model evaluation metrics (RMSE, ROC-AUC, F1-Score)"],
            tasks: ["Build a predictive housing price regression model with Scikit-Learn", "Train a customer churn classifier with XGBoost scoring >88% ROC-AUC", "Diagnose bias-variance tradeoff using learning curves"],
            hoursRequired: 18
          },
          {
            title: "Unsupervised Learning & Clustering",
            topics: ["K-Means Clustering and hierarchical clustering", "Dimensionality reduction with Principal Component Analysis (PCA)", "Anomaly detection techniques", "Evaluating cluster quality (Silhouette scores)"],
            tasks: ["Perform customer segmentation on transaction records", "Reduce 50 high-dimensional features down to 3 principal components", "Build an automated outlier detection script for fraudulent activities"],
            hoursRequired: 16
          },
          {
            title: "Feature Engineering & Data Preprocessing Pipelines",
            topics: ["Categorical encoding (One-Hot, Target, Ordinal)", "Feature scaling (StandardScaler, MinMaxScaler)", "Handling imbalanced datasets (SMOTE, class weighting)", "Building reproducible Scikit-Learn Pipelines"],
            tasks: ["Construct an end-to-end automated inference pipeline", "Apply SMOTE to balance an extreme credit card fraud dataset", "Deploy pipeline to process streaming mock events"],
            hoursRequired: 16
          },
          {
            title: "Model Deployment & Web Interface",
            topics: ["Serializing models with Joblib/Pickle", "Building lightweight prediction APIs with FastAPI", "Containerizing data apps with Docker", "Creating interactive demos using Streamlit"],
            tasks: ["Deploy a trained ML model via FastAPI endpoint with Swagger docs", "Build a customer-facing prediction calculator in Streamlit", "Deploy app live to Streamlit Cloud or Render"],
            hoursRequired: 15
          }
        ]
      },
      advanced: {
        weeks: [
          {
            title: "Deep Learning Foundations (PyTorch)",
            topics: ["Neural network architectures, activations, and backpropagation", "PyTorch Tensors, Datasets, and DataLoader pipelines", "Training multi-layer perceptrons (MLPs)", "Regularization techniques (Dropout, BatchNorm, Weight Decay)"],
            tasks: ["Train an image or tabular classifier from scratch in PyTorch", "Implement custom loss functions and learning rate schedulers", "Track experiment metrics and losses with TensorBoard"],
            hoursRequired: 20
          },
          {
            title: "Natural Language Processing (NLP) & Text Mining",
            topics: ["Text preprocessing, tokenization, and TF-IDF", "Word embeddings (Word2Vec, FastText)", "Hugging Face Transformers and pre-trained models (BERT)", "Sentiment analysis and text classification"],
            tasks: ["Fine-tune a Hugging Face BERT model on customer reviews", "Extract key entities and sentiment scores from unstructured PDFs", "Build a semantic search ranking engine over text documents"],
            hoursRequired: 20
          },
          {
            title: "Big Data & Distributed Computing (PySpark)",
            topics: ["Apache Spark architecture (RDDs, DataFrames)", "Distributed data transformations with PySpark", "Feature engineering at scale", "Spark MLlib for distributed machine learning"],
            tasks: ["Process a multi-gigabyte dataset using PySpark on Databricks", "Train a distributed recommendation system using ALS", "Benchmark computation speed against single-node Pandas"],
            hoursRequired: 22
          },
          {
            title: "Production MLOps, Monitoring & Drift Detection",
            topics: ["MLflow for experiment tracking and model registry", "Data drift and concept drift detection (Evidently AI)", "Automated model retraining CI/CD pipelines", "Real-world ethics, fairness, and model interpretability (SHAP/LIME)"],
            tasks: ["Log and register models with MLflow tracking artifacts", "Configure SHAP explainability plots to justify high-stakes predictions", "Simulate production data drift and trigger retraining alerts"],
            hoursRequired: 22
          }
        ]
      }
    },
    projects: [
      {
        name: "Customer Churn Predictor & Retention Engine",
        difficulty: "Beginner",
        tech: ["Python", "Pandas", "Scikit-Learn", "Streamlit"],
        description: "An end-to-end data application predicting customer churn likelihood from behavior metrics, offering proactive discount recommendations.",
        features: ["Exploratory Data Analysis notebook", "XGBoost classification model", "Feature importance breakdown using SHAP", "Streamlit web interface for sales teams"]
      },
      {
        name: "Financial Market Trend & Sentiment Analyzer",
        difficulty: "Intermediate",
        tech: ["Python", "Hugging Face", "SQL", "Tableau", "FastAPI"],
        description: "Scrapes financial news and earnings reports, performs sentiment extraction via pre-trained transformers, and correlates sentiment with stock trends.",
        features: ["Automated news ingestion pipeline", "Fine-tuned FinBERT sentiment classifier", "SQL analytical warehouse", "Interactive Tableau trend dashboard"]
      },
      {
        name: "Enterprise Recommendation & Real-time MLOps System",
        difficulty: "Advanced",
        tech: ["PyTorch", "PySpark", "MLflow", "Docker", "FastAPI"],
        description: "A distributed collaborative-filtering recommendation engine processing user clickstreams, with live model serving and drift monitoring.",
        features: ["Distributed PySpark matrix factorization", "Low-latency FastAPI recommendation service", "Automated MLflow model registry", "Docker containerization"]
      }
    ],
    interviewPrep: {
      topics: ["Bias vs Variance tradeoff in ML", "Handling multicollinearity and missing data", "Overcoming imbalanced classification problems", "SQL Window Functions vs Self-Joins", "Evaluating models with Precision, Recall, and ROC-AUC"],
      questions: [
        {
          q: "When would you prioritize Recall over Precision in a machine learning model?",
          a: "You prioritize Recall when the cost of a False Negative is significantly higher than the cost of a False Positive. Classic examples include medical disease diagnosis (missing a sick patient can be fatal) and fraud detection (letting fraudulent transactions slip through causes severe financial loss)."
        },
        {
          q: "What is the difference between L1 (Lasso) and L2 (Ridge) regularization?",
          a: "Both penalize model weights to prevent overfitting. L1 regularization adds the sum of the absolute values of the coefficients to the loss function, which can drive non-essential coefficients completely to zero, performing automatic feature selection. L2 regularization adds the sum of squared coefficients, shrinking weights close to zero but rarely exactly zero, which is ideal when all features have modest relevance."
        },
        {
          q: "Explain how a Random Forest model handles variance compared to a single Decision Tree.",
          a: "A single decision tree is prone to high variance and overfitting because it can create overly complex, deep splits. Random Forest reduces variance via Bagging (Bootstrap Aggregation) and feature randomness: it trains hundreds of trees on random data subsets with random feature candidates at each split, then averages their predictions. This decorrelates individual errors and dramatically smooths predictions."
        },
        {
          q: "How do you detect and treat multicollinearity in regression models?",
          a: "Multicollinearity occurs when independent variables are highly correlated with each other. It can be detected using Correlation Heatmaps and Variance Inflation Factor (VIF > 5-10 indicates severe multicollinearity). It is resolved by removing redundant collinear variables, combining correlated features into a single composite metric, using PCA, or applying Ridge regression."
        },
        {
          q: "What are SQL Window Functions and how do they differ from GROUP BY?",
          a: "GROUP BY collapses multiple rows into a single summary row, losing individual record details. In contrast, Window Functions (like ROW_NUMBER, RANK, SUM() OVER(PARTITION BY...)) perform calculations across a specified set of rows related to the current row without collapsing them, retaining full row-level granularity while computing running totals or rankings."
        }
      ]
    }
  },

  "product-manager": {
    title: "Product Manager",
    skills: ["Product Strategy", "Agile & Scrum", "PRD Writing", "User Journey Mapping", "Market Research", "Competitor Analysis", "A/B Testing", "Wireframing & Prototyping", "Key Metrics (LTV, CAC, Churn, Retention)", "Stakeholder Management", "Jira", "Figma Basics", "Prioritization Frameworks (RICE, MoSCoW)", "Product Analytics (Mixpanel, Amplitude)"],
    description: "Leads cross-functional teams across engineering, design, and business to conceptualize, validate, and launch high-impact digital and physical products.",
    salary: "$80,000 - $140,000",
    roadmap: {
      beginner: {
        weeks: [
          {
            title: "Foundations of Product Management & Discovery",
            topics: ["What is a PM? The intersection of Tech, Design & Business", "Customer Problem Discovery vs Solution Jumping", "Conducting user interviews & synthesizing insights", "Creating Customer Empathy Maps and Personas"],
            tasks: ["Conduct 3 simulated customer discovery interviews", "Build a detailed user persona highlighting core pain points", "Write a problem statement using the 'Jobs-To-Be-Done' (JTBD) framework"],
            hoursRequired: 10
          },
          {
            title: "Product Requirements Documentation (PRD)",
            topics: ["PRD Anatomy: Background, Goals, Non-Goals, User Stories", "Writing acceptance criteria and edge case requirements", "Wireframing low-fidelity concepts in Figma or Miro", "Defining success metrics and guardrail KPIs"],
            tasks: ["Draft a complete 3-page PRD for a mobile app feature", "Create low-fidelity user flow wireframes in Figma", "Define primary and secondary KPIs using HEART framework"],
            hoursRequired: 14
          },
          {
            title: "Agile Development & Sprint Execution",
            topics: ["Agile principles vs Waterfall methodology", "Scrum ceremonies: Daily Standups, Sprint Planning, Retrospectives", "Writing user stories with INVEST criteria", "Managing backlogs and story estimation (Story Points) in Jira"],
            tasks: ["Set up a Jira/Trello project board with epics and user stories", "Facilitate a mock sprint planning and sizing session", "Document a sprint retrospective with actionable improvements"],
            hoursRequired: 12
          },
          {
            title: "Market Analysis & Competitive Landscape",
            topics: ["Direct vs Indirect Competitor benchmarking", "SWOT Analysis and Porter's Five Forces", "Unique Value Proposition (UVP) crafting", "Go-To-Market (GTM) strategy foundations"],
            tasks: ["Construct a competitive positioning matrix of 5 rival products", "Formulate a positioning brief for an innovative product launch", "Draft an executive summary deck presenting the market opportunity"],
            hoursRequired: 12
          }
        ]
      },
      intermediate: {
        weeks: [
          {
            title: "Product Analytics & Metric Funnels",
            topics: ["Pirate Metrics (AARRR: Acquisition, Activation, Retention, Referral, Revenue)", "Funnel analysis & drop-off diagnosis", "Cohort analysis for user retention", "Configuring tracking events in Mixpanel/Amplitude"],
            tasks: ["Map out an end-to-end user onboarding funnel", "Analyze a mock cohort retention chart to identify churn inflection points", "Write an analytics tracking plan specifying triggers and properties"],
            hoursRequired: 15
          },
          {
            title: "Prioritization Frameworks & Strategic Roadmaps",
            topics: ["RICE (Reach, Impact, Confidence, Effort) scoring", "MoSCoW (Must, Should, Could, Won't) method", "Kano model of customer satisfaction", "Outcome-driven vs feature-driven roadmaps"],
            tasks: ["Score and rank a 15-item feature backlog using the RICE matrix", "Build a quarterly strategic roadmap aligned with business OKRs", "Present tradeoffs and defend prioritization to a mock stakeholder"],
            hoursRequired: 15
          },
          {
            title: "Experimentation, A/B Testing & Hypothesis Design",
            topics: ["Formulating testable product hypotheses", "A/B testing sample size calculation and duration", "Statistical significance and avoiding common testing pitfalls", "Post-experiment decision making: Rollout, Iterate, or Kill"],
            tasks: ["Design an A/B test plan for checkout page optimization", "Calculate required sample sizes using an online calculator", "Analyze mock variant results and write a rollout recommendation doc"],
            hoursRequired: 14
          },
          {
            title: "Stakeholder Management & Cross-Functional Alignment",
            topics: ["Working effectively with Engineering, Design, Sales, and Marketing", "Saying 'No' constructively with data and alignment", "Conflict resolution and consensus building", "Executive presentation & storytelling skills"],
            tasks: ["Write a memo managing a high-stakes engineering timeline delay", "Create a launch briefing document for Sales and Customer Support", "Deliver a 5-minute video pitch defending a product direction"],
            hoursRequired: 14
          }
        ]
      },
      advanced: {
        weeks: [
          {
            title: "Product-Led Growth (PLG) & Virality Mechanics",
            topics: ["Product-Led vs Sales-Led growth dynamics", "Freemium vs Free Trial models and paywall triggers", "Self-serve onboarding flows and Time-to-Value (TTV) reduction", "Viral loops, referral mechanics, and network effects"],
            tasks: ["Audit a top SaaS product's onboarding and identify friction points", "Design a gamified referral loop with viral coefficients > 1", "Draft a pricing tier model and monetization trigger strategy"],
            hoursRequired: 18
          },
          {
            title: "AI Product Management & LLM Integration",
            topics: ["Evaluating AI feasibility: When to use Generative AI vs classical heuristics", "Prompt engineering for PMs and system design guardrails", "Handling hallucinations, latency, and token economics", "Ethical AI, privacy, and UX design patterns for AI copilots"],
            tasks: ["Author a PRD for an AI assistant feature inside a productivity app", "Calculate unit economics and token costs per user interaction", "Design graceful fallback states when the AI API fails or hallucinates"],
            hoursRequired: 20
          },
          {
            title: "Unit Economics, Pricing & Business Models",
            topics: ["Customer Acquisition Cost (CAC) and Lifetime Value (LTV) math", "LTV/CAC ratio benchmarks and payback period calculations", "Pricing strategies: Value-based, Tiered, Usage-based", "Financial modeling for product line P&L"],
            tasks: ["Build a dynamic spreadsheet calculating SaaS unit economics", "Model the impact of a 5% churn reduction on annual ARR", "Propose a revised usage-based pricing strategy backed by user data"],
            hoursRequired: 18
          },
          {
            title: "Executive Product Strategy & Vision",
            topics: ["Crafting a 3-5 year inspiring product vision", "Platform strategies and ecosystem moat defensibility", "Managing product portfolio lifecycle (Innovate, Grow, Milk, Sunset)", "Chief Product Officer (CPO) level executive communication"],
            tasks: ["Create an overarching product vision manifesto and strategic pillars", "Build a roadmap sunsetting a legacy product line with minimal churn", "Present a mock Series B Product Pitch to an executive investor panel"],
            hoursRequired: 20
          }
        ]
      }
    },
    projects: [
      {
        name: "NextGen EdTech Onboarding PRD & Prototype",
        difficulty: "Beginner",
        tech: ["Figma", "Jira", "PRD Templates", "Miro"],
        description: "A comprehensive Product Requirements Document and interactive prototype designed to accelerate Time-to-Value for first-time online learners.",
        features: ["Detailed JTBD user personas", "Feature requirements with acceptance criteria", "Interactive Figma mobile prototype", "RICE prioritization scorecard"]
      },
      {
        name: "SaaS Freemium-to-Paid Conversion Optimization Engine",
        difficulty: "Intermediate",
        tech: ["Mixpanel", "Amplitude Mockups", "Notion", "Google Sheets"],
        description: "An analytics-driven optimization strategy identifying drop-off bottlenecks in a B2B SaaS trial, redesigning paywall triggers to lift conversion by 18%.",
        features: ["Funnel drop-off audit report", "Hypothesis documentation & A/B test plan", "Redesigned paywall trigger wireframes", "Unit economics financial model"]
      },
      {
        name: "AI Productivity Copilot Strategy & GTM Launch Deck",
        difficulty: "Advanced",
        tech: ["OpenAI/Gemini Architecture", "GTM Frameworks", "C-Level Pitch Decks"],
        description: "An executive-level product strategy introducing an autonomous AI assistant into an enterprise workflow app, with full unit economics and GTM launch plan.",
        features: ["Complete AI PRD with guardrails and fallbacks", "Token cost and margin projection model", "Cross-functional GTM launch checklist", "Investor & executive pitch deck"]
      }
    ],
    interviewPrep: {
      topics: ["Product Sense & Design Questions (Design X for Y)", "Analytical & Metric Execution (Metric M dropped by X%, debug)", "Prioritization & Tradeoff Dilemmas", "Behavioral Leadership & Conflict Management", "GTM & Business Model Economics"],
      questions: [
        {
          q: "How would you design an alarm clock for people who are blind?",
          a: "I'd start by understanding the user persona, their environment, and distinct pain points. Instead of relying on visual displays, I'd explore multi-sensory feedback: tactile braille buttons with distinct textures, voice command integration with natural audio confirmations, wearable vibration bands for gentle tactile wakeups, and ambient light-sensing safety features. I'd prioritize features using RICE, define success metrics (error-free setting rate), and test with accessibility user groups."
        },
        {
          q: "Uber rides dropped by 5% in Chicago last week. How would you diagnose the problem?",
          a: "I would follow a structured root-cause diagnostic: 1) Verify data integrity: Is it a telemetry logging bug or tracking issue? 2) Clarify scope: Is it iOS, Android, specific vehicle tiers, or localized to certain neighborhoods? 3) Segment internal vs external factors: Internal: recent app updates, price algorithm changes, app crashes. External: severe weather, public transit disruptions, local holidays, or aggressive competitor promotions. 4) Identify the root cause and align engineering/operations on the remediation plan."
        },
        {
          q: "How do you handle a disagreement with an engineering lead who insists a requested feature cannot be built in time?",
          a: "I avoid treating it as a confrontation and treat it as a collaborative problem-solving exercise. First, I seek to deeply understand the engineering constraints (technical debt, architecture dependencies). Second, I share the core customer problem and business urgency behind the deadline. Third, we negotiate scope tradeoffs: Can we ship an MVP with 80% of value at 20% of engineering effort (cutting non-critical edge cases for V2)? If not, we evaluate timeline flexibility versus backlog deprioritization."
        },
        {
          q: "Explain the RICE prioritization framework.",
          a: "RICE is an objective scoring model: Reach (number of users impacted per quarter), Impact (massive=3, high=2, medium=1, low=0.5, minimal=0.25), Confidence (100%=high data confidence, 80%=medium, 50%=low/hunch), and Effort (person-months required). The formula is (Reach × Impact × Confidence) / Effort. It prevents loudest-voice bias by balancing user upside against engineering cost."
        },
        {
          q: "What is the difference between an output and an outcome?",
          a: "An output is a deliverable or feature produced—for example, 'shipped a new dark mode toggle' or 'released an export-to-PDF button'. An outcome is the measurable behavioral change or business value resulting from that output—such as 'increased 30-day retention by 6%' or 'reduced support tickets by 22%'. Great product managers focus ruthlessly on delivering outcomes rather than merely churning out outputs."
        }
      ]
    }
  },

  "ui-ux-designer": {
    title: "UI/UX & Product Designer",
    skills: ["Figma", "User Research & Interviews", "Information Architecture", "Wireframing", "Interactive Prototyping", "Design Systems", "Typography & Color Theory", "Usability Testing", "Heuristic Evaluation", "Accessibility (WCAG 2.1)", "Micro-interactions", "Mobile UI Guidelines (iOS/Material)"],
    description: "Designs intuitive, accessible, and visually stunning digital experiences, transforming complex problems into elegant user journeys and reusable design systems.",
    salary: "$70,000 - $125,000",
    roadmap: {
      beginner: {
        weeks: [
          {
            title: "Design Thinking & User Research Foundations",
            topics: ["The 5 stages of Design Thinking (Empathize, Define, Ideate, Prototype, Test)", "Conducting generative user interviews", "Synthesizing research into Personas and Journey Maps", "Defining User Problem Statements (How Might We...)"],
            tasks: ["Interview 3 users regarding a frustrating everyday digital experience", "Construct an end-to-end Customer Journey Map with emotional highs and lows", "Formulate 3 actionable 'How Might We' design prompts"],
            hoursRequired: 10
          },
          {
            title: "Information Architecture & Low-Fidelity Wireframing",
            topics: ["Card sorting and tree testing fundamentals", "User flow diagrams and navigation hierarchy", "Sketching rapid paper wireframes", "Translating sketches into digital low-fidelity wireframes in Figma"],
            tasks: ["Map out the complete sitemap for a multi-service web platform", "Draw paper wireframes for 5 core user screens", "Recreate screens into clean grayscale wireframes in Figma"],
            hoursRequired: 12
          },
          {
            title: "Figma Mastery: Components, Auto Layout & Styles",
            topics: ["Figma vector tools, frames, and responsive Auto Layout", "Component properties, variants, and boolean switches", "Managing color palettes, text styles, and effect libraries", "Interactive component states (Default, Hover, Pressed, Disabled)"],
            tasks: ["Build a responsive navbar and card component using Auto Layout", "Create an interactive button set with 6 states using component variants", "Organize a foundational style guide with typography and 60-30-10 color rules"],
            hoursRequired: 15
          },
          {
            title: "Visual Design, Typography & Accessibility (WCAG)",
            topics: ["Visual hierarchy, contrast, and whitespace rules", "Typography pairing, scale (1.25x / 1.33x), and line height", "Color psychology and WCAG 2.1 AA/AAA contrast ratios", "Designing for screen readers and inclusive color palettes"],
            tasks: ["Audit 3 existing websites for contrast and accessibility failures", "Design a polished landing page hero section with typographic hierarchy", "Check and document all color combinations using Stark or Figma plugins"],
            hoursRequired: 12
          }
        ]
      },
      intermediate: {
        weeks: [
          {
            title: "Advanced Prototyping & Micro-interactions",
            topics: ["Smart Animate transitions and easing curves (Ease-in-out, Spring)", "Interactive prototypes with Figma variables and conditionals", "Designing engaging micro-interactions (Toggle switches, Pull-to-refresh)", "Interactive forms with live field validation states"],
            tasks: ["Build a high-fidelity checkout flow with realistic smart animations", "Use Figma variables to create a working cart counter and modal popup", "Record a screen capture highlighting smooth UI micro-interactions"],
            hoursRequired: 16
          },
          {
            title: "Building Scalable Design Systems",
            topics: ["Atomic Design methodology (Atoms, Molecules, Organisms, Templates)", "Design tokens (Colors, Spacing, Typography, Elevations)", "Creating a reusable UI component library in Figma", "Design system governance, versioning, and documentation"],
            tasks: ["Construct an Atomic UI library with 20+ reusable master components", "Set up design tokens for multi-theme support (Dark & Light Mode)", "Publish the component library and use it to build 3 consistent app screens"],
            hoursRequired: 18
          },
          {
            title: "Usability Testing & Iterative Validation",
            topics: ["Writing unmoderated and moderated usability test scripts", "Formulating realistic test tasks and scenarios", "Recording user sessions with Maze or Lookback", "System Usability Scale (SUS) benchmarking and heuristic audits"],
            tasks: ["Run a moderated usability test on 3 real participants using a prototype", "Document qualitative pain points and time-on-task metrics", "Redesign 2 problematic screens based on direct user test feedback"],
            hoursRequired: 14
          },
          {
            title: "Developer Handoff & Design Systems Integration",
            topics: ["Using Figma Dev Mode for inspectable specs", "Annotating spacing, responsive breakpoints, and edge cases", "Exporting optimized SVG/WebP assets", "Collaborating seamlessly with Frontend Engineers"],
            tasks: ["Prepare a complete developer handoff file with redline specs", "Annotate responsive behavior across mobile (375px) and desktop (1440px)", "Host a mock design handoff review walkthrough with an engineer"],
            hoursRequired: 14
          }
        ]
      },
      advanced: {
        weeks: [
          {
            title: "Mobile App UX & Platform Guidelines (iOS vs Material 3)",
            topics: ["Apple Human Interface Guidelines (HIG) vs Google Material Design 3", "Native navigation patterns (Tabs, Sheets, App Bars, Gestures)", "Safe areas, dynamic islands, and OS-specific touch targets", "Adapting designs across responsive tablet, foldable, and desktop views"],
            tasks: ["Design an iOS native app experience adhering strictly to Apple HIG", "Adapt the same app concept to Google Material 3 with dynamic color theming", "Test prototypes on physical mobile devices using Figma Mirror"],
            hoursRequired: 18
          },
          {
            title: "Complex Web Application & Dashboard UX",
            topics: ["Information-dense enterprise dashboard design", "Advanced data tables (Filtering, Sorting, Bulk Actions, Pagination)", "Data visualization principles: Choosing the right charts", "Empty states, loading skeletons, and error boundary UX"],
            tasks: ["Design an enterprise analytics dashboard with high data density", "Build custom interactive data table filters and bulk action bars", "Create a comprehensive set of loading, error, and zero-data states"],
            hoursRequired: 20
          },
          {
            title: "Conversational & AI-Native User Experience",
            topics: ["UX for Generative AI copilots and prompt interfaces", "Progressive disclosure and streaming text feedback loops", "Human-in-the-loop review and citation design patterns", "Preventing automation bias and building user trust in AI"],
            tasks: ["Design a contextual AI assistant modal with inline edit capabilities", "Create intuitive feedback components (Thumbs up/down, Regulate, Cite)", "Prototype a multi-turn conversation canvas with interactive suggestions"],
            hoursRequired: 18
          },
          {
            title: "Design Portfolio & Case Study Storytelling",
            topics: ["Case study structure: Context, Problem, Research, Iterations, Outcome", "Communicating business impact through measurable metrics", "Crafting an impressive personal portfolio website", "Design interview presentation and whiteboard design challenge prep"],
            tasks: ["Write 2 in-depth case studies with process photos, wireframes, and results", "Assemble and polish an interactive online design portfolio", "Complete a timed 45-minute whiteboard design challenge simulation"],
            hoursRequired: 20
          }
        ]
      }
    },
    projects: [
      {
        name: "Lumina - Neomorphic Health & Telehealth App",
        difficulty: "Beginner",
        tech: ["Figma", "User Research", "Prototyping", "WCAG 2.1"],
        description: "A patient-centric mobile telehealth application designed for intuitive doctor appointments, lab test tracking, and prescription refills.",
        features: ["Empathetic user research & personas", "High-contrast accessible color palette", "Interactive appointment booking prototype", "Figma mobile component library"]
      },
      {
        name: "Nexus - Enterprise SaaS Design System & Dashboard",
        difficulty: "Intermediate",
        tech: ["Figma Design Tokens", "Auto Layout 5.0", "Dev Mode", "Miro"],
        description: "A scalable, multi-theme design system and cloud analytics dashboard featuring 30+ reusable components, tokens, and data visualization patterns.",
        features: ["Complete Atomic Design token structure", "Dark and Light mode theme tokens", "Interactive data table with bulk sorting", "Developer handoff documentation"]
      },
      {
        name: "Aura - AI Creative Studio Workspace",
        difficulty: "Advanced",
        tech: ["Figma Variables", "Advanced Micro-interactions", "Smart Animate"],
        description: "An AI-native canvas interface allowing designers to co-create with LLMs, featuring progressive disclosure, inline prompt controls, and canvas node connections.",
        features: ["AI prompt streaming UX patterns", "Variable-driven canvas zoom and node dragging", "Comprehensive usability testing documentation", "End-to-end published portfolio case study"]
      }
    ],
    interviewPrep: {
      topics: ["Walking through a portfolio case study", "Critiquing an existing product UI/UX", "Solving a live Whiteboard Design Challenge", "Balancing business goals with user empathy", "Handling engineering and stakeholder pushback"],
      questions: [
        {
          q: "Walk me through your design process from ambiguity to high-fidelity prototype.",
          a: "I ground my process in Design Thinking: 1) Empathize: conduct user interviews and stakeholder sessions to uncover core pain points and business objectives. 2) Define: synthesize data into journey maps and 'How Might We' problem statements. 3) Ideate: sketch rapid low-fidelity paper wireframes and user flows to explore multiple divergent directions. 4) Prototype: build clickable medium-to-high fidelity Figma prototypes utilizing our design system. 5) Test & Iterate: run usability tests with real users, measure task completion, and refine based on evidence before final developer handoff."
        },
        {
          q: "How do you ensure your designs are accessible to users with disabilities?",
          a: "I design for accessibility (WCAG 2.1 AA standard) from day one, not as an afterthought. I ensure minimum 4.5:1 text contrast ratios, use accessible font sizes with clear visual hierarchy, never rely on color alone to communicate status (pairing colors with icons and text labels), ensure touch targets meet minimum 44x44px guidelines, support keyboard tab navigation, and provide clear ARIA labels and alt-text specs for screen reader compatibility."
        },
        {
          q: "What is the difference between UI and UX, and how do they inform each other?",
          a: "UX (User Experience) is the architectural and empathetic foundation: researching user needs, mapping information architecture, validating flows, and ensuring the product effectively solves a real problem. UI (User Interface) is the aesthetic and visual execution: typography, color theory, component design, spacing, and micro-interactions that make the product engaging and delightful. A product with great UI but poor UX is beautiful but unusable; a product with great UX but poor UI is functional but uninspiring. They must work symbiotically."
        },
        {
          q: "How do you decide between a dropdown menu, radio buttons, and a segmented control?",
          a: "It comes down to option count, screen real estate, and cognitive load. Radio buttons are best when there are 2 to 5 mutually exclusive options and you want all choices visible simultaneously to reduce clicks. Segmented controls are ideal for 2 to 4 options that switch immediate views or modes (like List vs Grid view). Dropdowns are reserved for 6 or more options (like selecting a country or state) where showing all choices at once would overwhelm the screen."
        },
        {
          q: "How do you handle a scenario where an executive or client wants a feature that your user research proves is harmful?",
          a: "I anchor the conversation in shared business goals rather than subjective opinions. First, I validate their underlying intent: 'What business outcome are we aiming for with this idea?' Second, I present concrete user evidence: show video clips from usability testing, heatmaps, or survey metrics demonstrating where users struggle. Third, I propose a collaborative compromise: 'Here is an alternative approach that achieves your business objective while preserving an intuitive user flow, and we can validate both with an A/B test.'"
        }
      ]
    }
  },

  "financial-analyst": {
    title: "Financial Analyst & Investment Specialist",
    skills: ["Financial Modeling", "DCF & Valuation Analysis", "Advanced Excel (VBA, Macros, Pivot)", "Financial Statement Analysis", "Ratio Analysis", "Budgeting & Forecasting", "Corporate Finance", "Accounting Principles (GAAP/IFRS)", "Equity Research", "Risk Management & Sensitivity Analysis", "Power BI & Dashboarding", "Capital Budgeting"],
    description: "Evaluates financial health, builds three-statement forecasting models, performs company valuations, and delivers strategic investment advice to leadership.",
    salary: "$75,000 - $135,000",
    roadmap: {
      beginner: {
        weeks: [
          {
            title: "Financial Statement Analysis & Core Accounting",
            topics: ["The 3 Financial Statements: Income Statement, Balance Sheet, Cash Flow", "How the 3 statements link together dynamically", "Working capital management and cash flow from operations", "Revenue recognition principles and depreciation methods"],
            tasks: ["Analyze Apple or Microsoft 10-K SEC filings", "Map the dynamic links connecting Net Income to the Balance Sheet and Cash Flow", "Calculate working capital cycles across 3 fiscal years"],
            hoursRequired: 12
          },
          {
            title: "Financial Ratio Analysis & Company Performance",
            topics: ["Liquidity ratios (Current, Quick ratio)", "Profitability ratios (Gross Margin, Operating Margin, ROE, ROIC)", "Leverage ratios (Debt-to-Equity, Interest Coverage)", "DuPont Analysis breakdown of Return on Equity"],
            tasks: ["Perform a complete financial ratio benchmark comparing two competitor firms", "Conduct a 5-step DuPont Analysis to identify operational drivers", "Write a 2-page company health evaluation memo"],
            hoursRequired: 14
          },
          {
            title: "Advanced Excel for Finance & Data Modeling",
            topics: ["Advanced formulas (INDEX/MATCH, XLOOKUP, OFFSET)", "Financial functions (NPV, IRR, PMT, XIRR)", "Data validation, dynamic named ranges, and sensitivity tables", "Excel best practices: color-coding inputs vs formulas (FAST standard)"],
            tasks: ["Build a financial calculation model using exclusively keyboard shortcuts", "Create two-way sensitivity tables analyzing interest rate impacts", "Automate monthly summary reporting using advanced Pivot Tables"],
            hoursRequired: 15
          },
          {
            title: "Time Value of Money & Capital Budgeting",
            topics: ["Present Value (PV), Future Value (FV), and Annuity math", "Net Present Value (NPV) vs Internal Rate of Return (IRR)", "Payback period and profitability index", "Evaluating capital investment proposals and project feasibility"],
            tasks: ["Model a $5M equipment acquisition proposal evaluating NPV and IRR", "Perform scenario analysis under optimistic, base, and pessimistic cases", "Draft an investment committee recommendation slide deck"],
            hoursRequired: 12
          }
        ]
      },
      intermediate: {
        weeks: [
          {
            title: "Three-Statement Integrated Financial Modeling",
            topics: ["Setting up historical financial data and standardized schedules", "Building supporting schedules: Depreciation, Debt, Working Capital", "Projecting revenues using volume-price drivers", "Balancing the balance sheet with a cash/revolver plug"],
            tasks: ["Build an integrated dynamic 3-statement financial model in Excel", "Forecast revenues and operating expenses across a 5-year horizon", "Ensure balance sheet balances across all projected years without hardcodes"],
            hoursRequired: 18
          },
          {
            title: "Discounted Cash Flow (DCF) Valuation",
            topics: ["Unlevered Free Cash Flow (UFCF) calculation from EBIT", "Weighted Average Cost of Capital (WACC) and CAPM model", "Terminal value calculation: Gordon Growth vs Exit Multiple method", "Discounting cash flows to derive Enterprise & Equity Value"],
            tasks: ["Calculate cost of equity and WACC for a publicly traded company", "Build an automated DCF valuation model in Excel", "Perform sensitivity analysis on terminal growth rate and discount rate"],
            hoursRequired: 18
          },
          {
            title: "Comparable Company Analysis (Comps & Precedents)",
            topics: ["Selecting peer group companies with similar operational profiles", "Trading multiples: EV/EBITDA, EV/Sales, P/E, P/B", "Precedent transactions analysis and control premiums", "Creating football field valuation comparison charts"],
            tasks: ["Build a trading comps model benchmarking 6 industry peers", "Normalize EBITDA for non-recurring and one-off items", "Construct a football field chart synthesizing DCF and Comps ranges"],
            hoursRequired: 16
          },
          {
            title: "Corporate Budgeting, Variance Analysis & FP&A",
            topics: ["Annual operating plan (AOP) budgeting processes", "Budget vs Actual (BvA) variance analysis", "Price-Volume-Mix (PVM) variance decomposition", "Management reporting and rolling quarterly forecast updates"],
            tasks: ["Conduct a monthly variance analysis identifying operational overspends", "Decompose revenue variance into price and volume components", "Build a dynamic FP&A rolling forecast template"],
            hoursRequired: 14
          }
        ]
      },
      advanced: {
        weeks: [
          {
            title: "Leveraged Buyout (LBO) Modeling Foundations",
            topics: ["LBO mechanics: Sponsors, debt financing, and sponsor returns", "Sources and Uses of funds schedules", "Debt paydown schedules and cash sweeps", "Calculating Internal Rate of Return (IRR) and Money-on-Money (MoIC)"],
            tasks: ["Build a standard 5-year paper LBO model in Excel", "Model senior debt vs mezzanine debt schedules with interest amortization", "Calculate sponsor IRR under various exit multiple scenarios"],
            hoursRequired: 20
          },
          {
            title: "Mergers & Acquisitions (M&A) Accretion/Dilution",
            topics: ["M&A deal structures: Cash, Stock, or Debt considerations", "Purchase price allocation, goodwill creation, and write-offs", "Synergy modeling (Cost synergies vs Revenue synergies)", "Accretion/Dilution analysis of buyer's Earnings Per Share (EPS)"],
            tasks: ["Model a corporate merger assessing post-transaction EPS accretion/dilution", "Quantify pre-tax cost synergies needed to breakeven", "Build sensitivity tables varying purchase price and cash/stock mix"],
            hoursRequired: 20
          },
          {
            title: "Financial Dashboarding with Power BI & Python",
            topics: ["Extracting financial data using Python (yfinance, SEC-EDGAR)", "Automating data cleaning and financial ratios with Pandas", "Building interactive executive dashboards in Power BI", "Visualizing financial health and cash burn metrics"],
            tasks: ["Write a Python script downloading and formatting historical financials", "Build an executive Power BI dashboard displaying dynamic EBITDA margins", "Set up scheduled data refreshes for automated reporting"],
            hoursRequired: 18
          },
          {
            title: "Equity Research & Investment Pitch Presentation",
            topics: ["Writing professional equity research initiations", "Evaluating competitive moats and management quality", "Synthesizing macro economic indicators (Inflation, Interest rates, GDP)", "Defending a Buy/Sell/Hold recommendation to an investment committee"],
            tasks: ["Draft a comprehensive 10-page Equity Research initiation report", "Build an interactive pitch deck with clear target price justification", "Participate in a mock investment committee defense session"],
            hoursRequired: 20
          }
        ]
      }
    },
    projects: [
      {
        name: "Integrated 3-Statement Forecasting Model",
        difficulty: "Beginner",
        tech: ["Microsoft Excel", "Financial Statements", "FAST Standards"],
        description: "A professional, fully dynamic 3-statement forecasting model for a publicly listed firm with operational schedules and automated checks.",
        features: ["Dynamic revenue and cost drivers", "Linked Depreciation and Debt schedules", "Automated balance check formulas", "Executive summary dashboard"]
      },
      {
        name: "Enterprise DCF & Comparable Valuation Model",
        difficulty: "Intermediate",
        tech: ["Excel", "WACC Analysis", "Capital IQ Mockups", "Trading Multiples"],
        description: "A comprehensive valuation model combining DCF and Peer Multiples with sensitivity tables and football field visual charts.",
        features: ["CAPM and WACC calculation tab", "5-year Unlevered Free Cash Flow schedule", "Trading comps peer benchmarking table", "Interactive football field valuation chart"]
      },
      {
        name: "Full-Scale LBO & M&A Buyout Model",
        difficulty: "Advanced",
        tech: ["Excel Advanced Modeling", "LBO Returns Engine", "Accretion/Dilution"],
        description: "A private equity style LBO buyout model evaluating returns, debt schedules, covenant checks, and sensitivity matrices.",
        features: ["Sources and Uses of funds schedule", "Dynamic revolver and debt waterfall", "Sponsor IRR and MoIC return tables", "Executive investment committee presentation deck"]
      }
    ],
    interviewPrep: {
      topics: ["How the 3 financial statements link together", "Walk me through a DCF valuation step-by-step", "Enterprise Value vs Equity Value definitions", "Accretive vs Dilutive M&A transactions", "Working capital impact on cash flow"],
      questions: [
        {
          q: "Walk me through how a $10 increase in depreciation flows through the 3 financial statements (assume 20% tax rate).",
          a: "1) Income Statement: Operating income (EBIT) decreases by $10. With a 20% tax rate, Net Income decreases by $8 ($10 minus $2 tax savings). 2) Cash Flow Statement: Net income starts $8 lower, but since depreciation is a non-cash expense, we add back the full $10 in Cash Flow from Operations. Net Cash Flow increases by $2. 3) Balance Sheet: Cash increases by $2, but Net PP&E decreases by $10 due to depreciation, so Total Assets decrease by $8. On the Liabilities & Equity side, Retained Earnings decreases by $8 due to the drop in Net Income. Both sides balance at -$8."
        },
        {
          q: "What is the difference between Enterprise Value and Equity Value?",
          a: "Equity Value represents the value of a company that is attributable solely to its equity shareholders (equal to Share Price × Diluted Shares Outstanding). Enterprise Value (EV) represents the total operating value of the entire business attributable to all capital providers—both debt and equity holders. It is calculated as Equity Value + Total Debt + Preferred Stock + Minority Interest - Cash and Cash Equivalents."
        },
        {
          q: "Why do we subtract cash when calculating Enterprise Value?",
          a: "Because cash is considered a non-operating asset. If an acquirer purchases a company, they inherit that cash immediately, which effectively reduces the net purchase price needed to acquire the underlying core operations. Alternatively, cash can be immediately used to pay down debt."
        },
        {
          q: "Walk me through how to calculate WACC.",
          a: "Weighted Average Cost of Capital (WACC) represents the blended required rate of return for a company's capital structure. Formula: WACC = (E/V × Ke) + (D/V × Kd × (1 - t)), where E is Market Equity Value, D is Market Debt Value, V is total capital (E + D), Ke is Cost of Equity (calculated via CAPM: Risk-Free Rate + Beta × Equity Risk Premium), Kd is Pre-tax Cost of Debt, and t is the marginal corporate tax rate (reflecting the tax deductibility of interest)."
        },
        {
          q: "If two companies have the exact same operations and revenue, why might one trade at a higher P/E multiple?",
          a: "Several key factors: 1) Higher expected future growth rates (investors pay a premium for faster growth). 2) Higher Return on Invested Capital (ROIC) requiring less capital reinvestment. 3) Lower cost of capital or lower financial leverage (less debt risk). 4) Higher competitive moat or better earnings quality and predictability. 5) Differences in accounting policies."
        }
      ]
    }
  },

  "digital-marketer": {
    title: "Digital Marketing & Growth Strategist",
    skills: ["Search Engine Optimization (SEO)", "Google Analytics 4 (GA4)", "Content Strategy & Copywriting", "Performance Marketing (Google Ads, Meta Ads)", "Email Marketing & Automation", "Conversion Rate Optimization (CRO)", "Social Media Marketing", "CRM Management (HubSpot)", "A/B Split Testing", "Brand Positioning & Messaging"],
    description: "Drives scalable customer acquisition, builds recognizable brand authority, and optimizes end-to-end user conversion funnels across digital channels.",
    salary: "$65,000 - $115,000",
    roadmap: {
      beginner: {
        weeks: [
          {
            title: "Digital Marketing Foundations & Consumer Psychology",
            topics: ["The Digital Marketing Ecosystem: Owned, Earned, Paid media", "Marketing Funnels: Top (TOFU), Middle (MOFU), Bottom (BOFU)", "Customer journey mapping and value propositions", "Copywriting fundamentals: AIDA and PAS formulas"],
            tasks: ["Map out a customer conversion funnel for a direct-to-consumer brand", "Write 3 high-converting ad copy variations using the PAS formula", "Analyze and document the brand positioning of 3 rival market leaders"],
            hoursRequired: 10
          },
          {
            title: "Search Engine Optimization (SEO) Core Principles",
            topics: ["How search engines crawl, index, and rank content", "Keyword research using Semrush, Ahrefs, or Google Keyword Planner", "On-Page SEO: Title tags, meta descriptions, header tags, keyword density", "Technical SEO basics: Site speed, sitemaps, robots.txt, canonical tags"],
            tasks: ["Perform keyword research finding 20 high-volume, low-competition keywords", "Optimize 3 existing blog articles for targeted search intent and readability", "Run a technical SEO audit using Screaming Frog and fix crawl errors"],
            hoursRequired: 12
          },
          {
            title: "Google Analytics 4 (GA4) & Performance Tracking",
            topics: ["GA4 data model: Events and parameters vs Universal Analytics", "Setting up custom conversion events and tracking goals", "Traffic acquisition reports: Organic, Direct, Paid, Referral", "Creating UTM tracking links for campaign attribution"],
            tasks: ["Configure custom GA4 event tracking for form submissions and button clicks", "Generate standardized UTM links for a multi-channel campaign", "Build an analytical report identifying top-performing acquisition channels"],
            hoursRequired: 14
          },
          {
            title: "Social Media Strategy & Organic Content Creation",
            topics: ["Platform dynamics: LinkedIn vs Instagram vs TikTok vs YouTube", "Content calendar planning and batching workflows", "Engaging visual design basics with Canva or Adobe Express", "Community engagement, hashtag strategies, and social metrics"],
            tasks: ["Create a 30-day multi-channel social media editorial calendar", "Design 5 branded graphic carousel posts with clear calls-to-action", "Analyze engagement rates and audience demographics across platforms"],
            hoursRequired: 12
          }
        ]
      },
      intermediate: {
        weeks: [
          {
            title: "Performance Marketing: Meta & Instagram Ads",
            topics: ["Meta Business Manager & Pixel setup", "Campaign structures: Awareness, Traffic, Leads, Conversions", "Audience targeting: Broad, Custom Audiences, Lookalikes (LAL)", "Creative testing methodologies and ad fatigue management"],
            tasks: ["Set up a mock Meta Ads conversion campaign with 3 ad sets", "Build custom audiences based on website visitors and customer lists", "Analyze Cost-Per-Click (CPC) and Return On Ad Spend (ROAS) metrics"],
            hoursRequired: 16
          },
          {
            title: "Search Engine Marketing: Google Ads & PPC",
            topics: ["Google Search vs Display vs Performance Max campaigns", "Match types: Exact, Phrase, Broad match and Negative keywords", "Quality Score factors: Ad relevance, expected CTR, landing page experience", "Bidding strategies: Maximize Conversions, Target CPA, Target ROAS"],
            tasks: ["Structure a Google Search campaign with targeted ad groups", "Write responsive search ads achieving 'Excellent' ad strength scores", "Optimize search terms report adding negative keywords to reduce wasted spend"],
            hoursRequired: 16
          },
          {
            title: "Email Marketing, CRM & Marketing Automation",
            topics: ["Email marketing tools: Klaviyo, Mailchimp, or HubSpot", "List segmentation and lead magnet opt-in mechanisms", "Automated drip sequences: Welcome series, Abandoned cart, Re-engagement", "Deliverability best practices, open rates, and spam compliance"],
            tasks: ["Design a 4-email automated welcome onboarding series", "Create an automated abandoned cart flow with behavioral triggers", "A/B test email subject lines to lift open rates above 35%"],
            hoursRequired: 15
          },
          {
            title: "Conversion Rate Optimization (CRO) & Landing Pages",
            topics: ["Anatomy of a high-converting landing page", "User behavior tracking with Hotjar/Clarity (Heatmaps, Session recordings)", "Identifying friction points and conversion leaks", "Running A/B split tests on headlines, forms, and CTA buttons"],
            tasks: ["Build a high-converting landing page using Webflow, Unbounce, or WordPress", "Analyze session recordings to identify where users abandon checkout", "Design and document an A/B test plan predicting a +15% conversion lift"],
            hoursRequired: 14
          }
        ]
      },
      advanced: {
        weeks: [
          {
            title: "Growth Hacking, Virality & Referral Marketing",
            topics: ["Growth loop frameworks vs linear marketing funnels", "Building viral referral loops and gamified incentive structures", "Influencer marketing outreach, contracts, and attribution tracking", "Product-led acquisition tactics and co-marketing partnerships"],
            tasks: ["Design a viral referral loop program modeled after Dropbox or Uber", "Develop an influencer partnership briefing document and ROI forecast", "Implement an automated review-generation campaign for social proof"],
            hoursRequired: 18
          },
          {
            title: "Omnichannel Attribution & Marketing Analytics",
            topics: ["Attribution models: First-click, Last-click, Linear, Data-driven", "Customer Lifetime Value (LTV) vs Customer Acquisition Cost (CAC)", "Marketing mix modeling (MMM) and incrementality testing", "Building automated multi-channel reporting dashboards in Looker Studio"],
            tasks: ["Build a consolidated executive dashboard in Google Looker Studio", "Compare channel ROI across First-Touch vs Data-Driven attribution", "Calculate blended vs paid CAC across quarterly marketing spend"],
            hoursRequired: 18
          },
          {
            title: "AI-Powered Marketing & Workflow Automation",
            topics: ["Leveraging Generative AI for copywriting, SEO, and ad variations", "Automated marketing workflows with Zapier and Make", "Programmatic SEO for generating thousands of targeted landing pages", "AI personalization engines for dynamic website experiences"],
            tasks: ["Build an automated Zapier workflow connecting ad leads to CRM and Slack", "Use AI to research and generate 10 SEO content clusters with schema markup", "Implement a dynamic personalization module tailoring offers by visitor source"],
            hoursRequired: 20
          },
          {
            title: "Marketing Leadership & Go-To-Market (GTM) Strategy",
            topics: ["Crafting a comprehensive Go-To-Market (GTM) launch strategy", "Marketing budget allocation across brand vs performance channels", "Hiring and managing agency partners and creative teams", "Pitching marketing growth plans to executive leadership"],
            tasks: ["Author an end-to-end GTM plan for a new digital product launch", "Create a $250k annual marketing budget allocation model with forecasted ROI", "Deliver an executive presentation defending growth strategy to stakeholders"],
            hoursRequired: 20
          }
        ]
      }
    },
    projects: [
      {
        name: "Omnichannel E-Commerce Launch & Acquisition Campaign",
        difficulty: "Beginner",
        tech: ["Meta Ads", "Google Ads", "Klaviyo", "Canva"],
        description: "A complete launch strategy for an online lifestyle brand, featuring ad creatives, audience targeting, and automated email nurturing funnels.",
        features: ["Target persona profiles & value props", "Meta & Google Ads campaign blueprints", "4-part automated email welcome sequence", "Budget and revenue forecast model"]
      },
      {
        name: "B2B Organic SEO & Content Inbound Growth Engine",
        difficulty: "Intermediate",
        tech: ["Semrush", "GA4", "WordPress", "Looker Studio"],
        description: "A data-driven content marketing and technical SEO strategy designed to grow organic monthly search traffic by 300% over 6 months.",
        features: ["Comprehensive keyword research matrix", "Technical SEO audit and remediation checklist", "Content cluster hub-and-spoke strategy", "Automated Looker Studio performance dashboard"]
      },
      {
        name: "End-to-End Growth Hacking & Marketing Automation Funnel",
        difficulty: "Advanced",
        tech: ["Zapier", "HubSpot", "Hotjar", "Looker Studio", "Webflow"],
        description: "An advanced acquisition and conversion optimization system integrating CRO heatmaps, automated CRM lead routing, and multi-touch attribution.",
        features: ["High-converting Webflow landing page", "A/B test hypothesis and statistical analysis", "Zapier + HubSpot automated lead scoring workflow", "Multi-touch attribution revenue model"]
      }
    ],
    interviewPrep: {
      topics: ["How to reduce Customer Acquisition Cost (CAC)", "Diagnosing sudden organic search traffic drops", "Designing an A/B test from scratch", "Attribution modeling tradeoffs", "Allocating a $100K marketing budget across channels"],
      questions: [
        {
          q: "If your organic search traffic suddenly drops by 30% overnight, how do you investigate?",
          a: "I follow a methodical checklist: 1) Verify tracking: Did GA4 tags break or tracking code disappear during a site update? 2) Check Google Search Console: Are impressions down or just clicks? Look for manual action penalties or security issues. 3) Segment the drop: Is the decline sitewide or isolated to specific landing pages, categories, or countries? 4) Technical audit: Check for recent code deployments that added accidental 'noindex' tags, robots.txt disallows, or 404 broken redirects. 5) External factors: Check if a major Google Core Algorithm update rolled out or if competitors outranked core keywords."
        },
        {
          q: "What is the difference between CPC, CPA, and ROAS?",
          a: "CPC (Cost Per Click) measures the direct cost for a single visitor clicking on an ad. CPA (Cost Per Acquisition/Action) measures the total cost required to generate a specific conversion outcome (such as a sign-up, lead, or purchase). ROAS (Return On Ad Spend) measures the gross revenue generated for every dollar spent on advertising (Revenue / Ad Spend). For example, a $5,000 ad spend generating $25,000 in revenue yields a 5x or 500% ROAS."
        },
        {
          q: "How do you decide between First-Touch and Last-Touch attribution?",
          a: "First-Touch attribution credits 100% of the conversion to the initial channel where the user first discovered your brand, making it ideal for evaluating top-of-funnel brand awareness campaigns. Last-Touch credits 100% to the final channel the user clicked before buying (often retargeting or branded search), making it useful for evaluating conversion closers. However, both oversimplify user journeys; modern growth teams prioritize Data-Driven or Multi-Touch attribution to understand the full collaborative funnel."
        },
        {
          q: "What makes a landing page convert at a high rate?",
          a: "High-converting landing pages eliminate distraction and maximize relevance: 1) A clear, compelling headline matching the visitor's search intent. 2) A concise value proposition addressing core user pain points. 3) Strong social proof (testimonials, customer logos, Trustpilot ratings). 4) A prominent, single primary Call-to-Action (CTA) above the fold. 5) Minimal form fields reducing friction. 6) Fast mobile page load speeds under 2 seconds. 7) Reassurance signals (money-back guarantees, security badges)."
        },
        {
          q: "How would you allocate a $100,000 marketing budget for a newly launched B2B SaaS product?",
          a: "I'd use a 70/20/10 strategic split: 70% ($70K) on proven, high-intent acquisition channels (e.g. Google Search capturing active buyers searching for software solutions, and targeted LinkedIn Ads focused on specific job titles). 20% ($20K) on compounding long-term organic assets (high-authority content marketing, technical SEO, and building high-converting landing pages). 10% ($10K) on experimental bets (influencer partnerships, webinar co-marketing, or podcast sponsorships). I'd monitor blended CAC and payback period weekly."
        }
      ]
    }
  },

  "biomedical-scientist": {
    title: "Biomedical & Healthcare Scientist",
    skills: ["Molecular Biology Techniques", "Clinical Trial Protocols (GCP)", "Good Laboratory Practices (GLP)", "Bioethics & Patient Privacy (HIPAA)", "Biostatistics & R", "Biochemistry & Cellular Signaling", "Pathology Fundamentals", "Medical Scientific Writing", "Bioinformatics (NCBI, BLAST)", "Laboratory Quality Assurance", "Drug Discovery Lifecycles"],
    description: "Investigates human disease mechanisms, oversees clinical trial protocols, evaluates biological therapeutic efficacy, and validates healthcare innovations.",
    salary: "$70,000 - $130,000",
    roadmap: {
      beginner: {
        weeks: [
          {
            title: "Cellular Biology, Genetics & Human Physiology",
            topics: ["Cell structure, organelle functions, and membrane transport", "DNA replication, transcription, translation, and genetic mutations", "Human organ systems and homeostatic regulation mechanisms", "Cell signaling cascades and receptor-ligand interactions"],
            tasks: ["Construct detailed diagrams of cellular signaling pathways", "Analyze DNA sequences identifying point mutations and frameshift alterations", "Review physiological responses to metabolic stress in clinical case studies"],
            hoursRequired: 12
          },
          {
            title: "Laboratory Safety & Standard Laboratory Techniques",
            topics: ["Good Laboratory Practices (GLP) and Biosafety Levels (BSL 1-4)", "Standard operating procedures (SOPs) and hazardous chemical management", "Pipetting accuracy, reagent preparation, and serial dilutions", "Principles of microscopy (Brightfield, Fluorescent, Confocal)"],
            tasks: ["Draft a complete Standard Operating Procedure (SOP) for reagent preparation", "Perform serial dilution calculations and plot standard absorbance curves", "Audit simulated laboratory safety protocols against OSHA guidelines"],
            hoursRequired: 12
          },
          {
            title: "Core Molecular Biology Assays (PCR & Gel Electrophoresis)",
            topics: ["Polymerase Chain Reaction (PCR) primer design and cycling parameters", "Agarose gel electrophoresis and DNA band quantification", "Quantitative Real-Time PCR (qPCR) and SYBR vs TaqMan chemistry", "Troubleshooting non-specific amplification and contamination"],
            tasks: ["Design specific forward and reverse primers for a target human gene", "Analyze mock gel electrophoresis results to verify DNA fragment sizes", "Calculate relative gene expression fold-changes using the 2^(-ΔΔCt) method"],
            hoursRequired: 15
          },
          {
            title: "Bioinformatics Fundamentals & Genomic Databases",
            topics: ["Navigating NCBI GenBank, UniProt, and Ensembl databases", "Pairwise and multiple sequence alignment using BLAST", "Identifying single nucleotide polymorphisms (SNPs) and disease links", "Protein structure visualization with PyMOL or AlphaFold database"],
            tasks: ["Run a BLAST query to identify an unknown pathogenic DNA sequence", "Analyze a clinical SNP associated with hereditary disease risk", "Render and annotate a 3D protein active site binding pocket in PyMOL"],
            hoursRequired: 14
          }
        ]
      },
      intermediate: {
        weeks: [
          {
            title: "Biostatistics & Medical Data Analysis (R / GraphPad)",
            topics: ["Biostatistical analysis: T-tests, ANOVA, and survival analysis (Kaplan-Meier)", "Odds ratios, relative risk, and clinical sensitivity/specificity", "Statistical power calculation and clinical sample size determination", "Data visualization of biological replicates and error bars"],
            tasks: ["Conduct survival analysis and plot Kaplan-Meier curves for a drug study", "Calculate diagnostic sensitivity, specificity, and ROC-AUC curves", "Perform statistical significance testing in R or GraphPad Prism"],
            hoursRequired: 16
          },
          {
            title: "Immunology & Protein Assays (ELISA & Western Blot)",
            topics: ["Innate and adaptive immune system mechanics", "Enzyme-Linked Immunosorbent Assay (ELISA: Direct, Indirect, Sandwich)", "Western Blotting workflow: Protein extraction, SDS-PAGE, antibody probing", "Flow cytometry principles and fluorescence-activated cell sorting (FACS)"],
            tasks: ["Design a sandwich ELISA protocol for cytokine quantification", "Analyze Western blot densitometry to quantify protein phosphorylation", "Interpret 2D flow cytometry scatter plots distinguishing cell subsets"],
            hoursRequired: 16
          },
          {
            title: "Drug Discovery Pipeline & Preclinical Testing",
            topics: ["Stages of drug discovery: Target identification to lead optimization", "In vitro vs in vivo disease models and animal ethics (IACUC)", "Pharmacokinetics (PK: ADME) and Pharmacodynamics (PD)", "High-throughput screening and IC50 determination"],
            tasks: ["Map out the 12-year lifecycle of a small-molecule drug from lab to market", "Calculate IC50 values and dose-response curves for an experimental inhibitor", "Author an animal welfare compliance summary for preclinical research"],
            hoursRequired: 15
          },
          {
            title: "Good Clinical Practice (GCP) & Clinical Trial Phases",
            topics: ["ICH-GCP guidelines and Institutional Review Board (IRB) ethics", "Clinical trial phases: Phase I (Safety), II (Efficacy), III (Pivotal), IV (Post-market)", "Informed consent protocols and vulnerable patient protection", "Adverse Event (AE) and Serious Adverse Event (SAE) reporting"],
            tasks: ["Draft a comprehensive Informed Consent Form compliant with GCP", "Design a Phase II randomized double-blind clinical trial protocol", "Write an adverse event classification report for a clinical study audit"],
            hoursRequired: 15
          }
        ]
      },
      advanced: {
        weeks: [
          {
            title: "Genomic Medicine & Next-Generation Sequencing (NGS)",
            topics: ["Next-Generation Sequencing (NGS) workflows (Illumina, PacBio)", "RNA-Seq for whole-transcriptome profiling and differential expression", "Variant calling pipelines and filtering criteria (GATK)", "CRISPR-Cas9 gene editing mechanisms and therapeutic delivery"],
            tasks: ["Analyze an RNA-Seq differential gene expression dataset", "Evaluate off-target cleavage risks for a CRISPR-Cas9 therapeutic guide RNA", "Interpret clinical genomic variant reports according to ACMG guidelines"],
            hoursRequired: 20
          },
          {
            title: "Regulatory Affairs (FDA / EMA) & Healthcare Compliance",
            topics: ["FDA regulatory pathways: IND, NDA, BLA, and 510(k) clearances", "Quality management systems (QMS: ISO 13485) and audit readiness", "HIPAA regulations and electronic protected health information (ePHI)", "Fast Track, Breakthrough Therapy, and Accelerated Approval designations"],
            tasks: ["Compile the chemistry, manufacturing, and control (CMC) section of an IND", "Build a clinical compliance risk matrix for medical device regulatory audits", "Author an executive briefing on accelerated approval pathway feasibility"],
            hoursRequired: 18
          },
          {
            title: "Personalized Medicine & Biomarker Discovery",
            topics: ["Companion diagnostics (CDx) development and validation", "Liquid biopsy and circulating tumor DNA (ctDNA) detection", "Immunotherapy mechanisms: Checkpoint inhibitors (PD-1/CTLA-4) and CAR-T", "Predictive vs prognostic disease biomarkers"],
            tasks: ["Propose a companion diagnostic validation study for an oncology therapeutic", "Map out the cellular engineering process for CAR-T cell manufacturing", "Analyze biomarker expression data to stratify patient responder cohorts"],
            hoursRequired: 20
          },
          {
            title: "Scientific Manuscript Writing & Research Presentation",
            topics: ["Structuring peer-reviewed manuscripts: IMRAD format", "Publication ethics, peer review responses, and open science data sharing", "Translating complex laboratory findings for clinical physicians and patients", "Grant proposal writing for NIH/granting bodies"],
            tasks: ["Author a complete scientific research manuscript following IMRAD format", "Draft a formal response letter to peer-review critique comments", "Deliver a 10-minute slide presentation summarizing experimental findings"],
            hoursRequired: 20
          }
        ]
      }
    },
    projects: [
      {
        name: "Oncology Biomarker Identification & Expression Study",
        difficulty: "Beginner",
        tech: ["NCBI/BLAST", "GraphPad Prism", "qPCR Data Analysis"],
        description: "An in silico and laboratory data analysis study identifying differential expression of an oncogene across human tissue types.",
        features: ["Genomic sequence alignment analysis", "qPCR fold-change calculation workbook", "Statistical significance evaluation", "Scientific poster summary layout"]
      },
      {
        name: "Phase II Clinical Trial Protocol Design & GCP Plan",
        difficulty: "Intermediate",
        tech: ["ICH-GCP Guidelines", "IRB Documentation", "Biostatistics"],
        description: "A comprehensive clinical trial protocol for an innovative therapeutic, including statistical power sizing, inclusion criteria, and ethical safeguards.",
        features: ["Complete trial protocol document", "Informed consent form and patient leaflet", "Statistical analysis plan with sample sizing", "Adverse event reporting flowchart"]
      },
      {
        name: "RNA-Seq Differential Expression & Drug Repurposing Pipeline",
        difficulty: "Advanced",
        tech: ["R Programming", "DESeq2", "Bioconductor", "Pathway Analysis"],
        description: "A computational bioinformatics study analyzing patient transcriptome RNA-Seq data to identify novel drug repurposing candidates for rare diseases.",
        features: ["Quality control and read alignment scripts", "Differential gene expression volcano plots", "GO and KEGG pathway enrichment analysis", "Publication-ready manuscript draft"]
      }
    ],
    interviewPrep: {
      topics: ["Principles of PCR and primer design", "Understanding the phases of clinical trials", "How to calculate sensitivity, specificity, and positive predictive value", "Good Laboratory Practice and audit compliance", "Ethical considerations in patient research"],
      questions: [
        {
          q: "What is the difference between diagnostic Sensitivity and Specificity?",
          a: "Sensitivity is the true positive rate: the probability that the test correctly identifies individuals who have the disease (True Positives / [True Positives + False Negatives]). Specificity is the true negative rate: the probability that the test correctly identifies individuals who do not have the disease (True Negatives / [True Negatives + False Positives]). A highly sensitive test is ideal for initial screening, while a highly specific test confirms diagnosis with minimal false alarms."
        },
        {
          q: "Explain the four phases of human clinical trials.",
          a: "Phase I tests a small cohort (20-100 healthy volunteers or end-stage patients) to evaluate safety, safe dosage ranges, and pharmacokinetics. Phase II tests a larger group (100-300 patient volunteers) to evaluate efficacy, preliminary therapeutic benefits, and short-term side effects. Phase III tests large populations (1,000-5,000 patients across diverse hospitals) in randomized double-blind studies to definitively prove superiority or equivalence against standard of care. Phase IV occurs post-FDA approval to monitor long-term safety, rare side effects, and real-world outcomes."
        },
        {
          q: "How does Quantitative Real-Time PCR (qPCR) differ from standard endpoint PCR?",
          a: "Standard PCR is qualitative or semi-quantitative: it amplifies DNA over cycles and only measures the total product at the very end using gel electrophoresis, which has poor precision due to plateau effects. qPCR measures DNA amplification in real time during the exponential phase using fluorescent dyes (like SYBR Green) or sequence-specific probes (like TaqMan), allowing precise quantification of initial template copy numbers."
        },
        {
          q: "What is Good Clinical Practice (GCP) and why was it established?",
          a: "GCP is an international ethical and quality standard (ICH E6) for designing, conducting, recording, and reporting trials that involve human subjects. It was established following historical bioethical violations (such as Nuremberg and Tuskegee) to ensure that the rights, safety, and well-being of trial subjects are protected, and that clinical trial data is credible, verifiable, and scientifically robust."
        },
        {
          q: "How do you handle a situation where experimental laboratory data contradicts your primary scientific hypothesis?",
          a: "As a scientist, I embrace negative or unexpected results with objectivity. First, I verify experimental controls and reagents to rule out technical artifacts, pipetting errors, contamination, or equipment miscalibration. Second, if the unexpected findings replicate consistently across independent runs, I re-examine the underlying biological assumptions. Often, contradictory data reveals novel mechanistic feedback loops or off-target pathways that lead to higher-impact discoveries."
        }
      ]
    }
  },

  "mechanical-engineer": {
    title: "Mechanical & Systems Engineer",
    skills: ["AutoCAD", "SolidWorks 3D Modeling", "Finite Element Analysis (FEA)", "Thermodynamics & Heat Transfer", "Fluid Mechanics", "Geometric Dimensioning & Tolerancing (GD&T)", "Materials Science & Selection", "MATLAB & Simulink", "Lean Manufacturing & Six Sigma", "Prototyping & 3D Printing", "Mechatronics & Actuators"],
    description: "Designs, simulates, and manufactures physical machinery, electromechanical assemblies, thermal management systems, and structural products.",
    salary: "$75,000 - $125,000",
    roadmap: {
      beginner: {
        weeks: [
          {
            title: "Engineering Drawings & 2D Drafting (AutoCAD)",
            topics: ["Orthographic projections and isometric views", "Drafting standards: Title blocks, line weights, and dimensioning", "Sectional views, detail views, and auxiliary projections", "AutoCAD layer management, blocks, and scale plotting"],
            tasks: ["Draft a standardized 2D orthographic drawing of an engineered bracket", "Create sectional views detailing internal threading and counterbores", "Plot drawings to PDF adhering strictly to ANSI/ISO drawing standards"],
            hoursRequired: 12
          },
          {
            title: "3D Parametric CAD Modeling (SolidWorks)",
            topics: ["Parametric sketch relations and fully defined geometry", "Extrusions, revolves, sweeps, and lofted 3D features", "Fillets, chamfers, shell operations, and draft angles for molding", "Bottom-up multi-part assembly modeling and mechanical mates"],
            tasks: ["Model a 3D transmission gearbox housing in SolidWorks", "Assemble 8 individual parts with rotational and coincident mates", "Check assemblies for mechanical interference and clearance gaps"],
            hoursRequired: 15
          },
          {
            title: "Geometric Dimensioning & Tolerancing (GD&T)",
            topics: ["Importance of GD&T in interchangeable manufacturing", "Datums, feature control frames, and basic dimensions", "Form and orientation tolerances (Flatness, Parallelism, Perpendicularity)", "Location and runout tolerances (True Position, Maximum Material Condition - MMC)"],
            tasks: ["Apply GD&T feature control frames to an assembly bearing mount", "Calculate tolerance stack-up analysis across a 4-part pinned linkage", "Specify MMC modifiers to optimize manufacturing tooling costs"],
            hoursRequired: 14
          },
          {
            title: "Statics & Strength of Materials",
            topics: ["Free body diagrams (FBD) and equilibrium equations", "Stress, strain, Young's modulus, and Poisson's ratio", "Shear force and bending moment diagrams for beams", "Factor of Safety (FOS) and Mohr's circle stress analysis"],
            tasks: ["Calculate reactions and draw shear-moment diagrams for a loaded beam", "Determine minimum shaft diameter preventing torsional shear failure", "Calculate structural Factor of Safety under dynamic mechanical loads"],
            hoursRequired: 14
          }
        ]
      },
      intermediate: {
        weeks: [
          {
            title: "Finite Element Analysis (FEA / ANSYS / SolidWorks Sim)",
            topics: ["FEA principles: Meshing, nodes, and element types (Tetrahedral vs Hex)", "Boundary conditions: Fixed supports, pin joints, and applied loads", "Interpreting Von Mises stress, displacement, and safety factor plots", "Mesh convergence studies to eliminate discretization errors"],
            tasks: ["Perform static linear structural FEA on a lightweight suspension arm", "Conduct a mesh convergence test proving solution stability within 3%", "Optimize component geometry reducing mass by 20% while retaining FOS > 2.0"],
            hoursRequired: 18
          },
          {
            title: "Materials Science, Metallurgy & Manufacturing Processes",
            topics: ["Metals, polymers, ceramics, and composite properties", "Heat treatment processes (Annealing, Quenching, Tempering)", "CNC machining, injection molding, sheet metal stamping, and casting", "Design for Manufacturability and Assembly (DFMA) guidelines"],
            tasks: ["Select optimal materials for high-temperature turbine environments", "Design a sheet metal enclosure specifying bend radii and K-factors", "Redesign an assembly using DFMA to cut total part count by 35%"],
            hoursRequired: 16
          },
          {
            title: "Thermodynamics & Heat Transfer Analysis",
            topics: ["First and Second Laws of Thermodynamics and thermodynamic cycles", "Conduction (Fourier's Law), Convection (Newton's Law), Radiation", "Heat exchangers and thermal resistance network modeling", "Thermal management of electronics and battery packs"],
            tasks: ["Size an aluminum finned heat sink cooling a 65W microchip", "Model steady-state heat conduction across composite wall layers", "Simulate convective thermal dissipation using thermal simulation tools"],
            hoursRequired: 16
          },
          {
            title: "Fluid Mechanics & Computational Fluid Dynamics (CFD)",
            topics: ["Fluid statics, Bernoulli's equation, and Reynolds number", "Laminar vs turbulent boundary layer flow", "Pipe flow pressure drops and Darcy-Weisbach friction factors", "CFD simulation setup: Inlets, outlets, and fluid-solid interfaces"],
            tasks: ["Calculate head losses and pump power requirements for a piping system", "Run a 2D CFD simulation evaluating aerodynamic drag over an airfoil", "Optimize internal duct geometry minimizing turbulent pressure drops"],
            hoursRequired: 16
          }
        ]
      },
      advanced: {
        weeks: [
          {
            title: "Mechatronics, Sensors & Actuator Integration",
            topics: ["Selecting electric motors: Stepper vs DC vs Servo motors", "Motor torque-speed curves and gearbox transmission sizing", "Sensors: Encoders, limit switches, strain gauges, and IMUs", "Microcontroller integration with Arduino/Raspberry Pi for closed-loop control"],
            tasks: ["Size a planetary gearbox and stepper motor to lift a 20kg gantry", "Wire and program an Arduino closed-loop PID position controller", "Design a custom PCB layout and mounting bracket for onboard sensors"],
            hoursRequired: 20
          },
          {
            title: "Dynamic Systems Simulation with MATLAB & Simulink",
            topics: ["Differential equations of mass-spring-damper mechanical systems", "State-space modeling and transfer functions", "Simulink block diagram modeling and transient response analysis", "Vibration analysis, natural frequencies, and resonance avoidance"],
            tasks: ["Model a quarter-car active automotive suspension in Simulink", "Tune a PID controller achieving minimal overshoot and fast settling time", "Perform modal frequency analysis preventing mechanical resonance"],
            hoursRequired: 20
          },
          {
            title: "Product Lifecycle Management (PLM) & Engineering Change Orders",
            topics: ["PLM systems (Teamcenter, Windchill, Autodesk Vault)", "Engineering Bill of Materials (EBOM) vs Manufacturing BOM (MBOM)", "Engineering Change Order (ECO/ECN) workflows and revision control", "ISO 9001 quality audits and Failure Modes & Effects Analysis (FMEA)"],
            tasks: ["Create a structured multi-level EBOM for a complex robotic product", "Conduct a complete Design FMEA (DFMEA) calculating risk priority numbers", "Process an Engineering Change Order documenting root-cause revisions"],
            hoursRequired: 18
          },
          {
            title: "Electromechanical Capstone Design & Prototyping",
            topics: ["Rapid prototyping with FDM/SLA 3D printing and CNC milling", "Physical assembly, mechanical troubleshooting, and alignment", "Empirical testing vs theoretical simulation correlation", "Comprehensive technical design documentation and presentation"],
            tasks: ["Fabricate, 3D print, and assemble a physical multi-part mechanism", "Instrument prototype with strain gauges to correlate with FEA results", "Deliver a comprehensive engineering design review presentation"],
            hoursRequired: 22
          }
        ]
      }
    },
    projects: [
      {
        name: "Precision Mechanical Linkage & Actuator Assembly",
        difficulty: "Beginner",
        tech: ["SolidWorks", "AutoCAD", "GD&T", "3D Printing"],
        description: "A fully constrained mechanical four-bar linkage mechanism featuring precision bearing mounts, detailed drawings, and 3D printed verification.",
        features: ["Fully parametric 3D CAD model", "Standardized orthographic 2D drawings with GD&T", "Assembly motion study and clearance analysis", "3D printable STL files with optimal tolerances"]
      },
      {
        name: "EV Battery Pack Thermal Management Unit",
        difficulty: "Intermediate",
        tech: ["SolidWorks Flow Simulation / CFD", "Heat Transfer", "Materials"],
        description: "A liquid-cooled heat sink and enclosure designed to regulate battery cell temperatures between 25°C and 40°C during fast-charging cycles.",
        features: ["Thermal resistance network mathematical model", "Conjugate heat transfer CFD simulation", "Fluid pressure drop optimization", "Manufacturing DFMA design brief"]
      },
      {
        name: "Automated Robotic Pick-and-Place Gantry System",
        difficulty: "Advanced",
        tech: ["MATLAB/Simulink", "FEA Structural Analysis", "Mechatronics"],
        description: "An industrial 3-axis Cartesian gantry robot, including finite element structural verification, stepper motor sizing, and closed-loop PID control.",
        features: ["Static & modal FEA proving FOS > 2.5", "Simulink dynamic simulation model", "Complete multi-level Bill of Materials (BOM)", "Full electrical and mechanical integration schematics"]
      }
    ],
    interviewPrep: {
      topics: ["Interpreting stress-strain curves (Yield vs Ultimate tensile strength)", "Explaining GD&T feature control frames", "How to select between injection molding vs 3D printing vs CNC", "Mitigating thermal expansion in mechanical assemblies", "Designing for fatigue and cyclic stress failure"],
      questions: [
        {
          q: "What is the difference between Yield Strength and Ultimate Tensile Strength (UTS)?",
          a: "Yield Strength is the stress level at which a material transitions from elastic deformation (where it returns to its original shape upon releasing the load) to plastic deformation (where permanent, non-recoverable dimensional change occurs). Ultimate Tensile Strength is the maximum stress a material can withstand while being stretched or pulled before necking occurs and it ultimately fractures."
        },
        {
          q: "Explain what True Position means in GD&T and why it is superior to coordinate tolerancing.",
          a: "True Position defines the theoretically exact location of a feature (such as a hole center) and establishes a circular or cylindrical tolerance zone around it, rather than a rectangular square box created by standard +/- coordinate tolerances. It is superior because: 1) It provides 57% more usable tolerance area at the corners without sacrificing fit. 2) When paired with Maximum Material Condition (MMC), it allows bonus tolerance, significantly reducing manufacturing scrap costs."
        },
        {
          q: "How do you prevent fatigue failure in a mechanical component subjected to cyclic loading?",
          a: "Fatigue failure occurs below yield strength due to repeated cyclic stress initiating micro-cracks. You prevent it by: 1) Designing stresses below the material's Endurance Limit. 2) Eliminating stress concentrations (adding generous fillet radii, avoiding sharp internal corners and keyways). 3) Enhancing surface finish (polishing, shot-peening to introduce beneficial compressive surface residual stresses). 4) Selecting fine-grained alloys with high fatigue resistance."
        },
        {
          q: "When would you choose CNC machining over plastic injection molding?",
          a: "CNC machining is preferred for: 1) Low-volume production (1 to 500 units) where high upfront injection molding tooling costs ($10k-$50k+) cannot be amortized. 2) Rapid functional prototyping during R&D. 3) Extremely tight tolerances (+/- 0.001 inches) that shrink rates in molding cannot maintain. 4) Thick, solid cross-sections that would suffer sink marks in molding. Once volumes scale into thousands, injection molding becomes drastically cheaper per unit."
        },
        {
          q: "How do you account for thermal expansion when joining two dissimilar metals (like aluminum and steel)?",
          a: "Aluminum has a significantly higher coefficient of thermal expansion (CTE ~23 × 10^-6 /°C) than steel (CTE ~12 × 10^-6 /°C). When temperature fluctuates, differential expansion causes thermal stress, warping, or fastener shear. Solutions include: 1) Using slotted bolt holes allowing lateral expansion. 2) Introducing compliant elastomeric washers or bushings. 3) Designing symmetrical thermal expansion joints. 4) Accounting for galvanic corrosion at the aluminum-steel contact interface using dielectric coatings."
        }
      ]
    }
  },

  "corporate-lawyer": {
    title: "Corporate Legal & Compliance Consultant",
    skills: ["Contract Drafting & Review", "Corporate Governance & Board Resolutions", "Regulatory Compliance & Audit", "Legal Due Diligence", "Mergers & Acquisitions (M&A) Basics", "Intellectual Property Rights (IPR)", "Data Privacy Regulations (GDPR/DPDP)", "Legal Research (Westlaw, Manupatra)", "Commercial Negotiation", "Dispute Resolution & Arbitration"],
    description: "Advises businesses on corporate governance, drafts airtight commercial contracts, navigates cross-border regulatory compliance, and mitigates legal liabilities.",
    salary: "$80,000 - $150,000",
    roadmap: {
      beginner: {
        weeks: [
          {
            title: "Foundations of Corporate Law & Business Entities",
            topics: ["Types of business entities: LLC, C-Corp, S-Corp, Partnerships, LLPs", "Articles of Incorporation, Corporate Bylaws, and Operating Agreements", "Shareholder structures, authorized vs issued stock, and capitalization tables", "Fiduciary duties of corporate directors (Duty of Care and Duty of Loyalty)"],
            tasks: ["Draft Articles of Incorporation and Bylaws for a technology startup", "Construct a founding capitalization table modeling equity allocation", "Write an advisory memo on director fiduciary duty liabilities"],
            hoursRequired: 12
          },
          {
            title: "Contract Law & Commercial Drafting Fundamentals",
            topics: ["Essential elements of a binding contract: Offer, Acceptance, Consideration", "Standard commercial boilerplates: Indemnification, Limitation of Liability, Severability", "Governing law, jurisdiction, and force majeure clauses", "Drafting precision: Avoiding ambiguous language and interpretive pitfalls"],
            tasks: ["Draft a standardized Non-Disclosure Agreement (NDA) with mutual obligations", "Analyze an existing commercial contract identifying 5 ambiguity vulnerabilities", "Write customized indemnification and limitation of liability clauses"],
            hoursRequired: 14
          },
          {
            title: "Legal Research & Statutory Interpretation",
            topics: ["Navigating legal research databases (Westlaw, LexisNexis, Google Scholar)", "Reading case law: Stare decisis, precedent analysis, and holding vs dicta", "Statutory interpretation principles (Plain meaning, Ejusdem generis)", "Synthesizing research into clear predictive legal memoranda"],
            tasks: ["Perform legal research analyzing precedent in a breach of contract dispute", "Draft a 4-page formal legal memorandum predicting court outcomes", "Cite statutory authorities adhering strictly to Bluebook citation standards"],
            hoursRequired: 14
          },
          {
            title: "Employment Law & Independent Contractor Agreements",
            topics: ["Employee vs Independent Contractor classification tests (ABC test)", "Non-compete, non-solicitation, and non-disclosure enforceability", "Work-for-hire doctrine and intellectual property assignment", "Workplace compliance: Fair labor standards, discrimination, and termination"],
            tasks: ["Draft an Independent Contractor Services Agreement with IP assignment", "Audit a company's contractor roster to mitigate misclassification risks", "Write an employee handbook policy detailing confidential information protection"],
            hoursRequired: 12
          }
        ]
      },
      intermediate: {
        weeks: [
          {
            title: "Intellectual Property Rights (IPR) & Technology Licensing",
            topics: ["Trademarks, Copyrights, Patents, and Trade Secrets protection", "Software-as-a-Service (SaaS) Master Services Agreements (MSA)", "Service Level Agreements (SLAs), uptime guarantees, and credit remedies", "Open-source software licenses (MIT, Apache, GPL) and copyleft risks"],
            tasks: ["Draft a SaaS Master Services Agreement with data security safeguards", "Conduct an open-source software license compliance audit", "File a mock trademark application outlining class goods and descriptions"],
            hoursRequired: 16
          },
          {
            title: "Data Privacy & Cybersecurity Regulations (GDPR / CCPA / DPDP)",
            topics: ["Data protection principles: Lawfulness, purpose limitation, data minimization", "Data Subject Rights (Access, Deletion, Portability, Rectification)", "Data Processing Agreements (DPAs) and cross-border transfer mechanisms", "Data breach notification timelines and regulatory penalty structures"],
            tasks: ["Draft a comprehensive website Privacy Policy compliant with GDPR and CCPA", "Construct a standard Data Processing Agreement (DPA) with standard contractual clauses", "Write a 72-hour regulatory breach response action plan"],
            hoursRequired: 16
          },
          {
            title: "Corporate Governance, Board Meetings & Shareholder Rights",
            topics: ["Board of Directors meetings, minutes, and unanimous written consents", "Shareholder voting rights, proxy statements, and shareholder agreements", "Right of First Refusal (ROFR), Co-Sale (Tag-along), and Drag-along rights", "Managing conflict of interest transactions and audit committees"],
            tasks: ["Draft formal board resolutions approving a major commercial debt facility", "Write a comprehensive Shareholders' Agreement with drag-along protections", "Prepare an annual corporate governance compliance checklist"],
            hoursRequired: 15
          },
          {
            title: "Dispute Resolution & Commercial Arbitration",
            topics: ["Litigation vs Alternative Dispute Resolution (ADR: Mediation, Arbitration)", "Drafting multi-tier dispute resolution clauses", "Arbitration institutions and rules (AAA, JAMS, ICC, LCIA)", "Enforcement of arbitral awards under the New York Convention"],
            tasks: ["Draft a multi-tiered escalation clause specifying mediation prior to arbitration", "Prepare an arbitration demand memo summarizing breach of contract damages", "Evaluate the enforceability of a mandatory consumer arbitration clause"],
            hoursRequired: 15
          }
        ]
      },
      advanced: {
        weeks: [
          {
            title: "Mergers & Acquisitions (M&A) & Transaction Structuring",
            topics: ["Asset purchases vs Stock purchases vs Mergers: Legal and tax tradeoffs", "Term sheets, Letters of Intent (LOI), and Exclusivity agreements", "Definitive agreements: Stock Purchase Agreements (SPA) and Asset Purchase Agreements", "Representations and Warranties, indemnification escrows, and disclosure schedules"],
            tasks: ["Draft a binding Letter of Intent (LOI) outlining key transaction terms", "Review an acquisition agreement marking up buyer-friendly indemnification caps", "Prepare comprehensive disclosure schedules qualifying contract representations"],
            hoursRequired: 20
          },
          {
            title: "Legal Due Diligence Investigations & Risk Audits",
            topics: ["Structuring a virtual data room (VDR) and diligence checklists", "Reviewing material contracts, IP ownership, regulatory licenses, and litigation", "Identifying red-flag liabilities: Change-of-control triggers, uncapped liability", "Compiling executive Due Diligence reports with recommended remedies"],
            tasks: ["Execute a legal due diligence review on a mock acquisition target", "Flag 5 critical change-of-control contract clauses impacting deal closing", "Author an executive Due Diligence Summary Report with mitigation strategies"],
            hoursRequired: 18
          },
          {
            title: "Venture Capital Financing & Startup Fundraising Law",
            topics: ["Financing instruments: SAFEs (Simple Agreements for Future Equity) and Convertible Notes", "Priced equity rounds: Series Seed and Series A term sheets (NVCA standard)", "Investor rights: Liquidation preferences, anti-dilution protection, information rights", "Navigating securities laws: Reg D private placements and blue sky filings"],
            tasks: ["Draft a post-money SAFE instrument with valuation cap and discount", "Analyze an NVCA Model Series A Term Sheet negotiating investor veto powers", "Model the dilutive impact of 1x non-participating vs participating liquidation preferences"],
            hoursRequired: 20
          },
          {
            title: "Commercial Contract Negotiation & Deal Leadership",
            topics: ["Principled negotiation strategies (Harvard PON: Getting to Yes)", "Assessing BATNA (Best Alternative to a Negotiated Agreement)", "High-stakes redlining workflows and compromise positioning", "Closing conditions, regulatory clearances, and post-closing integration"],
            tasks: ["Participate in a simulated redline contract negotiation against counterpart counsel", "Defend corporate client positions on liability caps and warranty duration", "Assemble a complete closing binder with executed transaction deliverables"],
            hoursRequired: 20
          }
        ]
      }
    },
    projects: [
      {
        name: "Enterprise SaaS Master Services Agreement (MSA) Suite",
        difficulty: "Beginner",
        tech: ["Commercial Contract Drafting", "IP Protection", "SLA Drafting"],
        description: "A comprehensive, enterprise-ready legal contract suite for B2B cloud software companies, including MSA, SLA uptime guarantees, and DPA.",
        features: ["Complete Master Services Agreement with liability caps", "Service Level Agreement with uptime credit schedules", "Data Processing Agreement compliant with privacy laws", "Contract negotiation guide for sales teams"]
      },
      {
        name: "Cross-Border M&A Legal Due Diligence Audit Report",
        difficulty: "Intermediate",
        tech: ["M&A Due Diligence", "Contract Redlining", "Risk Assessment"],
        description: "A professional legal due diligence investigation auditing 20+ corporate documents of an acquisition target, synthesizing key risks and deal contingencies.",
        features: ["Comprehensive virtual data room diligence checklist", "Red-flag liability audit covering IP and change-of-control", "Material contracts analysis table", "Executive diligence report with mitigation steps"]
      },
      {
        name: "Series A Startup Venture Financing Term Sheet Package",
        difficulty: "Advanced",
        tech: ["NVCA Term Sheets", "Cap Table Dilution", "Corporate Governance"],
        description: "A full legal documentation package for a $5M Series A venture capital equity financing round based on NVCA industry standards.",
        features: ["Standardized Series A Term Sheet", "Liquidation preference and anti-dilution comparison model", "Voting and Investor Rights Agreement draft", "Founders' employment and IP assignment agreement"]
      }
    ],
    interviewPrep: {
      topics: ["Indemnification vs Limitation of Liability mechanics", "Asset Purchase vs Stock Purchase deal structures", "Duty of Care vs Duty of Loyalty for corporate directors", "How to negotiate uncapped liability requests", "Enforceability of non-compete clauses"],
      questions: [
        {
          q: "What is the relationship between an Indemnification clause and a Limitation of Liability (LoL) clause?",
          a: "Indemnification is an affirmative obligation where one party agrees to defend, hold harmless, and reimburse the other party for third-party claims and associated losses (e.g. intellectual property infringement or data breaches). The Limitation of Liability clause sets a financial ceiling (often 12 months of fees paid) on total damages payable under the contract. In commercial negotiations, a critical battleground is whether indemnification obligations are subject to the LoL cap or carved out as uncapped liabilities."
        },
        {
          q: "What are the core differences between an Asset Purchase and a Stock Purchase in M&A?",
          a: "In a Stock Purchase, the buyer acquires the equity shares directly from target shareholders, inheriting the entire company including all assets and known/unknown historical liabilities. It is cleaner operationally because existing contracts generally remain in place. In an Asset Purchase, the buyer selectively cherry-picks specific tangible/intangible assets and explicitly assumes only designated liabilities, leaving unwanted or unknown liabilities behind in the seller entity, and receiving a stepped-up tax basis."
        },
        {
          q: "Explain the Business Judgment Rule as it applies to corporate directors.",
          a: "The Business Judgment Rule is a legal presumption that in making a business decision, corporate directors acted on an informed basis, in good faith, and in the honest belief that the action was in the best interests of the company. Courts will not second-guess or hold directors personally liable for poor business outcomes unless the plaintiff proves fraud, illegality, gross negligence, or a direct conflict of interest breaching the Duty of Loyalty."
        },
        {
          q: "What is a SAFE (Simple Agreement for Future Equity) and how does a valuation cap work?",
          a: "A SAFE is a financing instrument created by Y Combinator where an investor injects capital into a startup in exchange for the contractual right to convert that investment into preferred shares in a future priced equity round (like Series A). The valuation cap sets the maximum effective company valuation at which the investor's money will convert, protecting early investors from being diluted if the startup raises at an extremely high valuation later."
        },
        {
          q: "How do you advise a commercial client whose counterparty demands uncapped liability for data breaches?",
          a: "I recommend a tiered compromise: 1) Firmly resist completely uncapped liability, as an uncapped data breach exposure can bankrupt a company. 2) Propose a 'Super Cap'—a separate, higher liability ceiling specifically dedicated to data privacy breaches (e.g. 3x to 5x annual contract value or matching the company's cyber liability insurance policy limits). 3) Ensure the clause requires the counterparty to maintain reasonable data security practices and reasonably mitigate damages."
        }
      ]
    }
  },

  "cybersecurity-analyst": {
    title: "Cybersecurity & SOC Analyst",
    skills: ["Network Security Fundamentals", "Linux Administration", "Packet Analysis (Wireshark)", "SIEM & SOC Operations (Splunk)", "Vulnerability Scanning (Nessus, Nmap)", "Incident Response Lifecycle", "OWASP Top 10 Security", "Cryptography & PKI", "Firewall & IDS/IPS Configuration", "Identity & Access Management (IAM)"],
    description: "Monitors security operation centers (SOC), analyzes network packet traffic, responds to real-time cyber incidents, and remediates system vulnerabilities.",
    salary: "$80,000 - $135,000",
    roadmap: {
      beginner: {
        weeks: [
          {
            title: "Network Fundamentals & Traffic Analysis (Wireshark)",
            topics: ["OSI Model & TCP/IP protocol suite", "IPv4/IPv6 addressing, subnetting, and routing protocols", "TCP 3-way handshake, UDP, DNS, and HTTP/HTTPS traffic", "Capturing and analyzing raw network packets in Wireshark"],
            tasks: ["Capture live network traffic in Wireshark and filter for HTTP credentials", "Analyze a TCP 3-way handshake and detect packet retransmissions", "Identify suspicious DNS tunneling and ARP poisoning attempts"],
            hoursRequired: 12
          },
          {
            title: "Linux Command Line & System Security",
            topics: ["Linux directory hierarchy and essential terminal commands", "User permissions, file access control (chmod/chown), and sudoers", "Managing Linux processes, system services (systemd), and cron jobs", "Reviewing system authentication and authorization logs (/var/log/auth.log)"],
            tasks: ["Harden a fresh Linux server disabling root SSH and enforcing key auth", "Audit user permissions and identify unauthorized SUID binaries", "Write a Bash script parsing authentication logs for failed login attempts"],
            hoursRequired: 14
          },
          {
            title: "Security Foundations & Common Attack Vectors",
            topics: ["The CIA Triad (Confidentiality, Integrity, Availability)", "Malware types: Viruses, Worms, Trojans, Ransomware, Rootkits", "Social engineering attacks (Phishing, Spear-phishing, Pretexting)", "Defense-in-depth architecture and zero-trust concepts"],
            tasks: ["Analyze a real-world phishing email header identifying origin IP and spoofing", "Construct a threat model diagram for an enterprise network perimeter", "Implement multi-factor authentication (MFA) and password complexity policies"],
            hoursRequired: 12
          },
          {
            title: "Reconnaissance & Vulnerability Scanning (Nmap / Nessus)",
            topics: ["Port scanning techniques and Nmap switch parameters (-sS, -sV, -sC)", "Detecting active hosts, open ports, and operating system fingerprints", "Vulnerability assessment workflows with Tenable Nessus", "Common Vulnerabilities and Exposures (CVE) and CVSS scoring"],
            tasks: ["Perform authorized network reconnaissance using Nmap on a lab VM", "Run an authenticated Nessus vulnerability scan and export results", "Prioritize vulnerabilities based on CVSS scores and public exploit availability"],
            hoursRequired: 15
          }
        ]
      },
      intermediate: {
        weeks: [
          {
            title: "Security Operations Center (SOC) & SIEM Analysis (Splunk)",
            topics: ["SOC roles, alert triage tiers, and workflow escalation", "Security Information and Event Management (SIEM) architecture", "Writing search queries and aggregations in Splunk (SPL)", "Correlating disparate log sources to detect multi-stage intrusion"],
            tasks: ["Ingest Windows Event Logs and Apache access logs into Splunk", "Write Splunk queries detecting brute force RDP and SSH attacks", "Build an interactive SOC monitoring dashboard displaying live security alerts"],
            hoursRequired: 18
          },
          {
            title: "Incident Response Lifecycle (NIST SP 800-61)",
            topics: ["NIST Incident Response phases: Prep, Detection, Containment, Eradication, Recovery", "Host-based forensics: Inspecting memory, registry, and running processes", "Isolating compromised endpoints from the network", "Documenting incident timelines and chain of custody"],
            tasks: ["Simulate an incident response workflow containing a mock ransomware infection", "Extract memory artifacts using Volatility to identify injected malicious DLLs", "Author a comprehensive Post-Incident Review (PIR) report with remediation steps"],
            hoursRequired: 16
          },
          {
            title: "Web Application Security & OWASP Top 10",
            topics: ["OWASP Top 10 vulnerabilities (SQL Injection, XSS, CSRF, IDOR, Broken Auth)", "Intercepting and modifying HTTP requests using Burp Suite", "Remediating SQL Injection with parameterized queries and ORMs", "Content Security Policy (CSP) and secure HTTP header configurations"],
            tasks: ["Exploit and remediate a SQL Injection vulnerability in a testing lab", "Capture and tamper with API session tokens using Burp Suite Proxy", "Audit website security headers using OWASP ZAP and implement remedies"],
            hoursRequired: 18
          },
          {
            title: "Firewalls, IDS/IPS & Network Defense",
            topics: ["Stateful vs Next-Generation Firewalls (NGFW)", "Intrusion Detection/Prevention Systems (Snort, Suricata)", "Writing custom Snort detection rules for emerging threats", "VPN architectures and secure remote access protocols (IPsec, WireGuard)"],
            tasks: ["Configure UFW and iptables firewall rules blocking suspicious subnets", "Write custom Snort rules detecting specific malware command-and-control beacons", "Deploy an encrypted WireGuard VPN server for secure administrative access"],
            hoursRequired: 15
          }
        ]
      },
      advanced: {
        weeks: [
          {
            title: "Threat Hunting & MITRE ATT&CK Framework",
            topics: ["Proactive threat hunting methodologies vs reactive alert triage", "Mapping adversary tactics and techniques to the MITRE ATT&CK Matrix", "Cyber Kill Chain framework (Lockheed Martin)", "Endpoint Detection and Response (EDR) telemetry analysis"],
            tasks: ["Formulate a proactive threat hunting hypothesis for lateral movement", "Map real-world APT intrusion reports against the MITRE ATT&CK matrix", "Analyze Sysmon endpoint telemetry to identify process hollowing"],
            hoursRequired: 20
          },
          {
            title: "Cloud Security Architecture (AWS / Azure)",
            topics: ["Shared Responsibility Model in cloud environments", "AWS Identity and Access Management (IAM) least-privilege policies", "Securing cloud storage (S3 bucket policies) and VPC security groups", "CloudTrail auditing and GuardDuty automated threat detection"],
            tasks: ["Audit an AWS cloud environment using ScoutSuite or Prowler", "Remediate overly permissive IAM roles applying strict least-privilege JSON policies", "Configure automated AWS CloudWatch alerts triggered by root account activity"],
            hoursRequired: 20
          },
          {
            title: "Applied Cryptography & Public Key Infrastructure (PKI)",
            topics: ["Symmetric (AES) vs Asymmetric (RSA, ECC) encryption", "Cryptographic hash functions (SHA-256) and collision resistance", "Public Key Infrastructure (PKI), Certificate Authorities, and X.509 certs", "TLS 1.3 handshake mechanics and forward secrecy"],
            tasks: ["Set up a local OpenSSL Certificate Authority and issue signed SSL certificates", "Encrypt and sign sensitive payloads using GPG public keys", "Analyze a captured TLS 1.3 handshake in Wireshark verifying perfect forward secrecy"],
            hoursRequired: 18
          },
          {
            title: "Security Governance, Risk & Compliance (GRC)",
            topics: ["Cybersecurity frameworks: NIST CSF, ISO 27001, SOC 2, CIS Controls", "Risk assessment methodologies and risk register management", "Business Continuity Planning (BCP) and Disaster Recovery (DR)", "Developing comprehensive enterprise security policies"],
            tasks: ["Perform an enterprise security gap analysis against CIS Top 18 Controls", "Build a corporate Cybersecurity Risk Register with quantified likelihood and impact", "Author an enterprise Incident Response Policy and present it to executive stakeholders"],
            hoursRequired: 20
          }
        ]
      }
    },
    projects: [
      {
        name: "SOC Network Forensics & Intrusion Detection Lab",
        difficulty: "Beginner",
        tech: ["Wireshark", "Nmap", "Snort", "Linux"],
        description: "An isolated network security lab simulating port scans, brute-force attacks, and malware C2 beacons with custom Snort detection rules.",
        features: ["PCAP packet analysis documentation", "Nmap vulnerability scan report", "Custom Snort IDS detection rules", "Step-by-step incident containment log"]
      },
      {
        name: "Enterprise Splunk SIEM Detection & Triage Dashboard",
        difficulty: "Intermediate",
        tech: ["Splunk SIEM", "Windows Event Logs", "Sysmon", "SPL Queries"],
        description: "A centralized security monitoring dashboard aggregating endpoint and firewall logs, automating alert triage for brute-force and privilege escalation.",
        features: ["Splunk log ingestion pipeline", "5 custom correlation search rules in SPL", "Real-time SOC monitoring dashboard", "Incident triage playbook document"]
      },
      {
        name: "End-to-End Enterprise Cloud Security & Threat Hunting Suite",
        difficulty: "Advanced",
        tech: ["AWS Security", "MITRE ATT&CK", "Volatility", "Python"],
        description: "A comprehensive cloud security audit and memory forensics investigation mapping an advanced persistent threat (APT) attack chain.",
        features: ["AWS IAM least-privilege automated audit", "RAM memory forensics analysis report", "MITRE ATT&CK matrix technique mapping", "Executive risk assessment and remediation brief"]
      }
    ],
    interviewPrep: {
      topics: ["TCP 3-way handshake and SYN flood attacks", "Symmetric vs Asymmetric encryption tradeoffs", "Walk me through how you investigate a suspected compromised machine", "Differentiating IDS vs IPS vs Firewall", "Explaining Cross-Site Scripting (XSS) and how to prevent it"],
      questions: [
        {
          q: "Explain the TCP 3-way handshake and how a SYN flood attack exploits it.",
          a: "The normal handshake establishes a TCP connection: 1) Client sends a SYN packet to server. 2) Server responds with SYN-ACK and reserves memory resources in its backlog queue. 3) Client returns an ACK, completing the handshake. In a SYN flood attack, an attacker floods the server with thousands of spoofed SYN packets but never sends the final ACK. The server's connection queue fills up waiting for responses that never arrive, exhausting resources and causing a Denial of Service (DoS) for legitimate users."
        },
        {
          q: "If an endpoint is suspected of being infected with malware, what are your immediate first steps?",
          a: "1) Isolation: Immediately disconnect the machine from the corporate network (unplug ethernet, disable Wi-Fi) to stop lateral movement and command-and-control beaconing, but DO NOT power off the device (which would erase volatile RAM artifacts). 2) Preservation: Capture volatile system memory using tools like FTK Imager or WinPmem for forensic analysis. 3) Triage: Check running processes, active network connections (netstat), persistence mechanisms (startup registry keys, cron jobs), and recent event logs. 4) Eradication & Remediation: Reimage the machine from a known clean gold master, reset user credentials, and update firewall/EDR rules."
        },
        {
          q: "What is the difference between an IDS and an IPS?",
          a: "An Intrusion Detection System (IDS) is passive: it monitors network traffic out-of-band via a SPAN port or network TAP, compares traffic against signature databases or anomaly baselines, and generates alerts when malicious activity is spotted without interrupting traffic flow. An Intrusion Prevention System (IPS) sits in-line directly in the traffic flow path: it not only detects threats but can proactively block or drop malicious packets, terminate TCP sessions, or dynamically reconfigure firewalls in real time."
        },
        {
          q: "What is the difference between Symmetric and Asymmetric encryption?",
          a: "Symmetric encryption (e.g. AES, ChaCha20) uses the same secret key for both encryption and decryption. It is computationally fast and ideal for encrypting large volumes of data at rest or in transit, but requires secure key sharing. Asymmetric encryption (e.g. RSA, ECC) uses a mathematically linked key pair: a public key for encryption and a private key for decryption. It solves the key-distribution problem and enables digital signatures, but is computationally slower. Modern systems (like TLS) use asymmetric encryption to securely exchange a symmetric session key, then use symmetric encryption for actual data payload."
        },
        {
          q: "What is Cross-Site Scripting (XSS) and how do you mitigate it?",
          a: "XSS occurs when an application includes untrusted user data in a web page without proper validation or escaping, allowing an attacker to execute malicious JavaScript in a victim's browser, potentially stealing session cookies or redirecting users. Types include Stored (persistent in database), Reflected (in URL params), and DOM-based. Mitigation: 1) Context-aware output encoding (HTML, JavaScript, CSS). 2) Implementing a strict Content Security Policy (CSP) restricting script execution sources. 3) Using the 'HttpOnly' flag on sensitive session cookies so JavaScript cannot read them."
        }
      ]
    }
  }
};

const RESUME_PARSER_SKILLS = {
  programming_languages: ["javascript", "typescript", "python", "java", "c++", "c#", "ruby", "go", "rust", "php", "swift", "kotlin", "scala", "html5", "css3", "sql", "bash", "shell", "r", "matlab"],
  web_and_cloud: ["react", "vue", "angular", "next.js", "node.js", "express", "django", "fastapi", "spring boot", "rest api", "graphql", "aws", "azure", "gcp", "docker", "kubernetes", "git", "github", "ci/cd", "microservices"],
  data_and_analytics: ["sql", "python", "pandas", "numpy", "tableau", "power bi", "scikit-learn", "data visualization", "statistics", "machine learning", "deep learning", "pytorch", "tensorflow", "jupyter", "a/b testing", "data modeling", "bigquery", "snowflake", "spark"],
  business_and_finance: ["financial modeling", "dcf valuation", "excel", "financial analysis", "budgeting", "forecasting", "accounting", "gaap", "ifrs", "corporate finance", "equity research", "risk management", "valuation", "p&l", "ebitda", "capital budgeting"],
  product_and_management: ["product management", "agile", "scrum", "jira", "prd writing", "user stories", "roadmap", "stakeholder management", "market research", "competitor analysis", "rice", "kpis", "amplitude", "mixpanel", "product strategy", "design thinking"],
  design_and_creative: ["figma", "ui/ux", "user research", "wireframing", "prototyping", "design systems", "typography", "usability testing", "adobe xd", "photoshop", "illustrator", "accessibility", "wcag", "micro-interactions", "mobile design", "visual design"],
  marketing_and_growth: ["seo", "sem", "google ads", "meta ads", "content marketing", "copywriting", "email marketing", "hubspot", "google analytics", "ga4", "cro", "social media marketing", "growth hacking", "crm", "campaign management", "branding"],
  healthcare_and_science: ["molecular biology", "clinical trials", "gcp", "glp", "hipaa", "biostatistics", "biochemistry", "bioinformatics", "pathology", "pcr", "elisa", "western blot", "drug discovery", "laboratory safety", "scientific writing", "sop"],
  core_engineering: ["autocad", "solidworks", "fea", "thermodynamics", "heat transfer", "fluid mechanics", "gd&t", "materials science", "matlab", "simulink", "lean manufacturing", "six sigma", "3d printing", "mechatronics", "cnc machining"],
  law_and_compliance: ["contract drafting", "corporate governance", "regulatory compliance", "due diligence", "m&a", "intellectual property", "gdpr", "data privacy", "legal research", "westlaw", "arbitration", "negotiation", "commercial law"],
  soft_skills_and_leadership: ["communication", "leadership", "problem solving", "critical thinking", "teamwork", "public speaking", "project management", "adaptability", "collaboration", "decision making", "time management"]
};

const SAMPLE_JOBS = [
  {
    id: "job-1",
    title: "Junior Frontend Engineer",
    company: "DevFlow Systems",
    location: "Remote (US/Canada)",
    salary: "$70,000 - $85,000",
    tags: ["React", "JavaScript", "Tailwind CSS"],
    career: "frontend-developer",
    category: "tech",
    description: "Looking for an enthusiastic junior engineer to help maintain and build new responsive UI components using React, working closely with our design team."
  },
  {
    id: "job-2",
    title: "AI Application Developer",
    company: "NeuralPulse Systems",
    location: "San Francisco, CA (Hybrid)",
    salary: "$130,000 - $160,000",
    tags: ["Python", "LangChain", "Gemini API", "Vector Databases", "Docker"],
    career: "ai-ml-engineer",
    category: "tech",
    description: "Design agentic workflows and build retrieval-augmented generation (RAG) pipelines over complex enterprise document vaults."
  },
  {
    id: "job-3",
    title: "Associate Product Manager",
    company: "Apex Product Labs",
    location: "New York, NY (Hybrid)",
    salary: "$85,000 - $110,000",
    tags: ["Product Strategy", "Agile", "PRD Writing", "Figma", "Jira"],
    career: "product-manager",
    category: "business",
    description: "Own feature backlogs, author PRDs, and work directly with engineering and design to drive product-led growth and improve trial conversion."
  },
  {
    id: "job-4",
    title: "Junior UI/UX & Product Designer",
    company: "StudioVerve Digital",
    location: "Remote (Global)",
    salary: "$70,000 - $95,000",
    tags: ["Figma", "Design Systems", "User Research", "Wireframing"],
    career: "ui-ux-designer",
    category: "design",
    description: "Design high-fidelity responsive web and mobile interfaces. Conduct usability interviews and maintain our modern Figma design system."
  },
  {
    id: "job-5",
    title: "Financial & Valuation Analyst",
    company: "Beacon Capital Partners",
    location: "Chicago, IL",
    salary: "$80,000 - $105,000",
    tags: ["Financial Modeling", "DCF", "Excel", "Valuation", "Power BI"],
    career: "financial-analyst",
    category: "finance",
    description: "Construct 3-statement financial models, perform DCF valuations, and synthesize executive slide decks for investment committee reviews."
  },
  {
    id: "job-6",
    title: "Data Scientist & BI Analyst",
    company: "VenturePulse Analytics",
    location: "Austin, TX (Remote)",
    salary: "$90,000 - $125,000",
    tags: ["Python", "SQL", "Pandas", "Scikit-Learn", "Tableau"],
    career: "data-scientist",
    category: "data",
    description: "Develop predictive customer churn and classification models. Query data warehouses with complex SQL to build executive KPI dashboards."
  },
  {
    id: "job-7",
    title: "Digital Marketing & Growth Strategist",
    company: "GrowthCatalyst Media",
    location: "Remote",
    salary: "$65,000 - $90,000",
    tags: ["SEO", "Meta Ads", "Google Analytics 4", "Copywriting", "HubSpot"],
    career: "digital-marketer",
    category: "marketing",
    description: "Design performance ad campaigns across Meta and Google, optimize SEO keyword content clusters, and manage automated email nurturing flows."
  },
  {
    id: "job-8",
    title: "Clinical Research & Biomedical Associate",
    company: "BioHealth Diagnostics",
    location: "Boston, MA",
    salary: "$75,000 - $100,000",
    tags: ["GCP", "Clinical Trials", "Molecular Biology", "Biostatistics", "IRB"],
    career: "biomedical-scientist",
    category: "healthcare",
    description: "Support Phase II clinical trial monitoring, draft patient consent protocols compliant with GCP/HIPAA, and analyze biological biomarkers."
  },
  {
    id: "job-9",
    title: "Junior Mechanical Systems Engineer",
    company: "Kinetics Dynamics",
    location: "Detroit, MI",
    salary: "$75,000 - $95,000",
    tags: ["SolidWorks", "AutoCAD", "FEA", "GD&T", "DFMA"],
    career: "mechanical-engineer",
    category: "engineering",
    description: "Design 3D mechanical components and assemblies in SolidWorks. Conduct structural FEA simulations and prepare 2D fabrication drawings with GD&T."
  },
  {
    id: "job-10",
    title: "Corporate Legal & Compliance Specialist",
    company: "LexisBridge Advisory",
    location: "Washington, DC (Hybrid)",
    salary: "$85,000 - $115,000",
    tags: ["Contract Drafting", "Compliance", "Due Diligence", "GDPR", "M&A"],
    career: "corporate-lawyer",
    category: "law",
    description: "Draft and review commercial SaaS contracts and vendor agreements, perform legal due diligence audits, and maintain corporate governance filings."
  },
  {
    id: "job-11",
    title: "Cybersecurity & SOC Analyst",
    company: "CyberArmor Defense",
    location: "Remote (US)",
    salary: "$85,000 - $110,000",
    tags: ["Splunk", "Wireshark", "Nmap", "Incident Response", "Linux"],
    career: "cybersecurity-analyst",
    category: "tech",
    description: "Monitor SIEM alerts in our 24/7 Security Operations Center, analyze network traffic for malicious beacons, and coordinate incident response."
  },
  {
    id: "job-12",
    title: "Full Stack Engineer",
    company: "SaaS Rocket",
    location: "Remote (Global)",
    salary: "$95,000 - $125,000",
    tags: ["React", "Node.js", "PostgreSQL", "Express.js", "TypeScript"],
    career: "fullstack-developer",
    category: "tech",
    description: "Join our small team and own entire features from database migrations to interactive React components. Experience with TS is a major plus."
  }
];

const MOCK_JOBS = SAMPLE_JOBS;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CAREER_TEMPLATES, RESUME_PARSER_SKILLS, MOCK_JOBS, SAMPLE_JOBS };
}
