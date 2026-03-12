
//this will make sure every game speak the same language

export interface VerificationResult {
  success: boolean;
  message: string;
  finalState: any; 
}

export interface GameEngine {
  verify: (commands: any[], layout: any) => VerificationResult;
}