import { Link } from "react-router-dom";

export default function HeaderPatternComponent(props) {
    return (
        <div className="bg-base-100 shadow-sm w-full">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                <div className="flex-1">
                    <span className="btn btn-ghost text-xl">KauanTech</span>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        <Link to={props.caminho} className="btn btn-error text-md sm:text-lg md:text-xl lg:2xl whitespace-nowrap rounded-lg">Voltar</Link>
                    </ul>
                </div>
            </div>
        </div>
    );
}