import { next } from "@vercel/edge";

export const config = {
  matcher: "/casos/:id",
};

// User-agents de los principales bots que generan previews al compartir un link.
const BOT_UA_REGEX =
  /facebookexternalhit|Facebot|Twitterbot|Slackbot|LinkedInBot|WhatsApp|TelegramBot|Discordbot|Pinterest|SkypeUriPreview|redditbot|Applebot|vkShare|W3C_Validator/i;

const DEFAULT_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBATPk3XIdR0TnY-FKBCAmUaOCZ_94HAY1vKIJBFB1cAssFVz6krFBMf8EyfdvpIiGldAvueBnq7eVd_9FK36s034Kf976-PLGc0Y29ZTbhZfQmipRR9cxu5It2SuKbK6a9lSlDw9vJvgvZuS-uYmRGwkLRFpofLJ92dnpT88Fj4D1QE-606PPp_lQ08rjY734YUq-8aHJaA6S8Dt86yW-Wfv9EjfyFbDqA1o4l4LBIQzuE2I2qES3WShxEJxg8YNi-2Fxt-7aU20k";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

export default async function middleware(request) {
  const userAgent = request.headers.get("user-agent") || "";
  if (!BOT_UA_REGEX.test(userAgent)) {
    return next();
  }

  const url = new URL(request.url);
  const id = url.pathname.split("/").filter(Boolean)[1];
  if (!id) return next();

  const apiUrl = process.env.VITE_API_URL || "https://kindredpaws-back.onrender.com";

  let report;
  try {
    const res = await fetch(`${apiUrl}/api/reportes/${id}`);
    if (!res.ok) return next();
    report = await res.json();
  } catch {
    return next();
  }
  if (!report) return next();

  const nombre = report.nombreMascota || "una mascota";
  const title = `${nombre} · Kindred Paws`;
  const description = `${report.tipo === "perdido" ? "Ayúdanos a encontrar a" : "Se encontró a"} ${nombre}${
    report.ubicacion ? ` en ${report.ubicacion}` : ""
  }.`;
  const image = report.foto || DEFAULT_IMAGE;

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<title>${escapeHtml(title)}</title>
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Kindred Paws" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="${escapeHtml(image)}" />
<meta property="og:url" content="${escapeHtml(url.toString())}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${escapeHtml(image)}" />
</head>
<body></body>
</html>`;

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
