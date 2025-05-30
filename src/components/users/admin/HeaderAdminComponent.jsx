import { Link } from "react-router-dom";

export default function HeaderAdminComponent(props) {
    return (
        <div className="navbar bg-base-100 shadow-sm w-full">
            <div className="flex-1">
                <span className="btn btn-ghost text-xl">KauanTech</span>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <Link to={props.caminho} className="btn btn-error text-md sm:text-lg md:text-xl lg:2xl whitespace-nowrap rounded-lg">Voltar</Link>
                </ul>
            </div>
        </div>
    );
}