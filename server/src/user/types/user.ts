export type userId = string;

export interface user {
  _id: userId;
  name: string;
  password: string;
}

export interface connectionOfferRequest {
  from: user,
  to: userId,
  offer: any,
}

export interface connectionAnswerRequest {
  from: user,
  to: userId,
  answer: any,
}
