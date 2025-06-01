// globals.d.ts

// Define the shape (interface) of your global ApiRouter object
interface ApiRouterType {
  getBackendPref(): string;
  setBackendPref(pref: string): void;
  getApiBase(path: string): string | null;
  onBackendChange(callback: (pref: string) => void): void;
}

// Declare that a global constant ApiRouter exists matching ApiRouterType
declare const ApiRouter: ApiRouterType;
