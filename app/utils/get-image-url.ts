// Helper function to get full image URL from CloudFront

const config = useRuntimeConfig()

export default function (imagePath: string | undefined) {
    return `${config.public.publicCloudfrontUrl}/${imagePath || 'misc/bg_image_not_available.png'}`
}