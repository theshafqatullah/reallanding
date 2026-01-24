"use client";

import React, { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { kycService, KYC_DOCUMENT_TYPES, type KycDocumentType } from "@/services/kyc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useDropzone } from "react-dropzone";
import {
    ArrowLeft,
    Upload,
    FileText,
    X,
    CheckCircle2,
    AlertCircle,
    Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'application/pdf': ['.pdf'],
};

export default function KycUploadPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    const preselectedType = searchParams.get('type') as KycDocumentType | null;

    const [documentType, setDocumentType] = useState<KycDocumentType | "">(preselectedType || "");
    const [documentNumber, setDocumentNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [notes, setNotes] = useState("");
    const [isPrimary, setIsPrimary] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile) {
            if (selectedFile.size > MAX_FILE_SIZE) {
                setError("File size must be less than 10MB");
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ACCEPTED_FILE_TYPES,
        maxFiles: 1,
        maxSize: MAX_FILE_SIZE,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.$id) {
            setError("You must be logged in to submit documents");
            return;
        }

        if (!documentType) {
            setError("Please select a document type");
            return;
        }

        if (!file) {
            setError("Please upload a document file");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            // Upload file first
            const fileId = await kycService.uploadFile(file);

            // Create KYC document record
            await kycService.createDocument({
                user_id: user.$id,
                document_type: documentType,
                document_number: documentNumber || undefined,
                document_file_id: fileId,
                expiry_date: expiryDate || undefined,
                notes: notes || undefined,
                is_primary: isPrimary,
            });

            setSuccess(true);

            // Redirect after short delay
            setTimeout(() => {
                router.push("/kyc");
            }, 2000);
        } catch (err) {
            console.error("Failed to submit document:", err);
            setError("Failed to submit document. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedDocType = KYC_DOCUMENT_TYPES.find(t => t.value === documentType);

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="p-4 bg-green-100 rounded-full mb-4">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Document Submitted!</h2>
                <p className="text-muted-foreground mb-4">
                    Your document has been submitted for verification. We&apos;ll review it shortly.
                </p>
                <Button asChild>
                    <Link href="/kyc">Back to KYC Dashboard</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/kyc">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Upload Document</h1>
                    <p className="text-muted-foreground">
                        Submit a verification document
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Document Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Document Information</CardTitle>
                            <CardDescription>
                                Select the document type and provide details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="documentType">Document Type *</Label>
                                <Select
                                    value={documentType}
                                    onValueChange={(value) => setDocumentType(value as KycDocumentType)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select document type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {KYC_DOCUMENT_TYPES.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {selectedDocType && (
                                    <p className="text-sm text-muted-foreground">
                                        {selectedDocType.description}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="documentNumber">Document Number (Optional)</Label>
                                <Input
                                    id="documentNumber"
                                    value={documentNumber}
                                    onChange={(e) => setDocumentNumber(e.target.value)}
                                    placeholder="e.g., License number, ID number"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                                <Input
                                    id="expiryDate"
                                    type="date"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                                <Textarea
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Any additional information about this document"
                                    rows={3}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isPrimary"
                                    checked={isPrimary}
                                    onCheckedChange={(checked) => setIsPrimary(checked as boolean)}
                                />
                                <Label htmlFor="isPrimary" className="text-sm font-normal">
                                    Set as primary document for this type
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* File Upload */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload File</CardTitle>
                            <CardDescription>
                                Upload a clear image or PDF of your document
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div
                                {...getRootProps()}
                                className={`
                                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                                    transition-colors
                                    ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}
                                    ${file ? "border-green-500 bg-green-50" : ""}
                                `}
                            >
                                <input {...getInputProps()} />
                                {file ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-center gap-2">
                                            {file.type.includes("image") ? (
                                                <ImageIcon className="h-8 w-8 text-green-600" />
                                            ) : (
                                                <FileText className="h-8 w-8 text-green-600" />
                                            )}
                                        </div>
                                        <p className="font-medium text-green-700">{file.name}</p>
                                        <p className="text-sm text-green-600">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFile(null);
                                            }}
                                        >
                                            <X className="h-4 w-4 mr-1" />
                                            Remove
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                                        <p className="font-medium">
                                            {isDragActive ? "Drop the file here" : "Drag & drop or click to upload"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Supports JPG, PNG, PDF up to 10MB
                                        </p>
                                    </div>
                                )}
                            </div>

                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    <ul className="list-disc list-inside text-sm space-y-1">
                                        <li>Ensure the document is clearly visible and readable</li>
                                        <li>All corners of the document should be visible</li>
                                        <li>Avoid glare or shadows on the document</li>
                                        <li>File size should not exceed 10MB</li>
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                </div>

                {error && (
                    <Alert variant="destructive" className="mt-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="flex items-center justify-end gap-4 mt-6">
                    <Button variant="outline" asChild>
                        <Link href="/kyc">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isSubmitting || !documentType || !file}>
                        {isSubmitting ? (
                            <>
                                <Spinner className="h-4 w-4 mr-2" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Upload className="h-4 w-4 mr-2" />
                                Submit Document
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
