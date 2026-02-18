import fallbackPhoto from '../assets/fallback-photo.svg'

function SafeImage({ src, alt, className, loading = 'lazy' }) {
  const onImageError = (event) => {
    event.currentTarget.src = fallbackPhoto
  }

  return <img src={src} alt={alt} className={className} loading={loading} onError={onImageError} />
}

export default SafeImage
