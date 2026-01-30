import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0] p-4 text-center">
            <div className="relative w-full max-w-2xl aspect-video mb-8">
                <Image
                    src="/404-custom.png"
                    alt="404 Page Not Found"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
            <div className="space-y-6 max-w-md mx-auto">
                <h2 className="text-3xl font-bold text-gray-800">Page Not Found</h2>
                <p className="text-gray-600">
                    The page you are looking for does not exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-block px-8 py-3 bg-[#3B82F6] text-white rounded-full font-semibold hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    )
}
