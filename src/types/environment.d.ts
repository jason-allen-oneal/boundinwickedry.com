declare namespace NodeJS {
  export interface ProcessEnv {
    readonly DB_URL: string;
    readonly DISTRIBUTOR: string;
    readonly NEXTAUTH_SECRET: string;
    readonly NEXTAUTH_URL_INTERNAL: string;
    readonly NEXTAUTH_URL: string;
    readonly RECAPTCHA_KEY: string;
    readonly RECAPTCHA_SECRET: string;
    readonly NEXT_PUBLIC_PAYPAL_CLIENT: string;
    readonly NEXT_PUBLIC_PAYPAL_SECRET: string;
    readonly NEXT_PUBLIC_PAYPAL_CLIENT_ID: string;
    readonly RECAPTCHA_KEY: string;
    readonly RECAPTCHA_SECRET: string;
    readonly USER: string;
    readonly PASS: string;
    readonly ROOT_PATH: string;
    readonly NEXT_PUBLIC_ABLY_KEY:string;
  }
}
