export const BLOG_CATEGORIES: {
  title: string;
  slug: "news" | "education";
  description: string;
}[] = [
  {
    title: "Nuevas",
    slug: "news",
    description: "Actualizaciones y anuncios",
  },
  {
    title: "Educacion",
    slug: "education",
    description: "Contenido educativo",
  },
];

export const BLOG_AUTHORS = {
  juanalvarezpro: {
    name: "juanalvarezpro",
    image: "/_static/avatars/juanalvarezpro.png",
    twitter: "miickasmt",
  },
  shadcn: {
    name: "shadcn",
    image: "/_static/avatars/shadcn.jpeg",
    twitter: "shadcn",
  },
};
