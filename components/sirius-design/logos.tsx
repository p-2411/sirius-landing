// Real brand marks in their official colors — a direct port of the design's
// logos.jsx, used in the hero integration strip and the footer.
import type { ReactElement } from "react";

function LogoGmail() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
      <path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z" />
      <path fill="#1e88e5" d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z" />
      <polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17" />
      <path fill="#c62828" d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z" />
      <path fill="#fbc02d" d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0C43.076,8,45,9.924,45,12.298z" />
    </svg>
  );
}

function LogoCalendar() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
      <rect width="22" height="22" x="13" y="13" fill="#fff" />
      <polygon fill="#1e88e5" points="25.68,20.92 26.688,22.36 28.272,21.208 28.272,29.56 30,29.56 30,18.616 28.56,18.616" />
      <path fill="#1e88e5" d="M22.943,23.745c0.625-0.574,1.013-1.37,1.013-2.249c0-1.747-1.533-3.168-3.417-3.168c-1.602,0-2.972,1.009-3.33,2.453l1.657,0.421c0.165-0.664,0.868-1.146,1.673-1.146c0.942,0,1.709,0.646,1.709,1.44c0,0.794-0.767,1.44-1.709,1.44h-0.997v1.728h0.997c1.081,0,1.993,0.751,1.993,1.64c0,0.904-0.866,1.64-1.931,1.64c-0.962,0-1.784-0.61-1.914-1.418l-1.708,0.273c0.262,1.636,1.81,2.87,3.622,2.87c2.007,0,3.64-1.511,3.64-3.368C24.961,25.483,24.156,24.328,22.943,23.745z" />
      <polygon fill="#fbc02d" points="34,42 14,42 13,38 14,34 34,34 35,38" />
      <polygon fill="#4caf50" points="38,35 42,34 42,14 38,13 34,14 34,34" />
      <path fill="#1e88e5" d="M34,14l1-4l-1-4H9C7.343,6,6,7.343,6,9v25l4,1l4-1V14H34z" />
      <polygon fill="#e53935" points="34,34 34,42 42,34" />
      <path fill="#1565c0" d="M39,6h-5v8h8V9C42,7.343,40.657,6,39,6z" />
      <path fill="#1565c0" d="M9,42h5v-8H6v5C6,40.657,7.343,42,9,42z" />
    </svg>
  );
}

function LogoNotion() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="#f6efdf" aria-hidden="true">
      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.005 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952l1.448.327s0 .84-1.168.84l-3.222.186c-.093-.187 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933z" />
    </svg>
  );
}

function LogoGithub() {
  return (
    <svg viewBox="0 0 16 16" width="100%" height="100%" fill="#f6efdf" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function LogoDiscord() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="#5865f2" aria-hidden="true">
      <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.6 12.6 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.291.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function LogoWord() {
  return (
    // Official Word mark from the real app's integration-logos; an SVG, so
    // next/image optimization is skipped in favor of a plain element.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/word-logo.svg"
      alt=""
      aria-hidden="true"
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  );
}

function LogoGoogleDocs() {
  return (
    <svg viewBox="0 0 48 64" width="100%" height="100%" aria-hidden="true">
      <path fill="#4285f4" d="M30 0H6C3.79 0 2 1.79 2 4v56c0 2.21 1.79 4 4 4h36c2.21 0 4-1.79 4-4V16L30 0z" />
      <path fill="#a1c2fa" d="M30 0v12c0 2.21 1.79 4 4 4h12L30 0z" />
      <path fill="#f1f1f1" d="M12 25h24v3H12zM12 32h24v3H12zM12 39h24v3H12zM12 46h16v3H12z" />
    </svg>
  );
}

function LogoGoogleSheets() {
  return (
    <svg viewBox="0 0 48 64" width="100%" height="100%" aria-hidden="true">
      <path fill="#0f9d58" d="M30 0H6C3.79 0 2 1.79 2 4v56c0 2.21 1.79 4 4 4h36c2.21 0 4-1.79 4-4V16L30 0z" />
      <path fill="#87ceac" d="M30 0v12c0 2.21 1.79 4 4 4h12L30 0z" />
      <path fill="#f1f1f1" d="M13 26v20h22V26H13zm10 17h-8v-4.5h8V43zm0-6h-8v-4.5h8V37zm0-6h-8V26.5h8V31zm10 12h-8v-4.5h8V43zm0-6h-8v-4.5h8V37zm0-6h-8V26.5h8V31z" />
    </svg>
  );
}

function LogoGoogleDrive() {
  return (
    <svg viewBox="0 0 87.3 78" width="100%" height="100%" aria-hidden="true">
      <path fill="#0066da" d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" />
      <path fill="#00ac47" d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" />
      <path fill="#ea4335" d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" />
      <path fill="#00832d" d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" />
      <path fill="#2684fc" d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" />
      <path fill="#ffba00" d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" />
    </svg>
  );
}

type LogoEntry = { name: string; Mark: () => ReactElement };

// Hero integration strip — the everyday tools, kept short and glanceable.
export const DESIGN_LOGOS: LogoEntry[] = [
  { name: "Gmail", Mark: LogoGmail },
  { name: "Calendar", Mark: LogoCalendar },
  { name: "Google Drive", Mark: LogoGoogleDrive },
  { name: "Notion", Mark: LogoNotion },
  { name: "GitHub", Mark: LogoGithub },
  { name: "Discord", Mark: LogoDiscord },
];

// Footer carries the fuller set, including the document apps.
export const FOOTER_LOGOS: LogoEntry[] = [
  ...DESIGN_LOGOS,
  { name: "Word", Mark: LogoWord },
  { name: "Google Docs", Mark: LogoGoogleDocs },
  { name: "Google Sheets", Mark: LogoGoogleSheets },
];
