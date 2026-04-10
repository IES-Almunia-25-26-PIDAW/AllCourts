import { useEffect } from "react";
import { useRouter } from "next/router";

export default function CourtsIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/courts/court");
  }, [router]);

  return null;
}
