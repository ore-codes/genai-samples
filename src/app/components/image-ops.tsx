'use client';

import {ChangeEvent, useCallback, useState} from "react";

type IdentifiedObject = {
    label: string;
    score: number;
    box: {
        xmin: number;
        ymin: number;
        xmax: number;
        ymax: number;
    };
}

export default function ImageOps() {
    const [theFile, setTheFile] = useState<File>();
    const [imagePreview, setImagePreview] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const [apiResponse, setApiResponse] = useState<IdentifiedObject[]>([]);
    const [toShow, setToShow] = useState<IdentifiedObject>();
    const [imageDimensions, setImageDimensions] = useState<{width: number, height: number}>({width: 800, height: 600});

    const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0];
        if (!file) return;
        const blobUrl = URL.createObjectURL(file);
        setTheFile(file);
        setImagePreview(blobUrl);
    }, []);

    const identifyThings = useCallback(async () => {
        if (!theFile) return;
        setIsLoading(true);

        const formData = new FormData();
        formData.set("theImage", theFile);

        const response = await fetch("/api/image-ops", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            console.log("File uploaded successfully");
            const theResponse = await response.json();
            console.log("API Response:", theResponse);
            setApiResponse(theResponse.body);
        } else {
            console.error("Failed to upload file:", response.status, response.statusText);
        }

        setIsLoading(false);
    }, [theFile]);

    function toggleThis(index: number) {
        const showThis = apiResponse[index];
        setToShow((prev: IdentifiedObject | undefined) => {
            if (prev === showThis) {
                return undefined;
            }
            return showThis || undefined;
        });
    }

    return (
        <details className="p-4 rounded border border-gray-300">
            <summary className="font-semibold text-xl cursor-pointer">Image ops:</summary>
            <input
                type="file"
                className="border p-2 rounded-sm border-gray-600"
                onChange={handleFileChange}
                accept="image/*"
            />
            <div className="w-80 h-80 relative placeholderdiv border">
                {imagePreview && (
                    <img
                        src={imagePreview}
                        className="object-contain absolute z-0 w-full h-full"
                        id="main-image"
                        onLoad={(e) => {
                            const img = e.currentTarget;
                            setImageDimensions({
                                width: img.naturalWidth,
                                height: img.naturalHeight
                            });
                        }}
                    />
                )}
                {toShow && (
                    <div
                        className="absolute border-2 border-red-500/20 bg-red-500/20 bg-opacity-20 z-20"
                        style={{
                            left: `${(toShow.box.xmin / imageDimensions.width) * 100}%`,
                            top: `${(toShow.box.ymin / imageDimensions.height) * 100}%`,
                            width: `${((toShow.box.xmax - toShow.box.xmin) / imageDimensions.width) * 100}%`,
                            height: `${((toShow.box.ymax - toShow.box.ymin) / imageDimensions.height) * 100}%`,
                        }}
                    >
                        <div className="absolute -top-6 left-0 bg-red-500 text-white px-1 text-xs rounded">
                            {toShow.label} ({(toShow.score * 100).toFixed(1)}%)
                        </div>
                    </div>
                )}
                {!toShow && apiResponse.map((obj, index) => (
                    <div
                        key={index}
                        className="absolute border-2 border-blue-500 bg-blue-500/10 bg-opacity-10 z-10"
                        style={{
                            left: `${(obj.box.xmin / imageDimensions.width) * 100}%`,
                            top: `${(obj.box.ymin / imageDimensions.height) * 100}%`,
                            width: `${((obj.box.xmax - obj.box.xmin) / imageDimensions.width) * 100}%`,
                            height: `${((obj.box.ymax - obj.box.ymin) / imageDimensions.height) * 100}%`,
                        }}
                    >
                        <div className="absolute -top-6 left-0 bg-blue-500 text-white px-1 text-xs rounded">
                            {obj.label} ({(obj.score * 100).toFixed(1)}%)
                        </div>
                    </div>
                ))}
            </div>
            {theFile && (
                <button
                    className="bg-gray-700 px-4 py-2 rounded text-white disabled:cursor-not-allowed disabled:bg-gray-900 transition-colors"
                    onClick={identifyThings}
                    disabled={isLoading}
                >
                    {isLoading ? "loading..." : "Go!"}
                </button>
            )}
            {apiResponse.length > 0 && (
                <div className="mt-12">
                    <div className="mb-4">Identified objects:</div>
                    <div className="flex flex-wrap gap-2">
                        {apiResponse.map((e, index) => (
                            <div key={index}>
                                <button
                                    className={`px-4 py-1 rounded-md transition-colors ${
                                        toShow === e
                                            ? 'bg-red-500 text-white'
                                            : 'bg-gray-700 text-white hover:bg-gray-600'
                                    }`}
                                    onClick={() => toggleThis(index)}
                                >
                                    {e.label} ({(e.score * 100).toFixed(1)}%)
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                        Click on an object label to highlight it, or click again to show all objects.
                    </div>
                </div>
            )}
        </details>
    );
}