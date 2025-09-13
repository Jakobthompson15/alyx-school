// Mock data for ALYX demo

export interface MockAssignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  questions: MockQuestion[];
  totalPoints: number;
  published: boolean;
  dueDate?: string;
  rubric?: string;
}

export interface MockQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'open_ended';
  points: number;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface MockSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  answers: MockAnswer[];
  totalScore: number;
  maxScore: number;
  percentage: number;
  status: 'completed' | 'pending' | 'available';
  submittedAt?: string;
  gradedAt?: string;
  feedback: string;
}

export interface MockAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  points: number;
  maxPoints: number;
  feedback: string;
}

export const mockAssignments: MockAssignment[] = [
  // Statistics
  {
    id: 'stats-1',
    title: 'Probability Distributions',
    subject: 'Statistics',
    description: 'Complete questions about normal and binomial distributions, including real-world applications.',
    published: true,
    dueDate: '2024-01-25',
    totalPoints: 100,
    rubric: 'Grading Rubric:\n• Mathematical accuracy (40%)\n• Proper notation and terminology (30%)\n• Clear explanations and reasoning (20%)\n• Neat presentation (10%)',
    questions: [
      {
        id: 'stats-1-q1',
        question: 'What is the mean of a normal distribution with parameters μ = 50 and σ = 10?',
        type: 'multiple_choice',
        points: 15,
        options: ['40', '50', '60', '100'],
        correctAnswer: '50',
        explanation: 'In a normal distribution N(μ, σ), the mean is μ.'
      },
      {
        id: 'stats-1-q2',
        question: 'A factory produces light bulbs with a mean lifespan of 1000 hours and standard deviation of 100 hours. What percentage of bulbs last between 900 and 1100 hours?',
        type: 'open_ended',
        points: 25,
        correctAnswer: 'Approximately 68% of bulbs will last between 900 and 1100 hours. This is because 900-1100 hours represents μ ± 1σ, and according to the empirical rule (68-95-99.7 rule), about 68% of values fall within one standard deviation of the mean.',
      },
    ]
  },

  // Computer Science
  {
    id: 'cs-1',
    title: 'Data Structures and Algorithms',
    subject: 'Computer Science',
    description: 'Arrays, linked lists, stacks, queues, and basic algorithm complexity analysis.',
    published: true,
    dueDate: '2024-01-28',
    totalPoints: 150,
    rubric: 'Grading Rubric:\n• Code correctness and efficiency (50%)\n• Proper data structure usage (25%)\n• Algorithm analysis and Big O notation (15%)\n• Code style and comments (10%)',
    questions: [
      {
        id: 'cs-1-q1',
        question: 'What is the time complexity of accessing an element in an array by index?',
        type: 'multiple_choice',
        points: 20,
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 'O(1)',
        explanation: 'Array access by index is constant time because arrays store elements in contiguous memory locations.'
      },
      {
        id: 'cs-1-q2',
        question: 'Explain the difference between a stack and a queue, and provide a real-world example of each.',
        type: 'open_ended',
        points: 30,
        correctAnswer: 'A stack follows LIFO (Last In, First Out) principle - like a stack of plates where you add and remove from the top. A queue follows FIFO (First In, First Out) principle - like a line at a store where the first person in line is served first. Stack example: browser back button, undo functionality. Queue example: print job queue, customer service line.',
      }
    ]
  },

  // AP English
  {
    id: 'eng-1',
    title: 'Shakespeare Literary Analysis',
    subject: 'AP English',
    description: 'Analyze themes, literary devices, and character development in Hamlet Act 1.',
    published: true,
    dueDate: '2024-01-30',
    totalPoints: 80,
    rubric: 'Grading Rubric:\n• Thesis clarity and argument strength (30%)\n• Textual evidence and analysis (40%)\n• Writing mechanics and style (20%)\n• Creativity and insight (10%)',
    questions: [
      {
        id: 'eng-1-q1',
        question: 'Which literary device is primarily used in "To be or not to be, that is the question"?',
        type: 'multiple_choice',
        points: 15,
        options: ['Metaphor', 'Antithesis', 'Alliteration', 'Simile'],
        correctAnswer: 'Antithesis',
        explanation: 'Antithesis presents contrasting ideas (to be vs. not to be) in a parallel structure.'
      },
      {
        id: 'eng-1-q2',
        question: 'Analyze how Hamlet\'s soliloquy in Act 1 reveals his internal conflict and sets up the central themes of the play.',
        type: 'open_ended',
        points: 35,
        correctAnswer: 'Hamlet\'s soliloquy reveals his deep internal conflict between action and inaction, life and death, reality and appearance. The famous "To be or not to be" passage shows his contemplation of suicide versus enduring suffering, which reflects the play\'s themes of mortality, revenge, and the human condition. His philosophical questioning establishes him as a complex, introspective character torn between duty and conscience.',
      }
    ]
  },

  // Social Studies
  {
    id: 'ss-1',
    title: 'World War I Causes and Timeline',
    subject: 'Social Studies',
    description: 'Major events, causes, and consequences leading to and during World War I.',
    published: true,
    dueDate: '2024-02-02',
    totalPoints: 120,
    rubric: 'Grading Rubric:\n• Historical accuracy and knowledge (40%)\n• Understanding of cause and effect (30%)\n• Use of specific examples and dates (20%)\n• Clear organization and presentation (10%)',
    questions: [
      {
        id: 'ss-1-q1',
        question: 'What event is considered the immediate trigger of World War I?',
        type: 'multiple_choice',
        points: 20,
        options: ['Sinking of Lusitania', 'Assassination of Archduke Franz Ferdinand', 'German invasion of Belgium', 'Russian mobilization'],
        correctAnswer: 'Assassination of Archduke Franz Ferdinand',
        explanation: 'The assassination of Archduke Franz Ferdinand on June 28, 1914, triggered the chain of events leading to WWI.'
      },
      {
        id: 'ss-1-q2',
        question: 'Explain how the alliance system contributed to the escalation of World War I from a regional conflict to a global war.',
        type: 'open_ended',
        points: 40,
        correctAnswer: 'The alliance system created a web of obligations that turned a regional conflict into a world war. When Austria-Hungary declared war on Serbia, Russia mobilized to support Serbia. Germany then declared war on Russia due to the Triple Alliance, which brought France into the conflict through the Franco-Russian Alliance. Britain entered when Germany invaded Belgium. These interlocking alliances meant that a single incident in the Balkans rapidly escalated into a global conflict involving all major European powers.',
      }
    ]
  }
];

export const mockSubmissions: MockSubmission[] = [
  // Statistics submission - High score
  {
    id: 'sub-stats-1',
    assignmentId: 'stats-1',
    studentId: 'demo-student',
    totalScore: 87,
    maxScore: 100,
    percentage: 87,
    status: 'completed',
    submittedAt: '2024-01-24T10:30:00Z',
    gradedAt: '2024-01-24T15:45:00Z',
    feedback: 'Excellent work! You demonstrated strong understanding of probability distributions and the empirical rule.',
    answers: [
      {
        questionId: 'stats-1-q1',
        answer: '50',
        isCorrect: true,
        points: 15,
        maxPoints: 15,
        feedback: 'Correct! You correctly identified that μ is the mean of a normal distribution.'
      },
      {
        questionId: 'stats-1-q2',
        answer: 'About 68% of the bulbs will last between 900 and 1100 hours because this represents one standard deviation from the mean, and the 68-95-99.7 rule tells us that 68% of values fall within one standard deviation.',
        isCorrect: true,
        points: 22,
        maxPoints: 25,
        feedback: 'Great application of the empirical rule! Minor deduction for not showing the calculation steps more explicitly. Consider showing μ ± 1σ = 1000 ± 100.'
      }
    ]
  },

  // Computer Science submission - Medium score
  {
    id: 'sub-cs-1',
    assignmentId: 'cs-1',
    studentId: 'demo-student',
    totalScore: 112,
    maxScore: 150,
    percentage: 75,
    status: 'completed',
    submittedAt: '2024-01-27T14:20:00Z',
    gradedAt: '2024-01-28T09:15:00Z',
    feedback: 'Good understanding of basic concepts. Work on providing more detailed explanations and real-world examples.',
    answers: [
      {
        questionId: 'cs-1-q1',
        answer: 'O(1)',
        isCorrect: true,
        points: 20,
        maxPoints: 20,
        feedback: 'Perfect! You understand that array indexing is constant time due to direct memory access.'
      },
      {
        questionId: 'cs-1-q2',
        answer: 'Stack is LIFO (Last In First Out) and queue is FIFO (First In First Out). Stack example: plates stacked up. Queue example: waiting in line.',
        isCorrect: true,
        points: 22,
        maxPoints: 30,
        feedback: 'Good basic understanding of LIFO vs FIFO. However, you could have provided more detailed explanations of how each data structure works and given more specific real-world examples like browser history or print queues.'
      }
    ]
  },

  // AP English submission - Lower score with detailed feedback
  {
    id: 'sub-eng-1',
    assignmentId: 'eng-1',
    studentId: 'demo-student',
    totalScore: 56,
    maxScore: 80,
    percentage: 70,
    status: 'completed',
    submittedAt: '2024-01-29T16:45:00Z',
    gradedAt: '2024-01-30T11:30:00Z',
    feedback: 'You show understanding of the text but need to strengthen your analysis and provide more specific textual evidence.',
    answers: [
      {
        questionId: 'eng-1-q1',
        answer: 'Antithesis',
        isCorrect: true,
        points: 15,
        maxPoints: 15,
        feedback: 'Excellent! You correctly identified the antithesis in this famous soliloquy.'
      },
      {
        questionId: 'eng-1-q2',
        answer: 'Hamlet is conflicted about whether to live or die. He thinks a lot about life and death in his soliloquy. This shows the themes of the play about mortality and revenge.',
        isCorrect: false,
        points: 18,
        maxPoints: 35,
        feedback: 'You identify the basic conflict, but your analysis lacks depth and specific textual evidence. Consider: 1) Analyze specific language and imagery Hamlet uses, 2) Connect his internal conflict to his duty to avenge his father, 3) Discuss how this soliloquy establishes his character as philosophical vs. action-oriented, 4) Provide specific quotes to support your analysis. Your response reads more like a summary than literary analysis.'
      }
    ]
  }
];

export const mockLessonPlans = [
  {
    id: 'lp-1',
    title: 'Introduction to Machine Learning',
    subject: 'Computer Science',
    content: 'This lesson introduces students to the fundamental concepts of machine learning, including supervised vs unsupervised learning, common algorithms, and real-world applications...',
    hasQuiz: false,
    uploadedFile: 'ml-intro-lesson.pdf'
  },
  {
    id: 'lp-2',
    title: 'Statistical Inference',
    subject: 'Statistics',
    content: 'Students will learn about hypothesis testing, confidence intervals, and p-values through hands-on examples...',
    hasQuiz: true,
    uploadedFile: 'statistical-inference.pdf'
  },
  {
    id: 'lp-3',
    title: 'Literary Devices in Poetry',
    subject: 'AP English',
    content: 'Exploring metaphor, simile, alliteration, and other poetic devices through analysis of classic and contemporary poems...',
    hasQuiz: false,
    uploadedFile: null
  }
];