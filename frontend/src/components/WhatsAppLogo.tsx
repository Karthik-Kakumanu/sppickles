type WhatsAppLogoProps = {
  className?: string;
};

const WhatsAppLogo = ({ className = "" }: WhatsAppLogoProps) => {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
    >
      <circle cx="16" cy="16" r="14" fill="currentColor" />
      <path
        d="M10.7 6.5c-1.1 0-2 .9-2 2.1 0 6.2 5 11.2 11.2 11.2h.1c1.2 0 2.1-.9 2.1-2v-.8c0-.4-.3-.8-.7-.9l-2.1-.7c-.4-.1-.8 0-1.1.3l-.9 1c-.1.1-.3.2-.5.1-1.7-.6-3.2-2.1-3.9-3.9-.1-.2 0-.4.1-.5l1-.9c.3-.3.4-.7.3-1.1l-.7-2.1c-.1-.4-.5-.7-.9-.7h-.9Z"
        fill="#ffffff"
      />
      <path
        d="M22.8 21.4c-.5.1-1 .2-1.6.2-6.6 0-12-5.4-12-12 0-.6.1-1.1.2-1.6-.2.1-.5.2-.7.4-1.3 1.2-2 2.9-2 4.6 0 1.9.7 4.6 2.5 7.1l-1 4.1 4.2-1.1c2.1 1.2 4.4 1.8 6.8 1.8 1.7 0 3.4-.6 4.6-1.8.2-.2.3-.4.4-.7Z"
        fill="currentColor"
        opacity="0.18"
      />
    </svg>
  );
};

export default WhatsAppLogo;