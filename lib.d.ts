declare module '*.css' {
  const style: Record<string, string>;
  export default style;
}

declare module '*.less' {
  const style: Record<string, string>;
  export default style;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const image: string;
  export default image;
}

declare module '*.jpg' {
  const image: string;
  export default image;
}

declare module '*.jpeg' {
  const image: string;
  export default image;
}

declare module '*.gif' {
  const image: string;
  export default image;
}

declare interface Size {
  width: number;
  height: number;
}

declare interface Point {
  x: number;
  y: number;
}

declare interface Rect {
  width: number;
  height: number;
  x: number;
  y: number;
}

declare interface Element {
  webkitRequestFullscreen(options?: FullscreenOptions): Promise<void>;
  mozRequestFullScreen(options?: FullscreenOptions): Promise<void>;
  msRequestFullScreen(options?: FullscreenOptions): Promise<void>;
}

declare interface Document {
  webkitFullscreenElement: Element | null;
  mozFullScreenElement: Element | null;
  msFullscreenElement: Element | null;
  webkitExitFullscreen(): Promise<void>;
  webkitCancelFullScreen(): Promise<void>;
  mozCancelFullScreen(): Promise<void>;
  msExitFullscreen(): Promise<void>;
}
