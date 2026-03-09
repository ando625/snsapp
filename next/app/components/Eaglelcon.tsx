interface EagleIconProps{
    className?: string;
    isDefaultAvatar?: boolean;
}

export default function EagleIcon({ className = "w-10 h-10", isDefaultAvatar = false }: EagleIconProps) {
    return (
        <img
            src="eagle.jpg"
            alt="Eagle Logo"
            //  `${className}` と書くことで、外からの注文をそのまま反映させる
            className={`${className} object-cover rounded-full ${
                isDefaultAvatar ? "opacity-40 grayscale" : ""
            }`}
        />
    );
}