export type LoginUserProps = {
    email: string;
    password: string;
  };
  
  export type LoginResponse = {
    access_token?: string;
    token_type?: string;
    user?: {
      id: number;
      name: string;
      email: string;
      role: string;
      email_verified_at: string;
      created_at: string;
      updated_at: string;
    };
    success?: boolean;
  };