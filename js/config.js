// Edit these for your deployment.
export const CONFIG = {
  // Where the AI proxy lives. Keep your API key on the server (api/config.php), never in this file.
  API_URL: 'api/ai.php',
  // Public site URL used in share links (no trailing slash). Leave '' to use the current origin.
  SITE_URL: 'https://repliplate.app',
  // Where "Report this result" emails go (Google Play AI-content requirement).
  SUPPORT_EMAIL: 'support@repliplate.app',
  AI_TIMEOUT_MS: 60000,
  // WAYOF (thewayof.health): "Log in WAYOF" opens the meal there with its calories and protein. Set '' to hide the button.
  WAYOF_URL: 'https://thewayof.health',
  // Amazon Associates tag (optional): one-tap Amazon cart links earn you commission, e.g. 'repliplate-20'.
  AMAZON_TAG: '',
  // Instacart (future option): Instacart isn't accepting new developers right now. If they reopen and approve you, add the
  // INSTACART_API_KEY secret to this Worker and set this to '/api/shop' to show "Send it all to Instacart".
  SHOP_API: '',
};
