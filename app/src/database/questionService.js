import { getDatabase } from './db.js';

export class QuestionService {
  constructor() {
    this.db = getDatabase();
  }

  getAllQuestions() {
    try {
      const questions = this.db.questions();
      const progress = this.db.progress();
      
      return questions.map(question => {
        const progressRecord = progress.find(p => p.question_id === question.id);
        return {
          ...question,
          status: progressRecord?.status || null,
          attempts: progressRecord?.attempts || 0,
          time_spent: progressRecord?.time_spent || 0,
          last_attempt: progressRecord?.last_attempt || null,
          user_solution: progressRecord?.user_solution || null
        };
      }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      return [];
    }
  }

  getQuestionById(id) {
    try {
      const questions = this.db.questions();
      const progress = this.db.progress();
      
      const question = questions.find(q => q.id === id);
      if (!question) return null;
      
      const progressRecord = progress.find(p => p.question_id === id);
      
      return {
        ...question,
        status: progressRecord?.status || null,
        attempts: progressRecord?.attempts || 0,
        time_spent: progressRecord?.time_spent || 0,
        last_attempt: progressRecord?.last_attempt || null,
        user_solution: progressRecord?.user_solution || null
      };
    } catch (error) {
      console.error('Failed to fetch question:', error);
      return null;
    }
  }


  updateProgress(questionId, status, userSolution = null, timeSpent = 0) {
    try {
      const progress = this.db.progress();
      const existingIndex = progress.findIndex(p => p.question_id === questionId);

      if (existingIndex >= 0) {
        progress[existingIndex] = {
          ...progress[existingIndex],
          status,
          attempts: progress[existingIndex].attempts + 1,
          time_spent: progress[existingIndex].time_spent + timeSpent,
          last_attempt: new Date().toISOString(),
          user_solution: userSolution
        };
      } else {
        progress.push({
          id: Math.max(...progress.map(p => p.id), 0) + 1,
          question_id: questionId,
          status,
          attempts: 1,
          time_spent: timeSpent,
          last_attempt: new Date().toISOString(),
          user_solution: userSolution
        });
      }

      this.db.setProgress(progress);

      if (status === 'solved') {
        this.updateStats();
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
      throw error;
    }
  }

  updateStats() {
    try {
      const questions = this.db.questions();
      const progress = this.db.progress();
      
      const solvedProgress = progress.filter(p => p.status === 'solved');
      const solvedQuestions = solvedProgress.map(p => 
        questions.find(q => q.id === p.question_id)
      ).filter(Boolean);

      const stats = {
        id: 1,
        total_questions_solved: solvedQuestions.length,
        total_time_spent: solvedProgress.reduce((sum, p) => sum + (p.time_spent || 0), 0),
        easy_solved: solvedQuestions.filter(q => q.difficulty === 'easy').length,
        medium_solved: solvedQuestions.filter(q => q.difficulty === 'medium').length,
        hard_solved: solvedQuestions.filter(q => q.difficulty === 'hard').length,
        streak: 0, // Could implement streak logic here
        last_solved_date: new Date().toISOString()
      };

      this.db.setStats(stats);
    } catch (error) {
      console.error('Failed to update stats:', error);
    }
  }

  getStats() {
    try {
      return this.db.stats();
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      return null;
    }
  }

  async forceReseed() {
    try {
      this.db.setQuestions([]);
      this.db.setProgress([]);
      await this.seedSampleQuestions();
      console.log('Database reseeded successfully');
      return true;
    } catch (error) {
      console.error('Failed to reseed database:', error);
      return false;
    }
  }

  async seedSampleQuestions() {
    const questions = this.db.questions();
    console.log('Current questions count:', questions.length);

    // Uncomment the next line to force reseeding if needed
    // this.db.setQuestions([]);

    if (questions.length > 0) {
      return; // Already seeded
    }

    console.log('Starting seeding process...');

    // Import questions from the external file
    const { sampleQuestions } = await import('../../new_questions.js');
    // Add IDs and timestamps to sample questions
    const questionsWithMetadata = sampleQuestions.map((question, index) => ({
      ...question,
      id: index + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Directly set questions in the database
    this.db.setQuestions(questionsWithMetadata);
  }
}