"use client";



export default function PromoSection() {
    return (
        <section className="bg-[#1e355e] py-12 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="absolute -left-20 -top-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-4 relative z-8 text-center">
                <div className="max-w-4xl mx-auto">

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                        Text to Handwriting
                    </h2>
                    <p className="text-blue-50/80 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                        A Text to Handwriting Converter is an online tool that transforms typed text into realistic handwritten text.
                        Text to handwriting AI helps users create handwritten-style documents quickly while maintaining neatness and readability.
                        Convert text to real handwriting tool is widely used by students, teachers, and professionals who want the appearance of handwriting without the effort of writing manually.
                    </p>
                </div>
            </div>
        </section>
    );
}
