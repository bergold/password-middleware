import { Config } from "./config.ts";

export function template({
  error,
  theme,
}: {
  error?: string;
  theme?: Config["theme"];
}) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Authentication Required</title>
    <style>
      :root {
        --brand-color: ${theme?.brandColor ?? "#ffffff"};
      }
      * {
        box-sizing: border-box;
      }
      html {
        font-family: ui-sans-serif, system-ui, sans-serif;
      }
      body {
        background-color: #292929;
        color: #f5f5f5;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        height: 100dvh;
        margin: 0;
      }
      main {
        padding: 40px;
        border: 1px solid #515152;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
          0 8px 10px -6px rgb(0 0 0 / 0.1);
      }
      .logo {
        display: block;
        margin: 0 auto 32px;
        width: auto;
        height: 44px;
      }
      h1 {
        margin: 0px 9px 32px;
        text-align: center;
        font-size: 24px;
        font-weight: normal;
      }
      form {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        margin-bottom: 12px;
      }
      label {
        display: flex;
        flex-direction: column;
        text-transform: uppercase;
        font-size: 13px;
        letter-spacing: 0.5px;
        color: #c3c4c9;
      }
      input {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        margin: 3px 0;
        font-size: 16px;
        margin-bottom: 10px;
        display: block;
        width: 100%;
        background: transparent;
        color: #c3c4c9;
        border: 1px solid #515152;
        border-radius: 6px;
        padding: 9px 9px;
        letter-spacing: 3px;
      }
      input:hover {
        border-color: #68686a;
      }
      button {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        margin: 3px 0;
        font-size: 13px;
        letter-spacing: 0.5px;
        color: #c3c4c9;
        margin-bottom: 10px;
        display: block;
        width: 100%;
        background: transparent;
        color: #c3c4c9;
        border: 1px solid #515152;
        border-radius: 6px;
        background-color: #3a3a3b;
        padding: 11px 9px;
        cursor: pointer;
      }
      button:hover {
        border-color: #68686a;
        background-color: #515152;
      }
      input:focus,
      button:focus {
        outline: none;
        border-color: var(--brand-color);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-color) 20%, transparent);
      }
      .error {
        display: block;
        width: 100%;
        margin: 0 0 20px 0;
        padding: 6px;
        border-radius: 6px;
        text-align: center;
        background-color: #451c09;
        color: #ffb8b3;
      }
    </style>
  </head>
  <body>
    <main>
      ${theme?.logo ? `<img src="${theme.logo}" alt="Logo" class="logo" />` : ""}
      <h1>Authentication Required</h1>
      <form method="post">
        ${error ? `<p class="error">${error}</p>` : ""}
        <label>
          Password
          <input type="password" name="password" autocomplete="current-password" />
        </label>
        <button type="submit">Log in</button>
      </form>
    </main>
  </body>
</html>
`
}
