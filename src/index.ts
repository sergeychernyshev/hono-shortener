import { getURL } from "./shortener";
import { Hono, Context } from "hono";

const app = new Hono<{ Bindings: CloudflareBindings }>();

async function handleDefaultRedirect(
  c: Context<{ Bindings: CloudflareBindings }>
) {
  const url = c.env.DEFAULT_REDIRECT_URL;

  if (!url) {
    return c.notFound();
  }

  return c.redirect(url);
}

app.get("/", handleDefaultRedirect);

app.get("/:slug", async (c) => {
  const url: URL | null = await getURL(c.req.param("slug"));

  // in case shortened URL is not found, redirect to default URL
  if (!url) {
    return handleDefaultRedirect(c);
  }

  return c.redirect(url.toString());
});

app.get("/:slug/info", async (c) => {
  const slug: string = c.req.param("slug");
  const url: URL | null = await getURL(slug);

  if (!url) {
    return c.notFound();
  }

  return c.html(
    `<html lang="en">
      <head>
        <title>Short URL Information</title>
      </head>
      <body>
        <h1>Short URL Information</h1>
        <p>Slug: ${slug}</p>
        <p>
          URL: <a href=${url.toString()}>${url.toString()}</a>
        </p>
      </body>
    </html>`
  );
});

export default app;
