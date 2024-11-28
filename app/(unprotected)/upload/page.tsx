import { Suspense } from "react";
import UploadContent from "./upload-content";

export default function UploadPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UploadContent />
    </Suspense>
  );
}
