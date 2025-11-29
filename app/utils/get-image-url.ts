// Helper function to get full image URL from CloudFront

const config = useRuntimeConfig()

export default function (imagePath: string | undefined, version?: string | number) {
    const baseUrl = `${config.public.publicCloudfrontUrl}/${imagePath || 'misc/bg_image_not_available.png'}`
    // Add cache-busting query parameter if version is provided
    if (version !== undefined) {
        return `${baseUrl}?v=${version}`
    }
    return baseUrl
}