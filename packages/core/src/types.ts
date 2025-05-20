import { type Reactive   } from 'vue';

export interface ExternalDependency {
  js: string[];
  css: string[];
  sequential?: boolean;
}

export interface ExternalDependencies {
  [key: string]: ExternalDependency;
}

export interface ExternalDependencyStatus {
  [key: string]: DEP_STATUS_ENUM;
}

export enum DEP_STATUS_ENUM {
  UNLOAD = 'unload',
  LOADING = 'loading',
  LOADED = 'loaded'
}

export interface LazyDepsState {
  depsConfig: ExternalDependencies;
  depsStatus: Reactive<ExternalDependencyStatus>;
  isConfigured: boolean;
  loadingPromises: Map<string, Promise<void>>;
}

export interface LazyDepsCallbacks {
  onLoading?: (dep: string) => void;
  onLoaded?: (dep: string) => void;
  onError?: (dep: string, error: Error) => void;
} 

declare global {
  interface Window {
    __useLoadDeps__: LazyDepsState
  }
}