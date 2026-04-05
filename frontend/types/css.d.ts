declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module 'quill/dist/quill.snow.css';
declare module 'quill/dist/quill.bubble.css';
declare module 'quill/dist/quill.core.css';
