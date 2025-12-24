/// <reference types="vite/client" />

declare module '*.module.css' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module 'pdfjs-dist/legacy/build/pdf' {
    export * from 'pdfjs-dist';
}

declare module 'pdfjs-dist/legacy/build/pdf.worker?url' {
    const workerSrc: string;
    export default workerSrc;
}
