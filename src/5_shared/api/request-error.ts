export class RequestError extends Error {
  readonly status: number;
  readonly statusText: string;
  
  constructor(res: Response, message?: string) {
    super(message ?? `Request error ${res.status}: ${res.statusText}`);
    this.name = this.constructor.name;
    this.status = res.status;
    this.statusText = res.statusText;
  }
}