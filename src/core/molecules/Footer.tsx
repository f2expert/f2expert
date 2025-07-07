
export default function Footer() {
    return (
        <>
        <footer className="container px-10 py-8 bg-[#012f5c] text-white text-sm">        
        <ul className="flex justify-between max-w-7xl mx-auto gap-3">
            <li>
                <img src="assets/f2expert.jpg" alt="F2Expert Training Center" />
                <p>D1/450, Gali No.3, Ashok Nagar, Shahdara, Delhi-93</p>
                <a className="py-5" href="">info@f2expert.com</a>
                <p>+919990012545</p>
            </li>
            <li>
                <h2 className="text-lg text-gray-300">Company</h2>
                <ul>
                    <li> <a href="">About</a></li>
                    <li> <a href="">course</a></li>
                    <li> <a href="">blog</a></li>
                    <li> <a href="">Contact</a></li>
                </ul>
            </li>
            <li>
                <h2 className="text-lg text-gray-300">Links</h2>
                <ul>
                    <li> <a href="">event</a></li>
                    <li> <a href="">notice</a></li>
                    <li> <a href="">research</a></li>
                    <li> <a href="">scholarship</a></li>
                    <li> <a href="">teacher</a></li>
                </ul>
            </li>
            <li>
                <h2 className="text-lg text-gray-300">Courses</h2>
                <ul>
                    <li> <a href="">Algorithm</a></li>
                    <li> <a href="">Artificial Intelligence</a></li>
                    <li> <a href="">JavaScript</a></li>
                    <li> <a href="">Mathematics</a></li>
                    <li> <a href="">Photography</a></li>
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
