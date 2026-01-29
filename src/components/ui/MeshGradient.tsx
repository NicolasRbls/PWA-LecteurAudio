export const MeshGradient = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
            <div className="absolute top-[-20%] left-[-20%] w-[70vw] h-[70vw] bg-purple-900/30 rounded-full blur-[120px] mix-blend-screen animate-blob" />
            <div className="absolute top-[-10%] right-[-20%] w-[60vw] h-[60vw] bg-indigo-900/30 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
            <div className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] bg-blue-900/30 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-4000" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
        </div>
    );
};
