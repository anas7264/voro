# VORO Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Navigate to project
cd c:\Users\anas\Downloads\programing\webs

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# Visit: http://localhost:5173
```

---

## 📁 Project Structure

```
src/
├── components/          # 40+ reusable UI components
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Modal.jsx
│   └── ... (37 more)
├── context/             # 4 React context providers
│   ├── AppContext.jsx
│   ├── StorageContext.jsx
│   ├── ThemeContext.jsx
│   └── NotificationContext.jsx
├── hooks/               # 8 custom hooks
│   ├── useStorage.js
│   ├── useAI.js
│   ├── useCalculators.js
│   ├── useGamification.js
│   └── ... (4 more)
├── data/                # 9 complete data files
│   ├── foods.js         # 250+ foods
│   ├── exercises.js     # 120 exercises
│   ├── supplements.js   # 40 supplements
│   ├── achievements.js  # 40 achievements
│   ├── challenges.js    # 48 challenges
│   └── ... (4 more)
├── utils/               # 11 utility modules
│   ├── calculators.js
│   ├── storage.js
│   ├── formatters.js
│   ├── validators.js
│   ├── aiPrompts.js
│   └── ... (6 more)
├── App.jsx              # Main app component
├── main.jsx             # React entry point
└── index.css            # Global styles

public/
├── index.html           # HTML entry point
└── manifest.json        # PWA manifest

vite.config.js           # Vite configuration
tailwind.config.js       # Tailwind theme config
package.json             # Dependencies
```

---

## 🎨 Using Components

### Import components
```javascript
import { Button, Card, Input, Modal } from './components';

// Or individual imports
import Button from './components/Button';
```

### Example usage
```jsx
import { Button, Card, Input } from './components';

export function MyPage() {
  const [name, setName] = useState('');

  return (
    <Card>
      <Input
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={() => console.log(name)}>
        Submit
      </Button>
    </Card>
  );
}
```

---

## 🪝 Using Hooks

### Storage Hook
```javascript
import { useStorage } from './hooks';

export function MyComponent() {
  const { getItem, setItem } = useStorage();

  const saveData = () => {
    setItem('myKey', { data: 'value' });
  };

  const loadData = () => {
    const data = getItem('myKey');
  };
}
```

### AI Hook
```javascript
import { useAI } from './hooks';

export function ChatComponent() {
  const { chat, loading, response } = useAI();

  const sendMessage = async (message) => {
    const reply = await chat(message, []);
  };
}
```

### Calculators Hook
```javascript
import { useCalculators } from './hooks';

export function CalculatorComponent() {
  const { calculateBMI, calculateTDEE } = useCalculators();

  const bmi = calculateBMI(70, 1.75); // weight, height
  const tdee = calculateTDEE(70, 1.75, 'sedentary'); // bmr, activityLevel
}
```

---

## 📊 Using Data

### Import data
```javascript
import { foods, exercises, achievements, challenges } from './data';

// Access entries
foods.forEach(food => {
  console.log(food.name, food.calories);
});

// Find entries
const chicken = foods.find(f => f.name === 'Chicken Breast');
const benchPress = exercises.find(e => e.name === 'Barbell Bench Press');
```

---

## 🎯 Styling with Tailwind

All components use Tailwind CSS with VORO-specific tokens:

```jsx
<div className="bg-primary text-white">Primary Color</div>
<div className="bg-secondary text-white">Secondary Color</div>
<div className="bg-card border border-border">Card Background</div>
<div className="animate-slideUp">Animated Element</div>
```

### Available CSS Variables
```css
--primary: #7C3AED (violet)
--secondary: #10B981 (emerald)
--card: #1F2937 (dark gray)
--surface: #111827 (darker)
--border: #2A3A52 (border color)
```

---

## 🔧 Configuration Files

### vite.config.js
Path alias: `@/` → `src/`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### tailwind.config.js
Theme customization with VORO colors and animations.

### postcss.config.js
Tailwind + Autoprefixer for CSS processing.

---

## 📦 Available npm Scripts

```bash
npm run dev      # Start development server (port 5173)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint check (if configured)
```

---

## 🤖 AI Integration

Claude API integration is ready via `useAI` hook:

```javascript
const { generateMealPlan, generateTrainingPlan, chat } = useAI();

// Generate meal plan
const plan = await generateMealPlan(userProfile);

// Get training advice
const training = await generateTrainingPlan(userProfile);

// Chat with AI
const response = await chat("Tell me about protein", []);
```

Note: Set `VITE_CLAUDE_API_KEY` in `.env.local`

---

## 💾 Storage System

Global storage is available via `window.storage`:

```javascript
// Store data
window.storage.set('workoutLog', workoutData);

// Retrieve data
const workouts = window.storage.get('workoutLog');

// Available keys
const keys = [
  'profile', 'nutrition_log', 'workout_log', 'body_metrics',
  'gym_setup', 'plans', 'vitals', 'supplements', 'habits',
  'gamification', 'settings', 'recipes', 'chat_history',
  'notifications', 'shopping_list', 'periodization',
  'pr_history', 'custom_foods', 'custom_exercises',
  'fitness_tests', 'injury_log', 'cycle_tracking', 'competition'
];
```

---

## 🎮 Gamification System

Complete gamification engine with achievements, challenges, XP, and streaks:

```javascript
const { useGamification } = require('./hooks');

// Award XP
awardXP('complete_workout', { duration: 60, exercises: 8 });

// Unlock achievement
unlockAchievement('first_rep', achievementData);

// Complete challenge
completeChallenge('daily_hydration', { glassesOfWater: 8 });

// Track streak
updateStreak(add = true);
```

---

## 🧪 Testing Components

Quick test setup:

```jsx
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

---

## 🚨 Error Handling

All components have built-in error handling:

```jsx
import { ErrorBoundary } from './components';

<ErrorBoundary error={error} reset={handleReset} />
```

All hooks return errors in their state:

```javascript
const { loading, error, response } = useAI();

if (error) {
  console.error('AI Error:', error);
}
```

---

## 📱 Responsive Design

All components are fully responsive using Tailwind breakpoints:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

---

## 🎉 What's Next?

1. Create dashboard page
2. Build nutrition logger
3. Add workout tracker
4. Implement analytics
5. Create AI chat interface
6. Add user authentication
7. Deploy to production

---

## 📚 Documentation

- [Component API Reference](./COMPONENTS.md)
- [Hooks Reference](./HOOKS.md)
- [Data Reference](./DATA.md)
- [Utilities Reference](./UTILS.md)

---

**Happy Coding! 🚀**
