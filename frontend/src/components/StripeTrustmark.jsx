const StripeTrustmark = () => {
  return (
    <div className="flex items-center justify-center space-x-2 text-white/70 text-sm">
      <span>Payments securely powered by</span>
      <svg
        width="60"
        height="24"
        viewBox="0 0 60 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        <path
          d="M8.5 2.5h43v19h-43v-19z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        />
        <path
          d="M8.5 2.5h43v19h-43v-19z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        />
        <text
          x="30"
          y="16"
          textAnchor="middle"
          fontSize="8"
          fill="currentColor"
          fontWeight="bold"
        >
          STRIPE
        </text>
      </svg>
    </div>
  );
};

export default StripeTrustmark;
