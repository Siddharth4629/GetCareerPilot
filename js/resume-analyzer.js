// resume-analyzer.js - Core Logic for Resume vs Job Description Gap Analysis

class ResumeAnalyzer {
  static cleanText(text) {
    if (!text) return "";
    return text.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'\n\r]/g, " ")
      .replace(/\s+/g, " ");
  }

  static extractSkills(text) {
    const cleaned = this.cleanText(text);
    const words = cleaned.split(" ");
    
    // We want to extract single words and double-word phrases (like "react js", "node js", "tailwind css", "spring boot", "deep learning")
    const extracted = new Set();
    
    // Flatten all skill categories into a flat list of items to search for
    const allSearchSkills = [];
    Object.values(RESUME_PARSER_SKILLS).forEach(skillList => {
      skillList.forEach(skill => {
        allSearchSkills.push(skill.toLowerCase());
      });
    });

    // Add common alternate spellings or aliases
    const aliases = {
      "js": "javascript",
      "ts": "typescript",
      "py": "python",
      "aws s3": "aws",
      "amazon web services": "aws",
      "postgres": "postgresql",
      "expressjs": "express",
      "express.js": "express",
      "reactjs": "react",
      "react.js": "react",
      "vuejs": "vue",
      "vue.js": "vue",
      "angularjs": "angular",
      "angular.js": "angular",
      "nextjs": "next.js",
      "next.js": "next.js",
      "nodejs": "node.js",
      "node.js": "node.js",
      "fastapi": "fastapi",
      "scikit": "scikit-learn",
      "sci-kit learn": "scikit-learn",
      "scikit learn": "scikit-learn",
      "tensorflow": "tensorflow",
      "pytorch": "pytorch",
      "tailwind": "tailwind css",
      "tailwindcss": "tailwind css",
      "ci cd": "ci/cd",
      "cicd": "ci/cd",
      "git hub": "github",
      "ml": "ai_ml",
      "machine learning": "deep learning"
    };

    // Check occurrences of standard skills and multi-word skills
    allSearchSkills.forEach(skill => {
      // Handle exact multi-word match (e.g. "next.js", "tailwind css", "deep learning", "github actions")
      if (cleaned.includes(skill)) {
        extracted.add(skill);
      }
    });

    // Check words against aliases
    words.forEach((word, index) => {
      // Simple word match
      if (aliases[word]) {
        extracted.add(aliases[word]);
      }
      
      // Lookahead double-word check
      if (index < words.length - 1) {
        const bigram = `${word} ${words[index + 1]}`;
        if (aliases[bigram]) {
          extracted.add(aliases[bigram]);
        }
      }
    });

    return Array.from(extracted);
  }

  static analyzeGap(resumeText, jobDescriptionText) {
    const resumeSkills = this.extractSkills(resumeText);
    const jdSkills = this.extractSkills(jobDescriptionText);

    if (jdSkills.length === 0) {
      return {
        matchScore: 0,
        matchedSkills: [],
        missingSkills: [],
        weakAreas: ["No skills detected in the Job Description. Please add more technical terms."],
        learningPriority: []
      };
    }

    const matchedSkills = jdSkills.filter(skill => resumeSkills.includes(skill));
    const missingSkillsRaw = jdSkills.filter(skill => !resumeSkills.includes(skill));

    // Calculate match score
    const matchPercentage = Math.round((matchedSkills.length / jdSkills.length) * 100);

    // Group missing skills and assign priorities
    const missingSkills = [];
    const learningPriority = [];
    
    missingSkillsRaw.forEach(skill => {
      let priority = "Medium";
      let category = "General Tools";
      
      // Determine skill category and importance
      for (const [catName, list] of Object.entries(RESUME_PARSER_SKILLS)) {
        if (list.includes(skill) || list.map(s => s.toLowerCase()).includes(skill)) {
          category = catName.replace("_", " ").toUpperCase();
          // Languages and core web techs are marked higher priority
          if (catName === "programming_languages" || catName === "frontend" && ["react", "vue", "angular", "next.js"].includes(skill) || catName === "backend" && ["node.js", "express", "django", "fastapi"].includes(skill) || catName === "ai_ml" && ["pytorch", "tensorflow", "langchain"].includes(skill)) {
            priority = "Critical";
          } else if (catName === "databases" || catName === "cloud_devops") {
            priority = "High";
          }
          break;
        }
      }

      missingSkills.push({
        name: this.capitalizeSkillName(skill),
        priority: priority,
        category: category
      });
    });

    // Sort missing skills: Critical -> High -> Medium
    const priorityWeight = { "Critical": 3, "High": 2, "Medium": 1 };
    missingSkills.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);

    // Build smart weak areas text comments
    const weakAreas = [];
    if (matchPercentage < 30) {
      weakAreas.push("Significant structural skill gap detected. You lack the foundational language or framework requirements for this role.");
      weakAreas.push("We recommend building a multi-week structured learning roadmap targeting the Core languages first.");
    } else if (matchPercentage < 65) {
      weakAreas.push("Good foundational base, but missing core frameworks or developer tooling required for daily operations.");
      weakAreas.push("Focus on learning intermediate integrations (e.g. databases, state-management) and cloud deployment basics.");
    } else {
      weakAreas.push("Excellent match! You satisfy the vast majority of core competencies.");
      weakAreas.push("Polish your resume with specific project details highlighting the remaining niche tools to lock down the interview.");
    }

    // Identify dynamic learning priorities (first 3-4 missing skills to focus on)
    missingSkills.slice(0, 4).forEach(item => {
      learningPriority.push({
        skill: item.name,
        action: `Learn fundamentals of ${item.name} and build a mini-project.`,
        urgency: item.priority === "Critical" ? "Immediate Focus" : "Secondary Focus"
      });
    });

    return {
      matchScore: matchPercentage,
      matchedSkills: matchedSkills.map(s => this.capitalizeSkillName(s)),
      missingSkills: missingSkills,
      weakAreas: weakAreas,
      learningPriority: learningPriority
    };
  }

  static capitalizeSkillName(skill) {
    // Return standard capitalization for recognized items
    const spec = {
      "javascript": "JavaScript",
      "typescript": "TypeScript",
      "html5": "HTML5",
      "css3": "CSS3",
      "react": "React.js",
      "vue": "Vue.js",
      "angular": "Angular",
      "next.js": "Next.js",
      "node.js": "Node.js",
      "express": "Express.js",
      "express.js": "Express.js",
      "fastapi": "FastAPI",
      "django": "Django",
      "flask": "Flask",
      "spring boot": "Spring Boot",
      "postgresql": "PostgreSQL",
      "mongodb": "MongoDB",
      "sqlite": "SQLite",
      "github actions": "GitHub Actions",
      "ci/cd": "CI/CD",
      "aws": "AWS",
      "gcp": "GCP",
      "pytorch": "PyTorch",
      "tensorflow": "TensorFlow",
      "scikit-learn": "Scikit-Learn",
      "numpy": "NumPy",
      "pandas": "Pandas",
      "hugging face": "Hugging Face",
      "langchain": "LangChain",
      "rag": "RAG Pipelines",
      "vector databases": "Vector Databases"
    };
    return spec[skill] || skill.toUpperCase();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ResumeAnalyzer };
}
