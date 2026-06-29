type Props = {
  enabled?: boolean;
};

export function PoweredByValetfy({ enabled = true }: Props) {
  if (!enabled) return null;

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <span className="footer-brand">Demo preview</span>
        <a
          href="https://valetfy.com"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="powered-by"
        >
          Powered by Valetfy
        </a>
      </div>
    </footer>
  );
}
