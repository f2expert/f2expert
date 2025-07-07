import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <div className='w-52 bg-slate-400'>
            <ul>
                <li><Link to="/dashboard/html">HTML</Link></li>
                <li><Link to="/dashboard/CSS">CSS</Link></li>
                <li><Link to="/dashboard/js">Java Script</Link></li>
                <li><Link to="/dashboard/React">React</Link></li>
                <li><Link to="/dashboard/Vue">Vue</Link></li>
                <li><Link to="/dashboard/Next">Next</Link></li>
                <li><Link to="/dashboard/Node">Node</Link></li>
                <li><Link to="/dashboard/MongoDB">MongoDB</Link></li>
            </ul>
        </div>
    )
}
