export interface Message {
    createdAt: Date;
    id: string;
    from: string;
    message: string;
    fromName: string;
    isCurrent: boolean;
  }