// =============================================
// Seed Script — Fills MongoDB with default courses
// =============================================
// Run this ONCE with: node seed.js
// It adds all the default courses into your database.

require('dotenv').config();
const mongoose = require('mongoose');
const Course   = require('./models/Course');
const User     = require('./models/User');

const COURSES_DATA = [
  {
    name: "Frontend Developer",
    icon: "🎨",
    description: "Build stunning web interfaces with modern frameworks and design principles.",
    skills: ["HTML","CSS","JavaScript","React","TypeScript","Git"],
    resources: {
      "HTML":       { yt: "https://www.youtube.com/results?search_query=HTML+complete+course+2024", gfg: "https://www.geeksforgeeks.org/html-tutorial/", project: "https://www.frontendmentor.io/challenges" },
      "CSS":        { yt: "https://www.youtube.com/results?search_query=CSS+complete+tutorial+2024", gfg: "https://www.geeksforgeeks.org/css-tutorial/", project: "https://www.frontendmentor.io/challenges" },
      "JavaScript": { yt: "https://www.youtube.com/results?search_query=JavaScript+full+course+2024", gfg: "https://www.geeksforgeeks.org/javascript/", project: "https://javascript30.com" },
      "React":      { yt: "https://www.youtube.com/results?search_query=React+complete+tutorial+2024", gfg: "https://www.geeksforgeeks.org/reactjs/", project: "https://react.dev/learn" },
      "TypeScript": { yt: "https://www.youtube.com/results?search_query=TypeScript+tutorial+beginners", gfg: "https://www.geeksforgeeks.org/typescript/", project: "https://www.typescriptlang.org/docs/" },
      "Git":        { yt: "https://www.youtube.com/results?search_query=Git+GitHub+complete+course", gfg: "https://www.geeksforgeeks.org/git-tutorial/", project: "https://learngitbranching.js.org" }
    }
  },
  {
    name: "Backend Developer",
    icon: "⚙️",
    description: "Build robust APIs, databases, and server-side systems.",
    skills: ["Node.js","Express","MongoDB","SQL","REST API","Docker"],
    resources: {
      "Node.js":  { yt: "https://www.youtube.com/results?search_query=Node.js+complete+course+2024", gfg: "https://www.geeksforgeeks.org/nodejs/", project: "https://nodeschool.io" },
      "Express":  { yt: "https://www.youtube.com/results?search_query=Express.js+tutorial+2024", gfg: "https://www.geeksforgeeks.org/express-js/", project: "https://expressjs.com/en/guide/" },
      "MongoDB":  { yt: "https://www.youtube.com/results?search_query=MongoDB+complete+tutorial", gfg: "https://www.geeksforgeeks.org/mongodb-tutorial/", project: "https://www.mongodb.com/docs/" },
      "SQL":      { yt: "https://www.youtube.com/results?search_query=SQL+complete+course+beginners", gfg: "https://www.geeksforgeeks.org/sql-tutorial/", project: "https://sqlzoo.net" },
      "REST API": { yt: "https://www.youtube.com/results?search_query=REST+API+tutorial+beginners", gfg: "https://www.geeksforgeeks.org/rest-api-introduction/", project: "https://restfulapi.net" },
      "Docker":   { yt: "https://www.youtube.com/results?search_query=Docker+complete+tutorial", gfg: "https://www.geeksforgeeks.org/docker-tutorial/", project: "https://docker-curriculum.com" }
    }
  },
  {
    name: "Full Stack",
    icon: "🌐",
    description: "Master both frontend & backend to build complete web applications.",
    skills: ["HTML","CSS","JavaScript","React","Node.js","MongoDB","Git"],
    resources: {
      "HTML":       { yt: "https://www.youtube.com/results?search_query=HTML+tutorial", gfg: "https://www.geeksforgeeks.org/html-tutorial/", project: "https://www.frontendmentor.io" },
      "CSS":        { yt: "https://www.youtube.com/results?search_query=CSS+tutorial", gfg: "https://www.geeksforgeeks.org/css-tutorial/", project: "https://www.frontendmentor.io" },
      "JavaScript": { yt: "https://www.youtube.com/results?search_query=JavaScript+tutorial", gfg: "https://www.geeksforgeeks.org/javascript/", project: "https://javascript30.com" },
      "React":      { yt: "https://www.youtube.com/results?search_query=React+tutorial", gfg: "https://www.geeksforgeeks.org/reactjs/", project: "https://react.dev" },
      "Node.js":    { yt: "https://www.youtube.com/results?search_query=Node.js+tutorial", gfg: "https://www.geeksforgeeks.org/nodejs/", project: "https://nodeschool.io" },
      "MongoDB":    { yt: "https://www.youtube.com/results?search_query=MongoDB+tutorial", gfg: "https://www.geeksforgeeks.org/mongodb-tutorial/", project: "https://www.mongodb.com/docs" },
      "Git":        { yt: "https://www.youtube.com/results?search_query=Git+tutorial", gfg: "https://www.geeksforgeeks.org/git-tutorial/", project: "https://learngitbranching.js.org" }
    }
  },
  {
    name: "Data Analyst",
    icon: "📊",
    description: "Analyze data, find insights, and tell stories with numbers.",
    skills: ["Python","Pandas","SQL","Excel","Power BI","Statistics"],
    resources: {
      "Python":     { yt: "https://www.youtube.com/results?search_query=Python+complete+course", gfg: "https://www.geeksforgeeks.org/python-programming-language/", project: "https://www.hackerrank.com/domains/python" },
      "Pandas":     { yt: "https://www.youtube.com/results?search_query=Pandas+python+tutorial", gfg: "https://www.geeksforgeeks.org/pandas-tutorial/", project: "https://kaggle.com/learn/pandas" },
      "SQL":        { yt: "https://www.youtube.com/results?search_query=SQL+tutorial", gfg: "https://www.geeksforgeeks.org/sql-tutorial/", project: "https://sqlzoo.net" },
      "Excel":      { yt: "https://www.youtube.com/results?search_query=Excel+tutorial+beginners", gfg: "https://www.geeksforgeeks.org/microsoft-excel-tutorial/", project: "https://chandoo.org/wp/learn-excel/" },
      "Power BI":   { yt: "https://www.youtube.com/results?search_query=Power+BI+tutorial", gfg: "https://www.geeksforgeeks.org/power-bi/", project: "https://powerbi.microsoft.com/en-us/learning/" },
      "Statistics": { yt: "https://www.youtube.com/results?search_query=Statistics+for+data+science", gfg: "https://www.geeksforgeeks.org/statistics/", project: "https://www.khanacademy.org/math/statistics-probability" }
    }
  },
  {
    name: "AI / ML Engineer",
    icon: "🤖",
    description: "Build intelligent systems that learn and adapt from data.",
    skills: ["Python","Pandas","NumPy","Scikit-learn","TensorFlow","Math/Stats"],
    resources: {
      "Python":       { yt: "https://www.youtube.com/results?search_query=Python+ML+tutorial", gfg: "https://www.geeksforgeeks.org/python-programming-language/", project: "https://www.hackerrank.com/domains/python" },
      "Pandas":       { yt: "https://www.youtube.com/results?search_query=Pandas+tutorial", gfg: "https://www.geeksforgeeks.org/pandas-tutorial/", project: "https://kaggle.com/learn/pandas" },
      "NumPy":        { yt: "https://www.youtube.com/results?search_query=NumPy+tutorial", gfg: "https://www.geeksforgeeks.org/numpy-tutorial/", project: "https://numpy.org/doc/stable/user/quickstart.html" },
      "Scikit-learn": { yt: "https://www.youtube.com/results?search_query=Scikit+learn+tutorial", gfg: "https://www.geeksforgeeks.org/learning-model-building-scikit-learn-python-machine-learning-library/", project: "https://scikit-learn.org/stable/auto_examples/" },
      "TensorFlow":   { yt: "https://www.youtube.com/results?search_query=TensorFlow+tutorial", gfg: "https://www.geeksforgeeks.org/introduction-to-tensorflow/", project: "https://www.tensorflow.org/tutorials" },
      "Math/Stats":   { yt: "https://www.youtube.com/results?search_query=Math+for+machine+learning", gfg: "https://www.geeksforgeeks.org/machine-learning/", project: "https://www.khanacademy.org/math/linear-algebra" }
    }
  },
  {
    name: "DevOps Engineer",
    icon: "🔧",
    description: "Automate, deploy, and scale applications with modern DevOps practices.",
    skills: ["Linux","Docker","Kubernetes","CI/CD","AWS","Bash"],
    resources: {
      "Linux":      { yt: "https://www.youtube.com/results?search_query=Linux+tutorial+beginners", gfg: "https://www.geeksforgeeks.org/linux-tutorial/", project: "https://linuxjourney.com" },
      "Docker":     { yt: "https://www.youtube.com/results?search_query=Docker+tutorial", gfg: "https://www.geeksforgeeks.org/docker-tutorial/", project: "https://docker-curriculum.com" },
      "Kubernetes": { yt: "https://www.youtube.com/results?search_query=Kubernetes+tutorial", gfg: "https://www.geeksforgeeks.org/kubernetes-tutorial/", project: "https://kubernetes.io/docs/tutorials/" },
      "CI/CD":      { yt: "https://www.youtube.com/results?search_query=CICD+GitHub+Actions+tutorial", gfg: "https://www.geeksforgeeks.org/ci-cd-pipeline/", project: "https://docs.github.com/en/actions" },
      "AWS":        { yt: "https://www.youtube.com/results?search_query=AWS+tutorial+beginners", gfg: "https://www.geeksforgeeks.org/aws-tutorial/", project: "https://aws.amazon.com/getting-started/" },
      "Bash":       { yt: "https://www.youtube.com/results?search_query=Bash+scripting+tutorial", gfg: "https://www.geeksforgeeks.org/bash-scripting-introduction-to-bash-and-bash-scripting/", project: "https://overthewire.org/wargames/bandit/" }
    }
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('🗑️  Cleared old courses');

    // Insert all courses
    await Course.insertMany(COURSES_DATA);
    console.log('✅ Inserted', COURSES_DATA.length, 'courses');

    // Create default admin account
    const adminExists = await User.findOne({ email: 'admin@skillgap.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@skillgap.com',
        password: 'admin123456',
        role: 'admin',
        isVerified: true
      });
      console.log('✅ Admin account created: admin@skillgap.com / admin123456');
    } else {
      console.log('ℹ️  Admin already exists');
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('👉 Now run: npm run dev');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
