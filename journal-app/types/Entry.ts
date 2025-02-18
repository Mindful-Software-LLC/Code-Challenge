export interface Entry {
    id: string;
    user_id: string;
    created_at: string;
    content: string;
    mood: string;
    mood_score: {
      happiness: number;
      sadness: number;
      anger: number;
      fear: number;
      joy: number;
      calmness: number;
    };
}