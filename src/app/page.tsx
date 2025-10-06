import Translate from "@/app/components/translate";
import Chat from "@/app/components/chat";
import PdfReader from "@/app/components/pdf-reader";
import ImageOps from "@/app/components/image-ops";
import Transcribe from "@/app/components/transcribe";
import Imagine from "@/app/components/imagine";
import Voice from "@/app/components/voice";

export default function Home() {

  return (
    <div className="container mx-auto p-4 space-y-4">
        <h1>Generative AI samples</h1>
        <Translate/>
        <Transcribe />
        <Voice/>
        <Chat/>
        <PdfReader/>
        <ImageOps/>
        <Imagine/>
    </div>
  );
}
