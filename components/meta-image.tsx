import Head from "next/head"

interface MetaImageProps {
  title: string
  description: string
  imageUrl: string
  url?: string
}

export function MetaImage({ title, description, imageUrl, url }: MetaImageProps) {
  const fullImageUrl = imageUrl.startsWith("http") ? imageUrl : `${process.env.NEXT_PUBLIC_SITE_URL || ""}${imageUrl}`
  const fullUrl = url ? (url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_SITE_URL || ""}${url}`) : ""

  return (
    <Head>
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      {url && <meta property="og:url" content={fullUrl} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
    </Head>
  )
}
