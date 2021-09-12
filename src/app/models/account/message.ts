export interface Message {
    createdAt: Date;
    id: string;
    from: string;
    to: string;
    message: string;
    fromName: string;
    isCurrent: boolean;
  }