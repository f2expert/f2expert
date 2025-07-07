
export default function Footer() {
    return (
        <>
        <footer className="container px-10 py-8 bg-[#012f5c] text-white text-sm">        
        <ul className="flex justify-between max-w-7xl mx-auto gap-5">
            <li>
                <img src="assets/f2expert.jpg" alt="F2Expert Training Center" />
                <p className="py-3">D1/450, Gali No.3, Ashok Nagar, Shahdara, Delhi-93</p>
                <a className="py-5" href="">info@f2expert.com</a>
                <p className="py-3">+919990012545</p>
            </li>
            <li>
                <h2 className="text-lg text-gray-300 py-2">Company</h2>
                <ul>
                    <li className="py-1"> <a href="">About</a></li>
                    <li className="py-1"> <a href="">course</a></li>
                    <li className="py-1"> <a href="">blog</a></li>
                    <li className="py-1"> <a href="">Contact</a></li>
                </ul>
            </li>
            <li>
                <h2 className="text-lg text-gray-300 py-2">Links</h2>
                <ul>
                    <li className="py-1"> <a href="">event</a></li>
                    <li className="py-1"> <a href="">notice</a></li>
                    <li className="py-1"> <a href="">research</a></li>
                    <li className="py-1"> <a href="">scholarship</a></li>
                    <li className="py-1"> <a href="">teacher</a></li>
                </ul>
            </li>
            <li>
                <h2 className="text-lg text-gray-300 py-2">Courses</h2>
                <ul>
                    <li className="py-1"> <a href="">Algorithm</a></li>
                    <li className="py-1"> <a href="">Artificial Intelligence</a></li>
                    <li className="py-1"> <a href="">JavaScript</a></li>
                    <li className="py-1"> <a href="">Mathematics</a></li>
                    <li className="py-1"> <a href="">Photography</a></li>
                </ul>
            </li>                
        </ul>
    </footer>
    <div className="container px-10 py-4 bg-[#001a33]">
        <div className="flex justify-between max-w-7xl mx-auto">
            <p style={{ color: '#ededf1' }}>Copyright © 2025</p>
            <ul className="flex justify-around ml-auto gap-7">
                <li><a href="" style={{ color: '#ffc107' }} aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i><span className="sr-only">Facebook</span></a></li>
                <li><a href="" style={{ color: '#ffc107' }} aria-label="Twitter"><i className="fa-brands fa-twitter"></i><span className="sr-only">Twitter</span></a></li>
                <li><a href="" style={{ color: '#ffc107' }} aria-label="Instagram"><i className="fa-brands fa-instagram"></i><span className="sr-only">Instagram</span></a></li>
                <li><a href="" style={{ color: '#ffc107' }} aria-label="GitHub"><i className="fa-brands fa-github-alt"></i><span className="sr-only">GitHub</span></a></li>
                <li><a href="" style={{ color: '#ffc107' }} aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in"></i><span className="sr-only">LinkedIn</span></a></li>
            </ul>
        </div>
    </div>
    </>  
    )
}
