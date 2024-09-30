import urls from "./urls";

export async function getURL(slug: string) {
  const url = urls.get(slug) || null;

  return url;
}

export async function getStaticParamsConfig() {
  const paths: { params: { slug: string } }[] = [];

  urls.forEach((url, slug) => paths.push({ params: { slug } }));

  return paths;
}
