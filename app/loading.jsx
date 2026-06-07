import AetherLogo from "@/components/ui/AetherLogo"

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="animate-pulse">
        <AetherLogo size={64} />
      </div>
    </div>
  );
}
