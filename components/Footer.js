export default function Footer() {
    return (
        <footer className="border-t bg-gray-50 dark:bg-gray-900 dark:border-gray-800 transition-colors">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <span className="font-bold text-xl text-gray-900 dark:text-white">
                            TechyBlog<span className="text-blue-600">.</span>
                        </span>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                            Helping beginners master programming, one post at a time.
                        </p>
                    </div>
                    <div className="flex space-x-6 text-sm">
                        <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a>
                        <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</a>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
                    © {new Date().getFullYear()} TechyBlog. Created by Ashish Choudhary.
                </div>
            </div>
        </footer>
    );
}
