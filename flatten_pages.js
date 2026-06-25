const fs = require('fs');
const path = require('path');

const pages = [
  'Articles', 'AskQuestion', 'Contact', 'DarulIfta',
  'EducationSystem', 'Events', 'Fatwas', 'Introduction',
  'Lectures', 'PageNotFound', 'Publications', 'QuestionsAnswers',
  'Admin', 'About', 'Home'
];

const base = path.join(__dirname, 'src', 'pages');

pages.forEach(dir => {
  const src = path.join(base, dir, 'pages');
  const dst = path.join(base, dir);

  if (!fs.existsSync(src)) {
    console.log(`SKIP (no pages/ subdir): ${dir}`);
    return;
  }

  const files = fs.readdirSync(src).filter(f => f.endsWith('.jsx'));
  files.forEach(f => {
    let c = fs.readFileSync(path.join(src, f), 'utf8');

    // Fix all ../../.. references to ../.. (flattening from pages/X/pages/ to pages/X/)
    c = c.replace(/from '\.\.\/\.\.\/\.\.\/store/g,   "from '../../store");
    c = c.replace(/from '\.\.\/\.\.\/\.\.\/components/g, "from '../../components");
    c = c.replace(/from '\.\.\/\.\.\/\.\.\/data/g,    "from '../../constants");
    c = c.replace(/from '\.\.\/\.\.\/\.\.\/services/g,"from '../../services");
    c = c.replace(/from '\.\.\/\.\.\/\.\.\/hooks/g,   "from '../../hooks");
    c = c.replace(/from '\.\.\/\.\.\/\.\.\/constants/g,"from '../../constants");
    c = c.replace(/from '\.\.\/\.\.\/\.\.\/utils/g,   "from '../../utils");
    c = c.replace(/from '\.\.\/\.\.\/\.\.\/layout/g,  "from '../../layout");
    c = c.replace(/from '\.\.\/\.\.\/\.\.\/routes/g,  "from '../../routes");

    // Also fix double-quote imports
    c = c.replace(/from "\.\.\/\.\.\/\.\.\/store/g,   'from "../../store');
    c = c.replace(/from "\.\.\/\.\.\/\.\.\/components/g, 'from "../../components');
    c = c.replace(/from "\.\.\/\.\.\/\.\.\/data/g,    'from "../../constants');
    c = c.replace(/from "\.\.\/\.\.\/\.\.\/services/g,'from "../../services');

    const outPath = path.join(dst, f);
    fs.writeFileSync(outPath, c, 'utf8');
    console.log(`Moved: ${dir}/${f}`);
  });
});

console.log('Done flattening all pages!');
