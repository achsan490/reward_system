import SignInForm from "@/components/auth/SignInForm";
import Image from "next/image";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex">
            {/* Left side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
                <SignInForm />
            </div>

            {/* Right side - Image/Branding */}
            <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-brand-500 to-brand-700 items-center justify-center p-12">
                <div className="max-w-md text-white">
                    <h2 className="text-4xl font-bold mb-4">Reward Management System</h2>
                    <p className="text-lg text-white/90">
                        Kelola sistem reward pelanggan Anda dengan mudah dan efisien
                    </p>
                    <div className="mt-8 space-y-4">
                        <div className="flex items-start gap-3">
                            <svg
                                className="w-6 h-6 mt-1 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div>
                                <h3 className="font-semibold">Data Transaksi Real-time</h3>
                                <p className="text-sm text-white/80">
                                    Monitor dan analisis transaksi pelanggan secara langsung
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <svg
                                className="w-6 h-6 mt-1 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div>
                                <h3 className="font-semibold">Sistem Reward Otomatis</h3>
                                <p className="text-sm text-white/80">
                                    Tentukan dan kelola reward pelanggan secara otomatis
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <svg
                                className="w-6 h-6 mt-1 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div>
                                <h3 className="font-semibold">Laporan Komprehensif</h3>
                                <p className="text-sm text-white/80">
                                    Dashboard analitik lengkap dengan visualisasi data
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
