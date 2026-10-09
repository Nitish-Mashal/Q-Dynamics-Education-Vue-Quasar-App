import { defineStore, acceptHMRUpdate } from 'pinia'

const categories = [
  { id: 'programming', label: 'Programming', icon: 'code', gradient: 'bg-gradient-primary' },
  { id: 'design', label: 'Design', icon: 'design_services', gradient: 'bg-gradient-accent' },
  { id: 'business', label: 'Business', icon: 'business', gradient: 'bg-gradient-warning' },
  { id: 'languages', label: 'Languages', icon: 'language', gradient: 'bg-gradient-secondary' },
]

const courses = [
  {
    id: 1,
    categoryId: 'programming',
    title: 'Vue.js Fundamentals',
    description: 'Learn Vue 3 from the basics and build modern reactive applications.',
    image: 'https://picsum.photos/seed/vuejs/800/400',
    level: 'Beginner',
    duration: '6 hours',
    instructor: 'freeCodeCamp.org',
  },
  {
    id: 2,
    categoryId: 'programming',
    title: 'JavaScript Essentials',
    description: 'Master modern JavaScript syntax, concepts and development techniques.',
    image: 'https://picsum.photos/seed/javascript/800/400',
    level: 'Beginner',
    duration: '8 hours',
    instructor: 'freeCodeCamp.org',
  },
  {
    id: 3,
    categoryId: 'programming',
    title: 'Python for Beginners',
    description: 'Start programming with Python from scratch with hands-on projects.',
    image: 'https://picsum.photos/seed/python/800/400',
    level: 'Beginner',
    duration: '10 hours',
    instructor: 'freeCodeCamp.org',
  },
  {
    id: 4,
    categoryId: 'programming',
    title: 'React Development',
    description: 'Build modern single page applications with React and hooks.',
    image: 'https://picsum.photos/seed/reactjs/800/400',
    level: 'Intermediate',
    duration: '12 hours',
    instructor: 'freeCodeCamp.org',
  },
  {
    id: 5,
    categoryId: 'design',
    title: 'UI/UX Design with Figma',
    description: 'Design beautiful, responsive interfaces from wireframe to prototype.',
    image: 'https://picsum.photos/seed/figma/800/400',
    level: 'Beginner',
    duration: '7 hours',
    instructor: 'Joy Johnson',
  },
  {
    id: 6,
    categoryId: 'design',
    title: 'HTML & CSS Styling',
    description: 'Structure and style modern websites from zero to hero.',
    image: 'https://picsum.photos/seed/webdesign/800/400',
    level: 'Beginner',
    duration: '9 hours',
    instructor: 'freeCodeCamp.org',
  },
  {
    id: 7,
    categoryId: 'business',
    title: 'Digital Marketing Masterclass',
    description: 'Learn SEO, social media, and campaign strategy end to end.',
    image: 'https://picsum.photos/seed/marketing/800/400',
    level: 'Intermediate',
    duration: '11 hours',
    instructor: 'Simplilearn',
  },
  {
    id: 8,
    categoryId: 'business',
    title: 'Excel for Business',
    description: 'Organize, analyze and present business data with confidence.',
    image: 'https://picsum.photos/seed/excel/800/400',
    level: 'Beginner',
    duration: '5 hours',
    instructor: 'freeCodeCamp.org',
  },
  {
    id: 9,
    categoryId: 'languages',
    title: 'English Conversation',
    description: 'Speak English confidently in everyday real-life situations.',
    image: 'https://picsum.photos/seed/english/800/400',
    level: 'Beginner',
    duration: '6 hours',
    instructor: 'English Speaking Course',
  },
  {
    id: 10,
    categoryId: 'languages',
    title: 'Spanish for Beginners',
    description: 'Greetings, introductions and your first conversations in Spanish.',
    image: 'https://picsum.photos/seed/spanish/800/400',
    level: 'Beginner',
    duration: '4 hours',
    instructor: 'Aula Internacional',
  },
]

const lessons = [
  // Vue.js Fundamentals
  {
    id: 1,
    courseId: 1,
    title: 'Getting Started with Vue 3',
    duration: '12 minutes',
    videoId: 'Kt2E8nblvXU',
    description:
      'Set up your first Vue project and learn how Vue fits into modern front-end development.',
  },
  {
    id: 2,
    courseId: 1,
    title: 'Templates, Bindings and Components',
    duration: '18 minutes',
    videoId: '4deVCNJq3qc',
    description: 'Render dynamic data with templates and split your UI into reusable components.',
  },
  {
    id: 3,
    courseId: 1,
    title: 'Reactivity, Props and Events',
    duration: '22 minutes',
    videoId: 'FXpIoQ_rT_c',
    description: 'Pass data between components and react to user input with props and events.',
  },
  // JavaScript Essentials
  {
    id: 4,
    courseId: 2,
    title: 'Running JavaScript Basics',
    duration: '15 minutes',
    videoId: 'PkZNo7MFNFg',
    description: 'Variables, types and the fundamentals you need to write your first scripts.',
  },
  {
    id: 5,
    courseId: 2,
    title: 'Functions, Loops and Arrays',
    duration: '20 minutes',
    videoId: 'jS4aFq5-91M',
    description: 'Control the flow of your programs with functions, loops and array methods.',
  },
  {
    id: 6,
    courseId: 2,
    title: 'Objects, Classes and ES6+',
    duration: '24 minutes',
    videoId: '876aSEUA_8c',
    description: 'Model real world data with objects and use modern ES6+ language features.',
  },
  // Python for Beginners
  {
    id: 7,
    courseId: 3,
    title: 'Python Setup and First Programs',
    duration: '16 minutes',
    videoId: 'rfscVS0vtbw',
    description: 'Install Python, run scripts and print your first programs.',
  },
  {
    id: 8,
    courseId: 3,
    title: 'Data Types, Strings and Numbers',
    duration: '19 minutes',
    videoId: 'eWRfhZUzrAc',
    description: 'Work confidently with strings, numbers, lists and dictionaries.',
  },
  {
    id: 9,
    courseId: 3,
    title: 'Control Flow and Functions',
    duration: '21 minutes',
    videoId: '_uQrJ0TkZlc',
    description: 'Make decisions with conditionals and reuse code with functions.',
  },
  // React Development
  {
    id: 10,
    courseId: 4,
    title: 'Introduction to React',
    duration: '17 minutes',
    videoId: 'DLX62G4lc44',
    description: 'Understand components, JSX and the React mental model.',
  },
  {
    id: 11,
    courseId: 4,
    title: 'State, Props and Events',
    duration: '23 minutes',
    videoId: 'nTeuhbP7wdE',
    description: 'Make your components interactive with state and event handling.',
  },
  {
    id: 12,
    courseId: 4,
    title: 'Hooks and Side Effects',
    duration: '26 minutes',
    videoId: 'u6gSSpfsoOQ',
    description: 'Use useState, useEffect and custom hooks to build real features.',
  },
  // UI/UX Design with Figma
  {
    id: 13,
    courseId: 5,
    title: 'Figma Foundations',
    duration: '14 minutes',
    videoId: 'D56hs0Twfco',
    description: 'Frames, shapes, text and the core tools every designer needs.',
  },
  {
    id: 14,
    courseId: 5,
    title: 'Wireframes and Layouts',
    duration: '18 minutes',
    videoId: 'c9Wg6Cb_YlU',
    description: 'Plan page structure with grids, wireframes and layout principles.',
  },
  {
    id: 15,
    courseId: 5,
    title: 'Responsive Design Systems',
    duration: '20 minutes',
    videoId: '1Rs2ND1ryYc',
    description: 'Design once for every screen size with reusable styling rules.',
  },
  // HTML & CSS Styling
  {
    id: 16,
    courseId: 6,
    title: 'HTML Structure and Semantics',
    duration: '15 minutes',
    videoId: 'G3e-cpL7ofc',
    description: 'Build well structured pages with semantic HTML elements.',
  },
  {
    id: 17,
    courseId: 6,
    title: 'CSS Selectors and Box Model',
    duration: '19 minutes',
    videoId: '1Rs2ND1ryYc',
    description: 'Style anything with selectors and master the box model.',
  },
  {
    id: 18,
    courseId: 6,
    title: 'Layouts, Flexbox and Grid',
    duration: '22 minutes',
    videoId: 'D56hs0Twfco',
    description: 'Compose modern layouts quickly with flexbox and grid.',
  },
  // Digital Marketing Masterclass
  {
    id: 19,
    courseId: 7,
    title: 'Marketing Fundamentals',
    duration: '18 minutes',
    videoId: 'nZRcNYD3yNs',
    description: 'The core channels, funnels and metrics behind digital marketing.',
  },
  {
    id: 20,
    courseId: 7,
    title: 'Strategy and Content Planning',
    duration: '21 minutes',
    videoId: 'f6JfLl8g8Nw',
    description: 'Build a strategy that connects content to business goals.',
  },
  {
    id: 21,
    courseId: 7,
    title: 'SEO and Analytics',
    duration: '25 minutes',
    videoId: '44x5lCMRWqA',
    description: 'Grow organic traffic and measure what actually works.',
  },
  // Excel for Business
  {
    id: 22,
    courseId: 8,
    title: 'Excel from the Beginning',
    duration: '16 minutes',
    videoId: 'Vl0H-qTclOg',
    description: 'Navigate workbooks, enter data and format your first sheets.',
  },
  {
    id: 23,
    courseId: 8,
    title: 'Formulas and Functions',
    duration: '20 minutes',
    videoId: 'Y8xhrUa3KH4',
    description: 'Calculate with SUM, IF, VLOOKUP and other essential functions.',
  },
  {
    id: 24,
    courseId: 8,
    title: 'Charts and Data Analysis',
    duration: '18 minutes',
    videoId: 'r5fXft08dVY',
    description: 'Turn raw numbers into clear insights with charts and analysis.',
  },
  // English Conversation
  {
    id: 25,
    courseId: 9,
    title: 'Everyday English Conversation',
    duration: '13 minutes',
    videoId: 'WfOS2tbkbbw',
    description: 'Practice the phrases you need for daily conversations.',
  },
  {
    id: 26,
    courseId: 9,
    title: 'Introducing Yourself in English',
    duration: '12 minutes',
    videoId: 'NdXPnJLR07E',
    description: 'Introduce yourself and others naturally in English.',
  },
  {
    id: 27,
    courseId: 9,
    title: 'Real-Life Speaking Practice',
    duration: '15 minutes',
    videoId: 'KwiZqeDYEpI',
    description: 'Build fluency with guided real-life speaking exercises.',
  },
  // Spanish for Beginners
  {
    id: 28,
    courseId: 10,
    title: 'Greetings and Introductions',
    duration: '14 minutes',
    videoId: 'hyLl_0d0EBw',
    description: 'Say hello, introduce yourself and ask basic questions.',
  },
  {
    id: 29,
    courseId: 10,
    title: 'Essential Verbs: Ser, Tener, Llamarse',
    duration: '17 minutes',
    videoId: '6FNptNQ6DqE',
    description: 'Conjugate the three verbs you will use in every conversation.',
  },
  {
    id: 30,
    courseId: 10,
    title: 'Personal Information and Numbers',
    duration: '16 minutes',
    videoId: '6andNXyxssMg',
    description: 'Share personal details, ages and numbers up to 100.',
  },
]

export const useCatalogStore = defineStore('catalog', {
  state: () => ({
    categories,
    courses,
    lessons,
  }),

  getters: {
    categoryById: (state) => (id) => state.categories.find((c) => c.id === id),

    courseById: (state) => (id) => state.courses.find((c) => c.id === Number(id)),

    lessonById: (state) => (id) => state.lessons.find((l) => l.id === Number(id)),

    coursesByCategory: (state) => (categoryId) =>
      state.courses.filter((c) => c.categoryId === categoryId),

    lessonsByCourse: (state) => (courseId) =>
      state.lessons.filter((l) => l.courseId === Number(courseId)),

    categoryCount: (state) => (categoryId) =>
      state.courses.filter((c) => c.categoryId === categoryId).length,

    searchCourses: (state) => (query) => {
      const q = query.trim().toLowerCase()
      if (!q) return []
      return state.courses.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.level.toLowerCase().includes(q),
      )
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCatalogStore, import.meta.hot))
}
