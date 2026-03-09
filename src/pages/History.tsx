import {ArrowLeft} from "lucide-react";
import {useNavigate} from "react-router";

export default function History() {
    const navigate = useNavigate();


    return (
        <div className="size-full bg-white overflow-auto">
            <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
                <div className="flex items-center gap-4 px-6 py-4">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 active:opacity-50 transition-opacity">
                        <ArrowLeft className="size-5"/>
                    </button>
                    <h1 className="text-sm font-normal tracking-wide">HISTORIE</h1>
                </div>
            </div>
        </div>
    )
}