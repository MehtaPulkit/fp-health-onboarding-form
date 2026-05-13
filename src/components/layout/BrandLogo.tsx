import { clsx } from "clsx";
import logoSrc from "../../assets/images/logo.png";

type BrandLogoProps = {
  className?: string;
  loading?: "eager" | "lazy";
};

export function BrandLogo({ className, loading = "eager" }: BrandLogoProps) {
  return (
    <img
      src={logoSrc}
      alt="Fitness Passport"
      width={120}
      height={86}
      loading={loading}
      decoding="async"
      className={clsx("h-12 w-auto object-contain", className)}
    />
  );
}
